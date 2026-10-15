package dashboard

import "net/http"

func RegisterRoutes(
	mux *http.ServeMux,
	handler *Handler,
	authMiddleware func(http.Handler) http.Handler,
) {
	mux.Handle(
		"GET /api/v1/dashboard/overview",
		authMiddleware(http.HandlerFunc(handler.GetOverview)),
	)
	mux.Handle(
		"GET /api/v1/dashboard/daily-progress",
		authMiddleware(http.HandlerFunc(handler.GetDailyProgress)),
	)
}
