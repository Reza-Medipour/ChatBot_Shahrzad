# ✅ چک‌لیست Deployment پروژه شهرزاد

این چک‌لیست را می‌توانید چاپ کرده و در کنار خود داشته باشید.

---

## 📋 قبل از شروع

- [ ] دسترسی به سرور (SSH) دارم
- [ ] IP سرور را دارم: `____________________`
- [ ] Username سرور: `____________________`
- [ ] رمز سرور را دارم

**سرور Requirements:**
- [ ] CPU: حداقل 2 Core
- [ ] RAM: حداقل 2GB (ترجیحاً 4GB)
- [ ] Storage: حداقل 20GB
- [ ] OS: Ubuntu 20.04+ یا Debian 11+ یا CentOS 8+

---

## 🔧 مرحله 1: اتصال و به‌روزرسانی سرور

```bash
ssh root@YOUR_SERVER_IP
```

- [ ] به سرور وصل شدم

```bash
sudo apt update && sudo apt upgrade -y
```

- [ ] سیستم به‌روز شد

---

## 🐳 مرحله 2: نصب Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

- [ ] Docker نصب شد

```bash
docker --version
```

- [ ] نسخه Docker چک شد، خروجی: `____________________`

```bash
sudo usermod -aG docker $USER
```

- [ ] User به گروه Docker اضافه شد

---

## 📦 مرحله 3: نصب Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

- [ ] Docker Compose نصب شد

```bash
docker-compose --version
```

- [ ] نسخه Docker Compose چک شد، خروجی: `____________________`

---

## 🔐 مرحله 4: Logout و Login مجدد

```bash
exit
ssh root@YOUR_SERVER_IP
```

- [ ] Logout و Login دوباره انجام شد

---

## 📥 مرحله 5: دریافت پروژه

### روش 1: از Git

```bash
cd ~
git clone YOUR_REPO_URL shahrzad-chatbot
cd shahrzad-chatbot
```

- [ ] پروژه از Git دریافت شد

### روش 2: آپلود با SCP

```bash
# از کامپیوتر محلی:
scp -r /path/to/project root@SERVER_IP:~/shahrzad-chatbot
```

- [ ] پروژه آپلود شد

---

## 🔑 مرحله 6: تنظیمات امنیتی

### تولید SECRET_KEY:

```bash
openssl rand -hex 32
```

- [ ] SECRET_KEY تولید شد
- [ ] SECRET_KEY را اینجا یادداشت کنید:

```
________________________________________________________
________________________________________________________
```

### ویرایش docker-compose.yml:

```bash
nano docker-compose.yml
```

- [ ] فایل باز شد

**تغییرات لازم:**

1. رمز Database (خط ~10):
   ```yaml
   POSTGRES_PASSWORD: ____________________  # رمز جدید
   ```
   - [ ] رمز Database تغییر کرد
   - [ ] رمز را اینجا یادداشت کنید: `____________________`

2. SECRET_KEY (خط ~30):
   ```yaml
   SECRET_KEY: ____________________  # SECRET_KEY تولید شده
   ```
   - [ ] SECRET_KEY جایگزین شد

3. DATABASE_URL (خط ~29):
   ```yaml
   DATABASE_URL: postgresql://shahrzad:YOUR_NEW_PASSWORD@database:5432/shahrzad_db
   ```
   - [ ] DATABASE_URL به‌روز شد

4. LLM API (خط ~32-33):
   ```yaml
   LLM_API_URL: http://103.75.196.71:8020/chat
   LLM_API_KEY: ""
   ```
   - [ ] LLM_API_URL چک شد

**ذخیره:** `Ctrl+O` → `Enter` → `Ctrl+X`

- [ ] فایل ذخیره شد

---

## 🛡️ مرحله 7: تنظیم Firewall

### Ubuntu/Debian:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

- [ ] Firewall تنظیم شد

### CentOS/RHEL:

```bash
sudo firewall-cmd --permanent --add-service={ssh,http,https}
sudo firewall-cmd --reload
sudo firewall-cmd --list-all
```

- [ ] Firewall تنظیم شد

---

## 🚀 مرحله 8: راه‌اندازی پروژه

### روش 1: با اسکریپت (توصیه می‌شود)

```bash
chmod +x deploy.sh
./deploy.sh
```

- [ ] اسکریپت اجرا شد
- [ ] گزینه "1" (نصب اولیه) انتخاب شد

### روش 2: دستی

```bash
docker-compose up -d --build
```

- [ ] کانتینرها ساخته شدند

**منتظر بمانید 3-5 دقیقه...**

---

## ✅ مرحله 9: تست و بررسی

### چک کردن وضعیت:

```bash
docker-compose ps
```

- [ ] همه services در حالت "Up" هستند

خروجی باید شبیه این باشد:
```
shahrzad_db         Up (healthy)
shahrzad_backend    Up
shahrzad_frontend   Up
```

### تست Backend:

```bash
curl http://localhost:8000/docs
```

- [ ] Backend پاسخ می‌دهد

### تست Frontend:

```bash
curl -I http://localhost
```

- [ ] Frontend پاسخ می‌دهد (Status: 200)

### تست از مرورگر:

- [ ] Frontend باز می‌شود: `http://YOUR_SERVER_IP`
- [ ] API Docs باز می‌شود: `http://YOUR_SERVER_IP:8000/docs`

---

## 🌐 مرحله 10: تنظیم Domain و SSL (اختیاری)

### اگر Domain دارید:

**Domain شما:** `____________________`

### تنظیم DNS:

- [ ] رکورد A به IP سرور اضافه شد
- [ ] DNS propagate شد (تست: `ping yourdomain.com`)

### نصب Nginx و SSL:

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

- [ ] Nginx نصب شد

```bash
sudo nano /etc/nginx/sites-available/shahrzad
```

- [ ] فایل config ایجاد شد (از PRODUCTION-DEPLOYMENT.md کپی کنید)

```bash
sudo ln -s /etc/nginx/sites-available/shahrzad /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

- [ ] Nginx تنظیم شد

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

- [ ] SSL Certificate نصب شد

### تست HTTPS:

- [ ] سایت با HTTPS باز می‌شود: `https://yourdomain.com`

---

## 💾 مرحله 11: تنظیم Backup خودکار (اختیاری)

### ایجاد پوشه backup:

```bash
mkdir -p ~/backups
```

- [ ] پوشه backup ایجاد شد

### ایجاد اسکریپت backup:

```bash
nano ~/backup-db.sh
```

محتوا را از PRODUCTION-DEPLOYMENT.md کپی کنید.

- [ ] اسکریپت backup ایجاد شد

```bash
chmod +x ~/backup-db.sh
```

- [ ] مجوز اجرا داده شد

### تست دستی:

```bash
~/backup-db.sh
```

- [ ] Backup با موفقیت گرفته شد

### تنظیم Cron برای backup خودکار:

```bash
crontab -e
```

اضافه کردن:
```
0 2 * * * /home/YOUR_USERNAME/backup-db.sh >> /home/YOUR_USERNAME/backups/backup.log 2>&1
```

- [ ] Cron job تنظیم شد

---

## 📊 مرحله 12: نصب Monitoring (اختیاری)

### نصب Portainer:

```bash
docker volume create portainer_data
docker run -d -p 9000:9000 --name=portainer --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

- [ ] Portainer نصب شد
- [ ] Portainer در `http://SERVER_IP:9000` قابل دسترسی است

---

## 🎯 چک‌لیست نهایی امنیت

- [ ] SECRET_KEY تغییر کرده
- [ ] رمز Database تغییر کرده
- [ ] پورت 5432 از بیرون قابل دسترسی نیست
- [ ] Firewall فعال است
- [ ] فقط پورت‌های 22, 80, 443 باز هستند
- [ ] SSL نصب شده (اگر Domain دارید)
- [ ] Backup خودکار تنظیم شده

---

## 📝 اطلاعات پروژه من

**تاریخ نصب:** `____________________`

**IP سرور:** `____________________`

**Domain:** `____________________`

**رمز Database:** `____________________` (در جای امن نگهداری کنید)

**SECRET_KEY:**
```
________________________________________________________
________________________________________________________
```

**لوکیشن Backups:** `~/backups/`

**زمان Backup خودکار:** روزانه ساعت 2 بامداد

---

## 🔧 دستورات مفید برای آینده

### مدیریت پروژه:

```bash
# استفاده از منو
./deploy.sh

# شروع
docker-compose up -d

# توقف
docker-compose down

# راه‌اندازی مجدد
docker-compose restart

# وضعیت
docker-compose ps

# لاگ‌ها
docker-compose logs -f
```

### Backup دستی:

```bash
~/backup-db.sh
```

### لیست Backups:

```bash
ls -lh ~/backups/
```

### بازگردانی Backup:

```bash
gunzip < ~/backups/BACKUP_FILE.sql.gz | \
docker-compose exec -T database psql -U shahrzad -d shahrzad_db
```

### عیب‌یابی:

```bash
# Health check
./deploy.sh  # گزینه 11

# چک خطاها
docker-compose logs | grep -i error

# راه‌اندازی مجدد کامل
docker-compose down && docker-compose up -d --build
```

---

## ✅ وضعیت نهایی

پس از تکمیل همه مراحل:

- [ ] ✅ پروژه با موفقیت نصب شد
- [ ] ✅ همه تست‌ها موفق بودند
- [ ] ✅ تنظیمات امنیتی انجام شد
- [ ] ✅ Backup تنظیم شد
- [ ] ✅ Domain و SSL فعال است (اختیاری)
- [ ] ✅ Monitoring نصب شد (اختیاری)

**🎉 تبریک! پروژه شما آماده استفاده است!**

---

## 📞 در صورت نیاز به کمک

مستندات کامل:
- START-HERE.md
- QUICK-START.md
- PRODUCTION-DEPLOYMENT.md
- DEPLOYMENT-SUMMARY.md

---

**تاریخ چاپ:** ____________________

**توسط:** ____________________

**یادداشت‌ها:**

________________________________________________________

________________________________________________________

________________________________________________________

________________________________________________________
