/**
 * List/Create Agents API
 * 
 * GET /api/agents - List user's agents
 * POST /api/agents - Create new agent
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { z } from 'zod'

// GET - List all agents for current user
export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const agents = await prisma.agent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        systemPrompt: true,
        model: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ agents })
  } catch (error) {
    console.error('Error listing agents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create new agent
const createAgentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  apiKey: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, systemPrompt, model, apiKey } = createAgentSchema.parse(body)

    const agent = await prisma.agent.create({
      data: {
        userId: user.id,
        name,
        systemPrompt: systemPrompt || 'You are a helpful assistant.',
        model: model || 'gpt-4o-mini',
        apiKey: apiKey || null,
      },
    })

    return NextResponse.json({ agent }, { status: 201 })
  } catch (error) {
    const err = error as { errors?: { message: string }[] }
    if (err.errors) {
      return NextResponse.json(
        { error: err.errors[0].message },
        { status: 400 }
      )
    }
    console.error('Error creating agent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}