import * as dotenv from 'dotenv';
import path from 'path';
import * as v from 'valibot';

dotenv.config({ path: path.resolve(__dirname, '../../.env')});

const envFile = process.env.ENV_FILE || '.env.dev';
dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`)});

const envSchema = v.object({
    NODE_ENV: v.optional(v.picklist(['development', 'production', 'test']), 'development'),
    PORT: v.optional(
        v.number(),
        3000
    ),
    CORS_ORIGIN: v.optional(
        v.string(),
        'http://localhost:5174'
    ),
    DB_HOSTNAME:
        v.pipe(
            v.string(),
            v.minLength(3, 'Hostname must be at least 3 characters long')
        ),
    DB_PORT:
        v.pipe(
            v.string(),
            v.minLength(1, 'Port must be at least 1'),
        ),
    DB_USERNAME: v.pipe(
        v.string(),
        v.minLength(1, 'Username must be at least 1 character long')
    ),
    DB_PASSWORD: v.pipe(
        v.string(),
    ),
    DB_NAME: v.pipe(
        v.string(),
        v.minLength(1, 'Database name must be at least 1 character long')
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
    ENV_FILE: v.pipe(
        v.string(),
        v.minLength(1, 'Environment file must be at least 1 character long')
    )
});

const parsedEnv = ()=>{
    try {
        return v.parse(envSchema, {
            NODE_ENV: process.env.NODE_ENV,
            PORT: Number(process.env.PORT),
            CORS_ORIGIN: process.env.CORS_ORIGIN,
            DB_HOSTNAME: process.env.DB_HOSTNAME,
            DB_PORT: process.env.DB_PORT,
            DB_USERNAME: process.env.DB_USERNAME,
            DB_PASSWORD: process.env.DB_PASSWORD,
            DB_NAME: process.env.DB_NAME,
            JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
            JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
            JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
            JWT_ACCESS_EXPIRES_IN:process.env.JWT_ACCESS_EXPIRES_IN,
            ENV_FILE: process.env.ENV_FILE,
        });
    } catch (error) {
        if(error instanceof v.ValiError){
            const missingVars = error.issues.map((issue)=>{
                const path = issue.path?.map((p)=> p.key).join('.');
                return ` -> ${path}=== ${issue.message}`;
            }).join('\n');
            throw new Error(`Missing required environment variables:\n${missingVars} check your ${envFile} file`);
        }
        throw error;
    }
}

export const env = parsedEnv();

export type Env = typeof env;