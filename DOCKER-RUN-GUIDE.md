# 🚀 راهنمای اجرای پروژه با Docker

## 📋 پیش‌نیازها

قبل از شروع، مطمئن شوید که موارد زیر نصب هستند:
- Docker
- Docker Compose

## 🎯 راه‌اندازی سریع (3 مرحله)

### مرحله 1: دانلود پروژه
```bash
git clone <repository-url> shahrzad-chatbot
cd shahrzad-chatbot
```

### مرحله 2: اجرای Docker Compose
```bash
docker-compose up -d --build
```

این دستور:
- ✅ دیتابیس PostgreSQL رو راه‌اندازی می‌کنه
- ✅ Backend (FastAPI) رو بالا می‌آره
- ✅ Frontend (React) رو build و اجرا می‌کنه
- ✅ Nginx رو به عنوان reverse proxy راه‌اندازی می‌کنه

### مرحله 3: باز کردن مرورگر
پروژه در آدرس زیر در دسترسه:
```
http://localhost:8090
```

## 📊 بررسی وضعیت سرویس‌ها

برای مشاهده وضعیت همه سرویس‌ها:
```bash
docker-compose ps
```

باید 4 container در حال اجرا باشند:
- ✅ `shahrzad_db` - دیتابیس PostgreSQL
- ✅ `shahrzad_backend` - Backend API
- ✅ `shahrzad_frontend` - Frontend React
- ✅ `shahrzad_nginx` - Nginx Proxy

## 📋 دستورات مفید

### مشاهده لاگ‌ها
```bash
# همه سرویس‌ها
docker-compose logs -f

# فقط backend
docker-compose logs -f backend

# فقط frontend
docker-compose logs -f frontend

# فقط database
docker-compose logs -f database
```

### توقف و حذف
```bash
# توقف همه سرویس‌ها (حفظ data)
docker-compose stop

# توقف و حذف containers (حفظ data)
docker-compose down

# توقف و حذف همه چیز شامل volumes (حذف data)
docker-compose down -v
```

### Restart سرویس‌ها
```bash
# Restart همه
docker-compose restart

# Restart فقط backend
docker-compose restart backend
```

### Rebuild پروژه
اگر فایل‌های کد رو تغییر دادی:
```bash
docker-compose down
docker-compose up -d --build
```

## 🔧 دسترسی به داخل Containers

### Backend Shell
```bash
docker-compose exec backend bash
```

### دیتابیس (PostgreSQL CLI)
```bash
docker-compose exec database psql -U shahrzad -d shahrzad_db
```

دستورات مفید PostgreSQL:
```sql
-- لیست جداول
\dt

-- مشاهده ساختار جدول
\d chat_sessions
\d messages
\d users

-- مشاهده تعداد رکوردها
SELECT COUNT(*) FROM chat_sessions;
SELECT COUNT(*) FROM messages;

-- خروج
\q
```

## 📊 API Documentation

بعد از راه‌اندازی، مستندات API در آدرس زیر قابل دسترس است:
```
http://localhost:8090/docs
```

## 🐛 عیب‌یابی

### مشکل: Backend بالا نمیاد
```bash
# چک کردن لاگ backend
docker-compose logs backend

# معمولاً مشکل از دیتابیس است. چک کن که database آماده باشه
docker-compose logs database
```

### مشکل: Frontend 404 میده
```bash
# چک کردن nginx
docker-compose logs nginx

# Rebuild frontend
docker-compose up -d --build frontend
```

### مشکل: دیتابیس connect نمیشه
```bash
# پاک کردن همه چیز و شروع مجدد
docker-compose down -v
docker-compose up -d --build
```

### مشکل: Port 8090 در حال استفاده است
اگر Port 8090 روی سیستمت استفاده شده، می‌تونی تو `docker-compose.yml` تغییرش بدی:
```yaml
nginx:
  ports:
    - "8091:80"  # به جای 8090
```

## 🔒 امنیت (مهم برای Production)

قبل از استفاده در production، حتماً موارد زیر رو انجام بده:

1. **تغییر SECRET_KEY** در `docker-compose.yml`:
```bash
# تولید کلید امن
openssl rand -hex 32
```

2. **تغییر password دیتابیس** در `docker-compose.yml`

3. **محدود کردن CORS** در `backend/app/main.py`

## 📦 Backup و Restore

### Backup دیتابیس
```bash
docker-compose exec database pg_dump -U shahrzad shahrzad_db > backup_$(date +%Y%m%d).sql
```

### Restore دیتابیس
```bash
docker-compose exec -T database psql -U shahrzad shahrzad_db < backup_20240216.sql
```

## 💡 نکات مهم

1. اولین بار که اجرا می‌کنی، ممکنه چند دقیقه طول بکشه (به خاطر build کردن images)
2. data دیتابیس در volume ذخیره میشه و با `docker-compose down` حذف نمیشه
3. برای حذف کامل data باید `docker-compose down -v` بزنی
4. همیشه بعد از تغییر کد، rebuild کن: `docker-compose up -d --build`

## 🎉 تمام!

حالا می‌تونی از چت بات شهرزاد استفاده کنی در:
```
http://localhost:8090
```
