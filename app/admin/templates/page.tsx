"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useRequireAdmin } from "@/hooks/use-admin-auth"
import { Plus, Edit, Trash2, Eye, CheckCircle, XCircle } from "lucide-react"

interface Template {
  id: string
  name: string
  htmlTemplate: string
  type: string
  isActive: boolean
  isDefault: boolean
  createdAt?: any
}

export default function AdminTemplatesPage() {
  const { isAdmin, isLoading } = useRequireAdmin()
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    htmlTemplate: "",
    isActive: true,
    isDefault: false
  })

  useEffect(() => {
    if (isAdmin) {
      loadTemplates()
    }
  }, [isAdmin])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const { getTemplates } = await import("@/lib/admin-service")
      const data = await getTemplates()
      setTemplates(data.templates)
    } catch (error) {
      console.error("Error loading templates:", error)
      alert("Lỗi khi tải danh sách templates: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingTemplate(null)
    setFormData({
      name: "",
      htmlTemplate: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    .header { text-align: center; font-weight: bold; font-size: 20px; }
  </style>
</head>
<body>
  <div class="header">GIẤY NỘP TIỀN VÀO NGÂN SÁCH NHÀ NƯỚC</div>
  <p><strong>Mã tham chiếu:</strong> {{referenceCode}}</p>
  <p><strong>Người nộp thuế:</strong> {{taxpayerName}}</p>
  <p><strong>Số tiền:</strong> {{amount}} VND</p>
  <p><strong>Ngày nộp:</strong> {{paymentDate}}</p>
</body>
</html>`,
      isActive: true,
      isDefault: false
    })
    setShowModal(true)
  }

  const handleEdit = (template: Template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      htmlTemplate: template.htmlTemplate,
      isActive: template.isActive,
      isDefault: template.isDefault
    })
    setShowModal(true)
  }

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
    setShowPreview(true)
  }

  const handleDelete = async (templateId: string) => {
    if (!confirm("Bạn có chắc muốn xóa template này?")) return

    try {
      const { deleteTemplate } = await import("@/lib/admin-service")
      await deleteTemplate(templateId)
      loadTemplates()
    } catch (error) {
      console.error("Error deleting template:", error)
      alert("Lỗi khi xóa template: " + (error as Error).message)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { createTemplate, updateTemplate } = await import("@/lib/admin-service")
      if (editingTemplate) {
        await updateTemplate(editingTemplate.id, formData)
      } else {
        await createTemplate(formData)
      }
      setShowModal(false)
      loadTemplates()
    } catch (error) {
      console.error("Error saving template:", error)
      alert("Lỗi khi lưu template: " + (error as Error).message)
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
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Templates</h2>
            <p className="text-gray-600 mt-1">Tạo và chỉnh sửa PDF templates</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus size={20} />
            Tạo Template Mới
          </button>
        </div>

        {/* Templates List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Đang tải...</div>
          ) : templates.length === 0 ? (
            <div className="p-8 text-center text-gray-600">Chưa có template nào</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {templates.map((template) => (
                <div key={template.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{template.name}</h3>
                        {template.isActive ? (
                          <CheckCircle className="text-green-500" size={20} />
                        ) : (
                          <XCircle className="text-gray-400" size={20} />
                        )}
                        {template.isDefault && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Type: {template.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePreview(template)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(template)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold mb-4">
                {editingTemplate ? "Sửa Template" : "Tạo Template Mới"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tên Template</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ví dụ: Giấy nộp tiền vào NSNN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">HTML Template</label>
                  <textarea
                    required
                    value={formData.htmlTemplate}
                    onChange={(e) => setFormData({ ...formData, htmlTemplate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                    rows={15}
                    placeholder="Nhập HTML template với Handlebars placeholders ({{fieldName}})"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Sử dụng Handlebars syntax: {"{{fieldName}}"} để chèn dữ liệu động
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Kích hoạt</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Template mặc định</span>
                  </label>
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
                    {editingTemplate ? "Cập nhật" : "Tạo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && previewTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Preview: {previewTemplate.name}</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
              <div className="border rounded p-4 bg-gray-50">
                <div className="whitespace-pre-wrap text-sm font-mono">
                  {previewTemplate.htmlTemplate}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

