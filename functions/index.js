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

module.exports = {
  verifyAdminToken,
  admin
};

