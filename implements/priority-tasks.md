# Danh Sách Task Triển Khai (Sắp Xếp Theo Độ Ưu Tiên)

> **Hướng dẫn dành cho bạn**:
> - Vui lòng đánh dấu `[x]` vào các task bạn muốn tôi triển khai (hoặc để nguyên nếu muốn làm tất cả theo lộ trình đề xuất).
> - Mỗi nhóm task được đánh số độ ưu tiên từ cao nhất (**P0**) đến các tính năng mở rộng (**P5**).

---

## 📌 BẢNG TỔNG QUAN ĐỘ ƯU TIÊN

| Độ ưu tiên | Nhóm công việc | Trạng thái hiện tại | Mức độ phụ thuộc |
| :--- | :--- | :--- | :--- |
| **P0** | **Khắc phục lỗi Build & Bảo mật Auth Middleware** | ✅ Đã hoàn thành | Không có (Phải làm trước tiên) |
| **P1** | **Database Migration & Nâng cấp API Từ Vựng (Vocab)** | ✅ Đã hoàn thành | Phụ thuộc P0 |
| **P2** | **Xây dựng API Ôn tập Spaced Repetition (Review/SRS)** | ✅ Đã hoàn thành | Phụ thuộc P0, P1 |
| **P3** | **API Dashboard & Tiến độ Hàng ngày (Daily Progress)** | ✅ Đã hoàn thành | Phụ thuộc P1, P2 |
| **P4** | **API Cài đặt Người dùng (User Settings & Profile)** | ✅ Đã hoàn thành | Phụ thuộc P0 |
| **P5** | **Tích hợp Frontend UI với Backend APIs** | ✅ Đã hoàn thành | Phụ thuộc P0 -> P4 |

---

## 📋 CHI TIẾT TỪNG TASK THEO ĐỘ ƯU TIÊN

### 🔴 P0 - Nền tảng, Khắc phục lỗi Build & Bảo mật Auth Middleware (Highest Priority)
*Mục tiêu: Đảm bảo Go backend biên dịch thành công, xác thực token JWT, bảo vệ các endpoint.*

- [x] **Task 0.1**: Sửa các file rỗng 0-byte trong `internal/modules/review/` và `internal/modules/user/` (thêm package declaration) để `go build` và `go vet` chạy sạch sẽ.
- [x] **Task 0.2**: Viết hàm `Validate(tokenStr string) (int64, error)` trong `apps/api/internal/modules/auth/token.go` để giải mã và kiểm tra hạn của JWT token.
- [x] **Task 0.3**: Xây dựng Middleware xác thực `apps/api/internal/middleware/auth.go`:
  - Trích xuất token từ Cookie `access_token` hoặc Header `Authorization: Bearer <token>`.
  - Đưa `user_id` vào Request Context.
  - Xử lý trả về mã lỗi 401 Unauthorized nếu không hợp lệ.
- [x] **Task 0.4**: Thêm API `POST /api/auth/logout` (xoá cookie `access_token`).
- [x] **Task 0.5**: Thêm API `GET /api/auth/me` (trả về thông tin user đăng nhập từ Context).

---

### 🟠 P1 - Cập nhật Database & Nâng cấp API Quản Lý Từ Vựng (Vocabulary)
*Mục tiêu: Đồng bộ dữ liệu với giao diện, bảo vệ quyền riêng tư theo user, hỗ trợ tìm kiếm, lọc và phân trang.*

- [x] **Task 1.1**: Tạo và áp dụng Migration `000004_add_status_and_user_settings.up.sql`:
  - Thêm cột `status` (`new`, `learning`, `mastered`) với giá trị mặc định là `'new'` vào bảng `vocabularies`.
  - Thêm Index trên `(user_id, status)` và `(user_id, created_at)`.
  - Thêm cột `daily_goal` (mặc định 20) vào bảng `users`.
  - Đã chạy thành công migration lên Neon PostgreSQL.
- [x] **Task 1.2**: Tái cấu trúc `apps/api/internal/modules/vocabulary/`:
  - Bỏ việc nhận `user_id` tự do từ query param/request body, chuyển sang lấy `user_id` an toàn từ Auth Context.
  - Bổ sung kiểm tra sở hữu khi `FindByID`, `Update`, `Delete` (người dùng này không thể xem/sửa/xóa từ vựng của người dùng khác).
- [x] **Task 1.3**: Bổ sung tính năng cho `GET /api/v1/vocabularies`:
  - Phân trang: `page` (trang số mấy) và `limit` (số lượng mỗi trang, mặc định 10).
  - Tìm kiếm (`search`): tìm tương đối theo Hán tự (`hanzi`), phiên âm (`pinyin`), nghĩa (`meaning`).
  - Lọc trạng thái (`status`): `all`, `new`, `learning`, `mastered`.
  - Lọc ngày tạo (`date`): lọc theo ngày thêm từ.
- [x] **Task 1.4**: Bổ sung API `GET /api/v1/vocabularies/export` để hỗ trợ tính năng xuất từ vựng ở trang Settings.

---

### 🟡 P2 - Xây dựng Module Ôn Tập & Spaced Repetition (Review / Practice)
*Mục tiêu: Cung cấp API phục vụ tính năng Flashcard học từ và thuật toán lặp lại ngắt quãng.*

- [x] **Task 2.1**: Thiết kế thuật toán Spaced Repetition (SRS):
  - Hỗ trợ 3 mức đánh giá trên UI (`Hard`: Rating 1, `Good`: Rating 2, `Easy`: Rating 3).
  - Tính toán khoảng thời gian ôn tập tiếp theo (`next_review_at`):
    - `Hard`: ôn lại sau 1 ngày (hoặc ngay trong phiên học).
    - `Good`: tăng khoảng cách (1 -> 3 -> 7 -> 14 ngày).
    - `Easy`: tăng khoảng cách nhanh hơn (1 -> 4 -> 10 -> 30 ngày).
- [x] **Task 2.2**: Hiện thực `internal/modules/review/model.go` & `repository.go`:
  - Truy vấn lấy danh sách từ vựng cần ôn tập: từ vựng có `next_review_at <= NOW()` hoặc từ mới `status = 'new'` (giới hạn theo mục tiêu học).
  - Ghi nhận lượt ôn tập vào bảng `reviews`.
  - Cập nhật `status` từ `'new'` sang `'learning'` khi học lần đầu.
- [x] **Task 2.3**: Hiện thực API `GET /api/v1/reviews/practice` (lấy danh sách thẻ bài cần học hôm nay và số thẻ còn lại).
- [x] **Task 2.4**: Hiện thực API `POST /api/v1/reviews` (gửi đánh giá thẻ, cập nhật hạn ôn tiếp theo).

---

### 🟢 P3 - API Dashboard Thống Kê & Tiến Độ Hàng Ngày (Dashboard Stats)
*Mục tiêu: Cung cấp dữ liệu thực tế cho trang chủ (`HeroSection`, `Overview`, `DailyProgress`).*

- [x] **Task 3.1**: Hiện thực API `GET /api/v1/dashboard/overview`:
  - Thống kê: Tổng số từ vựng (`total_words`), số từ mới (`new_words`), số từ đang học (`learning_words`), số từ tạo tuần này (`this_week_words`), số từ đang chờ ôn tập (`waiting_review_count`).
- [x] **Task 3.2**: Hiện thực API `GET /api/v1/dashboard/daily-progress`:
  - Trả về mục tiêu ngày (`daily_goal`), số từ đã học hôm nay (`learned_today`), số từ còn lại (`remaining_today`), phần trăm hoàn thành (`progress_percentage`).
  - Danh sách từ vựng trong phiên học hôm nay.

---

### 🔵 P4 - API Cài Đặt Người Dùng (User Settings)
*Mục tiêu: Cung cấp API lưu cấu hình mục tiêu học hàng ngày.*

- [x] **Task 4.1**: Thêm cột `daily_goal` (mặc định 20) vào bảng `users`.
- [x] **Task 4.2**: Hiện thực `internal/modules/user`:
  - `GET /api/v1/users/settings`: Lấy cấu hình mục tiêu học và profile.
  - `PATCH /api/v1/users/settings`: Cập nhật `daily_goal` hoặc tên người dùng.

---

### 🟣 P5 - Tích hợp Frontend (`apps/ui`) với Backend APIs
*Mục tiêu: Đưa ứng dụng vào hoạt động thực tế, loại bỏ hoàn toàn mock data.*

- [x] **Task 5.1**: Tạo các service client trong `apps/ui/services/`:
  - `vocabulary.service.ts`
  - `review.service.ts`
  - `dashboard.service.ts`
  - `user.service.ts`
- [x] **Task 5.2**: Tích hợp Auth trên UI:
  - Nối nút Đăng xuất ở `SidebarDrawer` gọi `POST /api/auth/logout`.
  - Cập nhật hàm `getMe()` trong `auth.service.ts`.
- [x] **Task 5.3**: Tích hợp Trang Từ vựng (`/vocabulary`):
  - Nối danh sách từ vựng với `GET /api/v1/vocabularies` (hỗ trợ search, filter, pagination).
  - Nối modal `AddVocabularyForm` với `POST /api/v1/vocabularies`.
  - Nối chức năng xoá từ vựng trên thẻ từ qua `DELETE /api/v1/vocabularies/{id}`.
- [x] **Task 5.4**: Tích hợp Trang Ôn tập (`/practice`):
  - Lấy danh sách thẻ ôn tập từ `GET /api/v1/reviews/practice`.
  - Gửi đánh giá khi bấm Hard / Good / Easy qua `POST /api/v1/reviews`.
  - Hiển thị thanh tiến độ số thẻ còn lại theo thời gian thực và màn hình chúc mừng khi hoàn thành.
- [x] **Task 5.5**: Tích hợp Trang Chủ (`/`):
  - Nối dữ liệu Overview và Daily Progress với API Dashboard.
  - Nối nút bắt đầu ôn tập và số lượng thẻ đang chờ học.
- [x] **Task 5.6**: Tích hợp Trang Cài Đặt (`/setting`):
  - Nối hộp thoại cập nhật `daily_goal` qua `PATCH /api/v1/users/settings`.
  - Nối tính năng tải file export từ vựng JSON qua `GET /api/v1/vocabularies/export`.

---

## ❓ NHỮNG THỨ CẦN BẠN CUNG CẤP HOẶC XÁC NHẬN

Trước khi bắt tay vào triển khai code chi tiết, vui lòng cung cấp hoặc xác nhận các điểm sau:

1. **Quyền chạy Migration Database**:
   - Trong file `apps/api/.env` đã có sẵn chuỗi kết nối `DATABASE_URL` (Neon PostgreSQL). Tôi có thể tự động chạy tạo bảng / thêm cột mới vào database này hay bạn muốn tự chạy thủ công?
2. **Quy tắc tính khoảng cách ôn tập (Spaced Repetition)**:
   - Giao diện đang có 3 nút: **Hard**, **Good**, **Easy**. Bạn có muốn áp dụng khoảng cách chuẩn:
     - `Hard`: Ôn lại sau 1 ngày (reset chu kỳ)
     - `Good`: Ôn lại sau 3 ngày -> 7 ngày -> 14 ngày
     - `Easy`: Ôn lại sau 7 ngày -> 15 ngày -> 30 ngày
     (Hoặc bạn có công thức riêng nào muốn áp dụng không?)
3. **Mục tiêu học mặc định (Daily Goal)**:
   - Mặc định là **20 từ/ngày** (như hiển thị trên UI) có phù hợp không?
4. **Phạm vi triển khai ưu tiên**:
   - Bạn muốn tôi bắt đầu ngay với nhóm **P0** (sửa lỗi build, viết Auth Middleware) và **P1** (API Vocabulary hoàn chỉnh) trước, hay bạn có ưu tiên nào khác?
