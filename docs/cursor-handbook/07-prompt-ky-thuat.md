## 7. Prompt kỹ thuật (mẫu chuẩn)

### Mẫu chung
- **Bối cảnh**: Tech stack, mục tiêu business ngắn.
- **Ràng buộc**: Lint, type, performance, security.
- **Đầu vào**: API hiện có, schema, ví dụ.
- **Đầu ra**: File cần tạo/sửa, tiêu chí nghiệm thu.

### Ví dụ
“Bạn là senior dev. Hãy thêm middleware auth JWT cho `routes/user.ts`: 
- Yêu cầu: validate exp, role-based, stateless. 
- Tuân thủ ESLint, không disable rule. 
- Thêm unit test Jest. 
- Không thay đổi public API.
- Chỉ sửa file liên quan, giữ format hiện có.”

🔵 AN TOÀN: Rõ ràng giúp kết quả ổn định, ít phải sửa.
