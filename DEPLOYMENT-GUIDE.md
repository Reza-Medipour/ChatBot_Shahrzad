# راهنمای دیپلوی پروژه شهرزاد

این پروژه شامل سه سرویس اصلی است که با Docker Compose مدیریت می‌شوند:

1. **Frontend** - React + Vite + Nginx (Port 80)
2. **Backend** - FastAPI (Port 8000)
3. **Database** - PostgreSQL 15 (Port 5432)

## پیش‌نیازها

- Docker
- Docker Compose
- Git

## نصب و راه‌اندازی

### 1. کلون کردن پروژه

```bash
git clone <repository-url>
cd project
```

### 2. تنظیمات محیطی (اختیاری)

فایل‌های `.env` در دایرکتوری‌های مختلف موجود هستند:

**Backend (.env در پوشه backend):**
```bash
DATABASE_URL=postgresql://shahrzad:shahrzad_password@database:5432/shahrzad_db
SECRET_KEY=your-secret-key-change-in-production
```

**Frontend (.env در root):**
```bash
VITE_API_URL=http://localhost:8000/api
```

> **نکته امنیتی**: در محیط production حتماً SECRET_KEY را تغییر دهید!

### 3. ساخت و اجرای کانتینرها

برای راه‌اندازی همه سرویس‌ها:

```bash
docker-compose up -d --build
```

این دستور:
- PostgreSQL را راه‌اندازی می‌کند
- Backend را build و اجرا می‌کند
- Frontend را build و اجرا می‌کند

### 4. بررسی وضعیت سرویس‌ها

```bash
docker-compose ps
```

### 5. مشاهده لاگ‌ها

مشاهده لاگ همه سرویس‌ها:
```bash
docker-compose logs -f
```

مشاهده لاگ یک سرویس خاص:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

## دسترسی به سرویس‌ها

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **Backend Docs**: http://localhost:8000/docs
- **Database**: localhost:5432

## ایجاد کاربر اولیه

برای ایجاد اولین کاربر، از API استفاده کنید:

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "09123456789",
    "username": "admin",
    "password": "admin123"
  }'
```

یا از Swagger UI در آدرس http://localhost:8000/docs استفاده کنید.

## دستورات مفید

### متوقف کردن همه سرویس‌ها
```bash
docker-compose down
```

### متوقف کردن و پاک کردن volumes (حذف دیتابیس)
```bash
docker-compose down -v
```

### Rebuild کردن سرویس‌ها
```bash
docker-compose up -d --build
```

### دسترسی به shell کانتینر
```bash
docker-compose exec backend bash
docker-compose exec database psql -U shahrzad -d shahrzad_db
```

### Restart کردن یک سرویس
```bash
docker-compose restart backend
```

## استفاده در Production

### 1. تغییر تنظیمات امنیتی

در فایل `docker-compose.yml`:
- رمز دیتابیس را تغییر دهید
- SECRET_KEY را تغییر دهید (حداقل 32 کاراکتر)

### 2. استفاده از Docker Swarm یا Kubernetes

برای مقیاس‌پذیری بهتر می‌توانید از Docker Swarm یا Kubernetes استفاده کنید.

### 3. Backup دیتابیس

```bash
docker-compose exec database pg_dump -U shahrzad shahrzad_db > backup.sql
```

بازگردانی:
```bash
docker-compose exec -T database psql -U shahrzad shahrzad_db < backup.sql
```

### 4. SSL/TLS

برای production، حتماً از Nginx با SSL استفاده کنید و Let's Encrypt را پیکربندی کنید.

## عیب‌یابی

### Backend به دیتابیس متصل نمی‌شود

بررسی کنید که دیتابیس healthy است:
```bash
docker-compose ps
docker-compose logs database
```

### Frontend به Backend متصل نمی‌شود

بررسی کنید که:
1. Backend در حال اجراست: `docker-compose logs backend`
2. Nginx configuration صحیح است
3. Network بین سرویس‌ها برقرار است

### دیتابیس خالی است

جداول به صورت خودکار توسط SQLAlchemy ایجاد می‌شوند. اگر مشکلی وجود دارد:
```bash
docker-compose logs backend
```

## معماری پروژه

```
project/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── main.py      # FastAPI application
│   │   ├── models.py    # Database models
│   │   ├── schemas.py   # Pydantic schemas
│   │   ├── auth.py      # Authentication
│   │   └── routes/      # API endpoints
│   ├── Dockerfile
│   └── requirements.txt
├── src/                 # React Frontend
├── Dockerfile           # Frontend Dockerfile
├── nginx.conf           # Nginx configuration
└── docker-compose.yml   # Docker orchestration
```

## پورت‌ها

- **80**: Frontend (Nginx)
- **8000**: Backend API
- **5432**: PostgreSQL Database

## امنیت

⚠️ **هشدارهای امنیتی**:

1. در production، SECRET_KEY را تغییر دهید
2. رمز دیتابیس را قوی انتخاب کنید
3. از HTTPS استفاده کنید
4. CORS را به درستی تنظیم کنید
5. Rate limiting را فعال کنید
6. Regular backup از دیتابیس بگیرید

## پشتیبانی

برای سوالات و مشکلات، issue ایجاد کنید.
