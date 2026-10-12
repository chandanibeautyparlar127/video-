# 🎬 DubAI — English to Hindi Video Dubber

Free AI-powered tool to dub English videos into Hindi automatically.

## ✨ Features
- 100% Free
- No sign-up required
- Whisper AI for transcription
- Google Translate for translation
- Natural Hindi voice (Male/Female)
- Background music preservation option
- 3D animated UI

## 🚀 Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Python (FastAPI)
- **AI:** OpenAI Whisper + Edge-TTS + Google Translate
- **Hosting:** GitHub Pages (frontend) + Hugging Face Spaces (backend)

## 📦 Setup

### 1. Deploy Backend (Hugging Face Spaces)
1. Go to https://huggingface.co/new-space
2. Choose **Docker** → **Blank**
3. Upload `backend/app.py`, `requirements.txt`, `Dockerfile`
4. Wait for build → copy your Space URL

### 2. Deploy Frontend (GitHub Pages)
1. Fork this repo
2. Edit `frontend/script.js` → set `BACKEND_URL` to your HF Space URL
3. Go to **Settings → Pages → Source: main branch / root**
4. Your site: `https://your-username.github.io/english-to-hindi-dub/`

## 🎯 Usage
1. Open the website
2. Upload English video
3. Choose voice (Male/Female)
4. Click "Start Dubbing"
5. Download Hindi video

## 📝 License
MIT — Free to use, modify, distribute.
