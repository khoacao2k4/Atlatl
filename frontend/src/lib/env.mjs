import { z } from "zod";
import "dotenv/config";

// Schema for server-only environment variables
const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
});

// Schema for client-exposed variables (NEXT_PUBLIC_*)
// (kept commented like before, semantics unchanged)
const clientEnvSchema = z.object({
  // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
});

// Parse server env from process.env
const _serverEnv = serverEnvSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
});

// Parse client env from process.env (only NEXT_PUBLIC_* if you enable them)
const _clientEnv = clientEnvSchema.parse({
  // NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
});

// This is what you import everywhere: same `env.X` shape as before
export const env = {
  ..._serverEnv,
  ..._clientEnv,
};