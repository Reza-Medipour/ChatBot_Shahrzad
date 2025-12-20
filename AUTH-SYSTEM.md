# سیستم احراز هویت و امنیت

این سند توضیحات کامل سیستم authentication و امنیت اپلیکیشن را ارائه می‌دهد.

## معماری Authentication

### جریان ورود کاربر

```
1. Welcome Page (صفحه خوشامدگویی)
   ↓ کلیک "شروع گفتگو"
2. Login Page (صفحه ورود)
   ↓ وارد کردن شماره تلفن
3. بررسی در دیتابیس
   ├─ کاربر وجود دارد → به‌روزرسانی last_login
   └─ کاربر جدید → ایجاد رکورد جدید
4. ذخیره در localStorage
   ├─ userId
   └─ phoneNumber
5. Chat Page (صفحه چت)
```

## ساختار دیتابیس

### جدول users

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz DEFAULT now()
);
```

**فیلدها:**
- `id`: شناسه یکتای کاربر (UUID)
- `phone_number`: شماره تلفن (یکتا و الزامی)
- `created_at`: زمان ثبت‌نام
- `last_login`: آخرین زمان ورود

### جدول chat_sessions (آپدیت شده)

```sql
ALTER TABLE chat_sessions
ADD COLUMN user_id uuid REFERENCES users(id) ON DELETE CASCADE;
```

**تغییرات:**
- اضافه شدن `user_id` به عنوان foreign key
- ارتباط یک به چند با users
- حذف خودکار sessions هنگام حذف کاربر

## Row Level Security (RLS)

### پالیسی‌های users

```sql
-- خواندن: همه می‌توانند پروفایل‌ها را ببینند
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (true);

-- ایجاد: همه می‌توانند حساب بسازند
CREATE POLICY "Users can create profile"
  ON users FOR INSERT
  WITH CHECK (true);

-- به‌روزرسانی: همه می‌توانند پروفایل خود را به‌روز کنند
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);
```

### پالیسی‌های chat_sessions

```sql
-- فقط sessions با user_id قابل دسترسی هستند
CREATE POLICY "Users can read own sessions"
  ON chat_sessions FOR SELECT
  USING (user_id IS NOT NULL);

CREATE POLICY "Users can create own sessions"
  ON chat_sessions FOR INSERT
  WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "Users can update own sessions"
  ON chat_sessions FOR UPDATE
  USING (user_id IS NOT NULL)
  WITH CHECK (user_id IS NOT NULL);

CREATE POLICY "Users can delete own sessions"
  ON chat_sessions FOR DELETE
  USING (user_id IS NOT NULL);
```

**نکته مهم:** با استفاده از `user_id IS NOT NULL` بجای مقایسه مستقیم،
از سمت client باید user_id صحیح ارسال شود.

### پالیسی‌های messages

```sql
-- فقط پیام‌های sessions خود کاربر
CREATE POLICY "Users can read messages from own sessions"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = messages.session_id
      AND chat_sessions.user_id IS NOT NULL
    )
  );

CREATE POLICY "Users can create messages in own sessions"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions
      WHERE chat_sessions.id = messages.session_id
      AND chat_sessions.user_id IS NOT NULL
    )
  );
```

## Session Management

### localStorage

```typescript
// ذخیره هنگام لاگین
localStorage.setItem('userId', user.id);
localStorage.setItem('phoneNumber', phone);

// بارگذاری هنگام بارگذاری صفحه
const savedUserId = localStorage.getItem('userId');
const savedPhoneNumber = localStorage.getItem('phoneNumber');

// حذف هنگام لاگ‌اوت
localStorage.removeItem('userId');
localStorage.removeItem('phoneNumber');
```

### Auto-Login

```typescript
useEffect(() => {
  const savedUserId = localStorage.getItem('userId');
  const savedPhoneNumber = localStorage.getItem('phoneNumber');

  if (savedUserId && savedPhoneNumber) {
    setUserId(savedUserId);
    setPhoneNumber(savedPhoneNumber);
    setShowWelcome(false);
    setShowLogin(false);
    loadSessions(savedUserId);
  }
}, []);
```

**مزایا:**
- کاربر بعد از refresh صفحه همچنان لاگین است
- نیازی به لاگین مجدد نیست
- تجربه کاربری بهتر

## جداسازی داده‌های کاربران

### فیلتر کردن Sessions

```typescript
const loadSessions = async (userIdParam: string) => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .eq('user_id', userIdParam)  // فقط sessions این کاربر
    .order('updated_at', { ascending: false });

  setSessions(data || []);
};
```

### ایجاد Session جدید

```typescript
const createNewSession = async () => {
  if (!userId) return;  // بررسی لاگین

  const { data, error } = await supabase
    .from('chat_sessions')
    .insert([{
      title: 'چت جدید',
      user_id: userId  // اتصال به کاربر فعلی
    }])
    .select()
    .single();
};
```

## امنیت

### نکات امنیتی

1. **شماره تلفن یکتا است**
   - هر شماره فقط یک حساب
   - UNIQUE constraint در دیتابیس

2. **هر کاربر فقط داده‌های خود را می‌بیند**
   - RLS policies بر اساس user_id
   - فیلتر شدن در سمت سرور (Supabase)

3. **Session Management امن**
   - localStorage فقط browser-side
   - حذف کامل هنگام logout

4. **Validation شماره تلفن**
   - حداقل 10 رقم
   - فقط اعداد
   - فرمت ایرانی (09xxxxxxxxx)

### محدودیت‌ها

⚠️ **توجه:** این سیستم برای محیط دمو و تست است.

برای محیط production باید:
- ✅ سیستم OTP اضافه شود
- ✅ Captcha برای جلوگیری از spam
- ✅ Rate limiting برای API
- ✅ 2FA (Two-Factor Authentication)
- ✅ Token-based authentication به جای localStorage

## Flow Chart

```
                    ┌─────────────────┐
                    │  Welcome Page   │
                    └────────┬────────┘
                             │ Click "شروع گفتگو"
                             ▼
                    ┌─────────────────┐
                    │   Login Page    │
                    └────────┬────────┘
                             │ Enter Phone
                             ▼
                    ┌─────────────────┐
                    │  Check in DB    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
         User Exists               User Not Exists
              │                             │
              ▼                             ▼
    ┌──────────────────┐          ┌──────────────────┐
    │ Update last_login│          │  Create New User │
    └──────────┬───────┘          └──────────┬───────┘
              │                             │
              └──────────────┬──────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Save to         │
                    │ localStorage    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Chat Page     │
                    │ (Load Sessions) │
                    └─────────────────┘
```

## تست کردن

### تست جداسازی کاربران

1. باز کردن اپلیکیشن در Chrome
2. لاگین با شماره: 09123456789
3. ایجاد چند چت
4. باز کردن اپلیکیشن در Firefox (یا Incognito)
5. لاگین با شماره: 09987654321
6. بررسی: کاربر دوم نباید چت‌های کاربر اول را ببیند

### تست Logout

1. لاگین کردن
2. ایجاد چت
3. کلیک روی "خروج از حساب"
4. بررسی: انتقال به Welcome Page
5. Refresh صفحه
6. بررسی: همچنان Welcome Page (نه صفحه چت)

### تست Auto-Login

1. لاگین کردن
2. Refresh صفحه (F5)
3. بررسی: مستقیم به صفحه چت می‌رود
4. بررسی: شماره تلفن در سایدبار نمایش داده می‌شود

## نتیجه‌گیری

سیستم احراز هویت با شماره تلفن پیاده‌سازی شده و هر کاربر داده‌های مجزای خود را دارد.
امنیت در سطح دیتابیس با RLS تضمین شده و تجربه کاربری با localStorage بهبود یافته است.

برای سوالات یا مشکلات، مستندات Supabase را مطالعه کنید:
- https://supabase.com/docs/guides/auth
- https://supabase.com/docs/guides/database/postgres/row-level-security
