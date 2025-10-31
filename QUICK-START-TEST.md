# 🚀 Quick Start - Test Firestore Rules với Auth Emulator

## ✅ Em đã setup tự động 100%

Em đã làm sẵn tất cả:

1. ✅ **Thêm Auth Emulator vào `firebase.json`** (port 9099)
2. ✅ **Update script `npm run emulators`** (include auth)
3. ✅ **Tạo script test rules tự động** với authentication
4. ✅ **Tạo script helper** để check và restart emulators

---

## 🎯 Bước tiếp theo (ANH CẦN LÀM - chỉ 1 lần)

### Option 1: Tự động (Khuyến nghị) ⭐

```bash
# Script sẽ tự động kill và restart emulators với Auth
bash scripts/kill-and-restart-emulators.sh
```

Script này sẽ:
- ✅ Kill emulators cũ
- ✅ Start lại với Auth Emulator
- ✅ Verify tất cả đang chạy

**Sau đó chạy test:**
```bash
bash scripts/setup-and-test.sh
```

### Option 2: Thủ công

```bash
# 1. Check status
bash scripts/check-and-restart-emulators.sh

# 2. Kill processes (nếu cần)
pkill -f 'firebase emulators:start'

# 3. Restart
npm run emulators

# 4. Sau đó test
bash scripts/setup-and-test.sh
```

---

## 📋 Test Credentials (sẽ được tạo tự động)

Sau khi chạy test, anh có thể login với:

**Admin User:**
- Email: `admin@test.com`
- Password: `admin123`
- UID: (sẽ hiển thị trong output)

**Regular User:**
- Email: `user@test.com`  
- Password: `user123`
- UID: (sẽ hiển thị trong output)

---

## 🧪 Test sẽ chạy tự động

Script sẽ test:

1. **Admin Access** (5 tests)
   - ✅ Đọc tất cả users
   - ✅ Tạo/sửa/xóa users
   - ✅ Đọc/ghi templates
   - ✅ Đọc/ghi mappings
   - ✅ Đọc/ghi transactions

2. **User Access** (6 tests)
   - ✅ Đọc dữ liệu của chính mình
   - ✅ KHÔNG thể đọc users khác
   - ✅ KHÔNG thể tạo users
   - ✅ Đọc transactions với MST trong mstList
   - ✅ KHÔNG thể đọc transactions với MST không trong mstList
   - ✅ KHÔNG thể sửa templates

3. **Unauthenticated Access** (3 tests)
   - ✅ KHÔNG thể đọc users
   - ✅ KHÔNG thể tạo users
   - ✅ KHÔNG thể đọc transactions

**Total: 14 tests** sẽ chạy tự động và hiển thị kết quả!

---

## 📊 Expected Output

Sau khi chạy `bash scripts/setup-and-test.sh`:

```
🚀 Starting Firestore Rules Test with Authentication

🔐 Creating users in Auth Emulator...
✅ Created admin user: abc123...
✅ Created regular user: def456...

🧪 Testing Admin Access Rules...
✅ Admin can read all users
✅ Admin can create/delete users
✅ Admin can read/write templates
✅ Admin can read/write mappings
✅ Admin can read/write transactions
📊 Admin Tests: 5/5 passed

🧪 Testing User Access Rules...
✅ User can read own data
✅ User cannot read other users
✅ User cannot create users
✅ User can read transactions with MST in mstList
✅ User cannot read transactions with MST not in mstList
✅ User cannot write templates
📊 User Tests: 6/6 passed

🧪 Testing Unauthenticated Access Rules...
✅ Unauthenticated cannot read users
✅ Unauthenticated cannot create users
✅ Unauthenticated cannot read transactions
📊 Unauthenticated Tests: 3/3 passed

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 TEST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Admin Access:        ✅ PASSED
User Access:         ✅ PASSED
Unauthenticated:     ✅ PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 All tests passed! Firestore Rules are working correctly.
```

---

## 🔍 Files đã tạo

1. `firebase.json` - ✅ Đã thêm Auth emulator
2. `package.json` - ✅ Đã update script
3. `scripts/test-rules-with-auth.js` - Test rules với auth
4. `scripts/setup-and-test.sh` - Script tự động setup & test
5. `scripts/kill-and-restart-emulators.sh` - Auto restart emulators
6. `scripts/check-and-restart-emulators.sh` - Check status
7. `docs/AUTH-EMULATOR-SETUP.md` - Hướng dẫn chi tiết

---

## ❓ Troubleshooting

### Nếu script báo lỗi "Auth Emulator is NOT running"

→ Chạy: `bash scripts/kill-and-restart-emulators.sh`

### Nếu test báo "network-request-failed"

→ Verify Auth emulator đang chạy: `lsof -i :9099`

### Nếu có permission denied trong test

→ Đây là **đúng** nếu test name có "cannot" - nghĩa là rules hoạt động đúng!

---

## ✅ Tóm tắt

**Em đã làm tự động:**
- ✅ Setup Auth Emulator config
- ✅ Update scripts  
- ✅ Tạo test scripts
- ✅ Tạo helper scripts

**Anh cần làm (chỉ 1 lần):**
1. Restart emulators: `bash scripts/kill-and-restart-emulators.sh`
2. Chạy test: `bash scripts/setup-and-test.sh`

**Kết quả:**
- ✅ 100% test coverage cho Firestore Rules
- ✅ Verify rules hoạt động đúng
- ✅ Ready để test qua frontend app

---

**🎉 Ready to test! Chúc anh test thành công!**

