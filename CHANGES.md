# خلاصه تغییرات انجام شده

## مشکلاتی که برطرف شد:

### 1. مشکل Backend (خطای 500)
**علت:** Schema دیتابیس با Models هماهنگ نبود
- کد Backend دنبال فیلد `shahrzaad_id` می‌گشت که در دیتابیس وجود نداشت
- `user_id` در جدول `chat_sessions` از نوع UUID بود اما در Model به TEXT تغییر کرده بود

**راه‌حل:**
- ✅ Model `User` ساده شد: فقط `id` (TEXT) و `created_at`
- ✅ `ChatSession.user_id` از UUID به TEXT تبدیل شد
- ✅ تابع `get_or_create_user` اصلاح شد تا از `User.id` استفاده کند
- ✅ Schema ها (Pydantic) با Models همگام شدند

### 2. مشکل Docker Compose
**علت:** Warning از `version: '3.8'`

**راه‌حل:**
- ✅ خط `version` حذف شد (دیگر لازم نیست)

### 3. مشکل Migration
**علت:** دستور `docker compose exec db` کار نمی‌کرد چون service name `database` است نه `db`

**راه‌حل:**
- ✅ Script خودکار migration ساخته شد (`backend/migrate_db.py`)
- ✅ Dockerfile به‌روز شد تا هنگام startup خودکار migration اجرا کند
- ✅ Script `start.sh` ساخته شد که migration را قبل از اجرای FastAPI اجرا می‌کند

## تغییرات فایل‌ها:

### Backend

#### `backend/app/models.py`
```python
# قبل:
class User(Base):
    id = Column(UUID, primary_key=True)
    shahrzaad_id = Column(String, unique=True)
    phone_number = Column(String)
    username = Column(String)
    password = Column(String)
    is_registered = Column(Boolean)
    # ...

# بعد:
class User(Base):
    id = Column(String, primary_key=True)  # TEXT
    created_at = Column(DateTime)
```

#### `backend/app/schemas.py`
```python
# قبل:
class UserResponse(BaseModel):
    id: UUID
    shahrzaad_id: Optional[str]
    phone_number: Optional[str]
    # ...

class ChatSessionResponse(BaseModel):
    user_id: Optional[UUID]  # UUID
    # ...

# بعد:
class UserResponse(BaseModel):
    id: str  # TEXT
    created_at: datetime

class ChatSessionResponse(BaseModel):
    user_id: Optional[str]  # TEXT
    # ...
```

#### `backend/app/routes/conversations.py`
```python
# قبل:
user = db.query(models.User).filter(
    models.User.shahrzaad_id == user_id
).first()

# بعد:
user = db.query(models.User).filter(
    models.User.id == user_id
).first()
```

### Frontend

#### UI کامل مطابق Figma:
- ✅ ایکون ربات 3D اضافه شد (`/bot-icon.png`)
- ✅ Header آبی gradient با "دستیار هوشمند شهرزاد"
- ✅ پیام خوش‌آمدگویی اضافه شد
- ✅ Suggested prompts به صورت لیست با arrow
- ✅ پیام کاربر: آبی gradient
- ✅ پیام ربات: سفید با ایکون
- ✅ Input box با رنگ خاکستری

### Infrastructure

#### فایل‌های جدید:
1. `backend/migrate_db.py` - اسکریپت migration
2. `backend/start.sh` - اسکریپت startup با migration خودکار
3. `SETUP.md` - راهنمای کامل راه‌اندازی
4. `reset-and-start.sh` - اسکریپت راه‌اندازی سریع
5. `CHANGES.md` - این فایل

#### `backend/Dockerfile`
```dockerfile
# اضافه شد:
RUN chmod +x start.sh
CMD ["./start.sh"]  # به جای uvicorn مستقیم
```

#### `docker-compose.yml`
```yaml
# حذف شد:
# version: '3.8'  ❌

# باقی ماند:
services:  ✅
```

## دستورات اجرا:

### راه‌اندازی سریع (پیشنهادی):
```bash
./reset-and-start.sh
```

### راه‌اندازی دستی:
```bash
# 1. توقف و حذف قدیمی‌ها
docker compose down -v

# 2. ساخت مجدد
docker compose build --no-cache

# 3. اجرا
docker compose up -d

# 4. مشاهده لاگ
docker compose logs -f
```

### بررسی سلامت:
```bash
# وضعیت کانتینرها
docker compose ps

# لاگ backend
docker compose logs backend

# تست API
curl http://localhost:8090/api

# تست health check
curl http://localhost:8090/health
```

## ساختار دیتابیس جدید:

```sql
-- users: ساده‌ترین حالت ممکن
CREATE TABLE users (
  id TEXT PRIMARY KEY,              -- user_xxx_timestamp
  created_at TIMESTAMPTZ DEFAULT now()
);

-- chat_sessions: user_id حالا TEXT است
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY,
  title TEXT DEFAULT 'چت جدید',
  user_id TEXT REFERENCES users(id),  -- TEXT نه UUID
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

-- messages: بدون تغییر
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  session_id UUID REFERENCES chat_sessions(id),
  content TEXT,
  is_user BOOLEAN,
  created_at TIMESTAMPTZ
);
```

## نکات مهم:

1. ✅ **Migration خودکار است**: هر بار که backend بالا می‌آید، migration چک و اجرا می‌شود
2. ✅ **داده‌های قدیمی پاک می‌شوند**: migration جداول را DROP می‌کند
3. ✅ **User ID ساده**: فرمت `user_xxx_timestamp` بدون پیچیدگی
4. ✅ **هماهنگی کامل**: Models، Schemas، و Database هماهنگ هستند
5. ✅ **UI مطابق Figma**: طراحی کاملاً مطابق تصویر ارسالی

## آزمایش:

بعد از راه‌اندازی:

1. مرورگر را باز کنید: `http://localhost:8090`
2. باید پیام خوش‌آمد از ربات را ببینید
3. دکمه‌های پیشنهادی را کلیک کنید
4. پیام بفرستید و جواب دریافت کنید

اگر خطا بود:
```bash
docker compose logs backend
docker compose logs database
```
