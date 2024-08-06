import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // divide las dependencias de react en un chunk separado
          // puedes agregar más chunks según tus necesidades
        },
      },
    },
    chunkSizeWarningLimit: 1000, // ajusta el límite de tamaño del chunk si es necesario
  },
});
