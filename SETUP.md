# راهنمای نصب و راه‌اندازی

## پیش‌نیازها

- Node.js 18 یا بالاتر
- PostgreSQL database (Neon)
- OpenAI API Key

## مراحل نصب

### 1. نصب Dependencies

```bash
npm install
```

### 2. تنظیم متغیرهای محیطی

فایل `.env` را در ریشه پروژه ایجاد کنید:

```env
DATABASE_URL="postgresql://neondb_owner:npg_dF4efzaTtJZ9@ep-small-bird-a42flr5u-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
OPENAI_API_KEY="your-openai-api-key-here"
```

**نکته:** برای تولید `NEXTAUTH_SECRET` می‌توانید از دستور زیر استفاده کنید:
```bash
openssl rand -base64 32
```

### 3. راه‌اندازی دیتابیس

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed کردن داده‌های اولیه (اختیاری)

```bash
npx tsx lib/seed.ts
```

این دستور خدمات اولیه را در دیتابیس ایجاد می‌کند.

### 5. اجرای پروژه

```bash
npm run dev
```

پروژه در آدرس `http://localhost:3000` در دسترس خواهد بود.

## ایجاد کاربر ادمین

برای ایجاد کاربر ادمین، می‌توانید از Prisma Studio استفاده کنید:

```bash
npx prisma studio
```

یا مستقیماً در دیتابیس نقش کاربر را به `ADMIN` تغییر دهید.

## مشکلات رایج

### خطای Prisma Client

اگر با خطای Prisma Client مواجه شدید:

```bash
npx prisma generate
```

### خطای دیتابیس

اطمینان حاصل کنید که `DATABASE_URL` به درستی تنظیم شده و دیتابیس در دسترس است.

### خطای OpenAI API

مطمئن شوید که `OPENAI_API_KEY` معتبر است و دارای اعتبار کافی برای استفاده از API است.

