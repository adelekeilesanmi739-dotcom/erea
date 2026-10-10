EARNVIA - SUPABASE + PAYSTACK BACKEND

Run supabase/schema.sql in Supabase SQL Editor.

Secrets required in Supabase Edge Function Secrets:
PAYSTACK_SECRET_KEY=sk_test_...   (test first)
APP_URL=http://127.0.0.1:5500    (change to your real website URL in production)

Deploy:
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase functions deploy initialize-payment
supabase functions deploy verify-payment
supabase functions deploy create-withdrawal
supabase functions deploy paystack-webhook

Webhook URL in Paystack:
https://YOUR_PROJECT_REF.supabase.co/functions/v1/paystack-webhook

IMPORTANT:
- Never put PAYSTACK_SECRET_KEY in dashboard.js or any frontend file.
- Test with Paystack test keys before using live money.
- Real live transfers require a properly configured Paystack account/balance and compliance setup.
