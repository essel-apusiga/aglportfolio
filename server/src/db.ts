import 'dotenv/config'
import { Db, MongoClient } from 'mongodb'

const connectionUri = process.env.MONGODB_URI
const databaseName = process.env.MONGODB_DB_NAME || 'aglportfolio'

// In production, MONGODB_URI should be provided via environment variables.
// In development, it can be in .env file. If missing, server will gracefully
// degrade and CMS endpoints will return 503.
const resolvedConnectionUri = connectionUri

let clientPromise: Promise<MongoClient> | null = null

function getClient() {
  if (!clientPromise) {
    if (!resolvedConnectionUri) {
      return Promise.reject(new Error('MONGODB_URI environment variable is not configured.'))
    }

    const client = new MongoClient(resolvedConnectionUri, {
      serverSelectionTimeoutMS: process.env.NODE_ENV === 'production' ? 10000 : 5000,
      connectTimeoutMS: process.env.NODE_ENV === 'production' ? 15000 : 5000,
      socketTimeoutMS: process.env.NODE_ENV === 'production' ? 45000 : 5000,
      retryWrites: true,
      w: 'majority',
    })
    clientPromise = client.connect()
  }

  return clientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getClient()
  return client.db(databaseName)
}

