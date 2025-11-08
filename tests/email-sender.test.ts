import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('nodemailer', () => {
  return {
    default: {
      createTransport: vi.fn(() => ({
        sendMail: vi.fn(async (mail: any) => ({ messageId: 'mocked', accepted: [mail.to] })),
      })),
    },
  }
})

import { sendEmail } from '@/lib/email-sender'

describe('email-sender', () => {
  beforeEach(() => {
    process.env.SMTP_HOST = 'smtp.example.local'
    process.env.SMTP_PORT = '587'
    process.env.SMTP_USER = 'user'
    process.env.SMTP_PASS = 'pass'
    process.env.SMTP_FROM = 'noreply@example.com'
    process.env.SMTP_SECURE = 'false'
  })

  it('sends an email via nodemailer', async () => {
    const info = await sendEmail({ to: 'test@localhost', subject: 'Hi', text: 'Hello' })
    expect(info).toBeDefined()
    // Our mocked sendMail returns an object with messageId
    expect((info as any).messageId).toBe('mocked')
  })
})
