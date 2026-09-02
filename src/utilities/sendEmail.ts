import nodemailer from 'nodemailer'

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter

  const host = process.env.BREVO_SMTP_HOST
  const port = process.env.BREVO_SMTP_PORT
  const login = process.env.BREVO_SMTP_LOGIN
  const key = process.env.BREVO_SMTP_KEY

  if (!host || !port || !login || !key) {
    throw new Error('Brevo SMTP environment variables are not fully configured.')
  }

  transporter = nodemailer.createTransport({
    host,
    port: Number(port),
    secure: false, // 587 uses STARTTLS, not implicit TLS
    auth: { user: login, pass: key },
  })

  return transporter
}

type SendEmailArgs = {
  to: string
  subject: string
  html: string
  text: string
}

/** Sends one email through Brevo's SMTP relay. Throws on failure — callers decide how to handle that. */
export async function sendEmail({ to, subject, html, text }: SendEmailArgs): Promise<void> {
  const from = process.env.BREVO_SENDER_EMAIL

  if (!from) {
    throw new Error('BREVO_SENDER_EMAIL is not configured.')
  }

  await getTransporter().sendMail({ from, to, subject, html, text })
}
