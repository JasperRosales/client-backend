import { db } from '../drizzle/db.js';
import { otps } from '../drizzle/schema.js';
import { eq, and } from 'drizzle-orm';

export const otpRepository = {
  async create(otpData) {
    const result = await db.insert(otps).values(otpData).returning();
    return result[0];
  },

  async findByEmailAndCode(email, code) {
    const result = await db
      .select()
      .from(otps)
      .where(and(eq(otps.email, email), eq(otps.code, code)));
    return result[0] || null;
  },

  async deleteByEmail(email) {
    await db.delete(otps).where(eq(otps.email, email));
  },

  async deleteExpiredOtps() {
    await db.delete(otps).where(eq(otps.expiresAt, new Date()));
  },
};

