## 10. Checklists theo tình huống

### A) Thêm tính năng nhỏ (UI/API)
- [ ] Nêu rõ đầu vào/đầu ra, ràng buộc.
- [ ] Dùng Edit nếu 1-2 file, Composer nếu sinh mới nhiều file.
- [ ] Chạy linter/test.
- [ ] Tự review + nhờ AI review diff.

### B) Sửa bug
- [ ] Mô tả reproduce steps.
- [ ] Dán stack trace/log.
- [ ] Hỏi AI nguyên nhân gốc, đề xuất fix tối thiểu.
- [ ] Thêm test tái hiện bug.

### C) Refactor lớn
- [ ] Tạo branch riêng.
- [ ] Viết plan ngắn, cut scope theo module.
- [ ] Composer scaffold (nếu cần), di chuyển từng phần.
- [ ] Benchmark/tracking hiệu năng.

🔴 NGUY HIỂM: Migration DB, đổi schema public API → cần approval.
