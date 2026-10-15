package vocabulary

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

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

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	var req CreateVocabularyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "Dữ liệu gửi lên không hợp lệ",
		})
		return
	}

	if strings.TrimSpace(req.Hanzi) == "" || strings.TrimSpace(req.Meaning) == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "Hán tự và ý nghĩa không được để trống",
		})
		return
	}

	vocab, err := h.service.Create(r.Context(), userID, req)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": err.Error(),
		})
		return
	}

	writeJSON(w, http.StatusCreated, vocab)
}

func (h *Handler) FindAll(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	query := r.URL.Query()
	page, _ := strconv.Atoi(query.Get("page"))
	if page < 1 {
		page = 1
	}

	limit, _ := strconv.Atoi(query.Get("limit"))
	if limit < 1 {
		limit = 10
	}

	var hskLevel *int
	if hskStr := query.Get("hsk_level"); hskStr != "" && hskStr != "all" {
		if val, err := strconv.Atoi(hskStr); err == nil {
			hskLevel = &val
		}
	}

	filter := ListVocabularyQuery{
		Search:   query.Get("search"),
		Status:   query.Get("status"),
		Date:     query.Get("date"),
		HSKLevel: hskLevel,
		Sort:     query.Get("sort"),
		Page:     page,
		Limit:    limit,
	}

	result, err := h.service.FindAll(r.Context(), userID, filter)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": "Không thể tải danh sách từ vựng",
		})
		return
	}

	writeJSON(w, http.StatusOK, result)
}

func (h *Handler) FindByID(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "ID từ vựng không hợp lệ",
		})
		return
	}

	vocab, err := h.service.FindByID(r.Context(), id, userID)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{
			"message": "Không tìm thấy từ vựng",
		})
		return
	}

	writeJSON(w, http.StatusOK, vocab)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "ID từ vựng không hợp lệ",
		})
		return
	}

	var req UpdateVocabularyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "Dữ liệu gửi lên không hợp lệ",
		})
		return
	}

	vocab, err := h.service.Update(r.Context(), id, userID, req)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{
			"message": "Không tìm thấy từ vựng để cập nhật",
		})
		return
	}

	writeJSON(w, http.StatusOK, vocab)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	idStr := r.PathValue("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{
			"message": "ID từ vựng không hợp lệ",
		})
		return
	}

	err = h.service.Delete(r.Context(), id, userID)
	if err != nil {
		writeJSON(w, http.StatusNotFound, map[string]string{
			"message": "Không tìm thấy từ vựng để xóa",
		})
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) Export(w http.ResponseWriter, r *http.Request) {
	userID, err := lib.GetUserID(r.Context())
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{
			"message": "Không tìm thấy thông tin xác thực",
		})
		return
	}

	items, err := h.service.ExportAll(r.Context(), userID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{
			"message": "Không thể xuất danh sách từ vựng",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Content-Disposition", `attachment; filename="chinese_vocabularies.json"`)
	json.NewEncoder(w).Encode(items)
}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}
