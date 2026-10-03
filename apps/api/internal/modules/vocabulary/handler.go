package vocabulary

import (
	"encoding/json"
	"fmt"
	"net/http"
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
	var req CreateVocabularyRequest

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	vocab, err := h.service.Create(
		r.Context(),
		req,
	)

	if err != nil {
		http.Error(
			w,
			err.Error(),
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(vocab)
}

func (h *Handler) FindAll(
	w http.ResponseWriter,
	r *http.Request,
) {
	userID := r.URL.Query().Get("user_id")

	if userID == "" {
		http.Error(
			w,
			"user_id is required",
			http.StatusBadRequest,
		)
		return
	}

	var id int64

	_, err := fmt.Sscan(userID, &id)
	if err != nil {
		http.Error(
			w,
			"invalid user_id",
			http.StatusBadRequest,
		)
		return
	}

	vocabularies, err := h.service.FindAll(
		r.Context(),
		id,
	)

	if err != nil {
		http.Error(
			w,
			"failed to get vocabularies",
			http.StatusInternalServerError,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(vocabularies)
}

func (h *Handler) FindByID(
	w http.ResponseWriter,
	r *http.Request,
) {
	idStr := r.PathValue("id")

	var id int64

	_, err := fmt.Sscan(idStr, &id)
	if err != nil {
		http.Error(
			w,
			"invalid vocabulary id",
			http.StatusBadRequest,
		)
		return
	}

	vocabulary, err := h.service.FindByID(
		r.Context(),
		id,
	)

	if err != nil {
		http.Error(
			w,
			"vocabulary not found",
			http.StatusNotFound,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(vocabulary)
}

func (h *Handler) Update(
	w http.ResponseWriter,
	r *http.Request,
) {
	idStr := r.PathValue("id")

	var id int64

	_, err := fmt.Sscan(idStr, &id)
	if err != nil {
		http.Error(
			w,
			"invalid vocabulary id",
			http.StatusBadRequest,
		)
		return
	}

	var req UpdateVocabularyRequest

	err = json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(
			w,
			"invalid request body",
			http.StatusBadRequest,
		)
		return
	}

	vocabulary, err := h.service.Update(
		r.Context(),
		id,
		req,
	)

	if err != nil {
		http.Error(
			w,
			"vocabulary not found",
			http.StatusNotFound,
		)
		return
	}

	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	json.NewEncoder(w).Encode(vocabulary)
}

func (h *Handler) Delete(
	w http.ResponseWriter,
	r *http.Request,
) {
	idStr := r.PathValue("id")

	var id int64

	_, err := fmt.Sscan(idStr, &id)
	if err != nil {
		http.Error(
			w,
			"invalid vocabulary id",
			http.StatusBadRequest,
		)
		return
	}

	err = h.service.Delete(
		r.Context(),
		id,
	)

	if err != nil {
		http.Error(
			w,
			"vocabulary not found",
			http.StatusNotFound,
		)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
