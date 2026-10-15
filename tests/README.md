# ChiNex Tests & Execution Logs

Thư mục này chứa các công cụ chạy test và lưu trữ toàn bộ lịch sử các lần chạy test của hệ thống API.

---

## 📁 Cấu Trúc Thư Mục

- **[latest-test-run.log](file:///d:/Learn/chinese-vocab/tests/latest-test-run.log)**: Kết quả chi tiết lần chạy test gần nhất (được cập nhật tự động sau mỗi lần chạy).
- **[test-summary.md](file:///d:/Learn/chinese-vocab/tests/test-summary.md)**: Bảng tóm tắt kết quả PASS/FAIL các test suites và danh sách các test case.
- **[run-tests.mjs](file:///d:/Learn/chinese-vocab/tests/run-tests.mjs)**: Test runner tự động chạy tests và lưu log (Node.js).
- **[run-tests.ps1](file:///d:/Learn/chinese-vocab/tests/run-tests.ps1)**: Test runner PowerShell cho môi trường Windows.
- **`history/`**: Thư mục lưu vết lịch sử mọi lần chạy test theo từng mốc thời gian (`test-run-YYYY-MM-DD_HH-mm-ss.log`).

---

## 🚀 Cách Chạy Test Tự Động & Ghi Log

Bạn có thể chạy kiểm thử bằng bất kỳ cách nào dưới đây:

### Cách 1: Sử dụng pnpm / npm (từ thư mục gốc)
```bash
pnpm test
```
hoặc
```bash
npm run test
```

### Cách 2: Sử dụng Node.js runner trực tiếp
```bash
node tests/run-tests.mjs
```

### Cách 3: Sử dụng PowerShell
```powershell
.\tests\run-tests.ps1
```
