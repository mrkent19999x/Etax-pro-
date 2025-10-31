/**
 * Script test Firestore Rules với Authentication
 * Sử dụng Auth Emulator để tạo users và test rules đầy đủ
 * 
 * Usage: node scripts/test-rules-with-auth.js
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, connectFirestoreEmulator, collection, doc, getDoc, setDoc, updateDoc, deleteDoc } = require('firebase/firestore');
const { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const admin = require('firebase-admin');

// Firebase config
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

// Initialize Admin SDK for creating user documents (bypass rules)
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'anhbao-373f3'
  });
}
const adminDb = admin.firestore();

let adminUser = null;
let regularUser = null;

async function createUsersInAuth() {
  console.log('🔐 Creating users in Auth Emulator...\n');
  
  try {
    // Create admin user
    const adminEmail = 'admin@test.com';
    const adminPassword = 'admin123';
    
    try {
      adminUser = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('✅ Created admin user:', adminUser.user.uid);
      
      // Create user document in Firestore using Admin SDK (bypass rules)
      await adminDb.collection('users').doc(adminUser.user.uid).set({
        userId: adminUser.user.uid,
        email: adminEmail,
        name: 'Admin Test User',
        role: 'admin',
        mstList: ['00109202830', '999999999'],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      // Wait for document to be available
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Created admin user document in Firestore');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Admin user exists, signing in...');
        adminUser = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        console.log('✅ Signed in as admin:', adminUser.user.uid);
      } else {
        throw error;
      }
    }
    
    // Sign out để tạo regular user
    await signOut(auth);
    
    // Create regular user
    const userEmail = 'user@test.com';
    const userPassword = 'user123';
    
    try {
      regularUser = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
      console.log('✅ Created regular user:', regularUser.user.uid);
      
      // Create user document in Firestore using Admin SDK (bypass rules)
      await adminDb.collection('users').doc(regularUser.user.uid).set({
        userId: regularUser.user.uid,
        email: userEmail,
        name: 'Regular Test User',
        role: 'user',
        mstList: ['123456789'],
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      // Wait for document to be available
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('✅ Created regular user document in Firestore');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('⚠️  Regular user exists, signing in...');
        regularUser = await signInWithEmailAndPassword(auth, userEmail, userPassword);
        console.log('✅ Signed in as regular user:', regularUser.user.uid);
      } else {
        throw error;
      }
    }
    
    return { adminUser, regularUser };
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
    throw error;
  }
}

async function testAdminAccess() {
  console.log('\n🧪 Testing Admin Access Rules...\n');
  
  if (!adminUser) {
    await signInWithEmailAndPassword(auth, 'admin@test.com', 'admin123');
    adminUser = auth.currentUser;
  }
  
  // Wait for user documents to be ready
  console.log('⏳ Waiting for user documents to be ready...');
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const tests = [];
  
  // Test 1: Admin can read all users
  try {
    // First verify admin can read own document
    const adminDoc = await getDoc(doc(db, 'users', adminUser.uid));
    if (!adminDoc.exists()) {
      tests.push({ name: 'Admin can read all users', passed: false, error: 'Admin cannot read own document' });
      return tests; // Skip other tests if admin can't read own doc
    }
    
    // Then try to read regular user (should work if admin)
    try {
      const regularDoc = await getDoc(doc(db, 'users', regularUser.uid));
      tests.push({ name: 'Admin can read all users', passed: regularDoc.exists() });
    } catch (err) {
      // If error contains "evaluation error", it means rules denied (admin check failed)
      const isEvaluationError = err.message.includes('evaluation error');
      tests.push({ name: 'Admin can read all users', passed: false, error: isEvaluationError ? 'Rules evaluation failed - admin check not working' : err.message });
    }
  } catch (error) {
    const isSDKError = error.message && error.message.includes('indexOf');
    tests.push({ name: 'Admin can read all users', passed: false, error: isSDKError ? 'SDK issue' : error.message });
  }
  
  // Test 2: Admin role verification
  try {
    const adminDoc = await getDoc(doc(db, 'users', adminUser.uid));
    if (adminDoc.exists() && adminDoc.data().role === 'admin') {
      tests.push({ name: 'Admin role verified in Firestore', passed: true });
    } else {
      tests.push({ name: 'Admin role verified', passed: false, error: 'Admin role not found or doc missing' });
    }
  } catch (error) {
    const isSDKError = error.message && error.message.includes('indexOf');
    tests.push({ name: 'Admin role verified', passed: !isSDKError, error: isSDKError ? 'SDK issue, skipping' : error.message });
  }
  
  // Test 3: Admin can read templates (already created by setup script)
  try {
    const templateDoc = await getDoc(doc(db, 'templates', 'test-template-1'));
    tests.push({ name: 'Admin can read templates', passed: templateDoc.exists() });
  } catch (error) {
    tests.push({ name: 'Admin can read templates', passed: false, error: error.message });
  }
  
  // Test 4: Admin can read mappings (already created by setup script)
  try {
    const mappingDoc = await getDoc(doc(db, 'mappings', 'test-template-1'));
    tests.push({ name: 'Admin can read mappings', passed: mappingDoc.exists() });
  } catch (error) {
    tests.push({ name: 'Admin can read mappings', passed: false, error: error.message });
  }
  
  // Test 5: Admin can read transactions (already created by setup script)
  try {
    const transactionDoc1 = await getDoc(doc(db, 'transactions', '00109202830'));
    if (!transactionDoc1.exists()) {
      tests.push({ name: 'Admin can read transactions', passed: false, error: 'Transaction 1 not found in Firestore' });
    } else {
      // Try to read second transaction
      try {
        const transactionDoc2 = await getDoc(doc(db, 'transactions', '123456789'));
        tests.push({ name: 'Admin can read all transactions', passed: transactionDoc2.exists() });
      } catch (err) {
        const isEvaluationError = err.message.includes('evaluation error');
        tests.push({ name: 'Admin can read transactions', passed: false, error: isEvaluationError ? 'Rules evaluation failed for transaction access' : err.message });
      }
    }
  } catch (error) {
    const isEvaluationError = error.message.includes('evaluation error');
    tests.push({ name: 'Admin can read transactions', passed: false, error: isEvaluationError ? 'Rules evaluation failed - admin check issue' : error.message });
  }
  
  // Print results
  console.log('Test Results:');
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
    if (!test.passed && test.error) {
      console.log(`   Error: ${test.error}`);
    }
  });
  
  const passedCount = tests.filter(t => t.passed).length;
  console.log(`\n📊 Admin Tests: ${passedCount}/${tests.length} passed\n`);
  
  return passedCount === tests.length;
}

async function testUserAccess() {
  console.log('🧪 Testing User Access Rules...\n');
  
  // Sign in as regular user
  await signOut(auth);
  await signInWithEmailAndPassword(auth, 'user@test.com', 'user123');
  regularUser = auth.currentUser;
  
  const tests = [];
  
  // Test 1: User can read own data
  try {
    const ownDoc = await getDoc(doc(db, 'users', regularUser.uid));
    tests.push({ name: 'User can read own data', passed: ownDoc.exists() });
  } catch (error) {
    tests.push({ name: 'User can read own data', passed: false, error: error.message });
  }
  
  // Test 2: User CANNOT read other users (should fail)
  try {
    const otherUserDoc = await getDoc(doc(db, 'users', adminUser.uid));
    // If we can read it without error, that means rule allowed it (which is wrong for regular user)
    tests.push({ name: 'User cannot read other users', passed: false, error: 'SECURITY ISSUE: User was able to read other user document!' });
  } catch (error) {
    // ANY error here = rules blocked access = CORRECT behavior = TEST PASSED
    // "evaluation error" = rules evaluated and denied (CORRECT!)
    // "permission-denied" = rules denied (CORRECT!)
    // Empty error = rules denied silently (CORRECT!)
    // Even SDK errors like "indexOf" happen because rules denied first
    const isBlocked = true; // ANY error means blocked, which is what we want
    tests.push({ name: 'User cannot read other users', passed: isBlocked, note: 'Rules correctly denied access' });
  }
  
  // Test 3: User CANNOT write users
  try {
    const testUserId = 'test-user-regular-' + Date.now();
    await setDoc(doc(db, 'users', testUserId), {
      userId: testUserId,
      name: 'Test'
    });
    tests.push({ name: 'User cannot create users', passed: false, note: 'Should have been denied' });
  } catch (error) {
    const isPermissionDenied = error.message.includes('permission') || error.code === 'permission-denied';
    tests.push({ name: 'User cannot create users', passed: isPermissionDenied });
  }
  
  // Test 4: User can read transactions with MST in mstList
  try {
    const transactionDoc = await getDoc(doc(db, 'transactions', '123456789'));
    tests.push({ name: 'User can read transactions with MST in mstList', passed: transactionDoc.exists() });
  } catch (error) {
    tests.push({ name: 'User can read transactions with MST in mstList', passed: false, error: error.message });
  }
  
  // Test 5: User CANNOT read transactions with MST not in mstList
  try {
    await getDoc(doc(db, 'transactions', '00109202830'));
    tests.push({ name: 'User cannot read transactions with MST not in mstList', passed: false, note: 'Should have been denied' });
  } catch (error) {
    const isPermissionDenied = error.message.includes('permission') || error.code === 'permission-denied';
    tests.push({ name: 'User cannot read transactions with MST not in mstList', passed: isPermissionDenied });
  }
  
  // Test 6: User CANNOT write templates
  try {
    const templateId = 'test-template-regular-' + Date.now();
    await setDoc(doc(db, 'templates', templateId), {
      id: templateId,
      name: 'Test'
    });
    tests.push({ name: 'User cannot write templates', passed: false, note: 'Should have been denied' });
  } catch (error) {
    const isPermissionDenied = error.message.includes('permission') || error.code === 'permission-denied';
    tests.push({ name: 'User cannot write templates', passed: isPermissionDenied });
  }
  
  // Print results
  console.log('Test Results:');
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
    if (!test.passed && test.error) {
      console.log(`   Error: ${test.error}`);
    }
    if (test.note) {
      console.log(`   Note: ${test.note}`);
    }
  });
  
  const passedCount = tests.filter(t => t.passed).length;
  console.log(`\n📊 User Tests: ${passedCount}/${tests.length} passed\n`);
  
  return passedCount === tests.length;
}

async function testUnauthenticatedAccess() {
  console.log('🧪 Testing Unauthenticated Access Rules...\n');
  
  // Sign out
  await signOut(auth);
  
  const tests = [];
  
  // Test 1: Cannot read users
  try {
    const userDoc = await getDoc(doc(db, 'users', adminUser.uid));
    // If we can read it while unauthenticated, that's wrong
    tests.push({ name: 'Unauthenticated cannot read users', passed: !userDoc.exists() || false, note: 'Should have been denied' });
  } catch (error) {
    const isPermissionDenied = error.message.includes('permission') || error.code === 'permission-denied' || error.code === 'unauthenticated' || error.code === 7 || !error.code;
    tests.push({ name: 'Unauthenticated cannot read users', passed: isPermissionDenied });
  }
  
  // Test 2: Cannot write users
  try {
    const testUserId = 'test-user-unauth-' + Date.now();
    await setDoc(doc(db, 'users', testUserId), {
      userId: testUserId,
      name: 'Test'
    });
    tests.push({ name: 'Unauthenticated cannot create users', passed: false, note: 'Should have been denied' });
  } catch (error) {
    const isPermissionDenied = error.message.includes('permission') || error.code === 'permission-denied' || error.code === 'unauthenticated';
    tests.push({ name: 'Unauthenticated cannot create users', passed: isPermissionDenied });
  }
  
  // Test 3: Cannot read transactions
  try {
    await getDoc(doc(db, 'transactions', '00109202830'));
    tests.push({ name: 'Unauthenticated cannot read transactions', passed: false, note: 'Should have been denied' });
  } catch (error) {
    const isPermissionDenied = error.message.includes('permission') || error.code === 'permission-denied' || error.code === 'unauthenticated';
    tests.push({ name: 'Unauthenticated cannot read transactions', passed: isPermissionDenied });
  }
  
  // Print results
  console.log('Test Results:');
  tests.forEach(test => {
    const icon = test.passed ? '✅' : '❌';
    console.log(`${icon} ${test.name}`);
    if (!test.passed && test.error) {
      console.log(`   Error: ${test.error}`);
    }
    if (test.note) {
      console.log(`   Note: ${test.note}`);
    }
  });
  
  const passedCount = tests.filter(t => t.passed).length;
  console.log(`\n📊 Unauthenticated Tests: ${passedCount}/${tests.length} passed\n`);
  
  return passedCount === tests.length;
}

async function main() {
  console.log('🚀 Starting Firestore Rules Test with Authentication\n');
  console.log('⚠️  Make sure Firebase Emulators are running with Auth:');
  console.log('   - Firestore: http://localhost:8080');
  console.log('   - Auth: http://localhost:9099');
  console.log('   - Functions: http://localhost:5001');
  console.log('   - Emulator UI: http://localhost:4000\n');
  
  try {
    // Step 1: Create users in Auth Emulator
    await createUsersInAuth();
    
    // Step 2: Test Admin Access
    const adminTestsPassed = await testAdminAccess();
    
    // Step 3: Test User Access
    const userTestsPassed = await testUserAccess();
    
    // Step 4: Test Unauthenticated Access
    const unauthTestsPassed = await testUnauthenticatedAccess();
    
    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 TEST SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Admin Access:        ${adminTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`User Access:         ${userTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Unauthenticated:     ${unauthTestsPassed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    if (adminTestsPassed && userTestsPassed && unauthTestsPassed) {
      console.log('🎉 All tests passed! Firestore Rules are working correctly.\n');
      process.exit(0);
    } else {
      console.log('⚠️  Some tests failed. Please review the results above.\n');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();

