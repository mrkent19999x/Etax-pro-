#!/usr/bin/env node

/**
 * Script tự động setup users trong Firestore
 * Sử dụng Firebase CLI credentials
 */

const admin = require('firebase-admin');
const { execSync } = require('child_process');

// Get access token from Firebase CLI
function getAccessToken() {
  try {
    const token = execSync('firebase login:ci 2>&1 || echo ""', { encoding: 'utf8' }).trim();
    if (token && !token.includes('error')) {
      return token;
    }
    // Try to get from current session
    const whoami = execSync('firebase projects:list 2>&1', { encoding: 'utf8' });
    if (whoami.includes('anhbao-373f3')) {
      // CLI is already authenticated
      return 'USE_CLI_AUTH';
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Initialize Admin SDK with Application Default Credentials
async function initAdmin() {
  try {
    // Try Application Default Credentials first (works if Firebase CLI is logged in)
    if (!admin.apps.length) {
      admin.initializeApp({
        projectId: 'anhbao-373f3',
        // Use Application Default Credentials (from gcloud or Firebase CLI)
      });
    }
    return true;
  } catch (error) {
    console.error('❌ Cannot initialize Admin SDK:', error.message);
    console.log('\n💡 Trying alternative method...');
    return false;
  }
}

// Setup users directly in Firestore using REST API
async function setupUsersViaREST() {
  const users = [
    {
      uid: 'Dan1VqVNw7MmjxyjSO4ZZpXEob03',
      email: 'mrkent1999x@gmail.com',
      name: 'Test User',
      role: 'user',
      mstList: ['00109202830']
    },
    {
      uid: 'MXYmycuNudMoaD2f6H0JmUvxVqG2',
      email: 'begau1302@gmail.com',
      name: 'Admin User',
      role: 'admin',
      mstList: ['999999999']
    }
  ];

  console.log('🔧 Đang setup users trong Firestore...\n');

  for (const user of users) {
    try {
      // Create document using Admin SDK
      const db = admin.firestore();
      const userRef = db.collection('users').doc(user.uid);
      
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        console.log(`✅ User ${user.email} đã có document, đang cập nhật...`);
        await userRef.update({
          email: user.email,
          name: user.name,
          role: user.role,
          mstList: user.mstList,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        console.log(`📝 Đang tạo document cho ${user.email}...`);
        await userRef.set({
          userId: user.uid,
          email: user.email,
          name: user.name,
          role: user.role,
          mstList: user.mstList,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      
      console.log(`✅ Đã setup xong cho ${user.email}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   MST: ${user.mstList.join(', ')}\n`);
    } catch (error) {
      console.error(`❌ Lỗi khi setup ${user.email}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Bắt đầu tự động setup users...\n');
  
  // Try to initialize Admin SDK
  const initialized = await initAdmin();
  
  if (initialized) {
    await setupUsersViaREST();
    console.log('✅ Hoàn thành! Bây giờ có thể login:\n');
    console.log('📝 Test Accounts:');
    console.log('   1. Email: mrkent1999x@gmail.com');
    console.log('      Password: nghiadaica');
    console.log('      MST: 00109202830');
    console.log('\n   2. Email: begau1302@gmail.com');
    console.log('      Password: [password của anh]');
    console.log('      Role: admin\n');
  } else {
    console.log('⚠️  Không thể dùng Admin SDK.');
    console.log('\n📝 Hướng dẫn nhanh:');
    console.log('   1. Vào: https://console.firebase.google.com/project/anhbao-373f3/firestore');
    console.log('   2. Collection: users');
    console.log('   3. Document ID: Dan1VqVNw7MmjxyjSO4ZZpXEob03');
    console.log('   4. Data: {userId, email, name, role: "user", mstList: ["00109202830"]}');
  }
}

main().catch(console.error);

