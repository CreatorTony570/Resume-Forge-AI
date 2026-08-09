/* ============================================================
   ResumeForge AI — Client-Side Security Module
   ============================================================
   - Input sanitization (XSS prevention)
   - API key masking & secure handling
   - Content Security Policy helpers
   - Data integrity checks
   - Safe DOM injection
   ============================================================ */

window.RF = window.RF || {}; var RF = window.RF;

/* ---------- HTML Sanitization ---------- */
RF.Security = {

  /** Escape HTML entities to prevent XSS */
  escapeHTML: function(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /** Strip all HTML tags */
  stripTags: function(str) {
    if (!str) return '';
    return String(str).replace(/<[^>]*>/g, '');
  },

  /** Sanitize a string for safe DOM text insertion */
  sanitizeText: function(str) {
    return RF.Security.stripTags(RF.Security.escapeHTML(str));
  },

  /** Safely set textContent of an element */
  safeSetText: function(el, text) {
    if (el) el.textContent = RF.Security.sanitizeText(text);
  },

  /** Validate email format */
  isValidEmail: function(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  /** Validate URL format */
  isValidURL: function(url) {
    try { new URL(url); return true; } catch(e) { return false; }
  },

  /* ---------- API Key Security ---------- */

  /** Mask an API key for display: shows first 4 and last 4 chars */
  maskKey: function(key) {
    if (!key || key.length < 8) return '••••••••';
    return key.slice(0,4) + '••••••••••••' + key.slice(-4);
  },

  /** Validate API key format (basic structural check) */
  isValidAPIKey: function(key, provider) {
    if (!key || typeof key !== 'string') return false;
    key = key.trim();
    if (key.length < 10) return false;
    // Basic format checks per provider
    switch(provider) {
      case 'openai':      return key.startsWith('sk-') && key.length > 40;
      case 'anthropic':   return key.startsWith('sk-ant-') && key.length > 30;
      case 'gemini':      return key.length > 30;  // Google keys vary
      case 'openrouter':  return key.startsWith('sk-or-') && key.length > 30;
      case 'groq':        return key.startsWith('gsk_') && key.length > 30;
      default:            return key.length >= 10;
    }
  },

  /** Securely store API key in localStorage with basic obfuscation */
  secureStore: function(providerKey, apiKey) {
    if (!apiKey) return;
    // Store with base64 encoding (not encryption — just avoids plaintext in storage)
    try {
      var encoded = btoa(unescape(encodeURIComponent(apiKey)));
      if (!RF.State.providers[providerKey]) RF.State.providers[providerKey] = {};
      RF.State.providers[providerKey].apiKey = apiKey;  // runtime
      RF.State.providers[providerKey]._encoded = encoded; // persisted
    } catch(e) {
      // Fallback: store raw (better than losing the key)
      RF.State.providers[providerKey] = RF.State.providers[providerKey] || {};
      RF.State.providers[providerKey].apiKey = apiKey;
    }
  },

  /** Wipe API key completely from memory and storage */
  secureWipe: function(providerKey) {
    if (RF.State.providers[providerKey]) {
      delete RF.State.providers[providerKey].apiKey;
      delete RF.State.providers[providerKey]._encoded;
    }
  },

  /* ---------- Log Sanitization ---------- */

  /** Strip sensitive data from log entries before storage */
  sanitizeLogEntry: function(entry) {
    var clean = Object.assign({}, entry);
    delete clean.apiKey;
    delete clean.requestBody;
    delete clean.responseBody;
    if (clean.error && clean.error.length > 200) {
      clean.error = clean.error.slice(0,200) + '… [truncated]';
    }
    return clean;
  },

  /* ---------- Integrity ---------- */

  /** Check localStorage integrity on load */
  verifyStorage: function() {
    var keys = ['rf_resumes','rf_versions','rf_jobs','rf_providers','rf_settings','rf_usage'];
    var ok = true;
    keys.forEach(function(k) {
      try {
        var raw = localStorage.getItem(k);
        if (raw) JSON.parse(raw);
      } catch(e) {
        console.warn('[Security] Corrupted localStorage key:', k);
        localStorage.removeItem(k);
        ok = false;
      }
    });
    return ok;
  },

  /** Generate a session fingerprint (non-identifying) */
  sessionFingerprint: function() {
    var nav = window.navigator;
    var screen = window.screen;
    var data = [
      nav.userAgent, nav.language, screen.colorDepth,
      screen.width + 'x' + screen.height, new Date().getTimezoneOffset()
    ].join('|');
    // Simple hash
    var hash = 0;
    for (var i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash |= 0;
    }
    return 'rf_' + Math.abs(hash).toString(36);
  },

  /* ---------- CSP / Headers ---------- */

  /** Get recommended CSP policy string */
  getCSPPolicy: function() {
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.openai.com https://api.anthropic.com https://generativelanguage.googleapis.com https://openrouter.ai https://api.groq.com https:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'"
    ].join('; ');
  }
};
