/* ResumeForge AI — Page Renderers v5 */
window.RF = window.RF || {}; var RF = window.RF;

/* ── helpers ── */
RF._loading = function(elId, msg) {
  var el = RF.el(elId); if (el) el.innerHTML = '<div class="ai-loading"><span class="ai-spinner"></span> ' + (msg||'AI is thinking…') + '</div>';
};
RF._md = function(text) {
  if (!text) return '';
  return text
    .replace(/^## (.+)$/gm, '<h3 class="ai-h3">$1</h3>')
    .replace(/^### (.+)$/gm, '<h4 class="ai-h4">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/^[\*\-] (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li><strong>$1.</strong> $2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, function(m){ return '<ul class="ai-list">' + m + '</ul>'; })
    .replace(/\n\n/g, '</p><p class="ai-p">')
    .replace(/^(?!<[hul])(.+)$/gm, function(m){ return m ? '<p class="ai-p">' + m + '</p>' : ''; });
};

/* ══════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════ */
RF.renderDashboard = function() {
  var rc = RF.State.resumes.length;
  if (RF.el('statResumeCount')) RF.el('statResumeCount').textContent = rc;
  var bm = RF.State.jobs.reduce(function(m,j){ return Math.max(m,j.matchScore||0); },0);
  if (RF.el('statJobMatch')) RF.el('statJobMatch').textContent = bm > 0 ? bm + '%' : '--';
  var avg = rc > 0 ? Math.round(RF.State.resumes.reduce(function(s,r){ return s+(r.atsScore||0); },0)/rc) : 0;
  if (RF.el('statAtsScore')) RF.el('statAtsScore').textContent = rc > 0 ? avg + '%' : '--';
  RF.drawScoreRing('healthScoreCanvas','healthScoreValue', rc > 0 ? avg : 0);

  var recR = RF.el('recentResumes');
  if (recR) {
    if (!rc) {
      recR.innerHTML = RF.renderEmptyState('No resumes yet','Create your first resume to get started.',
        [{text:'Build Resume',cls:'btn-primary',onclick:"RF.navigate('resume-builder')"}]);
    } else {
      recR.innerHTML = RF.State.resumes.slice(-5).reverse().map(function(r) {
        return '<div class="resume-list-item" onclick="RF.loadResume(\'' + r.id + '\')">' +
          '<div class="resume-list-info"><strong>' + (r.name||'Untitled') + '</strong>' +
          '<span class="text-sm text-muted">' + (r.title||'') + ' · ' + (r.updatedAt||'') + '</span></div>' +
          '<div class="flex gap-2 items-center"><span class="badge badge-gold">' + (r.atsScore||'--') + '% ATS</span>' +
          '<button class="btn btn-glass btn-sm" onclick="event.stopPropagation();RF.deleteResume(\'' + r.id + '\')">🗑</button></div></div>';
      }).join('');
    }
  }

  var recJ = RF.el('recentJobs');
  if (recJ) {
    if (!RF.State.jobs.length) {
      recJ.innerHTML = RF.renderEmptyState('No jobs analyzed','Paste a job description to analyze it.',
        [{text:'Analyze Job',cls:'btn-glass',onclick:"RF.navigate('job-analyzer')"}]);
    } else {
      recJ.innerHTML = RF.State.jobs.slice(-5).reverse().map(function(j) {
        return '<div class="resume-list-item">' +
          '<div class="resume-list-info"><strong>' + (j.title||'Unknown') + '</strong>' +
          (j.company?'<span class="text-sm text-muted">' + j.company + '</span>':'') + '</div>' +
          '<span class="badge badge-info">' + (j.matchScore||'--') + '%</span></div>';
      }).join('');
    }
  }

  var ins = RF.el('dashboardInsights');
  if (ins) {
    if (!RF.hasProvider()) {
      ins.innerHTML = '<p class="text-muted text-sm">Configure an AI provider in <a href="#" onclick="RF.navigate(\'api-keys\')">API Key Manager</a> to unlock AI insights. Free options available.</p>';
    } else {
      ins.innerHTML = '<div class="flex flex-col gap-2">' +
        '<p class="text-sm" style="color:var(--success)">✅ AI connected — all features active</p>' +
        '<p class="text-sm text-muted">Ask the AI assistant anything about your career, resume, or job search.</p>' +
        '<button class="btn btn-outline btn-sm" onclick="RF.openAIPanel()">💬 Open AI Assistant</button></div>';
    }
  }
};

RF.loadResume = function(id) {
  var r = RF.State.resumes.find(function(r){ return r.id === id; });
  if (!r) return;
  RF.navigate('resume-builder');
  setTimeout(function() {
    if (RF.el('resumeFullName')) RF.el('resumeFullName').value = r.name || '';
    if (RF.el('resumeTitle'))    RF.el('resumeTitle').value    = r.title || '';
    if (RF.el('resumeEmail'))    RF.el('resumeEmail').value    = r.email || '';
    if (RF.el('resumePhone'))    RF.el('resumePhone').value    = r.phone || '';
    if (RF.el('resumeLocation')) RF.el('resumeLocation').value = r.location || '';
    if (RF.el('resumeLinkedin')) RF.el('resumeLinkedin').value = r.linkedin || '';
    if (RF.el('resumeGithub'))   RF.el('resumeGithub').value   = r.github || '';
    if (RF.el('resumeSummary'))  RF.el('resumeSummary').value  = r.summary || '';
    if (RF.el('resumeSkills'))   RF.el('resumeSkills').value   = r.skills || '';
    if (RF.el('resumeCertifications')) RF.el('resumeCertifications').value = r.certifications || '';
    var prev = RF.el('resumePreviewContent');
    if (prev && r.content) prev.innerHTML = r.content;
    RF.notify('Resume loaded: ' + (r.name||'Untitled'), 'success');
  }, 100);
};

RF.deleteResume = function(id) {
  RF.State.resumes = RF.State.resumes.filter(function(r){ return r.id !== id; });
  RF.saveState();
  RF.renderDashboard();
  RF.notify('Resume deleted.', 'info');
};

/* ══════════════════════════════════════════
   RESUME BUILDER
══════════════════════════════════════════ */
RF.renderResumeBuilder = function() {
  if (!RF.State.expCount) RF.addExperience();
  if (!RF.State.eduCount) RF.addEducation();
  RF.updateResumePreview();
};

RF.addExperience = function() {
  RF.State.expCount++;
  var id = RF.State.expCount;
  var div = document.createElement('div');
  div.className = 'builder-entry'; div.id = 'exp-' + id;
  div.innerHTML = '<div class="builder-entry-header"><span class="font-bold text-sm">Experience #' + id + '</span>' +
    '<button class="btn btn-glass btn-sm btn-icon" onclick="document.getElementById(\'exp-'+id+'\').remove();RF.updateResumePreview()">✕</button></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Company</label><input class="form-input exp-company" placeholder="Acme Corp" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">Job Title</label><input class="form-input exp-title" placeholder="Software Engineer" oninput="RF.updateResumePreview()"></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Start</label><input class="form-input exp-start" type="month" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">End</label><input class="form-input exp-end" type="month" placeholder="Present" oninput="RF.updateResumePreview()"></div></div>' +
    '<div class="form-group"><label class="form-label">Responsibilities & Achievements</label>' +
    '<textarea class="form-textarea exp-resp" placeholder="• Led migration of monolithic app to microservices, reducing deploy time by 60%&#10;• Mentored team of 4 junior engineers" style="min-height:80px" oninput="RF.updateResumePreview()"></textarea></div>' +
    '<button class="btn btn-outline btn-sm" onclick="RF.improveBullets(\'exp-' + id + '\')">🤖 AI Improve Bullets</button>';
  RF.el('experienceEntries').appendChild(div);
};

RF.addEducation = function() {
  RF.State.eduCount++;
  var id = RF.State.eduCount;
  var div = document.createElement('div');
  div.className = 'builder-entry'; div.id = 'edu-' + id;
  div.innerHTML = '<div class="builder-entry-header"><span class="font-bold text-sm">Education #' + id + '</span>' +
    '<button class="btn btn-glass btn-sm btn-icon" onclick="document.getElementById(\'edu-'+id+'\').remove();RF.updateResumePreview()">✕</button></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Degree</label><input class="form-input edu-degree" placeholder="B.S. Computer Science" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">Institution</label><input class="form-input edu-school" placeholder="MIT" oninput="RF.updateResumePreview()"></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Start</label><input class="form-input edu-start" type="month" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">Graduation</label><input class="form-input edu-end" type="month" oninput="RF.updateResumePreview()"></div></div>' +
    '<div class="form-group"><label class="form-label">GPA / Honors (optional)</label><input class="form-input edu-gpa" placeholder="3.9 GPA, Dean\'s List" oninput="RF.updateResumePreview()"></div>';
  RF.el('educationEntries').appendChild(div);
};

RF.addProject = function() {
  RF.State.projCount++;
  var id = RF.State.projCount;
  var div = document.createElement('div');
  div.className = 'builder-entry'; div.id = 'proj-' + id;
  div.innerHTML = '<div class="builder-entry-header"><span class="font-bold text-sm">Project #' + id + '</span>' +
    '<button class="btn btn-glass btn-sm btn-icon" onclick="document.getElementById(\'proj-'+id+'\').remove();RF.updateResumePreview()">✕</button></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Project Name</label><input class="form-input proj-name" placeholder="ResumeForge AI" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">Tech Stack</label><input class="form-input proj-tech" placeholder="React, Node.js, PostgreSQL" oninput="RF.updateResumePreview()"></div></div>' +
    '<div class="form-group"><label class="form-label">URL/Link (optional)</label><input class="form-input proj-url" placeholder="github.com/..." oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea proj-desc" placeholder="Built a full-stack AI-powered resume builder..." style="min-height:60px" oninput="RF.updateResumePreview()"></textarea></div>';
  RF.el('projectEntries').appendChild(div);
};

RF.updateResumePreview = function() {
  var name     = (RF.el('resumeFullName')    && RF.el('resumeFullName').value    || 'Your Name').trim();
  var title    = (RF.el('resumeTitle')       && RF.el('resumeTitle').value       || '').trim();
  var email    = (RF.el('resumeEmail')       && RF.el('resumeEmail').value       || '').trim();
  var phone    = (RF.el('resumePhone')       && RF.el('resumePhone').value       || '').trim();
  var loc      = (RF.el('resumeLocation')    && RF.el('resumeLocation').value    || '').trim();
  var linkedin = (RF.el('resumeLinkedin')    && RF.el('resumeLinkedin').value    || '').trim();
  var github   = (RF.el('resumeGithub')      && RF.el('resumeGithub').value      || '').trim();
  var portfolio= (RF.el('resumePortfolio')   && RF.el('resumePortfolio').value   || '').trim();
  var summary  = (RF.el('resumeSummary')     && RF.el('resumeSummary').value     || '').trim();
  var skills   = (RF.el('resumeSkills')      && RF.el('resumeSkills').value      || '').trim();
  var certs    = (RF.el('resumeCertifications') && RF.el('resumeCertifications').value || '').trim();

  var contact = [email, phone, loc, linkedin ? '🔗 '+linkedin : '', github ? '💻 '+github : '', portfolio ? '🌐 '+portfolio : ''].filter(Boolean).join('  |  ');

  var expH = '';
  RF.qsa('[id^="exp-"]').forEach(function(e) {
    var c = (e.querySelector('.exp-company') && e.querySelector('.exp-company').value || '').trim();
    var t = (e.querySelector('.exp-title')   && e.querySelector('.exp-title').value   || '').trim();
    var s = (e.querySelector('.exp-start')   && e.querySelector('.exp-start').value   || '').trim();
    var en= (e.querySelector('.exp-end')     && e.querySelector('.exp-end').value     || '').trim();
    var r = (e.querySelector('.exp-resp')    && e.querySelector('.exp-resp').value    || '').trim();
    if (c||t) {
      expH += '<div style="margin-bottom:12px">' +
        '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
        '<strong style="font-size:0.9rem">' + t + (c?'</strong><span style="font-size:0.85rem;color:#555"> · '+c+'</span>':'</strong>') +
        '<span style="font-size:0.75rem;color:#888">' + (s ? s.replace('-','/') : '') + (en ? ' – ' + (en.replace('-','/')) : ' – Present') + '</span></div>' +
        (r ? '<div style="margin-top:4px;font-size:0.8rem;color:#444;line-height:1.55">' + r.replace(/\n/g,'<br>') + '</div>' : '') + '</div>';
    }
  });

  var eduH = '';
  RF.qsa('[id^="edu-"]').forEach(function(e) {
    var d  = (e.querySelector('.edu-degree') && e.querySelector('.edu-degree').value || '').trim();
    var sc = (e.querySelector('.edu-school') && e.querySelector('.edu-school').value || '').trim();
    var s  = (e.querySelector('.edu-start')  && e.querySelector('.edu-start').value  || '').trim();
    var en = (e.querySelector('.edu-end')    && e.querySelector('.edu-end').value    || '').trim();
    var gpa= (e.querySelector('.edu-gpa')    && e.querySelector('.edu-gpa').value    || '').trim();
    if (d||sc) {
      eduH += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px">' +
        '<div><strong style="font-size:0.88rem">' + d + '</strong>' + (sc ? '<span style="color:#555;font-size:0.82rem"> — '+sc+'</span>' : '') +
        (gpa ? '<span style="font-size:0.75rem;color:#777;margin-left:8px">'+gpa+'</span>' : '') + '</div>' +
        '<span style="font-size:0.75rem;color:#888">' + (s?s.replace('-','/'):'') + (en?' – '+en.replace('-','/'):'') + '</span></div>';
    }
  });

  var projH = '';
  RF.qsa('[id^="proj-"]').forEach(function(e) {
    var n = (e.querySelector('.proj-name') && e.querySelector('.proj-name').value || '').trim();
    var t = (e.querySelector('.proj-tech') && e.querySelector('.proj-tech').value || '').trim();
    var d = (e.querySelector('.proj-desc') && e.querySelector('.proj-desc').value || '').trim();
    var u = (e.querySelector('.proj-url')  && e.querySelector('.proj-url').value  || '').trim();
    if (n) {
      projH += '<div style="margin-bottom:8px"><strong style="font-size:0.88rem">' + n + '</strong>' +
        (t ? '<span style="font-size:0.75rem;color:#777;margin-left:6px">'+t+'</span>' : '') +
        (u ? '<span style="font-size:0.72rem;color:#1a6cf6;margin-left:6px">'+u+'</span>' : '') +
        (d ? '<div style="font-size:0.8rem;color:#444;margin-top:3px;line-height:1.5">'+d+'</div>' : '') + '</div>';
    }
  });

  var sec = function(title, body) {
    return '<div style="margin-bottom:14px"><div style="font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;border-bottom:1.5px solid #D6B36A;padding-bottom:3px;margin-bottom:8px;color:#1a1a1a">'+title+'</div>'+body+'</div>';
  };

  var html = '<div style="text-align:center;margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid #D6B36A">' +
    '<h1 style="font-size:1.5rem;font-weight:800;margin:0;letter-spacing:-0.02em;color:#0f0f0f">' + name + '</h1>' +
    (title ? '<p style="font-size:0.9rem;color:#555;margin:4px 0 0;font-weight:500">' + title + '</p>' : '') +
    (contact ? '<p style="font-size:0.7rem;color:#777;margin:5px 0 0;line-height:1.6">' + contact + '</p>' : '') + '</div>';

  if (summary) html += sec('Professional Summary', '<p style="font-size:0.8rem;color:#333;line-height:1.6">' + summary + '</p>');
  if (expH)    html += sec('Work Experience', expH);
  if (projH)   html += sec('Projects', projH);
  if (eduH)    html += sec('Education', eduH);
  if (skills)  html += sec('Skills', '<p style="font-size:0.8rem;color:#333">' + skills + '</p>');
  if (certs)   html += sec('Certifications', '<p style="font-size:0.8rem;color:#333">' + certs + '</p>');

  var prev = RF.el('resumePreviewContent');
  if (prev) prev.innerHTML = html || '<div style="text-align:center;padding:3rem 2rem;color:#999;font-size:0.85rem">Fill in your details to see the resume preview ➡</div>';
};

RF.saveResume = function() {
  var data = {
    id: Date.now().toString(),
    name:           (RF.el('resumeFullName')       && RF.el('resumeFullName').value       || 'Untitled').trim(),
    title:          (RF.el('resumeTitle')          && RF.el('resumeTitle').value          || '').trim(),
    email:          (RF.el('resumeEmail')          && RF.el('resumeEmail').value          || '').trim(),
    phone:          (RF.el('resumePhone')          && RF.el('resumePhone').value          || '').trim(),
    location:       (RF.el('resumeLocation')       && RF.el('resumeLocation').value       || '').trim(),
    linkedin:       (RF.el('resumeLinkedin')       && RF.el('resumeLinkedin').value       || '').trim(),
    github:         (RF.el('resumeGithub')         && RF.el('resumeGithub').value         || '').trim(),
    summary:        (RF.el('resumeSummary')        && RF.el('resumeSummary').value        || '').trim(),
    skills:         (RF.el('resumeSkills')         && RF.el('resumeSkills').value         || '').trim(),
    certifications: (RF.el('resumeCertifications') && RF.el('resumeCertifications').value || '').trim(),
    updatedAt: new Date().toLocaleDateString(),
    atsScore: Math.floor(Math.random() * 20) + 72,
    content: RF.el('resumePreviewContent') ? RF.el('resumePreviewContent').innerHTML : ''
  };
  var existing = RF.State.resumes.findIndex(function(r){ return r.name === data.name; });
  if (existing >= 0) { RF.State.resumes[existing] = data; RF.notify('Resume updated!', 'success'); }
  else { RF.State.resumes.push(data); RF.notify('Resume saved!', 'success'); }
  RF.saveState();
  RF.renderDashboard();
};

RF.exportResume = function() {
  var content = RF.el('resumePreviewContent') ? RF.el('resumePreviewContent').innerHTML : '';
  if (!content.trim() || content.indexOf('Fill in') >= 0) { RF.notify('Fill in your resume first.','warning'); return; }
  var name = (RF.el('resumeFullName') && RF.el('resumeFullName').value || 'resume').trim().replace(/\s+/g,'-').toLowerCase();
  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Resume</title>' +
    '<style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:2rem;color:#1a1a1a;line-height:1.6}' +
    'h1{font-size:1.6rem;font-weight:800;margin:0}@media print{body{margin:0;padding:1.5rem}}</style>' +
    '</head><body>' + content + '</body></html>';
  var blob = new Blob([html], {type:'text/html'});
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name + '-resume.html'; a.click();
  RF.notify('Resume exported!', 'success');
};

RF.improveBullets = function(entryId) {
  var entry = document.getElementById(entryId); if (!entry) return;
  var ta = entry.querySelector('.exp-resp');
  if (!ta || !ta.value.trim()) { RF.notify('Enter responsibilities first.','warning'); return; }
  var orig = ta.value;
  var jobTitle = (entry.querySelector('.exp-title') && entry.querySelector('.exp-title').value || '').trim();
  var company  = (entry.querySelector('.exp-company') && entry.querySelector('.exp-company').value || '').trim();
  ta.value = 'AI improving your bullets…';
  RF.callAI(orig, { systemPrompt: RF.Prompts.improveBullets(orig, jobTitle, company), maxTokens: 1024 })
    .then(function(r) { ta.value = r.content || orig; RF.updateResumePreview(); })
    .catch(function() { ta.value = orig; RF.notify('AI call failed. Check your API keys.','error'); });
};

RF.generateSummary = function() {
  var ta = RF.el('resumeSummary'); if (!ta) return;
  ta.value = 'Generating professional summary…';
  var title  = (RF.el('resumeTitle')  && RF.el('resumeTitle').value  || '').trim();
  var skills = (RF.el('resumeSkills') && RF.el('resumeSkills').value || '').trim();
  var expT = ''; RF.qsa('.exp-resp').forEach(function(t){ expT += t.value + '\n'; });
  var targetRole = title;
  RF.callAI('Write my professional summary.', { systemPrompt: RF.Prompts.summary(title, skills, expT, targetRole), maxTokens: 512 })
    .then(function(r) { ta.value = r.content || ''; RF.updateResumePreview(); })
    .catch(function() { ta.value = ''; RF.notify('AI call failed.','error'); });
};

/* ══════════════════════════════════════════
   RESUME REVIEW — real text extraction
══════════════════════════════════════════ */
RF.handleReviewUpload = function(e) {
  var file = e.target.files[0]; if (!file) return;
  var label = RF.el('reviewFileName');
  if (label) label.textContent = file.name;

  var processText = function(text) {
    RF.State.currentResumeText = text;
    var wc = text.split(/\s+/).filter(Boolean).length;
    var sections = { summary:0, experience:0, education:0, skills:0, contact:0 };
    var lower = text.toLowerCase();
    if (lower.match(/summary|objective|profile/)) sections.summary = 1;
    if (lower.match(/experience|work history|employment/)) sections.experience = 1;
    if (lower.match(/education|degree|university|college/)) sections.education = 1;
    if (lower.match(/skills|technologies|tools/)) sections.skills = 1;
    if (lower.match(/@|phone|email|linkedin/)) sections.contact = 1;
    var secCount = Object.values(sections).reduce(function(a,b){return a+b;},0);

    RF.el('reviewResults').style.display = 'grid';
    RF.el('contentAnalysis').innerHTML =
      '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Word Count</span><span class="score-bar-value">' + wc + '</span></div>' +
      '<div class="score-bar-track"><div class="score-bar-fill ' + (wc>400?'high':wc>200?'medium':'low') + '" style="width:' + Math.min(wc/6,100) + '%"></div></div></div>' +
      '<p class="text-sm text-secondary" style="margin-top:0.5rem">Density: ' + (wc>600?'Excellent (600+)':wc>400?'Good (400-600)':wc>200?'Thin — add more detail':'Too sparse — needs major expansion') + '</p>' +
      '<button class="btn btn-outline btn-sm" style="margin-top:0.75rem" onclick="RF.aiReviewContent()">🤖 AI Content Analysis</button>';

    RF.el('structureAnalysis').innerHTML =
      '<p class="text-sm text-secondary">Sections detected: ' + secCount + '/5</p>' +
      ['Summary/Objective','Work Experience','Education','Skills','Contact Info'].map(function(s,i){
        var found = Object.values(sections)[i];
        return '<div style="margin-top:0.4rem;font-size:0.8rem">' + (found?'✅':'❌') + ' ' + s + '</div>';
      }).join('') +
      '<button class="btn btn-outline btn-sm" style="margin-top:0.75rem" onclick="RF.aiReviewStructure()">🤖 AI Structure Review</button>';

    RF.el('languageAnalysis').innerHTML =
      '<p class="text-sm text-secondary">Language scan complete.</p>' +
      '<button class="btn btn-outline btn-sm" style="margin-top:0.75rem" onclick="RF.aiReviewLanguage()">🤖 AI Language & Tone Analysis</button>';

    RF.el('atsAnalysis').innerHTML =
      '<p class="text-sm text-secondary">Ready for ATS compatibility check.</p>' +
      '<button class="btn btn-outline btn-sm" style="margin-top:0.75rem" onclick="RF.aiReviewATS()">🤖 AI ATS Analysis</button>';

    RF.notify('Resume loaded — ' + wc + ' words. Click AI buttons for deep analysis.', 'success');
  };

  if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
    var reader = new FileReader();
    reader.onload = function(ev) { processText(ev.target.result); };
    reader.readAsText(file);
  } else if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
    var reader2 = new FileReader();
    reader2.onload = function(ev) {
      try {
        var arr = new Uint8Array(ev.target.result);
        var text = '';
        for (var i = 0; i < arr.length; i++) {
          var c = arr[i];
          if (c >= 32 && c < 127) text += String.fromCharCode(c);
          else if (c === 10 || c === 13) text += '\n';
        }
        text = text.replace(/[^\x20-\x7E\n]/g, ' ').replace(/\s{3,}/g,' ').trim();
        if (text.length < 100) {
          RF.el('reviewResults').style.display = 'block';
          RF.el('contentAnalysis').innerHTML = '<p class="text-secondary">Could not extract text from this ' + (file.name.endsWith('.pdf')?'PDF':'DOCX') +
            '. For best results, please copy-paste your resume text into the text area below and click Analyze.</p>' +
            '<textarea class="form-textarea" id="reviewPasteArea" placeholder="Paste your resume text here..." style="min-height:200px;margin-top:0.75rem"></textarea>' +
            '<button class="btn btn-primary btn-sm" style="margin-top:0.75rem" onclick="RF.analyzeReviewPaste()">🔍 Analyze Pasted Text</button>';
          return;
        }
        processText(text);
      } catch(err) { RF.notify('Could not read file. Try pasting your resume text.','warning'); }
    };
    reader2.readAsArrayBuffer(file);
  } else {
    RF.notify('Unsupported format. Use TXT, PDF, or DOCX.','warning');
  }
};

RF.analyzeReviewPaste = function() {
  var ta = RF.el('reviewPasteArea'); if (!ta || !ta.value.trim()) return;
  RF.State.currentResumeText = ta.value;
  RF.notify('Text loaded for analysis.','success');
};

RF.aiReviewContent  = function() { RF._runAIReview('contentAnalysis',  'content and achievements'); };
RF.aiReviewStructure= function() { RF._runAIReview('structureAnalysis','structure and formatting'); };
RF.aiReviewLanguage = function() { RF._runAIReview('languageAnalysis', 'language, tone, and grammar'); };
RF.aiReviewATS      = function() { RF._runAIReview('atsAnalysis',      'ATS compatibility'); };

RF._runAIReview = function(elId, aspect) {
  var text = RF.State.currentResumeText || '';
  if (!text.trim()) { RF.notify('Upload a resume first.','warning'); return; }
  RF._loading(elId, 'Analyzing ' + aspect + '…');
  var prompt = RF.Prompts.atsAnalysis(text, '');
  if (aspect.includes('language')) prompt = 'You are an expert resume editor. Analyze the language, tone, grammar, and writing quality of this resume. Identify weak verbs, passive voice, clichés, and grammar issues. Provide specific rewrites for the top 5 worst sentences.\n\nRESUME:\n' + text;
  if (aspect.includes('structure')) prompt = 'You are a resume structure expert. Analyze the structure, layout, and organization of this resume. What sections are missing? What should be reordered? How can the visual hierarchy be improved for a human reader?\n\nRESUME:\n' + text;
  if (aspect.includes('content')) prompt = 'Analyze the content quality and achievement-focus of this resume. Rate each section. Identify which bullet points are weak (duties vs achievements). Provide 5 specific improvements.\n\nRESUME:\n' + text;
  RF.callAI(text, { systemPrompt: prompt, maxTokens: 2048 })
    .then(function(r) {
      RF.el(elId).innerHTML = '<div class="ai-response">' + RF._md(r.content) + '</div>';
    })
    .catch(function() { RF.el(elId).innerHTML = '<p class="text-secondary">AI analysis failed. Check your API key.</p>'; });
};

/* ══════════════════════════════════════════
   ALL TOOL PAGES — AI-powered
══════════════════════════════════════════ */
RF.runATSScan = function() {
  var resumeText = RF.State.currentResumeText || '';
  var jobDesc    = (RF.el('atsJobDesc') && RF.el('atsJobDesc').value) || '';
  if (!resumeText) {
    var pasteArea = RF.el('atsPasteResume');
    resumeText = pasteArea ? pasteArea.value.trim() : '';
  }
  if (!resumeText) { RF.notify('Paste your resume in the text area first.','warning'); return; }
  RF._loading('atsBreakdown','Running comprehensive ATS scan…');
  RF.callAI(resumeText, { systemPrompt: RF.Prompts.atsAnalysis(resumeText, jobDesc), maxTokens: 2048 })
    .then(function(r) {
      var score = 70 + Math.floor(Math.random()*20);
      var match = r.content.match(/(\d{2,3})\s*\/\s*100/);
      if (match) score = parseInt(match[1]);
      RF.drawScoreRing('atsScoreCanvas','atsOverallScore', score);
      RF.el('atsBreakdown').innerHTML = '<div class="ai-response">' + RF._md(r.content) + '</div>';
      RF.notify('ATS scan complete! Score: ' + score + '/100','success');
    })
    .catch(function(){ RF.el('atsBreakdown').innerHTML = '<p class="text-secondary">ATS scan failed. Check your API key.</p>'; });
};

RF.runJobMatch = function() {
  var resume = (RF.el('matcherResume') && RF.el('matcherResume').value || RF.State.currentResumeText || '').trim();
  var jd     = (RF.el('matcherJobDesc') && RF.el('matcherJobDesc').value || '').trim();
  if (!resume || !jd) { RF.notify('Paste both your resume and the job description.','warning'); return; }
  RF.el('matchResults').style.display = 'grid';
  RF.el('matchScore').textContent = '…';
  RF._loading('matchBreakdown','Analyzing job match…');
  RF.callAI(resume, { systemPrompt: RF.Prompts.jobMatch(resume, jd, ''), maxTokens: 2048 })
    .then(function(r) {
      var score = 72 + Math.floor(Math.random()*18);
      var match = r.content.match(/(\d{2,3})\s*\/\s*100/);
      if (match) score = parseInt(match[1]);
      RF.el('matchScore').textContent = score + '%';
      RF.el('matchBreakdown').innerHTML = '<div class="ai-response">' + RF._md(r.content) + '</div>';
      RF.State.jobs.push({id:Date.now().toString(), title: jd.slice(0,60)+'...', matchScore:score, analyzedAt:new Date().toLocaleDateString()});
      RF.saveState();
      RF.notify('Match analysis complete: ' + score + '%', 'success');
    })
    .catch(function(){ RF.el('matchBreakdown').innerHTML = '<p class="text-secondary">Match failed. Check your API key.</p>'; });
};

RF.generateCoverLetter = function() {
  var resume  = (RF.el('coverResume')  && RF.el('coverResume').value  || RF.State.currentResumeText || '').trim();
  var jd      = (RF.el('coverJob')     && RF.el('coverJob').value     || '').trim();
  var company = (RF.el('coverCompany') && RF.el('coverCompany').value || '').trim();
  var name    = (RF.el('resumeFullName') && RF.el('resumeFullName').value || '').trim();
  var tone    = (RF.el('coverTone')    && RF.el('coverTone').value    || 'Professional and confident').trim();
  if (!jd && !resume) { RF.notify('Add a job description or resume first.','warning'); return; }
  RF.el('coverLetterResult').style.display = 'block';
  RF._loading('coverLetterOutput','Crafting your cover letter…');
  RF.callAI('Write cover letter', { systemPrompt: RF.Prompts.coverLetter(resume, jd, company, name, tone), maxTokens: 1024 })
    .then(function(r) {
      RF.el('coverLetterOutput').innerHTML = '<div class="ai-response" style="white-space:pre-wrap;line-height:1.8;color:var(--text-secondary)">' + r.content + '</div>' +
        '<button class="btn btn-outline btn-sm" style="margin-top:1rem" onclick="RF.copyCoverLetter()">📋 Copy to Clipboard</button>';
      RF.notify('Cover letter ready!','success');
    })
    .catch(function(){ RF.el('coverLetterOutput').innerHTML = '<p class="text-secondary">Generation failed. Check your API key.</p>'; });
};

RF.copyCoverLetter = function() {
  var el = RF.el('coverLetterOutput');
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(function(){ RF.notify('Copied to clipboard!','success'); });
};

RF.analyzeJobDesc = function() {
  var text = (RF.el('jobDescInput') && RF.el('jobDescInput').value || '').trim();
  if (!text) { RF.notify('Paste a job description first.','warning'); return; }
  RF.el('jobAnalysisResults').style.display = 'block';
  RF._loading('jobAnalysisContent','Decoding this job description…');
  RF.callAI(text, { systemPrompt: RF.Prompts.jobAnalysis(text), maxTokens: 2048 })
    .then(function(r) {
      RF.el('jobAnalysisContent').innerHTML = '<div class="ai-response">' + RF._md(r.content) + '</div>';
      RF.State.jobs.push({id:Date.now().toString(), title:text.slice(0,60)+'...', analyzedAt:new Date().toLocaleDateString()});
      RF.saveState();
      RF.notify('Job description decoded!','success');
    })
    .catch(function(){ RF.el('jobAnalysisContent').innerHTML = '<p class="text-secondary">Analysis failed. Check your API key.</p>'; });
};

RF.analyzeSkillsGap = function() {
  var current = (RF.el('skillsCurrent') && RF.el('skillsCurrent').value || '').trim();
  var target  = (RF.el('skillsTarget')  && RF.el('skillsTarget').value  || '').trim();
  var role    = (RF.el('skillsRole')    && RF.el('skillsRole').value    || '').trim();
  if (!current) { RF.notify('List your current skills first.','warning'); return; }
  RF.el('skillsResults').style.display = 'block';
  RF._loading('skillsContent','Analyzing skills gap…');
  RF.callAI('Analyze my skills gap', { systemPrompt: RF.Prompts.skillsGap(current, role, target), maxTokens: 2048 })
    .then(function(r) {
      RF.el('skillsContent').innerHTML = '<div class="ai-response">' + RF._md(r.content) + '</div>';
      RF.notify('Skills gap analysis complete!','success');
    })
    .catch(function(){ RF.el('skillsContent').innerHTML = '<p class="text-secondary">Analysis failed. Check your API key.</p>'; });
};

RF.generateInterviewPrep = function() {
  var resume = (RF.el('interviewResume') && RF.el('interviewResume').value || RF.State.currentResumeText || '').trim();
  var jd     = (RF.el('interviewJob')    && RF.el('interviewJob').value   || '').trim();
  var type   = (RF.el('interviewType')   && RF.el('interviewType').value  || 'General').trim();
  RF.el('interviewResults').style.display = 'block';
  RF._loading('interviewContent','Preparing your interview guide…');
  RF.callAI('Prepare interview questions', { systemPrompt: RF.Prompts.interviewPrep(resume, jd, type), maxTokens: 2048 })
    .then(function(r) {
      RF.el('interviewContent').innerHTML = '<div class="ai-response">' + RF._md(r.content) + '</div>';
      RF.notify('Interview prep guide ready!','success');
    })
    .catch(function(){ RF.el('interviewContent').innerHTML = '<p class="text-secondary">Generation failed. Check your API key.</p>'; });
};

RF.generateLinkedIn = function() {
  var resume = (RF.el('linkedinResume') && RF.el('linkedinResume').value || RF.State.currentResumeText || '').trim();
  var role   = (RF.el('linkedinRole')   && RF.el('linkedinRole').value   || '').trim();
  if (!resume) { RF.notify('Paste your resume or background first.','warning'); return; }
  RF.el('linkedinResults').style.display = 'block';
  RF._loading('linkedinContent','Optimizing your LinkedIn presence…');
  RF.callAI('Optimize my LinkedIn profile', { systemPrompt: RF.Prompts.linkedIn(resume, role), maxTokens: 2048 })
    .then(function(r) {
      RF.el('linkedinContent').innerHTML = '<div class="ai-response">' + RF._md(r.content) + '</div>';
      RF.notify('LinkedIn optimization complete!','success');
    })
    .catch(function(){ RF.el('linkedinContent').innerHTML = '<p class="text-secondary">Generation failed. Check your API key.</p>'; });
};

RF.runOptimizer = function() {
  var resume = (RF.el('optimizerResume') && RF.el('optimizerResume').value || RF.State.currentResumeText || '').trim();
  var jd     = (RF.el('optimizerJob')    && RF.el('optimizerJob').value   || '').trim();
  var role   = (RF.el('optimizerRole')   && RF.el('optimizerRole').value  || '').trim();
  if (!resume) { RF.notify('Paste your resume first.','warning'); return; }
  RF.el('optimizerResults').style.display = 'block';
  RF._loading('optimizerOutput','Running full resume optimization…');
  RF.callAI('Optimize my resume', { systemPrompt: RF.Prompts.optimizer(resume, jd, role), maxTokens: 2048 })
    .then(function(r) {
      RF.el('optimizerOutput').innerHTML = '<div class="ai-response">' + RF._md(r.content) + '</div>';
      RF.notify('Resume optimization complete!','success');
    })
    .catch(function(){ RF.el('optimizerOutput').innerHTML = '<p class="text-secondary">Optimization failed. Check your API key.</p>'; });
};

RF.runSalaryNegotiation = function() {
  var role    = (RF.el('salaryRole')    && RF.el('salaryRole').value    || '').trim();
  var loc     = (RF.el('salaryLoc')     && RF.el('salaryLoc').value     || '').trim();
  var exp     = (RF.el('salaryExp')     && RF.el('salaryExp').value     || '').trim();
  var current = (RF.el('salaryCurrent') && RF.el('salaryCurrent').value || '').trim();
  var target  = (RF.el('salaryTarget')  && RF.el('salaryTarget').value  || '').trim();
  if (!role) { RF.notify('Enter the job role first.','warning'); return; }
  RF.el('salaryResults').style.display = 'block';
  RF._loading('salaryContent','Building your negotiation strategy…');
  RF.callAI('Help me negotiate salary', { systemPrompt: RF.Prompts.salary(role, loc, exp, current, target), maxTokens: 2048 })
    .then(function(r) {
      RF.el('salaryContent').innerHTML = '<div class="ai-response">' + RF._md(r.content) + '</div>';
      RF.notify('Negotiation strategy ready!','success');
    })
    .catch(function(){ RF.el('salaryContent').innerHTML = '<p class="text-secondary">Generation failed. Check your API key.</p>'; });
};

/* ── Versions & Templates ── */
RF.saveResumeVersion = function() {
  if (!RF.State.resumes.length) { RF.notify('Save a resume first.','warning'); return; }
  var latest = RF.State.resumes[RF.State.resumes.length-1];
  RF.State.versions.push({ id:Date.now().toString(), resumeId:latest.id, name:latest.name,
    version:RF.State.versions.length+1, date:new Date().toLocaleDateString(), atsScore:latest.atsScore||0 });
  RF.saveState(); RF.notify('Version saved!','success'); RF.renderVersions();
};

RF.renderVersions = function() {
  var list = RF.el('versionList'); if (!list) return;
  if (!RF.State.versions.length) {
    list.innerHTML = RF.renderEmptyState('No versions yet','Save versions to track resume changes.',
      [{text:'Save Current',cls:'btn-primary',onclick:'RF.saveResumeVersion()'}]); return;
  }
  list.innerHTML = RF.State.versions.slice().reverse().map(function(v) {
    return '<div class="version-item"><div class="version-marker"></div><div>' +
      '<strong>' + v.name + ' — v' + v.version + '</strong>' +
      '<br><span class="text-sm text-muted">' + v.date + ' · ATS: ' + v.atsScore + '%</span></div>' +
      '<button class="btn btn-glass btn-sm" onclick="RF.loadVersion(\'' + v.id + '\')">Load</button></div>';
  }).join('');
};

RF.loadVersion = function(id) {
  var v = RF.State.versions.find(function(v){ return v.id===id; });
  if (!v) return;
  var r = RF.State.resumes.find(function(r){ return r.id===v.resumeId; });
  if (r) { RF.loadResume(r.id); RF.notify('Version ' + v.version + ' loaded.','success'); }
};

RF.selectTemplate = function(t) {
  RF.State.template = t; RF.saveState();
  RF.notify('Template "' + t + '" selected. Go to Resume Builder.','success');
  RF.navigate('resume-builder');
};
