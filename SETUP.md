# راهنمای راه‌اندازی چت‌بات شهرزاد

## پیش‌نیازها

- Docker و Docker Compose نصب باشد
- پورت 8090 آزاد باشد

## راه‌اندازی

### 1. کلون کردن پروژه

```bash
cd /path/to/project
```

### 2. بررسی فایل .env

مطمئن شوید فایل `.env` در ریشه پروژه وجود دارد و تنظیمات زیر را دارد:

```env
POSTGRES_HOST=database
POSTGRES_PORT=5432
POSTGRES_DB=shahrzad_db
POSTGRES_USER=shahrzad
POSTGRES_PASSWORD=shahrzad_password

LLM_API_URL=http://103.75.196.71:8020/chat
LLM_API_KEY=

NGINX_EXTERNAL_PORT=8090
```

### 3. ساخت و اجرای کانتینرها

```bash
# ساخت و اجرای تمام سرویس‌ها
docker compose up --build -d

# مشاهده لاگ‌ها
docker compose logs -f

# بررسی وضعیت سرویس‌ها
docker compose ps
```

### 4. بررسی سلامت سرویس‌ها

```bash
# بررسی database
docker compose exec database psql -U shahrzad -d shahrzad_db -c "SELECT version();"

# بررسی backend
curl http://localhost:8090/api

# بررسی frontend
curl http://localhost:8090
```

### 5. دسترسی به برنامه

برنامه در آدرس زیر در دسترس است:
```
http://localhost:8090
```

یا روی سرور:
```
http://103.75.196.71:8090
```

## عملیات مفید

### مشاهده لاگ‌های هر سرویس

```bash
# لاگ‌های database
docker compose logs -f database

# لاگ‌های backend
docker compose logs -f backend

# لاگ‌های frontend
docker compose logs -f frontend

# لاگ‌های nginx
docker compose logs -f nginx
```

### ری‌استارت سرویس‌ها

```bash
# ری‌استارت همه سرویس‌ها
docker compose restart

# ری‌استارت یک سرویس خاص
docker compose restart backend
```

### توقف و حذف کانتینرها

```bash
# توقف سرویس‌ها
docker compose stop

# حذف کانتینرها (داده‌های دیتابیس حفظ می‌شود)
docker compose down

# حذف کانتینرها و volumes (داده‌های دیتابیس پاک می‌شود)
docker compose down -v
```

### دسترسی به دیتابیس

```bash
# اتصال به PostgreSQL
docker compose exec database psql -U shahrzad -d shahrzad_db

# نمایش جداول
\dt

# خروج
\q
```

### اجرای Migration دستی (در صورت نیاز)

```bash
# اجرای migration از داخل کانتینر backend
docker compose exec backend python migrate_db.py
```

## عیب‌یابی

### مشکل: سرویس‌ها بالا نمی‌آیند

```bash
# بررسی لاگ‌ها
docker compose logs

# بررسی وضعیت
docker compose ps
```

### مشکل: خطای 500 از backend

```bash
# بررسی لاگ backend
docker compose logs backend

# بررسی اتصال به دیتابیس
docker compose exec backend env | grep DATABASE_URL
```

### مشکل: دیتابیس آماده نیست

```bash
# بررسی health check
docker compose ps database

# ری‌استارت database
docker compose restart database

# منتظر بمانید تا healthy شود
watch docker compose ps
```

### ساخت مجدد کامل

اگر تغییرات در کد اعمال نمی‌شود:

```bash
# توقف و حذف همه چیز
docker compose down -v

# پاک کردن image‌های قدیمی
docker compose build --no-cache

# اجرای مجدد
docker compose up -d

# مشاهده لاگ‌ها
docker compose logs -f
```

## معماری

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
    Port 8090
         │
┌────────▼────────┐
│   Nginx (Proxy) │
└────┬─────┬──────┘
     │     │
     │     └─────────────────┐
     │                       │
┌────▼──────┐       ┌───────▼────────┐
│  Frontend │       │    Backend     │
│  (React)  │       │   (FastAPI)    │
└───────────┘       └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │   PostgreSQL   │
                    └────────────────┘
```

## ساختار دیتابیس

```sql
-- جدول کاربران
users (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ
)

-- جدول جلسات چت
chat_sessions (
  id UUID PRIMARY KEY,
  title TEXT,
  user_id TEXT REFERENCES users(id),
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

-- جدول پیام‌ها
messages (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id),
  content TEXT,
  is_user BOOLEAN,
  created_at TIMESTAMPTZ
)
```

## نکات امنیتی

برای استفاده در محیط Production:

1. `SECRET_KEY` را در `.env` تغییر دهید
2. `POSTGRES_PASSWORD` را عوض کنید
3. CORS را محدود کنید (در `backend/app/main.py`)
4. HTTPS را فعال کنید
5. از volumes برای backup دیتابیس استفاده کنید
