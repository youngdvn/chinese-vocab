# ChiNex: Phân tích Codebase & Kế hoạch Chi tiết Triển khai

Tài liệu phân tích hiện trạng toàn bộ dự án, so khớp giữa giao diện (`apps/ui`) và backend (`apps/api`), kèm theo danh mục các đầu việc cần làm (kèm checkbox).

---

## 1. Phân tích Hiện trạng Codebase

### 1.1 Cấu trúc Monorepo
- **TurboRepo + pnpm**:
  - `apps/ui`: Next.js 16.3.3 (App Router), React 19, Tailwind CSS v4, `@workspace/ui` (Radix UI).
  - `apps/api`: Go 1.26 (Standard Library `net/http` với cú pháp routing của Go 1.22+, `pgxpool` kết nối PostgreSQL Neon, `golang-jwt/jwt/v5`).
  - `packages/`: `eslint-config`, `typescript-config`, `ui`.

### 1.2 Những điểm đang thiếu hụt & Vấn đề tồn tại
1. **Lỗi biên dịch Backend (`go vet` thất bại)**:
   - Các file trong `apps/api/internal/modules/review/` và `apps/api/internal/modules/user/` hiện tại là file rỗng (0 bytes), làm cho Go compiler báo lỗi `expected 'package', found 'EOF'`.
2. **Thiếu Auth Middleware**:
   - Backend đã có sinh JWT trong Cookie `access_token` khi login, nhưng chưa có Middleware giải mã token để bảo vệ các routes.
   - Các API từ vựng (`vocabulary`) hiện tại đang nhận `user_id` trực tiếp qua query params (`?user_id=...`) hoặc request body, không an toàn và thiếu kiểm tra quyền sở hữu bản ghi.
3. **Thiếu API Đăng xuất (`logout`) và Lấy thông tin user hiện tại (`me`)**:
   - Giao diện người dùng có nút Logout nhưng chỉ log console và chuyển trang mà chưa xoá Cookie phiên đăng nhập.
4. **Mô hình Dữ liệu Từ vựng chưa đồng bộ với UI**:
   - UI hiển thị và lọc theo `status` (`new` / `learning`), nhưng bảng `vocabularies` trong database hiện tại chưa có trường `status`.
5. **Giao diện người dùng (`apps/ui`) đang dùng Mock Data**:
   - `features/vocabulary`: Đang lọc dữ liệu từ `@/constant/data`. Modal thêm từ (`add-vocabulary-form.tsx`) mới chỉ `console.log`.
   - `features/home`: Dashboard tổng quan, Daily Progress, Tiếp tục học đều dùng dữ liệu tĩnh `dailyVocab` và `overviewData`.
   - `practice/page.tsx`: Flashcard ôn tập từ vựng hoàn toàn là nội dung cứng ("学习", "xuéxí", "Học tập").
6. **Mô đun Ôn tập (Spaced Repetition System - SRS)**:
   - Đã có bảng `reviews` (lưu `rating` 1..4, `next_review_at`), nhưng toàn bộ logic tính toán khoảng cách ôn tập (SRS algorithm) và API lấy danh sách ôn tập chưa được hiện thực.

---

## 2. Kế hoạch Chi tiết Triển khai (Checklist)

### Giai đoạn 1: Sửa lỗi biên dịch, Hoàn thiện Auth & Middleware Bảo mật
- [ ] Dọn dẹp/khởi tạo code cơ bản cho các package rỗng (`review`, `user`) để `go build` và `go vet` chạy thành công.
- [ ] Thêm hàm `Validate(tokenStr string) (int64, error)` vào `internal/modules/auth/token.go`.
- [ ] Viết middleware xác thực `internal/middleware/auth.go` (đọc `access_token` từ Cookie hoặc Bearer token, gán `userID` vào `context`).
- [ ] Viết API `POST /api/auth/logout` (xoá cookie).
- [ ] Viết API `GET /api/auth/me` (trả về ID, email, tên của người dùng đang đăng nhập).
- [ ] Đăng ký route và kiểm thử nhóm Auth.

### Giai đoạn 2: Cập nhật Database Schema & Nâng cấp Module Vocabulary
- [ ] Tạo file migration `000004_add_status_and_user_settings.up.sql` & `.down.sql`:
  - [ ] Bổ sung cột `status` (`new`, `learning`, `mastered`) vào bảng `vocabularies`.
  - [ ] Thêm index tối ưu hóa truy vấn `(user_id, status)` và `(user_id, created_at)`.
  - [ ] Thêm cột `daily_goal` (mặc định 20) vào bảng `users`.
- [ ] Chạy migration lên cơ sở dữ liệu Neon PostgreSQL.
- [ ] Cập nhật `internal/modules/vocabulary`:
  - [ ] Model: Bổ sung trường `Status` vào struct `Vocabulary`, `CreateVocabularyRequest`, `UpdateVocabularyRequest`.
  - [ ] Repository & Handler: Đổi sang lấy `user_id` từ Context (thay vì query params).
  - [ ] Thêm tính năng phân trang (`page`, `limit`), tìm kiếm (`search`), bộ lọc trạng thái (`status`), bộ lọc ngày (`date`).
  - [ ] Bổ sung kiểm tra quyền sở hữu (`user_id = $2`) khi `Update`, `FindByID`, và `Delete`.
  - [ ] Thêm API `GET /api/v1/vocabularies/export` (xuất JSON danh sách từ vựng).
- [ ] Đăng ký middleware auth cho các routes vocabulary.

### Giai đoạn 3: Triển khai Module Ôn tập & Thuật toán SRS (Review / Practice)
- [ ] Thiết kế logic thuật toán Spaced Repetition (SRS):
  - [ ] Tính toán ngày ôn tập tiếp theo (`next_review_at`) dựa trên đánh giá:
    - `Hard` (Rating 1): Khoảng cách 1 ngày, giữ trạng thái `learning`.
    - `Good` (Rating 2): Tăng khoảng cách (ví dụ 3 ngày -> 7 ngày), chuyển từ `new` sang `learning`.
    - `Easy` (Rating 3): Tăng khoảng cách nhanh hơn (ví dụ 4 ngày -> 14 ngày), chuyển sang `learning` hoặc `mastered` nếu lặp lại nhiều lần.
- [ ] Hiện thực `internal/modules/review/model.go`: Định nghĩa struct thẻ cần ôn tập, request đánh giá ôn tập.
- [ ] Hiện thực `internal/modules/review/repository.go`:
  - [ ] Query lấy các từ vựng cần ôn tập hôm nay: `next_review_at <= NOW()` hoặc `status = 'new'`.
  - [ ] Insert bản ghi ôn tập vào bảng `reviews`.
  - [ ] Update trạng thái và thời gian ôn tập tiếp theo của từ vựng.
- [ ] Hiện thực `internal/modules/review/service.go`: Xử lý business logic thuật toán SRS.
- [ ] Hiện thực `internal/modules/review/handler.go`:
  - [ ] `GET /api/v1/reviews/practice`: Lấy danh sách flashcards cần học hôm nay.
  - [ ] `POST /api/v1/reviews`: Nhận đánh giá flashcard, cập nhật tiến độ.
- [ ] Đăng ký routes ôn tập vào `cmd/server/main.go`.

### Giai đoạn 4: Triển khai Module Dashboard & Thống kê
- [ ] Tạo module dashboard hoặc mở rộng trong review/vocabulary:
  - [ ] `GET /api/v1/dashboard/overview`: Thống kê tổng số từ, số từ mới, số từ đang học, số từ tạo trong tuần này.
  - [ ] `GET /api/v1/dashboard/daily-progress`: Thống kê tiến độ học hôm nay so với `daily_goal` và danh sách từ vựng hôm nay.

### Giai đoạn 5: Triển khai Module Cài đặt Người dùng (User Settings)
- [ ] Hiện thực `internal/modules/user`:
  - [ ] `GET /api/v1/users/settings`: Lấy thông tin cấu hình (`daily_goal`, tên, email).
  - [ ] `PATCH /api/v1/users/settings`: Cập nhật `daily_goal` và thông tin cá nhân.
- [ ] Đăng ký routes user vào `cmd/server/main.go`.

### Giai đoạn 6: Tích hợp Frontend (`apps/ui`) với API Backend
- [ ] Hoàn thiện Service layer trong `apps/ui/services/`:
  - [ ] `vocabulary.service.ts`: Các hàm CRUD từ vựng, pagination, search, filter.
  - [ ] `review.service.ts`: Lấy danh sách ôn tập, gửi kết quả đánh giá thẻ.
  - [ ] `dashboard.service.ts`: Lấy thống kê tổng quan và tiến độ hàng ngày.
  - [ ] `user.service.ts`: Cập nhật cấu hình người dùng.
- [ ] Nối API vào Giao diện:
  - [ ] Trang Từ vựng (`/vocabulary`): Thay thế mock data bằng dữ liệu thực tế từ backend; kết nối form thêm từ vựng, xóa/sửa từ.
  - [ ] Trang Ôn tập (`/practice`): Hiển thị thẻ từ vựng thật từ backend, gửi đánh giá thẻ khi bấm Hard/Good/Easy, chuyển thẻ tiếp theo.
  - [ ] Trang Chủ (`/`): Hiển thị thống kê thực tế, thanh tiến độ daily progress thực tế.
  - [ ] Header & Sidebar: Nối nút Đăng xuất (`logout`) gọi API và chuyển hướng.
  - [ ] Trang Cài đặt (`/setting`): Kết nối thay đổi Daily Goal và Export từ vựng.
