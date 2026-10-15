package middleware

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/duycao04/chinese-vocab/apps/api/lib"
)

type TokenValidator interface {
	Validate(tokenString string) (int64, error)
}

func Auth(validator TokenValidator) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			tokenString := extractToken(r)
			if tokenString == "" {
				writeUnauthorized(w, "Vui lòng đăng nhập để tiếp tục")
				return
			}

			userID, err := validator.Validate(tokenString)
			if err != nil {
				writeUnauthorized(w, "Phiên đăng nhập không hợp lệ hoặc đã hết hạn")
				return
			}

			ctx := lib.WithUserID(r.Context(), userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func AuthFunc(validator TokenValidator, next http.HandlerFunc) http.HandlerFunc {
	authMiddleware := Auth(validator)
	return func(w http.ResponseWriter, r *http.Request) {
		authMiddleware(next).ServeHTTP(w, r)
	}
}

func extractToken(r *http.Request) string {
	if cookie, err := r.Cookie("access_token"); err == nil && cookie.Value != "" {
		return cookie.Value
	}

	authHeader := r.Header.Get("Authorization")
	if strings.HasPrefix(authHeader, "Bearer ") {
		return strings.TrimPrefix(authHeader, "Bearer ")
	}

	return ""
}

func writeUnauthorized(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusUnauthorized)
	json.NewEncoder(w).Encode(map[string]string{
		"message": message,
	})
}
