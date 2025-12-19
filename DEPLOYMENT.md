# راهنمای استقرار وب اپلیکیشن چت

## پیش‌نیازها
- Docker و Docker Compose نصب شده باشد
- دسترسی به سرور با آدرس 103.75.196.71
- پورت 8082 باز باشد

## مراحل استقرار

### 1. آماده‌سازی فایل .env
مطمئن شوید فایل `.env` با اطلاعات صحیح موجود است:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_CHAT_API_URL=http://103.75.196.71:8020/chat
```

### 2. ساخت و اجرای کانتینر
```bash
# ساخت ایمیج Docker
docker-compose build

# اجرای کانتینر
docker-compose up -d
```

### 3. بررسی وضعیت
```bash
# مشاهده لاگ‌ها
docker-compose logs -f

# بررسی وضعیت کانتینر
docker-compose ps
```

### 4. دسترسی به اپلیکیشن
اپلیکیشن در آدرس زیر در دسترس خواهد بود:
```
http://103.75.196.71:8082
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

## API چت
اپلیکیشن به API چت خارجی متصل است:
- آدرس: http://103.75.196.71:8020/chat
- متد: POST
- بدنه درخواست:
```json
{
  "session_id": "string",
  "message": "string"
}
```

## عیب‌یابی

### اگر کانتینر start نمی‌شود:
```bash
docker-compose logs chat-app
```

### اگر نیاز به rebuild دارید:
```bash
docker-compose build --no-cache
docker-compose up -d
```

### بررسی اتصال به API:
```bash
curl -X POST http://103.75.196.71:8020/chat \
  -H "Content-Type: application/json" \
  -d '{"session_id":"test","message":"سلام"}'
```
