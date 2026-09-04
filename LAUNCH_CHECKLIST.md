# Campus Insider Production Launch Checklist & Release Manual

This document provides step-by-step instructions to deploy the Campus Insider platform (FastAPI backend on Railway and Next.js frontend on Netlify) to production, configure environment variables, secure the database, set up Cloudflare Turnstile, and execute verification and rollback procedures.

---

## 🚀 Step-by-Step Deployment Instructions

### Phase 1: Database Verification (Supabase)
1. Log in to your **Supabase Dashboard**.
2. Verify that your project is active and unpaused. If it was paused, click **Restore Project** and wait for it to wake up.
3. Retrieve your direct PostgreSQL Connection String or Transaction Pooler Connection String from **Project Settings > Database**.

### Phase 2: Deploy Backend to Railway
1. Log in to **Railway.app** and click **New Project**.
2. Choose **Deploy from GitHub repo** and select `Abdullahbit/eaos`.
3. Set the root directory of the backend service to `/backend`.
4. Configure the **Build & Start Commands**:
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips='*'` (Automatically picked up via `backend/Procfile`).
5. Configure the Backend **Environment Variables**:
   * **SECRET**: `DATABASE_URL` = (Your active Supabase connection string)
   * **SECRET**: `TURNSTILE_SECRET_KEY` = (Your real Cloudflare Turnstile secret key)
   * **SECRET**: `ADMIN_TOKEN` = (Generate a secure random string for administrative dashboard access)
   * **PUBLIC**: `CORS_ORIGINS` = `https://your-site-name.netlify.app,http://localhost:3000` (Add Netlify domain once generated, comma-separated)
   * **PUBLIC**: `LOG_LEVEL` = `INFO`
6. Once deployed, copy your Railway public backend domain (e.g., `https://eaos-backend-production.up.railway.app`).

### Phase 3: Run Database Migrations (if needed)
1. In the Railway dashboard under your backend service, open the **Variables** tab or Railway Shell:
   * Run command: `alembic upgrade head`
   * *Alternative*: Run locally inside the `backend` directory pointing to the production database:
     ```bash
     $env:DATABASE_URL="postgresql://postgres:password@your-supabase-db:5432/postgres"
     alembic upgrade head
     ```

### Phase 4: Deploy Frontend to Netlify
1. Log in to **Netlify.com** and click **Add new site > Import an existing project**.
2. Select GitHub and choose repository `Abdullahbit/eaos`.
3. Netlify automatically reads `netlify.toml`:
   * **Base Directory**: `frontend`
   * **Build Command**: `npm run build`
   * **Publish Directory**: `frontend/.next`
4. Configure the Frontend **Environment Variables** in Netlify Site Configuration:
   * **PUBLIC**: `NEXT_PUBLIC_API_URL` = `https://eaos-backend-production.up.railway.app` (Your Railway backend domain)
   * **PUBLIC**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = (Your real Cloudflare Turnstile site key)
   * **CONFIG**: `NODE_VERSION` = `20`
5. Click **Deploy Site**. Netlify will build and output a production domain (e.g., `https://campus-insider.netlify.app`).

### Phase 5: Production CORS Configuration
1. Go back to your **Railway Backend Service > Variables**.
2. Update the `CORS_ORIGINS` variable to include your official Netlify domain:
   * Example: `https://campus-insider.netlify.app,http://localhost:3000`
3. Railway will restart the backend service automatically to apply the new CORS policy.

### Phase 6: Cloudflare Turnstile Setup
1. Log in to your **Cloudflare Dashboard > Turnstile**.
2. Add your production domain (e.g., `campus-insider.netlify.app`) to the allowed hostnames list.
3. Double-check that:
   * The site key matches `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in Netlify.
   * The secret key matches `TURNSTILE_SECRET_KEY` in Railway.

---

## 🧭 Custom Domains Setup
* **Backend**: In the Railway dashboard, go to the backend service's settings tab, click **Custom Domains**, and add your DNS CNAME record pointing to Railway.
* **Frontend**: In the Netlify dashboard, go to **Domain management > Add custom domain**, type your domain (e.g., `campusinsider.com`), and configure your DNS records at your registrar.

---

## 🔍 Complete Production Smoke Test
1. Load the production website in your browser.
2. Verify that the homepage sync status loads correctly (meaning the frontend can speak to the backend).
3. Click **Find My Options** and fill out the wizard.
4. Verify that the Cloudflare Turnstile widget renders and validates.
5. Submit the form and verify that the Results display page successfully renders your matched study blueprints.
6. Click **Download Summary** to confirm the PDF prints cleanly without horizontal clipping.
7. Click the WhatsApp button to verify that the generated chat link template opens correctly.

---

## ⏪ Rollback Procedure
If the production deployment needs to be rolled back:

1. **Frontend Rollback (Netlify)**:
   * Go to Netlify Dashboard > Deploys.
   * Locate the previous successful deployment.
   * Click **Publish deploy** (instant rollback).
2. **Backend Rollback (Railway)**:
   * Go to Railway Dashboard > Deployments.
   * Locate the last working deployment.
   * Click **Rollback** to run the previous container.
