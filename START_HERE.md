# چت‌بات شهرزاد - دستورالعمل راه‌اندازی

## فقط همین دستور را اجرا کنید:

```bash
docker compose down -v && docker compose up --build -d
```

## سپس لاگ‌ها را ببینید:

```bash
docker compose logs -f
```

## بررسی کنید که همه Up هستند:

```bash
docker compose ps
```

باید خروجی مشابه این را ببینید:
```
NAME                   STATUS
shahrzad_backend       Up
shahrzad_database      Up (healthy)
shahrzad_frontend      Up
shahrzad_nginx         Up
```

## تست:

مرورگر را باز کنید:
```
http://103.75.196.71:8090
```

یا با curl:
```bash
curl http://103.75.196.71:8090/api
```

## اگر خطا دیدید:

```bash
# لاگ backend برای دیدن خطای دقیق
docker compose logs backend | tail -50

# لاگ database
docker compose logs database | tail -50
```

---

## نکات مهم:

1. ✅ Migration خودکار است (در `app/main.py`)
2. ✅ جداول دیتابیس خودکار ساخته می‌شوند
3. ✅ فایل `.env` باید در ریشه پروژه باشد
4. ✅ پورت 8090 باید آزاد باشد

همین!
