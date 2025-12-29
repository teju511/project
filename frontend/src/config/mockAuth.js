// Mock Authentication for Development
// This allows testing without Firebase Email/Password being enabled

const mockUsers = new Map();

export const mockAuthFunctions = {
  createUserWithEmailAndPassword: async (auth, email, password) => {
    console.log('🎭 Mock Auth: Creating user', email);
    
    if (mockUsers.has(email)) {
      throw { code: 'auth/email-already-in-use', message: 'Email already registered' };
    }
    
    if (password.length < 6) {
      throw { code: 'auth/weak-password', message: 'Password should be at least 6 characters' };
    }
    
    const uid = 'user_' + Date.now();
    const user = {
      uid,
      email,
      displayName: '',
      emailVerified: false,
      metadata: {
        creationTime: new Date(),
        lastSignInTime: new Date()
      }
    };
    
    mockUsers.set(email, { user, password });
    
    return {
      user: {
        uid,
        email,
        displayName: '',
        emailVerified: false,
        isAnonymous: false,
        metadata: {
          creationTime: new Date(),
          lastSignInTime: new Date()
        }
      }
    };
  },

  signInWithEmailAndPassword: async (auth, email, password) => {
    console.log('🎭 Mock Auth: Signing in', email);
    
    if (!mockUsers.has(email)) {
      throw { code: 'auth/user-not-found', message: 'User not found' };
    }
    
    const userData = mockUsers.get(email);
    if (userData.password !== password) {
      throw { code: 'auth/wrong-password', message: 'Password is incorrect' };
    }
    
    const user = userData.user;
    user.metadata.lastSignInTime = new Date();
    
    return { user };
  },

  signOut: async (auth) => {
    console.log('🎭 Mock Auth: Signing out');
    return Promise.resolve();
  },

  onAuthStateChanged: (auth, callback) => {
    // Simulate auth state change listener
    console.log('🎭 Mock Auth: Listening for auth state changes');
    
    // Return unsubscribe function
    return () => {
      console.log('🎭 Mock Auth: Unsubscribed from auth state');
    };
  }
};

export const isMockAuthMode = () => {
  return true; // Enabled for development
};
