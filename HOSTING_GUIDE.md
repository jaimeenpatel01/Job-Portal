## Job-Portal – Vercel Hosting Guide

This guide explains how to deploy both the backend (Express) and the frontend (Vite + React) of this project on Vercel.

Directory layout:
- `backend/` – Node/Express API
- `frontend/` – Vite React app

---

### 0) Prerequisites
- Vercel account and Vercel CLI installed: `npm i -g vercel`
- MongoDB connection string
- Cloudinary account (if using image uploads)
- Novu key (if using notifications)

---

### 1) Backend deployment (Express on Vercel)

1. From repository root, open a terminal and run:
   ```bash
   cd backend
   npm install
   vercel
   ```
   - When prompted, select “Use current directory” (backend) as the project root.
   - Vercel will create a project for the backend.

2. Add Environment Variables in Vercel → Project → Settings → Environment Variables (add to Production and Preview):
   - `MONGO_URI=...`
   - `JWT_SECRET=...`
   - `CLOUDINARY_NAME=...`
   - `CLOUDINARY_API_KEY=...`
   - `CLOUDINARY_API_SECRET=...`
   - `NOVU_API_KEY=...` (if used)
   - `CLIENT_URL=https://<your-frontend>.vercel.app`

3. CORS (confirm in `backend/index.js`):
   ```js
   import cors from 'cors';
   app.use(cors({
     origin: [process.env.CLIENT_URL],
     credentials: true,
   }));
   ```

4. Cookies (when setting auth cookies on login):
   ```js
   res.cookie('token', token, {
     httpOnly: true,
     secure: true,
     sameSite: 'none',
   });
   ```

5. Deploy to production:
   ```bash
   vercel --prod
   ```
   Copy the backend URL, e.g. `https://job-portal-api.vercel.app`.

---

### 2) Point frontend to the deployed API

Update the API constants to use the backend URL (either directly in constants or via Vite envs).

Files:
- `frontend/src/utils/constant.js`
- `frontend/src/utils/constants.js`

Example (direct constants):
```js
export const USER_API_END_POINT = 'https://job-portal-api.vercel.app/api/v1/user';
export const JOB_API_END_POINT = 'https://job-portal-api.vercel.app/api/v1/job';
export const COMPANY_API_END_POINT = 'https://job-portal-api.vercel.app/api/v1/company';
export const APPLICATION_API_END_POINT = 'https://job-portal-api.vercel.app/api/v1/application';
```

Optional (recommended): use Vite envs in `frontend/.env`:
```env
VITE_API_BASE=https://job-portal-api.vercel.app
```
Then read with `import.meta.env.VITE_API_BASE` and build your endpoints accordingly.

---

### 3) Frontend deployment (Vite on Vercel)

1. From the repo root:
   ```bash
   cd frontend
   npm install
   vercel
   ```
   - Root directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - If using Vite envs, add them in Vercel → Project → Settings → Environment Variables (Preview + Production).

2. Deploy to production:
   ```bash
   vercel --prod
   ```

---

### 4) Preview/Production environments
- In Vercel, set env vars separately for Preview and Production.
- Update backend CORS `origin` to include both preview and production frontend URLs if you want preview branches to work.

---

### 5) Smoke test checklist
- Open the frontend URL and test:
  - Signup/Login (cookies present, Network calls succeed)
  - Upload profile photo and resume
  - Create company, post job, view applicants
  - Ensure requests are going to your Vercel backend URL

If cookies aren’t set:
- Verify `secure: true` and `sameSite: 'none'` in cookie options
- Confirm `withCredentials: true` is used in axios requests
- Confirm CORS `origin` matches your exact frontend domain and `credentials: true` is enabled

---

### 6) Useful commands
```bash
vercel login
vercel link
vercel env add
vercel --prod
```

---

### 7) Troubleshooting
- 404 on API routes: ensure backend project root is `backend/` and that `vercel.json` (if present) is correct.
- CORS errors: double‑check `CLIENT_URL`, preview URLs, and that `credentials: true` is set on both client and server.
- Cookies missing: use `secure: true` + `sameSite: 'none'` and `withCredentials: true` on axios.
- PDFs not loading: ensure the file is publicly accessible (Cloudinary or your storage) and correct URL is used.

---

Deployment complete! If you share your live backend URL, you can switch the frontend constants or I can convert them to Vite envs for you.


