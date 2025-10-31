/**
 * Script tạo test data cho Firestore Emulator
 * Dùng Firebase Admin SDK để bypass rules (vì đây là script admin)
 * 
 * Usage: node scripts/create-test-data.js
 */

const admin = require('firebase-admin');

// Initialize với emulator
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';

// Initialize Firebase Admin với project ID
admin.initializeApp({
  projectId: 'anhbao-373f3'
});

const db = admin.firestore();

async function createTestData() {
  console.log('🚀 Creating test data in Firestore Emulator...\n');
  
  try {
    // 1. Tạo admin user document (giả sử UID là 'admin-test-uid')
    const adminUid = 'admin-test-uid';
    await db.collection('users').doc(adminUid).set({
      userId: adminUid,
      email: 'admin@test.com',
      name: 'Admin Test User',
      role: 'admin',
      mstList: ['00109202830', '999999999'],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created admin user document:', adminUid);
    
    // 2. Tạo regular user document
    const regularUid = 'user-test-uid';
    await db.collection('users').doc(regularUid).set({
      userId: regularUid,
      email: 'user@test.com',
      name: 'Regular Test User',
      role: 'user',
      mstList: ['123456789'],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created regular user document:', regularUid);
    
    // 3. Tạo template
    const templateId = 'test-template-1';
    await db.collection('templates').doc(templateId).set({
      id: templateId,
      name: 'Test Template',
      htmlTemplate: '<html><body><h1>{{taxpayerName}}</h1><p>Amount: {{amount}}</p></body></html>',
      type: 'pdf',
      isActive: true,
      isDefault: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created template:', templateId);
    
    // 4. Tạo mapping
    const mappingId = 'test-template-1';
    await db.collection('mappings').doc(mappingId).set({
      templateId: mappingId,
      fields: {
        taxpayerName: { visible: true, format: 'text' },
        amount: { visible: true, format: 'currency' }
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created mapping:', mappingId);
    
    // 5. Tạo transactions
    const transaction1 = '00109202830';
    await db.collection('transactions').doc(transaction1).set({
      mst: transaction1,
      taxpayerName: 'TỬ XUÂN CHIẾN',
      taxpayerAddress: 'Test Address',
      amount: 1000000,
      paymentDate: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created transaction:', transaction1);
    
    const transaction2 = '123456789';
    await db.collection('transactions').doc(transaction2).set({
      mst: transaction2,
      taxpayerName: 'Test User 2',
      taxpayerAddress: 'Test Address 2',
      amount: 2000000,
      paymentDate: admin.firestore.FieldValue.serverTimestamp(),
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created transaction:', transaction2);
    
    console.log('\n✅ All test data created successfully!');
    console.log('\n📋 Test Data Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Users:');
    console.log('  - Admin: users/admin-test-uid (role: admin, mstList: [00109202830, 999999999])');
    console.log('  - Regular: users/user-test-uid (role: user, mstList: [123456789])');
    console.log('\nCollections:');
    console.log('  - templates/test-template-1');
    console.log('  - mappings/test-template-1');
    console.log('  - transactions/00109202830 (accessible by admin & user with MST 00109202830)');
    console.log('  - transactions/123456789 (accessible by admin & user with MST 123456789)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📝 Next Steps:');
    console.log('1. Open Emulator UI: http://localhost:4000');
    console.log('2. View Firestore data in the UI');
    console.log('3. Test rules by logging in with different users in the app');
    console.log('4. Try to read/write documents and verify rules work correctly\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    process.exit(1);
  }
}

createTestData();

