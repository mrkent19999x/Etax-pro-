#!/usr/bin/env node

/**
 * Script để setup test user trong Firebase Production
 * Tạo user trong Auth và Firestore
 */

const admin = require('firebase-admin');

// Initialize Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'anhbao-373f3'
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function setupTestUser(email, password, mst, name, role = 'user') {
  try {
    console.log(`\n🔧 Setting up test user: ${email}`);
    
    // Check if user already exists
    let user;
    try {
      user = await auth.getUserByEmail(email);
      console.log(`✅ User ${email} đã tồn tại trong Auth`);
      console.log(`   UID: ${user.uid}`);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        console.log('📝 Đang tạo user mới trong Auth...');
        user = await auth.createUser({
          email: email,
          password: password,
          emailVerified: false,
          disabled: false
        });
        console.log(`✅ Đã tạo user trong Auth: ${user.uid}`);
      } else {
        throw error;
      }
    }
    
    // Check/create user document in Firestore
    const userDocRef = db.collection('users').doc(user.uid);
    const userDoc = await userDocRef.get();
    
    if (userDoc.exists) {
      console.log('✅ User document đã tồn tại trong Firestore');
      const data = userDoc.data();
      console.log(`   Role: ${data.role || 'N/A'}`);
      console.log(`   MST List: ${JSON.stringify(data.mstList || [])}`);
      
      // Update if needed
      if (!data.mstList || !data.mstList.includes(mst)) {
        console.log(`📝 Đang cập nhật MST list...`);
        await userDocRef.update({
          mstList: admin.firestore.FieldValue.arrayUnion(mst),
          email: email,
          name: name || data.name,
          role: role || data.role || 'user'
        });
        console.log(`✅ Đã cập nhật user document`);
      }
    } else {
      console.log('📝 Đang tạo user document trong Firestore...');
      await userDocRef.set({
        userId: user.uid,
        email: email,
        name: name || 'Test User',
        role: role,
        mstList: [mst],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`✅ Đã tạo user document trong Firestore`);
    }
    
    // Summary
    console.log('\n📊 User Info:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   MST: ${mst}`);
    console.log(`   Role: ${role}`);
    console.log(`   UID: ${user.uid}`);
    
    return { success: true, uid: user.uid };
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🚀 Bắt đầu setup test users...\n');
  
  const testUsers = [
    {
      email: 'mrkent1999x@gmail.com',
      password: 'nghiadaica',
      mst: '00109202830',
      name: 'Test User 1',
      role: 'user'
    },
    {
      email: 'admin@test.com',
      password: 'admin123',
      mst: '999999999',
      name: 'Admin Test',
      role: 'admin'
    }
  ];
  
  for (const user of testUsers) {
    const result = await setupTestUser(
      user.email,
      user.password,
      user.mst,
      user.name,
      user.role
    );
    
    if (result.success) {
      console.log(`\n✅ Setup thành công cho ${user.email}`);
    } else {
      console.log(`\n❌ Setup thất bại cho ${user.email}`);
    }
    console.log('─'.repeat(50));
  }
  
  console.log('\n📝 Test Login Info:');
  console.log('   Email: mrkent1999x@gmail.com');
  console.log('   Password: nghiadaica');
  console.log('   MST: 00109202830');
  console.log('\n   Hoặc:');
  console.log('   Email: admin@test.com');
  console.log('   Password: admin123');
  console.log('   MST: 999999999 (admin)\n');
}

main().catch(console.error);

