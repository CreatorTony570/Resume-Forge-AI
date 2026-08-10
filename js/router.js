/* ResumeForge AI — Router & Navigation */

window.RF = window.RF || {}; var RF = window.RF;

RF.currentPage = 'dashboard';

RF.navigate = function(page) {
  RF.currentPage = page;
  RF.State.page = page;

  // Swap active page panel
  RF.qsa('.page-panel').forEach(function(p) { p.classList.remove('active'); });
  var panel = RF.el('page-' + page);
  if (panel) panel.classList.add('active');

  // Swap active nav item
  RF.qsa('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  var navItem = RF.qs('.nav-item[data-page="' + page + '"]');
  if (navItem) navItem.classList.add('active');

  // Update top bar title
  var title = RF.el('topBarTitle');
  if (title) title.textContent = RF.PAGE_TITLES[page] || page;

  // Close mobile sidebar
  var sidebar = RF.el('sidebar');
  if (sidebar) sidebar.classList.remove('open');

  // Render page-specific content
  RF.renderPage(page);
};

RF.enterApp = function(page) {
  var lp = RF.el('landingPage');
  var app = RF.el('appShell');
  if (lp) lp.style.display = 'none';
  if (app) app.classList.add('active');
  RF.navigate(page || 'dashboard');
};

RF.renderPage = function(page) {
  switch (page) {
    case 'dashboard':          RF.renderDashboard();    break;
    case 'resume-builder':     RF.renderResumeBuilder(); break;
    case 'ats-scanner':        RF.drawScoreRing('atsScoreCanvas', 'atsOverallScore', 0); break;
    case 'ai-model-center':    RF.renderModelCenter();  break;
    case 'api-keys':           RF.renderAPIKeys();      break;
    case 'usage-analytics':    RF.renderUsage();        break;
    case 'resume-versions':    RF.renderVersions();     break;
    case 'job-tracker':        RF.renderJobTracker();   break;
    case 'resume-templates':   break;
    case 'salary-negotiation': break;
    default: break;
  }
};

RF.PAGE_TITLES = RF.PAGE_TITLES || {};
RF.PAGE_TITLES['job-tracker'] = 'Job Application Tracker';

RF.initSidebar = function() {
  RF.qsa('.nav-item').forEach(function(item) {
    item.addEventListener('click', function() {
      RF.navigate(item.dataset.page);
    });
  });
};

RF.initKeys = function() {
  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      RF.openCommandPalette();
    }
  });
};
