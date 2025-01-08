import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    apiConfig: {
      baseUrl: '',
      apiKey: '',
      model: ''
    }
  }),
  actions: {
    setApiConfig(config) {
      this.apiConfig = { ...config }
      // 保存到localStorage
      localStorage.setItem('apiConfig', JSON.stringify(config))
    },
    loadApiConfig() {
      const savedConfig = localStorage.getItem('apiConfig')
      if (savedConfig) {
        this.apiConfig = JSON.parse(savedConfig)
      }
    }
  }
})
