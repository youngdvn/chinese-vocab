package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"github.com/duycao04/chinese-vocab/apps/api/internal/database"
	"github.com/duycao04/chinese-vocab/apps/api/internal/modules/vocabulary"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env")
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

	// Vocabulary module
	vocabularyRepository := vocabulary.NewRepository(db)

	vocabularyService := vocabulary.NewService(
		vocabularyRepository,
	)

	vocabularyHandler := vocabulary.NewHandler(
		vocabularyService,
	)

	vocabulary.RegisterRoutes(
		mux,
		vocabularyHandler,
	)

	fmt.Println("Server is running at http://localhost:8080")

	err = http.ListenAndServe(":8080", mux)
	if err != nil {
		log.Fatal(err)
	}
}
