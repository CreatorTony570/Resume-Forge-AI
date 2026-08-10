/* ResumeForge AI — Configuration & Constants (v5 — Upgraded) */
window.RF = window.RF || {}; var RF = window.RF;

RF.PROVIDERS = {
  openai: {
    name: 'OpenAI', icon: '⚡', color: '#10A37F',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o','gpt-4o-mini','gpt-4-turbo','gpt-4-turbo-preview','gpt-3.5-turbo','gpt-3.5-turbo-16k'],
    freeModels: [],
    categories: {
      'gpt-4o':              { speed:'fast',     capability:'advanced', cost:'paid' },
      'gpt-4o-mini':         { speed:'fast',     capability:'strong',   cost:'low'  },
      'gpt-4-turbo':         { speed:'moderate', capability:'advanced', cost:'paid' },
      'gpt-4-turbo-preview': { speed:'moderate', capability:'advanced', cost:'paid' },
      'gpt-3.5-turbo':       { speed:'fast',     capability:'basic',    cost:'low'  },
      'gpt-3.5-turbo-16k':   { speed:'fast',     capability:'basic',    cost:'low'  }
    }
  },
  anthropic: {
    name: 'Anthropic', icon: '🧬', color: '#D97757',
    baseUrl: 'https://api.anthropic.com/v1',
    models: [
      'claude-3-5-sonnet-20241022','claude-3-5-haiku-20241022',
      'claude-3-opus-20240229','claude-3-sonnet-20240229','claude-3-haiku-20240307'
    ],
    freeModels: [],
    categories: {
      'claude-3-5-sonnet-20241022': { speed:'fast',     capability:'advanced', cost:'paid' },
      'claude-3-5-haiku-20241022':  { speed:'very-fast',capability:'strong',   cost:'low'  },
      'claude-3-opus-20240229':     { speed:'slow',     capability:'advanced', cost:'paid' },
      'claude-3-sonnet-20240229':   { speed:'moderate', capability:'strong',   cost:'paid' },
      'claude-3-haiku-20240307':    { speed:'fast',     capability:'strong',   cost:'low'  }
    }
  },
  gemini: {
    name: 'Google Gemini', icon: '🔷', color: '#4285F4',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      'gemini-2.0-flash','gemini-2.0-flash-exp','gemini-1.5-pro',
      'gemini-1.5-flash','gemini-1.5-flash-8b'
    ],
    freeModels: ['gemini-2.0-flash','gemini-2.0-flash-exp','gemini-1.5-flash','gemini-1.5-flash-8b'],
    categories: {
      'gemini-2.0-flash':     { speed:'very-fast', capability:'strong',   cost:'free' },
      'gemini-2.0-flash-exp': { speed:'very-fast', capability:'advanced', cost:'free' },
      'gemini-1.5-pro':       { speed:'moderate',  capability:'advanced', cost:'paid' },
      'gemini-1.5-flash':     { speed:'fast',      capability:'strong',   cost:'free' },
      'gemini-1.5-flash-8b':  { speed:'very-fast', capability:'basic',    cost:'free' }
    }
  },
  openrouter: {
    name: 'OpenRouter', icon: '🌐', color: '#6C4DF6',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: [
      /* ── FREE TIER ── */
      'google/gemini-2.0-flash-exp:free',
      'google/gemini-flash-1.5-8b',
      'meta-llama/llama-3.2-3b-instruct:free',
      'meta-llama/llama-3.1-8b-instruct:free',
      'meta-llama/llama-3.2-1b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'qwen/qwen-2-7b-instruct:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'nousresearch/hermes-3-llama-3.1-405b:free',
      /* ── PAID / PREMIUM ── */
      'openai/gpt-4o',
      'openai/gpt-4o-mini',
      'anthropic/claude-3.5-sonnet',
      'anthropic/claude-3.5-haiku',
      'google/gemini-pro-1.5',
      'meta-llama/llama-3.1-405b-instruct',
      'meta-llama/llama-3.1-70b-instruct',
      'mistralai/mistral-large',
      'mistralai/mixtral-8x22b-instruct',
      'deepseek/deepseek-chat',
      'cohere/command-r-plus'
    ],
    freeModels: [
      'google/gemini-2.0-flash-exp:free',
      'google/gemini-flash-1.5-8b',
      'meta-llama/llama-3.2-3b-instruct:free',
      'meta-llama/llama-3.1-8b-instruct:free',
      'meta-llama/llama-3.2-1b-instruct:free',
      'mistralai/mistral-7b-instruct:free',
      'qwen/qwen-2-7b-instruct:free',
      'microsoft/phi-3-mini-128k-instruct:free',
      'nousresearch/hermes-3-llama-3.1-405b:free'
    ],
    categories: {
      'google/gemini-2.0-flash-exp:free':          { speed:'very-fast', capability:'strong',   cost:'free' },
      'google/gemini-flash-1.5-8b':                { speed:'very-fast', capability:'basic',    cost:'free' },
      'meta-llama/llama-3.2-3b-instruct:free':     { speed:'very-fast', capability:'basic',    cost:'free' },
      'meta-llama/llama-3.1-8b-instruct:free':     { speed:'fast',      capability:'strong',   cost:'free' },
      'meta-llama/llama-3.2-1b-instruct:free':     { speed:'very-fast', capability:'basic',    cost:'free' },
      'mistralai/mistral-7b-instruct:free':        { speed:'fast',      capability:'strong',   cost:'free' },
      'qwen/qwen-2-7b-instruct:free':              { speed:'fast',      capability:'strong',   cost:'free' },
      'microsoft/phi-3-mini-128k-instruct:free':   { speed:'fast',      capability:'basic',    cost:'free' },
      'nousresearch/hermes-3-llama-3.1-405b:free': { speed:'moderate',  capability:'advanced', cost:'free' },
      'openai/gpt-4o':                             { speed:'fast',      capability:'advanced', cost:'paid' },
      'openai/gpt-4o-mini':                        { speed:'fast',      capability:'strong',   cost:'low'  },
      'anthropic/claude-3.5-sonnet':               { speed:'moderate',  capability:'advanced', cost:'paid' },
      'anthropic/claude-3.5-haiku':                { speed:'very-fast', capability:'strong',   cost:'low'  },
      'google/gemini-pro-1.5':                     { speed:'moderate',  capability:'advanced', cost:'paid' },
      'meta-llama/llama-3.1-405b-instruct':        { speed:'moderate',  capability:'advanced', cost:'paid' },
      'meta-llama/llama-3.1-70b-instruct':         { speed:'fast',      capability:'strong',   cost:'paid' },
      'mistralai/mistral-large':                   { speed:'moderate',  capability:'advanced', cost:'paid' },
      'mistralai/mixtral-8x22b-instruct':          { speed:'moderate',  capability:'advanced', cost:'paid' },
      'deepseek/deepseek-chat':                    { speed:'fast',      capability:'advanced', cost:'low'  },
      'cohere/command-r-plus':                     { speed:'fast',      capability:'advanced', cost:'paid' }
    }
  },
  groq: {
    name: 'Groq', icon: '🚀', color: '#F55036',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: [
      'llama-3.3-70b-versatile','llama-3.1-70b-versatile','llama-3.1-8b-instant',
      'llama3-70b-8192','llama3-8b-8192',
      'mixtral-8x7b-32768','gemma2-9b-it','gemma-7b-it'
    ],
    freeModels: ['llama-3.1-8b-instant','llama3-8b-8192','gemma-7b-it'],
    categories: {
      'llama-3.3-70b-versatile':  { speed:'very-fast', capability:'advanced', cost:'paid' },
      'llama-3.1-70b-versatile':  { speed:'very-fast', capability:'strong',   cost:'paid' },
      'llama-3.1-8b-instant':     { speed:'very-fast', capability:'basic',    cost:'free' },
      'llama3-70b-8192':          { speed:'very-fast', capability:'strong',   cost:'paid' },
      'llama3-8b-8192':           { speed:'very-fast', capability:'basic',    cost:'free' },
      'mixtral-8x7b-32768':       { speed:'very-fast', capability:'strong',   cost:'paid' },
      'gemma2-9b-it':             { speed:'very-fast', capability:'strong',   cost:'paid' },
      'gemma-7b-it':              { speed:'very-fast', capability:'basic',    cost:'free' }
    }
  },
  mistral: {
    name: 'Mistral AI', icon: '🌪️', color: '#FF7000',
    baseUrl: 'https://api.mistral.ai/v1',
    models: [
      'mistral-large-latest','mistral-medium-latest','mistral-small-latest',
      'open-mistral-7b','open-mixtral-8x7b','open-mixtral-8x22b','codestral-latest'
    ],
    freeModels: [],
    categories: {
      'mistral-large-latest':  { speed:'moderate',  capability:'advanced', cost:'paid' },
      'mistral-medium-latest': { speed:'fast',      capability:'strong',   cost:'paid' },
      'mistral-small-latest':  { speed:'fast',      capability:'strong',   cost:'low'  },
      'open-mistral-7b':       { speed:'fast',      capability:'basic',    cost:'low'  },
      'open-mixtral-8x7b':     { speed:'moderate',  capability:'strong',   cost:'paid' },
      'open-mixtral-8x22b':    { speed:'moderate',  capability:'advanced', cost:'paid' },
      'codestral-latest':      { speed:'fast',      capability:'advanced', cost:'paid' }
    }
  },
  cohere: {
    name: 'Cohere', icon: '🔮', color: '#39594D',
    baseUrl: 'https://api.cohere.ai/v1',
    models: ['command-r-plus','command-r','command','command-light'],
    freeModels: [],
    categories: {
      'command-r-plus':  { speed:'moderate', capability:'advanced', cost:'paid' },
      'command-r':       { speed:'fast',     capability:'strong',   cost:'paid' },
      'command':         { speed:'fast',     capability:'strong',   cost:'low'  },
      'command-light':   { speed:'fast',     capability:'basic',    cost:'low'  }
    }
  }
};

RF.COMMANDS = [
  { name:'Create Resume',        icon:'📄', page:'resume-builder' },
  { name:'Review Resume',        icon:'🔍', page:'resume-review' },
  { name:'Scan ATS',             icon:'📊', page:'ats-scanner' },
  { name:'Match Job',            icon:'🎯', page:'job-matcher' },
  { name:'Optimize Resume',      icon:'⚡', page:'resume-optimizer' },
  { name:'Generate Cover Letter',icon:'✉️', page:'cover-letter' },
  { name:'Analyze Job Desc',     icon:'📋', page:'job-analyzer' },
  { name:'Skills Gap Analysis',  icon:'🧩', page:'skills-analyzer' },
  { name:'Interview Prep',       icon:'🎤', page:'interview-prep' },
  { name:'LinkedIn Optimizer',   icon:'💼', page:'linkedin-optimizer' },
  { name:'Salary Negotiation',   icon:'💰', page:'salary-negotiation' },
  { name:'Job Application Tracker', icon:'📌', page:'job-tracker' },
  { name:'AI Model Center',      icon:'🧠', page:'ai-model-center' },
  { name:'API Key Manager',      icon:'🔑', page:'api-keys' },
  { name:'Open AI Assistant',    icon:'🤖', action:'openAI' },
  { name:'Export Resume PDF',    icon:'📥', action:'export' },
  { name:'Save Resume',          icon:'💾', action:'save' }
];

RF.PAGE_TITLES = {
  'dashboard':'Dashboard','resume-builder':'Resume Builder','resume-review':'Resume Review Engine',
  'ats-scanner':'ATS Scanner','job-matcher':'Job Matcher','resume-optimizer':'Resume Optimizer',
  'cover-letter':'Cover Letter Generator','job-analyzer':'Job Description Analyzer',
  'skills-analyzer':'Skills Gap Analyzer','interview-prep':'Interview Preparation',
  'linkedin-optimizer':'LinkedIn Optimizer','salary-negotiation':'Salary Negotiation Coach',
  'job-tracker':'Job Application Tracker',
  'resume-templates':'Resume Templates','resume-versions':'Version History',
  'ai-model-center':'AI Model Center','api-keys':'API Key Manager',
  'usage-analytics':'Usage & Analytics','settings':'Settings','privacy-security':'Privacy & Security'
};
