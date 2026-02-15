# 🎉 تنظیمات نهایی - پروژه شهرزاد روی پورت 8090

## ✅ مشکل پورت 80 حل شد!

همه سرویس‌ها حالا از **یک پورت (8090)** قابل دسترسی هستند با استفاده از **Nginx Reverse Proxy**.

---

## 🎯 یک آدرس برای همه چیز

```
🌐 http://103.75.196.71:8090
```

این آدرس شامل:
- ✅ Frontend (رابط کاربری)
- ✅ Backend API (سرویس‌های REST)
- ✅ API Documentation (/docs)

---

## 🏗️ معماری (خلاصه)

```
Internet (پورت 8090)
    ↓
Nginx Reverse Proxy
    ├─→ Frontend (پورت 80 داخلی)
    └─→ Backend (پورت 8000 داخلی)
            ↓
        Database (پورت 5432 داخلی)
```

**فقط پورت 8090 از بیرون قابل دسترسی است!** 🔒

---

## 📦 سرویس‌ها

| نام کانتینر | سرویس | پورت External | پورت Internal | دسترسی |
|-------------|--------|---------------|---------------|---------|
| `shahrzad_nginx` | Nginx Proxy | **8090** | 80 | 🌐 عمومی |
| `shahrzad_frontend` | React UI | - | 80 | 🔒 از Nginx |
| `shahrzad_backend` | FastAPI | - | 8000 | 🔒 از Nginx |
| `shahrzad_db` | PostgreSQL | - | 5432 | 🔒 از Backend |

---

## 🚀 راه‌اندازی (3 مرحله)

### مرحله 1: ورود به پوشه پروژه

```bash
cd ~/shahrzad-chatbot
# یا پوشه‌ای که پروژه را داری
```

### مرحله 2: تنظیمات امنیتی (اختیاری برای تست)

```bash
# تولید کلید امنیتی
openssl rand -hex 32

# ویرایش docker-compose.yml
nano docker-compose.yml
# تغییر دهید:
# - خط 10: POSTGRES_PASSWORD
# - خط 28: DATABASE_URL (با همان رمز)
# - خط 29: SECRET_KEY (کلید تولید شده)
```

### مرحله 3: اجرا

```bash
bash start.sh
```

**همین!** بعد از 30-60 ثانیه پروژه آماده است.

---

## ✅ تست و بررسی

### 1. تست خودکار:

```bash
bash test-services.sh
```

### 2. تست دستی:

```bash
# چک کردن وضعیت
docker-compose ps

# تست Frontend
curl -I http://103.75.196.71:8090/

# تست Backend
curl -I http://103.75.196.71:8090/docs

# تست از مرورگر
# برو به: http://103.75.196.71:8090
```

---

## 🔀 مسیریابی URL

| URL Path | هدف | توضیح |
|----------|-----|-------|
| `/` | Frontend | صفحه اصلی و UI |
| `/api/*` | Backend | API endpoints |
| `/docs` | Backend | FastAPI documentation |
| `/openapi.json` | Backend | OpenAPI schema |

**مثال‌ها:**

```bash
# Frontend
http://103.75.196.71:8090/

# Login API
http://103.75.196.71:8090/api/auth/login

# Register API
http://103.75.196.71:8090/api/auth/register

# Chat API
http://103.75.196.71:8090/api/chat

# API Docs
http://103.75.196.71:8090/docs
```

---

## 🛠️ دستورات مفید

```bash
# راه‌اندازی
bash start.sh

# توقف
docker-compose down

# راه‌اندازی مجدد
docker-compose restart

# وضعیت
docker-compose ps

# لاگ‌ها (همه)
docker-compose logs -f

# لاگ یک سرویس خاص
docker-compose logs -f nginx
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f database

# تست سرویس‌ها
bash test-services.sh

# منابع مصرفی
docker stats
```

---

## 🔧 فایل‌های مهم

### فایل‌های اصلی:

| فایل | کاربرد |
|------|--------|
| `docker-compose.yml` | تنظیمات Docker (4 سرویس) |
| `nginx.conf` | تنظیمات Nginx Proxy |
| `start.sh` | اسکریپت راه‌اندازی خودکار |
| `test-services.sh` | اسکریپت تست سرویس‌ها |

### راهنماها:

| فایل | توضیح |
|------|--------|
| `FINAL-SETUP.md` | این فایل (راهنمای کامل) |
| `SINGLE-PORT-GUIDE.md` | راهنمای جامع تک‌پورت |
| `ARCHITECTURE-MAP.txt` | نقشه معماری |
| `PORTS-SUMMARY.txt` | خلاصه پورت‌ها |

---

## 🛡️ امنیت

### ✅ بهبودهای امنیتی:

1. **Database:**
   - ❌ پورت 5432 از بیرون قابل دسترسی نیست
   - ✅ فقط Backend می‌تواند به آن دسترسی پیدا کند

2. **Backend:**
   - ❌ پورت 8000 از بیرون قابل دسترسی نیست
   - ✅ فقط Nginx می‌تواند به آن دسترسی پیدا کند

3. **Frontend:**
   - ❌ پورت 80 از بیرون قابل دسترسی نیست
   - ✅ فقط Nginx می‌تواند به آن دسترسی پیدا کند

4. **Nginx:**
   - ✅ تنها نقطه ورودی (پورت 8090)
   - ✅ می‌تواند SSL/TLS, rate limiting و... اضافه کند

### ⚠️ پیش از استفاده واقعی:

```bash
# 1. تولید SECRET_KEY
openssl rand -hex 32

# 2. تغییر رمزها در docker-compose.yml
nano docker-compose.yml

# 3. باز کردن پورت در Firewall
sudo ufw allow 8090/tcp
sudo ufw reload
```

---

## 🔧 عیب‌یابی

### مشکل: پورت 8090 هنوز اشغال است

```bash
# پیدا کردن process
sudo lsof -i :8090

# متوقف کردن
sudo kill -9 PID
```

### مشکل: 502 Bad Gateway

```bash
# چک کردن وضعیت
docker-compose ps

# چک کردن logs
docker-compose logs nginx
docker-compose logs backend
docker-compose logs frontend

# راه‌اندازی مجدد
docker-compose restart
```

### مشکل: Frontend نمایش داده نمی‌شود

```bash
# چک کردن logs
docker-compose logs frontend

# Build مجدد
docker-compose up -d --build frontend
```

### مشکل: Backend به Database متصل نمی‌شود

```bash
# چک کردن Database
docker-compose logs database

# بررسی connection string
grep DATABASE_URL docker-compose.yml

# راه‌اندازی مجدد
docker-compose restart backend
```

### راه‌اندازی مجدد کامل:

```bash
docker-compose down
docker-compose up -d --build
```

### پاک‌سازی کامل (⚠️ داده‌ها حذف می‌شوند):

```bash
docker-compose down -v
rm -rf postgres_data/
docker-compose up -d --build
```

---

## 📊 مانیتورینگ

```bash
# منابع مصرفی real-time
docker stats

# وضعیت کانتینرها
docker-compose ps

# لاگ‌ها
docker-compose logs -f --tail=100

# بررسی health
docker inspect shahrzad_db | grep -A 5 Health
```

---

## 💾 Backup

### گرفتن Backup از Database:

```bash
mkdir -p backups
docker-compose exec -T database pg_dump -U shahrzad shahrzad_db | gzip > backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

### بازگردانی Backup:

```bash
gunzip < backups/backup_20240209_120000.sql.gz | docker-compose exec -T database psql -U shahrzad -d shahrzad_db
```

---

## 🔄 به‌روزرسانی

```bash
# توقف
docker-compose down

# دریافت تغییرات (اگر از Git استفاده می‌کنید)
git pull

# Build و Start مجدد
docker-compose up -d --build

# یا فقط یک سرویس
docker-compose up -d --build frontend
```

---

## 📚 مستندات بیشتر

- **راهنمای کامل تک‌پورت:** [SINGLE-PORT-GUIDE.md](./SINGLE-PORT-GUIDE.md)
- **نقشه معماری:** [ARCHITECTURE-MAP.txt](./ARCHITECTURE-MAP.txt)
- **خلاصه پورت‌ها:** [PORTS-SUMMARY.txt](./PORTS-SUMMARY.txt)

---

## 🎉 خلاصه

### ✅ چیزهایی که انجام شد:

- [x] پورت 80 حذف شد (مشکل حل شد)
- [x] Nginx Reverse Proxy اضافه شد
- [x] فقط پورت 8090 از بیرون قابل دسترسی
- [x] همه سرویس‌ها امن و داخلی شدند
- [x] مسیریابی خودکار با Nginx
- [x] یک نقطه دسترسی برای همه چیز

### 🎯 دسترسی:

```
🌐 http://103.75.196.71:8090
```

### 📦 کانتینرها:

```
✓ shahrzad_nginx      (پورت 8090)
✓ shahrzad_frontend   (داخلی)
✓ shahrzad_backend    (داخلی)
✓ shahrzad_db         (داخلی)
```

### 🚀 راه‌اندازی:

```bash
bash start.sh
```

---

## 🎊 موفق باشید!

اگر سوالی داشتید یا مشکلی پیش اومد:
1. ابتدا `bash test-services.sh` را اجرا کنید
2. لاگ‌ها را با `docker-compose logs -f` بررسی کنید
3. راهنماها را مطالعه کنید

**همه چیز آماده است! 🚀**
