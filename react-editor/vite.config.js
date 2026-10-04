import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command }) => {
  if (command === 'serve') {
    // 1. Local Development Mode Settings (Zero Conflict)
    return {
      plugins: [react()],
      base: '/',
    };
  } else {
    // 2. GitHub Actions / Jekyll Production Build Settings
    return {
      plugins: [react()],
      base: './',
      build: {
        outDir: path.resolve(process.cwd(), '../'),
        emptyOutDir: false,
        rollupOptions: {
          input: path.resolve(__dirname, 'src/main.jsx'),
          output: {
            entryFileNames: 'assets/js/react-editor.js',
            chunkFileNames: 'assets/js/[name].js',
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'assets/css/react-editor.[ext]';
              }
              return 'assets/[ext]/[name].[ext]';
            }
          }
        }
      }
    };
  }
});