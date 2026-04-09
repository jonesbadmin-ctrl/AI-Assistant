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
    // Simple test first
    console.log('Testing DB connection...')
    await prisma.$connect()
    console.log('DB connected!')
    
    const body = await request.json()
    const { email, password, name } = registerSchema.parse(body)
    console.log('Registration for:', email)

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}