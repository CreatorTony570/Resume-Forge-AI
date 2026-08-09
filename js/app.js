/* ResumeForge AI — Main Application Entry */

(function() {
  'use strict';

  // Verify storage integrity on boot
  RF.Security.verifyStorage();

  // Load persisted state
  RF.loadState();

  // Apply saved settings
  if (RF.State.settings.reduceMotion) document.body.classList.add('reduced-motion');

  // Initialize subsystems — DOM is fully inline so everything is available immediately
  RF.initSidebar();
  RF.initKeys();
  RF.autoSave();
  RF.updateAIStatus();

  // Restore saved settings to form elements
  var rmCheck = RF.el('settingReduceMotion');
  if (rmCheck) rmCheck.checked = RF.State.settings.reduceMotion;
  var rmSelect = RF.el('settingRoutingMode');
  if (rmSelect) rmSelect.value = RF.State.settings.routingMode;

  // Draw initial score rings and render dashboard
  setTimeout(function() {
    RF.drawScoreRing('healthScoreCanvas', 'healthScoreValue', 0);
    RF.drawScoreRing('atsScoreCanvas', 'atsOverallScore', 0);
    RF.renderDashboard();
  }, 50);

  // Save on unload
  window.addEventListener('beforeunload', RF.saveState);

  // Expose globals for inline onclick handlers
  window.RF = RF;
})();
