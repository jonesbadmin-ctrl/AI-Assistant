'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  createdAt: string
}

interface Agent {
  id: string
  name: string
  systemPrompt: string
  model: string
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string

  const [agent, setAgent] = useState<Agent | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Export chat as document
  const exportChat = async (type: 'docx' | 'pdf') => {
    if (messages.length === 0) return

    // Build content from messages
    const content = messages
      .map(m => `${m.role === 'user' ? 'User' : agent.name}: ${m.content}`)
      .join('\n\n')

    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          type,
          title: `Chat with ${agent.name}`,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to generate document')
        return
      }

      // Download the file
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `chat-${agent.name.toLowerCase().replace(/\s+/g, '-')}.${type}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
    } catch (err) {
      console.error('Export error:', err)
      setError('Failed to export document')
    }
  }

  useEffect(() => {
    if (agentId) {
      loadAgent()
      loadConversations()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadAgent = async () => {
    try {
      const res = await fetch(`/api/agents/${agentId}`)
      const data = await res.json()
      if (res.ok) {
        setAgent(data.agent)
      }
    } catch (err) {
      setError('Failed to load agent')
    }
  }

  const loadConversations = async () => {
    try {
      const res = await fetch(`/api/chat/conversations?agentId=${agentId}`)
      const data = await res.json()
      if (res.ok) {
        const convs = data.conversations || []
        setConversations(convs)
        
        // Auto-load most recent conversation if none selected
        if (convs.length > 0 && !selectedConversationId) {
          const mostRecent = convs[0] // Already sorted desc
          setSelectedConversationId(mostRecent.id)
          loadMessages(mostRecent.id)
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err)
    }
  }

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`)
      const data = await res.json()
      if (res.ok) {
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const startNewChat = () => {
    setSelectedConversationId(null)
    setMessages([])
  }

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId)
    loadMessages(conversationId)
  }

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        // Remove from list
        setConversations(conversations.filter(c => c.id !== conversationId))
        
        // If deleted conversation was selected, clear messages
        if (selectedConversationId === conversationId) {
          setSelectedConversationId(null)
          setMessages([])
          
          // Select next available conversation
          if (conversations.length > 1) {
            const remaining = conversations.filter(c => c.id !== conversationId)
            if (remaining.length > 0) {
              setSelectedConversationId(remaining[0].id)
              loadMessages(remaining[0].id)
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setLoading(true)
    setError('')

    // Add user message immediately
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId,
          message: userMessage,
          conversationId: selectedConversationId || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to get response')
        return
      }

      // Add assistant response
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
      
      // Update conversation ID if new
      if (data.conversationId && !selectedConversationId) {
        setSelectedConversationId(data.conversationId)
        loadConversations()
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      {/* Sidebar - Conversations */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={startNewChat}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-sm text-gray-500">No conversations yet</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => handleConversationSelect(conv.id)}
                className={`group w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer flex justify-between items-start ${
                  selectedConversationId === conv.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {new Date(conv.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(conv.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <button
                  onClick={(e) => deleteConversation(conv.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1"
                  title="Delete conversation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{agent.name}</h1>
            <p className="text-sm text-gray-500">Model: {agent.model}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Export buttons */}
            {messages.length > 0 && (
              <div className="flex gap-2 mr-4">
                <button
                  onClick={() => exportChat('docx')}
                  className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                >
                  Export DOCX
                </button>
                <button
                  onClick={() => exportChat('pdf')}
                  className="text-sm px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                >
                  Export PDF
                </button>
              </div>
            )}
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Start a conversation with {agent.name}
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}