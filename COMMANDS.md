# 🚀 MindFlow - Quick Commands

## ⚡ Start Here (Copy & Paste These Commands)

### 1️⃣ Install Dependencies

Open PowerShell and run:

```powershell
cd "C:\Users\Tejashwini N\OneDrive\Desktop\major_project_MHT\frontend"
npm install
```

**Wait for completion** (2-5 minutes)

---

### 2️⃣ Setup Firebase (Follow These Steps)

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com
   - Click "Create a project"
   - Name it "MindFlow" or similar
   - Click "Create project"

2. **Enable Authentication:**
   - Click "Build" → "Authentication"
   - Click "Get started"
   - Click "Email/Password"
   - Toggle "Enabled" on
   - Click "Save"

3. **Create Firestore Database:**
   - Click "Build" → "Firestore Database"
   - Click "Create database"
   - Select "Start in test mode"
   - Choose region (Default is fine)
   - Click "Create"

4. **Get Your Credentials:**
   - Click Settings icon (⚙️) → "Project settings"
   - Scroll to "Your apps"
   - Find the Web app config
   - Copy all values

---

### 3️⃣ Create .env File

1. In `frontend` folder, create a new file named `.env`
2. Copy this template and fill with your Firebase values:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

---

### 4️⃣ Configure Firestore Security Rules

1. In Firebase Console → **Firestore Database** → **Rules tab**
2. Replace all content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /mood_history/{document=**} {
      allow read: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

3. Click "Publish"

---

### 5️⃣ Run the App

In PowerShell (in frontend folder), run:

```powershell
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

**The app will open automatically in your browser!** ✨

---

## ✅ Test the App

1. **Sign Up** - Create a test account
2. **Select Interests** - Choose at least one from each category
3. **Test Chat** - Type "I'm feeling happy" and see emotion detection
4. **Test Voice** - Click voice and say something
5. **Check History** - See all your conversations

---

## 🔧 Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Check code quality |
| `npm install` | Install all dependencies |

---

## 📁 Project Files Location

All files are in:
```
C:\Users\Tejashwini N\OneDrive\Desktop\major_project_MHT
```

Open in VS Code:
```powershell
code "C:\Users\Tejashwini N\OneDrive\Desktop\major_project_MHT"
```

---

## 📖 Documentation Files

- **README.md** - Full documentation
- **SETUP.md** - Detailed setup guide
- **FILE_MANIFEST.md** - What was created
- **COMMANDS.md** - This file (quick commands)

---

## 🎯 Troubleshooting Quick Fixes

### Issue: "npm: The term 'npm' is not recognized"
**Fix:** Install [Node.js](https://nodejs.org/) (includes npm)

### Issue: "Port 3000 already in use"
**Fix:** Run: `npm run dev -- --port 3001`

### Issue: "Firebase not initializing"
**Fix:** 
- Check `.env` file exists in frontend folder
- Verify all Firebase credentials are correct
- Restart VS Code

### Issue: "Voice not working"
**Fix:** Use Chrome/Edge/Safari (not Firefox)

---

## 💡 Key File Locations to Edit

Want to customize? Edit these files:

- **Change colors:** `frontend/tailwind.config.js`
- **Add emotions:** `frontend/src/utils/emotionDetection.js`
- **Change recommendations:** `frontend/src/utils/recommendations.js`
- **Modify pages:** `frontend/src/pages/*.jsx`
- **Change styling:** `frontend/src/index.css`

---

## 🎓 Learn More

- [React Docs](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## ✨ You're Ready!

Everything is set up. Just run:

```powershell
cd "C:\Users\Tejashwini N\OneDrive\Desktop\major_project_MHT\frontend"
npm install
npm run dev
```

**Then follow the setup steps above and your app will be live!** 🚀

---

## 📞 Quick Reference

| Step | Command | Time |
|------|---------|------|
| 1. Install | `npm install` | 3-5 min |
| 2. Firebase Setup | Manual (console) | 5-10 min |
| 3. Create .env | Manual (editor) | 2 min |
| 4. Run App | `npm run dev` | Instant |

**Total Time:** ~15-20 minutes

---

**Have fun building! 💙 If you need help, check README.md or SETUP.md**

