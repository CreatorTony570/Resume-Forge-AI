/* ResumeForge AI — Main Application Entry */

(function() {
  'use strict';

  // Verify storage integrity on boot
  RF.Security.verifyStorage();

  // Load persisted state
  RF.loadState();

  // Apply saved settings
  if (RF.State.settings.reduceMotion) document.body.classList.add('reduced-motion');
  var rmCheck = RF.el('settingReduceMotion');
  if (rmCheck) rmCheck.checked = RF.State.settings.reduceMotion;
  var rmSelect = RF.el('settingRoutingMode');
  if (rmSelect) rmSelect.value = RF.State.settings.routingMode;

  // Initialize subsystems
  RF.initSidebar();
  RF.initKeys();
  RF.autoSave();
  RF.updateAIStatus();

  // Draw initial score rings
  setTimeout(function() {
    RF.drawScoreRing('healthScoreCanvas', 'healthScoreValue', 0);
    RF.drawScoreRing('atsScoreCanvas', 'atsOverallScore', 0);
  }, 300);

  // Save on unload
  window.addEventListener('beforeunload', RF.saveState);

  // Expose globals for onclick handlers
  window.RF = RF;
})();
