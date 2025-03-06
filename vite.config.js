import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  build: {
    lib: {
      entry: './src/index.js',
      name: 'KunUI',
      fileName: (format) => `kun-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    dedupe: ['vue']
  },

  server: {
    host: true,
    cors: true,
    strictPort: false,
    port: 5175,
  },
})
