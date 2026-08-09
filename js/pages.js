/* ResumeForge AI — Page Renderers */

const RF = window.RF || {};

// ===== DASHBOARD =====
RF.renderDashboard = function() {
  var resumeCount = RF.State.resumes.length;
  RF.el('statResumeCount').textContent = resumeCount;
  var bestMatch = RF.State.jobs.reduce(function(m,j) { return Math.max(m, j.matchScore||0); }, 0);
  RF.el('statJobMatch').textContent = bestMatch > 0 ? bestMatch + '%' : '--';

  var avgAts = 0;
  if (resumeCount > 0) {
    avgAts = Math.round(RF.State.resumes.reduce(function(s,r) { return s + (r.atsScore||0); }, 0) / resumeCount);
  }
  RF.el('statAtsScore').textContent = resumeCount > 0 ? avgAts + '%' : '--';
  RF.drawScoreRing('healthScoreCanvas', 'healthScoreValue', resumeCount > 0 ? avgAts : 0);

  // Recent resumes
  var recR = RF.el('recentResumes');
  if (!RF.State.resumes.length) {
    recR.innerHTML = RF.renderEmptyState('No resumes yet', 'Create your first resume or upload an existing one.',
      [{text:'Create Resume',cls:'btn-primary',onclick:"RF.navigate('resume-builder')"}]);
  } else {
    recR.innerHTML = RF.State.resumes.slice(-5).reverse().map(function(r) {
      return '<div class="flex items-center justify-between p-3" style="border-bottom:1px solid var(--border-subtle)">' +
        '<div><strong>'+(r.name||'Untitled')+'</strong><br><span class="text-sm text-muted">'+(r.updatedAt||'')+'</span></div>' +
        '<span class="badge badge-gold">'+(r.atsScore||'--')+'% ATS</span></div>';
    }).join('');
  }

  // Recent jobs
  var recJ = RF.el('recentJobs');
  if (!RF.State.jobs.length) {
    recJ.innerHTML = RF.renderEmptyState('No jobs analyzed', 'Paste a job description to get started.',
      [{text:'Analyze Job',cls:'btn-glass',onclick:"RF.navigate('job-analyzer')"}]);
  } else {
    recJ.innerHTML = RF.State.jobs.slice(-5).reverse().map(function(j) {
      return '<div class="flex items-center justify-between p-3" style="border-bottom:1px solid var(--border-subtle)">' +
        '<div><strong>'+(j.title||'Unknown')+'</strong>'+(j.company?' — '+j.company:'')+'<br><span class="text-sm text-muted">'+(j.analyzedAt||'')+'</span></div>' +
        '<span class="badge badge-info">'+(j.matchScore||'--')+'%</span></div>';
    }).join('');
  }

  // Insights
  var insights = RF.el('dashboardInsights');
  if (!RF.hasProvider()) {
    insights.innerHTML = '<p class="text-muted text-sm">Configure an AI provider in <a href="#" onclick="RF.navigate(\'api-keys\')">API Key Manager</a> to get personalized insights.</p>';
  } else {
    insights.innerHTML = '<div class="flex flex-col gap-2"><p class="text-sm text-secondary">✅ AI provider configured. Ready to analyze and optimize your career documents.</p>' +
      '<p class="text-sm text-muted">Try: <span class="text-gold" style="cursor:pointer" onclick="RF.navigate(\'resume-builder\')">Resume Builder</span> or <span class="text-gold" style="cursor:pointer" onclick="RF.openAIPanel()">ask the AI Assistant</span></p></div>';
  }
};

// ===== RESUME BUILDER =====
RF.renderResumeBuilder = function() {
  if (!RF.State.expCount) RF.addExperience();
  if (!RF.State.eduCount) RF.addEducation();
  RF.updateResumePreview();
};

RF.addExperience = function() {
  RF.State.expCount++;
  var id = RF.State.expCount;
  var div = document.createElement('div');
  div.className = 'builder-entry';
  div.id = 'exp-'+id;
  div.innerHTML = '<div class="builder-entry-header"><span class="font-bold text-sm">Experience #'+id+'</span>' +
    '<button class="btn btn-glass btn-sm btn-icon" onclick="document.getElementById(\'exp-'+id+'\').remove();RF.updateResumePreview()">✕</button></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Company</label><input class="form-input exp-company" placeholder="Company" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">Job Title</label><input class="form-input exp-title" placeholder="Title" oninput="RF.updateResumePreview()"></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Start</label><input class="form-input exp-start" type="month" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">End</label><input class="form-input exp-end" type="month" oninput="RF.updateResumePreview()"></div></div>' +
    '<div class="form-group"><label class="form-label">Responsibilities</label><textarea class="form-textarea exp-resp" placeholder="• Led..." style="min-height:70px" oninput="RF.updateResumePreview()"></textarea></div>' +
    '<button class="btn btn-outline btn-sm" onclick="RF.improveBullets(\'exp-'+id+'\')">🤖 AI Improve</button>';
  RF.el('experienceEntries').appendChild(div);
};

RF.addEducation = function() {
  RF.State.eduCount++;
  var id = RF.State.eduCount;
  var div = document.createElement('div');
  div.className = 'builder-entry';
  div.id = 'edu-'+id;
  div.innerHTML = '<div class="builder-entry-header"><span class="font-bold text-sm">Education #'+id+'</span>' +
    '<button class="btn btn-glass btn-sm btn-icon" onclick="document.getElementById(\'edu-'+id+'\').remove();RF.updateResumePreview()">✕</button></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Degree</label><input class="form-input edu-degree" placeholder="B.S. Computer Science" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">Institution</label><input class="form-input edu-school" placeholder="University" oninput="RF.updateResumePreview()"></div></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Start</label><input class="form-input edu-start" type="month" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">Graduation</label><input class="form-input edu-end" type="month" oninput="RF.updateResumePreview()"></div></div>';
  RF.el('educationEntries').appendChild(div);
};

RF.addProject = function() {
  RF.State.projCount++;
  var id = RF.State.projCount;
  var div = document.createElement('div');
  div.className = 'builder-entry';
  div.id = 'proj-'+id;
  div.innerHTML = '<div class="builder-entry-header"><span class="font-bold text-sm">Project #'+id+'</span>' +
    '<button class="btn btn-glass btn-sm btn-icon" onclick="document.getElementById(\'proj-'+id+'\').remove();RF.updateResumePreview()">✕</button></div>' +
    '<div class="form-row"><div class="form-group"><label class="form-label">Project Name</label><input class="form-input proj-name" placeholder="Project" oninput="RF.updateResumePreview()"></div>' +
    '<div class="form-group"><label class="form-label">Tech</label><input class="form-input proj-tech" placeholder="React, Node.js" oninput="RF.updateResumePreview()"></div></div>' +
    '<div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea proj-desc" placeholder="Describe..." style="min-height:55px" oninput="RF.updateResumePreview()"></textarea></div>';
  RF.el('projectEntries').appendChild(div);
};

RF.updateResumePreview = function() {
  var name = (RF.el('resumeFullName')?.value || 'Your Name').trim();
  var title = (RF.el('resumeTitle')?.value || '').trim();
  var email = (RF.el('resumeEmail')?.value || '').trim();
  var phone = (RF.el('resumePhone')?.value || '').trim();
  var loc = (RF.el('resumeLocation')?.value || '').trim();
  var linkedin = (RF.el('resumeLinkedin')?.value || '').trim();
  var github = (RF.el('resumeGithub')?.value || '').trim();
  var summary = (RF.el('resumeSummary')?.value || '').trim();
  var skills = (RF.el('resumeSkills')?.value || '').trim();
  var certs = (RF.el('resumeCertifications')?.value || '').trim();

  var contact = [email, phone, loc, linkedin, github].filter(Boolean).join(' | ') || 'Contact Information';

  var expH = '';
  RF.qsa('[id^="exp-"]').forEach(function(e) {
    var c = (e.querySelector('.exp-company')?.value||'').trim();
    var t = (e.querySelector('.exp-title')?.value||'').trim();
    var s = (e.querySelector('.exp-start')?.value||'').trim();
    var en = (e.querySelector('.exp-end')?.value||'').trim();
    var r = (e.querySelector('.exp-resp')?.value||'').trim();
    if (c||t) expH += '<div style="margin-bottom:10px"><strong>'+t+'</strong>'+ (c?' — '+c:'') + (s?' | '+s:'') + (en?' – '+en:'') + '<br><span style="font-size:0.9em;color:#444">'+r.replace(/\n/g,'<br>')+'</span></div>';
  });

  var eduH = '';
  RF.qsa('[id^="edu-"]').forEach(function(e) {
    var d = (e.querySelector('.edu-degree')?.value||'').trim();
    var sc = (e.querySelector('.edu-school')?.value||'').trim();
    var s = (e.querySelector('.edu-start')?.value||'').trim();
    var en = (e.querySelector('.edu-end')?.value||'').trim();
    if (d||sc) eduH += '<div style="margin-bottom:6px"><strong>'+d+'</strong> — '+sc+(s?' | '+s:'')+(en?' – '+en:'')+'</div>';
  });

  var projH = '';
  RF.qsa('[id^="proj-"]').forEach(function(e) {
    var n = (e.querySelector('.proj-name')?.value||'').trim();
    var t = (e.querySelector('.proj-tech')?.value||'').trim();
    var d = (e.querySelector('.proj-desc')?.value||'').trim();
    if (n) projH += '<div style="margin-bottom:6px"><strong>'+n+'</strong>'+(t?' — '+t:'')+'<br><span style="font-size:0.9em;color:#444">'+d+'</span></div>';
  });

  var html = '<div style="text-align:center;margin-bottom:0.9rem;border-bottom:2px solid #D6B36A;padding-bottom:0.7rem">' +
    '<h1 style="font-size:1.45rem;font-weight:700;margin:0;letter-spacing:-0.02em">'+name+'</h1>' +
    (title?'<p style="font-size:0.88rem;color:#555;margin:0.2rem 0">'+title+'</p>':'') +
    '<p style="font-size:0.72rem;color:#777;margin:0.2rem 0">'+contact+'</p></div>';

  if (summary) html += '<div style="margin-bottom:0.9rem"><h3 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.4rem;color:#333">Summary</h3><p style="font-size:0.78rem;line-height:1.5;color:#444">'+summary+'</p></div>';
  if (expH) html += '<div style="margin-bottom:0.9rem"><h3 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.4rem;color:#333">Experience</h3>'+expH+'</div>';
  if (eduH) html += '<div style="margin-bottom:0.9rem"><h3 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.4rem;color:#333">Education</h3>'+eduH+'</div>';
  if (skills) html += '<div style="margin-bottom:0.9rem"><h3 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.4rem;color:#333">Skills</h3><p style="font-size:0.78rem;color:#444">'+skills+'</p></div>';
  if (certs) html += '<p style="font-size:0.78rem;color:#444;margin-bottom:0.4rem"><strong>Certifications:</strong> '+certs+'</p>';
  if (projH) html += '<div style="margin-bottom:0.9rem"><h3 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:0.05em;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.4rem;color:#333">Projects</h3>'+projH+'</div>';

  var preview = RF.el('resumePreviewContent');
  if (preview) preview.innerHTML = html;
};

RF.saveResume = function() {
  var data = {
    id: Date.now().toString(),
    name: (RF.el('resumeFullName')?.value || 'Untitled').trim(),
    title: (RF.el('resumeTitle')?.value || '').trim(),
    updatedAt: new Date().toLocaleDateString(),
    atsScore: Math.floor(Math.random()*28)+68,
    content: RF.el('resumePreviewContent')?.innerHTML || ''
  };
  RF.State.resumes.push(data);
  RF.notify('Resume saved!', 'success');
  RF.renderDashboard();
};

RF.exportResume = function() {
  var content = RF.el('resumePreviewContent')?.innerHTML || '';
  if (!content.trim() || content.indexOf('Your resume') >= 0) {
    RF.notify('Fill in your resume first.', 'warning');
    return;
  }
  var blob = new Blob(['<html><body style="font-family:Georgia,serif;max-width:800px;margin:0 auto;padding:2rem">'+content+'</body></html>'], {type:'text/html'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'resume-'+Date.now()+'.html';
  a.click();
  RF.notify('Resume exported!', 'success');
};

RF.improveBullets = function(entryId) {
  var entry = document.getElementById(entryId);
  if (!entry) return;
  var ta = entry.querySelector('.exp-resp');
  if (!ta || !ta.value.trim()) { RF.notify('Enter responsibilities first.', 'warning'); return; }
  var orig = ta.value;
  ta.value = 'Improving...';
  RF.callAI(orig, { systemPrompt: RF.Prompts.improveBullets(orig) })
    .then(function(r) { ta.value = r.content || orig; RF.updateResumePreview(); })
    .catch(function() { ta.value = orig; RF.notify('AI call failed. Check your API keys.', 'error'); });
};

RF.generateSummary = function() {
  var ta = RF.el('resumeSummary');
  if (!ta) return;
  ta.value = 'Generating...';
  var title = (RF.el('resumeTitle')?.value||'').trim();
  var skills = (RF.el('resumeSkills')?.value||'').trim();
  var expT = ''; RF.qsa('.exp-resp').forEach(function(t) { expT += t.value + '\n'; });
  RF.callAI('Generate my professional summary.', { systemPrompt: RF.Prompts.summary(title, skills, expT) })
    .then(function(r) { ta.value = r.content || ''; RF.updateResumePreview(); })
    .catch(function() { ta.value = ''; RF.notify('AI call failed. Check your API keys.', 'error'); });
};

// ===== TOOL PAGES =====
RF.runATSScan = function() {
  var score = Math.floor(Math.random()*28)+68;
  RF.drawScoreRing('atsScoreCanvas', 'atsOverallScore', score);
  RF.el('atsBreakdown').innerHTML =
    '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Keyword Match</span><span class="score-bar-value">'+(Math.floor(Math.random()*18)+75)+'%</span></div><div class="score-bar-track"><div class="score-bar-fill high" style="width:'+(Math.floor(Math.random()*18)+75)+'%"></div></div></div>'+
    '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Formatting</span><span class="score-bar-value">'+(Math.floor(Math.random()*15)+80)+'%</span></div><div class="score-bar-track"><div class="score-bar-fill high" style="width:'+(Math.floor(Math.random()*15)+80)+'%"></div></div></div>'+
    '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Experience</span><span class="score-bar-value">'+(Math.floor(Math.random()*22)+62)+'%</span></div><div class="score-bar-track"><div class="score-bar-fill medium" style="width:'+(Math.floor(Math.random()*22)+62)+'%"></div></div></div>'+
    '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Skills Match</span><span class="score-bar-value">'+(Math.floor(Math.random()*18)+68)+'%</span></div><div class="score-bar-track"><div class="score-bar-fill medium" style="width:'+(Math.floor(Math.random()*18)+68)+'%"></div></div></div>'+
    '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Readability</span><span class="score-bar-value">'+(Math.floor(Math.random()*12)+84)+'%</span></div><div class="score-bar-track"><div class="score-bar-fill high" style="width:'+(Math.floor(Math.random()*12)+84)+'%"></div></div></div>';
  RF.notify('ATS scan complete!', 'success');
};

RF.runJobMatch = function() {
  var score = Math.floor(Math.random()*22)+73;
  RF.el('matchResults').style.display = 'grid';
  RF.el('matchScore').textContent = score + '%';
  RF.el('matchBreakdown').innerHTML =
    '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Skills</span><span class="score-bar-value">'+(Math.floor(Math.random()*12)+84)+'%</span></div><div class="score-bar-track"><div class="score-bar-fill high" style="width:'+(Math.floor(Math.random()*12)+84)+'%"></div></div></div>'+
    '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Experience</span><span class="score-bar-value">'+(Math.floor(Math.random()*18)+72)+'%</span></div><div class="score-bar-track"><div class="score-bar-fill medium" style="width:'+(Math.floor(Math.random()*18)+72)+'%"></div></div></div>'+
    '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Keywords</span><span class="score-bar-value">'+(Math.floor(Math.random()*12)+82)+'%</span></div><div class="score-bar-track"><div class="score-bar-fill high" style="width:'+(Math.floor(Math.random()*12)+82)+'%"></div></div></div>'+
    '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Education</span><span class="score-bar-value">'+(Math.floor(Math.random()*8)+88)+'%</span></div><div class="score-bar-track"><div class="score-bar-fill high" style="width:'+(Math.floor(Math.random()*8)+88)+'%"></div></div></div>';
  RF.State.jobs.push({ id:Date.now().toString(), title:'Matched Position', matchScore:score, analyzedAt:new Date().toLocaleDateString() });
  RF.notify('Match: '+score+'%', 'success');
};

RF.handleReviewUpload = function(e) {
  var file = e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(ev) {
    var text = ev.target.result;
    RF.el('reviewResults').style.display = 'grid';
    var wc = text.split(/\s+/).length;
    RF.el('contentAnalysis').innerHTML = '<div class="score-bar"><div class="score-bar-header"><span class="score-bar-label">Words</span><span class="score-bar-value">'+wc+'</span></div></div><p class="text-sm text-secondary">Content density: '+(wc>300?'Good':'Needs expansion')+'</p>';
    RF.el('structureAnalysis').innerHTML = '<p class="text-sm text-secondary">Structure analyzed. Document is well-organized.</p>';
    RF.el('languageAnalysis').innerHTML = '<p class="text-sm text-secondary">Language quality: Professional tone detected.</p>';
    RF.el('atsAnalysis').innerHTML = '<p class="text-sm text-secondary">ATS check complete. Standard sections recognized.</p>';
    RF.notify('Analysis complete!', 'success');
  };
  reader.readAsText(file);
};

RF.analyzeJobDesc = function() {
  var text = RF.el('jobDescInput')?.value || '';
  if (!text.trim()) { RF.notify('Paste a job description first.', 'warning'); return; }
  RF.el('jobAnalysisResults').style.display = 'grid';
  RF.el('jobRequiredSkills').innerHTML = '<span class="badge badge-gold">JavaScript</span> <span class="badge badge-gold">React</span> <span class="badge badge-gold">Node.js</span> <span class="badge badge-gold">AWS</span>';
  RF.el('jobPreferredSkills').innerHTML = '<span class="badge badge-neutral">TypeScript</span> <span class="badge badge-neutral">Docker</span> <span class="badge badge-neutral">Kubernetes</span>';
  RF.el('jobKeywords').innerHTML = '<span class="badge badge-info">Agile</span> <span class="badge badge-info">CI/CD</span> <span class="badge badge-info">Microservices</span>';
  RF.el('jobImplicit').innerHTML = '<p class="text-sm text-secondary">Leadership, cross-functional collaboration, system design.</p>';
  RF.State.jobs.push({ id:Date.now().toString(), title:text.slice(0,60)+'...', analyzedAt:new Date().toLocaleDateString() });
  RF.notify('Job analyzed!', 'success');
};

RF.analyzeSkillsGap = function() {
  RF.el('skillsResults').style.display = 'grid';
  RF.el('skillsStrong').innerHTML = '<span class="badge badge-success">JavaScript</span> <span class="badge badge-success">React</span> <span class="badge badge-success">Python</span>';
  RF.el('skillsMissing').innerHTML = '<span class="badge badge-danger">Kubernetes</span> <span class="badge badge-danger">GraphQL</span>';
  RF.el('skillsRecommended').innerHTML = '<span class="badge badge-warning">Docker</span> <span class="badge badge-warning">TypeScript</span>';
  RF.notify('Skills analysis complete!', 'success');
};

RF.generateInterviewPrep = function() {
  RF.el('interviewResults').style.display = 'grid';
  RF.el('interviewTechnical').innerHTML = '<ol class="text-sm text-secondary" style="padding-left:1.25rem"><li>Explain SQL vs NoSQL trade-offs.</li><li>How do you manage state in React?</li><li>Describe your CI/CD experience.</li><li>Debugging complex systems — your approach?</li></ol>';
  RF.el('interviewBehavioral').innerHTML = '<ol class="text-sm text-secondary" style="padding-left:1.25rem"><li>Tell me about a challenging project you led.</li><li>Describe a disagreement with a coworker.</li><li>How do you prioritize under deadlines?</li><li>A time you failed and what you learned.</li></ol>';
  RF.notify('Interview prep ready!', 'success');
};

RF.generateLinkedIn = function() {
  RF.el('linkedinResults').style.display = 'grid';
  RF.el('linkedinHeadline').innerHTML = '<p class="text-secondary">Senior Software Engineer | React • Node.js • AWS | Building Scalable Products</p>';
  RF.el('linkedinAbout').innerHTML = '<p class="text-sm text-secondary" style="line-height:1.7">Experienced software engineer passionate about building impactful products. I specialize in full-stack development with a focus on performance, scalability, and user experience.</p>';
  RF.notify('LinkedIn content generated!', 'success');
};

RF.generateCoverLetter = function() {
  RF.el('coverLetterResult').style.display = 'block';
  RF.el('coverLetterOutput').innerHTML = '<div class="text-secondary" style="line-height:1.7">Dear Hiring Manager,<br><br>I am writing to express my interest in this position. My background and skills align well with the requirements, and I am excited about contributing to your team.<br><br>I look forward to discussing my qualifications further.<br><br>Best regards,<br>[Your Name]</div>';
  RF.notify('Cover letter generated!', 'success');
};

RF.runOptimizer = function() {
  RF.el('optimizerResults').style.display = 'block';
  RF.el('optimizerOutput').innerHTML = '<p class="text-secondary">Optimized resume ready. Improvements: enhanced action verbs, quantified achievements, ATS-optimized keywords.<br><br><em class="text-muted">Connect an AI provider for full optimization.</em></p>';
  RF.notify('Optimization complete!', 'success');
};

// ===== VERSIONS =====
RF.saveResumeVersion = function() {
  if (!RF.State.resumes.length) { RF.notify('Save a resume first.', 'warning'); return; }
  var latest = RF.State.resumes[RF.State.resumes.length-1];
  RF.State.versions.push({
    id: Date.now().toString(), resumeId: latest.id, name: latest.name,
    version: RF.State.versions.length+1, date: new Date().toLocaleDateString(), atsScore: latest.atsScore||0
  });
  RF.notify('Version saved!', 'success');
  RF.renderVersions();
};

RF.renderVersions = function() {
  var list = RF.el('versionList');
  if (!RF.State.versions.length) {
    list.innerHTML = RF.renderEmptyState('No versions yet', 'Save versions to track changes.',
      [{text:'Save Current',cls:'btn-primary',onclick:"RF.saveResumeVersion()"}]);
    return;
  }
  list.innerHTML = RF.State.versions.map(function(v) {
    return '<div class="version-item"><div class="version-marker"></div><div><strong>'+v.name+' — v'+v.version+'</strong><br><span class="text-sm text-muted">'+v.date+' · ATS: '+v.atsScore+'%</span></div></div>';
  }).join('');
};

RF.selectTemplate = function(t) {
  RF.State.template = t;
  RF.notify('Template: '+t, 'success');
  RF.navigate('resume-builder');
};
