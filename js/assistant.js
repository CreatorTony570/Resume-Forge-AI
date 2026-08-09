/* ResumeForge AI — CareerAI Assistant, Command Palette & Usage */

window.RF = window.RF || {}; var RF = window.RF;

// === AI ASSISTANT ===
RF.toggleAIPanel = function() {
  RF.el('aiPanel').classList.toggle('open');
};

RF.openAIPanel = function() {
  RF.el('aiPanel').classList.add('open');
};

RF.sendAIMessage = function() {
  var input = RF.el('aiInput');
  var msg = input.value.trim();
  if (!msg) return;
  RF.appendAIMessage('user', msg);
  input.value = '';
  RF.appendAIMessage('assistant', 'Thinking...');
  var msgs = RF.el('aiMessages');
  var thinkEl = msgs.lastElementChild;

  RF.callAI(msg).then(function(r) {
    // r.content has the AI response, r.error is set if all providers failed
    if (r.error && !r.content) {
      thinkEl.textContent = r.error;
    } else if (r.content) {
      thinkEl.textContent = r.content;
      // Show which provider was used
      if (r.provider) {
        thinkEl.textContent += '\n\n— ' + r.provider + ' / ' + (r.model || 'auto');
      }
    } else {
      thinkEl.textContent = 'Received an empty response. Please try again.';
    }
    msgs.scrollTop = msgs.scrollHeight;
  }).catch(function() {
    thinkEl.textContent = 'Connection error. Check that your API keys are valid in the API Key Manager.';
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
  div.textContent = content;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
};

RF.clearAIChat = function() {
  RF.el('aiMessages').innerHTML = '<div class="ai-chat-msg assistant">Chat cleared. How can I help you with your career?</div>';
};

// === COMMAND PALETTE ===
RF.openCommandPalette = function() {
  RF.el('cmdOverlay').classList.add('active');
  RF.el('commandInput').value = '';
  RF.el('commandInput').focus();
  RF.renderCommands(RF.COMMANDS);
};

RF.closeCommandPalette = function() {
  RF.el('cmdOverlay').classList.remove('active');
};

RF.filterCommands = function() {
  var q = RF.el('commandInput').value.toLowerCase();
  RF.renderCommands(RF.COMMANDS.filter(function(c) { return c.name.toLowerCase().indexOf(q) >= 0; }));
};

RF.renderCommands = function(cmds) {
  RF.el('commandList').innerHTML = cmds.map(function(c, i) {
    return '<div class="cmd-item'+(i===0?' selected':'')+'" onclick="RF.executeCmd(\''+c.name+'\')">' +
      '<span>'+c.icon+'</span> '+c.name +
      (c.shortcut?'<span class="cmd-shortcut">'+c.shortcut+'</span>':'')+'</div>';
  }).join('');
};

RF.executeCmd = function(name) {
  RF.closeCommandPalette();
  var cmd = RF.COMMANDS.find(function(c) { return c.name === name; });
  if (!cmd) return;
  if (cmd.page) RF.navigate(cmd.page);
  if (cmd.action==='openAI') RF.openAIPanel();
  if (cmd.action==='export') RF.exportResume();
  if (cmd.action==='save') RF.saveResume();
};

RF.handleCommandKey = function(e) {
  if (e.key==='Escape') RF.closeCommandPalette();
  if (e.key==='Enter') {
    var first = RF.qs('.cmd-item.selected');
    if (first) first.click();
  }
};

// === USAGE ===
RF.renderUsage = function() {
  var log = RF.State.usageLog;
  RF.el('usageTotalRequests').textContent = log.length;
  var successCount = log.filter(function(l) { return l.success; }).length;
  RF.el('usageSuccessRate').textContent = log.length ? Math.round(successCount/log.length*100)+'%' : '--';
  RF.el('usageErrors').textContent = log.filter(function(l) { return !l.success; }).length;
  RF.el('usageAvgTime').textContent = '~850ms';

  var lc = RF.el('usageLog');
  if (!log.length) {
    lc.innerHTML = '<p class="text-muted text-sm">Usage data appears here as you use the app.</p>';
    return;
  }
  lc.innerHTML = log.slice(-20).reverse().map(function(l) {
    return '<div class="flex items-center justify-between p-2" style="border-bottom:1px solid var(--border-subtle);font-size:0.78rem">' +
      '<span>'+l.provider+' / '+l.model+'</span>' +
      '<span class="badge '+(l.success?'badge-success':'badge-danger')+'">'+(l.success?'OK':'Error')+' '+l.statusCode+'</span>' +
      '<span class="text-muted">'+new Date(l.timestamp).toLocaleTimeString()+'</span></div>';
  }).join('');
};

// === SETTINGS ===
RF.clearAllData = function() {
  RF.showModal('Delete All Data?',
    'This permanently deletes all resumes, jobs, versions, conversations, and settings.',
    [
      {text:'Cancel', cls:'btn-glass'},
      {text:'Delete Everything', cls:'btn-danger', action:function() {
        RF.State.resumes = []; RF.State.versions = []; RF.State.jobs = [];
        RF.State.usageLog = [];
        localStorage.clear();
        RF.notify('All data deleted.', 'success');
        RF.renderDashboard();
      }}
    ]);
};

RF.toggleReducedMotion = function(on) {
  RF.State.settings.reduceMotion = on;
  if (on) document.body.classList.add('reduced-motion');
  else document.body.classList.remove('reduced-motion');
};

RF.applyTheme = function(t) {
  RF.State.settings.theme = t;
  RF.notify('Theme: '+t, 'info');
};
