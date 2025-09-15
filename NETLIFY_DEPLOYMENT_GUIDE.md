# 🚀 Job Portal - Netlify Deployment Guide

This comprehensive guide will help you deploy your Job Portal application to Netlify step by step.

## 📁 Project Structure
```
Job-Portal/
├── backend/          # Node.js/Express API
├── frontend/         # React/Vite application
├── netlify.toml      # Netlify configuration
└── NETLIFY_DEPLOYMENT_GUIDE.md
```

---

## 🔧 Prerequisites

Before starting, make sure you have:
- ✅ Netlify account (free at [netlify.com](https://netlify.com))
- ✅ GitHub/GitLab repository with your code
- ✅ MongoDB connection string
- ✅ Cloudinary account (for image uploads)
- ✅ Backend hosting solution (Railway, Render, or Heroku)

---

## 🎯 Step 1: Deploy Backend (Choose One Option)

### Option A: Deploy to Railway (Recommended)

1. **Create Railway Account**: Visit [railway.app](https://railway.app) and sign up
2. **Deploy Backend**:
   ```bash
   # Connect your GitHub repository to Railway
   # Select the backend folder as root directory
   ```
3. **Set Environment Variables** in Railway dashboard:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal
   JWT_SECRET=your-super-secret-jwt-key
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   NOVU_API_KEY=your-novu-api-key
   CLIENT_URL=https://your-frontend-site.netlify.app
   PORT=8000
   ```
4. **Deploy**: Railway will automatically deploy your backend
5. **Copy Backend URL**: Note the Railway-generated URL (e.g., `https://backend-production-xxxx.up.railway.app`)

### Option B: Deploy to Render

1. **Create Render Account**: Visit [render.com](https://render.com)
2. **Create Web Service**: Connect your GitHub repo, select backend folder
3. **Configure**:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Set Environment Variables** (same as above)
5. **Deploy and copy the URL**

---

## 🎯 Step 2: Configure Frontend for Production

1. **Update API Configuration**:
   Create `frontend/.env` file:
   ```env
   VITE_API_BASE=https://your-backend-url-from-step1.com
   ```
   
   Example:
   ```env
   VITE_API_BASE=https://backend-production-xxxx.up.railway.app
   ```

2. **Test Locally** (Optional):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## 🎯 Step 3: Deploy Frontend to Netlify

### Method 1: Git-based Deployment (Recommended)

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com) and log in
   - Click "New site from Git"
   - Choose your Git provider (GitHub/GitLab/Bitbucket)
   - Select your Job Portal repository

3. **Configure Build Settings**:
   ```
   Base directory: frontend
   Build command: npm run build
   Publish directory: frontend/dist
   ```

4. **Set Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add: `VITE_API_BASE` = `https://your-backend-url.com`

5. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete
   - Your site will be available at `https://random-name.netlify.app`

### Method 2: Manual Upload

1. **Build Locally**:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Upload to Netlify**:
   - Go to Netlify dashboard
   - Drag and drop the `frontend/dist` folder
   - Configure environment variables in site settings

---

## 🎯 Step 4: Configure Custom Domain (Optional)

1. **In Netlify Dashboard**:
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Enter your domain name
   - Follow DNS configuration instructions

2. **Update Backend CORS**:
   Update your backend's `CLIENT_URL` environment variable to include your custom domain.

---

## 🎯 Step 5: Test Your Deployment

### ✅ Frontend Tests:
- [ ] Website loads correctly
- [ ] All pages navigate properly
- [ ] No console errors
- [ ] Responsive design works

### ✅ Backend Integration Tests:
- [ ] User registration works
- [ ] User login works
- [ ] Profile photo upload works
- [ ] Resume upload works
- [ ] Job posting works
- [ ] Application submission works

### ✅ API Connection Tests:
Open browser console and check:
- [ ] API calls go to correct backend URL
- [ ] No CORS errors
- [ ] Authentication cookies are set properly

---

## 🔧 Environment Variables Summary

### Backend Variables (Railway/Render):
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
NOVU_API_KEY=your-novu-key
CLIENT_URL=https://your-site.netlify.app
PORT=8000
```

### Frontend Variables (Netlify):
```env
VITE_API_BASE=https://your-backend-url.com
```

---

## 🐛 Troubleshooting

### Common Issues:

**1. Build Fails on Netlify**
```bash
# Solution: Check build logs, usually missing dependencies
npm install
npm run build
```

**2. API Calls Not Working**
- ✅ Check `VITE_API_BASE` environment variable
- ✅ Verify backend URL is accessible
- ✅ Check browser console for CORS errors

**3. CORS Errors**
- ✅ Update backend `CLIENT_URL` to match Netlify URL
- ✅ Ensure backend allows credentials: `credentials: true`
- ✅ Check frontend axios configuration

**4. Authentication Issues**
- ✅ Verify JWT_SECRET is set in backend
- ✅ Check cookie settings (secure: true for HTTPS)
- ✅ Ensure sameSite: 'none' for cross-origin cookies

**5. File Uploads Not Working**
- ✅ Check Cloudinary credentials
- ✅ Verify file size limits
- ✅ Check network tab for upload errors

---

## 📱 Mobile Testing

Test your deployed site on:
- [ ] Desktop browsers (Chrome, Firefox, Safari)
- [ ] Mobile browsers (iOS Safari, Android Chrome)
- [ ] Different screen sizes
- [ ] Touch interactions

---

## 🔄 Continuous Deployment

Once connected to Git, Netlify will automatically:
- ✅ Deploy when you push to main branch
- ✅ Build and deploy pull request previews
- ✅ Show deployment status in GitHub

---

## 🎉 Deployment Complete!

Your Job Portal is now live on Netlify! 

**Frontend URL**: `https://your-site.netlify.app`
**Backend URL**: `https://your-backend.railway.app` (or your chosen provider)

### Next Steps:
1. Share your live URL
2. Monitor performance using Netlify Analytics
3. Set up form handling if needed
4. Configure security headers
5. Optimize images and performance

---

## 📞 Need Help?

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Render Docs**: [render.com/docs](https://render.com/docs)

Happy deploying! 🚀
