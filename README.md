<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen.svg" alt="Project Status" />
  <img src="https://img.shields.io/badge/Version-v2.0--Core-blue.svg" alt="Version" />
  <img src="https://img.shields.io/badge/Aesthetic-Cyberpunk-ff00ff.svg" alt="Aesthetic" />
  
  <h1>Aura-Intel-Matrix (AuraCheck AI)</h1>
  <p><strong>// ENGINEERED FOR TRUTH //</strong></p>
</div>

<br />

## 🌐 Overview

**AuraCheck AI** (The Global Intelligence Matrix) is a futuristic, cyberpunk-themed news aggregation and fact-checking platform. It is designed to act as a terminal interface for decoding the truth from global datastreams.

The application surfaces live, trending news headlines globally (or regionally) and utilizes advanced AI models to cross-reference claims against external search architectures, ultimately providing a definitive "Truth Verdict" alongside a generated audio podcast summary using state-of-the-art TTS models.

## ✨ Core Features

- **Live Regional Datastreams:** Fetches live top headlines via the NewsAPI. Supports switching datastreams between the US, UK, Canada, and India.
- **Deep-Scan Fact Checking:** Utilizes OpenAI's GPT-4o-mini and the Serper (Google Search) API to investigate headlines, providing a 0-100 Validity Score and verifiable cross-referenced "receipts".
- **Aura Narrator AI:** Generates an engaging, contextual podcast audio summary of the news and fact-check results using OpenAI's highly-realistic Text-to-Speech (`onyx` voice).
- **Cyberpunk Terminal UI:** A highly stylized frontend featuring `JetBrains Mono` typography, CRT scanlines, glassmorphism, aggressive sharp angles, and neon CSS glows (`#00f3ff` & `#ff00ff`).

---

## 🏗️ Architecture Stack

### Backend

- **Python 3.10+ / FastAPI:** High-performance async routing.
- **LangChain / OpenAI:** For generative text summarization and fact-checking chains.
- **NewsAPI & Serper:** For real-time data scraping and verification.
- **OpenAI TTS / gTTS:** For the audio datastream generation.

### Frontend

- **React 19 / Next.js 16 (App Router):** Fast, server-rendered components.
- **Tailwind CSS v4:** Heavy usage of custom utilities for the cyberpunk aesthetic.
- **Framer Motion:** Smooth state transitions and micro-animations.
- **Lucide React:** Vector iconography.

## 🧠 Engine Philosophy & Architecture

AuraCheck AI was built to solve the modern problem of misinformation speed. By the time human fact-checkers verify a trending claim, millions have already consumed it.

**The Pipeline:**

1. **Aggregator Node:** Ingests live news from selected global regions.
2. **Serper Matrix:** Bypasses standard Search UI, leveraging the Google Serper API to quietly gather 10-15 top correlating or refuting sources for the specific claim.
3. **Synthesis Core (LLM):** An AI (GPT-4o-mini) acts as the arbiter, deeply analyzing the cross-referenced sources. It assigns a strict mathematical `ruth_score` and determines if a headline is True, Misleading, False, or Needs Context.
4. **Vocal Emitter:** Instead of forcing users to read the dense analysis, the system synthesizes a high-quality (Onyx voice) conversational podcast summarizing exactly _why_ a claim is true or false.

---

## 🚀 Local Deployment Protocol

### Prerequisites

- Node.js v20+
- Python 3.10+
- Valid API Keys (OpenAI, NewsAPI, Serper)

### 1. Backend Initialization

Navigate to the `backend/` directory:

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# or source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
```

Create an `.env` file in the `backend/` directory and inject your matrix keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
NEWS_API_KEY=your_newsapi_key_here
SERPER_API_KEY=your_serper_api_key_here
```

> _Note: If a `NEWS_API_KEY` is not provided, the system will fall back to its internal resilient mock datastreams for demonstration purposes._

Initialize the core API server:

```bash
python main.py
```

_(Runs on `http://localhost:8001`)_

### 2. Frontend Initialization

Open a new terminal and navigate to the `frontend/` directory:

```bash
cd frontend
npm install
npm run dev
```

_(Runs on `http://localhost:3000`)_

---

## 👨‍💻 About the Developers

**Built by [Gaurav](https://github.com/uitachi18)** **(AI & ML Researcher)**

We are passionate about the intersection of Artificial Intelligence, full-stack architecture, and futuristic, specialized user interfaces. AuraCheck AI was conceptualized not just as a tool, but as an experience—merging high-performance APIs (FastAPI/Next.js) with bleeding-edge LLM validation pipelines to combat misinformation in style.

Feel free to fork the repository, submit pull requests, or reach out regarding collaborations on future intelligence matrices!

---

## 📡 Visual Preview

_The interface runs on a monospace `JetBrains Mono` grid with reactive neon highlighting and a persistent CRT scanning overlay._

![Terminal View](https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070)

---

<div align="center">
  <p><code>> END_OF_FILE</code></p>
  <p><i>(C) 2026 AuraCheck Global Industries</i></p>
</div>
