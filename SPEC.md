# AI Assistant Builder - Specification

## Project Overview

**Name:** AI Assistant Builder  
**Type:** Web Application (SaaS)  
**Core Function:** Users create custom AI assistants with configurable prompts, models, and tools, then chat with them  
**Target Users:** Developers, hobbyists, small businesses wanting custom AI assistants

---

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Database:** SQLite via Prisma ORM
- **Auth:** NextAuth.js (credentials provider)
- **LLM:** OpenAI (GPT-4o mini default) with flexible model switching
- **Styling:** Tailwind CSS

---

## Phase 1: MVP Features

### 1. Authentication
- Sign up with email/password
- Login/logout
- Session management via NextAuth.js

### 2. Dashboard
- List all created agents
- Create new agent button
- Delete agent option

### 3. Agent Management
- Create agent: name, system prompt, model selection
- Edit existing agent
- Delete agent

### 4. Chat Interface
- Select an agent to chat with
- Input message field
- Display conversation history
- Stream responses from LLM

### 5. Model Configuration
- Dropdown to select model (GPT-4o, GPT-4o-mini, etc.)
- Ability to add custom OpenAI API key per user
- Fallback to system default if user doesn't provide key

---

## Data Models

### User
```
id: string (cuid)
email: string (unique)
password: string (hashed)
name: string (optional)
createdAt: datetime
updatedAt: datetime
```

### Agent
```
id: string (cuid)
userId: string (foreign key to User)
name: string
systemPrompt: string (default: "You are a helpful assistant.")
model: string (default: "gpt-4o-mini")
apiKey: string (optional - user's own OpenAI key)
createdAt: datetime
updatedAt: datetime
```

### Conversation
```
id: string (cuid)
agentId: string (foreign key to Agent)
createdAt: datetime
```

### Message
```
id: string (cuid)
conversationId: string (foreign key to Conversation)
role: string ("user" | "assistant")
content: string
createdAt: datetime
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/[...nextauth]` - Login endpoint

### Agents
- `GET /api/agents` - List user's agents
- `POST /api/agents` - Create agent
- `GET /api/agents/[id]` - Get agent details
- `PUT /api/agents/[id]` - Update agent
- `DELETE /api/agents/[id]` - Delete agent

### Chat
- `POST /api/chat` - Send message, get response

---

## UI Pages

1. `/` - Landing page (redirect to login if not authenticated)
2. `/login` - Login form
3. `/register` - Sign up form
4. `/dashboard` - Main dashboard with agent list
5. `/agents/new` - Create new agent form
6. `/agents/[id]` - Agent details + chat interface
7. `/agents/[id]/edit` - Edit agent form

---

## Future (Phase 2+)

- Tool system (web search, web fetch, calculator)
- Vector memory for long-term context
- Multi-user collaboration
- Subscription/billing system
- Admin panel

---

## Project Structure

```
ai-assistant-builder/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── api/               # API routes
│   │   ├── dashboard/        # Protected dashboard
│   │   └── page.tsx           # Landing/redirect
│   ├── components/            # React components
│   ├── lib/                   # Utilities (Prisma, auth, LLM)
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── .env                       # Environment variables
├── package.json
└── README.md
```

---

## Environment Variables

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..." (system default)
```

---

## Success Criteria (Phase 1)

- [ ] User can sign up and log in
- [ ] User can create, edit, delete agents
- [ ] User can chat with an agent and get responses from OpenAI
- [ ] Model can be switched per agent
- [ ] User can provide their own API key or use system default
- [ ] Conversation history persists in database

---

*Last updated: 2026-04-07*