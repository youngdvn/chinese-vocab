# ChiNex API Specification & Database Schema

Tài liệu đặc tả toàn diện cho hệ thống API của ứng dụng học từ vựng tiếng Trung **ChiNex** (`apps/api` - Golang & PostgreSQL).

---

## 1. Hiện trạng Kiến trúc & Database

### 1.1 Cơ sở dữ liệu hiện tại
- **Users Table** (`000001_create_users.up.sql`):
  - `id`: BIGSERIAL PRIMARY KEY
  - `email`: VARCHAR(255) UNIQUE NOT NULL
  - `password_hash`: TEXT NOT NULL
  - `name`: VARCHAR(100)
  - `created_at`, `updated_at`: TIMESTAMPTZ

- **Vocabularies Table** (`000002_create_vocabularies.up.sql`):
  - `id`: BIGSERIAL PRIMARY KEY
  - `user_id`: BIGINT NOT NULL (FK -> users.id ON DELETE CASCADE)
  - `hanzi`: VARCHAR(100) NOT NULL
  - `pinyin`: VARCHAR(255)
  - `meaning`: TEXT NOT NULL
  - `example`: TEXT
  - `note`: TEXT
  - `hsk_level`: SMALLINT
  - `created_at`, `updated_at`: TIMESTAMPTZ
  - *(Chưa có trường `status`: `new` / `learning` / `mastered` như giao diện yêu cầu)*

- **Reviews Table** (`000003_create_reviews.up.sql`):
  - `id`: BIGSERIAL PRIMARY KEY
  - `user_id`: BIGINT NOT NULL (FK -> users.id)
  - `vocabulary_id`: BIGINT NOT NULL (FK -> vocabularies.id)
  - `rating`: SMALLINT NOT NULL (CHECK 1..4)
  - `reviewed_at`: TIMESTAMPTZ DEFAULT NOW()
  - `next_review_at`: TIMESTAMPTZ

---

## 2. Đề xuất Migration cập nhật Database

### Migration `000004_update_schema.up.sql`:
1. **Bổ sung cột vào `vocabularies`**:
   - `status`: VARCHAR(20) DEFAULT 'new' NOT NULL (Giá trị: `new`, `learning`, `mastered`)
   - Index trên `(user_id, status)` và `(user_id, created_at)` để tối ưu hóa filter & pagination.
2. **Bổ sung cột vào `users`**:
   - `daily_goal`: INT DEFAULT 20 NOT NULL (Mục tiêu học hàng ngày)
3. **Bổ sung bảng/cột thống kê tiến độ ôn tập (SRS Tracking)** vào `vocabularies` hoặc bảng `review_states`:
   - `interval_days`: INT DEFAULT 0
   - `ease_factor`: FLOAT DEFAULT 2.5
   - `repetitions`: INT DEFAULT 0
   - `last_reviewed_at`: TIMESTAMPTZ
   - `next_review_at`: TIMESTAMPTZ

---

## 3. Đặc tả Danh sách API Cần Triển Khai

### 3.1 Nhóm Xác thực (Authentication) - `apps/api/internal/modules/auth`
Cơ chế: Sử dụng HttpOnly Cookie `access_token` chứa JWT token (đã có sẵn trong `Login`).

| Method | Endpoint | Bảo vệ (Auth) | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Đăng ký tài khoản (Đã có) |
| `POST` | `/api/auth/login` | Public | Đăng nhập & set cookie (Đã có) |
| `POST` | `/api/auth/logout` | Required | Đăng xuất (xóa cookie `access_token`) |
| `GET` | `/api/auth/me` | Required | Lấy thông tin user hiện tại từ token |

#### Chi tiết DTO:
- **`GET /api/auth/me`**:
  - Response:
    ```json
    {
      "id": 1,
      "email": "user@example.com",
      "name": "Duy Cao",
      "daily_goal": 20
    }
    ```
- **`POST /api/auth/logout`**:
  - Response: `{"message": "Logged out successfully"}` (Set cookie `access_token` maxAge=-1).

---

### 3.2 Nhóm Từ vựng (Vocabulary) - `apps/api/internal/modules/vocabulary`

| Method | Endpoint | Auth | Mô tả |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/vocabularies` | Required | Tạo từ vựng mới (gán `user_id` từ token) |
| `GET` | `/api/v1/vocabularies` | Required | Lấy danh sách từ vựng có Search, Filter, Pagination |
| `GET` | `/api/v1/vocabularies/{id}` | Required | Lấy chi tiết từ vựng theo ID (kiểm tra sở hữu) |
| `PATCH` | `/api/v1/vocabularies/{id}` | Required | Cập nhật từ vựng |
| `DELETE` | `/api/v1/vocabularies/{id}` | Required | Xóa từ vựng |
| `GET` | `/api/v1/vocabularies/export`| Required | Xuất toàn bộ từ vựng ra file JSON/CSV |

#### Query Parameters cho `GET /api/v1/vocabularies`:
- `search`: string (Tìm kiếm theo Hanzi, Pinyin, Meaning)
- `status`: `all` | `new` | `learning` | `mastered`
- `date`: `YYYY-MM-DD` (Lọc theo ngày tạo)
- `page`: int (Default: 1)
- `limit`: int (Default: 10)

#### Response mẫu `GET /api/v1/vocabularies`:
```json
{
  "data": [
    {
      "id": 1,
      "hanzi": "学习",
      "pinyin": "xuéxí",
      "meaning": "Học tập",
      "example": "我喜欢学习中文。",
      "note": "",
      "status": "learning",
      "hsk_level": 1,
      "created_at": "2026-10-14T08:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "limit": 10,
    "total_items": 45,
    "total_pages": 5
  }
}
```

---

### 3.3 Nhóm Ôn tập & Spaced Repetition (Review / Practice) - `apps/api/internal/modules/review`

| Method | Endpoint | Auth | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/reviews/practice` | Required | Lấy danh sách từ vựng đến hạn ôn tập hôm nay |
| `POST` | `/api/v1/reviews` | Required | Gửi kết quả đánh giá flashcard (Hard / Good / Easy) |
| `GET` | `/api/v1/reviews/history` | Required | Lịch sử các lần ôn tập gần đây |

#### Chi tiết DTO:
- **`GET /api/v1/reviews/practice`**:
  - Trả về danh sách thẻ cần học: từ đến hạn (`next_review_at <= NOW()`) và từ mới (`status = 'new'`) theo giới hạn Daily Goal.
  ```json
  {
    "total_remaining": 12,
    "cards": [
      {
        "vocabulary_id": 1,
        "hanzi": "学习",
        "pinyin": "xuéxí",
        "meaning": "Học tập",
        "example": "我喜欢学习中文。",
        "status": "learning",
        "repetitions": 2
      }
    ]
  }
  ```

- **`POST /api/v1/reviews`**:
  - Request:
    ```json
    {
      "vocabulary_id": 1,
      "rating": 3 // 1: Hard, 2: Good, 3: Easy (hoặc thang điểm 1-4)
    }
    ```
  - Xử lý SRS (Spaced Repetition System):
    - Dựa vào `rating`, tính toán khoảng thời gian kế tiếp (`next_review_at` ví dụ: Hard = 1 ngày, Good = 3 ngày, Easy = 7 ngày đối với các lần lặp lại).
    - Cập nhật trạng thái từ vựng: nếu đang là `new` chuyển thành `learning`.
    - Ghi nhận lịch sử vào bảng `reviews`.
  - Response:
    ```json
    {
      "review_id": 101,
      "vocabulary_id": 1,
      "next_review_at": "2026-10-17T08:00:00Z",
      "status": "learning"
    }
    ```

---

### 3.4 Nhóm Dashboard & Thống kê - `apps/api/internal/modules/dashboard` (hoặc trong `review/user`)

| Method | Endpoint | Auth | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/dashboard/overview` | Required | Thống kê: Tổng số từ, từ mới, đang học, tuần này |
| `GET` | `/api/v1/dashboard/daily-progress` | Required | Tiến độ học hôm nay so với `daily_goal` & danh sách từ hôm nay |

#### Chi tiết DTO:
- **`GET /api/v1/dashboard/overview`**:
  ```json
  {
    "total_words": 320,
    "new_words": 135,
    "learning_words": 185,
    "this_week_words": 20
  }
  ```

- **`GET /api/v1/dashboard/daily-progress`**:
  ```json
  {
    "daily_goal": 20,
    "learned_today": 15,
    "remaining_today": 5,
    "progress_percentage": 75.0,
    "words": [
      {
        "id": 1,
        "hanzi": "学习",
        "pinyin": "xuéxí",
        "meaning": "Học tập",
        "status": "learning"
      }
    ]
  }
  ```

---

### 3.5 Nhóm Cài đặt Người dùng (User Settings) - `apps/api/internal/modules/user`

| Method | Endpoint | Auth | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/settings` | Required | Lấy cài đặt người dùng (daily goal, v.v.) |
| `PATCH` | `/api/v1/users/settings` | Required | Cập nhật mục tiêu daily goal, thông tin cá nhân |

---

## 4. Middleware & Xử lý Bảo mật
1. **`internal/middleware/auth.go`**:
   - Trích xuất token từ Cookie `access_token` hoặc Header `Authorization: Bearer <token>`.
   - Xác thực token bằng `TokenService.Validate(token)`.
   - Lưu trữ `userID` vào `r.Context()`.
   - Trả về HTTP 401 Unauthorized nếu token không hợp lệ hoặc hết hạn.
2. **Context Helper** (`lib/context.go`):
   - `GetUserID(ctx context.Context) (int64, error)` để các handlers lấy ID người dùng an toàn.
