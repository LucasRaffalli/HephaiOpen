import { rmSync } from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import pkg from './package.json'
import svgr from "vite-plugin-svgr";

export default defineConfig(({ command }) => {
  rmSync('dist-electron', { recursive: true, force: true })

  const isServe = command === 'serve'
  const isBuild = command === 'build'
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src'),
        '@electron': path.resolve(__dirname, './electron'),
      },
    },
    base: './',
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      minify: 'esbuild',
      emptyOutDir: true,
      target: ['chrome89', 'edge89', 'firefox89', 'safari15'],
      cssCodeSplit: true,
      sourcemap: false,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
        output: {
          format: 'esm',
          entryFileNames: '[name].[hash].js',
          chunkFileNames: '[name].[hash].js',
          assetFileNames: '[name].[hash].[ext]',
          inlineDynamicImports: false,
          manualChunks: {
            'vendor': [
              'react', 
              'react-dom',
            ],
            'router': ['react-router-dom'],
            'ui': ['@radix-ui/themes', '@radix-ui/react-icons'],
            'pdf': ['jspdf', 'jspdf-autotable', 'pdfjs-dist'],
            'i18n': ['i18next', 'react-i18next']
          }
        }
      },
      reportCompressedSize: false, // Désactive le calcul de la taille compressée pour accélérer la build
      chunkSizeWarningLimit: 1000,
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
              rollupOptions: {
                external: Object.keys(pkg.dependencies || {})
              },
            },
          },
        },
        preload: {
          input: 'electron/preload/index.ts',
          vite: {
            build: {
              outDir: 'dist-electron/preload',
              rollupOptions: {
                external: Object.keys(pkg.dependencies || {})
              },
            },
          },
        },
        renderer: {},
      }),
    ],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@radix-ui/themes',
      ],
      force: true
    }
  }
})