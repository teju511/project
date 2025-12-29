# Mood History Data Flow - Visual Guide

## 📊 Complete Data Flow Diagram

### When User Sends a Message

```
┌─────────────────────────────────────────────────────────────────┐
│  USER SENDS MESSAGE: "I'm feeling happy today"                  │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
            ┌──────────────────────┐
            │ Message is displayed │
            │ in chat bubble       │
            └──────────┬───────────┘
                       │
                       ▼
        ┌─────────────────────────────────┐
        │  Detect Emotion from text       │
        │  Result: "happy"                │
        │  Confidence: 0.95               │
        └──────────┬──────────────────────┘
                   │
                   ▼
       ┌────────────────────────────┐
       │ Generate AI Response       │
       │ Get recommendations        │
       │ (Food, Travel, etc.)       │
       └──────────┬─────────────────┘
                  │
                  ▼
        ┌─────────────────────────┐
        │ Ready to Save to DB     │
        │ Prepare data object:    │
        │ {                       │
        │   userId: "abc123"      │
        │   userMessage: "..."    │
        │   detectedEmotion: "..." │
        │   confidenceScore: 0.95 │
        │   timestamp: now()      │
        │ }                       │
        └──────────┬──────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │ SAVE TO FIRESTORE                │
    │ Collection: mood_history         │
    │ 💾 Saving to Firestore: {...}    │ ← Console Log
    └──────────┬───────────────────────┘
               │
               ▼ (Success)
    ┌──────────────────────────────────────┐
    │ Document saved with ID: "xyz789"    │
    │ ✅ Mood history saved successfully:  │ ← Console Log
    │ xyz789                               │
    └──────────┬───────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Data is now in Firestore!        │
    │ Ready to be queried              │
    └──────────────────────────────────┘
```

### When User Opens Mood History Page

```
┌────────────────────────────────────────────────────────┐
│ USER CLICKS: "Mood History" from menu                  │
└──────────────┬─────────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ HistoryPage Component Loads  │
    │ Check if user is logged in   │
    └──────────┬───────────────────┘
               │
               ▼ (User logged in)
    ┌──────────────────────────────────┐
    │ 📊 Fetching mood history for:    │
    │ user: abc123                     │ ← Console Log
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────┐
    │ Query Firestore:                     │
    │ Collection: mood_history             │
    │ WHERE: userId == currentUser.uid     │
    │ ORDER BY: timestamp desc             │
    └──────────┬──────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────┐
    │ 📊 Retrieved documents: 1             │ ← Console Log
    │ ✅ Mood history fetched: 1 records   │ ← Console Log
    └──────────┬──────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Process Retrieved Data:          │
    │ ├─ Calculate total count: 1      │
    │ ├─ Find common emotion: happy    │
    │ ├─ Calculate avg confidence: 95% │
    │ ├─ Prepare data for charts       │
    │ └─ Format table rows             │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────┐
    │ DISPLAY ALL STATS & DATA:            │
    │ ├─ Total Conversations: 1            │
    │ ├─ Most Common Emotion: Happy        │
    │ ├─ Avg. Confidence: 95%              │
    │ ├─ Emotion Distribution Chart        │
    │ ├─ Recent Moods List                 │
    │ └─ Full Conversation History Table   │
    └──────────────────────────────────────┘
```

## 🔄 Error Handling Flow

```
┌────────────────────────────────────────────────────┐
│ Operation (Save or Fetch) Encounters Error         │
└──────────────┬───────────────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────┐
    │ Catch Exception                  │
    │ Extract error.code               │
    │ Extract error.message            │
    └──────────┬───────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────┐
    │ ❌ Log Error with details:               │
    │ ├─ Console: ❌ Error code: permission... │
    │ ├─ Console: ❌ Error message: Missing... │
    │ └─ Show in UI (if applicable)            │
    └──────────┬──────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────┐
    │ User Can Now:                        │
    │ 1. Check console (F12)               │
    │ 2. Note the error code              │
    │ 3. Look up code in guide            │
    │ 4. Apply the fix                    │
    │ 5. Try again                        │
    └──────────────────────────────────────┘
```

## 📁 Data Structure in Firestore

```
FIRESTORE DATABASE
└── mood_history (collection)
    ├── Document 1 (xyz789)
    │   ├── userId: "abc123"
    │   ├── messageType: "text"
    │   ├── userMessage: "I'm feeling happy today"
    │   ├── detectedEmotion: "happy"
    │   ├── moodCategory: "positive"
    │   ├── confidenceScore: 0.95
    │   ├── therapyResponse: "I sense you're feeling HAPPY..."
    │   ├── timestamp: 2024-12-29T10:30:00Z
    │   └── recommendations: {...}
    │
    ├── Document 2 (abc456)
    │   ├── userId: "abc123"
    │   ├── messageType: "voice"
    │   ├── userMessage: "I'm feeling anxious"
    │   ├── detectedEmotion: "anxious"
    │   ├── moodCategory: "negative"
    │   ├── confidenceScore: 0.87
    │   ├── therapyResponse: "..."
    │   ├── timestamp: 2024-12-28T14:15:00Z
    │   └── recommendations: {...}
    │
    └── Document 3 (def789)
        ├── userId: "abc123"
        ├── messageType: "text"
        ├── userMessage: "Feeling calm and peaceful"
        ├── detectedEmotion: "calm"
        ├── moodCategory: "neutral"
        ├── confidenceScore: 0.92
        ├── therapyResponse: "..."
        ├── timestamp: 2024-12-27T09:00:00Z
        └── recommendations: {...}
```

## 🔐 Security Rules Flow

```
┌─────────────────────────────────────────────┐
│ User tries to WRITE (Save) data             │
└──────────────┬──────────────────────────────┘
               │
               ▼
    ┌──────────────────────────────────────────┐
    │ Check Firestore Security Rules:          │
    │                                          │
    │ IF request.auth.uid == userId in data    │
    │   └─ ALLOW CREATE                        │
    │ ELSE                                     │
    │   └─ DENY with permission-denied error   │
    └──────────┬───────────────────────────────┘
               │
               ├─ Allow ──→ Data is saved ✅
               │
               └─ Deny ──→ Error: permission-denied ❌
                           (Fix: Check rules)
```

## 🧪 Testing Checklist with Console Logs

```
STEP 1: Send a Message
├─ Action: Type message and click Send
├─ Watch Console for:
│  ├─ 💾 Saving to Firestore: {...}
│  ├─ ✅ Mood history saved successfully: [ID]
│  └─ No ❌ errors
└─ Result: ✓ Save successful

STEP 2: Go to Mood History Page
├─ Action: Click "Mood History" menu
├─ Watch Console for:
│  ├─ 📊 Fetching mood history for user: [uid]
│  ├─ 📊 Retrieved documents: 1+
│  ├─ ✅ Mood history fetched successfully: [count]
│  └─ No ❌ errors
└─ Result: ✓ Fetch successful

STEP 3: Check UI Display
├─ Total Conversations: Shows count
├─ Most Common Emotion: Shows emotion name
├─ Avg. Confidence: Shows percentage
├─ Emotion Distribution: Shows chart with bars
├─ Recent Moods: Shows list of emotions
└─ Conversation History: Shows table with messages
    Result: ✓ All data displayed correctly
```

## 🔍 Console Log Legend

| Log | Meaning | Status |
|-----|---------|--------|
| `💾 Saving to Firestore:` | Starting save operation | ℹ️ Info |
| `✅ Mood history saved successfully:` | Save completed | ✓ Success |
| `📊 Fetching mood history for user:` | Starting fetch | ℹ️ Info |
| `📊 Retrieved documents:` | Query returned data | ℹ️ Info |
| `📄 Document:` | Individual document data | ℹ️ Info |
| `✅ Mood history fetched successfully:` | Fetch completed | ✓ Success |
| `❌ Error code: [code]` | Error occurred | ❌ Error |
| `❌ Error message: [msg]` | Error details | ❌ Error |

## 🎯 Expected Console Output

### Success Case:
```
💾 Saving to Firestore: {userId: "abc123", userMessage: "I'm happy", detectedEmotion: "happy", confidenceScore: 0.95}
✅ Mood history saved successfully: xyz789

📊 Fetching mood history for user: abc123
📊 Retrieved documents: 1
📄 Document: {userId: "abc123", userMessage: "I'm happy", detectedEmotion: "happy"...}
✅ Mood history fetched successfully: 1 records
```

### Error Case:
```
💾 Saving to Firestore: {userId: "abc123", userMessage: "I'm happy", ...}
❌ Error code: permission-denied
❌ Error message: Missing or insufficient permissions
```

---

**This visual guide helps understand the complete data flow from user input to display. Use this to trace where issues might be occurring.**
