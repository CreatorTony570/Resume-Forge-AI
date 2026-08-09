/* ResumeForge AI — UI Utilities */

window.RF = window.RF || {}; var RF = window.RF;

RF.notify = function(msg, type) {
  type = type || 'info';
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = msg;
  el.className = 'notification ' + type + ' show';
  clearTimeout(el._tid);
  el._tid = setTimeout(function() { el.classList.remove('show'); }, 3500);
};

RF.showModal = function(title, msg, actions) {
  var mc = document.getElementById('modalContent');
  var mo = document.getElementById('modalOverlay');
  if (!mc || !mo) return;
  mc.innerHTML = '<div class="modal-title">'+title+'</div>' +
    '<p style="color:var(--text-secondary);font-size:0.88rem;margin-bottom:1rem">'+msg+'</p>' +
    '<div class="flex gap-3 justify-between" style="justify-content:flex-end">' +
    (actions||[]).map(function(a,i) {
      return '<button class="btn '+ (a.cls||'btn-glass') +' btn-sm" id="modalAct'+i+'">'+a.text+'</button>';
    }).join('') + '</div>';
  mo.classList.add('active');
  if (actions) actions.forEach(function(a,i) {
    var btn = document.getElementById('modalAct'+i);
    if (btn && a.action) btn.addEventListener('click', function() { a.action(); RF.closeModal(); });
  });
};

RF.closeModal = function() {
  var mo = document.getElementById('modalOverlay');
  if (mo) mo.classList.remove('active');
};

RF.renderEmptyState = function(title, desc, actions) {
  var html = '<div class="empty-state"><div class="empty-state-icon">📋</div>' +
    '<div class="empty-state-title">'+title+'</div>' +
    '<div class="empty-state-desc">'+desc+'</div>';
  if (actions) html += '<div class="flex gap-3 justify-center">' +
    actions.map(function(a) { return '<button class="btn '+ (a.cls||'btn-glass') +' btn-sm" onclick="'+a.onclick+'">'+a.text+'</button>'; }).join('') + '</div>';
  html += '</div>';
  return html;
};

RF.el = function(id) { return document.getElementById(id); };
RF.qs = function(sel, ctx) { return (ctx||document).querySelector(sel); };
RF.qsa = function(sel, ctx) { return (ctx||document).querySelectorAll(sel); };

RF.drawScoreRing = function(canvasId, valueId, score) {
  var canvas = RF.el(canvasId);
  if (!canvas) return;
  var container = canvas.parentElement;
  var size = container.offsetWidth;
  canvas.width = size * 2; canvas.height = size * 2;
  canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
  var ctx = canvas.getContext('2d');
  var cx = canvas.width/2, cy = canvas.height/2, r = Math.min(cx,cy) - 12;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.strokeStyle = '#2A2D35'; ctx.lineWidth = 10; ctx.stroke();
  if (score > 0) {
    var angle = (score/100) * Math.PI * 2;
    ctx.beginPath(); ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + angle);
    var grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    grad.addColorStop(0, '#D6B36A'); grad.addColorStop(1, '#F0D89A');
    ctx.strokeStyle = grad; ctx.lineWidth = 10; ctx.stroke();
  }
  var valEl = RF.el(valueId);
  if (valEl) valEl.textContent = score > 0 ? score : '--';
};

RF.updateAIStatus = function() {
  var dot = RF.el('aiStatusDot');
  var text = RF.el('aiStatusText');
  if (!dot || !text) return;
  var configured = RF.getConfiguredProviders();
  if (!configured.length) {
    dot.className = 'ai-status-dot warn';
    text.textContent = 'AI: Not Configured';
    return;
  }
  dot.className = 'ai-status-dot ok';
  var primary = configured[0];
  var cfg = RF.PROVIDERS[primary];
  text.textContent = 'AI: ' + (cfg ? cfg.name : primary) + ' ● Connected';
};

RF.logUsage = function(provider, model, ok, code, err) {
  var entry = RF.Security.sanitizeLogEntry({
    timestamp: new Date().toISOString(),
    provider: provider,
    model: model,
    success: ok !== false,
    statusCode: code || (ok !== false ? 200 : 500),
    error: err || ''
  });
  RF.State.usageLog.push(entry);
  if (RF.State.usageLog.length > 100) RF.State.usageLog.shift();
};
