package dashboard

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

func (h *Handler) GetOverview(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	overview, err := h.service.GetOverview(r.Context(), userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, overview)
}

func (h *Handler) GetDailyProgress(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	progress, err := h.service.GetDailyProgress(r.Context(), userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, progress)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}
