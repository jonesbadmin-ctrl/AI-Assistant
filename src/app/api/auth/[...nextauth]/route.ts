/**
 * NextAuth Route Handler
 * 
 * Handles all authentication requests (login, logout, session)
 */

import { handlers } from "@/lib/auth"

export const { GET, POST } = handlers