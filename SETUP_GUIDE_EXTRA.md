## Optional: SMTP (for sending drafted emails)

If you want the app to send drafted emails automatically, set these environment variables in your `.env.local`:

```
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM="Your Name <noreply@yourdomain.com>"
# Set SMTP_SECURE=true if using TLS on port 465
```

If SMTP is not configured the app will still generate drafts, but will not send them.

Notes:
- For local testing, you can use services like MailHog, Mailtrap, or a local SMTP server.
- Never commit real credentials to source control. Use `.env.local` and store secrets securely in production (Vercel/Secrets/Env).
