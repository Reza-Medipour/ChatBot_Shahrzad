# تغییرات انجام شده در پروژه

## خلاصه تغییرات

پروژه از یک اپلیکیشن React با Supabase به یک معماری حرفه‌ای با Backend جدا، Frontend جدا، و دیتابیس لوکال PostgreSQL تبدیل شده است.

## 🏗️ معماری جدید

### قبل
```
React App → Supabase (Cloud) → External LLM API
```

### بعد
```
┌─────────────────────────────────────────────┐
│           Docker Compose                     │
├───────────┬──────────────┬──────────────────┤
│ Frontend  │   Backend    │   PostgreSQL     │
│ (React)   │  (FastAPI)   │   (Local)        │
│ Port 80   │  Port 8000   │   Port 5432      │
└───────────┴──────────────┴──────────────────┘
```

## 📋 تغییرات اصلی

### 1. Backend (جدید)
ساختار کامل Backend با FastAPI ایجاد شد:

**فایل‌های جدید:**
- `backend/app/main.py` - FastAPI application
- `backend/app/database.py` - Database connection و session management
- `backend/app/models.py` - SQLAlchemy models (User, ChatSession, Message)
- `backend/app/schemas.py` - Pydantic schemas برای validation
- `backend/app/auth.py` - JWT authentication logic
- `backend/app/config.py` - Settings management
- `backend/app/routes/auth.py` - Authentication endpoints
- `backend/app/routes/chat.py` - Chat endpoints
- `backend/app/routes/conversations.py` - Conversation management
- `backend/requirements.txt` - Python dependencies
- `backend/Dockerfile` - Backend Docker image
- `backend/create_admin.py` - Script برای ایجاد admin user

**ویژگی‌های Backend:**
- ✅ RESTful API با FastAPI
- ✅ JWT-based authentication
- ✅ Password hashing با bcrypt
- ✅ SQLAlchemy ORM
- ✅ Async operations
- ✅ Automatic API documentation (Swagger/OpenAPI)
- ✅ CORS configuration
- ✅ Database connection pooling

### 2. Frontend (تغییرات)

**فایل‌های جدید:**
- `src/lib/api.ts` - API client برای ارتباط با Backend

**فایل‌های تغییر یافته:**
- `src/App.tsx` - حذف Supabase، اضافه شدن API client و auth management
- `src/components/Sidebar.tsx` - اضافه شدن logout functionality
- `src/components/ChatInterface.tsx` - تغییر import از supabase به api
- `src/components/LoginPage.tsx` - تغییر کامل به username/password authentication

**فایل‌های حذف شده:**
- `src/lib/supabase.ts` - دیگه Supabase استفاده نمی‌شه
- `src/components/UsernameLoginPage.tsx` - منسوخ شد
- `src/components/RegistrationPage.tsx` - منسوخ شد
- `supabase/migrations/` - دیتابیس لوکال شد

### 3. Database (تغییر به PostgreSQL لوکال)

**قبل:**
- Supabase Cloud Database

**بعد:**
- PostgreSQL 15 در Docker container
- Data persistence با Docker volumes
- Models با SQLAlchemy
- Auto-creation of tables

**Schema:**
```sql
users:
  - id (UUID)
  - phone_number (TEXT, UNIQUE)
  - username (TEXT, UNIQUE)
  - password (TEXT, hashed)
  - is_registered (BOOLEAN)
  - created_at (TIMESTAMP)
  - last_login (TIMESTAMP)

chat_sessions:
  - id (UUID)
  - title (TEXT)
  - user_id (UUID, FK)
  - created_at (TIMESTAMP)
  - updated_at (TIMESTAMP)

messages:
  - id (UUID)
  - session_id (UUID, FK)
  - content (TEXT)
  - is_user (BOOLEAN)
  - created_at (TIMESTAMP)
```

### 4. Docker & Deployment

**فایل‌های جدید:**
- `docker-compose.yml` - Orchestration برای 3 services
- `backend/Dockerfile` - Backend container
- `backend/.dockerignore` - Backend build optimization
- `nginx.conf` - تغییر برای proxy به backend

**فایل‌های تغییر یافته:**
- `Dockerfile` (frontend) - همان ساختار ولی با nginx config جدید
- `.dockerignore` - بهینه‌سازی
- `.env` - تغییر از Supabase به API URL

### 5. مستندات

**فایل‌های جدید:**
- `DEPLOYMENT-GUIDE.md` - راهنمای کامل deployment
- `CHANGES.md` - این فایل

**فایل‌های تغییر یافته:**
- `README.md` - کامل بازنویسی برای معماری جدید

## 🔄 تغییرات در Flow برنامه

### Authentication Flow

**قبل (Supabase):**
```
User → Phone Number → SMS Code → Supabase Auth
```

**بعد (JWT):**
```
User → Username/Password → Backend API → JWT Token → LocalStorage
```

### Chat Flow

**قبل:**
```
User → Frontend → Supabase (Save) → External API → Supabase (Save) → Frontend
```

**بعد:**
```
User → Frontend → Backend API → PostgreSQL (Save) → LLM API → Backend → Frontend
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Conversations
- `GET /api/conversations` - List conversations
- `POST /api/conversations` - Create conversation
- `DELETE /api/conversations/{id}` - Delete conversation
- `GET /api/conversations/{id}/messages` - Get messages
- `POST /api/conversations/{id}/messages` - Create message

### Chat
- `POST /api/chat` - Send message and get bot response

## 🔧 Environment Variables

### قبل
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### بعد

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:8000/api
```

**Backend (backend/.env):**
```env
DATABASE_URL=postgresql://shahrzad:shahrzad_password@database:5432/shahrzad_db
SECRET_KEY=your-secret-key-change-in-production
```

## 🚀 دستورات اجرا

### قبل
```bash
npm install
npm run dev
```

### بعد
```bash
docker-compose up -d --build
docker-compose exec backend python create_admin.py
```

## ✅ مزایای معماری جدید

1. **مقیاس‌پذیری**: هر سرویس مستقل scale می‌شود
2. **امنیت**: Backend به عنوان middleware کنترل دارد
3. **سرعت**: FastAPI async و خیلی سریع است
4. **استقلال**: هیچ وابستگی به سرویس ابری نیست
5. **کنترل**: کنترل کامل روی database و logic
6. **هزینه**: بدون هزینه cloud services
7. **توسعه**: separation of concerns واضح
8. **تست**: آسان‌تر برای unit testing و integration testing

## 📊 مقایسه سایز

### قبل
- Frontend: ~167 KB (gzipped)
- Backend: Cloud (Supabase)
- Database: Cloud (Supabase)

### بعد
- Frontend: ~167 KB (gzipped) - بدون تغییر
- Backend: Docker image ~200 MB
- Database: Docker image ~80 MB

## 🔒 امنیت

### بهبودهای امنیتی
- ✅ JWT token expiration (7 days)
- ✅ Password hashing با bcrypt
- ✅ CORS configuration
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ Environment variables برای secrets
- ✅ No direct database access from frontend

## 🎓 تکنولوژی‌های جدید

### Backend Stack
- Python 3.11
- FastAPI 0.109
- SQLAlchemy 2.0
- PostgreSQL 15
- Uvicorn
- Pydantic
- JWT (python-jose)
- Passlib + Bcrypt

### DevOps
- Docker
- Docker Compose
- Nginx (as reverse proxy)

## 📝 نکات مهم

1. **SECRET_KEY**: حتماً در production تغییر دهید
2. **Database Password**: رمز قوی انتخاب کنید
3. **Backup**: به صورت منظم از database backup بگیرید
4. **SSL**: در production از HTTPS استفاده کنید
5. **Monitoring**: لاگ‌ها را monitor کنید

## 🐛 Breaking Changes

- Supabase SDK حذف شد - باید به API client تغییر کنید
- Phone authentication حذف شد - Username/Password استفاده شود
- Environment variables تغییر کرد - `.env` را update کنید
- Deployment method تغییر کرد - از Docker Compose استفاده کنید

## 📞 پشتیبانی

برای هر گونه سوال یا مشکل، به مستندات زیر مراجعه کنید:
- `README.md` - راهنمای اصلی
- `DEPLOYMENT-GUIDE.md` - راهنمای deployment
- Backend API Docs: http://localhost:8000/docs
