<template>
  <div class="card-container">
    <div class="card-wrapper" ref="wrapperRef">
      <div class="item-card">
        <div v-if="item" class="item-content">
          <el-button
            class="download-btn"
            type="primary"
            :icon="Download"
            circle
            @click="exportImage"
          />
          <div class="item-header">
            <span class="item-rarity">[{{ item.rarity }}]</span>
            <h3 class="item-name">{{ item.name }}</h3>
            <div class="item-type">{{ item.type }}</div>
            <div class="item-tags">
              <el-tag
                v-for="tag in item.tags"
                :key="tag"
                class="tag"
                effect="dark"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>

          <div class="item-description">
            {{ item.description }}
          </div>

          <div class="item-details">
            <div class="detail-row">
              <span class="detail-label">外观:</span>
              <span>{{ item.appearance }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">特性:</span>
              <span>{{ item.properties }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">来源:</span>
              <span>{{ item.origin }}</span>
            </div>
            <div class="detail-row" v-if="item.restrictions">
              <span class="detail-label">限制:</span>
              <span>{{ item.restrictions }}</span>
            </div>
          </div>

          <div class="item-quote" v-if="item.quote">
            {{ item.quote }}
          </div>

          <div class="model-info">
            <div class="divider"></div>
            <div class="info-text">
              <div class="theme-info">
                {{ themeStore.themes.find(t => t.id === themeStore.currentTheme)?.name }} 主题创作
              </div>
              <div class="model-detail">
                由 <span class="model-name">{{ modelInfo }}</span> 提供
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          <el-icon class="empty-icon"><Box /></el-icon>
          <p>输入提示词生成奇妙物品</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Download, Box } from '@element-plus/icons-vue'
import { toPng } from 'html-to-image'
import { useConfigStore } from '../stores/config'
import { useThemeStore } from '../stores/theme'

const configStore = useConfigStore()
const themeStore = useThemeStore()

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const wrapperRef = ref(null)

// 获取模型信息
const modelInfo = computed(() => {
  const config = configStore.apiConfig
  return config?.model || '未知模型'
})

const exportImage = async () => {
  if (!wrapperRef.value) return
  
  try {
    // 暂时隐藏下载按钮
    const downloadBtn = wrapperRef.value.querySelector('.download-btn')
    if (downloadBtn) {
      downloadBtn.style.display = 'none'
    }

    const dataUrl = await toPng(wrapperRef.value, {
      backgroundColor: '#ffffff',
      quality: 1.0,
      pixelRatio: 2
    })

    // 恢复下载按钮显示
    if (downloadBtn) {
      downloadBtn.style.display = ''
    }

    // 下载图片
    const link = document.createElement('a')
    link.download = `${props.item?.name || '奇妙物品'}.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('导出图片失败:', error)
  }
}
</script>

<style scoped>
.card-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-wrapper {
  width: 100%;
  max-width: 600px;
  padding: 40px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-card {
  width: calc(100% - 80px);
  min-height: 200px;
  border: 1px solid #2a2a2a;
  border-radius: 8px;
  padding: 30px;
  background: #1a1a1a;
  color: #e0e0e0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
}

.download-btn {
  position: absolute;
  top: 12px;
  right: 12px;
}

.item-header {
  margin-bottom: 12px;
}

.item-name {
  font-size: 1.2em;
  font-weight: bold;
  margin: 0;
  display: inline;
  margin-left: 6px;
}

.item-rarity {
  color: #ffd700;
  font-size: 0.9em;
}

.item-type {
  color: #888;
  font-size: 0.9em;
  margin-top: 4px;
}

.item-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin: 8px 0;
}

.tag {
  background: #333;
}

.item-description {
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  padding: 12px 0;
  margin: 12px 0;
  line-height: 1.4;
}

.item-details {
  font-size: 0.9em;
}

.detail-row {
  margin: 8px 0;
}

.detail-label {
  color: #888;
  margin-right: 8px;
}

.item-quote {
  font-style: italic;
  color: #888;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #333;
}

.model-info {
  margin-top: 16px;
  text-align: center;
}

.divider {
  height: 1px;
  background: #333;
  margin-bottom: 12px;
}

.info-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 0.8em;
}

.theme-info {
  color: #888;
}

.model-name {
  color: #4a9eff;
  font-family: 'Fira Code', monospace;
  font-weight: 500;
}

.model-detail {
  color: #666;
}

.empty-state {
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
</style>
