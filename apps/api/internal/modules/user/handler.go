package user

import (
	"encoding/json"
	"net/http"

	"github.com/duycao04/chinese-vocab/apps/api/lib"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) GetSettings(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	profile, err := h.service.GetSettings(r.Context(), userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, profile)
}

func (h *Handler) UpdateSettings(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	var req UpdateSettingsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "Dữ liệu gửi lên không hợp lệ",
		})
		return
	}

	profile, err := h.service.UpdateSettings(r.Context(), userID, req)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, profile)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}
