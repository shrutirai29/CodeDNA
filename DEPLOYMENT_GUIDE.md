# Deployment Guide - Developer Career Intelligence Platform

This repository is configured to support multiple production deployment strategies:
1. **Vercel** (Serverless Web App & REST API)
2. **Streamlit Community Cloud** (Recommended for full 9-page interactive Streamlit experience)
3. **Docker / Render / Railway / Fly.io** (Containerized persistent service)

---

## 1. Deploying to Vercel

Vercel operates as a serverless platform. We have pre-configured [`vercel.json`](file:///d:/projects/DAV/vercel.json) and [`api/index.py`](file:///d:/projects/DAV/api/index.py) to power a serverless web application and REST API on Vercel.

### Option A: 1-Click via GitHub & Vercel Dashboard (Easiest)
1. Push this repository to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/developer-career-intelligence.git
   git branch -M main
   git push -u origin main
   ```
2. Go to **[vercel.com](https://vercel.com)** and log in.
3. Click **Add New...** -> **Project**.
4. Import your GitHub repository.
5. Vercel will automatically detect `vercel.json` and `@vercel/python`.
6. Click **Deploy**.
7. Your app will be live at `https://<your-project>.vercel.app`.

### Option B: Deploy via Vercel CLI
If you have Node.js / npm installed:
```bash
npx vercel
```
Follow the interactive prompts:
- *Set up and deploy?* **Yes**
- *Which scope?* (Select your account)
- *Link to existing project?* **No**
- *Project name?* `developer-career-intelligence`
- *In which directory is your code located?* `./`

To deploy to production:
```bash
npx vercel --prod
```

---

## 2. Deploying to Streamlit Community Cloud (Recommended)

Because Streamlit uses persistent WebSockets for real-time reactivity and stateful sessions across all 9 pages, **Streamlit Community Cloud** is the ideal native free host:

1. Push this repository to GitHub.
2. Go to **[share.streamlit.io](https://share.streamlit.io)** and log in with GitHub.
3. Click **New app**.
4. Select your repository, branch (`main`), and set the main file path:
   ```
   app/streamlit_app.py
   ```
5. Click **Deploy!**
6. Your live interactive dashboard will be running at `https://<app-name>.streamlit.app` with full WebSocket support, real-time What-if career simulation, and Plotly radar charts.

---

## 3. Deploying via Docker / Render / Railway

For containerized cloud platforms:
- A production [`Dockerfile`](file:///d:/projects/DAV/Dockerfile) is pre-configured.
- Build and run locally:
  ```bash
  docker build -t developer-intelligence .
  docker run -p 8501:8501 developer-intelligence
  ```
- **Render.com / Railway.app**: Connect your GitHub repository and select **Docker** as the environment.
