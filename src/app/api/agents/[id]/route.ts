/**
 * Get/Delete Individual Agent API
 * 
 * GET /api/agents/[id] - Get single agent
 * PUT /api/agents/[id] - Update agent
 * DELETE /api/agents/[id] - Delete agent
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { z } from 'zod'

// GET single agent
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const agent = await prisma.agent.findFirst({
      where: { id, userId: user.id },
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    return NextResponse.json({ agent })
  } catch (error) {
    console.error('Error getting agent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Update agent schema
const updateAgentSchema = z.object({
  name: z.string().min(1).optional(),
  systemPrompt: z.string().optional(),
  model: z.string().optional(),
  apiKey: z.string().optional(),
})

// PUT - Update agent
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateAgentSchema.parse(body)

    // Check ownership
    const existing = await prisma.agent.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    const agent = await prisma.agent.update({
      where: { id },
      data,
    })

    return NextResponse.json({ agent })
  } catch (error) {
    const error_ = error as { errors?: { message: string }[] }
    if (error_.errors) {
      return NextResponse.json({ error: error_.errors[0].message }, { status: 400 })
    }
    console.error('Error updating agent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete agent
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Check ownership
    const existing = await prisma.agent.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    await prisma.agent.delete({ where: { id } })

    return NextResponse.json({ message: 'Agent deleted successfully' })
  } catch (error) {
    console.error('Error deleting agent:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}