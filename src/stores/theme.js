import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'reverse', // 默认主题
    themes: [
      { id: 'reverse', name: '弄假成真' },
      { id: 'wasteland', name: '废土寻迹' },
      { id: 'curse', name: '诡秘诅咒' },
      { id: 'wuxia', name: '江湖逸闻' },
      { id: 'steampunk', name: '蒸汽魅影' }
    ]
  }),
  actions: {
    setTheme(themeId) {
      this.currentTheme = themeId
    }
  }
})
