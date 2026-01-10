import 'dotenv/config';
import { Config } from 'drizzle-kit';


export default {
  out: './src/drizzle/migrations',
  schema: './src/drizzle/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: String(process.env.DATABASE_URL!),
  },
  verbose: true,
  strict: true,
};
