import nodemailer from 'nodemailer'

interface SendOptions {
  to: string
  subject: string
  text?: string
  html?: string
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  const from = process.env.SMTP_FROM
  const secure = process.env.SMTP_SECURE === 'true' || false

  if (!host || !port || !user || !pass || !from) {
    return null
  }

  return { host, port, secure, auth: { user, pass }, from }
}

export async function sendEmail(opts: SendOptions) {
  const cfg = getSmtpConfig()
  if (!cfg) {
    throw new Error('SMTP not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM in .env.local')
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.auth,
  })

  const mail = {
    from: cfg.from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  }

  const info = await transporter.sendMail(mail)
  return info
}
