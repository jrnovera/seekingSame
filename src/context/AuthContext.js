import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          const userData = userDoc.data();
          
          const mappedUser = {
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || fbUser.email?.split('@')[0],
            role: (userData?.role || 'host')?.toLowerCase(), // normalize
            display_name: userData?.display_name || fbUser.displayName,
            photo_url: userData?.photo_url || null,
            uid: fbUser.uid,
            phone_number: userData?.phone_number || null,
            created_time: userData?.created_time || null,
            isNewUser: userData?.isNewUser || false,
            favorites: userData?.favorites || [],
            walkthrough: userData?.walkthrough || false,
            isVerified: userData?.isVerified || false,
            isSuspended: userData?.isSuspended || false,
            recentSearch: userData?.recentSearch || [],
            idPhoto: userData?.idPhoto || null,
            isSubscribe: userData?.isSubscribe || false
          };
          setUser(mappedUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Fallback to basic user data
          const mappedUser = {
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || fbUser.email?.split('@')[0],
            role: 'host'
          };
          setUser(mappedUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password, phoneNumber = null, idPhoto = null) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) {
        await updateProfile(cred.user, { displayName: name });
      }

      // Create user profile in Firestore with host role
      const userProfile = {
        email: email,
        display_name: name,
        photo_url: null,
        uid: cred.user.uid,
        created_time: new Date(),
        phone_number: phoneNumber,
        password: password, // Store password for reference
        isNewUser: true,
        role: 'host', // Default role for new accounts
        favorites: [],
        walkthrough: false,
        isVerified: false,
        isSuspended: false,
        recentSearch: [],
        idPhoto: idPhoto,
        isSubscribe: false
      };

      await setDoc(doc(db, 'users', cred.user.uid), userProfile);

      return { success: true, user: cred.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    setUser,  // Export setUser function to allow direct updates
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
