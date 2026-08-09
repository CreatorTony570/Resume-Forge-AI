/* ResumeForge AI — State Management */

window.RF = window.RF || {}; var RF = window.RF;

RF.State = {
  page: 'dashboard',
  routingMode: 'auto',
  resumes: [],
  versions: [],
  jobs: [],
  providers: {},
  settings: { theme:'dark', reduceMotion:false, routingMode:'auto', temperature:0.7 },
  usageLog: [],
  template: 'modern',
  expCount: 0,
  eduCount: 0,
  projCount: 0
};

RF.loadState = function() {
  try {
    RF.State.resumes   = JSON.parse(localStorage.getItem('rf_resumes')   || '[]');
    RF.State.versions  = JSON.parse(localStorage.getItem('rf_versions')  || '[]');
    RF.State.jobs      = JSON.parse(localStorage.getItem('rf_jobs')      || '[]');
    RF.State.providers = JSON.parse(localStorage.getItem('rf_providers') || '{}');
    RF.State.settings  = JSON.parse(localStorage.getItem('rf_settings')  || '{"theme":"dark","reduceMotion":false,"routingMode":"auto","temperature":0.7}');
    RF.State.usageLog  = JSON.parse(localStorage.getItem('rf_usage')     || '[]');
    RF.State.routingMode = RF.State.settings.routingMode;
  } catch(e) { /* reset on corruption */ }
};

RF.saveState = function() {
  localStorage.setItem('rf_resumes',   JSON.stringify(RF.State.resumes));
  localStorage.setItem('rf_versions',  JSON.stringify(RF.State.versions));
  localStorage.setItem('rf_jobs',      JSON.stringify(RF.State.jobs));
  localStorage.setItem('rf_providers', JSON.stringify(RF.State.providers));
  localStorage.setItem('rf_settings',  JSON.stringify(RF.State.settings));
  localStorage.setItem('rf_usage',     JSON.stringify(RF.State.usageLog));
};

RF.autoSave = function() {
  setInterval(RF.saveState, 4000);
};

RF.hasProvider = function() {
  return Object.keys(RF.State.providers).some(k => RF.State.providers[k]?.apiKey);
};

RF.getConfiguredProviders = function() {
  return Object.keys(RF.State.providers).filter(k => RF.State.providers[k]?.apiKey);
};
