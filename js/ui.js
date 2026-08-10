/* ResumeForge AI — UI Utilities v6 */
window.RF = window.RF || {}; var RF = window.RF;

RF.notify = function(msg, type) {
  type = type || 'info';
  var el = document.getElementById('notification');
  if (!el) return;
  el.textContent = msg;
  el.className = 'notification ' + type + ' show';
  clearTimeout(el._tid);
  el._tid = setTimeout(function() { el.classList.remove('show'); }, 3800);
};

RF.showModal = function(title, msg, actions) {
  var mc = document.getElementById('modalContent');
  var mo = document.getElementById('modalOverlay');
  if (!mc || !mo) return;
  mc.innerHTML = '<div class="modal-title">' + title + '</div>' +
    '<p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:1.25rem;line-height:1.6">' + msg + '</p>' +
    '<div class="flex gap-3" style="justify-content:flex-end">' +
    (actions || []).map(function(a, i) {
      return '<button class="btn ' + (a.cls || 'btn-glass') + ' btn-sm" id="modalAct' + i + '">' + a.text + '</button>';
    }).join('') + '</div>';
  mo.classList.add('active');
  if (actions) actions.forEach(function(a, i) {
    var btn = document.getElementById('modalAct' + i);
    if (btn && a.action) btn.addEventListener('click', function() { a.action(); RF.closeModal(); });
  });
};

RF.closeModal = function() {
  var mo = document.getElementById('modalOverlay');
  if (mo) mo.classList.remove('active');
};

RF.renderEmptyState = function(title, desc, actions) {
  var html = '<div class="empty-state"><div class="empty-state-icon">📋</div>' +
    '<div class="empty-state-title">' + title + '</div>' +
    '<div class="empty-state-desc">' + desc + '</div>';
  if (actions) html += '<div class="flex gap-3 justify-center">' +
    actions.map(function(a) { return '<button class="btn ' + (a.cls || 'btn-glass') + ' btn-sm" onclick="' + a.onclick + '">' + a.text + '</button>'; }).join('') + '</div>';
  html += '</div>';
  return html;
};

RF.el  = function(id)       { return document.getElementById(id); };
RF.qs  = function(sel, ctx) { return (ctx || document).querySelector(sel); };
RF.qsa = function(sel, ctx) { return (ctx || document).querySelectorAll(sel); };

RF.drawScoreRing = function(canvasId, valueId, score) {
  var canvas = RF.el(canvasId);
  if (!canvas) return;
  var container = canvas.parentElement;
  var size = Math.max(container.offsetWidth, 80);
  canvas.width = size * 2; canvas.height = size * 2;
  canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
  var ctx = canvas.getContext('2d');
  var cx = canvas.width / 2, cy = canvas.height / 2, r = Math.min(cx, cy) - 14;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = '#2A2D35'; ctx.lineWidth = 12; ctx.stroke();
  if (score > 0) {
    var angle = (score / 100) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + angle);
    var grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    var color = score >= 80 ? ['#10B981','#34D399'] : score >= 60 ? ['#F59E0B','#FCD34D'] : ['#EF4444','#F87171'];
    grad.addColorStop(0, color[0]); grad.addColorStop(1, color[1]);
    ctx.strokeStyle = grad; ctx.lineWidth = 12;
    ctx.lineCap = 'round'; ctx.stroke();
  }
  var valEl = RF.el(valueId);
  if (valEl) valEl.textContent = score > 0 ? score : '--';
};

RF.updateAIStatus = function() {
  var dot  = RF.el('aiStatusDot');
  var text = RF.el('aiStatusText');
  if (!dot || !text) return;
  var configured = RF.getConfiguredProviders();
  if (!configured.length) {
    dot.className = 'ai-status-dot warn';
    text.textContent = 'AI: Not Configured';
    return;
  }
  dot.className = 'ai-status-dot ok';
  var cfg = RF.PROVIDERS[configured[0]];
  text.textContent = 'AI: ' + (cfg ? cfg.name : configured[0]) + ' ✓';
};

RF.logUsage = function(provider, model, ok, code, err, elapsed) {
  var entry = RF.Security.sanitizeLogEntry({
    timestamp: new Date().toISOString(),
    provider: provider, model: model,
    success: ok !== false,
    statusCode: code || (ok !== false ? 200 : 500),
    error: err || '',
    elapsed: elapsed || 0
  });
  RF.State.usageLog.push(entry);
  if (RF.State.usageLog.length > 200) RF.State.usageLog.shift();
};

/* ── Theme engine ── */
RF.applyTheme = function(t) {
  RF.State.settings.theme = t;
  document.documentElement.setAttribute('data-theme', t);
  if (t === 'light') {
    document.documentElement.style.setProperty('--obsidian',       '#F8F9FC');
    document.documentElement.style.setProperty('--deep-charcoal',  '#FFFFFF');
    document.documentElement.style.setProperty('--charcoal',       '#F1F3F7');
    document.documentElement.style.setProperty('--graphite',       '#E8EBF0');
    document.documentElement.style.setProperty('--light-graphite', '#DCE0E8');
    document.documentElement.style.setProperty('--border-subtle',  '#D1D5DB');
    document.documentElement.style.setProperty('--border-default', '#C5C9D3');
    document.documentElement.style.setProperty('--text-primary',   '#111827');
    document.documentElement.style.setProperty('--text-secondary', '#374151');
    document.documentElement.style.setProperty('--text-muted',     '#6B7280');
    document.documentElement.style.setProperty('--glass-bg',       'rgba(255,255,255,0.85)');
    document.documentElement.style.setProperty('--glass-border',   'rgba(0,0,0,0.07)');
    document.documentElement.style.setProperty('--surface',        '#FFFFFF');
  } else {
    document.documentElement.style.setProperty('--obsidian',       '#08090D');
    document.documentElement.style.setProperty('--deep-charcoal',  '#111318');
    document.documentElement.style.setProperty('--charcoal',       '#15181E');
    document.documentElement.style.setProperty('--graphite',       '#1A1D24');
    document.documentElement.style.setProperty('--light-graphite', '#22262E');
    document.documentElement.style.setProperty('--border-subtle',  '#2A2D35');
    document.documentElement.style.setProperty('--border-default', '#333640');
    document.documentElement.style.setProperty('--text-primary',   '#E5E7EB');
    document.documentElement.style.setProperty('--text-secondary', '#9CA3AF');
    document.documentElement.style.setProperty('--text-muted',     '#6B7280');
    document.documentElement.style.setProperty('--glass-bg',       'rgba(17,19,24,0.70)');
    document.documentElement.style.setProperty('--glass-border',   'rgba(255,255,255,0.06)');
    document.documentElement.style.setProperty('--surface',        '#1E2129');
  }
  RF.notify('Theme: ' + t, 'info');
};

/* ── Debounce utility ── */
RF.debounce = function(fn, delay) {
  var t; return function() { var a = arguments; clearTimeout(t); t = setTimeout(function(){ fn.apply(null,a); }, delay); };
};
