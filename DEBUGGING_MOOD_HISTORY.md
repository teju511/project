# Mood History Debugging Guide

## Issue: Mood History Not Displaying Data

The mood history page shows 0 conversations and "No mood data yet" even after sending messages.

## Diagnosis Steps

### Step 1: Check Browser Console Logs
1. Open your browser (Chrome/Edge/Safari)
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Look for messages starting with:
   - `💾 Saving to Firestore:` (when sending a message)
   - `✅ Mood history saved successfully:` (confirms save)
   - `📊 Fetching mood history for user:` (when opening History page)
   - `❌ Error...` (any error messages)

### Step 2: Common Issues & Solutions

#### Issue A: "permission-denied" Error
**Console shows:** `❌ Error code: permission-denied`

**Solution:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Build → Firestore Database**
4. Click **Rules** tab
5. Replace rules with:

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

6. Click **Publish**
7. Wait 30 seconds and try again

#### Issue B: "not-authenticated" Error
**Console shows:** `❌ Error code: not-authenticated` or user is not logged in

**Solution:**
1. Check if you're properly logged in
2. Make sure AuthContext is working (check for `currentUser`)
3. Verify Firebase Auth is enabled in Firebase Console

#### Issue C: Collection Doesn't Exist
**Console shows:** `❌ Error: mood_history collection doesn't exist`

**Solution:**
- Collections are created automatically when you first save data
- Send at least one message from the Chatbot to create the collection
- The collection will appear in Firestore Database after a few seconds

#### Issue D: Data Saves But Doesn't Show
**Console shows:**
- `✅ Mood history saved successfully: [docId]`
- BUT History page still shows 0 conversations

**Solution:**
1. Check if `userId` field matches exactly
2. Verify the `timestamp` field is being saved (it should show `serverTimestamp()`)
3. Go to Firebase Console → Firestore Database → mood_history collection
4. Look for your documents - are they there?

### Step 3: Manual Testing in Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to **Build → Firestore Database**
3. Click **Collections** or **mood_history** (if it exists)
4. Check:
   - ✅ Do documents exist?
   - ✅ Does the `userId` field match your logged-in user?
   - ✅ Does the document have `timestamp`, `userMessage`, `detectedEmotion` fields?

### Step 4: Network Issues

1. Open **Developer Tools → Network** tab
2. Go to the History page
3. Look for API calls in the Network tab
4. Check if any requests are failing (red status codes)

## What Should Happen

1. **When you send a message:**
   ```
   💾 Saving to Firestore: {userId: "abc123", userMessage: "I'm happy", ...}
   ✅ Mood history saved successfully: xyz789
   ```

2. **When you open History page:**
   ```
   📊 Fetching mood history for user: abc123
   📊 Retrieved documents: 1
   📄 Document: {userId: "abc123", userMessage: "I'm happy", ...}
   ✅ Mood history fetched successfully: 1 records
   ```

3. **History page should show:**
   - Total Conversations: 1
   - Most Common Emotion: Happy
   - Emotion Distribution chart with data
   - Recent Moods list with your message
   - Full Conversation History table with your message

## If Nothing Works

1. **Clear browser cache:**
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Clear all data
   - Reload the app

2. **Check Firebase configuration:**
   - Go to Firebase Console → Project Settings
   - Copy your credentials again
   - Update `.env` file in frontend folder
   - Restart dev server: `npm run dev`

3. **Verify Firestore is enabled:**
   - Firebase Console → Build → Firestore Database
   - If not created, click "Create database"

4. **Check real-time data:**
   - Open Firebase Console → Firestore Database
   - Open Collection: `mood_history`
   - Add a test document manually:
     ```
     userId: (your user ID)
     userMessage: "Test message"
     detectedEmotion: "happy"
     confidenceScore: 0.95
     timestamp: (current time)
     ```
   - Go to History page - does it show?

## Still Not Working?

Open console and run:
```javascript
// Check if user is logged in
console.log('Current user:', firebase.auth().currentUser?.uid);

// Check Firebase config
console.log('Firebase initialized:', firebase.apps.length > 0);

// Check Firestore connection
firebase.firestore().collection('mood_history').limit(1).get().then(snap => {
  console.log('Firestore connection OK, documents:', snap.size);
});
```

## Files to Check

- [firebase.js](frontend/src/config/firebase.js) - Firebase config
- [Chatbot.jsx](frontend/src/components/Chatbot.jsx) - Text chat save logic
- [VoiceRecognition.jsx](frontend/src/components/VoiceRecognition.jsx) - Voice chat save logic
- [HistoryPage.jsx](frontend/src/pages/HistoryPage.jsx) - History display logic
- [AuthContext.jsx](frontend/src/contexts/AuthContext.jsx) - User authentication
