/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import angular from '@analogjs/vite-plugin-angular';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    publicDir: 'src/public',

    ssr: {
      noExternal: ['@analogjs/trpc', '@trpc/server'],
    },

    build: {
      target: ['es2020'],
    },
    plugins: [
      analog({
        nitro: {
          routeRules: {
            '/': {
              prerender: false,
            },
          },
        },
      }),
      angular({
        inlineStylesExtension: 'sass',
      }),
      nxViteTsPaths(),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
      cacheDir: '../node_modules/.vite',
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
