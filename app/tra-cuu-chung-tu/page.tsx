"use client"

import { DetailHeader } from "@/components/detail-header"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { ProtectedView } from "@/components/protected-view"
import { getTransactions } from "@/lib/admin-service"
import { downloadPdf, previewPdf } from "@/lib/pdf-service"

interface TransactionResult {
  id: string
  mst: string
  taxpayerName: string
  amount: number
  paymentDate: any
  status: string
  templateId?: string
}

export default function TraCuuChungTuPage() {
  const [referenceCode, setReferenceCode] = useState("")
  const [fromDate, setFromDate] = useState("10/10/2025")
  const [toDate, setToDate] = useState("10/10/2025")
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TransactionResult[]>([])
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [selectedDocument, setSelectedDocument] = useState<TransactionResult | null>(null)

  const handleSearch = async () => {
    setLoading(true)
    setSearched(true)
    try {
      const filters: any = {}
      if (referenceCode) filters.mst = referenceCode

      // Parse dates if needed
      if (fromDate) {
        const fromParts = fromDate.split("/")
        if (fromParts.length === 3) {
          filters.startDate = new Date(parseInt(fromParts[2]), parseInt(fromParts[1]) - 1, parseInt(fromParts[0]))
        }
      }
      if (toDate) {
        const toParts = toDate.split("/")
        if (toParts.length === 3) {
          filters.endDate = new Date(parseInt(toParts[2]), parseInt(toParts[1]) - 1, parseInt(toParts[0]))
        }
      }

      const data = await getTransactions(filters)
      setResults(data.transactions || [])
    } catch (error) {
      console.error("Error searching transactions:", error)
      alert("Lỗi khi tra cứu: " + (error as Error).message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handlePrintClick = (doc: TransactionResult) => {
    setSelectedDocument(doc)
    setShowPrintModal(true)
  }

  const handleConfirmPrint = async () => {
    if (!selectedDocument) return

    setShowPrintModal(false)
    setLoading(true)

    try {
      // Preview PDF
      const url = await previewPdf(selectedDocument.mst, selectedDocument.templateId)
      setPreviewUrl(url)
      setShowPdfViewer(true)
    } catch (error) {
      console.error("Error previewing PDF:", error)
      alert("Lỗi khi tải PDF: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!selectedDocument) return

    try {
      await downloadPdf(selectedDocument.mst, selectedDocument.templateId)
    } catch (error) {
      console.error("Error downloading PDF:", error)
      alert("Lỗi khi tải PDF: " + (error as Error).message)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
  }

  const formatDate = (date: any) => {
    if (!date) return "-"
    if (date.toDate) {
      const d = date.toDate()
      const day = String(d.getDate()).padStart(2, '0')
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const year = d.getFullYear()
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    }
    if (date instanceof Date) {
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      const seconds = String(date.getSeconds()).padStart(2, '0')
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    }
    return "-"
  }

  return (
    <ProtectedView>
      <div className="h-full bg-gray-800 flex flex-col">
        <DetailHeader title="Tra cứu chứng từ" />

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="px-4 py-6 space-y-6">
            {/* Reference Code */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Mã tham chiếu</label>
              <input
                type="text"
                placeholder="Nhập mã tham chiếu"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 placeholder-gray-400"
              />
            </div>

            {/* From Date */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Từ ngày <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-700 pointer-events-none" />
              </div>
            </div>

            {/* To Date */}
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Đến ngày <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-700 pointer-events-none" />
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-full transition-colors"
            >
              Tra cứu
            </button>

            {/* Loading */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            )}

            {/* No Data Message */}
            {searched && !loading && results.length === 0 && (
              <div className="text-center py-8">
                <p className="text-red-600 font-medium">Không tìm thấy dữ liệu</p>
              </div>
            )}

            {/* Results Table */}
            {searched && !loading && results.length > 0 && (
              <div className="space-y-4">
                <table className="w-full border-collapse" style={{ fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif" }}>
                  <thead>
                    <tr>
                      <th className="w-[25%] text-left font-semibold text-[14px] border border-[#d9d9d9] bg-[#f5f5f5] text-[#333333]" style={{ fontWeight: 600, letterSpacing: '0.2px', padding: '8px 12px' }}>
                        Mã tham chiếu
                      </th>
                      <th className="w-[15%] text-right font-semibold text-[14px] border border-[#d9d9d9] bg-[#f5f5f5] text-[#333333]" style={{ fontWeight: 600, letterSpacing: '0.2px', padding: '8px 12px' }}>
                        Số tiền
                      </th>
                      <th className="w-[20%] text-center font-semibold text-[14px] border border-[#d9d9d9] bg-[#f5f5f5] text-[#333333]" style={{ fontWeight: 600, letterSpacing: '0.2px', padding: '8px 12px' }}>
                        Ngày nộp
                      </th>
                      <th className="w-[30%] text-left font-semibold text-[14px] border border-[#d9d9d9] bg-[#f5f5f5] text-[#333333]" style={{ fontWeight: 600, letterSpacing: '0.2px', padding: '8px 12px' }}>
                        Trạng thái
                      </th>
                      <th className="w-[10%] text-center font-semibold text-[14px] border border-[#d9d9d9] bg-[#f5f5f5] text-[#333333]" style={{ fontWeight: 600, letterSpacing: '0.2px', padding: '8px 12px' }}>
                        In chứng từ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => {
                      const mstStr = result.mst || result.id
                      return (
                        <tr key={result.id} className="hover:bg-[#f0f8ff] transition-colors duration-200" style={{ minHeight: '40px' }}>
                          {/* Cột 1: Mã tham chiếu - 3 dòng */}
                          <td className="text-left text-[14px] border border-[#d9d9d9] bg-white text-black align-middle" style={{ 
                            padding: '8px 12px', 
                            whiteSpace: 'normal', 
                            lineHeight: '1.4', 
                            wordBreak: 'break-word',
                            letterSpacing: '0.2px',
                            fontWeight: 400
                          }}>
                            {mstStr.length > 11 ? (
                              <>
                                {mstStr.slice(0, 6)}
                                <br />
                                {mstStr.slice(6, 11)}
                                <br />
                                {mstStr.slice(11)}
                              </>
                            ) : mstStr}
                          </td>
                          
                          {/* Cột 2: Số tiền - căn phải */}
                          <td className="text-right text-[14px] border border-[#d9d9d9] bg-white text-black align-middle" style={{ 
                            padding: '8px 12px',
                            letterSpacing: '0.2px',
                            fontWeight: 400
                          }}>
                            {formatCurrency(result.amount || 0)}
                          </td>
                          
                          {/* Cột 3: Ngày nộp - căn giữa */}
                          <td className="text-center text-[14px] border border-[#d9d9d9] bg-white text-black align-middle" style={{ 
                            padding: '8px 12px',
                            letterSpacing: '0.2px',
                            fontWeight: 400
                          }}>
                            {formatDate(result.paymentDate)}
                          </td>
                          
                          {/* Cột 4: Trạng thái - wrap tự động */}
                          <td className="text-left text-[14px] border border-[#d9d9d9] bg-white text-black align-middle" style={{ 
                            padding: '8px 12px', 
                            whiteSpace: 'normal', 
                            lineHeight: '1.4', 
                            wordBreak: 'break-word',
                            letterSpacing: '0.2px',
                            fontWeight: 400
                          }}>
                            {result.status === 'completed' ? 'Thành công - NH/TGTT đã trừ tiền thành công' : result.status}
                          </td>
                          
                          {/* Cột 5: In chứng từ - Radio button */}
                          <td className="text-center border border-[#d9d9d9] bg-white align-middle" style={{ padding: '8px 12px' }}>
                            <button
                              onClick={() => handlePrintClick(result)}
                              className="inline-flex items-center justify-center w-4 h-4 rounded-full border-2 border-[#e60000] hover:opacity-80 transition-opacity"
                              style={{ 
                                width: '16px', 
                                height: '16px',
                                border: '2px solid #e60000',
                                borderRadius: '50%',
                                position: 'relative'
                              }}
                            >
                              <span 
                                className="absolute rounded-full"
                                style={{
                                  top: '3px',
                                  left: '3px',
                                  width: '8px',
                                  height: '8px',
                                  backgroundColor: '#e60000',
                                  borderRadius: '50%'
                                }}
                              />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPrintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="w-full bg-white rounded-t-2xl p-6 space-y-4 animate-slide-up">
            <h3 className="text-lg font-semibold text-gray-800">Xác nhận in chứng từ</h3>
            <p className="text-gray-600">Bạn có muốn in chứng từ này không?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPrintModal(false)}
                className="flex-1 px-4 py-3 border-2 border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleConfirmPrint}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {showPdfViewer && previewUrl && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* PDF Header */}
          <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-b border-gray-300">
            <div className="flex-1 text-center">
              <p className="text-gray-800 font-semibold text-sm truncate">{selectedDocument?.mst || selectedDocument?.id}</p>
            </div>
            <button 
              onClick={() => {
                setShowPdfViewer(false)
                URL.revokeObjectURL(previewUrl)
                setPreviewUrl("")
              }} 
              className="text-blue-600 font-medium text-sm"
            >
              Done
            </button>
          </div>

          {/* PDF Content Area - iframe */}
          <div className="flex-1 overflow-hidden bg-gray-200">
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title="PDF Preview"
            />
          </div>

          {/* PDF Footer */}
          <div className="bg-gray-100 px-4 py-3 flex items-center justify-between border-t border-gray-300">
            <button
              onClick={handleDownload}
              className="text-gray-600 hover:text-gray-800"
              title="Download PDF"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </ProtectedView>
  )
}
