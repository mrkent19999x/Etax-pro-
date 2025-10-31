/**
 * Script test Firestore Rules
 * Chạy script này để tạo test data và verify rules
 * 
 * Usage: node scripts/test-firestore-rules.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator, collection, doc, setDoc, getDoc, deleteDoc } = require('firebase/firestore');
const { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

// Firebase config từ .env (hardcode cho test local)
const firebaseConfig = {
  apiKey: "AIzaSyCQ7R-GyZjSY_iPQ1iooF_uFOa35gViM18",
  authDomain: "anhbao-373f3.firebaseapp.com",
  projectId: "anhbao-373f3",
  storageBucket: "anhbao-373f3.firebasestorage.app",
  messagingSenderId: "599456783339",
  appId: "1:599456783339:web:cd57a672317cfaf2d617ae"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Connect to emulators
connectFirestoreEmulator(db, 'localhost', 8080);
connectAuthEmulator(auth, 'http://localhost:9099');

async function createTestUsers() {
  console.log('🧪 Creating test users...\n');
  
  try {
    // Tạo admin user
    const adminEmail = 'admin@test.com';
    const adminPassword = 'admin123';
    
    let adminUser;
    try {
      adminUser = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('✅ Created admin user:', adminUser.user.uid);
      
      // Tạo user document với role admin
      await setDoc(doc(db, 'users', adminUser.user.uid), {
        userId: adminUser.user.uid,
        email: adminEmail,
        name: 'Admin Test User',
        role: 'admin',
        mstList: ['00109202830', '999999999'],
        createdAt: new Date()
      });
      console.log('✅ Created admin user document in Firestore');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Admin user already exists, signing in...');
        adminUser = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      } else {
        throw error;
      }
    }
    
    // Tạo regular user
    const userEmail = 'user@test.com';
    const userPassword = 'user123';
    
    let regularUser;
    try {
      regularUser = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
      console.log('✅ Created regular user:', regularUser.user.uid);
      
      // Tạo user document với role user
      await setDoc(doc(db, 'users', regularUser.user.uid), {
        userId: regularUser.user.uid,
        email: userEmail,
        name: 'Regular Test User',
        role: 'user',
        mstList: ['123456789'],
        createdAt: new Date()
      });
      console.log('✅ Created regular user document in Firestore');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Regular user already exists, signing in...');
        regularUser = await signInWithEmailAndPassword(auth, userEmail, userPassword);
      } else {
        throw error;
      }
    }
    
    return { adminUser, regularUser };
  } catch (error) {
    console.error('❌ Error creating users:', error);
    throw error;
  }
}

async function createTestData() {
  console.log('\n📝 Creating test data...\n');
  
  try {
    // Tạo template
    const templateId = 'test-template-1';
    await setDoc(doc(db, 'templates', templateId), {
      id: templateId,
      name: 'Test Template',
      htmlTemplate: '<html><body><h1>{{taxpayerName}}</h1><p>Amount: {{amount}}</p></body></html>',
      type: 'pdf',
      isActive: true,
      isDefault: true,
      createdAt: new Date()
    });
    console.log('✅ Created template:', templateId);
    
    // Tạo mapping
    const mappingId = 'test-template-1';
    await setDoc(doc(db, 'mappings', mappingId), {
      templateId: mappingId,
      fields: {
        taxpayerName: { visible: true, format: 'text' },
        amount: { visible: true, format: 'currency' }
      },
      updatedAt: new Date()
    });
    console.log('✅ Created mapping:', mappingId);
    
    // Tạo transactions
    const transaction1 = '00109202830';
    await setDoc(doc(db, 'transactions', transaction1), {
      mst: transaction1,
      taxpayerName: 'TỬ XUÂN CHIẾN',
      taxpayerAddress: 'Test Address',
      amount: 1000000,
      paymentDate: new Date(),
      status: 'pending',
      createdAt: new Date()
    });
    console.log('✅ Created transaction:', transaction1);
    
    const transaction2 = '123456789';
    await setDoc(doc(db, 'transactions', transaction2), {
      mst: transaction2,
      taxpayerName: 'Test User 2',
      taxpayerAddress: 'Test Address 2',
      amount: 2000000,
      paymentDate: new Date(),
      status: 'pending',
      createdAt: new Date()
    });
    console.log('✅ Created transaction:', transaction2);
    
    console.log('\n✅ All test data created successfully!\n');
  } catch (error) {
    console.error('❌ Error creating test data:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting Firestore Rules Test Setup\n');
  console.log('Make sure Firebase Emulators are running:');
  console.log('- Firestore: http://localhost:8080');
  console.log('- Auth: http://localhost:9099');
  console.log('- Emulator UI: http://localhost:4000\n');
  
  try {
    // Create test users (admin và user)
    const { adminUser, regularUser } = await createTestUsers();
    
    // Create test data
    await createTestData();
    
    console.log('\n📋 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin User:');
    console.log('  Email: admin@test.com');
    console.log('  Password: admin123');
    console.log('  UID:', adminUser.user.uid);
    console.log('\nRegular User:');
    console.log('  Email: user@test.com');
    console.log('  Password: user123');
    console.log('  UID:', regularUser.user.uid);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('✅ Setup complete! You can now test Firestore Rules:');
    console.log('1. Login with admin@test.com in the app');
    console.log('2. Try to read/write all collections');
    console.log('3. Login with user@test.com');
    console.log('4. Try to access only own data\n');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();

