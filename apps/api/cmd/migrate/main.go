package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"

	"github.com/duycao04/chinese-vocab/apps/api/internal/database"
	"github.com/joho/godotenv"
)

type MigrationItem struct {
	Version int64
	File    string
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	db, err := database.NewPostgres()
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	ctx := context.Background()
	if err := db.Ping(ctx); err != nil {
		log.Fatalf("failed to ping database: %v", err)
	}

	_, err = db.Exec(ctx, `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version bigint NOT NULL PRIMARY KEY,
			dirty boolean NOT NULL
		);
	`)
	if err != nil {
		log.Fatalf("failed to create schema_migrations table: %v", err)
	}

	var currentVersion int64 = 0
	var dirty bool = false
	err = db.QueryRow(ctx, "SELECT version, dirty FROM schema_migrations LIMIT 1").Scan(&currentVersion, &dirty)
	if err != nil {
		fmt.Printf("No existing version found, starting from 0. (Error: %v)\n", err)
	} else {
		fmt.Printf("Current schema version: %d, dirty: %v\n", currentVersion, dirty)
	}

	if dirty {
		log.Fatalf("Database is in dirty state at version %d. Please fix it before running migrations.", currentVersion)
	}

	migrationsDir := "migrations"
	files, err := os.ReadDir(migrationsDir)
	if err != nil {
		log.Fatalf("failed to read migrations dir: %v", err)
	}

	var migrations []MigrationItem
	for _, f := range files {
		if !f.IsDir() && strings.HasSuffix(f.Name(), ".up.sql") {
			parts := strings.Split(f.Name(), "_")
			if len(parts) > 0 {
				v, err := strconv.ParseInt(parts[0], 10, 64)
				if err == nil {
					migrations = append(migrations, MigrationItem{
						Version: v,
						File:    f.Name(),
					})
				}
			}
		}
	}

	sort.Slice(migrations, func(i, j int) bool {
		return migrations[i].Version < migrations[j].Version
	})

	for _, m := range migrations {
		if m.Version <= currentVersion {
			fmt.Printf("Migration %d (%s) already applied, skipping.\n", m.Version, m.File)
			continue
		}

		fmt.Printf("Applying migration %d: %s\n", m.Version, m.File)
		content, err := os.ReadFile(filepath.Join(migrationsDir, m.File))
		if err != nil {
			log.Fatalf("failed to read migration file %s: %v", m.File, err)
		}

		tx, err := db.Begin(ctx)
		if err != nil {
			log.Fatalf("failed to start transaction: %v", err)
		}

		if _, err := tx.Exec(ctx, string(content)); err != nil {
			tx.Rollback(ctx)
			log.Fatalf("failed to apply migration %s: %v", m.File, err)
		}

		// Update schema_migrations
		_, err = tx.Exec(ctx, `
			INSERT INTO schema_migrations (version, dirty)
			VALUES ($1, false)
			ON CONFLICT (version) DO UPDATE SET dirty = false;
		`, m.Version)
		if err != nil {
			// If schema_migrations has a single row format, delete old rows:
			tx.Rollback(ctx)
			log.Fatalf("failed to record version %d: %v", m.Version, err)
		}
		// Also ensure only the latest version exists if golang-migrate format is single-row
		_, _ = tx.Exec(ctx, "DELETE FROM schema_migrations WHERE version != $1", m.Version)

		if err := tx.Commit(ctx); err != nil {
			log.Fatalf("failed to commit transaction: %v", err)
		}

		fmt.Printf("Successfully applied migration %d: %s\n", m.Version, m.File)
		currentVersion = m.Version
	}

	fmt.Printf("All migrations up to version %d applied successfully!\n", currentVersion)
}
