/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_API_VERSION: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_ENABLE_GOOGLE_LOGIN: string
  readonly VITE_ENABLE_APPLE_LOGIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}