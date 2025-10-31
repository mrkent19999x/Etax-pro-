## 3. Workflow AI hiệu quả

### Quy trình 4 bước
1) **Nêu mục tiêu rõ**: Kết quả mong muốn, ràng buộc (lint, type, performance).
2) **Cung cấp ngữ cảnh**: File liên quan, môi trường, version.
3) **Yêu cầu hành động**: Tạo/sửa file nào, tiêu chí nghiệm thu.
4) **Kiểm tra & lặp**: Chạy linter/test, review diff.

### Ví dụ thực tế
- “Tạo endpoint GET /users với pagination, thêm test, tuân thủ ESLint. Inputs A/B/C. Performance O(n).”

### Quản trị rủi ro
- 🟡 CẨN THẬN: Tách branch riêng trước khi đổi lớn.
- 🔴 NGUY HIỂM: Không cho AI động vào migration/prod secrets khi chưa review.
- 🔵 AN TOÀN: Cho AI sửa docs, comments, minor refactor.
