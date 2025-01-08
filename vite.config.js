import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1000, // 提高警告阈值到1000kb
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vendor': [
            'vue',
            'pinia',
            'axios',
            'html2canvas'
          ]
        }
      }
    }
  }
})
