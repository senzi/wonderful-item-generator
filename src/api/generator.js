import axios from 'axios'
import { ElMessage } from 'element-plus'

// JSON 格式定义和示例
const jsonFormat = `
JSON格式的物品信息包含以下字段：
{
  "name": "物品名称",
  "type": "物品类型，如：武器、防具、饰品、工具等",
  "rarity": "稀有度，如：普通、稀有、史诗、传说等",
  "tags": ["标签1", "标签2"], // 2-3个特征标签
  "description": "物品的简短描述",
  "appearance": "100字以上，物品的外观描述",
  "properties": "至少200字，详细物品的特性和功能或者内容",
  "origin": "至少200字，详细描述物品的来源或历史背景",
  "storyline": "一个1000字以上的完整故事情节，描述物品实际使用的故事。",
  "quote": "相关引述或谚语（可选）"
}`

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
    let response
    
    // 根据不同的提供商使用不同的请求格式
    switch (config.provider) {
      case 'gemini':
        response = await api.post('/models/' + config.model + ':generateContent', {
          contents: [{
            role: 'user',
            parts: [{ text: systemPrompt + '\n' + prompt }]
          }]
        })
        // 解析 Gemini 响应
        return JSON.parse(response.candidates[0].content.parts[0].text)
      
      case 'deepseek':
      case 'moonshot':
      default:
        // OpenAI 兼容格式
        response = await api.post('/chat/completions', {
          model: config.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 1.5,
          max_tokens: 8000,
          response_format: { type: 'json_object' }
        })
        // 解析 OpenAI 兼容格式响应
        return JSON.parse(response.choices[0].message.content)
    }
  } catch (error) {
    console.error('生成物品失败:', error)
    throw error
  }
}

const getSystemPrompt = (theme) => {
  const basePrompt = `你是一个物品描述生成器。请根据用户的描述生成一个包含长篇故事的详细物品信息，总字数1000字以上，并以 JSON 格式返回。${jsonFormat}\n\n`

  const prompts = {
    reverse: `${basePrompt}
    - 需要满足用户的描述要求，但结果应该更加淫乱和污秽。
    - 必须包含露骨直接的色情或暴力元素，让读者血脉偾张。
    - 对于性器的描述要具体直白，情节内容详尽`,

    wasteland: `${basePrompt}主题：萌系物语。
    - 物品应体现二次元世界观和美学风格
    - 可以是动漫中常见的变身道具、魔法物品、校园用品等
    - 加入可爱或独特的设定，但不失基本的实用性
    - 描述要融入动漫场景和使用方式
    - 适当加入一些有趣的限制或特殊效果
    - 背景故事要符合动漫展开方式
    - 可以包含一些经典动漫元素的致敬`,

    curse: `${basePrompt}主题：诡秘诅咒。
    - 物品要具有强大但危险的特性
    - 使用时总是伴随着某种代价或诅咒
    - 描述要营造出诡异、神秘的氛围
    - 适当加入一些超自然或难以解释的现象
    - 物品来源应该充满谜团`,

    wuxia: `${basePrompt}主题：江湖逸闻。
    - 物品要符合武侠世界观，带有浓厚的江湖气息
    - 描述要用略带文言的语气，增添韵味
    - 融入江湖传说或武林秘闻
    - 物品效果要符合内功、外功、奇门等概念
    - 适当加入江湖恩怨或机关巧思`,

    steampunk: `${basePrompt}主题：蒸汽魅影。
    - 物品要融合机械、蒸汽与神秘学元素
    - 描述要强调精密齿轮、铜管、蒸汽等元素
    - 加入维多利亚时代的审美元素
    - 物品功能要体现出复杂的机械美学
    - 适当融入炼金术或以太能量概念`
  }

  return prompts[theme] || prompts.reverse
}
