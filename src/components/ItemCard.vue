<template>
  <div class="item-card" ref="cardRef">
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
    </div>
    <div v-else class="empty-state">
      <el-icon class="empty-icon"><Box /></el-icon>
      <p>输入提示词生成奇妙物品</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Download, Box } from '@element-plus/icons-vue'
import html2canvas from 'html2canvas'

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
})

const cardRef = ref(null)

const exportImage = async () => {
  if (!cardRef.value) return
  
  try {
    const canvas = await html2canvas(cardRef.value, {
      backgroundColor: '#ffffff'
    })
    
    const link = document.createElement('a')
    link.download = `${props.item.name || '奇妙物品'}.png`
    link.href = canvas.toDataURL()
    link.click()
  } catch (error) {
    console.error('导出图片失败:', error)
    ElMessage.error('导出图片失败')
  }
}
</script>

<style scoped>
.item-card {
  position: relative;
  width: 100%;
  max-width: 600px;
  min-height: 300px;
  margin: 20px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.download-btn {
  position: absolute;
  top: 16px;
  right: 16px;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-name {
  margin: 0;
  font-size: 24px;
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
  margin: 0;
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
  margin-bottom: 12px;
}
</style>
