// Firebase initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAy3lwlcebC9YJs_EjObxllyhJovtDfRA0",
  authDomain: "seekingsame-80ee1.firebaseapp.com",
  projectId: "seekingsame-80ee1",
  storageBucket: "seekingsame-80ee1.firebasestorage.app",
  messagingSenderId: "483463161228",
  appId: "1:483463161228:web:08b9e64a60b129813e62a9",
  measurementId: "G-01H0MN0DQG"
};

const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize analytics only if supported (avoids SSR issues)
export let analytics = null;
(async () => {
  if (await isSupported()) {
    analytics = getAnalytics(app);
  }
})();

export default app;
