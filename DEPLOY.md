# راهنمای Deploy

## مرحله 1: کپی فایل‌ها به سرور

```bash
# روی سیستم محلی
scp -r /path/to/project reza@srv6291707733:~/ChatBot_Shahrzad_BFD
```

## مرحله 2: ساخت فایل .env روی سرور

```bash
# روی سرور
cd ~/ChatBot_Shahrzad_BFD

# ساخت فایل .env
nano .env
```

محتوای فایل `.env`:

```env
POSTGRES_HOST=database
POSTGRES_PORT=5432
POSTGRES_DB=shahrzad_db
POSTGRES_USER=shahrzad
POSTGRES_PASSWORD=shahrzad_password

BACKEND_HOST=backend
BACKEND_PORT=8000

FRONTEND_HOST=frontend
FRONTEND_PORT=80

NGINX_EXTERNAL_PORT=8090
NGINX_INTERNAL_PORT=80

SECRET_KEY=your-secret-key-change-in-production-min-32-chars-long-for-security
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

LLM_API_URL=http://103.75.196.71:8020/chat
LLM_API_KEY=
```

## مرحله 3: اجرای Docker

```bash
# Build و اجرا
docker compose up -d --build

# بررسی وضعیت
docker compose ps

# مشاهده لاگ‌ها
docker compose logs -f
```

## مرحله 4: تست

```bash
# تست API
curl http://103.75.196.71:8090/api/health

# دسترسی از مرورگر
http://103.75.196.71:8090
```

## رفع مشکلات رایج

### خطای "variable is not set"

این خطا وقتی رخ می‌دهد که فایل `.env` در پوشه اصلی پروژه وجود نداشته باشد.

**راه حل:**
```bash
cd ~/ChatBot_Shahrzad_BFD
ls -la .env  # باید فایل .env را نشان دهد

# اگر فایل وجود نداشت
nano .env  # محتوای بالا را کپی کنید
```

### خطای 404 Not Found

**بررسی:**
```bash
docker compose logs backend
docker compose logs nginx
```

**راه حل:**
```bash
docker compose restart backend
docker compose restart nginx
```

### مشکل دیتابیس

**ریست کامل:**
```bash
docker compose down -v
docker compose up -d --build
```

## ساختار Routing

```
مرورگر → http://103.75.196.71:8090/api/conversations
    ↓
Nginx → http://backend:8000/api/conversations
    ↓
FastAPI → /api/conversations (endpoint)
```

## نکات مهم

1. فایل `.env` باید در پوشه اصلی پروژه باشد
2. پورت 8090 باید آزاد باشد
3. Docker و Docker Compose باید نصب باشند
4. برای تغییر SECRET_KEY از دستور زیر استفاده کنید:
   ```bash
   openssl rand -hex 32
   ```
