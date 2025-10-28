# eTax Mobile PWA - E2E Testing

Hướng dẫn test E2E cho ứng dụng eTax Mobile PWA.

## 📁 Files trong folder này

1. **e2e-test-checklist.md** - Full checklist chi tiết 31 test cases
2. **test-summary.md** - Template cho test report
3. **run-tests.sh** - Script helper để check server và open test URL
4. **README.md** - File này

## 🚀 Cách chạy test

### Option 1: Manual Testing (Recommended cho lần đầu)

```bash
# 1. Start server
npm run dev

# 2. Run helper script
./tests/run-tests.sh

# 3. Follow checklist
# Mở file tests/e2e-test-checklist.md
# Thực hiện từng test case
# Đánh dấu ✅ hoặc ❌
```

### Option 2: Automated Testing (Cần setup thêm)

Nếu muốn automated testing, cần install thêm tools:
- Playwright
- Cypress
- Puppeteer

**Note:** Hiện tại project chưa có automated test setup sẵn.

## 📋 Test Coverage

### Phase 1: Authentication (4 tests)
- Login success/failure
- Session management
- Protected routes

### Phase 2: Home Navigation (10 tests)
- Sidebar navigation
- Carousel scrolling
- Service grid clicks
- Profile card navigation

### Phase 3: Notification Flow (4 tests)
- List view
- Tab switching
- Detail view
- Header bell icon

### Phase 4: General Navigation (3 tests)
- Back button
- Home button
- Deep links

### Phase 5: PWA Features (6 tests)
- Service Worker
- Offline mode
- Manifest
- Fullscreen
- Installability

### Phase 6: Responsive Design (2 tests)
- Mobile view (375px)
- Tablet view (768px)

### Phase 7: Edge Cases (2 tests)
- Rapid navigation
- Long text handling

**Total: 31 test cases**

## 🎯 Test Flow Quick Start

### 1. Setup
```bash
# Start server
npm run dev
```

### 2. Open Browser
- Chrome (recommended)
- Open DevTools (F12)
- Switch to Responsive Design Mode
- Set to 375x667 (iPhone SE)

### 3. Test Key Scenarios

**A. Login Flow**
1. Go to http://localhost:3000/login
2. Enter MST: `00109202830`
3. Enter password: `test123`
4. Click "Đăng nhập"
5. ✅ Should redirect to home

**B. Sidebar Navigation**
1. Click Menu icon
2. Click "Khai thuế"
3. ✅ Should navigate to /khai-thue
4. ✅ Sidebar should close

**C. Home Page Navigation**
1. Click "Tra cứu thông báo" icon
2. ✅ Should navigate to /thong-bao
3. Click back button
4. ✅ Should return home

**D. PWA Check**
1. DevTools → Application → Service Workers
2. ✅ Service Worker should be registered
3. ✅ Status: "activated and running"

## 📊 Recording Test Results

1. Open `tests/test-summary.md`
2. Fill in results for each test
3. Record any bugs/issues
4. Take screenshots if needed
5. Save completed report

## 🐛 Reporting Bugs

Khi tìm thấy bug, ghi lại:

```markdown
**Bug #1:** [Title]
- **Location:** /path/to/page
- **Steps to Reproduce:**
  1. Step 1
  2. Step 2
- **Expected:** Should do X
- **Actual:** Does Y instead
- **Screenshot:** [link if available]
```

## ✅ Definition of Done

Một test case được coi là PASS khi:
- ✅ Tất cả expected behaviors xảy ra đúng
- ✅ Không có console errors
- ✅ UI responsive tốt
- ✅ Navigation smooth
- ✅ Không crash hay memory leak

## 🔄 Re-testing After Fixes

Khi fix bug:
1. Chạy lại test case failed
2. Verify fix works
3. Test regression cho features liên quan
4. Update test summary

## 📞 Support

Nếu gặp vấn đề khi testing:
- Check browser console for errors
- Verify server is running
- Check Service Worker status
- Try incognito mode (clear cache)

## 📈 Test Metrics

Track các metrics sau:
- Pass Rate: ___%
- Critical Bugs: ___
- Medium Bugs: ___
- Minor Issues: ___
- Test Duration: ___ hours

---

**Happy Testing! 🎉**


