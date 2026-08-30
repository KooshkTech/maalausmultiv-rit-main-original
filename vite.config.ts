import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Keep production source maps private. This does not make browser code
    // impossible to inspect, but avoids publishing an easy source-code map.
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    allowedHosts: true,
    // Proxy the PHP mail endpoint to a local PHP server during development.
    // Run `php -S localhost:8000` from the public/ folder, then the Vite dev
    // server forwards /send-mail.php to it. In production on HostGator the
    // PHP file sits next to the built assets and no proxy is needed.
    proxy: {
      '/send-mail.php': 'http://localhost:8000',
    },
  },
});
