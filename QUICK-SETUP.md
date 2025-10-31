# ⚡ QUICK SETUP - Tạo User Documents

## Cách nhanh nhất (1 phút):

### Option 1: Dùng Firebase Console (Khuyến nghị)

1. Mở: https://console.firebase.google.com/project/anhbao-373f3/firestore/data
2. Collection: **`users`**
3. Click **"+ Thêm một tài liệu"**

#### User 1:
- **Document ID**: `Dan1VqVNw7MmjxyjSO4ZZpXEob03`
- **Fields**:
  - `userId` (string): `Dan1VqVNw7MmjxyjSO4ZZpXEob03`
  - `email` (string): `mrkent1999x@gmail.com`
  - `name` (string): `Test User`
  - `role` (string): `user`
  - `mstList` (array): `00109202830`

#### User 2 (Admin):
- **Document ID**: `MXYmycuNudMoaD2f6H0JmUvxVqG2`
- **Fields**:
  - `userId` (string): `MXYmycuNudMoaD2f6H0JmUvxVqG2`
  - `email` (string): `begau1302@gmail.com`
  - `name` (string): `Admin User`
  - `role` (string): `admin`
  - `mstList` (array): `999999999`

4. Click **"Lưu"**

---

### Option 2: Dùng script (Cần service account)

Nếu có service account key:
```bash
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
node scripts/auto-setup-users.js
```

---

## ✅ Sau khi setup, test login:

**User Account:**
- Email: `mrkent1999x@gmail.com`
- Password: `nghiadaica`
- MST: `00109202830`

**Admin Account:**
- Email: `begau1302@gmail.com`
- Password: [password của anh]
- MST: `999999999`
- Role: `admin` → sẽ redirect đến `/admin`

