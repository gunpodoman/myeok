import { cpSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
const pagesBase = process.env.PAGES_BASE_PATH;

function preserveLegacyRuntime() {
  return {
    name: 'preserve-verified-legacy-runtime',
    closeBundle() {
      const outDir = resolve(import.meta.dirname, 'dist');
      mkdirSync(outDir, { recursive: true });
      for (const file of ['app.js', 'runtime.js']) {
        copyFileSync(resolve(import.meta.dirname, file), resolve(outDir, file));
      }
      cpSync(resolve(import.meta.dirname, 'assets'), resolve(outDir, 'assets'), { recursive: true });
      cpSync(resolve(import.meta.dirname, 'core_md'), resolve(outDir, 'core_md'), { recursive: true });
      if (pagesBase) {
        const htmlPath = resolve(outDir, 'index.html');
        writeFileSync(htmlPath, readFileSync(htmlPath, 'utf8').replace(/window\.MYEOK_PAGES_BASE\s*=\s*""/, `window.MYEOK_PAGES_BASE = ${JSON.stringify(pagesBase)}`));
        writeFileSync(resolve(outDir, '.nojekyll'), '');
      }
    }
  };
}

function serveLegacyRuntimeWithoutTransform() {
  const legacyFiles = new Map([
    ['/app.js', resolve(import.meta.dirname, 'app.js')],
    ['/runtime.js', resolve(import.meta.dirname, 'runtime.js')]
  ]);
  return {
    name: 'serve-legacy-runtime-without-transform',
    configureServer(server: { middlewares: { use: (handler: (request: { url?: string }, response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: Buffer) => void }, next: () => void) => void) => void } }) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
        const file = legacyFiles.get(pathname);
        if (!file) return next();
        response.statusCode = 200;
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
        response.setHeader('Cache-Control', 'no-store');
        response.end(readFileSync(file));
      });
    }
  };
}

export default defineConfig({
  base: pagesBase || '/',
  plugins: [serveLegacyRuntimeWithoutTransform(), react(), preserveLegacyRuntime()],
  server: {
    watch: {
      ignored: ['**/.agent/**', '**/release/**', '**/local_runtime/**']
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        reactFoundation: resolve(import.meta.dirname, 'react-foundation.html')
      }
    }
  },
  test: {
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.agent/**', '**/local_runtime/**']
  }
});
