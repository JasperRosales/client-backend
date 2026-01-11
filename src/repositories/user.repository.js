import { db } from '../drizzle/db.js';
import { users } from '../drizzle/schema.js';
import { eq } from 'drizzle-orm';

export const userRepository = {
  async findByEmail(email) {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] || null;
  },

  async findById(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  },

  async create(userData) {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  },

  async updateRefreshToken(userId, refreshToken, expiresAt) {
    await db
      .update(users)
      .set({ refreshToken, refreshTokenExpiresAt: expiresAt })
      .where(eq(users.id, userId));
  },

  async clearRefreshToken(userId) {
    await db
      .update(users)
      .set({ refreshToken: null, refreshTokenExpiresAt: null })
      .where(eq(users.id, userId));
  },

  async findByRefreshToken(refreshToken) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, refreshToken));
    return result[0] || null;
  },
};

