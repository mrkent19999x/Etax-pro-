# eTax Mobile - Kiến Trúc & Luồng Xử Lý

## 🏗️ Tổng Quan Kiến Trúc

### Frontend Stack
- **Framework**: Next.js 15 với App Router
- **UI**: React 19 + TypeScript + TailwindCSS
- **PWA**: Static Export (`output: 'export'`) - Mobile-first design
- **Theme**: Dark/Light mode support

### Backend Stack  
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage (cho files/documents)
- **Functions**: Firebase Cloud Functions (xử lý backend logic)
- **Hosting**: Firebase Hosting

### Development Tools
- **Testing**: Jest (unit tests) + Playwright (E2E)
- **Linting**: ESLint + TypeScript
- **Build**: Static export → Firebase Hosting

---

## 📱 Luồng Xử Lý Chính

### 1. Authentication Flow
```
User Login → Firebase Auth → Firestore (users collection) → App State
```

**Chi tiết:**
- Login qua Firebase Auth
- Lưu thông tin user vào Firestore `users` collection
- Custom hooks `useFirebaseAuth()` quản lý auth state
- Protected routes qua `ProtectedView` component

### 2. Data Flow
```
UI Components → Firebase Service → Firestore/Storage → API Responses
```

**Chi tiết:**
- UI Components sử dụng `firebase-service.ts`
- CRUD operations qua Firestore
- File uploads qua Firebase Storage
- API endpoints trong `app/api/` cho admin operations

### 3. Tax Document Management
```
File Upload → Firebase Storage + Metadata → Firestore docs
```

**Chi tiết:**
- Upload files vào `tax-documents/{userId}/{type}/`
- Metadata lưu trong `tax_documents` collection
- Support multiple document types (invoice, receipts, etc.)

---

## 🗂️ Cấu Trúc Thư Mục

```
/home/mrkent/etax-project/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints (admin operations)
│   ├── login/             # Authentication pages
│   ├── dashboard/         # Main application pages
│   └── globals.css        # Global styles
├── components/            # React Components
│   ├── admin/            # Admin-specific components
│   ├── ui/               # Reusable UI components
│   └── ...               # Business components
├── lib/                   # Core Services
│   ├── firebase-config.ts    # Firebase setup
│   ├── firebase-service.ts   # CRUD operations
│   ├── admin-service.ts      # Admin operations
│   └── pdf-service.ts        # PDF generation
├── hooks/                 # Custom React Hooks
│   ├── use-firebase-auth.ts  # Auth management
│   ├── use-admin-auth.ts     # Admin auth
│   └── ...                   # Other hooks
├── functions/             # Firebase Cloud Functions
└── public/                # Static assets & PWA files
```

---

## 🔑 Core Services

### 1. Firebase Service (`lib/firebase-service.ts`)
- **User Management**: CRUD users trong Firestore
- **Document Management**: Upload/download files
- **Tax Documents**: Specialized cho tax-related docs
- **Storage Operations**: File handling

### 2. Admin Service (`lib/admin-service.ts`)  
- **Template Management**: CRUD operations cho templates
- **User Administration**: Admin user operations
- **Transaction Management**: Tax transactions
- **Mapping Operations**: Data mapping functions

### 3. Authentication Hooks
- `useFirebaseAuth()`: Main auth logic
- `useAdminAuth()`: Admin role checking
- `useFirebaseStorage()`: File upload handling

---

## 🌐 API Endpoints (app/api/)

### User Management
- `POST /api/createUser` - Tạo user mới
- `GET /api/getUsers` - Lấy danh sách users
- `PUT /api/updateUser` - Cập nhật user
- `DELETE /api/deleteUser` - Xóa user

### Template Management  
- `POST /api/createTemplate` - Tạo template
- `GET /api/getTemplates` - Lấy templates
- `PUT /api/updateTemplate` - Cập nhật template
- `DELETE /api/deleteTemplate` - Xóa template

### Transaction Management
- `POST /api/createTransaction` - Tạo transaction
- `GET /api/getTransactions` - Lấy transactions  
- `PUT /api/updateTransaction` - Cập nhật transaction
- `DELETE /api/deleteTransaction` - Xóa transaction

### Export/Import
- `GET /api/exportMapping` - Export data mapping
- `POST /api/importMapping` - Import data mapping

### PDF Generation
- `POST /api/generatePdf` - Generate PDF documents

---

## 🗄️ Database Schema (Firestore)

### Collections:
1. **users** - Thông tin người dùng
   ```typescript
   {
     userId: string
     mst: string           // Mã số thuế
     name: string
     email?: string
     phone?: string
     avatar?: string
     role: "admin" | "user"
     mstList?: string[]    // Danh sách MST quản lý
     createdAt: timestamp
     updatedAt: timestamp
   }
   ```

2. **tax_documents** - Tài liệu thuế
   ```typescript
   {
     docId: string
     userId: string
     type: string          // "invoice", "receipt", etc.
     name: string
     fileUrl: string
     uploadDate: timestamp
     tags?: string[]
   }
   ```

3. **templates** - Mẫu biểu
4. **transactions** - Giao dịch thuế
5. **mappings** - Mapping data

---

## 🚀 Deployment Strategy

### Build Process:
```bash
npm run build  # Next.js build → static files
# Output: dist/ folder với static files
```

### Firebase Hosting:
- **Source**: `dist/` folder (từ Next.js export)
- **Rewrite**: All routes → `index.html` (SPA behavior)
- **PWA**: Service worker + manifest.json

### Development:
```bash
npm run dev    # Next.js dev server
npm run emulators  # Firebase local emulators
npm run test   # Jest tests  
npm run e2e    # Playwright E2E tests
```

---

## 🎯 Key Features Flow

### 1. User Login
```
Login Page → Firebase Auth → Firestore user data → Dashboard
```

### 2. Admin Operations
```
Admin Auth → Protected Routes → API Endpoints → Firestore updates
```

### 3. Tax Document Upload
```
File Select → Firebase Storage → Firestore metadata → UI update
```

### 4. PWA Features
```
Service Worker → Offline cache → Background sync → Push notifications
```

---

## 🔧 Development Commands

```bash
# Development
npm run dev                    # Start dev server
npm run emulators             # Start Firebase emulators

# Testing  
npm run test                  # Run Jest tests
npm run test:watch            # Watch mode
npm run test:coverage         # Coverage report
npm run e2e                   # Playwright E2E tests

# Build & Deploy
npm run build                 # Production build (static export)
firebase deploy               # Deploy to Firebase Hosting
```

---

## 📊 Performance & Scalability

### Static Export Benefits:
- **Fast Loading**: Pre-built HTML/CSS/JS
- **CDN Friendly**: Static files qua Firebase CDN
- **SEO Optimized**: Server-side rendering ready

### Firebase Benefits:
- **Scalable**: Auto-scaling Firestore & Functions
- **Real-time**: Firestore real-time updates
- **Global**: Multi-region deployment

### Mobile-First Design:
- **Responsive**: TailwindCSS breakpoints
- **Touch-Friendly**: Large tap targets
- **PWA**: Installable, offline-capable

---

## 🔒 Security

### Authentication:
- Firebase Auth với email/password
- Role-based access control (admin/user)
- Protected routes và API endpoints

### Data Security:
- Firestore Security Rules
- File upload validation
- Admin operations audit trail

---

*Được tạo bởi: Coder - eTax Mobile Project Analysis*
*Ngày: 2025-10-30*
