import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'
import svgr from "vite-plugin-svgr"

export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@electron': path.resolve(__dirname, './electron'),
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    svgr({
      svgrOptions: { exportType: "default", ref: true, svgo: false, titleProp: true },
      include: "**/*.svg",
    }),
    electron({
      main: {
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron/main',
            lib: {
              entry: path.resolve('electron/main/index.ts'),
              formats: ['cjs']
            },
            rollupOptions: {
              external: Object.keys(pkg.dependencies || {}),
              output: {
                format: 'cjs',
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
              }
            },
          },
        },
      },
      preload: {
        input: 'electron/preload/index.ts',
        vite: {
          build: {
            outDir: 'dist-electron/preload',
            lib: {
              entry: path.resolve('electron/preload/index.ts'),
              formats: ['cjs']
            },
            rollupOptions: {
              external: Object.keys(pkg.dependencies || {}),
              output: {
                format: 'cjs',
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: '[name].[ext]'
              }
            },
          },
        },
      },
      renderer: {},
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    emptyOutDir: true,
    target: ['chrome89', 'edge89', 'firefox89', 'safari15'],
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        format: 'esm',
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]',
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom',
          ],
          'router': ['react-router-dom'],
          'ui': ['@radix-ui/themes', '@radix-ui/react-icons'],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/themes',
    ],
    force: true
  },
})
