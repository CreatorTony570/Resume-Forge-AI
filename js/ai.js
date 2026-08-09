/* ============================================================
   ResumeForge AI — Real AI Provider Service
   Makes actual fetch() calls to configured providers.
   Falls back through configured providers on failure.
   ============================================================ */

const RF = window.RF || {};

/* ---------- Prompt Templates ---------- */
RF.Prompts = {
  summary: function(title, skills, experience) {
    return 'You are a professional resume writer. Write a 2-3 sentence professional summary for a '+(title||'professional')+'. '
      + 'Skills: '+(skills||'various')+'. Experience highlights: '+(experience||'relevant experience')+'. '
      + 'Be concise, truthful, and impactful. Do NOT invent any achievements, companies, or statistics. '
      + 'Output ONLY the summary text — no greetings, no explanations.';
  },
  improveBullets: function(bullets) {
    return 'You are an expert resume editor. Rewrite these resume bullet points to be achievement-focused using strong action verbs and metrics where already provided. '
      + 'NEVER invent numbers, percentages, or achievements that are not in the original text. '
      + 'Preserve all company names, job titles, dates, and technologies exactly as provided. '
      + 'Output ONLY the rewritten bullets, one per line, each starting with "•".\n\n' + bullets;
  },
  atsHelp: function() {
    return 'Explain the most common reasons for low ATS scores and provide actionable, specific advice to improve them. '
      + 'Focus on: keywords, section headings, formatting, measurable achievements. Be concise.';
  },
  skillsGap: function() {
    return 'Given a user asking about skill gaps, explain how to identify gaps between their resume and target job descriptions. '
      + 'Suggest strategies for addressing gaps honestly.';
  },
  interviewPrep: function() {
    return 'Provide key interview preparation advice covering: 1) System design, 2) Behavioral questions (STAR method), '
      + '3) Technical deep-dives, 4) Questions to ask the interviewer. Be structured and concise.';
  },
  general: function() {
    return 'You are CareerAI, a helpful career intelligence assistant. '
      + 'Help the user with resume writing, ATS optimization, job matching, interview preparation, or career planning. '
      + 'Be concise, actionable, and professional. Never invent credentials or achievements.';
  }
};

/* ---------- Choose the right system prompt ---------- */
RF.selectPrompt = function(userMessage) {
  var msg = userMessage.toLowerCase();
  if (msg.includes('summary'))             return RF.Prompts.summary();
  if (msg.includes('bullet')||msg.includes('improve')) return RF.Prompts.improveBullets('');
  if (msg.includes('ats')||msg.includes('score low'))   return RF.Prompts.atsHelp();
  if (msg.includes('skill')||msg.includes('gap'))       return RF.Prompts.skillsGap();
  if (msg.includes('interview')||msg.includes('prep'))  return RF.Prompts.interviewPrep();
  return RF.Prompts.general();
};

/* ---------- Real API Call to a Provider ---------- */
RF.callProvider = function(providerKey, userMessage, options) {
  options = options || {};
  var saved = RF.State.providers[providerKey];
  var cfg = RF.PROVIDERS[providerKey];
  if (!saved || !saved.apiKey || !cfg) {
    return Promise.resolve({ error: 'Provider not configured — no API key found for '+(cfg?cfg.name:providerKey) });
  }

  var model = options.model || cfg.models[0];
  var systemPrompt = options.systemPrompt || RF.selectPrompt(userMessage);
  var temperature = parseFloat(RF.State.settings.temperature) || 0.7;
  var maxTokens = options.maxTokens || 2048;

  // Build the request based on provider
  var url, headers, body;

  if (providerKey === 'gemini') {
    // Google Gemini uses a different API format
    url = cfg.baseUrl + '/models/' + model + ':generateContent?key=' + encodeURIComponent(saved.apiKey);
    headers = { 'Content-Type': 'application/json' };
    body = JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\nUser: ' + userMessage }] }
      ],
      generationConfig: { temperature: temperature, maxOutputTokens: maxTokens }
    });
  } else if (providerKey === 'anthropic') {
    // Anthropic uses the Messages API
    url = cfg.baseUrl + '/messages';
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': saved.apiKey,
      'anthropic-version': '2023-06-01'
    };
    body = JSON.stringify({
      model: model,
      max_tokens: maxTokens,
      temperature: temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    });
  } else {
    // OpenAI, OpenRouter, Groq, and all OpenAI-compatible providers
    url = cfg.baseUrl + '/chat/completions';
    headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + saved.apiKey
    };
    // OpenRouter needs extra headers
    if (providerKey === 'openrouter') {
      headers['HTTP-Referer'] = window.location.origin;
      headers['X-Title'] = 'ResumeForge AI';
    }
    body = JSON.stringify({
      model: model,
      temperature: temperature,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ]
    });
  }

  var method = (providerKey === 'gemini') ? 'POST' : 'POST';
  var startTime = Date.now();

  return fetch(url, { method: method, headers: headers, body: body })
    .then(function(response) {
      var elapsed = Date.now() - startTime;
      if (!response.ok) {
        return response.text().then(function(txt) {
          var errMsg = 'HTTP ' + response.status;
          if (response.status === 401 || response.status === 403) {
            errMsg = 'Invalid API key — please check your key for ' + cfg.name;
          } else if (response.status === 429) {
            errMsg = cfg.name + ' rate limit exceeded. Try again in a moment.';
          } else if (response.status >= 500) {
            errMsg = cfg.name + ' server error. The provider may be experiencing issues.';
          }
          RF.logUsage(providerKey, model, false, response.status, errMsg);
          throw new Error(errMsg);
        });
      }
      RF.logUsage(providerKey, model, true, response.status, null, elapsed);
      return response.json();
    })
    .then(function(data) {
      // Extract the text content based on provider format
      var content = '';
      if (providerKey === 'gemini') {
        content = (data.candidates && data.candidates[0] && data.candidates[0].content &&
                   data.candidates[0].content.parts && data.candidates[0].content.parts[0] &&
                   data.candidates[0].content.parts[0].text) || '';
      } else if (providerKey === 'anthropic') {
        content = (data.content && data.content[0] && data.content[0].text) || '';
      } else {
        content = (data.choices && data.choices[0] && data.choices[0].message &&
                   data.choices[0].message.content) || '';
      }

      if (!content) {
        throw new Error(cfg.name + ' returned an empty response.');
      }

      return {
        content: content.trim(),
        provider: cfg.name,
        model: model
      };
    });
};

/* ---------- Intelligent Routing with Fallback ---------- */
RF.callAI = function(userMessage, options) {
  options = options || {};
  var configured = RF.getConfiguredProviders();
  if (!configured.length) {
    return Promise.resolve({
      error: 'No AI provider configured. Go to Settings → API Key Manager to add one.',
      content: 'I need an AI provider to help with that. Please add an API key in the API Key Manager (sidebar → AI & Models → API Key Manager). It\'s free to get started with providers like Google Gemini or Groq.'
    });
  }

  // Try providers in order (they're already in priority order from the state)
  var errors = [];

  function tryProvider(index) {
    if (index >= configured.length) {
      return Promise.resolve({
        error: 'All ' + configured.length + ' configured AI provider(s) failed.',
        content: 'I tried all your configured AI providers but none responded. Errors: ' +
          errors.map(function(e, i) { return '#'+(i+1)+': '+e; }).join(' | ') +
          '. Please check your API keys in the API Key Manager.'
      });
    }

    var pk = configured[index];
    var cfg = RF.PROVIDERS[pk];

    return RF.callProvider(pk, userMessage, options)
      .then(function(result) {
        if (result && result.content && !result.error) return result;
        throw new Error(result.error || 'Unknown error');
      })
      .catch(function(err) {
        var msg = (cfg ? cfg.name : pk) + ': ' + (err.message || 'Failed');
        errors.push(msg);
        console.warn('[AI Fallback]', msg, '→ trying next provider');
        RF.notify && RF.notify('Primary AI unavailable. Switched to backup.', 'info');
        return tryProvider(index + 1);
      });
  }

  return tryProvider(0);
};
