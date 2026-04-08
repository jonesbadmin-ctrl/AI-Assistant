/**
 * Chat API
 * 
 * POST /api/chat
 * Body: { agentId, message, conversationId? }
 * Returns: { response, conversationId }
 * 
 * Supports OpenAI and Groq providers
 */

import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-helpers'
import { z } from 'zod'

const chatSchema = z.object({
  agentId: z.string(),
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
})

// Detect provider from model name
function getProvider(model: string): 'openai' | 'groq' {
  if (model.startsWith('groq/')) {
    return 'groq'
  }
  return 'openai'
}

// Extract actual model ID from full model string
function getModelId(model: string): string {
  if (model.startsWith('groq/')) {
    return model.replace('groq/', '')
  }
  return model
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agentId, message, conversationId: providedConversationId } = chatSchema.parse(body)

    // Get agent configuration
    const agent = await prisma.agent.findFirst({
      where: { id: agentId, userId: user.id },
    })

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Get or create conversation
    let conversation
    if (providedConversationId) {
      conversation = await prisma.conversation.findFirst({
        where: { id: providedConversationId, agentId },
      })
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { agentId },
      })
    }

    // Get message history
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      select: { role: true, content: true },
    })

    // Build messages for LLM
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: agent.systemPrompt },
      ...history.map((m: { role: string; content: string }) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user', content: message },
    ]

    // Get API key based on provider - ensure it's a string
    const provider = getProvider(agent.model)
    let apiKey: string | undefined = agent.apiKey || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY
    
    // Ensure apiKey is a valid non-empty string
    if (!apiKey) {
      console.warn('No API key found', { 
        agentId, 
        provider, 
        hasAgentApiKey: !!agent.apiKey,
        hasOpenAIKey: !!process.env.OPENAI_API_KEY,
        hasGroqKey: !!process.env.GROQ_API_KEY
      })
      return NextResponse.json(
        { error: `No API key configured. Please add your ${provider === 'groq' ? 'Groq' : 'OpenAI'} API key.` },
        { status: 400 }
      )
    }

    // Force convert to string and validate
    apiKey = String(apiKey).trim()
    console.info('API Key type:', typeof apiKey, 'length:', apiKey.length)
    
    if (!apiKey) {
      return NextResponse.json(
        { error: `No API key configured. Please add your ${provider === 'groq' ? 'Groq' : 'OpenAI'} API key.` },
        { status: 400 }
      )
    }

    const modelId = getModelId(agent.model)
    console.info('Calling LLM', { 
      agentId, 
      provider, 
      model: modelId, 
      userId: user.id,
      keyPrefix: apiKey.substring(0, 10) // Log first 10 chars for debugging
    })

    let response: string

    if (provider === 'groq') {
      // Use Groq - call API directly instead of using SDK
      console.info('Calling Groq API directly', { model: modelId, agentId, apiKeyLength: apiKey.length })
      
      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelId,
          messages,
          temperature: 0.7,
        }),
      })

      if (!groqResponse.ok) {
        const errorText = await groqResponse.text()
        console.error('Groq API error:', groqResponse.status, errorText)
        return NextResponse.json({ error: `Groq API error: ${groqResponse.status} - ${errorText}` }, { status: 500 })
      }

      const groqData = await groqResponse.json()
      response = groqData.choices?.[0]?.message?.content || 'No response'
      console.info('Groq response received', { agentId })
    } else {
      // Use OpenAI
      const openai = new OpenAI({ apiKey })
      const completion = await openai.chat.completions.create({
        model: modelId,
        messages,
        temperature: 0.7,
      })
      response = completion.choices[0]?.message?.content || 'No response'
    }

    // Save messages
    await prisma.message.createMany({
      data: [
        { conversationId: conversation.id, role: 'user', content: message },
        { conversationId: conversation.id, role: 'assistant', content: response },
      ],
    })

    console.info('Chat response received', { agentId, provider, userId: user.id })

    return NextResponse.json({
      response,
      conversationId: conversation.id,
    })
  } catch (error: unknown) {
    console.error('Chat error details:', error)
    
    const err = error as { errors?: { message: string }[] }
    if (err.errors) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    
    // Provide more specific error messages
    const errorCode = (error as { code?: string }).code
    if (errorCode === 'insufficient_quota') {
      return NextResponse.json({ error: 'API quota exceeded. Please check your API key.' }, { status: 500 })
    }
    
    // Check for common Groq errors
    const errorMessage = error instanceof Error ? error.message : ''
    if (errorMessage.includes('API key')) {
      return NextResponse.json({ error: 'Invalid or missing API key. Please check your Groq API key.' }, { status: 500 })
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}