import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'fantasy', // 默认主题
    themes: [
      { id: 'fantasy', name: '奇幻' },
      { id: 'scifi', name: '科幻' },
      { id: 'modern', name: '现代' },
      { id: 'ancient', name: '古代' }
    ]
  }),
  actions: {
    setTheme(themeId) {
      this.currentTheme = themeId
    }
  }
})
