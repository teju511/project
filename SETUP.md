# MindFlow Therapy App - Setup Instructions

## Quick Start Guide

### ✅ Step 1: Install Dependencies (Frontend)

Open PowerShell in the frontend folder and run:

```powershell
cd "C:\Users\Tejashwini N\OneDrive\Desktop\major_project_MHT\frontend"
npm install
```

This installs all required packages:
- React & React Router
- Firebase SDK
- Tailwind CSS
- Recharts (for charts)
- Compromise.js (for emotion detection)

**Expected time:** 2-5 minutes

### ✅ Step 2: Setup Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Project name: `MindFlow Therapy` (or any name)
4. Click "Create project" and wait for it to complete

### ✅ Step 3: Enable Firebase Services

**In Firebase Console:**

1. Go to **Build → Authentication**
   - Click "Get started"
   - Select "Email/Password" provider
   - Enable it and click Save

2. Go to **Build → Firestore Database**
   - Click "Create database"
   - Select "Start in test mode"
   - Choose region (US is fine)
   - Click "Create"

### ✅ Step 4: Get Firebase Credentials

1. In Firebase Console, click the **Settings icon → Project settings**
2. Scroll down to "Your apps" section
3. If no app exists, click "Add app" and select "Web"
4. Copy the entire `firebaseConfig` object that looks like:

```javascript
{
  apiKey: "AIza...",
  authDomain: "mindflow-xyz.firebaseapp.com",
  projectId: "mindflow-xyz",
  storageBucket: "mindflow-xyz.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

### ✅ Step 5: Create .env File

1. In the `frontend` folder, create a new file named `.env`
2. Copy this content and replace with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY_HERE
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_GOOGLE_MAPS_API_KEY=optional
```

### ✅ Step 6: Setup Firestore Collections

1. In Firebase Console → **Firestore Database**
2. The collections will be automatically created when:
   - A user signs up (creates `users` collection)
   - A user sends a message (creates `mood_history` collection)

**No manual setup needed!** Firebase Auto creates collections on first write.

### ✅ Step 7: Configure Firestore Security Rules

1. In Firebase → **Firestore Database** → **Rules** tab
2. Replace the default rules with this:

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

### ✅ Step 8: Run the Application

In PowerShell (in the frontend folder), run:

```powershell
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

The application will automatically open in your browser at `http://localhost:3000`

### ✅ Step 9: Test the App

1. **Sign Up**
   - Click "Sign Up" tab
   - Enter name, email, password (6+ chars)
   - Click "Create Account"

2. **Select Interests**
   - Select at least one option from each category
   - Click "Continue to Home"

3. **Test Chatbot**
   - Click "AI Chatbot"
   - Type: "I'm feeling happy and grateful"
   - See emotion detection and recommendations

4. **Test Voice**
   - Click "Voice Recognition"
   - Click "Start Listening"
   - Say: "I'm feeling anxious about tomorrow"
   - Click "Send"
   - Hear the AI response

5. **Check History**
   - Click "Mood History"
   - See charts and past conversations

## 🚀 Build for Production

When ready to deploy:

```powershell
cd frontend
npm run build
```

This creates an optimized build in `frontend/dist/` folder.

## 📦 Project Structure

```
major_project_MHT/
├── frontend/
│   ├── src/
│   │   ├── pages/          # All page components
│   │   ├── components/     # Reusable components
│   │   ├── utils/          # Emotion detection & recommendations
│   │   ├── contexts/       # Auth context
│   │   ├── config/         # Firebase config
│   │   ├── App.jsx         # Main app with routing
│   │   └── index.css       # Tailwind + custom styles
│   ├── package.json        # Dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── .env                # Your Firebase credentials
│   └── index.html          # HTML entry point
└── backend/                # Future backend (optional)
```

## 📱 Key Emotion Keywords

The app detects these emotions:

- **Happy:** "happy", "joyful", "excited", "great", "wonderful", "amazing"
- **Sad:** "sad", "depressed", "down", "lonely", "heartbroken"
- **Anxious:** "anxious", "nervous", "worried", "stressed", "panic"
- **Angry:** "angry", "furious", "frustrated", "upset", "irritated"
- **Calm:** "calm", "peaceful", "relaxed", "serene", "tranquil"
- **Confused:** "confused", "uncertain", "lost", "puzzled"

## 🔧 Troubleshooting

### Problem: "Port 3000 already in use"
**Solution:** Kill the process or use a different port:
```powershell
npm run dev -- --port 3001
```

### Problem: "Firebase credentials not working"
**Solution:** 
- Copy credentials again from Firebase Console
- Make sure `.env` file is in the `frontend` folder (not root)
- Restart the dev server after changing `.env`

### Problem: "Voice not working"
**Solution:**
- Only Chrome, Edge, Safari support it (not Firefox)
- Check microphone permissions in your browser
- HTTPS required in production (HTTP works for localhost)

### Problem: "Can't send messages to Firestore"
**Solution:**
- Check Firestore security rules (see Step 7)
- Verify user is logged in
- Check Firebase credentials in `.env`

## 💡 Tips

1. **Development:** Use `npm run dev` for hot reload
2. **Browser:** Use Chrome DevTools (F12) to debug
3. **Firebase:** Check Firebase Console → Firestore to see saved data in real-time
4. **Code:** All files are well-commented for learning
5. **Styling:** Modify colors in `tailwind.config.js`

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## ✨ Next Steps

After setup:
1. Explore the code
2. Test all features
3. Customize colors/design
4. Add more emotions/recommendations
5. Deploy to Firebase Hosting

---

**You're all set! Start the server with `npm run dev` and explore MindFlow! 🚀**

