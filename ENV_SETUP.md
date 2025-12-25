# راهنمای تنظیم فایل .env

## ایجاد فایل .env

در ریشه پروژه (همان مسیری که `package.json` قرار دارد)، یک فایل با نام `.env` ایجاد کنید.

## محتویات فایل .env

فایل `.env` باید شامل 4-5 متغیر باشد (4 اجباری + 1 اختیاری):

### 1. DATABASE_URL

آدرس دیتابیس PostgreSQL شما:

```env
DATABASE_URL="postgresql://neondb_owner:npg_dF4efzaTtJZ9@ep-small-bird-a42flr5u-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**نکته:** این آدرس از Neon database شما است. اگر دیتابیس دیگری دارید، آدرس آن را وارد کنید.

### 2. NEXTAUTH_URL

آدرس سایت شما:

```env
NEXTAUTH_URL="http://localhost:3000"
```

- در حالت توسعه (local): `http://localhost:3000`
- در حالت production: آدرس واقعی سایت شما مثل `https://yourdomain.com`

### 3. NEXTAUTH_SECRET

یک رشته تصادفی و مخفی برای رمزگذاری session ها:

```env
NEXTAUTH_SECRET="یک-رشته-تصادفی-و-طولانی-برای-امنیت"
```

**چگونه تولید کنیم؟**

**روش 1: استفاده از OpenSSL (اگر روی سیستم نصب است):**
```bash
openssl rand -base64 32
```

**روش 2: استفاده از Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**روش 3: استفاده از سایت‌های آنلاین:**
می‌توانید از سایت‌هایی مثل https://generate-secret.vercel.app/32 استفاده کنید.

**مثال یک کلید معتبر:**
```
NEXTAUTH_SECRET="aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890+/="
```

### 4. OPENAI_API_KEY

کلید API از OpenAI:

```env
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**چگونه دریافت کنیم؟**

1. به سایت https://platform.openai.com بروید
2. وارد حساب کاربری خود شوید (یا ثبت نام کنید)
3. به بخش API Keys بروید: https://platform.openai.com/api-keys
4. روی "Create new secret key" کلیک کنید
5. یک نام برای کلید انتخاب کنید (مثل: "Modares GPT")
6. کلید را کپی کنید (فقط یک بار نمایش داده می‌شود!)
7. در فایل `.env` قرار دهید

**مثال:**
```env
OPENAI_API_KEY="sk-proj-abc123def456ghi789jkl012mno345pqr678stu901vwx234yz"
```

### 5. ANTHROPIC_API_KEY (اختیاری)

کلید API از Anthropic برای استفاده از مدل‌های Claude:

```env
ANTHROPIC_API_KEY="sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**چگونه دریافت کنیم؟**

1. به سایت https://console.anthropic.com/ بروید
2. ثبت نام کنید یا وارد حساب کاربری خود شوید
3. به بخش API Keys بروید
4. روی "Create Key" کلیک کنید
5. یک نام برای کلید انتخاب کنید
6. کلید را کپی کنید
7. در فایل `.env` قرار دهید

**مثال:**
```env
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**نکته مهم:** این کلید اختیاری است. اگر این کلید را نگذارید، فقط مدل‌های OpenAI (GPT-4, GPT-3.5) کار می‌کنند و مدل‌های Claude غیرفعال خواهند بود.

## فایل نهایی .env شما باید این شکلی باشد:

```env
DATABASE_URL="postgresql://neondb_owner:npg_dF4efzaTtJZ9@ep-small-bird-a42flr5u-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="کلید-تصادفی-شما-اینجا"
OPENAI_API_KEY="sk-کلید-openai-شما-اینجا"
ANTHROPIC_API_KEY="sk-ant-کلید-anthropic-شما-اینجا"
```

**نکته:** `ANTHROPIC_API_KEY` اختیاری است و فقط در صورتی لازم است که بخواهید از مدل‌های Claude استفاده کنید.

## نکات مهم

1. ✅ فایل `.env` در `.gitignore` قرار دارد و به git اضافه نمی‌شود (امنیت)
2. ✅ هرگز کلیدهای API خود را در کد یا repository قرار ندهید
3. ✅ در production، از متغیرهای محیطی سرور استفاده کنید
4. ✅ بعد از ایجاد `.env`، سرور را restart کنید

## بررسی صحت تنظیمات

بعد از ایجاد فایل `.env`، می‌توانید با دستور زیر بررسی کنید که آیا متغیرها خوانده می‌شوند:

```bash
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅' : '❌'); console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? '✅' : '❌'); console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅' : '❌');"
```

یا اینکه فقط `npm run dev` را اجرا کنید و اگر خطا داد، مشکل را بررسی کنید.

