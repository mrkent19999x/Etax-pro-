const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Helper function to verify admin token
async function verifyAdminToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Unauthorized: No token provided');
  }

  const idToken = authHeader.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  
  // Get user data from Firestore to check role
  const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
  if (!userDoc.exists) {
    throw new Error('Unauthorized: User not found');
  }

  const userData = userDoc.data();
  if (userData.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  return decodedToken;
}

// Empty function for testing
exports.test = functions.https.onRequest((req, res) => {
  res.json({ message: 'Functions are working!', timestamp: new Date().toISOString() });
});

// ===================================
// USER MANAGEMENT APIs
// ===================================

// Create User
exports.createUser = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const claims = await verifyAdminToken(req);
    const { email, password, name, role = 'user', mstList = [] } = req.body;

    if (!email || !password || !name) {
      return res.status(400).send('Email, password và name là bắt buộc');
    }

    // Tạo user trong Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Lưu thông tin user vào Firestore
    await admin.firestore().collection('users').doc(userRecord.uid).set({
      userId: userRecord.uid,
      email,
      name,
      role,
      mstList: Array.isArray(mstList) ? mstList : [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(201).json({
      message: 'User created successfully',
      userId: userRecord.uid
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send(error.message || 'Không thể tạo user');
  }
});

// Get Users
exports.getUsers = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);

    const snapshot = await admin.firestore().collection('users').get();
    const users = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      users.push({
        id: doc.id,
        name: data.name || '',
        email: data.email || '',
        role: data.role || 'user',
        mstList: data.mstList || [],
        mst: data.mst || '',
        createdAt: data.createdAt
      });
    });

    res.json({ users });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).send(error.message || 'Không thể lấy danh sách users');
  }
});

// Update User
exports.updateUser = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);
    const { userId, name, role, mstList } = req.body;

    if (!userId) {
      return res.status(400).send('userId là bắt buộc');
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (mstList !== undefined) updateData.mstList = Array.isArray(mstList) ? mstList : [];

    await admin.firestore().collection('users').doc(userId).update(updateData);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send(error.message || 'Không thể cập nhật user');
  }
});

// Delete User
exports.deleteUser = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).send('userId là bắt buộc');
    }

    // Xóa user khỏi Firebase Auth
    await admin.auth().deleteUser(userId);

    // Xóa user khỏi Firestore
    await admin.firestore().collection('users').doc(userId).delete();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send(error.message || 'Không thể xóa user');
  }
});

module.exports = {
  verifyAdminToken,
  admin
};

