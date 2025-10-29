"use client"

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp,
  serverTimestamp
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { db, storage } from "./firebase-config"

// ===================================
// FIRESTORE SERVICES - Lưu dữ liệu
// ===================================

/**
 * Tạo hoặc cập nhật document trong Firestore
 */
export async function saveDocument(
  collectionName: string,
  docId: string,
  data: any
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await setDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Error saving document:", error)
    throw error
  }
}

/**
 * Lấy document từ Firestore
 */
export async function getDocument(
  collectionName: string,
  docId: string
): Promise<any | null> {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error("Error getting document:", error)
    throw error
  }
}

/**
 * Cập nhật document trong Firestore
 */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<any>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error("Error updating document:", error)
    throw error
  }
}

/**
 * Xóa document từ Firestore
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting document:", error)
    throw error
  }
}

/**
 * Lấy tất cả documents từ collection
 */
export async function getAllDocuments(collectionName: string): Promise<any[]> {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting all documents:", error)
    throw error
  }
}

/**
 * Query documents với điều kiện
 */
export async function queryDocuments(
  collectionName: string,
  field: string,
  operator: any,
  value: any
): Promise<any[]> {
  try {
    const q = query(collection(db, collectionName), where(field, operator, value))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error querying documents:", error)
    throw error
  }
}

// ===================================
// STORAGE SERVICES - Upload/Download files
// ===================================

/**
 * Upload file lên Firebase Storage
 */
export async function uploadFile(
  path: string,
  file: File,
  metadata?: { contentType?: string; customMetadata?: Record<string, string> }
): Promise<string> {
  try {
    const storageRef = ref(storage, path)
    await uploadBytes(storageRef, file, metadata)
    const downloadURL = await getDownloadURL(storageRef)
    return downloadURL
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

/**
 * Lấy download URL của file
 */
export async function getFileURL(path: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, path)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error) {
    console.error("Error getting file URL:", error)
    return null
  }
}

/**
 * Xóa file khỏi Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

// ===================================
// USER SERVICES - Quản lý user data
// ===================================

export interface UserData {
  userId: string
  mst: string
  name: string
  email?: string
  phone?: string
  avatar?: string
  createdAt?: any
  updatedAt?: any
}

/**
 * Lưu thông tin user vào Firestore
 */
export async function saveUserData(userId: string, userData: UserData): Promise<void> {
  return saveDocument("users", userId, {
    ...userData,
    userId,
    createdAt: serverTimestamp()
  })
}

/**
 * Lấy thông tin user từ Firestore
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  return getDocument("users", userId)
}

/**
 * Cập nhật thông tin user
 */
export async function updateUserData(userId: string, updates: Partial<UserData>): Promise<void> {
  return updateDocument("users", userId, updates)
}

// ===================================
// TAX DOCUMENT SERVICES
// ===================================

export interface TaxDocument {
  docId: string
  userId: string
  type: string // "invoice", "tax_declaration", "receipt", etc.
  name: string
  fileUrl: string
  uploadDate: any
  tags?: string[]
}

/**
 * Upload và lưu tax document
 */
export async function uploadTaxDocument(
  userId: string,
  documentType: string,
  fileName: string,
  file: File
): Promise<string> {
  try {
    const timestamp = Date.now()
    const filePath = `tax-documents/${userId}/${documentType}/${timestamp}-${fileName}`
    
    // Upload file lên Storage
    const fileUrl = await uploadFile(filePath, file, {
      contentType: file.type
    })
    
    // Lưu metadata vào Firestore
    const docId = `${userId}_${timestamp}`
    const taxDoc: TaxDocument = {
      docId,
      userId,
      type: documentType,
      name: fileName,
      fileUrl,
      uploadDate: serverTimestamp()
    }
    
    await saveDocument("tax_documents", docId, taxDoc)
    
    return docId
  } catch (error) {
    console.error("Error uploading tax document:", error)
    throw error
  }
}

/**
 * Lấy tất cả tax documents của user
 */
export async function getUserTaxDocuments(userId: string): Promise<TaxDocument[]> {
  return queryDocuments("tax_documents", "userId", "==", userId)
}

