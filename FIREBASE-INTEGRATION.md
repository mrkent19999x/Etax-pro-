# 🔥 Firebase Integration Guide

## 📋 Tổng quan

Dự án đã được tích hợp đầy đủ **Firebase** với 3 services chính:
1. **Firebase Authentication** - Đăng nhập/Đăng ký
2. **Cloud Firestore** - Database để lưu trữ dữ liệu
3. **Firebase Storage** - Upload/Download files

## 🚀 Cách sử dụng

### 1. Firebase Services (lib/firebase-service.ts)

#### **Lưu dữ liệu vào Firestore**

```typescript
import { saveDocument, getUserData, updateDocument } from "@/lib/firebase-service"

// Lưu user data
await saveUserData(userId, {
  userId,
  name: "TỪ XUÂN CHIẾN",
  mst: "0123456789",
  email: "user@example.com"
})

// Lấy user data
const userData = await getUserData(userId)

// Cập nhật user data
await updateUserData(userId, { 
  name: "Tên mới" 
})
```

#### **Upload file lên Firebase Storage**

```typescript
import { uploadFile } from "@/lib/firebase-service"

const fileUrl = await uploadFile(
  "documents/user123/document.pdf",
  file,
  {
    contentType: "application/pdf",
    customMetadata: { description: "Tax document" }
  }
)
```

#### **Download file từ Storage**

```typescript
import { getFileURL } from "@/lib/firebase-service"

const fileUrl = await getFileURL("documents/user123/document.pdf")
```

### 2. React Hooks

#### **useFirebaseAuth** - Quản lý authentication

```typescript
import { useFirebaseAuth } from "@/hooks/use-firebase-auth"

function MyComponent() {
  const { user, userData, loading, login, logout } = useFirebaseAuth()

  const handleLogin = async () => {
    await login("user@example.com", "password123")
  }
}
```

#### **useFirebaseStorage** - Upload/Download files

```typescript
import { useFirebaseStorage } from "@/hooks/use-firebase-storage"

function MyComponent() {
  const { upload, getURL, remove, isUploading } = useFirebaseStorage()

  const handleUpload = async (file: File) => {
    const url = await upload("myfiles/image.jpg", file)
    console.log("Uploaded:", url)
  }
}
```

### 3. Component FileUpload

Component sẵn có để upload files:

```typescript
import { FileUpload } from "@/components/file-upload"

function MyPage() {
  return (
    <FileUpload
      userId="user123"
      accept="image/*,application/pdf"
      maxSize={10}
      onUploadSuccess={(url) => console.log("Success:", url)}
      onUploadError={(error) => console.error("Error:", error)}
    />
  )
}
```

## 📊 Database Structure

### **Users Collection**

```
users/
  {userId}/
    userId: string
    name: string
    mst: string
    email?: string
    phone?: string
    avatar?: string
    createdAt: Timestamp
    updatedAt: Timestamp
```

### **Tax Documents Collection**

```
tax_documents/
  {docId}/
    docId: string
    userId: string
    type: string
    name: string
    fileUrl: string
    uploadDate: Timestamp
    tags?: string[]
```

### **Storage Structure**

```
storage/
  uploads/
    {userId}/
      {timestamp}-{filename}
  
  tax-documents/
    {userId}/
      {documentType}/
        {timestamp}-{filename}
```

## 🔒 Security Rules

Cần cấu hình Firebase Security Rules trong Firebase Console:

### **Firestore Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users chỉ có thể xem/sửa data của chính mình
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Tax documents chỉ user owner mới access được
    match /tax_documents/{docId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

### **Storage Rules**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User chỉ có thể upload vào folder của mình
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Tax documents
    match /tax-documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## 🎯 Use Cases

### 1. Đăng nhập với Firebase Auth

```typescript
// Trong login page
const { login } = useFirebaseAuth()

await login("mst@tax.gov", "password")
```

### 2. Upload hóa đơn điện tử

```typescript
import { uploadTaxDocument } from "@/lib/firebase-service"

await uploadTaxDocument(
  userId,
  "invoice",
  "invoice_2024.pdf",
  file
)
```

### 3. Lấy danh sách documents của user

```typescript
import { getUserTaxDocuments } from "@/lib/firebase-service"

const documents = await getUserTaxDocuments(userId)
```

## ⚠️ Lưu ý quan trọng

1. **Replace localStorage**: Hiện tại đang dùng localStorage để mock auth. Nên thay thế bằng Firebase Auth thật.

2. **Security Rules**: Phải cấu hình security rules trong Firebase Console để bảo mật dữ liệu.

3. **Error Handling**: Luôn handle errors khi gọi Firebase services.

4. **Offline Support**: Firestore tự động cache dữ liệu, app sẽ hoạt động offline được.

## 📚 Tham khảo

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Docs](https://firebase.google.com/docs/firestore)
- [Storage Docs](https://firebase.google.com/docs/storage)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)

