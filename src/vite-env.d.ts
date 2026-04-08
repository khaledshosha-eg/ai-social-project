/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENROUTER_API_KEY?: string;
  /** Optional OpenRouter attribution (https://openrouter.ai/docs) */
  readonly VITE_OPENROUTER_HTTP_REFERER?: string;
  readonly VITE_OPENROUTER_APP_TITLE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
