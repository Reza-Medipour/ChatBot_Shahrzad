# 🚀 از اینجا شروع کن! (START HERE)

**خوش اومدی!** این راهنمای ساده شده برای راه‌اندازی سریع پروژه چت بات شهرزاد روی سرور است.

---

## ⚡ راه‌اندازی سریع (3 دقیقه)

### گام 1: اتصال به سرور

```bash
ssh root@YOUR_SERVER_IP
# یا
ssh your_username@YOUR_SERVER_IP
```

### گام 2: نصب Docker (یک خط)

```bash
curl -fsSL https://get.docker.com | sh && sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose
```

منتظر بمانید تا نصب تمام شود (حدود 2-3 دقیقه).

### گام 3: دانلود پروژه

```bash
cd ~
git clone YOUR_REPOSITORY_URL shahrzad-chatbot
cd shahrzad-chatbot
```

**یا** اگر Git ندارید، فایل‌ها را با SCP آپلود کنید:
```bash
# از کامپیوتر خودتان:
scp -r /path/to/project root@YOUR_SERVER_IP:~/shahrzad-chatbot
```

### گام 4: تنظیمات امنیتی (خیلی مهم!)

```bash
# تولید کلید امنیتی
openssl rand -hex 32
```

این دستور یک رشته 64 کاراکتری مثل این می‌سازد:
```
a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
```

**این رشته را کپی کنید!**

حالا فایل docker-compose.yml را ویرایش کنید:

```bash
nano docker-compose.yml
```

فقط **دو خط** را تغییر دهید:

1. رمز دیتابیس (خط ~10):
   ```yaml
   POSTGRES_PASSWORD: shahrzad_password  # ⬅️ این را به یک رمز قوی تغییر دهید
   ```

2. SECRET_KEY (خط ~30):
   ```yaml
   SECRET_KEY: your-secret-key-change...  # ⬅️ کلیدی که از openssl گرفتید را بگذارید
   ```

3. DATABASE_URL را هم به‌روز کنید (خط ~29):
   ```yaml
   DATABASE_URL: postgresql://shahrzad:YOUR_NEW_PASSWORD@database:5432/shahrzad_db
   ```

**ذخیره کنید:** `Ctrl+O` → `Enter` → `Ctrl+X`

### گام 5: راه‌اندازی با اسکریپت خودکار

```bash
chmod +x deploy.sh
./deploy.sh
```

در منو، گزینه **1** را انتخاب کنید: "نصب و راه‌اندازی اولیه"

منتظر بمانید تا Docker تمام کانتینرها را بسازد (3-5 دقیقه).

### گام 6: تست

مرورگر خود را باز کنید:

- Frontend: `http://YOUR_SERVER_IP`
- API Docs: `http://YOUR_SERVER_IP:8000/docs`

اگر صفحه نمایش داده شد، **تبریک! موفق شدید!** 🎉

---

## 🆘 مشکل دارید؟

### مشکل: "Docker command not found"

```bash
# نصب مجدد Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### مشکل: "Permission denied"

```bash
sudo usermod -aG docker $USER
exit
# دوباره login کنید
```

### مشکل: "Backend به Database وصل نمیشه"

```bash
# چک کردن logs
docker-compose logs database
docker-compose logs backend

# راه‌اندازی مجدد
docker-compose restart
```

### مشکل: "Port 80 already in use"

```bash
# پیدا کردن برنامه‌ای که از پورت 80 استفاده می‌کنه
sudo lsof -i :80

# متوقف کردن nginx (اگر وجود داره)
sudo systemctl stop nginx
```

### مشکل: هیچ کدام از اینها نیست

```bash
# مشاهده وضعیت
docker-compose ps

# مشاهده لاگ‌های کامل
docker-compose logs -f
```

یا به [DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md) مراجعه کنید.

---

## 📚 مستندات بیشتر

اگر نیاز به اطلاعات بیشتر دارید:

| نیاز شما | فایل مناسب |
|----------|------------|
| راه‌اندازی سریع | [QUICK-START.md](./QUICK-START.md) |
| راهنمای کامل production | [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md) |
| خلاصه تغییرات و دستورات | [DEPLOYMENT-SUMMARY.md](./DEPLOYMENT-SUMMARY.md) |
| راهنمای انتخاب مستندات | [DEPLOYMENT-INDEX.md](./DEPLOYMENT-INDEX.md) |
| معرفی پروژه | [README.md](./README.md) |

---

## 🔐 نکات امنیتی مهم

### ⚠️ قبل از استفاده واقعی حتماً:

1. ✅ SECRET_KEY را تغییر داده‌اید
2. ✅ رمز Database را تغییر داده‌اید
3. ✅ Firewall را فعال کرده‌اید
4. ✅ اگر Domain دارید، SSL نصب کنید

### فعال‌سازی Firewall (یک خط):

```bash
# Ubuntu/Debian
sudo ufw allow 22,80,443/tcp && sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service={ssh,http,https} && sudo firewall-cmd --reload
```

---

## 🛠️ دستورات مفید

### مدیریت پروژه:

```bash
# استفاده از منوی تعاملی (توصیه می‌شود)
./deploy.sh

# یا به صورت دستی:

# شروع
docker-compose up -d

# توقف
docker-compose down

# راه‌اندازی مجدد
docker-compose restart

# مشاهده وضعیت
docker-compose ps

# مشاهده لاگ‌ها
docker-compose logs -f
```

### Backup گرفتن:

```bash
# با اسکریپت
./deploy.sh  # گزینه 8

# یا دستی
mkdir -p backups
docker-compose exec -T database pg_dump -U shahrzad shahrzad_db | gzip > backups/backup_$(date +%Y%m%d).sql.gz
```

---

## 🌐 تنظیم Domain و SSL (اختیاری)

اگر Domain دارید و می‌خواهید HTTPS داشته باشید:

### نصب SSL (رایگان با Let's Encrypt):

```bash
# نصب Certbot
sudo apt install -y certbot python3-certbot-nginx

# دریافت SSL Certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

راهنمای کامل در [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md) → بخش 7

---

## ✅ Checklist نهایی

پس از راه‌اندازی، این موارد را چک کنید:

- [ ] `docker-compose ps` همه services را UP نشان می‌دهد
- [ ] Frontend از مرورگر قابل دسترسی است
- [ ] Backend API Docs کار می‌کند (`http://SERVER_IP:8000/docs`)
- [ ] SECRET_KEY تغییر کرده است
- [ ] رمز Database تغییر کرده است
- [ ] Firewall فعال شده است
- [ ] Backup تنظیم شده است (اختیاری)

---

## 🎯 مراحل بعدی

پس از راه‌اندازی موفق:

### 1. تنظیم Backup خودکار

```bash
# ویرایش crontab
crontab -e

# اضافه کردن این خط (backup روزانه ساعت 2 بامداد):
0 2 * * * cd ~/shahrzad-chatbot && docker-compose exec -T database pg_dump -U shahrzad shahrzad_db | gzip > ~/backups/shahrzad_$(date +\%Y\%m\%d).sql.gz
```

### 2. مانیتورینگ

برای مانیتورینگ آسان می‌توانید Portainer نصب کنید:

```bash
docker volume create portainer_data
docker run -d -p 9000:9000 --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

دسترسی: `http://YOUR_SERVER_IP:9000`

### 3. تنظیم Domain (اگر دارید)

راهنمای کامل در [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md) → بخش 7

---

## 📞 نیاز به کمک؟

### دستورات عیب‌یابی سریع:

```bash
# چک کردن سلامت همه چیز
./deploy.sh  # گزینه 11: Health Check

# مشاهده خطاها
docker-compose logs | grep -i error

# راه‌اندازی مجدد کامل
docker-compose down && docker-compose up -d --build
```

### منابع:

- [خلاصه دستورات](./DEPLOYMENT-SUMMARY.md)
- [عیب‌یابی کامل](./PRODUCTION-DEPLOYMENT.md#عیب-یابی)
- [راهنمای انتخاب مستندات](./DEPLOYMENT-INDEX.md)

---

## 🎉 تمام!

پروژه شما آماده است!

```
Frontend: http://YOUR_SERVER_IP
API Docs: http://YOUR_SERVER_IP:8000/docs
Backend: http://YOUR_SERVER_IP:8000/api/
```

**نکته:** اگر Domain و SSL دارید، به جای `http://` از `https://yourdomain.com` استفاده کنید.

---

## 💡 یادتان باشد

- برای مدیریت آسان همیشه از `./deploy.sh` استفاده کنید
- حتماً Backup منظم بگیرید
- لاگ‌ها را به طور مرتب چک کنید
- در صورت به‌روزرسانی، ابتدا Backup بگیرید

**موفق باشید!** 🚀
