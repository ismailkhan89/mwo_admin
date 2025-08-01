import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDPIpVWB84XCO8jOKvBj2tNUg6b9pQJQkM",
  authDomain: "welfare-c639a.firebaseapp.com",
  projectId: "welfare-c639a",
  storageBucket: "welfare-c639a.firebasestorage.app",
  messagingSenderId: "166419770519",
  appId: "1:166419770519:web:8e371175e5bcfd248e8dd2",
  measurementId: "G-NCE3GGJXF5"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;