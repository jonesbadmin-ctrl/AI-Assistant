/**
 * User Registration API
 * 
 * POST /api/auth/register
 * Body: { email, password, name? }
 */

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { sendWelcomeEmail } from '@/lib/email'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    console.log('Registration attempt:', { url: request.url, env: process.env.DATABASE_URL ? 'DB present' : 'NO DB' })
    const body = await request.json()
    const { email, password, name } = registerSchema.parse(body)
    console.log('Registration data:', { email, name: name || '(no name)' })

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log('User already exists:', email)
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    })

    console.log('User created successfully:', user.id, user.email)

    // Send welcome email (non-blocking)
    sendWelcomeEmail(user.email, user.name || undefined)
      .then(result => {
        if (result.success) {
          console.log('Welcome email sent:', result.messageId)
        } else {
          console.error('Welcome email failed:', result.error)
        }
      })
      .catch(err => console.error('Welcome email error:', err))

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    const err = error as { errors?: { message: string }[] }
    if (err.errors) {
      return NextResponse.json(
        { error: err.errors[0].message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}