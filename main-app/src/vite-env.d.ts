/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DB_NAME: string;
  readonly DB_PASSWORD: string;
  readonly DB_HOST: string;
  readonly DB_USER: string;
  readonly DB_PORT: string;
  readonly DB_SCHEMA: string;
  readonly SESSION_EXPIRY_DAYS: number;
  readonly SESSION_SECRET: string;
  readonly SESSION_COOKIE_NAME: string;
  readonly DATABASE_URL:
    | string
    | `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}`;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
