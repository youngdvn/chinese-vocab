package auth

import "net/http"

func RegisterRoutes(
	mux *http.ServeMux,
	handler *Handler,
	authMiddleware func(http.Handler) http.Handler,
) {
	mux.HandleFunc("POST /api/auth/register", handler.Register)
	mux.HandleFunc("POST /api/auth/login", handler.Login)
	mux.HandleFunc("POST /api/auth/logout", handler.Logout)
	mux.Handle("GET /api/auth/me", authMiddleware(http.HandlerFunc(handler.Me)))
}
