package vocabulary

import "net/http"

func RegisterRoutes(
	mux *http.ServeMux,
	handler *Handler,
	authMiddleware func(http.Handler) http.Handler,
) {
	mux.Handle(
		"POST /api/v1/vocabularies",
		authMiddleware(http.HandlerFunc(handler.Create)),
	)
	mux.Handle(
		"GET /api/v1/vocabularies",
		authMiddleware(http.HandlerFunc(handler.FindAll)),
	)
	mux.Handle(
		"GET /api/v1/vocabularies/export",
		authMiddleware(http.HandlerFunc(handler.Export)),
	)
	mux.Handle(
		"GET /api/v1/vocabularies/{id}",
		authMiddleware(http.HandlerFunc(handler.FindByID)),
	)
	mux.Handle(
		"PATCH /api/v1/vocabularies/{id}",
		authMiddleware(http.HandlerFunc(handler.Update)),
	)
	mux.Handle(
		"DELETE /api/v1/vocabularies/{id}",
		authMiddleware(http.HandlerFunc(handler.Delete)),
	)
}
