import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'public/phase1',
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/phase1/browserBridge.ts'),
      formats: ['es'],
      fileName: () => 'index.js'
    }
  }
});
