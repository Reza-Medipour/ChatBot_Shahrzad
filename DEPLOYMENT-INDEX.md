# 📖 راهنمای انتخاب مستندات مناسب

اگر نمی‌دانید از کدام مستند استفاده کنید، این راهنما به شما کمک می‌کند!

---

## 🎯 من چه کسی هستم؟

### 👨‍💻 توسعه‌دهنده هستم (Developer)

من می‌خواهم روی پروژه کار کنم و آن را توسعه دهم:

➡️ **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)**
- راه‌اندازی محلی با Docker
- راهنمای توسعه Frontend و Backend
- دستورات مفید برای development

---

### ⚡ می‌خوام سریع شروع کنم (Quick Start)

من فقط می‌خوام سریع پروژه رو اجرا کنم:

➡️ **[QUICK-START.md](./QUICK-START.md)**
- نصب سریع (5 دقیقه)
- دستورات یک خطی
- بدون توضیحات اضافی

---

### 🚀 می‌خوام روی سرور production بذارم (Production)

من یک سرور دارم و می‌خواهم پروژه را به صورت حرفه‌ای deploy کنم:

➡️ **[PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md)**
- نصب Docker و Docker Compose
- تنظیمات امنیتی کامل
- راه‌اندازی Domain و SSL
- Backup خودکار
- Monitoring و troubleshooting

---

### 🛠️ می‌خوام با اسکریپت خودکار کار کنم (Automated)

من می‌خوام همه چیز خودکار باشه و با منو کار کنم:

➡️ **استفاده از `deploy.sh`**
```bash
./deploy.sh
```

این اسکریپت شامل:
- نصب و راه‌اندازی اولیه
- مدیریت services
- Backup و Restore
- مشاهده لاگ‌ها
- Health Check
- و بیشتر...

---

### 📋 می‌خوام خلاصه تغییرات رو ببینم (Summary)

من می‌خوام بدونم چه تغییراتی اعمال شده و چطور از LLM API استفاده کنم:

➡️ **[DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md)**
- خلاصه فایل‌های اضافه شده
- مسیر دقیق سرویس LLM در کد
- تنظیمات امنیتی مهم
- دستورات مفید
- Checklist نهایی

---

### 📚 می‌خوام کلیت پروژه رو بدونم (Overview)

من می‌خوام درباره پروژه و معماری اون بدونم:

➡️ **[README.md](./README.md)**
- معرفی پروژه
- معماری سیستم
- ویژگی‌ها
- API Endpoints
- ساختار پروژه

---

## 🗺️ نقشه راه (Roadmap)

### سناریو 1: Developer محلی

```
1. README.md → معرفی پروژه
   ↓
2. DEPLOYMENT-GUIDE.md → راه‌اندازی محلی
   ↓
3. شروع توسعه
```

### سناریو 2: Deploy سریع

```
1. QUICK-START.md → دستورات سریع
   ↓
2. اجرای deploy.sh
   ↓
3. پروژه آماده!
```

### سناریو 3: Deploy حرفه‌ای Production

```
1. README.md → درک پروژه
   ↓
2. PRODUCTION-DEPLOYMENT.md → آماده‌سازی سرور
   ↓
3. DEPLOYMENT-SUMMARY.md → چک کردن تنظیمات
   ↓
4. deploy.sh → راه‌اندازی
   ↓
5. مراحل امنیتی (SSL, Firewall)
   ↓
6. Monitoring و Backup
```

### سناریو 4: عیب‌یابی مشکل

```
1. DEPLOYMENT-SUMMARY.md → دستورات عیب‌یابی
   ↓
2. docker-compose logs → مشاهده خطاها
   ↓
3. PRODUCTION-DEPLOYMENT.md → بخش Troubleshooting
```

---

## 📑 جدول مقایسه مستندات

| مستند | مخاطب | زمان مطالعه | سطح جزئیات |
|-------|--------|-------------|-------------|
| **README.md** | همه | 5 دقیقه | کلی |
| **QUICK-START.md** | مبتدی | 3 دقیقه | خیلی کم |
| **DEPLOYMENT-GUIDE.md** | Developer | 10 دقیقه | متوسط |
| **PRODUCTION-DEPLOYMENT.md** | DevOps/SysAdmin | 30 دقیقه | خیلی زیاد |
| **DEPLOYMENT-SUMMARY.md** | همه | 7 دقیقه | متوسط |
| **deploy.sh** | همه | - | تعاملی |

---

## 🔍 جستجوی سریع

### می‌خوام بدونم...

| سوال | جواب در |
|------|---------|
| چطوری Docker نصب کنم؟ | PRODUCTION-DEPLOYMENT.md → بخش 3 |
| چطوری پروژه رو شروع کنم؟ | QUICK-START.md |
| LLM API کجا وارد میشه؟ | DEPLOYMENT-SUMMARY.md → بخش "مسیر دقیق" |
| چطوری Backup بگیرم؟ | PRODUCTION-DEPLOYMENT.md → بخش 8 |
| چطوری SSL نصب کنم؟ | PRODUCTION-DEPLOYMENT.md → بخش 7 |
| مشکل Database دارم | PRODUCTION-DEPLOYMENT.md → بخش 10 |
| دستور سریع برای لاگ؟ | DEPLOYMENT-SUMMARY.md → بخش دستورات |
| معماری پروژه چیه؟ | README.md → بخش معماری |

---

## 💡 پیشنهاد من چیه؟

### اگر تازه کار هستید:
1. ابتدا **README.md** را بخوانید
2. سپس از **QUICK-START.md** استفاده کنید
3. اگر مشکلی پیش آمد **DEPLOYMENT-SUMMARY.md** را چک کنید

### اگر با Docker آشنا هستید:
1. **QUICK-START.md** را مرور کنید
2. مستقیم **deploy.sh** را اجرا کنید

### اگر می‌خواهید production حرفه‌ای:
1. **PRODUCTION-DEPLOYMENT.md** را کامل مطالعه کنید
2. تمام مراحل را دنبال کنید
3. **DEPLOYMENT-SUMMARY.md** را برای چک نهایی ببینید

---

## 📞 نیاز به کمک؟

### مشکلات رایج:

1. **Docker نصب نمیشه**
   → PRODUCTION-DEPLOYMENT.md → بخش 3

2. **Backend به Database وصل نمیشه**
   → PRODUCTION-DEPLOYMENT.md → بخش 10 → مشکل 1

3. **نمی‌دونم از کجا شروع کنم**
   → QUICK-START.md

4. **می‌خوام LLM API رو تغییر بدم**
   → DEPLOYMENT-SUMMARY.md → بخش "مسیر دقیق سرویس LLM"

5. **نمی‌دونم چه امنیتی‌هایی لازمه**
   → PRODUCTION-DEPLOYMENT.md → بخش 5
   → DEPLOYMENT-SUMMARY.md → بخش "تنظیمات امنیتی"

---

## 🎯 دستورات فوری

### فقط می‌خوام شروع کنم:
```bash
./deploy.sh
```

### فقط می‌خوام لاگ ببینم:
```bash
docker-compose logs -f
```

### فقط می‌خوام Backup بگیرم:
```bash
./deploy.sh  # سپس گزینه 8 را انتخاب کنید
```

### فقط می‌خوام وضعیت ببینم:
```bash
docker-compose ps
```

---

## 🗂️ ساختار کامل فایل‌های مستندات

```
📁 project/
│
├── 📄 README.md                     ← معرفی کلی پروژه
├── 📄 DEPLOYMENT-INDEX.md           ← این فایل (شما اینجا هستید!)
├── 📄 QUICK-START.md                ← شروع سریع (5 دقیقه)
├── 📄 DEPLOYMENT-GUIDE.md           ← راهنمای توسعه
├── 📄 PRODUCTION-DEPLOYMENT.md      ← راهنمای کامل production
├── 📄 DEPLOYMENT-SUMMARY.md         ← خلاصه تغییرات و دستورات
├── 📄 CHANGES.md                    ← تاریخچه تغییرات
│
├── 🔧 deploy.sh                     ← اسکریپت مدیریتی
├── 🔧 docker-compose.yml            ← تنظیمات Docker
│
├── 📁 backend/
│   ├── 📄 .env                      ← متغیرهای محیطی
│   └── 📄 .env.example              ← نمونه
│
└── 📁 frontend/
    └── ...
```

---

## ⭐ توصیه نهایی

**بهترین مسیر برای شروع:**

```
1. این فایل (DEPLOYMENT-INDEX.md) ← شما اینجایید ✓
2. QUICK-START.md ← برای شروع سریع
3. deploy.sh ← اجرای خودکار
4. اگر مشکلی پیش آمد → DEPLOYMENT-SUMMARY.md
5. برای production کامل → PRODUCTION-DEPLOYMENT.md
```

---

## 🎉 آماده‌اید؟

حالا که می‌دانید از کجا شروع کنید، بزن بریم! 🚀

**پیشنهاد:** اگر عجله دارید همین الان **QUICK-START.md** را باز کنید! ⚡
