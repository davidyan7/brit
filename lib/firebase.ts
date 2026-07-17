import { initializeApp, getApps, getApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'car-detaling.firebaseapp.com',
  databaseURL:
    'https://car-detaling-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'car-detaling',
  storageBucket: 'car-detaling.firebasestorage.app',
  messagingSenderId: '163368201185',
  appId: '1:163368201185:web:c633cb3c85d69f747800a0',
  measurementId: 'G-3Q1V1NHWG3',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getDatabase(app)
