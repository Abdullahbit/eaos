# Campus Insider Production Launch Checklist & Release Manual

This document provides step-by-step instructions to deploy the Campus Insider platform (FastAPI backend and Next.js frontend) to production, configure environment variables, secure the database, set up Cloudflare Turnstile, and execute verification and rollback procedures.

---

## 🚀 Step-by-Step Deployment Instructions

### Phase 1: Database Verification (Supabase)
1. Log in to your **Supabase Dashboard**.
2. Verify that your project is active and unpaused. If it was paused, click **Restore Project** and wait for it to wake up.
3. Retrieve your direct PostgreSQL Connection String or Transaction Pooler Connection String (port 6543) from **Project Settings > Database**.

### Phase 2: Deploy Backend to Railway
1. Log in to **Railway.app** and click **New Project**.
2. Choose **Deploy from GitHub repo** and select `Abdullahbit/eaos`.
3. Set the root directory of the backend service to `/backend`.
4. Configure the **Build & Start Commands**:
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Configure the Backend **Environment Variables**:
   * **SECRET**: `DATABASE_URL` = (Your active Supabase connection string)
   * **SECRET**: `TURNSTILE_SECRET_KEY` = (Your real Cloudflare Turnstile secret key)
   * **SECRET**: `ADMIN_TOKEN` = (Generate a secure random string for administrative dashboard access)
   * **PUBLIC**: `CORS_ORIGINS` = `https://your-frontend-domain.vercel.app` (Add Vercel domain once generated, comma-separated with others)
   * **PUBLIC**: `LOG_LEVEL` = `INFO`
6. Once deployed, copy your Railway public backend domain (e.g., `https://eaos-production.up.railway.app`).

### Phase 3: Run Database Migrations
1. In the Railway dashboard under your backend service, open the **Variables** tab.
2. Railway executes build pipelines cleanly. To apply migrations, you can run them directly in the Railway shell or trigger them via a custom build step:
   * Run command: `alembic upgrade head`
   * *Alternative*: Run this locally inside the `backend` folder pointing to the production database:
     ```bash
     $env:DATABASE_URL="postgresql://postgres:password@your-supabase-db:5432/postgres"
     alembic upgrade head
     ```

### Phase 4: Deploy Frontend to Vercel
1. Log in to **Vercel.com** and click **Add New > Project**.
2. Select the repository `Abdullahbit/eaos`.
3. Set the **Framework Preset** to **Next.js**.
4. Set the **Root Directory** to `frontend`.
5. Configure the Frontend **Environment Variables**:
   * **PUBLIC**: `NEXT_PUBLIC_API_URL` = `https://eaos-production.up.railway.app` (Your Railway backend domain)
   * **PUBLIC**: `NEXT_PUBLIC_TURNSTILE_SITE_KEY` = (Your real Cloudflare Turnstile site key)
6. Click **Deploy**. Vercel will output a production domain (e.g., `https://campusinsider.vercel.app`).

### Phase 5: Production CORS Configuration
1. Go back to your **Railway Backend Service > Variables**.
2. Update the `CORS_ORIGINS` variable to include your official Vercel domain:
   * Example: `https://campusinsider.vercel.app,http://localhost:3000`
3. Railway will redeploy the backend service automatically to apply the new CORS policy.

### Phase 6: Cloudflare Turnstile Setup
1. Log in to your **Cloudflare Dashboard > Turnstile**.
2. Add your production domain (e.g., `campusinsider.vercel.app`) to the allowed hostnames list.
3. Double-check that:
   * The site key matches `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in Vercel.
   * The secret key matches `TURNSTILE_SECRET_KEY` in Railway.

---

## 🧭 Custom Domains Setup
* **Backend**: In the Railway dashboard, go to the backend service's settings tab, click **Custom Domains**, and add your DNS CNAME record pointing to Railway.
* **Frontend**: In the Vercel dashboard, go to **Settings > Domains**, type your custom domain (e.g., `campusinsider.com`), and configure your DNS A and CNAME records at your registrar.

---

## 🔍 Complete Production Smoke Test
1. Load the production website in your browser.
2. Verify that the homepage sync status loads correctly (meaning the frontend can speak to the backend).
3. Click **Find My Options** and fill out the wizard.
4. Verify that the Cloudflare Turnstile widget renders and validates.
5. Submit the form and verify that the Results display page successfully renders your matched study blueprints.
6. Click **Download Summary** to confirm the PDF prints without horizontal clipping.
7. Click the WhatsApp button to verify that the generated chat link template opens correctly.

---

## ⏪ Rollback Procedure
If the production deployment fails, execute these steps immediately to return to the last stable state:

1. **Frontend Rollback (Vercel)**:
   * Go to Vercel Dashboard > deployments.
   * Locate the previous successful deployment card.
   * Click the three dots and select **Promote to Production** (instant zero-downtime rollback).
2. **Backend Rollback (Railway)**:
   * Go to Railway Dashboard > Deployments.
   * Locate the last working deployment.
   * Click **Rollback** to run the previous stable Docker container.
3. **Git Tag Rollback**:
   * If code hotfixes need to be reverted:
     ```bash
     git tag -d beta-v1
     git push origin :refs/tags/beta-v1
     ```
