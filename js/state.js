/* ResumeForge AI — State Management v6 */
window.RF = window.RF || {}; var RF = window.RF;

RF.State = {
  page: 'dashboard',
  routingMode: 'auto',
  resumes: [],
  versions: [],
  jobs: [],
  applications: [],
  providers: {},
  settings: { theme:'dark', reduceMotion:false, routingMode:'auto', temperature:0.7 },
  usageLog: [],
  template: 'modern',
  expCount: 0,
  eduCount: 0,
  projCount: 0,
  currentResumeText: ''
};

RF.loadState = function() {
  try {
    RF.State.resumes      = JSON.parse(localStorage.getItem('rf_resumes')   || '[]');
    RF.State.versions     = JSON.parse(localStorage.getItem('rf_versions')  || '[]');
    RF.State.jobs         = JSON.parse(localStorage.getItem('rf_jobs')      || '[]');
    RF.State.applications = JSON.parse(localStorage.getItem('rf_apps')      || '[]');
    RF.State.providers    = JSON.parse(localStorage.getItem('rf_providers') || '{}');
    RF.State.settings     = JSON.parse(localStorage.getItem('rf_settings')  || '{"theme":"dark","reduceMotion":false,"routingMode":"auto","temperature":0.7}');
    RF.State.usageLog     = JSON.parse(localStorage.getItem('rf_usage')     || '[]');
    RF.State.routingMode  = RF.State.settings.routingMode || 'auto';
  } catch(e) { console.warn('State load error:', e); }
};

RF.saveState = function() {
  try {
    localStorage.setItem('rf_resumes',   JSON.stringify(RF.State.resumes));
    localStorage.setItem('rf_versions',  JSON.stringify(RF.State.versions));
    localStorage.setItem('rf_jobs',      JSON.stringify(RF.State.jobs));
    localStorage.setItem('rf_apps',      JSON.stringify(RF.State.applications));
    localStorage.setItem('rf_providers', JSON.stringify(RF.State.providers));
    localStorage.setItem('rf_settings',  JSON.stringify(RF.State.settings));
    localStorage.setItem('rf_usage',     JSON.stringify(RF.State.usageLog));
  } catch(e) { console.warn('State save error:', e); }
};

RF.autoSave = function() { setInterval(RF.saveState, 4000); };

RF.hasProvider = function() {
  return Object.keys(RF.State.providers).some(function(k){ return RF.State.providers[k] && RF.State.providers[k].apiKey; });
};

RF.getConfiguredProviders = function() {
  return Object.keys(RF.State.providers).filter(function(k){ return RF.State.providers[k] && RF.State.providers[k].apiKey; });
};

/* ── Real ATS scoring rubric (no more random) ── */
RF.scoreResume = function(text) {
  if (!text || text.length < 50) return 0;
  var score = 0;
  var lower = text.toLowerCase();
  // Sections present (30pts)
  if (lower.match(/summary|objective|profile/))        score += 6;
  if (lower.match(/experience|work|employment/))       score += 6;
  if (lower.match(/education|degree|university/))      score += 5;
  if (lower.match(/skills|technologies|proficien/))    score += 7;
  if (lower.match(/@[a-z]/))                           score += 3; // email
  if (lower.match(/linkedin|github|portfolio/))        score += 3;
  // Content quality (40pts)
  var bullets = (text.match(/^[•\-\*]/gm) || []).length;
  score += Math.min(bullets * 2, 14); // up to 14pts for bullets
  var numbers = (text.match(/\d+[\%\+xX]?/g) || []).length;
  score += Math.min(numbers * 1.5, 12); // up to 12pts for quantification
  var actionVerbs = ['led','built','designed','developed','architected','launched','improved','delivered','managed','created','increased','reduced','spearheaded','engineered','deployed'];
  var verbCount = actionVerbs.filter(function(v){ return lower.includes(v); }).length;
  score += Math.min(verbCount * 1, 14); // up to 14pts for action verbs
  // Length (15pts)
  var wc = text.split(/\s+/).length;
  if (wc > 600)      score += 15;
  else if (wc > 400) score += 12;
  else if (wc > 250) score += 7;
  else if (wc > 150) score += 3;
  // Formatting (15pts)
  if (!lower.includes('<table') && !lower.includes('<img'))  score += 5; // no tables/images
  if (text.split('\n').length > 10)                          score += 5; // has line breaks
  if (lower.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})\b/)) score += 5;
  return Math.min(Math.round(score), 100);
};
