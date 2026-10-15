package user

import "net/http"

func RegisterRoutes(
	mux *http.ServeMux,
	handler *Handler,
	authMiddleware func(http.Handler) http.Handler,
) {
	mux.Handle(
		"GET /api/v1/users/settings",
		authMiddleware(http.HandlerFunc(handler.GetSettings)),
	)
	mux.Handle(
		"PATCH /api/v1/users/settings",
		authMiddleware(http.HandlerFunc(handler.UpdateSettings)),
	)
}
