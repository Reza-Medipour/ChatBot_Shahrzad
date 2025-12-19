# راهنمای استقرار وب اپلیکیشن چت

## پیش‌نیازها
- Docker و Docker Compose نصب شده باشد
- دسترسی به سرور با آدرس 103.75.196.71
- پورت 8082 باز باشد
- API Backend روی پورت 8020 در حال اجرا باشد

## معماری

```
کاربر → nginx:8082 → /chat → proxy → Backend API:8020
```

### حل مشکل CORS

برای جلوگیری از خطای CORS، از Nginx Proxy استفاده شده است:

- Frontend درخواست‌ها را به `/chat` (relative path) ارسال می‌کند
- Nginx درخواست را به `http://172.17.0.1:8020/chat` forward می‌کند
- پاسخ از همان domain برمی‌گردد، بنابراین CORS مشکلی ایجاد نمی‌کند

## مراحل استقرار

### 1. بررسی API Backend

مطمئن شوید API Backend روی پورت 8020 در حال اجرا است:
```bash
curl http://172.17.0.1:8020/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","message":"سلام"}'
```

### 2. آماده‌سازی فایل .env

مطمئن شوید فایل `.env` با اطلاعات صحیح موجود است:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

**توجه:** دیگر نیازی به `VITE_CHAT_API_URL` نیست زیرا از Nginx Proxy استفاده می‌کنیم.

### 3. ساخت و اجرای کانتینر

```bash
# توقف کانتینر قبلی (اگر وجود دارد)
docker-compose down

# ساخت ایمیج Docker (با no-cache برای اطمینان از تغییرات)
docker-compose build --no-cache

# اجرای کانتینر
docker-compose up -d

# مشاهده لاگ‌ها
docker-compose logs -f chat-app
```

### 4. بررسی وضعیت

```bash
# بررسی وضعیت کانتینر
docker-compose ps

# بررسی تنظیمات Nginx
docker exec -it chat-app-container nginx -t

# تست درخواست به proxy
curl http://103.75.196.71:8082/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","message":"سلام"}'
```

### 5. دسترسی به اپلیکیشن

اپلیکیشن در آدرس زیر در دسترس خواهد بود:
```
http://103.75.196.71:8082
```

## فایل‌های مهم

### nginx.conf

این فایل شامل تنظیمات Nginx است که شامل:
- Serve کردن فایل‌های استاتیک
- Proxy کردن `/chat` به Backend API
- تنظیمات Cache و Gzip

```nginx
location /chat {
    proxy_pass http://172.17.0.1:8020/chat;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## دستورات مفید

### توقف کانتینر
```bash
docker-compose down
```

### ریستارت کانتینر
```bash
docker-compose restart
```

### حذف کانتینر و ایمیج
```bash
docker-compose down --rmi all
```

### مشاهده لاگ‌های لحظه‌ای
```bash
docker-compose logs -f chat-app
```

### ورود به کانتینر
```bash
docker exec -it chat-app-container sh
```

### تست Nginx داخل کانتینر
```bash
docker exec -it chat-app-container nginx -t
docker exec -it chat-app-container nginx -s reload
```

## API چت

### Backend API
- آدرس داخلی: http://172.17.0.1:8020/chat
- متد: POST
- بدنه درخواست:
```json
{
  "session_id": "string",
  "message": "string"
}
```

### Frontend Request
- آدرس نسبی: `/chat`
- Nginx به صورت خودکار آن را به Backend forward می‌کند

## عیب‌یابی

### اگر کانتینر start نمی‌شود:
```bash
docker-compose logs chat-app
```

### اگر خطای CORS دریافت کردید:

1. بررسی کنید Backend API روی پورت 8020 در حال اجرا است:
```bash
curl http://172.17.0.1:8020/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","message":"سلام"}'
```

2. بررسی تنظیمات Nginx:
```bash
docker exec -it chat-app-container cat /etc/nginx/conf.d/default.conf
```

3. بررسی لاگ‌های Nginx:
```bash
docker logs chat-app-container
```

### اگر نیاز به rebuild دارید:
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### بررسی اتصال از داخل کانتینر:
```bash
docker exec -it chat-app-container sh
wget -O- http://172.17.0.1:8020/chat --post-data='{"session_id":"test","message":"سلام"}' --header='Content-Type: application/json'
```

### بررسی Network:
```bash
# بررسی IP کانتینر
docker inspect chat-app-container | grep IPAddress

# بررسی ارتباط با host
docker exec -it chat-app-container ping 172.17.0.1
```

## به‌روزرسانی

برای اعمال تغییرات جدید در کد:

```bash
# 1. Build کردن پروژه در local
npm run build

# 2. توقف کانتینر
docker-compose down

# 3. ساخت مجدد ایمیج
docker-compose build --no-cache

# 4. اجرای کانتینر
docker-compose up -d

# 5. بررسی لاگ‌ها
docker-compose logs -f
```

## نکات امنیتی

- مطمئن شوید Backend API فقط از داخل شبکه Docker قابل دسترسی است
- از فایروال برای محدود کردن دسترسی به پورت‌ها استفاده کنید
- در محیط production از HTTPS استفاده کنید
- RLS را برای دیتابیس Supabase فعال کنید و احراز هویت اضافه کنید

## مانیتورینگ

### بررسی منابع مصرفی:
```bash
docker stats chat-app-container
```

### بررسی تعداد درخواست‌ها:
```bash
docker logs chat-app-container | grep "POST /chat"
```

## پشتیبان‌گیری

برای پشتیبان‌گیری از دیتابیس Supabase:
1. از پنل Supabase وارد بخش Database شوید
2. از گزینه Backup استفاده کنید
3. یا از CLI ابزار supabase برای export استفاده کنید
