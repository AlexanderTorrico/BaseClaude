/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_DEFAULTAUTH: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_PUBLIC_URL: string;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}