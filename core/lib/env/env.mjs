/* eslint-disable n/no-process-env */
// @ts-check

import { createEnv } from "@t3-oss/env-nextjs";
import { env as runtimeEnv } from "next-runtime-env";
import { z } from "zod";

export const env = createEnv({
	shared: {
		NODE_ENV: z.enum(["development", "production", "test"]).optional(),
	},
	server: {
		API_KEY: z.string(),
		ASSETS_BUCKET_NAME: z.string(),
		ASSETS_REGION: z.string(),
		ASSETS_UPLOAD_KEY: z.string(),
		ASSETS_UPLOAD_SECRET_KEY: z.string(),
		DATABASE_URL: z.string().url(),
		JWT_SECRET: z.string(),
		MAILGUN_SMTP_PASSWORD: z.string(),
		MAILGUN_SMTP_USERNAME: z.string(),
		SUPABASE_SERVICE_ROLE_KEY: z.string(),
		SUPABASE_WEBHOOKS_API_KEY: z.string(),
		MAILGUN_SMTP_HOST: z.string(),
		MAILGUN_SMTP_PORT: z.string(),
		OTEL_SERVICE_NAME: z.string(),
		HONEYCOMB_API_KEY: z.string(),
	},
	client: {
		NEXT_PUBLIC_PUBPUB_URL: z.string().url(),
		NEXT_PUBLIC_SUPABASE_PUBLIC_KEY: z.string(),
		NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
	},
	experimental__runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_PUBPUB_URL: runtimeEnv("NEXT_PUBLIC_PUBPUB_URL"),
		NEXT_PUBLIC_SUPABASE_PUBLIC_KEY: runtimeEnv("NEXT_PUBLIC_SUPABASE_PUBLIC_KEY"),
		NEXT_PUBLIC_SUPABASE_URL: runtimeEnv("NEXT_PUBLIC_SUPABASE_URL"),
	},
	skipValidation: Boolean(process.env.SKIP_VALIDATION),
	emptyStringAsUndefined: true,
});
