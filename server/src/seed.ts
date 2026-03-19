import 'dotenv/config'
import { MongoClient } from 'mongodb'
import { defaultSiteConfig } from './siteConfig'

const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.MONGODB_DB_NAME || 'aglportfolio'
const COLLECTION = 'site_state'
const STATE_KEY = 'primary'

if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set. Add it to server/.env and retry.')
  process.exit(1)
}

async function seed() {
  console.log('🌱  Connecting to MongoDB...')
  const client = new MongoClient(MONGODB_URI!, { serverSelectionTimeoutMS: 10000 })

  try {
    await client.connect()
    console.log('✅  Connected.')

    const db = client.db(DB_NAME)
    const col = db.collection(COLLECTION)

    const now = new Date().toISOString()
    const document = {
      key: STATE_KEY,
      draft: defaultSiteConfig,
      published: defaultSiteConfig,
      updatedAt: now,
      publishedAt: now,
    }

    const existing = await col.findOne({ key: STATE_KEY })

    if (existing) {
      console.log('ℹ️   Document already exists. Overwriting with fresh seed data...')
    }

    await col.updateOne(
      { key: STATE_KEY },
      { $set: document },
      { upsert: true },
    )

    // Create a unique index on key to guard against duplicates
    await col.createIndex({ key: 1 }, { unique: true, background: true })

    console.log('✅  Seed complete! Database now contains:')
    console.log(`    Collection : ${DB_NAME}.${COLLECTION}`)
    console.log(`    Document   : key="${STATE_KEY}"`)
    console.log(`    Sections   : ${defaultSiteConfig.sectionOrder.join(', ')}`)
    console.log(`    Products   : ${defaultSiteConfig.products.products.length} items`)
    console.log(`    Team       : ${defaultSiteConfig.team.members.length} members`)
  } catch (err) {
    console.error('❌  Seed failed:', err)
    process.exit(1)
  } finally {
    await client.close()
    console.log('🔌  Connection closed.')
  }
}

void seed()
