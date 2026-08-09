/* ResumeForge AI — Configuration & Constants */

window.RF = window.RF || {}; var RF = window.RF;

RF.PROVIDERS = {
  openai: {
    name: 'OpenAI', icon: '⚡', color: '#10A37F',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o','gpt-4o-mini','gpt-4-turbo','gpt-3.5-turbo'],
    freeModels: [],
    categories: {
      'gpt-4o': { speed:'fast', capability:'advanced', cost:'paid' },
      'gpt-4o-mini': { speed:'fast', capability:'strong', cost:'low' },
      'gpt-4-turbo': { speed:'moderate', capability:'advanced', cost:'paid' },
      'gpt-3.5-turbo': { speed:'fast', capability:'basic', cost:'low' }
    }
  },
  anthropic: {
    name: 'Anthropic', icon: '🧬', color: '#D97757',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-5-sonnet-20241022','claude-3-opus-20240229','claude-3-haiku-20240307'],
    freeModels: [],
    categories: {
      'claude-3-5-sonnet-20241022': { speed:'moderate', capability:'advanced', cost:'paid' },
      'claude-3-opus-20240229': { speed:'slow', capability:'advanced', cost:'paid' },
      'claude-3-haiku-20240307': { speed:'fast', capability:'strong', cost:'low' }
    }
  },
  gemini: {
    name: 'Google Gemini', icon: '🔷', color: '#4285F4',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: ['gemini-1.5-pro','gemini-1.5-flash','gemini-2.0-flash'],
    freeModels: ['gemini-1.5-flash','gemini-2.0-flash'],
    categories: {
      'gemini-1.5-pro': { speed:'moderate', capability:'advanced', cost:'paid' },
      'gemini-1.5-flash': { speed:'fast', capability:'strong', cost:'free' },
      'gemini-2.0-flash': { speed:'fast', capability:'strong', cost:'free' }
    }
  },
  openrouter: {
    name: 'OpenRouter', icon: '🌐', color: '#6C4DF6',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['openai/gpt-4o','anthropic/claude-3.5-sonnet','google/gemini-2.0-flash-001','meta-llama/llama-3.1-405b-instruct'],
    freeModels: ['google/gemini-2.0-flash-001'],
    categories: {
      'openai/gpt-4o': { speed:'fast', capability:'advanced', cost:'paid' },
      'anthropic/claude-3.5-sonnet': { speed:'moderate', capability:'advanced', cost:'paid' },
      'google/gemini-2.0-flash-001': { speed:'fast', capability:'strong', cost:'free' },
      'meta-llama/llama-3.1-405b-instruct': { speed:'moderate', capability:'advanced', cost:'paid' }
    }
  },
  groq: {
    name: 'Groq', icon: '⚡', color: '#F55036',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.1-70b-versatile','llama-3.1-8b-instant','mixtral-8x7b-32768'],
    freeModels: ['llama-3.1-8b-instant'],
    categories: {
      'llama-3.1-70b-versatile': { speed:'fast', capability:'strong', cost:'paid' },
      'llama-3.1-8b-instant': { speed:'very-fast', capability:'basic', cost:'free' },
      'mixtral-8x7b-32768': { speed:'fast', capability:'strong', cost:'paid' }
    }
  }
};

RF.COMMANDS = [
  { name:'Create Resume',       icon:'📄', page:'resume-builder' },
  { name:'Review Resume',       icon:'🔍', page:'resume-review' },
  { name:'Scan ATS',            icon:'📊', page:'ats-scanner' },
  { name:'Match Job',           icon:'🎯', page:'job-matcher' },
  { name:'Optimize Resume',     icon:'⚡', page:'resume-optimizer' },
  { name:'Generate Cover Let.', icon:'✉️', page:'cover-letter' },
  { name:'Analyze Job Desc',    icon:'📋', page:'job-analyzer' },
  { name:'Skills Gap Analysis', icon:'🧩', page:'skills-analyzer' },
  { name:'Interview Prep',      icon:'🎤', page:'interview-prep' },
  { name:'LinkedIn Optimizer',  icon:'💼', page:'linkedin-optimizer' },
  { name:'AI Model Center',     icon:'🧠', page:'ai-model-center' },
  { name:'API Key Manager',     icon:'🔑', page:'api-keys' },
  { name:'Open AI Assistant',   icon:'🤖', action:'openAI' },
  { name:'Export Resume',       icon:'📥', action:'export' },
  { name:'Save Resume',         icon:'💾', action:'save' }
];

RF.PAGE_TITLES = {
  'dashboard':'Dashboard','resume-builder':'Resume Builder','resume-review':'Resume Review',
  'ats-scanner':'ATS Scanner','job-matcher':'Job Matcher','resume-optimizer':'Resume Optimizer',
  'cover-letter':'Cover Letter','job-analyzer':'Job Analyzer','skills-analyzer':'Skills Analyzer',
  'interview-prep':'Interview Prep','linkedin-optimizer':'LinkedIn Optimizer',
  'resume-templates':'Templates','resume-versions':'Versions','ai-model-center':'AI Model Center',
  'api-keys':'API Keys','usage-analytics':'Usage & Analytics','settings':'Settings',
  'privacy-security':'Privacy & Security'
};
