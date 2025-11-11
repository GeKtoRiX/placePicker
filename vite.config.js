import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import tailwindcss from '@tailwindcss/vite';

const imageCacheDir = fileURLToPath(
  new URL('./.cache/vite-plugin-image-optimizer', import.meta.url)
);

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    plugins: [
      react(),
      isBuild &&
        ViteImageOptimizer({
          cache: true,
          cacheLocation: imageCacheDir,
          jpeg: { quality: 85 },
          jpg: { quality: 85 },
          png: { quality: 90 },
          webp: { quality: 90, lossless: false },
          avif: { quality: 80 },
          svg: {
            multipass: true,
            plugins: [
              { name: 'preset-default' },
              { name: 'removeViewBox', active: false },
              'removeUnusedNS',
            ],
          },
        }),
      tailwindcss(),
    ].filter(Boolean),

    css: {
      lightningcss: {
        browsers: '>=0.25%, not dead',
        drafts: {
          nesting: true,
        },
      },
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      host: '0.0.0.0',
      port: 5174,
      open: true,
      strictPort: true,
      cors: true,
    },

    preview: {
      port: 4173,
      open: true,
    },

    build: {
      outDir: 'dist',
      sourcemap: isBuild ? 'hidden' : true,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      minify: isBuild ? 'esbuild' : false,
      cssMinify: isBuild,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            const normalized = id.replace(/\\/g, '/');
            const [, afterNodeModules] = normalized.split('node_modules/');
            if (!afterNodeModules) return;
            const parts = afterNodeModules.split('/');
            if (!parts.length) return;
            const pkg =
              parts[0].startsWith('@') && parts.length > 1
                ? `${parts[0]}/${parts[1]}`
                : parts[0];
            return `vendor-${pkg.replace('@', '').replace('/', '-')}`;
          },
        },
      },
    },
    esbuild: {
      legalComments: 'none',
    },
  };
});
