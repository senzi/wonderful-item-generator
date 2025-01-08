import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', {
  state: () => ({
    apiConfig: {
      baseUrl: '',
      apiKey: '',
      provider: '',
      providers: {
        moonshot: {
          name: 'Moonshot',
          model: 'moonshot-v1-8k',
          baseUrl: 'https://api.moonshot.cn/v1'
        },
        // 可以添加其他提供商
      }
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
        try {
          const config = JSON.parse(savedConfig)
          // 确保 providers 字段存在
          if (!config.providers) {
            config.providers = this.apiConfig.providers
          }
          this.apiConfig = config
        } catch (error) {
          console.error('加载配置失败:', error)
        }
      }
    }
  }
})
