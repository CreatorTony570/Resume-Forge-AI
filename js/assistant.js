/* ResumeForge AI — CareerAI Assistant, Command Palette & Usage v6 */
window.RF = window.RF || {}; var RF = window.RF;

RF._chatHistory = [];

RF.toggleAIPanel = function() { RF.el('aiPanel').classList.toggle('open'); };
RF.openAIPanel  = function() { RF.el('aiPanel').classList.add('open'); };

RF.sendAIMessage = function() {
  var input = RF.el('aiInput');
  var msg = input.value.trim();
  if (!msg) return;
  RF.appendAIMessage('user', msg);
  input.value = '';
  input.disabled = true;

  // Maintain rolling chat history (last 6 messages = 3 turns)
  RF._chatHistory.push({ role: 'user', content: msg });
  if (RF._chatHistory.length > 12) RF._chatHistory = RF._chatHistory.slice(-12);

  // Build rich context
  var ctx = 'Current app page: ' + (RF.PAGE_TITLES && RF.PAGE_TITLES[RF.currentPage] || RF.currentPage || 'Dashboard') + '.';
  if (RF.State.currentResumeText) ctx += '\nLoaded resume: ' + RF.State.currentResumeText.slice(0, 1200) + (RF.State.currentResumeText.length > 1200 ? '…[truncated]' : '');
  if (RF.State.resumes && RF.State.resumes.length) ctx += '\nUser has ' + RF.State.resumes.length + ' saved resume(s). Latest: "' + (RF.State.resumes[RF.State.resumes.length-1].name || 'Untitled') + '"';
  if (RF.State.jobs && RF.State.jobs.length) ctx += '\nUser has analyzed ' + RF.State.jobs.length + ' job descriptions.';

  // Build thinking message with animated dots
  var thinkDiv = document.createElement('div');
  thinkDiv.className = 'ai-chat-msg assistant';
  thinkDiv.innerHTML = '<span class="ai-spinner" style="display:inline-block;width:12px;height:12px;border:2px solid rgba(255,255,255,0.15);border-top-color:var(--gold);border-radius:50%;animation:spin 0.7s linear infinite;vertical-align:middle;margin-right:6px"></span><span style="color:var(--text-muted);font-size:0.8rem">CareerAI is thinking…</span>';
  RF.el('aiMessages').appendChild(thinkDiv);
  RF.el('aiMessages').scrollTop = RF.el('aiMessages').scrollHeight;

  // Include history in prompt for context continuity
  var historyContext = RF._chatHistory.length > 2
    ? '\n\nCONVERSATION HISTORY (last ' + Math.floor(RF._chatHistory.length/2) + ' turns):\n' +
      RF._chatHistory.slice(0,-1).map(function(m){ return m.role.toUpperCase() + ': ' + m.content.slice(0,300); }).join('\n')
    : '';

  RF.callAI(msg, { systemPrompt: RF.Prompts.general(ctx + historyContext), maxTokens: 2048 })
    .then(function(r) {
      var content = (r && r.content) ? r.content : (r && r.error ? r.error : 'No response received.');
      RF._chatHistory.push({ role: 'assistant', content: content });
      thinkDiv.innerHTML = (RF._md ? RF._md(content) : content.replace(/\n/g,'<br>'));
      if (r && r.provider) {
        var meta = document.createElement('div');
        meta.style.cssText = 'font-size:0.67rem;color:var(--text-muted);margin-top:0.5rem;padding-top:0.35rem;border-top:1px solid var(--border-subtle);opacity:0.8';
        meta.textContent = '✦ ' + r.provider + ' · ' + (r.model || 'auto');
        thinkDiv.appendChild(meta);
      }
      RF.el('aiMessages').scrollTop = RF.el('aiMessages').scrollHeight;
    })
    .catch(function() {
      thinkDiv.textContent = 'Connection error. Check your API keys in the API Key Manager.';
    })
    .finally(function() {
      input.disabled = false;
      input.focus();
    });
};

RF.sendAISuggestion = function(text) {
  RF.el('aiInput').value = text;
  RF.sendAIMessage();
};

RF.appendAIMessage = function(role, content) {
  var msgs = RF.el('aiMessages');
  var div = document.createElement('div');
  div.className = 'ai-chat-msg ' + role;
  if (role === 'user') {
    div.textContent = content;
  } else {
    div.innerHTML = RF._md ? RF._md(content) : content;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
};

RF.clearAIChat = function() {
  RF._chatHistory = [];
  RF.el('aiMessages').innerHTML = '<div class="ai-chat-msg assistant">Chat cleared. I\'m CareerAI — ask me anything about your resume, job search, interviews, or salary negotiation.</div>';
};

// === COMMAND PALETTE ===
RF.openCommandPalette = function() {
  RF.el('cmdOverlay').classList.add('active');
  RF.el('commandInput').value = '';
  RF.el('commandInput').focus();
  RF.renderCommands(RF.COMMANDS);
};

RF.closeCommandPalette = function() { RF.el('cmdOverlay').classList.remove('active'); };

RF.filterCommands = function() {
  var q = RF.el('commandInput').value.toLowerCase();
  RF.renderCommands(RF.COMMANDS.filter(function(c) { return c.name.toLowerCase().indexOf(q) >= 0; }));
};

RF.renderCommands = function(cmds) {
  RF.el('commandList').innerHTML = cmds.map(function(c, i) {
    return '<div class="cmd-item' + (i === 0 ? ' selected' : '') + '" onclick="RF.executeCmd(\'' + c.name + '\')">' +
      '<span style="font-size:1rem">' + c.icon + '</span><span>' + c.name + '</span>' +
      (c.shortcut ? '<span class="cmd-shortcut">' + c.shortcut + '</span>' : '') + '</div>';
  }).join('');
};

RF.executeCmd = function(name) {
  RF.closeCommandPalette();
  var cmd = RF.COMMANDS.find(function(c) { return c.name === name; });
  if (!cmd) return;
  if (cmd.page)             RF.navigate(cmd.page);
  if (cmd.action === 'openAI')  RF.openAIPanel();
  if (cmd.action === 'export')  RF.exportResume();
  if (cmd.action === 'save')    RF.saveResume();
};

RF.handleCommandKey = function(e) {
  if (e.key === 'Escape') { RF.closeCommandPalette(); return; }
  var items = RF.qsa('.cmd-item');
  var sel = RF.qs('.cmd-item.selected');
  var idx = Array.from(items).indexOf(sel);
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (sel) sel.classList.remove('selected');
    var next = items[Math.min(idx + 1, items.length - 1)];
    if (next) { next.classList.add('selected'); next.scrollIntoView({ block: 'nearest' }); }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (sel) sel.classList.remove('selected');
    var prev = items[Math.max(idx - 1, 0)];
    if (prev) { prev.classList.add('selected'); prev.scrollIntoView({ block: 'nearest' }); }
  } else if (e.key === 'Enter') {
    if (sel) sel.click();
  }
};

// === USAGE ===
RF.renderUsage = function() {
  var log = RF.State.usageLog;
  RF.el('usageTotalRequests').textContent = log.length;
  var successCount = log.filter(function(l) { return l.success; }).length;
  RF.el('usageSuccessRate').textContent = log.length ? Math.round(successCount / log.length * 100) + '%' : '--';
  RF.el('usageErrors').textContent = log.filter(function(l) { return !l.success; }).length;
  var withTime = log.filter(function(l){ return l.elapsed > 0; });
  var avgMs = withTime.length ? Math.round(withTime.reduce(function(s,l){ return s+l.elapsed; },0) / withTime.length) : null;
  RF.el('usageAvgTime').textContent = avgMs ? (avgMs > 1000 ? (avgMs/1000).toFixed(1)+'s' : avgMs+'ms') : '--';

  var lc = RF.el('usageLog');
  if (!log.length) { lc.innerHTML = '<p class="text-muted text-sm">Usage data appears here as you use the app.</p>'; return; }
  lc.innerHTML = log.slice(-30).reverse().map(function(l) {
    return '<div class="flex items-center justify-between p-2" style="border-bottom:1px solid var(--border-subtle);font-size:0.78rem">' +
      '<span class="text-secondary">' + (l.provider||'?') + ' / <span style="font-family:var(--font-mono);font-size:0.72rem">' + (l.model||'?') + '</span></span>' +
      '<span class="badge ' + (l.success ? 'badge-success' : 'badge-danger') + '">' + (l.success ? '✓ ' + l.statusCode : '✗ ' + l.statusCode) + '</span>' +
      '<span class="text-muted">' + (l.elapsed ? (l.elapsed > 1000 ? (l.elapsed/1000).toFixed(1)+'s' : l.elapsed+'ms') : '') + '</span>' +
      '<span class="text-muted">' + new Date(l.timestamp).toLocaleTimeString() + '</span></div>';
  }).join('');
};

// === SETTINGS ===
RF.clearAllData = function() {
  RF.showModal('Delete All Data?',
    'This permanently deletes all resumes, jobs, versions, conversations, and settings. This cannot be undone.',
    [
      { text: 'Cancel', cls: 'btn-glass' },
      {
        text: 'Delete Everything', cls: 'btn-danger', action: function() {
          RF.State.resumes = []; RF.State.versions = []; RF.State.jobs = [];
          RF.State.usageLog = []; RF._chatHistory = [];
          localStorage.clear();
          RF.notify('All data deleted.', 'success');
          RF.renderDashboard();
        }
      }
    ]);
};

RF.toggleReducedMotion = function(on) {
  RF.State.settings.reduceMotion = on;
  document.body.classList.toggle('reduced-motion', on);
};

RF.exportChat = function() {
  if (!RF._chatHistory.length) { RF.notify('No chat history to export.', 'warning'); return; }
  var text = RF._chatHistory.map(function(m){ return (m.role === 'user' ? 'You' : 'CareerAI') + ':\n' + m.content; }).join('\n\n---\n\n');
  var blob = new Blob([text], {type:'text/plain'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'careerai-chat-' + Date.now() + '.txt'; a.click();
  RF.notify('Chat exported!', 'success');
};
