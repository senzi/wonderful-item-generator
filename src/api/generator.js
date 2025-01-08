import axios from 'axios'

const createApi = (config) => {
  const instance = axios.create({
    baseURL: config.baseUrl,
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    }
  })

  // 响应拦截器
  instance.interceptors.response.use(
    response => response.data,
    error => {
      ElMessage.error(error.response?.data?.message || '请求失败')
      return Promise.reject(error)
    }
  )

  return instance
}

export const generateItem = async (config, theme, prompt) => {
  const api = createApi(config)
  const systemPrompt = getSystemPrompt(theme)
  
  try {
    const response = await api.post('', {
      model: config.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      response_format: { type: "json_object" }
    })
    return response
  } catch (error) {
    console.error('生成失败:', error)
    throw error
  }
}

const getSystemPrompt = (theme) => {
  const prompts = {
    fantasy: '你是一个奇幻物品描述生成器。请生成一个具有魔法特性的奇幻物品描述。返回JSON格式，包含name（物品名称）、description（详细描述）、properties（特性数组）字段。',
    scifi: '你是一个科幻物品描述生成器。请生成一个具有未来科技特性的物品描述。返回JSON格式，包含name（物品名称）、description（详细描述）、properties（特性数组）字段。',
    modern: '你是一个现代物品描述生成器。请生成一个具有现代特色的物品描述。返回JSON格式，包含name（物品名称）、description（详细描述）、properties（特性数组）字段。',
    ancient: '你是一个古代物品描述生成器。请生成一个具有历史文化特色的物品描述。返回JSON格式，包含name（物品名称）、description（详细描述）、properties（特性数组）字段。'
  }
  return prompts[theme] || prompts.fantasy
}
