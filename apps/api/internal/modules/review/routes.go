package review

import "net/http"

func RegisterRoutes(
	mux *http.ServeMux,
	handler *Handler,
	authMiddleware func(http.Handler) http.Handler,
) {
	mux.Handle(
		"GET /api/v1/reviews/practice",
		authMiddleware(http.HandlerFunc(handler.GetPracticeCards)),
	)
	mux.Handle(
		"POST /api/v1/reviews",
		authMiddleware(http.HandlerFunc(handler.SubmitReview)),
	)
}
