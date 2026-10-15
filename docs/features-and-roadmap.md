# ChiNex — Bản Đồ Chức Năng & Lộ Trình Phát Triển Hệ Thống

## 1. Tổng Quan Chức Năng Hiện Có (System Overview)

### 🔐 Xác thực & Người dùng (Auth & User)
- **Đăng ký tài khoản (`POST /api/auth/register`)**: Tạo tài khoản mới, mã hóa mật khẩu bcrypt, tự động thiết lập cài đặt mặc định và cấp JWT token qua HTTP-only cookie.
- **Đăng nhập (`POST /api/auth/login`)**: Xác thực email/password, trả về session cookie an toàn.
- **Đăng xuất (`POST /api/auth/logout`)**: Hủy phiên đăng nhập, xóa cookie.
- **Thông tin tài khoản (`GET /api/auth/me`)**: Trả về thông tin người dùng hiện tại và trạng thái.

### 📚 Quản lý Từ vựng (Vocabulary Management)
- **Danh sách từ vựng (`GET /api/v1/vocabularies`)**:
  - Tìm kiếm theo từ khóa (Hanzi, Pinyin, nghĩa).
  - Lọc theo trạng thái học tập (`new`, `learning`, `reviewing`, `mastered`).
  - Lọc theo ngày tạo.
  - Phân trang (Pagination) với limit và page.
- **Thêm mới từ vựng (`POST /api/v1/vocabularies`)**: Thêm từ gồm chữ Hán (Hanzi), phiên âm (Pinyin), nghĩa tiếng Việt, câu ví dụ, và ghi chú cá nhân.
- **Chỉnh sửa từ vựng (`PATCH /api/v1/vocabularies/{id}`)**: Cập nhật thông tin chi tiết của từ vựng.
- **Xóa từ vựng (`DELETE /api/v1/vocabularies/{id}`)**: Xóa từ kèm toàn bộ lịch sử ôn tập liên quan.
- **Xuất dữ liệu (`GET /api/v1/vocabularies/export`)**: Tải về toàn bộ danh sách từ vựng dưới định dạng JSON.

### 🔁 Ôn tập Thông minh theo SRS (Spaced Repetition System)
- **Lấy thẻ cần ôn (`GET /api/v1/reviews/practice`)**: Thuật toán tự động tính toán và trả về danh sách các từ vựng đã đến hạn cần ôn lại theo chu kỳ trí nhớ Ebbinghaus.
- **Ghi nhận kết quả ôn (`POST /api/v1/reviews`)**: Đánh giá kết quả (Hard / Good / Easy) để tính toán chu kỳ ôn tập tiếp theo:
  - *Hard (1)*: Reset chu kỳ về 1 ngày.
  - *Good (2)*: Chu kỳ tăng dần: 1 ngày → 3 ngày → 7 ngày → n × 5 ngày.
  - *Easy (3)*: Chu kỳ tăng nhanh: 3 ngày → 7 ngày → n × 7 ngày.
  - Tự động chuyển trạng thái từ vựng sang `mastered` (thành thạo) sau 5 lần Good hoặc 4 lần Easy liên tiếp.
- **Chế độ Flashcard tương tác**: Cho phép chọn danh sách từ vựng cụ thể hoặc toàn bộ từ cần ôn, lật thẻ, điều hướng Previous / Next, phát âm mẫu.
- **Trò chơi Nối Từ (Matching Game)**: Game ghép cặp Hanzi và Nghĩa tiếng Việt theo vòng tròn, bấm chọn hai cột, tính chuỗi combo và điểm số.

### 📊 Thống kê & Dashboard
- **Tổng quan (`GET /api/v1/dashboard/overview`)**: Thống kê số lượng tổng từ, từ mới, từ đang học, từ cần ôn hôm nay.
- **Tiến độ học trong ngày (`GET /api/v1/dashboard/progress`)**: Theo dõi số từ đã học/ôn so với mục tiêu đặt ra trong ngày (Daily Goal).

### ⚙️ Cài đặt Cá nhân (User Settings)
- **Mục tiêu học hàng ngày (`GET / PATCH /api/v1/users/settings`)**: Tùy chỉnh số lượng từ mục tiêu mỗi ngày (1 - 200 từ).
- **Giao diện & Theme**: Hỗ trợ Dark Mode, Light Mode và System Theme thông qua `next-themes`.

---

## 2. Kế Hoạch Triển Khai Chức Năng Mới & Nâng Cấp Shadcn UI

### 🎨 Chuẩn hóa UI với Shadcn UI
- Ưu tiên sử dụng toàn bộ thư viện component Shadcn:
  - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
  - `Badge` (cho trạng thái từ vựng, cấp độ, kết quả)
  - `Button` (primary, secondary, outline, ghost, destructive)
  - `Progress` (thanh tiến trình học tập, quiz, daily progress)
  - `Dialog` & `Drawer` (modal thêm từ, modal xác nhận, kết quả bài thi)
  - `Select` & `RadioGroup` (bộ lọc, cài đặt)
  - `Skeleton` (hiệu ứng tải dữ liệu mượt mà)
  - `Sonner` (thông báo Toast hiện đại thay thế alert mặc định)
  - `Input`, `Label`

### 🚀 Danh Sách Tính Năng Bổ Sung Đang Triển Khai

#### 1. 📝 Quiz Trắc Nghiệm Toàn Diện (`/practice/quiz`)
- **Mô tả**: Trắc nghiệm 4 đáp án giúp kích thích trí nhớ chủ động (Active Recall).
- **Các chế độ kiểm tra**:
  - Nhìn chữ Hán chọn Nghĩa tiếng Việt.
  - Nhìn nghĩa tiếng Việt chọn chữ Hán đúng.
  - Nhìn chữ Hán chọn Pinyin chính xác.
- **Cơ chế**: Tính điểm, streak trả lời đúng, cập nhật tự động vào tiến độ học SRS.

#### 2. ✍️ Luyện Gõ Phiên Âm Pinyin (`/practice/pinyin`)
- **Mô tả**: Hiển thị chữ Hán và nghĩa, người học phải gõ đúng pinyin.
- **Cơ chế thông minh**: Chấp nhận cả pinyin có dấu thanh điệu (zhōng) lẫn pinyin số (zhong1), tự động gợi ý khi người học gặp khó khăn.

#### 3. 🔊 Luyện Nghe & Nhận Diện Chữ Hán (`/practice/listening`)
- **Mô tả**: Tận dụng Web Speech Synthesis API chuẩn phát âm tiếng Trung Quốc (`zh-CN`).
- **Cơ chế**: Phát âm từ vựng, người học lắng nghe và chọn chữ Hán/nghĩa tương ứng, có nút phát lại tốc độ chậm (0.75x) và bình thường (1.0x).

#### 4. 📈 Bảng Thống Kê & Phân Tích Chuyên Sâu (`/stats`)
- **Mô tả**: Trang phân tích toàn diện quá trình học tập:
  - Phân bố trạng thái từ vựng: Mới (New), Đang học (Learning), Đang ôn (Reviewing), Thành thạo (Mastered).
  - Tỷ lệ ghi nhớ và hoàn thành mục tiêu.
  - Chuỗi ngày học liên tục (Streak).

#### 5. 📥 Nhập Từ Vựng Hàng Loạt (Bulk Import CSV / JSON)
- **Mô tả**: Hỗ trợ nhập danh sách từ vựng từ tệp CSV hoặc JSON có sẵn (như bộ từ HSK 1-6, sách giáo khoa Boya, Hán ngữ).
- **Cơ chế**: Xem trước (preview) dữ liệu, kiểm tra lỗi tự động trước khi lưu vào hệ thống.

#### 6. ⚙️ Tùy Chỉnh Flashcard & Ôn Tập
- **Mô tả**: Thêm cài đặt cho phép người dùng tùy biến thẻ học theo nhu cầu:
  - Ẩn/Hiện Pinyin mặc định để nâng cao độ khó.
  - Tự động phát âm khi lật thẻ.
  - Cỡ chữ chữ Hán to / vừa.

#### 7. 📱 Hỗ trợ PWA & Trải nghiệm Di động
- **Mô tả**: Hỗ trợ cài đặt trên thiết bị di động (Add to Home Screen) như ứng dụng bản địa, lưu bộ nhớ đệm tăng tốc độ tải trang.
