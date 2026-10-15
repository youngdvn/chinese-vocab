package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/duycao04/chinese-vocab/apps/api/internal/database"
	"github.com/duycao04/chinese-vocab/apps/api/internal/middleware"
	"github.com/duycao04/chinese-vocab/apps/api/internal/modules/auth"
	"github.com/duycao04/chinese-vocab/apps/api/internal/modules/dashboard"
	"github.com/duycao04/chinese-vocab/apps/api/internal/modules/review"
	"github.com/duycao04/chinese-vocab/apps/api/internal/modules/user"
	"github.com/duycao04/chinese-vocab/apps/api/internal/modules/vocabulary"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	db, err := database.NewPostgres()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping(context.Background())
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Database connected successfully")

	mux := http.NewServeMux()

	// Health check
	mux.HandleFunc("/api/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprint(w, `{"status":"ok"}`)
	})

	// Auth module
	tokenService, err := auth.NewTokenService()
	if err != nil {
		log.Fatalf("failed to initialize token service: %v", err)
	}

	authMiddleware := middleware.Auth(tokenService)

	authRepository := auth.NewRepository(db)
	authService := auth.NewService(authRepository)
	authHandler := auth.NewHandler(authService, tokenService)

	auth.RegisterRoutes(mux, authHandler, authMiddleware)

	// User module
	userRepository := user.NewRepository(db)
	userService := user.NewService(userRepository)
	userHandler := user.NewHandler(userService)

	user.RegisterRoutes(mux, userHandler, authMiddleware)

	// Vocabulary module
	vocabularyRepository := vocabulary.NewRepository(db)
	vocabularyService := vocabulary.NewService(vocabularyRepository)
	vocabularyHandler := vocabulary.NewHandler(vocabularyService)

	vocabulary.RegisterRoutes(mux, vocabularyHandler, authMiddleware)

	// Review module
	reviewRepository := review.NewRepository(db)
	reviewService := review.NewService(reviewRepository)
	reviewHandler := review.NewHandler(reviewService)

	review.RegisterRoutes(mux, reviewHandler, authMiddleware)

	// Dashboard module
	dashboardRepository := dashboard.NewRepository(db)
	dashboardService := dashboard.NewService(dashboardRepository)
	dashboardHandler := dashboard.NewHandler(dashboardService)

	dashboard.RegisterRoutes(mux, dashboardHandler, authMiddleware)

	handler := middleware.CORS(mux)

	log.Println("Server running on :8080")

	if err := http.ListenAndServe(":8080", handler); err != nil {
		log.Fatal(err)
	}
}
