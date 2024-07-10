/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MY_USERNAME: string;
    readonly VITE_MY_PASSWORD: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  