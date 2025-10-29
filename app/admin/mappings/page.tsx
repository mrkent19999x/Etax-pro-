"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { useRequireAdmin } from "@/hooks/use-admin-auth"
import { Download, Upload, Eye, Save } from "lucide-react"

interface FieldMapping {
  label: string
  required: boolean
  visible: boolean
  format?: "text" | "currency" | "datetime" | "number"
}

interface MappingConfig {
  templateId: string
  fields: { [fieldName: string]: FieldMapping }
}

// Danh sách tất cả fields có thể mapping (từ UserData và Transaction)
const AVAILABLE_FIELDS = [
  // Transaction fields
  { key: "referenceCode", label: "Mã tham chiếu", category: "Transaction" },
  { key: "taxpayerName", label: "Người nộp thuế", category: "Transaction" },
  { key: "taxpayerAddress", label: "Địa chỉ", category: "Transaction" },
  { key: "amount", label: "Số tiền", category: "Transaction" },
  { key: "paymentDate", label: "Ngày nộp", category: "Transaction" },
  { key: "status", label: "Trạng thái", category: "Transaction" },
  { key: "formNumber", label: "Số form", category: "Transaction" },
  { key: "bankName", label: "Ngân hàng", category: "Transaction" },
  { key: "kbnnBranch", label: "Chi nhánh KBNN", category: "Transaction" },
  { key: "agencyName", label: "Cơ quan thuế", category: "Transaction" },
  // Details fields (array)
  { key: "details", label: "Bảng chi tiết", category: "Transaction", isArray: true },
  // Signature fields
  { key: "signatures", label: "Chữ ký", category: "Transaction", isObject: true },
]

export default function AdminMappingsPage() {
  const { isAdmin, isLoading } = useRequireAdmin()
  const [templates, setTemplates] = useState<any[]>([])
  const [selectedTemplateId, setSelectedTemplateId] = useState("")
  const [mapping, setMapping] = useState<MappingConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

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
      alert("Lỗi khi tải danh sách templates")
    } finally {
      setLoading(false)
    }
  }

  const loadMapping = async (templateId: string) => {
    try {
      setLoading(true)
      const { getMapping } = await import("@/lib/admin-service")
      const data = await getMapping(templateId)
      setMapping(data)
    } catch (error) {
      console.error("Error loading mapping:", error)
      // Nếu chưa có mapping, tạo mới
      setMapping({
        templateId,
        fields: {}
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedTemplateId) {
      loadMapping(selectedTemplateId)
    } else {
      setMapping(null)
    }
  }, [selectedTemplateId])

  const handleFieldChange = (fieldKey: string, property: keyof FieldMapping, value: any) => {
    if (!mapping) return

    const updatedFields = { ...mapping.fields }
    if (!updatedFields[fieldKey]) {
      updatedFields[fieldKey] = {
        label: AVAILABLE_FIELDS.find(f => f.key === fieldKey)?.label || fieldKey,
        required: false,
        visible: false
      }
    }
    updatedFields[fieldKey] = {
      ...updatedFields[fieldKey],
      [property]: value
    }

    setMapping({
      ...mapping,
      fields: updatedFields
    })
  }

  const handleSave = async () => {
    if (!mapping || !selectedTemplateId) return

    try {
      setSaving(true)
      const { updateMapping } = await import("@/lib/admin-service")
      await updateMapping(selectedTemplateId, mapping.fields)
      alert("Lưu mapping thành công!")
      loadMapping(selectedTemplateId)
    } catch (error) {
      console.error("Error saving mapping:", error)
      alert("Lỗi khi lưu mapping: " + (error as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const handleExport = () => {
    if (!mapping) return

    const dataStr = JSON.stringify(mapping, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `mapping_${selectedTemplateId}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string)
        if (imported.fields && selectedTemplateId) {
          setMapping({
            templateId: selectedTemplateId,
            fields: imported.fields
          })
          alert("Import mapping thành công!")
        }
      } catch (error) {
        alert("Lỗi khi đọc file JSON: " + (error as Error).message)
      }
    }
    reader.readAsText(file)
  }

  const handlePreview = async () => {
    if (!selectedTemplateId) {
      alert("Vui lòng chọn template trước")
      return
    }

    try {
      // Sẽ gọi API preview sau khi có generatePdf
      setShowPreview(true)
    } catch (error) {
      console.error("Error preview:", error)
      alert("Lỗi khi preview PDF")
    }
  }

  if (isLoading && loading) {
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

  const fieldsByCategory = AVAILABLE_FIELDS.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = []
    acc[field.category].push(field)
    return acc
  }, {} as Record<string, typeof AVAILABLE_FIELDS>)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quản lý Mapping Field</h2>
            <p className="text-gray-600 mt-1">Ánh xạ dữ liệu vào PDF template</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePreview}
              disabled={!selectedTemplateId}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Eye size={20} />
              Preview PDF
            </button>
          </div>
        </div>

        {/* Select Template */}
        <div className="bg-white rounded-lg shadow p-4">
          <label className="block text-sm font-medium mb-2">Chọn Template</label>
          <select
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value="">-- Chọn template --</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} {template.isDefault && "(Mặc định)"}
              </option>
            ))}
          </select>
        </div>

        {/* Mapping Form */}
        {selectedTemplateId && mapping && (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Field Mapping</h3>
                <div className="flex gap-2">
                  <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                    <Upload size={18} />
                    Import JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Download size={18} />
                    Export JSON
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? "Đang lưu..." : "Lưu Mapping"}
                  </button>
                </div>
              </div>

              {/* Mapping Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Label hiển thị</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Visible</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Required</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Format</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {Object.entries(fieldsByCategory).map(([category, fields]) => (
                      <>
                        <tr key={category} className="bg-gray-100">
                          <td colSpan={5} className="px-4 py-2 font-semibold text-gray-700">
                            {category}
                          </td>
                        </tr>
                        {fields.map((field) => {
                          const fieldMapping = mapping.fields[field.key] || {
                            label: field.label,
                            required: false,
                            visible: false
                          }
                          return (
                            <tr key={field.key}>
                              <td className="px-4 py-3 font-mono text-sm">{field.key}</td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={fieldMapping.label}
                                  onChange={(e) => handleFieldChange(field.key, "label", e.target.value)}
                                  className="w-full px-2 py-1 border rounded text-sm"
                                  placeholder="Label hiển thị"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={fieldMapping.visible}
                                  onChange={(e) => handleFieldChange(field.key, "visible", e.target.checked)}
                                  className="w-4 h-4"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={fieldMapping.required}
                                  onChange={(e) => handleFieldChange(field.key, "required", e.target.checked)}
                                  className="w-4 h-4"
                                />
                              </td>
                              <td className="px-4 py-3">
                                {!field.isArray && !field.isObject && (
                                  <select
                                    value={fieldMapping.format || "text"}
                                    onChange={(e) => handleFieldChange(field.key, "format", e.target.value)}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                  >
                                    <option value="text">Text</option>
                                    <option value="currency">Currency</option>
                                    <option value="datetime">DateTime</option>
                                    <option value="number">Number</option>
                                  </select>
                                )}
                                {(field.isArray || field.isObject) && (
                                  <span className="text-xs text-gray-500">Object/Array</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {!selectedTemplateId && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            Vui lòng chọn template để bắt đầu mapping
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Preview PDF</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
              <div className="border rounded p-4 bg-gray-50">
                <p className="text-gray-600">Preview sẽ hiển thị PDF với dữ liệu mẫu</p>
                <p className="text-sm text-gray-500 mt-2">(Tính năng này sẽ được tích hợp với API generatePdf)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

