# ⚡ HƯỚNG DẪN TỰ ĐỘNG SETUP USERS

## Cách 1: Dùng Service Account Key (Tự động 100%)

### Bước 1: Lấy Service Account Key
1. Vào: https://console.firebase.google.com/project/anhbao-373f3/settings/serviceaccounts/adminsdk
2. Click **"Generate New Private Key"**
3. Save file (ví dụ: `service-account-key.json`)

### Bước 2: Chạy script
```bash
cd /home/mrkent/etax-project
GOOGLE_APPLICATION_CREDENTIALS="service-account-key.json" node scripts/setup-users-with-key.js
```

✅ **XONG!** Users đã được tạo tự động.

---

## Cách 2: Dùng Firebase Console (Nhanh - 2 phút)

1. Vào: https://console.firebase.google.com/project/anhbao-373f3/firestore/data
2. Collection: **`users`**
3. Click **"+ Thêm một tài liệu"**

### User 1 (Dan1VqVNw7MmjxyjSO4ZZpXEob03):
- **Document ID**: `Dan1VqVNw7MmjxyjSO4ZZpXEob03`
- Thêm fields:
  - `userId`: `Dan1VqVNw7MmjxyjSO4ZZpXEob03` (string)
  - `email`: `mrkent1999x@gmail.com` (string)
  - `name`: `Test User` (string)
  - `role`: `user` (string)
  - `mstList`: Click "Add field" → Array → Thêm `00109202830`

### User 2 (MXYmycuNudMoaD2f6H0JmUvxVqG2):
- **Document ID**: `MXYmycuNudMoaD2f6H0JmUvxVqG2`
- Thêm fields:
  - `userId`: `MXYmycuNudMoaD2f6H0JmUvxVqG2` (string)
  - `email`: `begau1302@gmail.com` (string)
  - `name`: `Admin User` (string)
  - `role`: `admin` (string)
  - `mstList`: Array → Thêm `999999999`

---

## ✅ Sau khi setup, test login:

**URL**: https://anhbao-373f3.web.app/login

**User Account:**
- Email: `mrkent1999x@gmail.com` hoặc MST: `00109202830`
- Password: `nghiadaica`

**Admin Account:**
- Email: `begau1302@gmail.com`
- Password: [password của anh]
- → Sẽ redirect đến `/admin`

