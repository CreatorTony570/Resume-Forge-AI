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
      /* ── FREE TIER (verified live August 2026) ── */
      'openrouter/free',
      'google/gemma-4-31b-it:free',
      'google/gemma-4-26b-a4b-it:free',
      'nvidia/nemotron-3-ultra-550b-a55b:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
      'nvidia/nemotron-3-nano-30b-a3b:free',
      'openai/gpt-oss-20b:free',
      'poolside/laguna-xs-2.1:free',
      'poolside/laguna-s-2.1:free',
      'cohere/north-mini-code:free',
      /* ── BUDGET / LOW COST ── */
      'openai/gpt-5-nano',
      'openai/gpt-5-mini',
      'openai/gpt-5.4-mini',
      'anthropic/claude-haiku-4.5',
      'deepseek/deepseek-chat',
      'deepseek/deepseek-v4-flash-0731',
      'meta-llama/llama-3.3-70b-instruct',
      'google/gemini-2.5-flash-lite',
      /* ── PREMIUM ── */
      'openai/gpt-5',
      'openai/gpt-5.6-sol',
      'openai/gpt-5.4',
      'anthropic/claude-sonnet-5',
      'anthropic/claude-opus-5',
      'anthropic/claude-sonnet-4.6',
      'google/gemini-2.5-flash',
      'google/gemini-2.5-pro',
      'deepseek/deepseek-v4-pro'
    ],
    freeModels: [
      'openrouter/free',
      'google/gemma-4-31b-it:free',
      'google/gemma-4-26b-a4b-it:free',
      'nvidia/nemotron-3-ultra-550b-a55b:free',
      'nvidia/nemotron-3-super-120b-a12b:free',
      'nvidia/nemotron-3-nano-30b-a3b:free',
      'openai/gpt-oss-20b:free',
      'poolside/laguna-xs-2.1:free',
      'poolside/laguna-s-2.1:free',
      'cohere/north-mini-code:free'
    ],
    categories: {
      'openrouter/free':                        { speed:'fast',      capability:'strong',   cost:'free' },
      'google/gemma-4-31b-it:free':             { speed:'fast',      capability:'strong',   cost:'free' },
      'google/gemma-4-26b-a4b-it:free':         { speed:'fast',      capability:'strong',   cost:'free' },
      'nvidia/nemotron-3-ultra-550b-a55b:free': { speed:'moderate',  capability:'advanced', cost:'free' },
      'nvidia/nemotron-3-super-120b-a12b:free': { speed:'fast',      capability:'strong',   cost:'free' },
      'nvidia/nemotron-3-nano-30b-a3b:free':    { speed:'very-fast', capability:'basic',    cost:'free' },
      'openai/gpt-oss-20b:free':                { speed:'fast',      capability:'basic',    cost:'free' },
      'poolside/laguna-xs-2.1:free':            { speed:'fast',      capability:'strong',   cost:'free' },
      'poolside/laguna-s-2.1:free':             { speed:'moderate',  capability:'strong',   cost:'free' },
      'cohere/north-mini-code:free':            { speed:'fast',      capability:'strong',   cost:'free' },
      'openai/gpt-5-nano':                      { speed:'very-fast', capability:'basic',    cost:'low'  },
      'openai/gpt-5-mini':                      { speed:'very-fast', capability:'strong',   cost:'low'  },
      'openai/gpt-5.4-mini':                    { speed:'fast',      capability:'strong',   cost:'low'  },
      'anthropic/claude-haiku-4.5':             { speed:'very-fast', capability:'strong',   cost:'low'  },
      'deepseek/deepseek-chat':                 { speed:'fast',      capability:'advanced', cost:'low'  },
      'deepseek/deepseek-v4-flash-0731':        { speed:'fast',      capability:'strong',   cost:'low'  },
      'meta-llama/llama-3.3-70b-instruct':      { speed:'fast',      capability:'strong',   cost:'low'  },
      'google/gemini-2.5-flash-lite':           { speed:'very-fast', capability:'strong',   cost:'low'  },
      'openai/gpt-5':                           { speed:'fast',      capability:'advanced', cost:'paid' },
      'openai/gpt-5.6-sol':                     { speed:'fast',      capability:'advanced', cost:'paid' },
      'openai/gpt-5.4':                         { speed:'fast',      capability:'advanced', cost:'paid' },
      'anthropic/claude-sonnet-5':              { speed:'fast',      capability:'advanced', cost:'paid' },
      'anthropic/claude-opus-5':                { speed:'moderate',  capability:'advanced', cost:'paid' },
      'anthropic/claude-sonnet-4.6':            { speed:'fast',      capability:'advanced', cost:'paid' },
      'google/gemini-2.5-flash':                { speed:'fast',      capability:'advanced', cost:'paid' },
      'google/gemini-2.5-pro':                  { speed:'moderate',  capability:'advanced', cost:'paid' },
      'deepseek/deepseek-v4-pro':               { speed:'fast',      capability:'advanced', cost:'low'  }
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
