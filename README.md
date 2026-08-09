# ResumeForge AI

> **Intelligent Resume Engineering & Career Optimization**  
> *Build a Resume That Gets Read. Optimize It to Get Hired.*

[![Netlify Status](https://api.netlify.com/api/v1/badges/00000000-0000-0000-0000-000000000000/deploy-status)](https://app.netlify.com/sites/resumeforge/deploys)
[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](./LICENSE)

---

## 🚀 Overview

ResumeForge AI is a production-grade, privacy-first **AI Career Intelligence Platform** that helps professionals build, analyze, optimize, and match resumes with surgical precision. Think of it as a **command center for your career** — not just another resume builder.

### What Makes It Different

| Feature | ResumeForge AI | Typical Resume Tools |
|---------|---------------|---------------------|
| AI Providers | **5 native + custom** | One locked-in model |
| API Keys | **Bring Your Own** (BYOK) | Hidden costs |
| Model Routing | **Auto/Quality/Speed/Economy/Manual** | N/A |
| Fallback | **Automatic provider cascade** | Crashes silently |
| Data Privacy | **100% client-side** (localStorage) | Uploads to servers |
| Security | CSP, HSTS, XSS hardened | Minimal |
| Templates | **6 professional templates** | 1-2 generic |
| ATS Analysis | **Multi-dimensional scoring** | Basic keyword check |

---

## 📦 Project Structure

```
resumeforge/
├── index.html              # Landing page + floating UI
├── app.html                # Dashboard shell (loaded async)
├── sw.js                   # Service Worker (offline support)
├── manifest.json           # PWA manifest
├── robots.txt              # Crawl directives
├── security.txt            # Security contact
├── sitemap.xml             # SEO sitemap
│
├── css/
│   ├── design.css          # Design tokens, reset, utilities
│   ├── components.css      # Buttons, cards, forms, badges
│   └── pages.css           # Layout, landing, responsive
│
├── js/
│   ├── config.js           # Provider configs, commands
│   ├── state.js            # State management + persistence
│   ├── ui.js               # Notifications, modals, rendering
│   ├── security.js         # XSS prevention, key masking, integrity
│   ├── ai.js               # AI provider abstraction + fallback
│   ├── router.js           # SPA navigation + keyboard shortcuts
│   ├── pages.js            # All 19 page renderers
│   ├── models.js           # API key manager + model center
│   ├── assistant.js        # CareerAI chat, commands, usage
│   ├── three-bg.js         # Three.js animated background
│   └── app.js              # Entry point — wires everything
│
├── .htaccess               # Apache security + caching
├── _headers                # Netlify security headers
├── _redirects              # Netlify SPA redirects
├── netlify.toml            # Netlify deployment config
├── vercel.json             # Vercel deployment config
├── .gitignore              # Git ignore rules
├── package.json            # Project metadata
├── LICENSE                 # License
└── README.md               # This file
```

---

## 🔐 Security Architecture

### Defense in Depth

1. **Content Security Policy** — strict CSP headers prevent XSS, data exfiltration
2. **BYOK Architecture** — API keys stored only in `localStorage`, never on servers
3. **Input Sanitization** — `RF.Security.escapeHTML()` / `stripTags()` on all user input
4. **Key Masking** — stored keys are displayed as `sk-xx••••••••xxxx`
5. **No Telemetry** — zero tracking, zero analytics, zero data collection
6. **HTTPS Enforced** — HSTS preload-ready headers
7. **Clickjacking Prevention** — `X-Frame-Options: DENY`
8. **MIME Sniffing Prevention** — `X-Content-Type-Options: nosniff`
9. **Integrity Verification** — localStorage corruption detection on boot
10. **Service Worker** — offline resilience without data leakage

### API Key Handling

```
User enters key → Stored in localStorage (browser only)
                 → Never sent to ResumeForge servers
                 → Sent directly from browser → AI provider
                 → Displayed masked: sk-xx••••••••xxxx
                 → Wiped on "Delete My Data"
```

---

## 🤖 AI Providers

| Provider | Models | Free Tier | Best For |
|----------|--------|-----------|----------|
| **OpenAI** | GPT-4o, GPT-4o-mini | No | Advanced reasoning |
| **Anthropic** | Claude 3.5 Sonnet | No | Detailed analysis |
| **Google Gemini** | Gemini 1.5/2.0 Flash | **Yes** | Speed + quality |
| **OpenRouter** | 200+ models | **Yes** (Gemini Flash) | Model variety |
| **Groq** | Llama 3.1, Mixtral | **Yes** (8B) | Fastest inference |
| **Custom** | Any OpenAI-compatible | Varies | Local models, proxies |

---

## 📄 19 Application Pages

1. **Dashboard** — Resume health score, quick actions, recent items
2. **Resume Builder** — 3-panel editor with live preview & AI suggestions
3. **Resume Review** — Upload PDF/DOCX/TXT for multi-dimensional analysis
4. **ATS Scanner** — Score ring + detailed breakdown (keyword, format, readability)
5. **Job Matcher** — Resume vs JD comparison with percentage scores
6. **Resume Optimizer** — AI-powered optimization workflow
7. **Cover Letter Generator** — Personalized cover letters from resume + JD
8. **Job Analyzer** — Extract skills, keywords, implicit requirements from JDs
9. **Skills Analyzer** — Gap analysis: strong matches, missing, recommended
10. **Interview Prep** — Technical + behavioral question generation
11. **LinkedIn Optimizer** — Headline, About, and profile content
12. **Resume Templates** — 6 templates (Executive, Modern, ATS, Technical, Minimal, Student)
13. **Resume Versions** — Version control with timeline
14. **AI Model Center** — Provider priority, routing modes, model cards
15. **API Key Manager** — BYOK for all providers + custom endpoints
16. **Usage & Analytics** — Request log, success rate, errors
17. **Settings** — Theme, accessibility, AI defaults, data controls
18. **Privacy & Security** — Security status, data deletion, privacy info
19. **Floating CareerAI** — Context-aware assistant on every page

---

## 🚢 Deployment

### Netlify (recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/resumeforge/resumeforge-ai)

```bash
# Manual deploy
netlify deploy --prod --dir=.
```

The `_headers`, `_redirects`, and `netlify.toml` are pre-configured.

### Vercel

```bash
vercel --prod
```

### GitHub Pages

Push to `main` branch, enable Pages in repo settings.

### Any Static Host

Point your web server to the `resumeforge/` directory. Apache users get the benefit of `.htaccess`.

---

## 🛠 Local Development

```bash
# Option 1: Python (requires Python 3)
python3 -m http.server 8080

# Option 2: Node.js
npx serve . -l 8080

# Option 3: Any static server
# The app is 100% static — no build step needed.
```

Then open `http://localhost:8080`.

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Obsidian Black | `#08090D` | Background |
| Deep Charcoal | `#111318` | Sidebar |
| Graphite | `#1A1D24` | Cards, inputs |
| Champagne Gold | `#D6B36A` | Primary CTAs, active states |
| Soft Gold | `#F0D89A` | Highlights, badges |
| Pearl White | `#F8F8F5` | Headlines |
| Emerald | `#0E5C4A` | Success accent |

Typography: **Inter** (UI) + **JetBrains Mono** (code/commands)

---

## ⚖️ Responsible AI Policy

ResumeForge AI follows strict **factuality-first** principles:

- ✅ Improve wording, grammar, and impact
- ✅ Suggest relevant skills based on job descriptions
- ✅ Recommend ATS-optimized formatting
- ❌ Never invent employment history
- ❌ Never fabricate degrees, certifications, or achievements
- ❌ Never add skills the user does not possess
- ❌ Never create false statistics or metrics

When information is missing, the AI says:  
*"I need more information to make this claim accurately."*

---

## 📜 License

**UNLICENSED** — Proprietary. All rights reserved.

This source code is provided for evaluation purposes. Commercial use, distribution, or modification requires explicit permission from ResumeForge AI.

---

## 🙋 Support

- 📧 **Security**: security@resumeforge.ai
- 🐛 **Issues**: [GitHub Issues](https://github.com/resumeforge/resumeforge-ai/issues)
- 💡 **Feature Requests**: Open a discussion

---

*Built with ❤️ by the ResumeForge AI team. © 2026.*
