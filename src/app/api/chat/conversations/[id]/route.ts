/**
 * Delete Conversation API
 * 
 * DELETE /api/chat/conversations/[id]
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'

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

    // Verify ownership through agent
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { agent: true },
    })

    if (!conversation || conversation.agent.userId !== user.id) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    // Delete messages first, then conversation
    await prisma.message.deleteMany({
      where: { conversationId: id },
    })

    await prisma.conversation.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Conversation deleted successfully' })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}