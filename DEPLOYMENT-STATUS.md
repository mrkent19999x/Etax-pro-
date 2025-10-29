# Deployment Status - eTax Admin & PDF System

## ✅ Đã Deploy Thành Công

### Firestore Security Rules
- **Status**: ✅ Deployed
- **Location**: `firestore.rules`
- **Features**:
  - Admin-only write access cho `users`, `templates`, `mappings`
  - Users chỉ đọc MST trong `mstList` của họ
  - Admin có thể đọc/ghi tất cả transactions
  - Role-based access control hoàn chỉnh

### Firestore Indexes
- **Status**: ✅ Deployed (Đang build, có thể mất vài phút)
- **Location**: `firestore.indexes.json`
- **Indexes**:
  1. `transactions`: paymentDate DESC, createdAt DESC
  2. `users`: role ASC, createdAt DESC  
  3. `templates`: isDefault ASC, isActive ASC

---

## ⚠️ Pending: Cloud Functions Deployment

### Yêu Cầu
**Project `etax-7fbf8` cần upgrade lên Blaze plan (pay-as-you-go) để deploy Functions.**

### Các Functions Đã Code Sẵn:
1. ✅ `test` - Test function
2. ✅ `createUser` - Tạo user mới (admin only)
3. ✅ `getUsers` - Lấy danh sách users (admin only)
4. ✅ `updateUser` - Cập nhật user (admin only)
5. ✅ `deleteUser` - Xóa user (admin only)
6. ✅ `createTemplate` - Tạo template (admin only)
7. ✅ `getTemplates` - Lấy danh sách templates
8. ✅ `updateTemplate` - Cập nhật template (admin only)
9. ✅ `deleteTemplate` - Xóa template (admin only)
10. ✅ `createTransaction` - Tạo transaction (admin only)
11. ✅ `getTransactions` - Lấy danh sách transactions
12. ✅ `updateTransaction` - Cập nhật transaction (admin only)
13. ✅ `deleteTransaction` - Xóa transaction (admin only)
14. ✅ `getMapping` - Lấy mapping cho template
15. ✅ `updateMapping` - Cập nhật mapping (admin only)
16. ✅ `exportMapping` - Export mapping JSON
17. ✅ `importMapping` - Import mapping JSON
18. ✅ `generatePdf` - Generate PDF từ transaction data
19. ✅ `onTransactionCreate` - Auto-trigger khi tạo transaction
20. ✅ `onMappingUpdate` - Auto-trigger khi update mapping

### Để Deploy Functions:

1. **Upgrade Blaze Plan:**
   - Visit: https://console.firebase.google.com/project/etax-7fbf8/usage/details
   - Click "Upgrade to Blaze plan"
   - Enter billing information (Free tier vẫn free cho hầu hết features)

2. **Deploy Functions:**
   ```bash
   firebase deploy --only functions
   ```

3. **Verify Deployment:**
   ```bash
   firebase functions:list
   ```

---

## 📝 Next Steps Sau Khi Deploy Functions

### 1. Setup Environment Variable
Sau khi Functions deploy, lấy Functions URL và set trong `.env.local`:
```env
NEXT_PUBLIC_FUNCTIONS_URL=https://us-central1-etax-7fbf8.cloudfunctions.net
```

Hoặc dùng Firebase Emulators cho local dev:
```bash
firebase emulators:start --only functions,firestore
```

### 2. Test Production
- ✅ Test admin dashboard CRUD
- ✅ Test PDF generation
- ✅ Test permissions (admin vs user)
- ✅ Test mapping system

### 3. Create First Admin User
Cần tạo user đầu tiên với role `admin` thông qua Firebase Console hoặc Functions:
- Vào Firebase Console → Authentication
- Tạo user mới
- Vào Firestore → `users/{userId}` → Set `role: "admin"`

---

## 📊 Deployment Summary

| Component | Status | Notes |
|-----------|--------|-------|
| Firestore Rules | ✅ Deployed | Active |
| Firestore Indexes | ✅ Deployed | Building (1-3 phút) |
| Cloud Functions | ⏳ Pending | Cần Blaze plan |
| Next.js API Routes | ✅ Ready | Local dev OK |

---

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com/project/etax-7fbf8/overview
- **Firestore Rules**: https://console.firebase.google.com/project/etax-7fbf8/firestore/rules
- **Functions**: https://console.firebase.google.com/project/etax-7fbf8/functions
- **Usage & Billing**: https://console.firebase.google.com/project/etax-7fbf8/usage/details

---

**Last Updated**: 2025-10-29 16:43:20 UTC

