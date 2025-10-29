# Hướng Dẫn Development Local với Firebase Emulators

## 🎯 Không Cần Blaze Plan - Test Local Hoàn Toàn Free!

Bạn có thể test toàn bộ hệ thống Admin & PDF trên local với Firebase Emulators mà **không cần upgrade Blaze plan** và **không tốn chi phí**.

---

## 📋 Prerequisites

Đã cài đặt:
- ✅ Firebase CLI (đã có)
- ✅ Node.js 18+ (đã có)

---

## 🚀 Setup & Chạy Emulators

### 1. Start Emulators:

```bash
# Từ root project
firebase emulators:start --only functions,firestore
```

Lệnh này sẽ start:
- **Functions Emulator**: http://localhost:5001
- **Firestore Emulator**: http://localhost:8080
- **Emulator UI**: http://localhost:4000 (để xem data và logs)

### 2. Set Environment Variable cho Next.js:

Tạo file `.env.local` trong root project:

```env
NEXT_PUBLIC_FUNCTIONS_URL=http://localhost:5001/etax-7fbf8/us-central1
NEXT_PUBLIC_FIREBASE_PROJECT_ID=etax-7fbf8
```

### 3. Start Next.js Dev Server (terminal khác):

```bash
npm run dev
```

---

## 📝 Workflow Development

### Step 1: Import Seed Data (Optional)

Bạn có thể import data mẫu vào Firestore Emulator:

```bash
# Export từ production (nếu có)
firebase firestore:export firestore-export

# Import vào emulator
firebase emulators:start --only firestore --import=./firestore-export
```

### Step 2: Test Admin Dashboard

1. Login với user có role `admin` trong emulator
2. Truy cập: http://localhost:3000/admin
3. Test CRUD users, templates, mappings, transactions

### Step 3: Test PDF Generation

1. Tạo transaction trong admin dashboard
2. Truy cập: http://localhost:3000/tra-cuu-chung-tu
3. Search và preview/download PDF

---

## 🔧 Useful Commands

### View Emulator UI:
- **URL**: http://localhost:4000
- **Features**: View Firestore data, Functions logs, download data

### Export Emulator Data:
```bash
# Export khi emulators đang chạy
curl http://localhost:4000/emulator/v1/projects/etax-7fbf8/databases/(default)/data
```

### Clear Emulator Data:
```bash
# Stop emulators và xóa data
rm -rf .firebase/emulators
```

### View Functions Logs:
- Real-time logs trong terminal nơi chạy emulators
- Hoặc vào Emulator UI → Functions tab

---

## 🧪 Test Scenarios

### 1. Test Admin Authentication:
- ✅ Login với admin user → có thể access /admin
- ✅ Login với normal user → redirect về login

### 2. Test User Management:
- ✅ Create user mới
- ✅ Update role và mstList
- ✅ Delete user

### 3. Test Template & Mapping:
- ✅ Create template với HTML
- ✅ Map fields (visible, required, format)
- ✅ Export/Import mapping JSON

### 4. Test PDF Generation:
- ✅ Generate PDF từ transaction
- ✅ Download PDF file
- ✅ Preview PDF trong iframe

### 5. Test Permissions:
- ✅ Admin xem tất cả transactions
- ✅ User chỉ xem MST trong mstList

---

## 🐛 Troubleshooting

### Emulators không start:
```bash
# Check ports
lsof -i :5001  # Functions
lsof -i :8080  # Firestore
lsof -i :4000  # UI

# Kill process nếu cần
kill -9 <PID>
```

### Functions không chạy:
```bash
cd functions
npm install  # Đảm bảo dependencies đã cài
```

### PDF generation lỗi:
- Check Puppeteer đã cài trong functions/
- Check Chrome/Chromium có trong Docker container (nếu dùng)
- Xem logs trong Emulator UI

### Connection refused:
- Đảm bảo emulators đang chạy
- Check NEXT_PUBLIC_FUNCTIONS_URL trong .env.local

---

## 📊 Emulator Features

### Firestore Emulator:
- ✅ Full CRUD operations
- ✅ Security Rules simulation
- ✅ Real-time updates
- ✅ Indexes support

### Functions Emulator:
- ✅ Run functions locally
- ✅ Debug với logs
- ✅ Test triggers
- ✅ Hot reload (auto-reload khi code thay đổi)

---

## 💡 Tips

1. **Keep Emulators Running**: Giữ emulators chạy trong 1 terminal, Next.js trong terminal khác
2. **Use Emulator UI**: UI rất hữu ích để xem data và debug
3. **Seed Data**: Import data mẫu để test nhanh hơn
4. **Hot Reload**: Functions tự động reload khi code thay đổi

---

## 🎉 Kết Luận

Với Firebase Emulators, bạn có thể:
- ✅ Test toàn bộ hệ thống **hoàn toàn miễn phí**
- ✅ **Không cần** upgrade Blaze plan
- ✅ **Không tốn chi phí** gì cả
- ✅ Test local nhanh hơn production

Chỉ khi nào deploy lên production mới cần Blaze plan (và vẫn có free tier khá lớn).

---

**Happy Coding! 🚀**

