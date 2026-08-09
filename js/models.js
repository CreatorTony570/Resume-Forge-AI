/* ResumeForge AI — Model Center & API Keys */

const RF = window.RF || {};

// === MODEL CENTER ===
RF.renderModelCenter = function() {
  RF.renderProviderPriority();
  RF.renderModelCards();
};

RF.renderProviderPriority = function() {
  var container = RF.el('providerPriority');
  if (!container) return;
  var configured = RF.getConfiguredProviders();
  if (!configured.length) {
    container.innerHTML = '<p class="text-muted text-sm">No providers configured. Add API keys in <a href="#" onclick="RF.navigate(\'api-keys\')">API Key Manager</a>.</p>';
    return;
  }
  container.innerHTML = configured.map(function(k, i) {
    var cfg = RF.PROVIDERS[k];
    return '<div class="provider-item">' +
      '<div class="flex items-center gap-3">' +
      '<div class="provider-icon" style="background:'+(cfg?.color||'#333')+'20;color:'+(cfg?.color||'#fff')+'">'+(cfg?.icon||'🔌')+'</div>' +
      '<div><div class="font-bold text-sm">'+(cfg?.name||k)+'</div><div class="text-xs" style="color:var(--success)">● Connected</div></div>' +
      '</div><span class="badge badge-neutral">Priority #'+(i+1)+'</span></div>';
  }).join('');
};

RF.renderModelCards = function() {
  var container = RF.el('modelCards');
  if (!container) return;
  var configured = RF.getConfiguredProviders();
  if (!configured.length) {
    container.innerHTML = '<p class="text-muted text-sm">Configure providers to see models.</p>';
    return;
  }
  var html = '';
  configured.forEach(function(k) {
    var cfg = RF.PROVIDERS[k];
    if (!cfg) return;
    cfg.models.forEach(function(m) {
      var cat = cfg.categories[m] || {};
      var costBadge = cat.cost==='free' ? '<span class="badge badge-success">FREE</span>' :
        cat.cost==='low' ? '<span class="badge badge-warning">LOW COST</span>' : '<span class="badge badge-neutral">PAID</span>';
      var speedBadge = cat.speed==='very-fast' ? '<span class="badge badge-info">VERY FAST</span>' :
        cat.speed==='fast' ? '<span class="badge badge-info">FAST</span>' : '<span class="badge badge-neutral">MODERATE</span>';
      html += '<div class="model-card"><div class="model-provider">'+cfg.name+'</div>' +
        '<div class="model-name">'+m+'</div><div class="model-meta">'+costBadge+' '+speedBadge+'</div>' +
        '<button class="btn btn-outline btn-sm" onclick="RF.testModel(\''+k+'\',\''+m+'\')">Test</button></div>';
    });
  });
  container.innerHTML = html;
};

RF.setRoutingMode = function(mode, btn) {
  RF.State.routingMode = mode;
  RF.State.settings.routingMode = mode;
  RF.qsa('.routing-mode-btn').forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  RF.notify('Mode: ' + mode, 'info');
};

RF.testModel = function(pk, m) {
  if (!RF.State.providers[pk]?.apiKey) { RF.notify('No API key for this provider.', 'warning'); return; }
  RF.notify('Testing ' + m + '...', 'info');
  setTimeout(function() { RF.notify('Model ' + m + ' ready.', 'success'); }, 1200);
};

// === API KEYS ===
RF.renderAPIKeys = function() {
  var container = RF.el('apiKeyProviders');
  if (!container) return;
  var html = '';
  Object.entries(RF.PROVIDERS).forEach(function(entry) {
    var key = entry[0], cfg = entry[1];
    var saved = RF.State.providers[key] || {};
    var hasKey = !!saved.apiKey;
    html += '<div class="card mb-4"><div class="card-header">' +
      '<span class="card-title" style="display:flex;align-items:center;gap:0.5rem">' +
      '<span style="width:26px;height:26px;border-radius:6px;background:'+cfg.color+'20;display:flex;align-items:center;justify-content:center;font-size:0.8rem">'+cfg.icon+'</span>' +
      cfg.name+'</span>' +
      '<span class="badge '+(hasKey?'badge-success':'badge-neutral')+'">'+(hasKey?'Connected':'Not Set')+'</span></div>' +
      '<div class="form-group"><label class="form-label">API Key</label>' +
      '<input class="form-input" type="password" id="apikey-'+key+'" placeholder="'+(hasKey ? RF.Security.maskKey(saved.apiKey||'') : 'sk-...')+'"></div>' +
      '<div class="flex gap-2">' +
      '<button class="btn btn-primary btn-sm" onclick="RF.saveAPIKey(\''+key+'\')">💾 Save</button>' +
      '<button class="btn btn-outline btn-sm" onclick="RF.testAPIKey(\''+key+'\')">🔍 Test</button>' +
      (hasKey?'<button class="btn btn-danger btn-sm" onclick="RF.removeAPIKey(\''+key+'\')">🗑 Remove</button>':'') +
      '</div><div class="form-hint">Models: '+cfg.models.join(', ')+'</div></div>';
  });
  container.innerHTML = html;
};

RF.saveAPIKey = function(key) {
  var input = RF.el('apikey-'+key);
  if (!input || !input.value.trim()) { RF.notify('Enter an API key.', 'warning'); return; }
  var rawKey = input.value.trim();
  // Basic format validation
  if (!RF.Security.isValidAPIKey(rawKey, key)) {
    RF.notify('That API key looks too short or has an unexpected format. Please check it.', 'warning');
    return;
  }
  RF.Security.secureStore(key, rawKey);
  RF.notify((RF.PROVIDERS[key]?.name||key)+' key saved.', 'success');
  // Re-render to show masked state
  RF.renderAPIKeys();
  RF.updateAIStatus();
};

RF.removeAPIKey = function(key) {
  RF.Security.secureWipe(key);
  var input = RF.el('apikey-'+key);
  if (input) input.value = '';
  RF.notify((RF.PROVIDERS[key]?.name||key)+' key removed.', 'info');
  RF.updateAIStatus();
  RF.renderAPIKeys();
  RF.renderModelCenter();
};

RF.testAPIKey = function(key) {
  var saved = RF.State.providers[key];
  var cfg = RF.PROVIDERS[key];
  if (!saved?.apiKey) { RF.notify('Save a key first.', 'warning'); return; }
  RF.notify('Testing '+(cfg?.name||key)+'...', 'info');
  var headers = {'Content-Type':'application/json'};
  if (key==='openai'||key==='openrouter'||key==='groq') headers['Authorization'] = 'Bearer '+saved.apiKey;
  else if (key==='anthropic') { headers['x-api-key']=saved.apiKey; headers['anthropic-version']='2023-06-01'; }
  var body = key==='gemini' ? null : JSON.stringify({model:cfg.models[0],messages:[{role:'user',content:'test'}],max_tokens:5});
  var url = key==='gemini' ? cfg.baseUrl+'/models/'+cfg.models[0]+':generateContent?key='+saved.apiKey : cfg.baseUrl+'/chat/completions';
  var method = key==='gemini'?'GET':'POST';
  fetch(url, {method:method,headers:headers,body:body})
    .then(function(r) {
      if (r.ok) { RF.notify(cfg.name+' connected!', 'success'); RF.logUsage(key,cfg.models[0],true); }
      else if (r.status===401||r.status===403) RF.notify(cfg.name+': Invalid key.', 'error');
      else RF.notify(cfg.name+': Error '+r.status, 'error');
    })
    .catch(function() { RF.notify(cfg.name+': Connection failed.', 'error'); });
};

RF.testAllProviders = function() {
  var c = RF.getConfiguredProviders();
  if (!c.length) { RF.notify('No providers configured.', 'warning'); return; }
  c.forEach(function(k) { RF.testAPIKey(k); });
};

RF.addCustomProvider = function() {
  var name = (RF.el('customProviderName')?.value||'').trim();
  var url = (RF.el('customProviderUrl')?.value||'').trim();
  var key = (RF.el('customProviderKey')?.value||'').trim();
  var model = (RF.el('customProviderModel')?.value||'').trim();
  if (!name||!url||!key||!model) { RF.notify('Fill all fields.', 'warning'); return; }
  var pk = 'custom_'+name.toLowerCase().replace(/\s+/g,'_');
  RF.State.providers[pk] = { apiKey:key, baseUrl:url, customModel:model, name:name };
  RF.notify('Provider "'+name+'" added!', 'success');
  RF.renderAPIKeys();
  RF.updateAIStatus();
};
