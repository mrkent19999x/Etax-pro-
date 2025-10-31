#!/usr/bin/env node

/**
 * Script để test login trên production Firebase
 * Sử dụng Firebase Admin SDK để tạo user (nếu chưa có) và test login
 */

const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

// Firebase config từ .env.local (production)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCQ7R-GyZjSY_iPQ1iooF_uFOa35gViM18',
  projectId: 'anhbao-373f3',
  authDomain: 'anhbao-373f3.firebaseapp.com',
  storageBucket: 'anhbao-373f3.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

async function testLogin(email, password) {
  try {
    console.log(`\n🔐 Testing login với email: ${email}`);
    
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    // Test login
    console.log('📝 Đang đăng nhập...');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Login thành công!');
    console.log(`   User ID: ${cred.user.uid}`);
    console.log(`   Email: ${cred.user.email}`);
    
    // Check role
    console.log('📋 Đang kiểm tra role...');
    const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log('✅ User document tồn tại:');
      console.log(`   Role: ${data.role || 'undefined'}`);
      console.log(`   Name: ${data.name || 'N/A'}`);
      console.log(`   MST List: ${JSON.stringify(data.mstList || [])}`);
      
      // Check redirect
      if (data.role === 'admin') {
        console.log('🔀 Sẽ redirect đến: /admin');
      } else {
        console.log('🔀 Sẽ redirect đến: / (home)');
      }
    } else {
      console.log('⚠️  User document không tồn tại trong Firestore');
      console.log('   → Cần tạo user document với role trong Firestore');
    }
    
    return { success: true, uid: cred.user.uid, role: userDoc.exists() ? userDoc.data().role : undefined };
  } catch (error) {
    console.error('❌ Login thất bại:');
    console.error(`   Error code: ${error.code}`);
    console.error(`   Error message: ${error.message}`);
    
    if (error.code === 'auth/user-not-found') {
      console.log('\n💡 User chưa tồn tại. Cần tạo user trong Firebase Console:');
      console.log('   1. Vào Firebase Console → Authentication');
      console.log('   2. Add User → Email/Password');
      console.log(`   3. Email: ${email}`);
      console.log(`   4. Password: ${password}`);
    } else if (error.code === 'auth/wrong-password') {
      console.log('\n💡 Password sai. Vui lòng kiểm tra lại password.');
    }
    
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Bắt đầu test login trên production...\n');
  
  const emails = [
    'mrkent1999x@gmail.com',
    'mrkent19999x@gmail.com'
  ];
  const password = 'nghiadaica';
  
  for (const email of emails) {
    const result = await testLogin(email, password);
    if (result.success) {
      console.log(`\n✅ TEST PASSED cho ${email}`);
    } else {
      console.log(`\n❌ TEST FAILED cho ${email}`);
    }
    console.log('─'.repeat(50));
  }
  
  console.log('\n📊 Tổng kết:');
  console.log('   - Test hoàn thành');
  console.log('   - Kiểm tra kết quả ở trên\n');
}

main().catch(console.error);

