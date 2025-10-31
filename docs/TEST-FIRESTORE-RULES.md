# 🧪 Hướng Dẫn Test Firestore Rules Local

## ✅ Mục tiêu
Test Security Rules mà **KHÔNG tốn tiền** và **KHÔNG ảnh hưởng production**.

---

## 📋 Bước 1: Setup Environment

### Tạo `.env.local` (nếu chưa có):
```bash
# Copy từ Firebase Console → Project Settings → Your apps → Web app
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=anhbao-373f3.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=anhbao-373f3
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=anhbao-373f3.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# ✅ QUAN TRỌNG: Bật emulator mode
NEXT_PUBLIC_USE_EMULATOR=true
```

---

## 🚀 Bước 2: Start Emulators

### Terminal 1 - Start Firebase Emulators:
```bash
npm run emulators
```

Sẽ chạy:
- **Firestore**: http://localhost:8080
- **Auth**: http://localhost:9099
- **Functions**: http://localhost:5001
- **Emulator UI**: http://localhost:4000

### Terminal 2 - Start Next.js Dev:
```bash
npm run dev
```

---

## 🧪 Bước 3: Test Rules

### Cách 1: Dùng Emulator UI (Dễ nhất)

1. Mở: http://localhost:4000
2. Vào tab **Firestore**
3. Thử tạo documents thủ công:

#### Test Admin Access:
```javascript
// Collection: users
Document ID: test-user-123
Data:
{
  "userId": "test-user-123",
  "role": "admin",
  "name": "Admin User",
  "mstList": ["00109202830"]
}
```

**Expected**: ✅ Create thành công (vì là admin)

#### Test User Cannot Write:
1. Đăng xuất (logout trong app)
2. Thử tạo document trong `users` collection
3. **Expected**: ❌ Permission denied

#### Test User Can Read Own Data:
1. Login với user thường (MST + password)
2. Thử đọc document `/users/{currentUserId}`
3. **Expected**: ✅ Read được

#### Test User Cannot Access Other Users:
1. Login với user A
2. Thử đọc `/users/{userId-của-user-B}`
3. **Expected**: ❌ Permission denied (trừ khi là admin)

---

### Cách 2: Test qua App UI

#### Scenario 1: Admin CRUD Users
1. Login với admin user (`mrkent1999x@gmail.com` / `mk nghiadaica`)
2. Vào `/admin/users`
3. **Test**:
   - [ ] Create user mới → ✅ Thành công
   - [ ] Edit user → ✅ Thành công
   - [ ] Delete user → ✅ Thành công
   - [ ] View users list → ✅ Hiển thị tất cả

#### Scenario 2: User Cannot Access Admin
1. Login với user thường (MST + password)
2. Truy cập `/admin/users` (trực tiếp)
3. **Expected**: ❌ Redirect về login hoặc access denied

#### Scenario 3: User Can Read Own Transactions
1. Login với user có MST = "00109202830"
2. Vào `/tra-cuu-chung-tu`
3. **Expected**: ✅ Hiển thị transactions với MST "00109202830"

#### Scenario 4: User Cannot Read Other MST Transactions
1. Login với user có MST = "00109202830"
2. Thử đọc transaction có MST = "99999999999"
3. **Expected**: ❌ Không hiển thị (hoặc empty list)

---

## ✅ Checklist Test Rules

### Rules cần test:

| Rule | Expected | Test Method |
|------|----------|-------------|
| Admin read `users` | ✅ All users | Emulator UI hoặc `/admin/users` |
| Admin write `users` | ✅ Create/Update/Delete | Admin dashboard CRUD |
| User read own `users` | ✅ Only self | Login → `/thong-tin-tai-khoan` |
| User write `users` | ❌ Denied | Thử edit trong UI |
| Admin read `transactions` | ✅ All | Admin dashboard |
| User read `transactions` | ✅ Only MST in `mstList` | `/tra-cuu-chung-tu` |
| User write `transactions` | ❌ Denied | Thử create transaction |
| Unauthenticated read | ❌ Denied | Logout → thử đọc data |

---

## 🐛 Troubleshooting

### Lỗi: "FirebaseError: false for 'list'"
→ Rules không cho phép list documents. Cần thêm index hoặc fix rules.

### Lỗi: "Missing or insufficient permissions"
→ Rules chặn operation. Check:
- User đã login chưa?
- User có role "admin" không?
- MST có trong `mstList` không?

### Emulator không connect
→ Check:
- `NEXT_PUBLIC_USE_EMULATOR=true` trong `.env.local`
- Emulators đang chạy: http://localhost:4000
- Restart Next.js dev server sau khi set env

---

## 📝 Ghi chú Test Results

**Anh ghi lại**:
- [ ] Rule nào pass?
- [ ] Rule nào fail?
- [ ] Bug gì phát hiện được?

→ Sau đó báo em để fix! 🎯

