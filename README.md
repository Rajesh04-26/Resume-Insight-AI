# AI Resume Analyzer (ATS + Job Match) — MERN + Gemini + Local Fallback

Production-style MERN app that parses a PDF resume, compares it to a job description, and generates:
- ATS score (0–100)
- Job match score (0–100)
- Overall score (weighted)
- Strengths, weaknesses, improvements, ATS tips, job matching insights

Primary AI: **Google Gemini**  
Fallback: **Ollama** (local model) if Gemini errors / times out / quota-limits.

## Requirements
- Node.js 18+ (recommended 20+)
- MongoDB (local or Atlas)
- (Optional, for fallback) [Ollama](https://ollama.com/) running locally

## Quick start

1) Install deps

```bash
npm run install:all
```

2) Configure env

Create `server/.env`:

```bash
PORT=5001
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/ai-resume-analyzer

# Gemini (primary)
GEMINI_API_KEY=YOUR_KEY
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TIMEOUT_MS=20000

# Ollama (fallback)
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1
OLLAMA_TIMEOUT_MS=25000
```

3) Run dev (API + UI)

```bash
npm run dev
```

Open:
- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## API
- **POST** `/api/resume/upload` (multipart form-data `file`) → `{ resumeText }`
- **POST** `/api/analyze` → `{ resumeText, job: { title, description, skillsRequired, responsibilities } }`
- **GET** `/api/report/:id` → stored analysis report

## Notes
- If Gemini returns invalid JSON or times out, the server automatically falls back to Ollama.
- The app stores analyses in MongoDB (`ResumeAnalysis` collection).

