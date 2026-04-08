'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Agent {
  id: string
  name: string
  systemPrompt: string
  model: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents')
      const data = await res.json()
      setAgents(data.agents || [])
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    
    setDeleteId(id)
    try {
      const res = await fetch(`/api/agents/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setAgents(agents.filter(a => a.id !== id))
      } else {
        alert('Failed to delete agent')
      }
    } catch (error) {
      console.error('Error deleting agent:', error)
    } finally {
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Agents</h1>
        <Link
          href="/dashboard/agents/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Agent
        </Link>
      </div>

      {agents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">No agents yet. Create your first AI assistant!</p>
          <Link
            href="/dashboard/agents/new"
            className="text-blue-600 hover:underline"
          >
            Create Agent
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {agent.model}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {agent.systemPrompt}
              </p>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/agents/${agent.id}`}
                  className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                >
                  Chat
                </Link>
                <Link
                  href={`/dashboard/agents/${agent.id}/edit`}
                  className="flex-1 text-center px-3 py-2 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(agent.id)}
                  disabled={deleteId === agent.id}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
                >
                  {deleteId === agent.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}