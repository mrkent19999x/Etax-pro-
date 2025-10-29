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

// ===================================
// TEMPLATE MANAGEMENT APIs
// ===================================

// Create Template
exports.createTemplate = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const claims = await verifyAdminToken(req);
    const { name, htmlTemplate, type = 'pdf', isActive = true, isDefault = false } = req.body;

    if (!name || !htmlTemplate) {
      return res.status(400).send('Name và htmlTemplate là bắt buộc');
    }

    const templateId = `template_${Date.now()}`;
    await admin.firestore().collection('templates').doc(templateId).set({
      id: templateId,
      name,
      htmlTemplate,
      type,
      isActive,
      isDefault,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: claims.uid
    });

    res.status(201).json({
      message: 'Template created successfully',
      templateId
    });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).send(error.message || 'Không thể tạo template');
  }
});

// Get Templates
exports.getTemplates = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);

    const snapshot = await admin.firestore().collection('templates').get();
    const templates = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      templates.push({
        id: doc.id,
        name: data.name || '',
        htmlTemplate: data.htmlTemplate || '',
        type: data.type || 'pdf',
        isActive: data.isActive !== undefined ? data.isActive : true,
        isDefault: data.isDefault !== undefined ? data.isDefault : false,
        createdAt: data.createdAt
      });
    });

    res.json({ templates });
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).send(error.message || 'Không thể lấy danh sách templates');
  }
});

// Update Template
exports.updateTemplate = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);
    const { templateId, name, htmlTemplate, isActive, isDefault } = req.body;

    if (!templateId) {
      return res.status(400).send('templateId là bắt buộc');
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (name !== undefined) updateData.name = name;
    if (htmlTemplate !== undefined) updateData.htmlTemplate = htmlTemplate;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isDefault !== undefined) updateData.isDefault = isDefault;

    await admin.firestore().collection('templates').doc(templateId).update(updateData);

    res.json({ message: 'Template updated successfully' });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).send(error.message || 'Không thể cập nhật template');
  }
});

// Delete Template
exports.deleteTemplate = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);
    const { templateId } = req.query;

    if (!templateId) {
      return res.status(400).send('templateId là bắt buộc');
    }

    await admin.firestore().collection('templates').doc(templateId).delete();

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).send(error.message || 'Không thể xóa template');
  }
});

// ===================================
// MAPPING MANAGEMENT APIs
// ===================================

// Get Mapping
exports.getMapping = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);
    const { templateId } = req.query;

    if (!templateId) {
      return res.status(400).send('templateId là bắt buộc');
    }

    const mappingDoc = await admin.firestore().collection('mappings').doc(templateId).get();
    
    if (!mappingDoc.exists) {
      // Trả về mapping rỗng nếu chưa có
      return res.json({
        templateId,
        fields: {}
      });
    }

    const data = mappingDoc.data();
    res.json({
      templateId: data.templateId || templateId,
      fields: data.fields || {}
    });
  } catch (error) {
    console.error('Error getting mapping:', error);
    res.status(500).send(error.message || 'Không thể lấy mapping');
  }
});

// Update Mapping
exports.updateMapping = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const claims = await verifyAdminToken(req);
    const { templateId, fields } = req.body;

    if (!templateId || !fields) {
      return res.status(400).send('templateId và fields là bắt buộc');
    }

    await admin.firestore().collection('mappings').doc(templateId).set({
      templateId,
      fields,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: claims.uid
    }, { merge: true });

    res.json({ message: 'Mapping updated successfully' });
  } catch (error) {
    console.error('Error updating mapping:', error);
    res.status(500).send(error.message || 'Không thể cập nhật mapping');
  }
});

// Export Mapping
exports.exportMapping = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);
    const { templateId } = req.query;

    if (!templateId) {
      return res.status(400).send('templateId là bắt buộc');
    }

    const mappingDoc = await admin.firestore().collection('mappings').doc(templateId).get();
    
    if (!mappingDoc.exists) {
      return res.status(404).send('Mapping không tồn tại');
    }

    const data = mappingDoc.data();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="mapping_${templateId}.json"`);
    res.send(JSON.stringify({
      templateId: data.templateId || templateId,
      fields: data.fields || {}
    }, null, 2));
  } catch (error) {
    console.error('Error exporting mapping:', error);
    res.status(500).send(error.message || 'Không thể export mapping');
  }
});

// Import Mapping
exports.importMapping = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const claims = await verifyAdminToken(req);
    const { templateId, mappingData } = req.body;

    if (!templateId || !mappingData || !mappingData.fields) {
      return res.status(400).send('templateId và mappingData.fields là bắt buộc');
    }

    await admin.firestore().collection('mappings').doc(templateId).set({
      templateId,
      fields: mappingData.fields,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedBy: claims.uid
    });

    res.json({ message: 'Mapping imported successfully' });
  } catch (error) {
    console.error('Error importing mapping:', error);
    res.status(500).send(error.message || 'Không thể import mapping');
  }
});

module.exports = {
  verifyAdminToken,
  admin
};

