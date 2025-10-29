const functions = require('firebase-functions');
const admin = require('firebase-admin');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Helper functions for formatting
function formatDateTime(date, format = 'dd/MM/yyyy HH:mm:ss') {
  if (!date) return '';
  const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('dd', day)
    .replace('MM', month)
    .replace('yyyy', year)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

function formatCurrency(amount) {
  if (!amount) return '0';
  return new Intl.NumberFormat('vi-VN').format(amount);
}

// Register Handlebars helpers
handlebars.registerHelper('formatDate', formatDateTime);
handlebars.registerHelper('formatCurrency', formatCurrency);

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

// ===================================
// PDF GENERATION API
// ===================================

// Generate PDF
exports.generatePdf = functions.https.onRequest(async (req, res) => {
  const { mst, templateId } = req.query;

  if (!mst) {
    return res.status(400).send('Thiếu tham số MST!');
  }

  let browser;
  try {
    // Check permission if token provided
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const idToken = req.headers.authorization.split('Bearer ')[1];
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      
      // Get user data to check role and mstList
      const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        // Admin có thể xem tất cả, user chỉ xem MST của mình
        if (userData.role !== 'admin' && !userData.mstList?.includes(mst) && userData.mst !== mst) {
          return res.status(403).send('Bạn không có quyền truy cập MST này');
        }
      }
    }

    // Lấy dữ liệu transaction từ Firestore
    const transactionDoc = await admin.firestore().collection('transactions').doc(mst).get();
    if (!transactionDoc.exists) {
      return res.status(404).send('Không tìm thấy dữ liệu cho MST này');
    }

    let transactionData = transactionDoc.data();

    // Xác định template để dùng
    let finalTemplateId = templateId;
    if (!finalTemplateId || finalTemplateId === 'default') {
      // Lấy default template
      const defaultTemplate = await admin.firestore()
        .collection('templates')
        .where('isDefault', '==', true)
        .where('isActive', '==', true)
        .limit(1)
        .get();
      
      if (!defaultTemplate.empty) {
        finalTemplateId = defaultTemplate.docs[0].id;
      } else {
        // Fallback: lấy template đầu tiên active
        const activeTemplate = await admin.firestore()
          .collection('templates')
          .where('isActive', '==', true)
          .limit(1)
          .get();
        
        if (!activeTemplate.empty) {
          finalTemplateId = activeTemplate.docs[0].id;
        } else {
          return res.status(404).send('Không tìm thấy template để sử dụng');
        }
      }
    }

    // Lấy template
    const templateDoc = await admin.firestore().collection('templates').doc(finalTemplateId).get();
    if (!templateDoc.exists) {
      return res.status(404).send('Template không tồn tại');
    }

    const templateData = templateDoc.data();
    let htmlTemplate = templateData.htmlTemplate;

    // Lấy mapping nếu có
    const mappingDoc = await admin.firestore().collection('mappings').doc(finalTemplateId).get();
    let finalData = { ...transactionData };

    if (mappingDoc.exists) {
      const mapping = mappingDoc.data().fields || {};
      const mappedData = {};

      // Apply mapping: chỉ lấy fields visible, format theo config
      for (const [key, config] of Object.entries(mapping)) {
        if (config.visible && transactionData[key] !== undefined) {
          let value = transactionData[key];

          // Format theo config
          if (config.format === 'currency') {
            value = formatCurrency(value);
          } else if (config.format === 'datetime') {
            value = formatDateTime(value);
          }

          mappedData[key] = value;
        }
      }

      // Merge với dữ liệu gốc (để đảm bảo có đủ fields cho template)
      finalData = { ...transactionData, ...mappedData };
    }

    // Format các trường thường dùng
    if (finalData.paymentDate) {
      finalData.paymentDateFormatted = formatDateTime(finalData.paymentDate);
    }
    if (finalData.amount !== undefined) {
      finalData.amountFormatted = formatCurrency(finalData.amount);
    }

    // Compile Handlebars template
    const template = handlebars.compile(htmlTemplate);
    const html = template(finalData);

    // Launch Puppeteer with optimized config
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions'
      ],
      timeout: 60000 // Increase timeout for slow connections
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    await browser.close();

    // Return PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Giay_nop_tien_MST_${mst}.pdf"`);
    res.send(pdfBuffer);

  } catch (error) {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    console.error('Error generating PDF:', {
      mst,
      templateId: finalTemplateId,
      error: error.message,
      stack: error.stack
    });
    res.status(500).send(error.message || 'Không thể tạo PDF. Vui lòng thử lại sau.');
  }
});

// ===================================
// AUTO-TRIGGERS
// ===================================

// Auto-generate PDF when transaction is created
exports.onTransactionCreate = functions.firestore
  .document('transactions/{mst}')
  .onCreate(async (snap, context) => {
    const transactionData = snap.data();
    const mst = context.params.mst;

    try {
      // Lấy default template
      const defaultTemplate = await admin.firestore()
        .collection('templates')
        .where('isDefault', '==', true)
        .where('isActive', '==', true)
        .limit(1)
        .get();

      if (defaultTemplate.empty) {
        console.log(`No default template found for MST ${mst}, skipping PDF generation`);
        return;
      }

      const templateId = defaultTemplate.docs[0].id;
      
      // Generate PDF sẽ được gọi khi user request, trigger này chỉ log
      // Hoặc có thể lưu PDF vào Storage ở đây nếu cần
      console.log(`Transaction created for MST ${mst}, ready for PDF generation with template ${templateId}`);
      
    } catch (error) {
      console.error(`Error in onTransactionCreate for MST ${mst}:`, error);
    }
  });

// Re-generate PDFs when mapping is updated
exports.onMappingUpdate = functions.firestore
  .document('mappings/{templateId}')
  .onWrite(async (change, context) => {
    const templateId = context.params.templateId;

    try {
      // Tìm tất cả transactions đang dùng template này
      const transactionsSnapshot = await admin.firestore()
        .collection('transactions')
        .where('templateId', '==', templateId)
        .get();

      if (transactionsSnapshot.empty) {
        console.log(`No transactions using template ${templateId}`);
        return;
      }

      console.log(`Mapping updated for template ${templateId}, ${transactionsSnapshot.size} transactions affected`);
      
      // PDFs sẽ được re-generate khi user request
      // Có thể trigger re-generation tự động nếu cần (nhưng tốn tài nguyên)
      
    } catch (error) {
      console.error(`Error in onMappingUpdate for template ${templateId}:`, error);
    }
  });

// ===================================
// TRANSACTION MANAGEMENT APIs
// ===================================

// Create Transaction
exports.createTransaction = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  try {
    const claims = await verifyAdminToken(req);
    const { mst, taxpayerName, taxpayerAddress, amount, paymentDate, status = 'pending', templateId } = req.body;

    if (!mst || !taxpayerName || amount === undefined) {
      return res.status(400).send('MST, taxpayerName và amount là bắt buộc');
    }

    // Lưu transaction với MST làm document ID
    await admin.firestore().collection('transactions').doc(mst).set({
      mst,
      taxpayerName,
      taxpayerAddress: taxpayerAddress || '',
      amount: parseFloat(amount),
      paymentDate: paymentDate ? admin.firestore.Timestamp.fromDate(new Date(paymentDate)) : admin.firestore.FieldValue.serverTimestamp(),
      status,
      templateId: templateId || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: claims.uid
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transactionId: mst
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).send(error.message || 'Không thể tạo transaction');
  }
});

// Get Transactions
exports.getTransactions = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);

    let query = admin.firestore().collection('transactions');

    // Apply filters
    if (req.query.mst) {
      query = query.where('mst', '==', req.query.mst);
    }
    if (req.query.status) {
      query = query.where('status', '==', req.query.status);
    }

    const snapshot = await query.get();
    const transactions = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        mst: data.mst || doc.id,
        taxpayerName: data.taxpayerName || '',
        taxpayerAddress: data.taxpayerAddress || '',
        amount: data.amount || 0,
        paymentDate: data.paymentDate,
        status: data.status || 'pending',
        templateId: data.templateId || '',
        createdAt: data.createdAt
      });
    });

    // Sort by createdAt desc
    transactions.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return b.createdAt.toMillis() - a.createdAt.toMillis();
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).send(error.message || 'Không thể lấy danh sách transactions');
  }
});

// Update Transaction
exports.updateTransaction = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);
    const { transactionId, taxpayerName, taxpayerAddress, amount, paymentDate, status, templateId } = req.body;

    if (!transactionId) {
      return res.status(400).send('transactionId là bắt buộc');
    }

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (taxpayerName !== undefined) updateData.taxpayerName = taxpayerName;
    if (taxpayerAddress !== undefined) updateData.taxpayerAddress = taxpayerAddress;
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (paymentDate !== undefined) updateData.paymentDate = admin.firestore.Timestamp.fromDate(new Date(paymentDate));
    if (status !== undefined) updateData.status = status;
    if (templateId !== undefined) updateData.templateId = templateId;

    await admin.firestore().collection('transactions').doc(transactionId).update(updateData);

    res.json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).send(error.message || 'Không thể cập nhật transaction');
  }
});

// Delete Transaction
exports.deleteTransaction = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'DELETE') {
    return res.status(405).send('Method not allowed');
  }

  try {
    await verifyAdminToken(req);
    const { transactionId } = req.query;

    if (!transactionId) {
      return res.status(400).send('transactionId là bắt buộc');
    }

    await admin.firestore().collection('transactions').doc(transactionId).delete();

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).send(error.message || 'Không thể xóa transaction');
  }
});

module.exports = {
  verifyAdminToken,
  admin
};

