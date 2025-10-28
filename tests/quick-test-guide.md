# 🚀 Quick Test Guide - eTax Mobile PWA

Hướng dẫn test nhanh 10 phút cho anh Nghĩa.

## ⚡ Test nhanh (10 phút)

### 1. Mở browser và setup (1 phút)
```bash
# Mở Chrome
# Nhấn F12 để mở DevTools
# Click icon mobile 📱 để set responsive mode
# Chọn iPhone SE (375x667)
```

### 2. Test Login (2 phút)
```
URL: http://localhost:3000/login

1. Nhập MST: 00109202830
2. Nhập password: test123
3. Click "Đăng nhập"
✅ Kỳ vọng: Redirect về home, thấy profile card
```

### 3. Test Navigation (3 phút)
```
a) Sidebar
- Click Menu icon ☰
- Click "Khai thuế"
✅ Kỳ vọng: Đến trang /khai-thue

b) Home Grid
- Click "Tra cứu thông báo" 
✅ Kỳ vọng: Đến trang /thong-bao

c) Back button
- Click nút back ⬅️
✅ Kỳ vọng: Quay lại trang trước
```

### 4. Test PWA (2 phút)
```
DevTools → Tab "Application" → Service Workers

✅ Check: Service Worker = "activated and running"
✅ Check: Cache Storage có "etax-mobile-v1"
```

### 5. Test Offline (2 phút)
```
DevTools → Tab "Network"
Dropdown chọn "Offline"
Refresh page

✅ Kỳ vọng: Page vẫn load (từ cache)
```

---

## 🔍 Test chi tiết (30 phút)

### Phase 1: Authentication ✅
- [x] Login success
- [ ] Login validation
- [ ] Logout

### Phase 2: Navigation ✅
- [x] Sidebar open/close
- [x] Home page grid
- [x] Back button
- [ ] Deep links

### Phase 3: PWA Features ✅
- [x] Service Worker registered
- [x] Offline mode works
- [ ] Full screen display
- [ ] Manifest valid

### Phase 4: Responsive ✅
- [x] Mobile view (375px)
- [ ] Tablet view (768px)

---

## 📋 Checklist nhanh

Đánh dấu ✅ khi PASS:

### Core Functionality
- [✅] Server chạy được
- [✅] Login hoạt động
- [✅] Navigate giữa các trang OK
- [✅] Sidebar mở/đóng OK
- [✅] Back button hoạt động
- [✅] Service Worker đã register

### PWA Features
- [ ] Offline mode hoạt động
- [ ] Manifest file valid
- [ ] Icons hiển thị đúng
- [ ] Fullscreen mode (nếu installed)

### UI/UX
- [✅] Layout responsive (mobile)
- [✅] Buttons dễ click
- [✅] Text đọc được
- [✅] Không overflow

---

## 🐛 Nếu gặp bug

**Ghi lại:**
1. Trang nào gặp bug
2. Làm gì thì gặp bug
3. Bug trông như thế nào
4. Console có error không? (F12 → Console)

**Ví dụ:**
```
Bug #1: Sidebar không đóng khi click overlay
- Location: Home page
- Steps: 
  1. Click menu icon
  2. Click overlay (dark background)
- Expected: Sidebar đóng lại
- Actual: Sidebar vẫn mở
```

---

## ✅ Kết quả

**Total tests checked: __ / 31**

**Critical issues: __**

**Overall status:** ⬜ PASS ⬜ FAIL

---

## 📞 Cần giúp đỡ?

- File checklist đầy đủ: `tests/e2e-test-checklist.md`
- Test summary template: `tests/test-summary.md`
- Helper script: `./tests/run-tests.sh`

**Ready? Let's test! 🎉**


