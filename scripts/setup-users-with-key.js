#!/usr/bin/env node

/**
 * Script tự động setup users - CHỈ CẦN SERVICE ACCOUNT KEY
 * 
 * Cách dùng:
 * 1. Tải service account key từ Firebase Console:
 *    Project Settings > Service Accounts > Generate New Private Key
 * 2. Chạy: GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json" node scripts/setup-users-with-key.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Users cần tạo
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

async function setupUsers() {
  // Check if credentials are set
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!credPath) {
    console.log('❌ Cần set GOOGLE_APPLICATION_CREDENTIALS');
    console.log('\n📝 Cách lấy service account key:');
    console.log('   1. Vào: https://console.firebase.google.com/project/anhbao-373f3/settings/serviceaccounts/adminsdk');
    console.log('   2. Click "Generate New Private Key"');
    console.log('   3. Save file (ví dụ: service-account-key.json)');
    console.log('   4. Chạy: GOOGLE_APPLICATION_CREDENTIALS="service-account-key.json" node scripts/setup-users-with-key.js\n');
    process.exit(1);
  }

  // Initialize Admin SDK
  try {
    const serviceAccount = require(path.resolve(credPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'anhbao-373f3'
    });
    console.log('✅ Đã khởi tạo Admin SDK\n');
  } catch (error) {
    console.error('❌ Lỗi khởi tạo Admin SDK:', error.message);
    process.exit(1);
  }

  const db = admin.firestore();
  console.log('🚀 Bắt đầu setup users...\n');

  for (const user of users) {
    try {
      const userRef = db.collection('users').doc(user.uid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        console.log(`📝 Đang cập nhật: ${user.email}`);
        await userRef.update({
          email: user.email,
          name: user.name,
          role: user.role,
          mstList: user.mstList,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else {
        console.log(`📝 Đang tạo: ${user.email}`);
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

      console.log(`✅ Hoàn thành: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   MST: ${user.mstList.join(', ')}\n`);
    } catch (error) {
      console.error(`❌ Lỗi với ${user.email}:`, error.message);
    }
  }

  console.log('✅ HOÀN TẤT! Bây giờ có thể login:\n');
  console.log('📝 Test Accounts:');
  console.log('   Email: mrkent1999x@gmail.com');
  console.log('   Password: nghiadaica');
  console.log('   MST: 00109202830\n');
}

setupUsers().catch(console.error);

