import axios from 'axios'
import { ElMessage } from 'element-plus'

// JSON 格式定义和示例
const jsonFormat = `
生成的物品信息需要包含以下字段：
{
  "name": "物品名称",
  "type": "物品类型，如：武器、防具、饰品、工具等",
  "rarity": "稀有度，如：普通、稀有、史诗、传说等",
  "tags": ["标签1", "标签2"], // 2-3个特征标签
  "description": "物品的简短描述",
  "appearance": "物品的外观描述",
  "properties": "物品的特性和功能描述",
  "origin": "物品的来源或历史背景",
  "restrictions": "使用限制（可选）",
  "quote": "相关引述或谚语（可选）"
}

示例：
{
  "name": "晨星之泪",
  "type": "饰品",
  "rarity": "史诗",
  "tags": ["魔法", "治愈", "自然"],
  "description": "一滴凝固的晨露，闪烁着柔和的蓝光",
  "appearance": "水滴形状的透明水晶吊坠，内部漂浮着点点星光",
  "properties": "佩戴者可以在黎明时分获得治愈能力，每天可以治愈一次轻伤",
  "origin": "相传是精灵族在第一缕晨光中收集的露珠，经过月光祝福而成",
  "restrictions": "只能在黎明时分（日出前后一小时内）使用",
  "quote": "晨光微露，生命绽放"
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
          temperature: 0.7,
          max_tokens: 1000
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
  const basePrompt = `你是一个物品描述生成器。请根据用户的描述生成一个详细的物品信息。${jsonFormat}\n\n`

  const prompts = {
    reverse: `${basePrompt}主题：反向期望。
    - 需要巧妙地满足用户的描述要求，但结果应该出人意料或具有讽刺性
    - 物品功能要有某种有趣的缺陷或意外效果
    - 描述风格要幽默有趣，带着一丝狡黠
    - 尽量加入一些出人意料的使用场景`,

    wasteland: `${basePrompt}主题：废土寻迹。
    - 物品应该来自于文明废墟，带有明显的年代感和使用痕迹
    - 混合高科技与原始工具的特征
    - 描述要强调物品的求生价值和历史意义
    - 融入末日后的环境适应性改造细节
    - 风格要粗犷但不失精妙`,

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
