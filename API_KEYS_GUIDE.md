# راهنمای API Key ها

## API Key های مورد نیاز

### ✅ اجباری (باید حتماً داشته باشید):

#### 1. OPENAI_API_KEY
- **چیست:** کلید API از OpenAI
- **استفاده:** برای GPT-4, GPT-3.5 Turbo, DALL-E 2, DALL-E 3
- **دریافت:** https://platform.openai.com/api-keys
- **فرمت:** `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **هزینه:** بر اساس استفاده (Pay-as-you-go)

### ⚪ اختیاری (فقط در صورت نیاز):

#### 2. ANTHROPIC_API_KEY
- **چیست:** کلید API از Anthropic (برای Claude)
- **استفاده:** برای Claude 3 Opus, Claude 3 Sonnet
- **دریافت:** https://console.anthropic.com/
- **فرمت:** `sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **هزینه:** بر اساس استفاده
- **نکته:** اگر این کلید را نگذارید، فقط مدل‌های OpenAI کار می‌کنند

## مدل‌های پشتیبانی شده

### ✅ پیاده‌سازی شده و کار می‌کنند:

1. **GPT-4** → نیاز به `OPENAI_API_KEY`
2. **GPT-3.5 Turbo** → نیاز به `OPENAI_API_KEY`
3. **DALL-E 3** → نیاز به `OPENAI_API_KEY`
4. **DALL-E 2** → نیاز به `OPENAI_API_KEY`
5. **Claude 3 Opus** → نیاز به `ANTHROPIC_API_KEY` ⚪
6. **Claude 3 Sonnet** → نیاز به `ANTHROPIC_API_KEY` ⚪

### ❌ نمایش داده می‌شوند اما کار نمی‌کنند:

- **Midjourney:** API عمومی ندارد و فقط در UI نمایش داده می‌شود
- **Stable Diffusion:** پیاده‌سازی نشده و فقط در UI نمایش داده می‌شود

## مثال فایل .env

### حداقل (فقط OpenAI):
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
OPENAI_API_KEY="sk-proj-your-key-here"
```

### کامل (با Claude):
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
OPENAI_API_KEY="sk-proj-your-key-here"
ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

## چگونه API Key دریافت کنیم؟

### OpenAI:
1. به https://platform.openai.com بروید
2. ثبت نام / ورود کنید
3. به بخش API Keys: https://platform.openai.com/api-keys
4. "Create new secret key" کلیک کنید
5. کلید را کپی کنید

### Anthropic (Claude):
1. به https://console.anthropic.com/ بروید
2. ثبت نام / ورود کنید
3. به بخش API Keys بروید
4. "Create Key" کلیک کنید
5. کلید را کپی کنید

## نکات مهم

1. ✅ API Key ها را هرگز در کد قرار ندهید
2. ✅ فقط در فایل `.env` (که در `.gitignore` است) قرار دهید
3. ✅ در production از متغیرهای محیطی سرور استفاده کنید
4. ✅ هر API Key هزینه دارد - استفاده را کنترل کنید
5. ✅ اگر API Key ندارید، فقط مدل‌های OpenAI کار می‌کنند


