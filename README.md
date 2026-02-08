# چت بات شهرزاد

یک سیستم چت بات حرفه‌ای با معماری جدا شده Frontend و Backend، دیتابیس PostgreSQL لوکال، و قابلیت دیپلوی با Docker.

## 🏗️ معماری پروژه

این پروژه شامل سه سرویس اصلی است:

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Compose                       │
├──────────────┬──────────────────┬──────────────────────┤
│   Frontend   │     Backend      │     Database         │
│   (React)    │    (FastAPI)     │   (PostgreSQL)       │
│   Port 80    │    Port 8000     │   Port 5432          │
│   (Nginx)    │                  │   (Internal)         │
└──────────────┴──────────────────┴──────────────────────┘
```

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Server**: Nginx (Production)
- **Features**:
  - رابط کاربری مدرن و ریسپانسیو
  - مدیریت چت و conversations
  - ارتباط با Backend از طریق REST API

### Backend
- **Framework**: FastAPI (Python)
- **Database ORM**: SQLAlchemy
- **Features**:
  - API endpoints برای chat و conversations
  - ارتباط با دیتابیس PostgreSQL
  - امکان اتصال به سرویس LLM خارجی

### Database
- **Type**: PostgreSQL 15
- **Deployment**: Docker container با data persistence
- **Models**: Users, ChatSessions, Messages

## 🚀 نصب و راه‌اندازی

### پیش‌نیازها
- Docker & Docker Compose
- Git

### راه‌اندازی سریع

```bash
# 1. کلون پروژه
git clone <repository-url>
cd project

# 2. راه‌اندازی با Docker Compose
docker-compose up -d --build
```

پس از راه‌اندازی:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 📋 دستورات مفید

```bash
# مشاهده وضعیت سرویس‌ها
docker-compose ps

# مشاهده لاگ‌ها
docker-compose logs -f

# توقف سرویس‌ها
docker-compose down

# Rebuild پروژه
docker-compose up -d --build

# Restart یک سرویس خاص
docker-compose restart backend

# دسترسی به shell backend
docker-compose exec backend bash

# دسترسی به دیتابیس
docker-compose exec database psql -U shahrzad -d shahrzad_db

# Backup دیتابیس
docker-compose exec database pg_dump -U shahrzad shahrzad_db > backup.sql

# بازگردانی backup
docker-compose exec -T database psql -U shahrzad shahrzad_db < backup.sql
```

## 📁 ساختار پروژه

```
project/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── database.py     # Database connection
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic schemas
│   │   ├── auth.py         # JWT authentication (غیرفعال)
│   │   ├── config.py       # Settings
│   │   └── routes/         # API endpoints
│   │       ├── auth.py     # Authentication routes (غیرفعال)
│   │       ├── chat.py     # Chat routes
│   │       └── conversations.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── create_admin.py     # Admin user creation script
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── WelcomePage.tsx
│   │   ├── lib/
│   │   │   └── api.ts      # API client
│   │   └── App.tsx
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## 🔌 API Endpoints

### Conversations
- `GET /api/conversations` - دریافت لیست گفتگوها
- `POST /api/conversations` - ایجاد گفتگوی جدید
- `DELETE /api/conversations/{id}` - حذف گفتگو
- `GET /api/conversations/{id}/messages` - دریافت پیام‌های یک گفتگو

### Chat
- `POST /api/chat` - ارسال پیام و دریافت پاسخ از bot

مستندات کامل API در آدرس http://localhost:8000/docs در دسترس است.

## 🔧 تنظیمات

### Backend Environment Variables
فایل: `backend/.env`
```env
DATABASE_URL=postgresql://shahrzad:shahrzad_password@database:5432/shahrzad_db
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Optional: External LLM API
LLM_API_URL=
LLM_API_KEY=
```

### Frontend Environment Variables
فایل: `frontend/.env`
```env
VITE_API_URL=http://localhost:8000/api
```

## 🌟 ویژگی‌ها

- 📱 رابط کاربری مدرن و mobile-friendly
- 💬 سیستم چت با ذخیره تاریخچه
- 📂 مدیریت conversations متعدد
- 🐳 Docker-ready برای deployment آسان
- 📊 API documentation خودکار با Swagger
- 🔄 Data persistence با PostgreSQL
- 🚀 عملکرد بالا با FastAPI async
- 🎨 طراحی زیبا با Tailwind CSS

## 🛠️ Development

### Frontend Development
```bash
cd frontend

# نصب dependencies
npm install

# اجرای dev server
npm run dev

# Build production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Backend Development
```bash
cd backend

# ایجاد virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# یا
venv\Scripts\activate  # Windows

# نصب dependencies
pip install -r requirements.txt

# اجرای dev server
uvicorn app.main:app --reload
```

## 📖 مستندات بیشتر

- [راهنمای کامل دیپلوی](./DEPLOYMENT-GUIDE.md)
- [لیست تغییرات](./CHANGES.md)
- [مستندات API](http://localhost:8000/docs) (بعد از راه‌اندازی)

## 🐛 عیب‌یابی

### Backend به دیتابیس متصل نمی‌شود
```bash
docker-compose logs database
docker-compose logs backend
```

### Frontend به Backend متصل نمی‌شود
- بررسی کنید که backend در حال اجراست
- لاگ‌های nginx را چک کنید
- مطمئن شوید network بین services برقرار است

### Database migration issues
جداول به صورت خودکار توسط SQLAlchemy ایجاد می‌شوند. اگر مشکلی وجود دارد:
```bash
docker-compose down -v  # حذف volumes
docker-compose up -d --build  # rebuild و start مجدد
```

## 📄 License

این پروژه تحت مجوز خصوصی است.

## 👥 توسعه‌دهندگان

توسعه داده شده برای سیستم چت بات شهرزاد.
