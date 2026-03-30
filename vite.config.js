import { defineConfig } from 'vite'
import path from "path";
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import kunUiAutoExportsPlugin from './src/plugins/vite-plugin-kun-exports';
import fs from 'fs';

/**
 * Plugin para copiar archivos de documentación al directorio dist
 */
function copyDocsPlugin() {
  return {
    name: 'copy-docs-plugin',
    writeBundle() {
      // Copiar AGENTS.md al directorio dist
      const srcAgents = path.resolve(__dirname, 'AGENTS.md');
      const destAgents = path.resolve(__dirname, 'dist', 'AGENTS.md');
      
      if (fs.existsSync(srcAgents)) {
        fs.copyFileSync(srcAgents, destAgents);
        console.log('✓ AGENTS.md copiado a dist/AGENTS.md');
      }

      // Copiar README.md al directorio dist
      const srcReadme = path.resolve(__dirname, 'README.md');
      const destReadme = path.resolve(__dirname, 'dist', 'README.md');
      
      if (fs.existsSync(srcReadme)) {
        fs.copyFileSync(srcReadme, destReadme);
        console.log('✓ README.md copiado a dist/README.md');
      }
    }
  };
}

export default defineConfig({
  plugins: [
    vue(),
    kunUiAutoExportsPlugin(),
    tailwindcss(),
    vueDevTools(),
    copyDocsPlugin(),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'KunUI',
      formats: ['es'],
      fileName: (format) => `kun-ui.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vue-router'],
      output: {
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
        },
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    dedupe: ['vue']
  },

  server: {
    host: true,
    cors: true,
    strictPort: false,
    port: 5170,
  },
})
