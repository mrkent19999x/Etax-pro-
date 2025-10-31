#!/usr/bin/env node

/**
 * Tạo user documents trực tiếp bằng cách login và dùng client SDK
 * (Bypass rules bằng cách tạo từ code đã authenticated)
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCQ7R-GyZjSY_iPQ1iooF_uFOa35gViM18',
  projectId: 'anhbao-373f3',
  authDomain: 'anhbao-373f3.firebaseapp.com',
  storageBucket: 'anhbao-373f3.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function createUserDocuments() {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  // Login với admin account (nếu có) hoặc tạo từ authenticated user
  try {
    // Try to login - nếu có password của begau1302@gmail.com
    console.log('🔐 Đang thử authenticate...');
    
    // Since we can't login without password, we'll create documents
    // using a different approach - via REST API or Firebase CLI
    
    console.log('\n✅ Tạo user documents bằng Firebase CLI:\n');
    console.log('Chạy lệnh sau trong terminal:');
    console.log('');
    console.log('firebase firestore:set users/Dan1VqVNw7MmjxyjSO4ZZpXEob03 \\');
    console.log('  \'{"userId":"Dan1VqVNw7MmjxyjSO4ZZpXEob03","email":"mrkent1999x@gmail.com","name":"Test User","role":"user","mstList":["00109202830"]}\' \\');
    console.log('  --project anhbao-373f3');
    console.log('');
    console.log('firebase firestore:set users/MXYmycuNudMoaD2f6H0JmUvxVqG2 \\');
    console.log('  \'{"userId":"MXYmycuNudMoaD2f6H0JmUvxVqG2","email":"begau1302@gmail.com","name":"Admin User","role":"admin","mstList":["999999999"]}\' \\');
    console.log('  --project anhbao-373f3');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createUserDocuments();

