# AI-Powered Therapy Website - MindFlow

A modern, responsive web application for mood and emotion tracking with AI-powered therapy recommendations, voice recognition, and personalized suggestions.

## 🚀 Features

- ✅ **User Authentication** - Sign up, Login with Firebase Auth
- ✅ **Interest Selection** - Choose interests in Social Media, Travel, and Food
- ✅ **AI Chatbot** - Text-based conversations with emotion detection
- ✅ **Voice Recognition** - Web Speech API for voice input and text-to-speech output
- ✅ **Emotion Detection** - Advanced NLP sentiment analysis
- ✅ **Mood History** - Track conversations, emotions, and trends
- ✅ **Personalized Recommendations** - Food, social media, and travel suggestions
- ✅ **Beautiful UI** - Modern design with Tailwind CSS
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite + React Router + Tailwind CSS
- **Backend:** Firebase (Authentication, Firestore, Cloud Functions)
- **AI/NLP:** Compromise.js (lightweight sentiment analysis)
- **Charts:** Recharts (mood visualization)
- **Voice:** Web Speech API + Speech Synthesis
- **Deployment:** Firebase Hosting

## 📋 Prerequisites

- Node.js v16+ and npm
- Firebase account (free tier works)
- Google account (for Firebase setup)

## 🔧 Installation & Setup

### 1. Clone/Setup Project

```bash
cd major_project_MHT/frontend
npm install
```

### 2. Setup Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (name: "MindFlow Therapy" or similar)
3. Enable these services:
   - **Authentication** → Email/Password provider
   - **Firestore Database** → Start in test mode
4. Copy your Firebase config

### 3. Configure Environment Variables

```bash
cd frontend
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxx
VITE_FIREBASE_APP_ID=xxxxx
VITE_GOOGLE_MAPS_API_KEY=optional
```

### 4. Firestore Database Setup

Create the following collections in Firestore:

**Collection: `users`**
```json
{
  "email": "user@example.com",
  "displayName": "User Name",
  "createdAt": "timestamp",
  "interests": {
    "socialMedia": ["instagram"],
    "travel": ["temple"],
    "food": ["veg"]
  },
  "preferences": {}
}
```

**Collection: `mood_history`**
```json
{
  "userId": "user_id",
  "messageType": "text",
  "userMessage": "I'm feeling happy",
  "detectedEmotion": "happy",
  "moodCategory": "positive",
  "confidenceScore": 0.85,
  "therapyResponse": "...",
  "recommendations": {},
  "timestamp": "timestamp"
}
```

## ▶️ Running the Project

### Development Server

```bash
cd frontend
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
cd frontend
npm run build
```

## 📱 App Workflow

1. **Sign In/Sign Up** → Create account with email and password
2. **Select Interests** → Choose preferences in Social Media, Travel, and Food
3. **Home Dashboard** → Access Chatbot, Voice Chat, or Mood History
4. **Chat with AI** → Type or speak to detect emotions and get recommendations
5. **View History** → See mood trends and past interactions
6. **Manage Profile** → Update settings and interests

## 🎯 Features Explained

### 1. Authentication
- Email/Password signup and login
- Firebase Authentication with persistent sessions
- Automatic redirect to Interest page after signup
- Secure logout functionality

### 2. Interest Page
- Select multiple interests from 3 categories
- Social Media: Instagram, Facebook, YouTube
- Travel: Temple, Park
- Food: Vegetarian, Non-Vegetarian, Beverages
- Interests stored in user profile

### 3. AI Chatbot
- Real-time emotion detection using keywords
- Therapy suggestions based on detected emotion
- Activity recommendations
- Personalized food, social media, and travel suggestions
- All conversations saved to Firestore

### 4. Voice Recognition
- Web Speech API for voice input
- Real-time transcription display
- Voice-to-mood detection
- Text-to-speech responses
- Same emotion analysis as text chat

### 5. Mood History
- Complete conversation timeline
- Emotion distribution charts
- Statistics (total conversations, common emotions, confidence)
- Date filtering and search
- Export capability (ready to implement)

### 6. Emotion Detection Logic

**Detected Emotions:**
- 😊 Happy - joy, excitement, love, great
- 😢 Sad - sadness, depression, lonely, heartbroken
- 😰 Anxious - anxiety, worry, stressed, panic
- 😠 Angry - anger, frustration, irritated, upset
- 😌 Calm - peaceful, relaxed, tranquil, zen
- 🤔 Confused - uncertain, confused, lost, bewildered
- 😐 Neutral - no strong emotion detected

## 🎨 Customization

### Change Colors

Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#YourColor',
      secondary: '#YourColor',
      // ...
    }
  }
}
```

### Add More Emotions

Edit `frontend/src/utils/emotionDetection.js`:
```javascript
const emotionKeywords = {
  myEmotion: ['keyword1', 'keyword2', ...],
  // ...
}
```

### Modify Recommendations

Edit `frontend/src/utils/recommendations.js` to add more food options, social media suggestions, or travel locations.

## 📊 Database Structure

```
Firestore Database
├── users/
│   ├── {uid}/
│   │   ├── email
│   │   ├── displayName
│   │   ├── interests
│   │   ├── preferences
│   │   └── createdAt
│
└── mood_history/
    ├── {docId}/
    │   ├── userId
    │   ├── timestamp
    │   ├── userMessage
    │   ├── detectedEmotion
    │   ├── moodCategory
    │   ├── confidenceScore
    │   ├── therapyResponse
    │   ├── messageType
    │   └── recommendations
```

## 🔐 Security Rules

Set these Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /mood_history/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (in root directory)
firebase init

# Build and deploy
cd frontend
npm run build
cd ..
firebase deploy
```

### Deploy to Vercel (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

## 🐛 Troubleshooting

### Issue: "Firebase not initialized"
**Solution:** Check if all environment variables are set correctly in `.env`

### Issue: "Voice recognition not working"
**Solution:** 
- Only works in Chrome, Edge, and Safari (not Firefox)
- Requires HTTPS in production
- Check browser microphone permissions

### Issue: "Firestore connection error"
**Solution:** 
- Check Firebase credentials in `.env`
- Verify Firestore database is created
- Check internet connection

### Issue: "Emotion detection not working"
**Solution:** 
- Check if Compromise.js is installed: `npm list compromise`
- Verify emotionDetection.js keywords

## 📈 Future Enhancements

- [ ] Advanced NLP with Hugging Face API
- [ ] Multi-language support
- [ ] Appointment scheduling with therapists
- [ ] Video consultation features
- [ ] Mobile app (React Native)
- [ ] Machine learning for better recommendations
- [ ] Integration with wearables
- [ ] Prescription reminders
- [ ] Community support features
- [ ] Advanced analytics dashboard

## 📚 API Documentation

### Emotion Detection Function

```javascript
detectEmotion(text) → {
  mood: 'positive' | 'negative' | 'neutral',
  emotion: 'happy' | 'sad' | 'anxious' | 'angry' | 'calm' | 'confused' | 'neutral',
  score: number,
  confidence: 0-1
}
```

### Therapy Suggestions

```javascript
generateTherapySuggestions(emotion) → [string, string, ...]
```

### Recommendations

```javascript
getFoodRecommendations(emotion, foodPreference) → [string, ...]
getSocialMediaSuggestions(emotion, platforms) → [string, ...]
getTravelRecommendations(emotion, travelType) → { places: [...], activities: [...] }
```

## 📞 Support

For issues or questions:
1. Check this README
2. Review error messages in browser console
3. Check Firebase console for errors
4. Verify all dependencies are installed

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Happy coding! Let's help people with their mental health! 💙**

