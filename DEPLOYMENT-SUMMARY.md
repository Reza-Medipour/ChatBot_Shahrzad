# 📦 خلاصه تغییرات و راهنمای Deployment

این مستند خلاصه‌ای از تمام تغییرات و فایل‌های مربوط به deployment پروژه را شامل می‌شود.

---

## ✅ فایل‌های جدید اضافه شده

### 1️⃣ **PRODUCTION-DEPLOYMENT.md**
راهنمای جامع و کامل deployment برای سرور production

**محتوا شامل:**
- نصب Docker و Docker Compose
- تنظیمات امنیتی
- راه‌اندازی پروژه
- تنظیم Domain و SSL با Let's Encrypt
- Backup خودکار دیتابیس
- Monitoring و لاگ‌ها
- عیب‌یابی مشکلات رایج

### 2️⃣ **QUICK-START.md**
راهنمای سریع شروع برای کسانی که می‌خواهند سریع پروژه رو اجرا کنند

**محتوا شامل:**
- نصب سریع (5 دقیقه)
- دستورات یک خطی
- Checklist سریع

### 3️⃣ **deploy.sh**
اسکریپت تعاملی مدیریت پروژه با منوی فارسی

**قابلیت‌ها:**
- نصب و راه‌اندازی اولیه
- مدیریت services (Start/Stop/Restart)
- مشاهده لاگ‌ها و وضعیت
- Backup و Restore دیتابیس
- به‌روزرسانی پروژه
- پاک‌سازی
- Health Check

### 4️⃣ **backend/.env**
فایل environment variables برای backend

**محتوا:**
```env
DATABASE_URL=...
SECRET_KEY=...
LLM_API_URL=http://103.75.196.71:8020/chat
LLM_API_KEY=
```

---

## 🔧 فایل‌های به‌روزرسانی شده

### 1️⃣ **docker-compose.yml**
اضافه شدن environment variables برای LLM API:
```yaml
backend:
  environment:
    LLM_API_URL: http://103.75.196.71:8020/chat
    LLM_API_KEY: ""
```

### 2️⃣ **backend/.env.example**
اضافه شدن مثال برای LLM API:
```env
# External LLM API (Optional)
# Example: http://103.75.196.71:8020/chat
LLM_API_URL=
LLM_API_KEY=
```

---

## 🎯 نحوه استفاده

### روش 1: استفاده از اسکریپت خودکار (توصیه می‌شود)

```bash
# در سرور:
cd ~/shahrzad-chatbot
./deploy.sh
```

سپس گزینه "1" را انتخاب کنید برای نصب اولیه.

### روش 2: اجرای دستی

```bash
# تنظیم environment variables
nano docker-compose.yml  # تغییر SECRET_KEY و رمز Database

# راه‌اندازی
docker-compose up -d --build

# چک کردن وضعیت
docker-compose ps
docker-compose logs -f
```

### روش 3: Quick Start (برای سرعت بیشتر)

مستندات [QUICK-START.md](./QUICK-START.md) را دنبال کنید.

---

## 🌐 مسیر دقیق سرویس LLM در کد

سرویس LLM دقیقاً در این مسیر صدا زده می‌شود:

### فایل: `backend/app/routes/chat.py`

```python
# خط 13-38: تابع اتصال به LLM API
async def generate_bot_response(user_message: str, session_id: str) -> str:
    if settings.LLM_API_URL:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # ⭐ اینجا به سرویس خارجی وصل میشه
                response = await client.post(
                    settings.LLM_API_URL,  # http://103.75.196.71:8020/chat
                    json={
                        "session_id": session_id,
                        "message": user_message
                    },
                    headers={
                        "accept": "application/json",
                        "Content-Type": "application/json"
                    }
                )

                if response.status_code == 200:
                    data = response.json()
                    return data.get("response", "...")
        except Exception as e:
            print(f"Error calling LLM API: {e}")

    # Fallback response
    return "سلام! من چت بات شهرزاد هستم..."
```

### چگونه URL را تغییر دهیم؟

#### روش 1: از طریق docker-compose.yml
```yaml
backend:
  environment:
    LLM_API_URL: http://NEW_IP:PORT/chat
```

#### روش 2: از طریق backend/.env
```env
LLM_API_URL=http://NEW_IP:PORT/chat
```

---

## 🔐 تنظیمات امنیتی مهم

### ⚠️ قبل از Production حتماً:

1. **تغییر SECRET_KEY**
   ```bash
   openssl rand -hex 32
   # خروجی را در docker-compose.yml قرار دهید
   ```

2. **تغییر رمز Database**
   ```yaml
   POSTGRES_PASSWORD: رمز_قوی_خودتان
   DATABASE_URL: postgresql://shahrzad:رمز_قوی_خودتان@database:5432/shahrzad_db
   ```

3. **بستن پورت Database**
   در docker-compose.yml این خطوط را comment کنید:
   ```yaml
   # ports:
   #   - "5432:5432"
   ```

4. **تنظیم Firewall**
   ```bash
   sudo ufw allow 22,80,443/tcp
   sudo ufw enable
   ```

5. **فعال‌سازی SSL**
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

---

## 📊 دستورات مفید

### مدیریت پروژه:
```bash
# شروع
docker-compose up -d

# توقف
docker-compose down

# راه‌اندازی مجدد
docker-compose restart

# مشاهده لاگ‌ها
docker-compose logs -f

# وضعیت سرویس‌ها
docker-compose ps

# مصرف منابع
docker stats
```

### Backup:
```bash
# گرفتن backup
docker-compose exec -T database pg_dump -U shahrzad shahrzad_db | gzip > backup_$(date +%Y%m%d).sql.gz

# بازگردانی backup
gunzip < backup_20240208.sql.gz | docker-compose exec -T database psql -U shahrzad -d shahrzad_db
```

### عیب‌یابی:
```bash
# چک کردن سلامت Database
docker-compose exec database psql -U shahrzad -d shahrzad_db -c "SELECT 1;"

# چک کردن Backend
curl http://localhost:8000/docs

# چک کردن Frontend
curl -I http://localhost

# چک کردن LLM API
curl -X POST http://103.75.196.71:8020/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","message":"سلام"}'
```

### دسترسی به Shell:
```bash
# Shell Backend
docker-compose exec backend bash

# SQL Shell
docker-compose exec database psql -U shahrzad -d shahrzad_db
```

---

## 📁 ساختار فایل‌های Deployment

```
project/
├── PRODUCTION-DEPLOYMENT.md    # راهنمای کامل production
├── DEPLOYMENT-GUIDE.md         # راهنمای توسعه
├── QUICK-START.md              # راهنمای سریع
├── DEPLOYMENT-SUMMARY.md       # این فایل
├── deploy.sh                   # اسکریپت مدیریتی (executable)
├── docker-compose.yml          # تنظیمات Docker (به‌روز شده)
├── backend/
│   ├── .env                    # Environment variables (جدید)
│   └── .env.example            # نمونه (به‌روز شده)
└── frontend/
    └── ...
```

---

## 🚀 مراحل Deploy روی سرور

### مرحله 1: آماده‌سازی سرور
1. اتصال به سرور: `ssh root@SERVER_IP`
2. نصب Docker: `curl -fsSL https://get.docker.com | sh`
3. نصب Docker Compose: [دستورات در QUICK-START.md](./QUICK-START.md)

### مرحله 2: دریافت پروژه
1. کلون: `git clone REPO_URL shahrzad-chatbot`
2. یا آپلود با: `scp -r project/ root@SERVER_IP:~/`

### مرحله 3: تنظیمات
1. تغییر SECRET_KEY در docker-compose.yml
2. تغییر رمز Database
3. چک کردن LLM_API_URL

### مرحله 4: راه‌اندازی
1. استفاده از اسکریپت: `./deploy.sh`
2. یا دستی: `docker-compose up -d --build`

### مرحله 5: تست
1. چک کردن services: `docker-compose ps`
2. تست Frontend: `http://SERVER_IP`
3. تست Backend: `http://SERVER_IP:8000/docs`

### مرحله 6: امنیت (اختیاری ولی توصیه می‌شود)
1. تنظیم Firewall
2. نصب SSL با Certbot
3. بستن دسترسی مستقیم به Database

---

## 🔄 جریان درخواست (Request Flow)

```
┌─────────────┐
│   کاربر     │
│  "سلام"    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Frontend (React)                        │
│ POST /api/chat                          │
│ { session_id, message: "سلام" }        │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Backend (FastAPI)                       │
│ routes/chat.py                          │
│ 1. ذخیره پیام در Database              │
│ 2. فراخوانی generate_bot_response()    │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ External LLM API                        │
│ 🌐 http://103.75.196.71:8020/chat      │
│ POST { session_id, message }            │
└──────┬──────────────────────────────────┘
       │
       │ {"response": "سلام! چطور می‌تونم..."}
       ▼
┌─────────────────────────────────────────┐
│ Backend                                 │
│ 1. دریافت جواب از LLM                  │
│ 2. ذخیره در Database                   │
│ 3. برگشت به Frontend                    │
└──────┬──────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│ Frontend                                │
│ نمایش جواب به کاربر                    │
└─────────────────────────────────────────┘
```

---

## 📞 پشتیبانی و سوالات

### مشکلات رایج:

1. **Backend به Database وصل نمیشه**
   - چک کنید Database healthy باشه
   - رمز Database رو در هر دو جا یکسان کنید

2. **LLM API جواب نمیده**
   - تست کنید سرویس از سرور شما قابل دسترسی باشه
   - چک کنید LLM_API_URL درست تنظیم شده باشه

3. **Frontend نمایش داده نمیشه**
   - چک کنید پورت 80 باز باشه
   - لاگ‌های nginx رو بررسی کنید

### لاگ‌های مفید:
```bash
# همه لاگ‌ها
docker-compose logs -f

# فقط خطاها
docker-compose logs | grep -i error

# لاگ یک سرویس
docker-compose logs -f backend
```

---

## 📚 مستندات کامل

| فایل | توضیح |
|------|-------|
| [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md) | راهنمای کامل production با SSL و امنیت |
| [QUICK-START.md](./QUICK-START.md) | راهنمای سریع 5 دقیقه‌ای |
| [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) | راهنمای توسعه و deployment |
| [README.md](./README.md) | معرفی کلی پروژه |
| این فایل | خلاصه تغییرات و دستورات |

---

## ✅ Checklist نهایی

قبل از production این موارد را چک کنید:

- [ ] Docker و Docker Compose نصب شده
- [ ] پروژه دانلود/آپلود شده
- [ ] SECRET_KEY تولید و تغییر کرده
- [ ] رمز Database تغییر کرده
- [ ] LLM_API_URL صحیح است
- [ ] پورت 5432 از بیرون قابل دسترسی نیست
- [ ] Firewall تنظیم شده
- [ ] SSL نصب شده (برای domain)
- [ ] Backup خودکار تنظیم شده
- [ ] همه services سالم هستند
- [ ] تست کلی انجام شده

---

## 🎉 تمام!

همه چیز آماده است! برای شروع:

```bash
cd ~/shahrzad-chatbot
./deploy.sh
```

موفق باشید! 🚀
