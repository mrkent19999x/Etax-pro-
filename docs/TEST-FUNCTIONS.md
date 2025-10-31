# 🧪 Hướng Dẫn Test Functions Local

## ✅ Mục tiêu
Test Firebase Functions mà **KHÔNG tốn Blaze plan** và **KHÔNG deploy**.

---

## 📋 Prerequisites

### 1. Check Functions có sẵn:
```bash
ls -la functions/
```

Nếu thấy `functions/index.js` → OK!

### 2. Install Functions dependencies:
```bash
cd functions
npm install
cd ..
```

---

## 🚀 Bước 1: Start Emulators

### Terminal 1:
```bash
npm run emulators
```

**Expected output**:
```
✔  functions: Emulator started at http://localhost:5001
✔  firestore: Emulator started at http://localhost:8080
✔  All emulators ready!
```

### Terminal 2 - Start Next.js:
```bash
npm run dev
```

---

## 🧪 Bước 2: Test Functions

### Test 1: Generate PDF Function

#### Setup:
1. Tạo transaction trong emulator (qua Admin hoặc Emulator UI)
2. Vào `/tra-cuu-chung-tu` trong app
3. Click "In chứng từ"

#### Expected:
- [ ] Function được gọi (check logs trong Terminal 1)
- [ ] PDF hiển thị trong iframe
- [ ] Có thể download PDF

#### Check Logs:
```bash
# Terminal 1 (emulators) sẽ show:
functions: generatePdf called with transactionId: xxx
functions: PDF generated successfully
```

---

### Test 2: CRUD Operations qua API Routes

Các API routes trong `/app/_api` **KHÔNG dùng Functions**, dùng Firestore trực tiếp.

#### Test Create User:
```bash
curl -X POST http://localhost:3000/_api/createUser \
  -H "Content-Type: application/json" \
  -d '{
    "mst": "00109202830",
    "password": "test123",
    "name": "Test User",
    "role": "user"
  }'
```

**Expected**: ✅ User created

---

## 🔍 Check Functions Logs

### Real-time Logs:
- Xem trong **Terminal 1** (nơi chạy `npm run emulators`)
- Hoặc vào http://localhost:4000 → **Functions** tab

### Function Invocation:
```
functions: generatePdf called
  Parameters: { transactionId: "abc123" }
  Result: { pdfUrl: "http://..." }
```

---

## 📝 Functions Checklist

### Có Functions nào đang dùng?

Check `functions/index.js`:
- [ ] `generatePdf` - Generate PDF từ transaction
- [ ] `exportMapping` - Export field mapping
- [ ] Other functions?

### Test từng function:
- [ ] Call function → check logs
- [ ] Verify response
- [ ] Check error handling

---

## 🐛 Troubleshooting

### Functions không start:
```bash
cd functions
npm install
```

### Lỗi "Function not found":
→ Check function name trong `functions/index.js`
→ Check URL trong `.env.local`:
```env
NEXT_PUBLIC_FUNCTIONS_URL=http://localhost:5001/anhbao-373f3/us-central1
```

### PDF không generate:
- Check Puppeteer đã cài trong `functions/`
- Check logs trong Emulator UI
- Verify transaction data có đủ fields

---

## ✅ Kết quả Test

**Anh ghi lại**:
- [ ] Functions nào chạy được?
- [ ] Functions nào lỗi?
- [ ] Bug gì phát hiện?

→ Sau đó báo em để fix! 🎯

