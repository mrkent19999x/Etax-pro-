# Phân tích Prompt cho Qwen3-VL

## 🔴 VẤN ĐỀ PHÁT HIỆN

### Vấn đề chính:
Prompt hiện tại có thể khiến Qwen3-VL hiểu nhầm rằng:
- Video là một **web app có thể tương tác** → Qwen3 nghĩ có thể "click vào button"
- Các hành động trong video là **user interactions với web app** → Qwen3 báo lỗi vì không tìm thấy button

### Nguyên nhân:
1. **Prompt không làm rõ**: Đây là **video demonstration** chứ KHÔNG phải interactive app
2. **Từ ngữ gây nhầm lẫn**: 
   - "click" → Qwen3 nghĩ là click thật vào web
   - "navigate" → Qwen3 nghĩ là điều hướng trong app
   - Thiếu cụm từ "quan sát video", "trong video"

## ✅ PROMPT CẢI THIỆN (Đề xuất)

```markdown
# PROMPT CHO QWEN3-VL - PHÂN TÍCH VIDEO UX AUDIT

**QUAN TRỌNG**: Đây là VIDEO RECORDING/DEMONSTRATION của một ứng dụng mobile. 
Bạn đang QUAN SÁT video, KHÔNG phải tương tác với web app thật.

## MỤC TIÊU
Phân tích video demo eTax Mobile để tạo báo cáo UX audit end-to-end.

## QUY TẮC
1. **CHỈ QUAN SÁT**: Bạn đang xem video, không thể click/tương tác với UI
2. **Ghi nhận thay đổi**: Khi thấy UI thay đổi trong video, đó là kết quả của người dùng trong video đã tương tác
3. **Suy luận từ khung hình**: Nếu không thấy cursor, suy luận dựa trên:
   - Thay đổi màn hình (chuyển trang)
   - Xuất hiện modal/dialog
   - Cập nhật bảng dữ liệu
   - Text input được điền
4. **Đánh dấu certainty**:
   - `confirmed`: Thấy rõ trong video (cursor, click animation, text thay đổi)
   - `inferred`: Suy luận từ thay đổi UI, không thấy hành động trực tiếp

## YÊU CẦU ĐẦU RA

### A) TIMELINE TƯƠNG TÁC
Ghi nhận các **sự kiện quan sát được trong video**:
- Timestamp [mm:ss]
- **Loại sự kiện QUAN SÁT**: click_observed | scroll_observed | navigation_observed
- **Target**: Text/icon thấy trong video
- **Selector suy luận**: Dựa trên vị trí/văn bản
- **Kết quả QUAN SÁT**: Màn hình mới xuất hiện | Modal mở | Bảng cập nhật
- **Bằng chứng**: Timestamp khung hình chứng minh

### B) BẢN ĐỒ ĐIỀU HƯỚNG
Vẽ flowchart mermaid thể hiện:
- Các màn hình xuất hiện trong video
- Cạnh điều hướng (từ màn hình A → B khi nào quan sát được)

### C) CÂY THÀNH PHẦN UI
Liệt kê theo từng màn hình QUAN SÁT ĐƯỢC trong video:
- Header, Nav, Main, Footer
- Các component con (buttons, inputs, cards)

### D) HÀNH VI JS SUY LUẬN
Mô tả hành vi **QUAN SÁT ĐƯỢC** (không phải code thật):
- Event → UI Reaction
- Ví dụ: "Click button 'Tra cứu' → Bảng kết quả xuất hiện sau 1 giây"

### E) RESPONSIVE
Chỉ ghi nhận những thay đổi **THẬT SỰ THẤY** trong video:
- Breakpoint ước lượng từ kích thước màn hình
- Layout changes quan sát được

### F) DANH MỤC NÚT/ĐIỀU KHIỂN
Liệt kê các controls **THẤY TRONG VIDEO**:
- Role, text, state (enabled/disabled)

### G) KIỂM THỬ
Tạo test cases dựa trên **luồng quan sát được trong video**

### H) VẤN ĐỀ & ĐỀ XUẤT
**CHỈ GHI NHẬN**:
- Bugs thấy trong video (lỗi hiển thị, crash)
- UX issues quan sát được (màn hình trống, text bị cắt)
- **KHÔNG suy đoán** code/A11y nếu không thấy bằng chứng trong video

## CẤU TRÚC JSON OUTPUT

```json
{
  "meta": {
    "video_source": "demonstration_recording",
    "analysis_mode": "observational",
    "disclaimer": "All events are OBSERVED from video, not interactive testing"
  },
  "events": [{
    "t": "00:05.40",
    "type": "click_observed",  // QUAN SÁT được click trong video
    "target": {
      "text": "Đăng nhập",  // Text thấy trong video
      "selector_guess": "button.login"
    },
    "effect_observed": "navigation: new screen appears",  // Kết quả THẤY được
    "evidence": ["00:05.40", "00:06.20"],
    "certainty": "confirmed|inferred"
  }]
}
```

## LƯU Ý QUAN TRỌNG
- ❌ KHÔNG cố gắng "click vào button" trong video
- ❌ KHÔNG báo lỗi "không tìm thấy button" 
- ✅ CHỈ quan sát và ghi nhận những gì THẤY trong video
- ✅ Phân biệt rõ: "quan sát thấy X" vs "suy luận X từ thay đổi Y"
```

## 📊 SO SÁNH: Prompt cũ vs Prompt mới

| Khía cạnh | Prompt cũ | Prompt mới (đề xuất) |
|-----------|-----------|----------------------|
| **Clarification** | Không rõ đây là video | ✅ Nhấn mạnh: "Đây là VIDEO, không phải web app" |
| **Actions** | "click", "navigate" (gây nhầm) | ✅ "click_observed", "navigation_observed" |
| **Error handling** | Có thể báo lỗi "không tìm thấy" | ✅ Hướng dẫn: chỉ quan sát, không tương tác |
| **Certainty** | Có nhưng chưa rõ ràng | ✅ Phân biệt rõ: confirmed vs inferred |
| **Disclaimer** | Thiếu | ✅ Có disclaimer rõ ràng |

## 🎯 KHUYẾN NGHỊ

1. **Thêm disclaimer ngay đầu prompt**: "Đây là video demo, chỉ quan sát"
2. **Thay đổi từ ngữ**: 
   - "click" → "click_observed" hoặc "quan sát thấy click"
   - "navigate" → "màn hình chuyển sang" hoặc "navigation_observed"
3. **Thêm ví dụ cụ thể**: Cho Qwen3 biết cách phân biệt "quan sát" vs "suy luận"
4. **JSON schema**: Thêm field `analysis_mode: "observational"` để Qwen3 biết context
