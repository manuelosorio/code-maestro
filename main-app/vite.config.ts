/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as process from 'process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',
    build: {
      target: ['es2020'],
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
    plugins: [
      analog({
        nitro: {
          routeRules: {
            '/': {
              prerender: true,
            },
            '/api/v1/**': {
              cors: true,
              headers: {
                'Access-Control-Allow-Origin': `${process.env['VITE_ANALOG_PUBLIC_BASE_URL']}`,
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With',
                'Access-Control-Allow-Credentials': 'true',
                credentials: 'include',
              },
            },
          },
        },
      }),
      nxViteTsPaths(),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['verbose'],
      cacheDir: `../node_modules/.vitest`,
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
    css: {
      preprocessorOptions: {
        sass: {
          includePaths: ['src/styles'],
        },
      },
    },
  };
});
