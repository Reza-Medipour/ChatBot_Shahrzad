# Shahrzad Chatbot

A professional chatbot system with separated Frontend and Backend architecture, PostgreSQL database, and Docker deployment capability.

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
                  Port 8090 (Nginx Reverse Proxy)
```

### Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + SQLAlchemy + PostgreSQL
- **Deployment**: Docker + Docker Compose + Nginx

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

```bash
git clone <repository-url> shahrzad-chatbot
cd shahrzad-chatbot

# Configure environment
cp backend/.env.example backend/.env
cp .env.example .env

# Edit docker-compose.yml and change:
# 1. SECRET_KEY (generate with: openssl rand -hex 32)
# 2. LLM_API_URL (your LLM service endpoint)

# Deploy
docker-compose up -d --build
```

### Access
- **Application**: `http://YOUR_SERVER_IP:8090`
- **API Docs**: `http://YOUR_SERVER_IP:8090/docs`

## Configuration

### Environment Variables

**Root `.env`**
```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Backend `.env`**
```env
DATABASE_URL=postgresql://shahrzad:shahrzad_password@database:5432/shahrzad_db
SECRET_KEY=your-secret-key-change-in-production-min-32-chars-long-for-security
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

LLM_API_URL=http://YOUR_SERVER_IP:8020/chat
LLM_API_KEY=
```

**Frontend `.env`**
```env
# Leave empty - uses dynamic URL detection
VITE_API_URL=
```

### Docker Compose Ports

Edit `docker-compose.yml` to change the external port:
```yaml
nginx:
  ports:
    - "8090:80"  # Change 8090 to your desired port
```

## Commands

```bash
# View status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build

# Restart service
docker-compose restart backend

# Database backup
docker-compose exec database pg_dump -U shahrzad shahrzad_db > backup.sql

# Database restore
docker-compose exec -T database psql -U shahrzad shahrzad_db < backup.sql
```

## API Endpoints

- `GET /api/conversations` - Get conversation list
- `POST /api/conversations` - Create new conversation
- `DELETE /api/conversations/{id}` - Delete conversation
- `GET /api/conversations/{id}/messages` - Get messages
- `POST /api/chat` - Send message to bot

## Development

### Frontend
```bash
cd frontend
npm install
npm run dev      # Development server
npm run build    # Production build
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

### Connection Issues
```bash
# Check logs
docker-compose logs backend
docker-compose logs nginx

# Verify network
docker network ls
docker network inspect shahrzad_network
```

### Database Issues
```bash
# Reset database
docker-compose down -v
docker-compose up -d --build
```

### Frontend can't connect to API
- Check that backend is running: `docker-compose ps`
- Verify nginx config: `docker-compose logs nginx`
- Clear browser cache and reload

## License

Private project.
