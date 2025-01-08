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
          <h2 class="item-name">{{ item.name }}</h2>
          <p class="item-description">{{ item.description }}</p>
          <div class="item-properties">
            <el-tag
              v-for="(prop, index) in item.properties"
              :key="index"
              class="property-tag"
              effect="light"
            >
              {{ prop }}
            </el-tag>
          </div>
          <div class="model-info">
            <div class="divider"></div>
            <p class="model-text">该物品描述由 {{ modelInfo }} 提供</p>
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

const configStore = useConfigStore()

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
  max-width: 400px;
  padding: 40px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-card {
  position: relative;
  width: calc(100% - 80px);
  min-height: 200px;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.download-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.item-name {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.item-description {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #606266;
}

.item-properties {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.property-tag {
  font-size: 14px;
}

.model-info {
  margin-top: 20px;
  text-align: center;
}

.divider {
  height: 1px;
  background-color: #DCDFE6;
  margin-bottom: 12px;
}

.model-text {
  margin: 0;
  font-size: 12px;
  color: #909399;
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
