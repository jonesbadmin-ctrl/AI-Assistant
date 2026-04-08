/**
 * Logger Utility
 * 
 * Simple file-based logging for debugging and audits.
 * Logs to: ./logs/app.log
 */

import fs from 'fs'
import path from 'path'

const LOG_DIR = path.join(process.cwd(), 'logs')
const LOG_FILE = path.join(LOG_DIR, 'app.log')

// Ensure log directory exists
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true })
  }
}

// Format log entry
function formatLog(level: string, message: string, data?: unknown): string {
  const timestamp = new Date().toISOString()
  let entry = `[${timestamp}] [${level}] ${message}`
  if (data) {
    entry += ` ${JSON.stringify(data)}`
  }
  return entry
}

// Write to log file
function writeLog(entry: string) {
  ensureLogDir()
  fs.appendFileSync(LOG_FILE, entry + '\n')
}

export const logger = {
  info(message: string, data?: unknown) {
    const entry = formatLog('INFO', message, data)
    console.log(entry)
    writeLog(entry)
  },

  warn(message: string, data?: unknown) {
    const entry = formatLog('WARN', message, data)
    console.warn(entry)
    writeLog(entry)
  },

  error(message: string, data?: unknown) {
    const entry = formatLog('ERROR', message, data)
    console.error(entry)
    writeLog(entry)
  },

  // Get recent logs (last N lines)
  getRecentLines(lines: number = 100): string[] {
    try {
      if (!fs.existsSync(LOG_FILE)) {
        return []
      }
      const content = fs.readFileSync(LOG_FILE, 'utf-8')
      return content.split('\n').filter(Boolean).slice(-lines)
    } catch {
      return []
    }
  },

  // Get logs from a specific time range
  getLogsSince(date: Date): string[] {
    try {
      if (!fs.existsSync(LOG_FILE)) {
        return []
      }
      const content = fs.readFileSync(LOG_FILE, 'utf-8')
      return content
        .split('\n')
        .filter(Boolean)
        .filter(line => {
          const timestamp = line.match(/\[(.*?)\]/)?.[1]
          return timestamp && new Date(timestamp) >= date
        })
    } catch {
      return []
    }
  }
}

export default logger