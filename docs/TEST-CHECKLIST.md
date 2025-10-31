# ✅ Checklist Test Firestore Rules & Functions Local

## 🎯 Mục tiêu
Đảm bảo code hoạt động đúng trước khi deploy production.

---

## 📋 Pre-Test Setup

### 1. Start Firebase Emulators
```bash
# Terminal 1
npm run emulators
```

Sẽ chạy:
- Firestore Emulator: http://localhost:8080
- Functions Emulator: http://localhost:5001
- Emulator UI: http://localhost:4000

### 2. Start Next.js Dev Server
```bash
# Terminal 2
npm run dev
```

### 3. Cấu hình `.env.local`
```env
NEXT_PUBLIC_FUNCTIONS_URL=http://localhost:5001/anhbao-373f3/us-central1
NEXT_PUBLIC_FIREBASE_PROJECT_ID=anhbao-373f3
# ... other Firebase config
```

---

## 🧪 Test Firestore Rules

### Test 1: Admin Access
- [ ] Admin có thể đọc tất cả `users`
- [ ] Admin có thể tạo/sửa/xóa `users`
- [ ] Admin có thể đọc/ghi `templates`
- [ ] Admin có thể đọc/ghi `mappings`
- [ ] Admin có thể đọc/ghi `transactions`

### Test 2: User Access
- [ ] User thường KHÔNG thể đọc `users` (trừ chính mình)
- [ ] User chỉ đọc được `transactions` với MST trong `mstList`
- [ ] User KHÔNG thể sửa `templates`, `mappings`

### Test 3: Unauthenticated Access
- [ ] Không login → KHÔNG thể đọc/ghi bất kỳ collection nào

**Cách test**: Vào http://localhost:4000 → Firestore → thử thêm/sửa/xóa documents

---

## 🧪 Test Functions Local

### Test 1: PDF Generation
- [ ] Function `generatePdf` chạy được
- [ ] Có thể preview PDF trong iframe
- [ ] Có thể download PDF

**Cách test**: 
1. Tạo transaction trong admin
2. Vào `/tra-cuu-chung-tu`
3. Click "In chứng từ"
4. Verify PDF hiển thị đúng

### Test 2: CRUD Operations
- [ ] `createUser` hoạt động
- [ ] `getUsers` trả về đúng data
- [ ] `updateUser` cập nhật đúng
- [ ] `deleteUser` xóa thành công

**Cách test**: Vào `/admin/users` → test CRUD

---

## ✅ Verify Code Hoạt động Đúng

### Frontend Flow
- [ ] Login → redirect đúng (admin → `/admin`, user → `/`)
- [ ] Navigation giữa các pages mượt
- [ ] Forms submit đúng
- [ ] Data hiển thị đúng từ Firestore

### Admin Flow
- [ ] Admin dashboard load được
- [ ] CRUD users hoạt động
- [ ] Template editor lưu được
- [ ] Field mapping hoạt động

### PWA Features
- [ ] Service Worker registered
- [ ] Offline mode hoạt động
- [ ] Manifest valid

---

## 🐛 Troubleshooting

### Emulator không start
```bash
# Check ports
lsof -i :4000 -i :5001 -i :8080

# Kill process nếu cần
kill <PID>
```

### Functions không chạy
```bash
cd functions
npm install
```

### Firestore rules không apply
- Restart emulators
- Check syntax trong `firestore.rules`

---

## 📝 Ghi Chú Khi Test

**Anh ghi lại**:
- [ ] Rules nào pass? Rules nào fail?
- [ ] Functions nào hoạt động? Functions nào lỗi?
- [ ] Bug nào phát hiện được?

→ Sau đó báo em để fix!

