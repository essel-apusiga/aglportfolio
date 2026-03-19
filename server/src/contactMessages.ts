import { getDb } from './db'
import type { ObjectId } from 'mongodb'

export type StoredContactMessage = {
  _id?: ObjectId
  name: string
  email: string
  message: string
  submittedAt: Date
  adminEmailSent: boolean
  submitterNotified: boolean
}

export async function saveContactMessage(
  payload: { name: string; email: string; message: string },
  emailStatus: { adminEmailSent: boolean; submitterNotified: boolean },
): Promise<StoredContactMessage> {
  const db = await getDb()
  const doc: Omit<StoredContactMessage, '_id'> = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    message: payload.message.trim(),
    submittedAt: new Date(),
    adminEmailSent: emailStatus.adminEmailSent,
    submitterNotified: emailStatus.submitterNotified,
  }
  const result = await db.collection<StoredContactMessage>('contactMessages').insertOne(doc)
  return { ...doc, _id: result.insertedId }
}

export async function listContactMessages(limit = 50, skip = 0) {
  const db = await getDb()
  const col = db.collection<StoredContactMessage>('contactMessages')
  const [messages, total] = await Promise.all([
    col.find({}).sort({ submittedAt: -1 }).skip(skip).limit(limit).toArray(),
    col.countDocuments(),
  ])
  return { messages, total }
}
