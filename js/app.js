/* ResumeForge AI — Main Application Entry v5 */

(function() {
  'use strict';

  // Ensure RF is globally available immediately for inline onclick handlers
  window.RF = window.RF || {};

  // Verify storage integrity
  RF.Security.verifyStorage();

  // Load persisted state
  RF.loadState();

  // Runtime-only state
  RF.State.currentResumeText = '';

  // Apply saved settings
  if (RF.State.settings && RF.State.settings.reduceMotion) {
    document.body.classList.add('reduced-motion');
  }

  // Wire up sidebar, keyboard shortcuts, autosave
  RF.initSidebar();
  RF.initKeys();
  RF.autoSave();
  RF.updateAIStatus();

  // Restore settings form values
  var rmCheck = RF.el('settingReduceMotion');
  if (rmCheck) rmCheck.checked = !!(RF.State.settings && RF.State.settings.reduceMotion);
  var rmSelect = RF.el('settingRoutingMode');
  if (rmSelect) rmSelect.value = (RF.State.settings && RF.State.settings.routingMode) || 'auto';

  // Draw score rings and render dashboard after a short paint delay
  setTimeout(function() {
    RF.drawScoreRing('healthScoreCanvas', 'healthScoreValue', 0);
    RF.drawScoreRing('atsScoreCanvas',    'atsOverallScore',  0);
    RF.renderDashboard();
  }, 60);

  // Save state before page unload
  window.addEventListener('beforeunload', RF.saveState);

  // Re-expose RF globally (already on window, but be explicit)
  window.RF = RF;
})();
