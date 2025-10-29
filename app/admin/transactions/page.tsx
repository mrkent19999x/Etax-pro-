"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useRequireAdmin } from "@/hooks/use-admin-auth"
import { Plus, Edit, Trash2, Eye, Download } from "lucide-react"
import { downloadPdf, previewPdf } from "@/lib/pdf-service"

interface Transaction {
  id: string
  mst: string
  taxpayerName: string
  amount: number
  paymentDate: any
  status: string
  templateId?: string
  createdAt?: any
}

export default function AdminTransactionsPage() {
  const { isAdmin, isLoading } = useRequireAdmin()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [formData, setFormData] = useState({
    mst: "",
    taxpayerName: "",
    taxpayerAddress: "",
    amount: "",
    paymentDate: "",
    status: "pending",
    templateId: ""
  })

  useEffect(() => {
    if (isAdmin) {
      loadTransactions()
    }
  }, [isAdmin])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const { getTransactions } = await import("@/lib/admin-service")
      const data = await getTransactions()
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error("Error loading transactions:", error)
      alert("Lỗi khi tải danh sách transactions")
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingTransaction(null)
    setFormData({
      mst: "",
      taxpayerName: "",
      taxpayerAddress: "",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      status: "pending",
      templateId: ""
    })
    setShowModal(true)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    const date = transaction.paymentDate?.toDate 
      ? transaction.paymentDate.toDate().toISOString().split("T")[0]
      : transaction.paymentDate instanceof Date 
      ? transaction.paymentDate.toISOString().split("T")[0]
      : ""
    
    setFormData({
      mst: transaction.mst || "",
      taxpayerName: transaction.taxpayerName || "",
      taxpayerAddress: "",
      amount: transaction.amount?.toString() || "",
      paymentDate: date,
      status: transaction.status || "pending",
      templateId: transaction.templateId || ""
    })
    setShowModal(true)
  }

  const handleDelete = async (transactionId: string) => {
    if (!confirm("Bạn có chắc muốn xóa transaction này?")) return

    try {
      const { deleteTransaction } = await import("@/lib/admin-service")
      await deleteTransaction(transactionId)
      loadTransactions()
    } catch (error) {
      console.error("Error deleting transaction:", error)
      alert("Lỗi khi xóa transaction: " + (error as Error).message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { createTransaction, updateTransaction } = await import("@/lib/admin-service")
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, {
          ...formData,
          amount: parseFloat(formData.amount),
          paymentDate: new Date(formData.paymentDate)
        })
      } else {
        await createTransaction({
          ...formData,
          amount: parseFloat(formData.amount),
          paymentDate: new Date(formData.paymentDate)
        })
      }
      setShowModal(false)
      loadTransactions()
    } catch (error) {
      console.error("Error saving transaction:", error)
      alert("Lỗi khi lưu transaction: " + (error as Error).message)
    }
  }

  const handlePreview = async (mst: string, templateId?: string) => {
    try {
      const url = await previewPdf(mst, templateId)
      setPreviewUrl(url)
      setShowPreview(true)
    } catch (error) {
      console.error("Error previewing PDF:", error)
      alert("Lỗi khi preview PDF: " + (error as Error).message)
    }
  }

  const handleDownload = async (mst: string, templateId?: string) => {
    try {
      await downloadPdf(mst, templateId)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("Lỗi khi tải PDF: " + (error as Error).message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang kiểm tra quyền...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Transactions</h2>
            <p className="text-gray-600 mt-1">Tạo và quản lý giao dịch nộp thuế</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus size={20} />
            Tạo Transaction Mới
          </button>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Đang tải...</div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Chưa có transaction nào</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">MST</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người nộp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày nộp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-sm">{transaction.mst}</td>
                      <td className="px-4 py-3">{transaction.taxpayerName}</td>
                      <td className="px-4 py-3">
                        {new Intl.NumberFormat('vi-VN').format(transaction.amount || 0)} VND
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {transaction.paymentDate?.toDate 
                          ? transaction.paymentDate.toDate().toLocaleDateString('vi-VN')
                          : transaction.paymentDate instanceof Date
                          ? transaction.paymentDate.toLocaleDateString('vi-VN')
                          : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handlePreview(transaction.mst, transaction.templateId)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Preview PDF"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleDownload(transaction.mst, transaction.templateId)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                            title="Download PDF"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(transaction)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">
                {editingTransaction ? "Sửa Transaction" : "Tạo Transaction Mới"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">MST *</label>
                  <input
                    type="text"
                    required
                    value={formData.mst}
                    onChange={(e) => setFormData({ ...formData, mst: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ví dụ: 0123456789"
                    disabled={!!editingTransaction}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Người nộp thuế *</label>
                  <input
                    type="text"
                    required
                    value={formData.taxpayerName}
                    onChange={(e) => setFormData({ ...formData, taxpayerName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.taxpayerAddress}
                    onChange={(e) => setFormData({ ...formData, taxpayerAddress: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Số tiền (VND) *</label>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ngày nộp *</label>
                    <input
                      type="date"
                      required
                      value={formData.paymentDate}
                      onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="pending">Đang xử lý</option>
                    <option value="completed">Hoàn thành</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    {editingTransaction ? "Cập nhật" : "Tạo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && previewUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Preview PDF</h3>
                <button
                  onClick={() => {
                    setShowPreview(false)
                    URL.revokeObjectURL(previewUrl)
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
              <iframe
                src={previewUrl}
                className="w-full h-[80vh] border rounded"
                title="PDF Preview"
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

