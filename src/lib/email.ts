/**
 * Email Service
 * 
 * Uses nodemailer with Gmail SMTP to send transactional emails
 */

import nodemailer from 'nodemailer'

// Create transporter using Gmail SMTP with direct settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'nextbotai26@gmail.com',
    pass: 'stfu wxul rkkp mdbz',
  },
})

export async function sendWelcomeEmail(email: string, name?: string) {
  try {
    // Send welcome email to new user
    const result = await transporter.sendMail({
      from: '"NexBot AI" <nextbotai26@gmail.com>',
      to: email,
      subject: 'Welcome to NexBot AI!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🤖 NexBot AI</h1>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #333;">Welcome${name ? `, ${name}` : ''}!</h2>
            
            <p style="color: #666; font-size: 16px;">
              Your NexBot AI account has been successfully created. 
              You can now start building your own AI assistants!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://ai-assistant-builder-ten.vercel.app/login" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 30px; border-radius: 25px; text-decoration: none; font-weight: 600;">
                Get Started
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px;">
              If you didn't create this account, please ignore this email.
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding: 20px 0; text-align: center; color: #999; font-size: 12px;">
            <p>© 2026 NexBot AI. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    })

    console.log('Welcome email sent:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return { success: false, error }
  }
}