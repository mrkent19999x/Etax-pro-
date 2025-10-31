#!/usr/bin/env node
const https = require('https');

const projectId = 'anhbao-373f3';
const accessToken = process.env.FIREBASE_TOKEN || '';

const users = [
  {
    uid: 'Dan1VqVNw7MmjxyjSO4ZZpXEob03',
    data: {
      userId: 'Dan1VqVNw7MmjxyjSO4ZZpXEob03',
      email: 'mrkent1999x@gmail.com',
      name: 'Test User',
      role: 'user',
      mstList: ['00109202830']
    }
  },
  {
    uid: 'MXYmycuNudMoaD2f6H0JmUvxVqG2',
    data: {
      userId: 'MXYmycuNudMoaD2f6H0JmUvxVqG2',
      email: 'begau1302@gmail.com',
      name: 'Admin User',
      role: 'admin',
      mstList: ['999999999']
    }
  }
];

async function createDocument(uid, data) {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify({ fields: convertToFirestoreFormat(data) });
    const options = {
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${projectId}/databases/(default)/documents/users/${uid}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(jsonData);
    req.end();
  });
}

function convertToFirestoreFormat(data) {
  const fields = {};
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      fields[key] = { arrayValue: { values: value.map(v => ({ stringValue: v })) } };
    } else {
      fields[key] = { stringValue: String(value) };
    }
  }
  return fields;
}

async function main() {
  console.log('🚀 Tạo user documents...\n');
  if (!accessToken) {
    console.log('⚠️  Cần FIREBASE_TOKEN. Lấy từ: firebase login:ci');
    process.exit(1);
  }

  for (const user of users) {
    try {
      await createDocument(user.uid, user.data);
      console.log(`✅ Đã tạo: ${user.data.email}`);
    } catch (error) {
      console.error(`❌ Lỗi ${user.data.email}:`, error.message);
    }
  }
}

main();
