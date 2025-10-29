# 🚀 Quick Start - Test Local (MIỄN PHÍ)

## ✅ Đã Setup Sẵn!

Anh có thể test toàn bộ hệ thống Admin & PDF **hoàn toàn miễn phí** trên local mà **không cần upgrade Blaze plan**.

---

## 📋 2 Bước Để Bắt Đầu:

### Bước 1: Start Firebase Emulators

```bash
# Terminal 1: Start emulators
npm run emulators
```

Hoặc:
```bash
firebase emulators:start --only functions,firestore
```

Sẽ start:
- ✅ **Functions**: http://localhost:5001
- ✅ **Firestore**: http://localhost:8080  
- ✅ **Emulator UI**: http://localhost:4000 (xem data, logs)

### Bước 2: Start Next.js Dev Server

```bash
# Terminal 2: Start Next.js
npm run dev
```

Truy cập: http://localhost:3000

---

## 🎯 Test Ngay:

### 1. Test Admin Dashboard:
- Vào: http://localhost:3000/admin
- Login với user có role `admin`

### 2. Test PDF Generation:
- Vào: http://localhost:3000/tra-cuu-chung-tu
- Search và preview/download PDF

### 3. Xem Data trong Emulator UI:
- Vào: http://localhost:4000
- Check Firestore collections: `users`, `templates`, `mappings`, `transactions`

---

## 📝 Environment Variables

File `.env.local` đã được tạo với config cho emulators:
```env
NEXT_PUBLIC_FUNCTIONS_URL=http://localhost:5001/etax-7fbf8/us-central1
NEXT_PUBLIC_FIREBASE_PROJECT_ID=etax-7fbf8
```

---

## 💡 Tips

1. **Giữ 2 terminals chạy**: 1 cho emulators, 1 cho Next.js
2. **Xem logs real-time** trong Emulator UI
3. **Reset data**: Stop emulators → Delete `.firebase/emulators` → Start lại

---

## 🎉 Kết Luận

✅ **Không cần** upgrade Blaze plan  
✅ **Không tốn** chi phí gì  
✅ Test local **hoàn toàn free**  
✅ Đầy đủ tính năng như production  

Chỉ khi nào deploy production mới cần Blaze plan (và vẫn có free tier rất lớn)!

---

**Chi tiết hơn xem**: `LOCAL-DEV-GUIDE.md`

