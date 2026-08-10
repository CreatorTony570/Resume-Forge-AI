/* ResumeForge AI — Main Application Entry v6 */

(function() {
  'use strict';

  window.RF = window.RF || {};

  RF.Security.verifyStorage();
  RF.loadState();

  // Runtime-only state
  RF.State.currentResumeText = '';

  // Apply saved theme immediately
  if (RF.State.settings && RF.State.settings.theme && RF.State.settings.theme !== 'dark') {
    RF.applyTheme(RF.State.settings.theme);
  }

  // Reduce motion
  if (RF.State.settings && RF.State.settings.reduceMotion) {
    document.body.classList.add('reduced-motion');
  }

  // Wire up all systems
  RF.initSidebar();
  RF.initKeys();
  RF.autoSave();
  RF.updateAIStatus();

  // Restore settings form values
  var rmCheck = RF.el('settingReduceMotion');
  if (rmCheck) rmCheck.checked = !!(RF.State.settings && RF.State.settings.reduceMotion);
  var rmSelect = RF.el('settingRoutingMode');
  if (rmSelect) rmSelect.value = (RF.State.settings && RF.State.settings.routingMode) || 'auto';
  var themeSelect = RF.el('settingTheme');
  if (themeSelect) themeSelect.value = (RF.State.settings && RF.State.settings.theme) || 'dark';
  var tempInput = RF.el('settingTemperature');
  if (tempInput) tempInput.value = (RF.State.settings && RF.State.settings.temperature) || 0.7;

  // Draw score rings and render dashboard
  setTimeout(function() {
    RF.drawScoreRing('healthScoreCanvas', 'healthScoreValue', 0);
    RF.drawScoreRing('atsScoreCanvas',    'atsOverallScore',  0);
    RF.renderDashboard();

    // Show onboarding banner for users with no AI configured
    var banner = RF.el('onboardingBanner');
    if (banner && !RF.hasProvider()) {
      banner.style.display = 'flex';
    }

    // Wire up live score indicator in builder
    RF._wireLiveScore();
  }, 60);

  // Save state before page unload
  window.addEventListener('beforeunload', RF.saveState);

  // Keyboard shortcut: Escape closes modals/palette/panel
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      RF.closeModal();
      RF.closeCommandPalette();
      var panel = RF.el('aiPanel');
      if (panel && panel.classList.contains('open')) panel.classList.remove('open');
    }
  });

  window.RF = RF;
})();

/* ── Live ATS score bar in Resume Builder ── */
RF._wireLiveScore = function() {
  var scoreBar = RF.el('liveScoreBar');
  var scoreTxt = RF.el('liveScoreText');
  if (!scoreBar || !scoreTxt) return;

  var update = function() {
    var text = RF.el('resumePreviewContent') ? (RF.el('resumePreviewContent').innerText || '') : '';
    var score = RF.scoreResume ? RF.scoreResume(text) : 0;
    var color = score >= 80 ? 'var(--success)' : score >= 60 ? 'var(--warning)' : 'var(--danger)';
    scoreBar.style.width  = score + '%';
    scoreBar.style.background = color;
    scoreTxt.textContent  = score + '/100';
    scoreTxt.style.color  = color;
  };

  // Run once now, then hook into preview updates
  update();
  var orig = RF.updateResumePreview;
  RF.updateResumePreview = function() { orig(); setTimeout(update, 100); };
};
