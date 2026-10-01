package vocabulary

import "net/http"

func RegisterRoutes(
	mux *http.ServeMux,
	handler *Handler,
) {
	mux.HandleFunc(
		"POST /api/v1/vocabularies",
		handler.Create,
	)
	mux.HandleFunc(
		"GET /api/v1/vocabularies",
		handler.FindAll,
	)
	mux.HandleFunc(
		"GET /api/v1/vocabularies/{id}",
		handler.FindByID,
	)
	mux.HandleFunc(
		"PATCH /api/v1/vocabularies/{id}",
		handler.Update,
	)
	mux.HandleFunc(
		"DELETE /api/v1/vocabularies/{id}",
		handler.Delete,
	)
}
