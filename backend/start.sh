#!/bin/bash
set -e

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migration..."
python migrate_db.py

echo "Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
