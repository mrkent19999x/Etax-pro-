# 🔐 Test Accounts - Production

## ✅ Tài khoản test đã setup

### User Account
- **Email**: `mrkent1999x@gmail.com`
- **Password**: `nghiadaica`
- **MST**: `00109202830`
- **Role**: `user`
- **Status**: ✅ Đã tồn tại trong Firebase Auth

### Admin Account
- **Email**: `admin@test.com`
- **Password**: `admin123`
- **MST**: `999999999`
- **Role**: `admin`
- **Status**: ⚠️ Cần tạo trong Firebase Console

---

## 📝 Cách tạo user trong Firebase Console

### Tạo user trong Authentication:
1. Vào Firebase Console: https://console.firebase.google.com/project/anhbao-373f3/authentication/users
2. Click **"Add User"**
3. Nhập:
   - Email: `admin@test.com`
   - Password: `admin123`
4. Click **"Add User"**

### Tạo user document trong Firestore:
1. Vào Firestore: https://console.firebase.google.com/project/anhbao-373f3/firestore
2. Collection: `users`
3. Document ID: `{uid}` (lấy từ Auth user)
4. Data:
```json
{
  "userId": "{uid}",
  "email": "admin@test.com",
  "name": "Admin Test",
  "role": "admin",
  "mstList": ["999999999"],
  "createdAt": "2025-10-31T00:00:00Z"
}
```

---

## 🧪 Test Login

### Cách 1: Login bằng Email
- Nhập: `mrkent1999x@gmail.com`
- Password: `nghiadaica`
- ✅ Sẽ login thành công

### Cách 2: Login bằng MST
- Nhập: `00109202830`
- Password: `nghiadaica`
- ✅ Script sẽ tìm email từ Firestore và login

---

## ⚠️ Lưu ý

1. **User document trong Firestore**: 
   - User `mrkent1999x@gmail.com` CẦN có document trong `users/{uid}` với `mstList` chứa MST
   - Nếu chưa có → login sẽ fail với "Tài khoản chưa được liên kết với email"

2. **Admin account**:
   - Cần tạo thủ công trong Firebase Console
   - Hoặc dùng Firebase Admin SDK (cần service account key)

---

## 🔧 Quick Fix: Tạo user document cho mrkent1999x@gmail.com

Nếu user đã có trong Auth nhưng chưa có document trong Firestore:

1. Lấy UID từ Auth Console
2. Tạo document `users/{uid}` với data:
```json
{
  "userId": "{uid}",
  "email": "mrkent1999x@gmail.com",
  "name": "Test User",
  "role": "user",
  "mstList": ["00109202830"]
}
```

