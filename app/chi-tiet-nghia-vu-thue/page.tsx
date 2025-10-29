"use client"

import { DetailHeader } from "@/components/detail-header"
import { useBodyLock } from "@/hooks/use-body-lock"

// Mock data for obligation details
const obligationDetails = {
  paymentOrder: "1",
  accountId: "04057451314300001",
  decisionNumber: "857",
  decisionDate: "19/05/2025",
  taxAuthority: "Phương Cao Xanh - Thuế cơ số 1 tính Quảng Ninh",
  chapter: "857",
  taxPeriod: "00/CN/2025",
  item: "Thu từ đặt ở tại đô thị (1602)",
  administrativeArea: "Phương Cao Xanh (06658)",
  deadline: "31/10/2025",
  amount: "9,600 VND",
  amountPaid: "9,600 VND",
  obligationType: "Còn phải nộp",
  referenceNumber: "",
  status: "Các khoản phải nộp",
}

export default function ChiTietNghiaVuThuePage() {
  useBodyLock(true)

  return (
    <div className="h-full bg-gray-100 flex flex-col">
      <DetailHeader title="Chi tiết nghĩa vụ thuế" />

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="mx-4 mt-6 bg-white rounded-lg p-6 shadow-sm space-y-4">
          <DetailRow label="Thứ tự thanh toán" value={obligationDetails.paymentOrder} />
          <DetailRow label="ID khoản phải nộp" value={obligationDetails.accountId} />
          <DetailRow label="Số quyết định/Số thông báo" value={obligationDetails.decisionNumber} />
          <DetailRow label="Ngày quyết định/Ngày thông báo" value={obligationDetails.decisionDate} />
          <DetailRow label="Tên cơ quan thu" value={obligationDetails.taxAuthority} />
          <DetailRow label="Chương" value={obligationDetails.chapter} />
          <DetailRow label="Kỳ thuế" value={obligationDetails.taxPeriod} />
          <DetailRow label="Tiêu mục" value={obligationDetails.item} />
          <DetailRow label="Địa bản hành chính" value={obligationDetails.administrativeArea} />
          <DetailRow label="Hạn nộp" value={obligationDetails.deadline} />
          <DetailRow label="Số tiền" value={obligationDetails.amount} />
          <DetailRow label="Số tiền đã nộp" value={obligationDetails.amountPaid} />
          <DetailRow label="Loại nghĩa vụ" value={obligationDetails.obligationType} />
          <DetailRow label="Số tham chiếu" value={obligationDetails.referenceNumber || "—"} />
          <DetailRow label="Trạng thái" value={obligationDetails.status} />
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0">
      <p className="text-gray-600 text-sm font-medium">{label}</p>
      <p className="text-gray-800 font-semibold text-sm text-right">{value}</p>
    </div>
  )
}
