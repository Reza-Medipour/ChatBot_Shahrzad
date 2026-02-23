#!/bin/bash

echo "===================================="
echo "چت‌بات شهرزاد - راه‌اندازی کامل"
echo "===================================="
echo ""

# توقف و حذف کانتینرهای قدیمی
echo "1. توقف و حذف کانتینرهای قدیمی..."
docker compose down -v

# پاک کردن image‌های قدیمی
echo ""
echo "2. پاک کردن image‌های قدیمی..."
docker compose rm -f

# ساخت مجدد همه سرویس‌ها
echo ""
echo "3. ساخت مجدد سرویس‌ها..."
docker compose build --no-cache

# اجرای سرویس‌ها
echo ""
echo "4. اجرای سرویس‌ها..."
docker compose up -d

# منتظر ماندن برای database
echo ""
echo "5. منتظر آماده شدن database..."
sleep 10

# نمایش وضعیت
echo ""
echo "6. وضعیت سرویس‌ها:"
docker compose ps

echo ""
echo "===================================="
echo "راه‌اندازی کامل شد!"
echo ""
echo "برنامه در آدرس زیر در دسترس است:"
echo "http://localhost:8090"
echo ""
echo "برای مشاهده لاگ‌ها:"
echo "docker compose logs -f"
echo "===================================="
