import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword as firebaseCreateUser, 
  signInWithEmailAndPassword as firebaseSignIn, 
  signOut as firebaseSignOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { mockAuthFunctions } from '../config/mockAuth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMockMode, setIsMockMode] = useState(false);

  // Sign up function
  async function signup(email, password, displayName) {
    if (!auth) {
      throw new Error('Firebase auth is not initialized. Check your configuration.');
    }
    
    console.log('Attempting signup with email:', email);
    
    try {
      // Try real Firebase first
      const userCredential = await firebaseCreateUser(auth, email, password);
      console.log('✓ Signup successful with Firebase');
      
      // Store user profile in Firestore
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          displayName,
          createdAt: new Date(),
          interests: [],
          moodHistory: [],
          preferences: {
            socialMedia: [],
            travel: [],
            food: []
          }
        });
      } catch (firestoreError) {
        console.warn('Could not save to Firestore, continuing anyway:', firestoreError);
      }

      return userCredential.user;
    } catch (firebaseError) {
      console.warn('Firebase signup failed, trying mock auth:', firebaseError.code);
      
      // Fallback to mock auth
      if (firebaseError.code === 'auth/operation-not-allowed') {
        console.log('🎭 Switching to Mock Auth Mode (Email/Password not enabled in Firebase)');
        setIsMockMode(true);
        
        const mockResult = await mockAuthFunctions.createUserWithEmailAndPassword(auth, email, password);
        
        // Store mock user data in localStorage
        const mockUser = mockResult.user;
        localStorage.setItem('mockUser_' + mockUser.uid, JSON.stringify({
          email,
          displayName,
          createdAt: new Date(),
          interests: [],
          moodHistory: [],
          preferences: {
            socialMedia: [],
            travel: [],
            food: []
          }
        }));
        
        return mockUser;
      }
      
      throw firebaseError;
    }
  }

  // Login function
  function login(email, password) {
    if (!auth) {
      throw new Error('Firebase auth is not initialized. Check your configuration.');
    }
    
    console.log('Attempting login with email:', email);
    
    return firebaseSignIn(auth, email, password).catch(async (firebaseError) => {
      console.warn('Firebase login failed, trying mock auth:', firebaseError.code);
      
      if (firebaseError.code === 'auth/operation-not-allowed') {
        console.log('🎭 Using Mock Auth Mode for login');
        setIsMockMode(true);
        return mockAuthFunctions.signInWithEmailAndPassword(auth, email, password);
      }
      
      throw firebaseError;
    });
  }

  // Logout function
  function logout() {
    if (isMockMode) {
      setIsMockMode(false);
      setCurrentUser(null);
      setUserProfile(null);
      return Promise.resolve();
    }
    return firebaseSignOut(auth);
  }

  // Fetch user profile from Firestore or localStorage
  async function fetchUserProfile(uid) {
    try {
      if (isMockMode) {
        // Load from localStorage
        const mockData = localStorage.getItem('mockUser_' + uid);
        if (mockData) {
          const profile = JSON.parse(mockData);
          setUserProfile(profile);
          return profile;
        }
      } else {
        // Load from Firestore
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data());
          return userDoc.data();
        }
      }
    } catch (error) {
      console.warn('Error fetching user profile:', error);
      // Continue anyway, profile can be empty
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    logout,
    fetchUserProfile,
    loading,
    isMockMode
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
