import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const DB_DIR = path.resolve(process.cwd(), 'data')
const LOG_PATH = path.join(DB_DIR, 'blockchain_log.json')

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true })
}

export function anchorPayload(payload: any) {
  ensureDir()
  const json = JSON.stringify(payload)
  const hash = crypto.createHash('sha256').update(json).digest('hex')

  const entry = { hash, payload, ts: new Date().toISOString() }

  let log: any[] = []
  try {
    if (fs.existsSync(LOG_PATH)) {
      log = JSON.parse(fs.readFileSync(LOG_PATH, 'utf8')) || []
    }
  } catch (e) {
    // ignore
  }

  log.push(entry)
  fs.writeFileSync(LOG_PATH, JSON.stringify(log, null, 2), 'utf8')

  return entry
}
