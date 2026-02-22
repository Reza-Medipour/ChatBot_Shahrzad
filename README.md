# Shahrzad Chatbot

Professional chatbot system with React frontend, FastAPI backend, and PostgreSQL database.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
├──────────────┬──────────────────┬──────────────────────┤
│   Frontend   │     Backend      │     Database         │
│   (React)    │    (FastAPI)     │   (PostgreSQL)       │
│   Nginx      │    Port 8000     │   Internal           │
└──────────────┴──────────────────┴──────────────────────┘
                      │
              Nginx Reverse Proxy
```

## Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL 15
- **Deployment**: Docker Compose + Nginx

## Quick Start

```bash
git clone <repository-url> shahrzad-chatbot
cd shahrzad-chatbot

# Configure environment
cp .env.example .env
nano .env  # Edit configuration

# Deploy
docker-compose up -d --build
```

## Configuration

All configuration in `.env`:

```env
# Database
POSTGRES_HOST=database
POSTGRES_PORT=5432
POSTGRES_DB=shahrzad_db
POSTGRES_USER=shahrzad
POSTGRES_PASSWORD=shahrzad_password

# Backend
BACKEND_HOST=backend
BACKEND_PORT=8000

# Frontend
FRONTEND_HOST=frontend
FRONTEND_PORT=80

# Nginx
NGINX_EXTERNAL_PORT=8090
NGINX_INTERNAL_PORT=80

# Security
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# LLM Service
LLM_API_URL=http://YOUR_SERVER_IP:8020/chat
LLM_API_KEY=
```

## Access

- **Application**: `http://YOUR_SERVER_IP:8090`
- **API Docs**: `http://YOUR_SERVER_IP:8090/docs`

## Commands

```bash
# Status
docker-compose ps

# Logs
docker-compose logs -f

# Restart
docker-compose restart backend

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build

# Database backup
docker-compose exec database pg_dump -U shahrzad shahrzad_db > backup.sql
```

## Features

- User sessions with automatic ID generation
- Chat history persistence
- External LLM API integration
- No authentication required
- Automatic user tracking via browser localStorage

## API Endpoints

- `GET /api/conversations` - List conversations
- `POST /api/conversations` - Create conversation
- `DELETE /api/conversations/{id}` - Delete conversation
- `GET /api/conversations/{id}/messages` - Get messages
- `POST /api/chat` - Send message

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Troubleshooting

### 404 Errors
```bash
docker-compose logs nginx
docker-compose logs backend
```

### Database Issues
```bash
docker-compose down -v
docker-compose up -d --build
```

### Port Already in Use
Edit `NGINX_EXTERNAL_PORT` in `.env`
