import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    hydrogen(),
    reactRouter({
      future: {
        v8_passThroughRequests: true,
        v8_trailingSlashAwareDataRequests: true,
        v8_middleware: true,
        v8_splitRouteModules: true,
        v8_viteEnvironmentApi: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'app'),
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
