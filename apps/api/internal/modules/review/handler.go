package review

import (
	"encoding/json"
	"net/http"
	"strconv"

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

func (h *Handler) GetPracticeCards(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))
	if limit <= 0 {
		limit = 20
	}

	res, err := h.service.GetPracticeCards(r.Context(), userID, limit)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, res)
}

func (h *Handler) SubmitReview(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	var req SubmitReviewRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "Dữ liệu gửi lên không hợp lệ",
		})
		return
	}

	if req.VocabularyID <= 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "ID từ vựng không hợp lệ",
		})
		return
	}

	if req.Rating < 1 || req.Rating > 3 {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "Đánh giá phải từ 1 (Hard), 2 (Good), đến 3 (Easy)",
		})
		return
	}

	res, err := h.service.SubmitReview(r.Context(), userID, req)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusOK, res)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}
