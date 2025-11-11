import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import eslint from 'vite-plugin-eslint';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';

const imageCacheDir = fileURLToPath(
  new URL('./node_modules/.cache/vite-plugin-image-optimizer', import.meta.url)
);

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      react(),
      eslint({
        cache: true,
        include: ['src/**/*.{js,jsx}'],
        exclude: ['node_modules', 'dist'],
        fix: true,
      }),
      viteCompression({
        verbose: true,
        disable: !isProd,
        algorithm: 'brotliCompress',
        ext: '.br',
        threshold: 10240,
      }),
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
      visualizer({
        filename: 'bundle-stats.html',
        gzipSize: true,
        brotliSize: true,
        open: false,
      }),
    ],

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
      target: 'esnext',
      outDir: 'dist',
      sourcemap: !isProd,
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      minify: isProd ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['axios', 'zustand', 'react-router-dom'],
          },
        },
      },
    },

    optimizeDeps: {
      include: ['react', 'react-dom'],
      esbuildOptions: {
        target: 'esnext',
      },
    },
    esbuild: {
      legalComments: 'none',
    },
  };
});
