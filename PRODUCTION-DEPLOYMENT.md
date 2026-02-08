# 🚀 راهنمای کامل دیپلوی پروژه شهرزاد روی سرور Production

این راهنما برای deploy پروژه روی سرورهای Linux (Ubuntu/Debian/CentOS) نوشته شده است.

---

## 📋 فهرست مطالب

1. [پیش‌نیازها](#پیش-نیازها)
2. [آماده‌سازی سرور](#آماده-سازی-سرور)
3. [نصب Docker و Docker Compose](#نصب-docker-و-docker-compose)
4. [دریافت و تنظیم پروژه](#دریافت-و-تنظیم-پروژه)
5. [تنظیمات امنیتی](#تنظیمات-امنیتی)
6. [راه‌اندازی پروژه](#راه-اندازی-پروژه)
7. [تنظیم Domain و SSL](#تنظیم-domain-و-ssl)
8. [Backup و Monitoring](#backup-و-monitoring)
9. [عیب‌یابی](#عیب-یابی)

---

## 1️⃣ پیش‌نیازها

### الف) سرور
- **VPS یا Dedicated Server** با مشخصات حداقل:
  - CPU: 2 Core
  - RAM: 4GB (حداقل 2GB)
  - Storage: 20GB
  - OS: Ubuntu 20.04/22.04 یا Debian 11/12 یا CentOS 8

### ب) دسترسی‌ها
- Root access یا sudo privileges
- IP عمومی سرور
- (اختیاری) Domain name برای SSL

### ج) نرم‌افزارها
- Git
- Docker
- Docker Compose

---

## 2️⃣ آماده‌سازی سرور

### اتصال به سرور

```bash
ssh root@YOUR_SERVER_IP
# یا
ssh your_user@YOUR_SERVER_IP
```

### به‌روزرسانی سیستم

#### Ubuntu/Debian:
```bash
sudo apt update && sudo apt upgrade -y
```

#### CentOS/RHEL:
```bash
sudo yum update -y
# یا
sudo dnf update -y
```

### نصب ابزارهای پایه

```bash
# Ubuntu/Debian
sudo apt install -y git curl wget nano

# CentOS/RHEL
sudo yum install -y git curl wget nano
```

---

## 3️⃣ نصب Docker و Docker Compose

### روش 1: نصب خودکار (توصیه می‌شود)

```bash
# نصب Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# اضافه کردن کاربر فعلی به گروه docker (برای اجرا بدون sudo)
sudo usermod -aG docker $USER

# فعال‌سازی Docker
sudo systemctl enable docker
sudo systemctl start docker

# چک کردن نصب Docker
docker --version
```

### روش 2: نصب دستی (Ubuntu)

```bash
# حذف نسخه‌های قدیمی
sudo apt remove docker docker-engine docker.io containerd runc

# نصب پیش‌نیازها
sudo apt update
sudo apt install -y ca-certificates curl gnupg lsb-release

# اضافه کردن GPG key رسمی Docker
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# اضافه کردن repository Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# نصب Docker Engine
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# تست نصب
sudo docker run hello-world
```

### نصب Docker Compose (نسخه Standalone)

```bash
# دانلود آخرین نسخه
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# اعطای مجوز اجرا
sudo chmod +x /usr/local/bin/docker-compose

# چک کردن نصب
docker-compose --version
```

### لاگ‌اوت و لاگین مجدد
```bash
exit
# سپس دوباره وارد شوید تا تغییرات گروه اعمال شود
ssh your_user@YOUR_SERVER_IP
```

---

## 4️⃣ دریافت و تنظیم پروژه

### کلون پروژه

```bash
# رفتن به home directory
cd ~

# کلون پروژه (از Git repository)
git clone YOUR_REPOSITORY_URL shahrzad-chatbot
cd shahrzad-chatbot
```

### یا آپلود پروژه با SCP/SFTP

```bash
# از کامپیوتر محلی خود:
scp -r /path/to/project your_user@YOUR_SERVER_IP:~/shahrzad-chatbot
```

---

## 5️⃣ تنظیمات امنیتی

### الف) تغییر رمزهای پیش‌فرض

#### 1. تولید SECRET_KEY قوی:

```bash
# تولید یک کلید 64 کاراکتری تصادفی
openssl rand -hex 32
```

خروجی مثال: `a1b2c3d4e5f6...` (این را کپی کنید)

#### 2. ویرایش docker-compose.yml:

```bash
nano docker-compose.yml
```

تغییرات مورد نیاز:

```yaml
services:
  database:
    environment:
      POSTGRES_PASSWORD: YOUR_STRONG_DB_PASSWORD_HERE  # ⚠️ حتماً تغییر دهید

  backend:
    environment:
      DATABASE_URL: postgresql://shahrzad:YOUR_STRONG_DB_PASSWORD_HERE@database:5432/shahrzad_db
      SECRET_KEY: YOUR_GENERATED_SECRET_KEY_HERE  # ⚠️ از openssl استفاده کنید
      LLM_API_URL: http://103.75.196.71:8020/chat  # ✅ آدرس سرویس LLM
      LLM_API_KEY: ""  # اگر نیاز به authentication دارید
```

**ذخیره فایل**: Ctrl+O ثم Enter ثم Ctrl+X

#### 3. تنظیم فایل .env در backend:

```bash
nano backend/.env
```

محتوا:
```env
DATABASE_URL=postgresql://shahrzad:YOUR_STRONG_DB_PASSWORD@database:5432/shahrzad_db
SECRET_KEY=YOUR_GENERATED_SECRET_KEY_HERE
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# External LLM API Configuration
LLM_API_URL=http://103.75.196.71:8020/chat
LLM_API_KEY=
```

### ب) تنظیم Firewall

#### Ubuntu/Debian (UFW):

```bash
# فعال‌سازی UFW
sudo ufw enable

# اجازه SSH (مهم! قبل از فعال کردن firewall)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# اجازه HTTP و HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# اجازه Backend API (فقط اگر نیاز به دسترسی مستقیم دارید)
# sudo ufw allow 8000/tcp

# چک کردن وضعیت
sudo ufw status
```

#### CentOS/RHEL (Firewalld):

```bash
# فعال‌سازی firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld

# باز کردن پورت‌ها
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh

# اگر به دسترسی مستقیم به backend نیاز دارید:
# sudo firewall-cmd --permanent --add-port=8000/tcp

# اعمال تغییرات
sudo firewall-cmd --reload

# چک کردن
sudo firewall-cmd --list-all
```

### ج) بستن دسترسی مستقیم به PostgreSQL

**مهم**: پورت 5432 (PostgreSQL) نباید از بیرون قابل دسترسی باشه!

در فایل `docker-compose.yml`:

```yaml
  database:
    # پورت رو comment کنید یا حذف کنید:
    # ports:
    #   - "5432:5432"
```

---

## 6️⃣ راه‌اندازی پروژه

### ساخت و اجرای کانتینرها

```bash
cd ~/shahrzad-chatbot

# ساخت و اجرای همه سرویس‌ها
docker-compose up -d --build
```

این دستور:
- Database (PostgreSQL) را راه‌اندازی می‌کند
- Backend (FastAPI) را build و اجرا می‌کند
- Frontend (React + Nginx) را build و اجرا می‌کند

### چک کردن وضعیت سرویس‌ها

```bash
# مشاهده وضعیت containers
docker-compose ps

# باید خروجی مشابه این باشید:
#      Name                   State          Ports
# -------------------------------------------------------
# shahrzad_db         Up (healthy)   5432/tcp
# shahrzad_backend    Up             0.0.0.0:8000->8000/tcp
# shahrzad_frontend   Up             0.0.0.0:80->80/tcp
```

### مشاهده لاگ‌ها

```bash
# لاگ همه سرویس‌ها
docker-compose logs -f

# لاگ یک سرویس خاص
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# چک کردن error logs
docker-compose logs backend | grep -i error
```

### تست سرویس‌ها

```bash
# تست Backend API
curl http://localhost:8000/docs

# تست Frontend
curl http://localhost

# تست اتصال به Database
docker-compose exec database psql -U shahrzad -d shahrzad_db -c "SELECT version();"
```

---

## 7️⃣ تنظیم Domain و SSL

### الف) اتصال Domain به سرور

1. وارد پنل DNS domain خود شوید
2. یک رکورد A record اضافه کنید:
   ```
   Type: A
   Name: @ (یا subdomain مثل chat)
   Value: YOUR_SERVER_IP
   TTL: 3600
   ```

3. منتظر بمانید تا DNS propagate شود (5-30 دقیقه)

4. تست:
   ```bash
   ping yourdomain.com
   ```

### ب) نصب Nginx Reverse Proxy + SSL

#### نصب Nginx و Certbot:

```bash
# Ubuntu/Debian
sudo apt install -y nginx certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install -y nginx certbot python3-certbot-nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

#### تنظیم Nginx Configuration:

```bash
sudo nano /etc/nginx/sites-available/shahrzad
```

محتوا:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (بعد از اجرای certbot این خطوط اضافه می‌شوند)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Frontend (React App)
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend Docs
    location /docs {
        proxy_pass http://localhost:8000/docs;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /openapi.json {
        proxy_pass http://localhost:8000/openapi.json;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

#### فعال‌سازی Configuration:

```bash
# ایجاد symlink
sudo ln -s /etc/nginx/sites-available/shahrzad /etc/nginx/sites-enabled/

# حذف default config
sudo rm /etc/nginx/sites-enabled/default

# تست configuration
sudo nginx -t

# اگر خطایی نداشت، restart کنید
sudo systemctl restart nginx
```

#### دریافت SSL Certificate با Let's Encrypt:

```bash
# اجرای certbot
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# در حین نصب از شما سوال می‌شود:
# 1. ایمیل خود را وارد کنید
# 2. قوانین را بپذیرید (Y)
# 3. اگر پرسید redirect HTTP به HTTPS رو انتخاب کنید (2)
```

#### تنویع خودکار SSL:

```bash
# تست تمدید
sudo certbot renew --dry-run

# Certbot به صورت خودکار یک cron job ایجاد می‌کند
# برای چک کردن:
sudo systemctl status certbot.timer
```

#### به‌روزرسانی docker-compose برای تغییر پورت:

حالا که Nginx reverse proxy داریم، می‌تونیم پورت 80 رو از docker-compose آزاد کنیم:

```bash
nano docker-compose.yml
```

```yaml
  frontend:
    ports:
      - "127.0.0.1:8080:80"  # فقط از localhost قابل دسترسی
```

```bash
# Restart services
docker-compose down
docker-compose up -d
```

و Nginx config رو هم به‌روز کنید:
```nginx
location / {
    proxy_pass http://localhost:8080;  # تغییر از 80 به 8080
    ...
}
```

```bash
sudo systemctl restart nginx
```

---

## 8️⃣ Backup و Monitoring

### الف) Backup خودکار دیتابیس

ایجاد اسکریپت backup:

```bash
mkdir -p ~/backups
nano ~/backup-db.sh
```

محتوا:
```bash
#!/bin/bash

# تنظیمات
BACKUP_DIR="/home/$(whoami)/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="shahrzad_db_$DATE.sql"
KEEP_DAYS=7

# ایجاد backup
docker-compose -f ~/shahrzad-chatbot/docker-compose.yml exec -T database \
    pg_dump -U shahrzad shahrzad_db > "$BACKUP_DIR/$BACKUP_FILE"

# فشرده‌سازی
gzip "$BACKUP_DIR/$BACKUP_FILE"

# حذف backup‌های قدیمی‌تر از 7 روز
find "$BACKUP_DIR" -name "shahrzad_db_*.sql.gz" -mtime +$KEEP_DAYS -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

اعطای مجوز اجرا:
```bash
chmod +x ~/backup-db.sh
```

#### تنظیم Cron Job برای backup روزانه:

```bash
crontab -e
```

اضافه کردن این خط (backup روزانه ساعت 2 بامداد):
```
0 2 * * * /home/YOUR_USERNAME/backup-db.sh >> /home/YOUR_USERNAME/backups/backup.log 2>&1
```

### ب) بازگردانی Backup:

```bash
# لیست backup‌ها
ls -lh ~/backups/

# بازگردانی
gunzip < ~/backups/shahrzad_db_20240208_020000.sql.gz | \
docker-compose -f ~/shahrzad-chatbot/docker-compose.yml exec -T database \
    psql -U shahrzad -d shahrzad_db
```

### ج) Monitoring با Portainer (اختیاری)

```bash
# نصب Portainer
docker volume create portainer_data

docker run -d \
  -p 9000:9000 \
  --name=portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

# دسترسی از:
# http://YOUR_SERVER_IP:9000
```

### د) Monitoring لاگ‌ها:

```bash
# نصب logrotate برای مدیریت لاگ‌ها
sudo nano /etc/logrotate.d/docker-shahrzad
```

محتوا:
```
/home/YOUR_USERNAME/shahrzad-chatbot/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 YOUR_USERNAME YOUR_USERNAME
    sharedscripts
}
```

---

## 9️⃣ دستورات مدیریتی مفید

### مدیریت Services:

```bash
# Start همه services
docker-compose up -d

# Stop همه services
docker-compose down

# Restart یک service
docker-compose restart backend

# Rebuild و restart
docker-compose up -d --build

# مشاهده لاگ‌ها real-time
docker-compose logs -f

# چک کردن resource usage
docker stats

# پاک‌سازی resources غیرضروری
docker system prune -a
```

### دسترسی به Shell:

```bash
# Shell Backend
docker-compose exec backend bash

# Shell Database
docker-compose exec database psql -U shahrzad -d shahrzad_db

# SQL Query مستقیم
docker-compose exec database psql -U shahrzad -d shahrzad_db -c "SELECT COUNT(*) FROM messages;"
```

### چک کردن صحت عملکرد:

```bash
# تست Backend Health
curl http://localhost:8000/docs

# تست Frontend
curl -I http://localhost

# تست Database Connection
docker-compose exec backend python -c "from app.database import engine; print(engine.connect())"

# تست LLM API Connection
docker-compose exec backend python -c "
import httpx
response = httpx.post('http://103.75.196.71:8020/chat', json={'session_id': 'test', 'message': 'سلام'})
print(response.status_code, response.json())
"
```

---

## 🔟 عیب‌یابی

### مشکل 1: Backend به Database متصل نمی‌شود

```bash
# چک کردن وضعیت Database
docker-compose ps database

# چک کردن Database logs
docker-compose logs database

# چک کردن اتصال
docker-compose exec database psql -U shahrzad -d shahrzad_db -c "SELECT 1;"

# اگر مشکل password است:
docker-compose down -v  # ⚠️ داده‌ها پاک می‌شوند!
docker-compose up -d --build
```

### مشکل 2: Frontend به Backend متصل نمی‌شود

```bash
# چک کردن Backend logs
docker-compose logs backend

# چک کردن CORS settings
docker-compose exec backend grep -r "CORS" /app/

# چک کردن Network
docker network ls
docker network inspect shahrzad_shahrzad_network
```

### مشکل 3: سرویس LLM جواب نمی‌ده

```bash
# تست مستقیم سرویس LLM
curl -X POST http://103.75.196.71:8020/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id": "test", "message": "سلام"}'

# چک کردن Backend logs
docker-compose logs backend | grep -i "LLM"

# چک کردن environment variable
docker-compose exec backend env | grep LLM
```

### مشکل 4: Out of Disk Space

```bash
# چک کردن فضای دیسک
df -h

# پاک‌سازی Docker
docker system prune -a --volumes

# حذف old images
docker image prune -a

# چک کردن حجم volumes
docker system df
```

### مشکل 5: High Memory Usage

```bash
# چک کردن استفاده از حافظه
docker stats

# محدود کردن حافظه در docker-compose.yml:
services:
  backend:
    mem_limit: 1g
  frontend:
    mem_limit: 512m
  database:
    mem_limit: 1g
```

### مشکل 6: SSL Certificate Issues

```bash
# تست SSL
sudo certbot certificates

# تمدید دستی
sudo certbot renew

# چک کردن Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## ✅ Checklist نهایی

پس از اتمام deploy، این موارد را چک کنید:

- [ ] همه services در حال اجرا هستند (`docker-compose ps`)
- [ ] Frontend از browser قابل دسترسی است
- [ ] Backend API Docs در `/docs` کار می‌کند
- [ ] Database اتصال دارد و جداول ساخته شده‌اند
- [ ] سرویس LLM به درستی جواب می‌دهد
- [ ] SSL certificate نصب شده (اگر دارید)
- [ ] Firewall به درستی تنظیم شده
- [ ] Backup روزانه تنظیم شده
- [ ] رمزهای پیش‌فرض تغییر کرده‌اند
- [ ] Monitoring setup شده (Portainer یا لاگ‌ها)

---

## 📞 پشتیبانی

اگر به مشکلی برخوردید:

1. لاگ‌ها را چک کنید: `docker-compose logs -f`
2. Documentation را مرور کنید
3. مشکل را در issue tracker گزارش دهید

---

## 🎉 تبریک!

پروژه شهرزاد شما با موفقیت بر روی سرور production deploy شد!

دسترسی:
- Frontend: `https://yourdomain.com`
- API Docs: `https://yourdomain.com/docs`
- Backend: `https://yourdomain.com/api/`
