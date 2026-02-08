# 🚀 راهنمای سریع شروع (Quick Start)

اگر می‌خواهید **سریعاً** پروژه را روی سرور خود اجرا کنید، این مراحل را دنبال کنید:

---

## ⚡ نصب سریع (5 دقیقه)

### 1️⃣ آماده‌سازی سرور

```bash
# اتصال به سرور
ssh root@YOUR_SERVER_IP

# نصب Docker (یک خط)
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh

# نصب Docker Compose (یک خط)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose

# اضافه کردن user به گروه docker
sudo usermod -aG docker $USER

# logout و login مجدد
exit
ssh root@YOUR_SERVER_IP
```

### 2️⃣ دریافت پروژه

```bash
# کلون پروژه
cd ~
git clone YOUR_REPO_URL shahrzad-chatbot
cd shahrzad-chatbot

# یا اگر پروژه را دارید، آپلود کنید:
# از کامپیوتر خود:
# scp -r /path/to/project root@YOUR_SERVER_IP:~/shahrzad-chatbot
```

### 3️⃣ تنظیم امنیتی (مهم!)

```bash
# تولید SECRET_KEY
openssl rand -hex 32
# خروجی را کپی کنید (مثلاً: a1b2c3d4e5f6...)

# ویرایش docker-compose.yml
nano docker-compose.yml
```

**فقط این دو خط را تغییر دهید:**

```yaml
environment:
  POSTGRES_PASSWORD: رمز_قوی_خودتان  # ⚠️ تغییر دهید
  SECRET_KEY: کلید_تولید_شده_از_openssl  # ⚠️ تغییر دهید
```

ذخیره: `Ctrl+O` → `Enter` → `Ctrl+X`

### 4️⃣ راه‌اندازی

```bash
# استفاده از اسکریپت خودکار (توصیه می‌شود)
./deploy.sh

# یا به صورت دستی
docker-compose up -d --build
```

### 5️⃣ تست

```bash
# مشاهده وضعیت
docker-compose ps

# باز کردن در مرورگر
# Frontend: http://YOUR_SERVER_IP
# API Docs: http://YOUR_SERVER_IP:8000/docs
```

---

## 🔥 دستورات یک خطی

### شروع کامل (از صفر):
```bash
curl -fsSL https://get.docker.com | sh && sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose && cd ~ && git clone YOUR_REPO shahrzad && cd shahrzad && docker-compose up -d --build
```

### فقط راه‌اندازی:
```bash
cd ~/shahrzad-chatbot && docker-compose up -d --build
```

### توقف:
```bash
cd ~/shahrzad-chatbot && docker-compose down
```

### راه‌اندازی مجدد:
```bash
cd ~/shahrzad-chatbot && docker-compose restart
```

### مشاهده لاگ‌ها:
```bash
cd ~/shahrzad-chatbot && docker-compose logs -f
```

### Backup سریع:
```bash
cd ~/shahrzad-chatbot && mkdir -p backups && docker-compose exec -T database pg_dump -U shahrzad shahrzad_db | gzip > backups/backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

---

## 🎯 استفاده از اسکریپت مدیریتی

```bash
cd ~/shahrzad-chatbot
./deploy.sh
```

این اسکریپت دارای منوی تعاملی است و شامل این گزینه‌ها:

1. نصب و راه‌اندازی اولیه
2. شروع پروژه
3. توقف پروژه
4. راه‌اندازی مجدد
5. مشاهده وضعیت
6. مشاهده لاگ‌ها
7. به‌روزرسانی
8. Backup دیتابیس
9. بازگردانی Backup
10. پاک‌سازی
11. تست سلامت
0. خروج

---

## 🛡️ تنظیم Firewall (اختیاری ولی توصیه می‌شود)

```bash
# Ubuntu/Debian
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service={ssh,http,https}
sudo firewall-cmd --reload
```

---

## 🌐 تنظیم Domain و SSL (اختیاری)

### سریع:

```bash
# نصب Nginx و Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# دریافت SSL
sudo certbot --nginx -d yourdomain.com
```

**راهنمای کامل:** [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md)

---

## 📊 چک کردن وضعیت

```bash
# وضعیت services
docker-compose ps

# منابع مصرفی
docker stats --no-stream

# تست Backend
curl http://localhost:8000/docs

# تست LLM API
curl -X POST http://103.75.196.71:8020/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","message":"سلام"}'
```

---

## ❓ مشکل دارید؟

### Backend نمی‌تونه به Database وصل شه:
```bash
docker-compose logs database
docker-compose logs backend
```

### Frontend نمایش داده نمیشه:
```bash
docker-compose logs frontend
curl -I http://localhost
```

### همه چیز رو از اول شروع کن:
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## 📚 مستندات کامل

- **راهنمای Production کامل:** [PRODUCTION-DEPLOYMENT.md](./PRODUCTION-DEPLOYMENT.md)
- **راهنمای توسعه:** [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)
- **README اصلی:** [README.md](./README.md)

---

## ✅ Checklist سریع

- [ ] Docker نصب شد
- [ ] Docker Compose نصب شد
- [ ] پروژه دانلود شد
- [ ] SECRET_KEY تغییر کرد
- [ ] رمز Database تغییر کرد
- [ ] `docker-compose up -d --build` اجرا شد
- [ ] Frontend قابل دسترسی است
- [ ] Backend Docs کار می‌کند

---

## 🎉 موفق باشید!

پروژه شما آماده است! 🚀

- Frontend: `http://YOUR_SERVER_IP`
- API Docs: `http://YOUR_SERVER_IP:8000/docs`
