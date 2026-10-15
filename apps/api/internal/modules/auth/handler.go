package auth

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/duycao04/chinese-vocab/apps/api/lib"
)

type Handler struct {
	service      *Service
	tokenService *TokenService
}

func NewHandler(
	service *Service,
	tokenService *TokenService,
) *Handler {
	return &Handler{
		service:      service,
		tokenService: tokenService,
	}
}
func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var req RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "Dữ liệu gửi lên không hợp lệ",
		})
		return
	}

	user, err := h.service.Register(r.Context(), req)
	if err != nil {
		if errors.Is(err, ErrEmailExists) {
			writeJSON(w, http.StatusConflict, map[string]string{
				"message": "Email đã được sử dụng",
			})
			return
		}

		log.Printf("register error: %v", err)

		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": "Đã xảy ra lỗi hệ thống",
		})
		return
	}

	if h.tokenService != nil {
		token, expiresAt, err := h.tokenService.Generate(user.ID)
		if err == nil {
			secure := os.Getenv("APP_ENV") == "production"
			sameSite := http.SameSiteLaxMode
			if secure {
				sameSite = http.SameSiteNoneMode
			}

			http.SetCookie(w, &http.Cookie{
				Name:     "access_token",
				Value:    token,
				Path:     "/",
				HttpOnly: true,
				Secure:   secure,
				SameSite: sameSite,
				Expires:  expiresAt,
				MaxAge:   int(time.Until(expiresAt).Seconds()),
			})
		}
	}

	writeJSON(w, http.StatusCreated, user)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(data); err != nil {
		log.Printf("encode JSON response error: %v", err)
	}
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{
			"message": "Method Not Allowed",
		})
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "Dữ liệu gửi lên không hợp lệ",
		})
		return
	}

	user, err := h.service.Login(r.Context(), req)
	if err != nil {
		if errors.Is(err, ErrInvalidCredentials) {
			writeJSON(w, http.StatusUnauthorized, map[string]string{
				"message": "Email hoặc mật khẩu không chính xác",
			})
			return
		}

		log.Printf("login error: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": "Đã xảy ra lỗi hệ thống",
		})
		return
	}

	if h.tokenService == nil {
		log.Printf("token service is not configured")
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": "Chưa cấu hình dịch vụ xác thực",
		})
		return
	}

	token, expiresAt, err := h.tokenService.Generate(user.ID)
	if err != nil {
		log.Printf("generate token error: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": "Không thể tạo phiên đăng nhập",
		})
		return
	}

	secure := os.Getenv("APP_ENV") == "production"

	sameSite := http.SameSiteLaxMode
	if secure {
		sameSite = http.SameSiteNoneMode
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		Expires:  expiresAt,
		MaxAge:   int(time.Until(expiresAt).Seconds()),
	})

	writeJSON(w, http.StatusOK, user)
}

func (h *Handler) Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{
			"message": "Method Not Allowed",
		})
		return
	}

	secure := os.Getenv("APP_ENV") == "production"
	sameSite := http.SameSiteLaxMode
	if secure {
		sameSite = http.SameSiteNoneMode
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Secure:   secure,
		SameSite: sameSite,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	})

	writeJSON(w, http.StatusOK, map[string]string{
		"message": "Đăng xuất thành công",
	})
}

func (h *Handler) Me(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]string{
			"message": "Method Not Allowed",
		})
		return
	}

	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	user, err := h.service.GetMe(r.Context(), userID)
	if err != nil {
		log.Printf("get me error: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": "Đã xảy ra lỗi hệ thống",
		})
		return
	}

	writeJSON(w, http.StatusOK, user)
}
