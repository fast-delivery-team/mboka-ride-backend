import * as dotenv from 'dotenv';
import path from 'path';
import * as v from 'valibot';


const envFile = process.env.ENV_FILE || '.env.dev';
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve(__dirname, '../../.env') });
    dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`)});
}

const envSchema = v.object({
    NODE_ENV: v.optional(v.picklist(['development', 'production', 'test']), 'development'),
    DATABASE_URL: v.optional(v.string()),
    PORT: v.optional(
        v.number(),
        3000
    ),
    CORS_ORIGIN: v.optional(
        v.string(),
        'http://localhost:5174'
    ),
    DB_HOSTNAME:
        v.optional(
            v.string(),
        ),
    DB_PORT:
        v.optional(
            v.string()
        ),
    DB_USERNAME: v.optional(
        v.string()
    ),
    DB_PASSWORD: v.optional(
        v.string(),
    ),
    DB_NAME: v.optional(
        v.string(),
    ),
    JWT_ACCESS_SECRET: v.pipe(
        v.string(),
        v.minLength(1, 'JWT_ACCESS_SECRET is required'),
    ),
    JWT_ACCESS_EXPIRES_IN: v.optional(
        v.pipe(
        v.string()
    ), '15m'),
    JWT_REFRESH_SECRET: v.pipe(
        v.string(),
        v.minLength(1, 'JWT_REFRESH_SECRET is required'),
    ),
    JWT_REFRESH_EXPIRES_IN: v.optional(
        v.pipe(
        v.string()
    ), '7d'),
    ENV_FILE: v.optional(v.string(), '.env'),
    SMTP_HOST: v.pipe(
        v.string(),
        v.minLength(1, 'SMTP_HOST is required'),
    ),
    SMTP_PORT: v.pipe(
        v.number(),
        v.minValue(1, 'SMTP_PORT is required'),
    ),
    SMTP_USER: v.pipe(
        v.string(),
        v.minLength(1, 'SMTP_USER is required'),
    ),
    SMTP_SECURE: v.boolean(),
    SMTP_FROM: v.pipe(
        v.string(),
        v.minLength(1, 'SMTP_FROM is required'),
    ),
    SMTP_PASS: v.pipe(
        v.string(),
    ),
    FRONTEND_URL: v.optional(v.pipe(
            v.string(),
            v.minLength(1, 'FRONTEND_URL is required'),
        ),
        'http://localhost:5174'
    ),
    CLOUDINARY_CLOUD_NAME: v.pipe(
        v.string(),
        v.minLength(1, 'CLOUDINARY_CLOUD_NAME is required'),
    ),
    CLOUDINARY_API_KEY: v.pipe(
        v.string(),
        v.minLength(1, 'CLOUDINARY_API_KEY is required'),
    ),
    CLOUDINARY_API_SECRET: v.pipe(
        v.string(),
        v.minLength(1, 'CLOUDINARY_API_SECRET is required'),
    ),
});

const parsedEnv = () => {
    const env = v.parse(envSchema, {
      NODE_ENV: process.env.NODE_ENV,
      PORT: Number(process.env.PORT),
      CORS_ORIGIN: process.env.CORS_ORIGIN,
  
      DATABASE_URL: process.env.DATABASE_URL,
  
      DB_HOSTNAME: process.env.DB_HOSTNAME,
      DB_PORT: process.env.DB_PORT,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
  
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
      JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
      JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
  
      ENV_FILE: process.env.ENV_FILE,
  
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PORT: Number(process.env.SMTP_PORT),
      SMTP_SECURE: process.env.SMTP_SECURE === 'true',
      SMTP_USER: process.env.SMTP_USER,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_FROM: process.env.SMTP_FROM,
  
      FRONTEND_URL: process.env.FRONTEND_URL,
  
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    });
  
    if (env.NODE_ENV === 'production') {
      if (!env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required in production');
      }
    } else {
      const missingDbVars = [
        env.DB_HOSTNAME,
        env.DB_PORT,
        env.DB_USERNAME,
        env.DB_PASSWORD,
        env.DB_NAME,
      ].some(v => !v);
  
      if (missingDbVars) {
        throw new Error(
          'DB_HOSTNAME, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME are required in development'
        );
      }
    }
  
    return env;
};

export const env = parsedEnv();

export type Env = typeof env;