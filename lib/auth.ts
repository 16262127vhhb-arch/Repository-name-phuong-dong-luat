import { betterAuth } from "better-auth";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const auth = betterAuth({
  appName: "LIÊM MINH",

  baseURL: process.env.BETTER_AUTH_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  database: pool,

  emailAndPassword: {
    enabled: true,
  },

  trustedOrigins: [
    "http://localhost:3000",
    "https://liemminhlaw.com",
    "https://www.liemminhlaw.com",
  ],
});

export default auth;