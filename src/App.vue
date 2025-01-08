<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <h1>奇妙物品生成器</h1>
      <el-button
        type="primary"
        :icon="Setting"
        circle
        @click="showConfig = true"
      />
    </header>

    <!-- 主题切换区 -->
    <div class="theme-selector">
      <el-radio-group v-model="currentTheme" size="large">
        <el-radio-button
          v-for="theme in themes"
          :key="theme.id"
          :label="theme.id"
        >
          {{ theme.name }}
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- 物品展示区 -->
    <item-card :item="generatedItem" />

    <!-- 输入区域 -->
    <div class="input-area">
      <el-input
        v-model="prompt"
        type="textarea"
        :rows="3"
        placeholder="描述你想要生成的奇妙物品..."
        resize="none"
      />
      <el-button
        type="primary"
        :loading="generating"
        @click="generateItem"
      >
        生成
      </el-button>
    </div>

    <!-- 配置对话框 -->
    <config-dialog v-model="showConfig" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Setting } from '@element-plus/icons-vue'
import { useThemeStore } from './stores/theme'
import { useConfigStore } from './stores/config'
import { generateItem as callGenerateApi } from './api/generator'
import ConfigDialog from './components/ConfigDialog.vue'
import ItemCard from './components/ItemCard.vue'

const themeStore = useThemeStore()
const configStore = useConfigStore()

const showConfig = ref(false)
const prompt = ref('')
const generating = ref(false)
const generatedItem = ref(null)

// 主题相关
const themes = computed(() => themeStore.themes)
const currentTheme = computed({
  get: () => themeStore.currentTheme,
  set: (value) => themeStore.setTheme(value)
})

// 生成物品
const generateItem = async () => {
  if (!prompt.value.trim()) {
    ElMessage.warning('请输入描述文字')
    return
  }

  const config = configStore.apiConfig
  if (!config.baseUrl || !config.apiKey) {
    ElMessage.warning('请先配置API参数')
    showConfig.value = true
    return
  }

  generating.value = true
  try {
    const result = await callGenerateApi(
      config,
      currentTheme.value,
      prompt.value
    )
    generatedItem.value = result
  } catch (error) {
    console.error('生成失败:', error)
  } finally {
    generating.value = false
  }
}

// 初始化时加载配置
configStore.loadApiConfig()
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #f5f7fa;
}

#app {
  height: 100%;
}
</style>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0 20px;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  background-color: #f5f7fa;
}

.app-header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.theme-selector {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.input-area {
  position: sticky;
  bottom: 0;
  z-index: 10;
  display: flex;
  gap: 12px;
  padding: 20px 0;
  background-color: #f5f7fa;
}

.input-area :deep(.el-textarea__inner) {
  resize: none;
}

@media (max-width: 768px) {
  .theme-selector :deep(.el-radio-group) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    width: 100%;
  }

  .theme-selector :deep(.el-radio-button) {
    width: 100%;
  }

  .theme-selector :deep(.el-radio-button__inner) {
    width: 100%;
  }

  .input-area {
    flex-direction: column;
  }
}
</style>
