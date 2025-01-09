import { defineStore } from 'pinia'

const defaultProviders = {
  custom: {
    name: '自定义配置',
    model: '',
    baseUrl: ''
  },
  moonshot: {
    name: 'Moonshot',
    model: 'moonshot-v1-8k',
    baseUrl: 'https://api.moonshot.cn/v1'
  },
  deepseek: {
    name: 'Deepseek',
    model: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com/v1'
  },
  gemini: {
    name: 'Gemini',
    model: 'gemini-pro',
    baseUrl: 'https://generativelanguage.googleapis.com/v1'
  }
}

export const useConfigStore = defineStore('config', {
  state: () => ({
    apiConfig: {
      baseUrl: '',
      apiKey: '',
      provider: '',
      model: '',
      providers: defaultProviders
    }
  }),
  actions: {
    setApiConfig(config) {
      // 保持预设的 providers 不变
      const newConfig = {
        ...config,
        providers: defaultProviders
      }
      this.apiConfig = newConfig
      
      // 只保存必要的配置信息
      const savedConfig = {
        baseUrl: config.baseUrl,
        apiKey: config.apiKey,
        provider: config.provider,
        model: config.model
      }
      localStorage.setItem('apiConfig', JSON.stringify(savedConfig))
    },
    loadApiConfig() {
      const savedConfig = localStorage.getItem('apiConfig')
      if (savedConfig) {
        try {
          const config = JSON.parse(savedConfig)
          this.apiConfig = {
            ...this.apiConfig,
            ...config,
            providers: defaultProviders // 确保使用预设的 providers
          }
        } catch (error) {
          console.error('加载配置失败:', error)
        }
      }
    }
  }
})
