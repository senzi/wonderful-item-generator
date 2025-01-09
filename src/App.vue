<template>
  <div class="app-wrapper">
    <div class="app-container">
      <!-- 顶部导航栏 -->
      <header class="app-header">
        <div class="header-content">
          <h1>奇妙物品生成器 <span class="subtitle">Wonderful Item Generator</span></h1>
          <el-button
            class="setting-btn"
            :icon="Setting"
            circle
            @click="showConfig = true"
          />
        </div>
      </header>

      <main class="main-content">
        <!-- 主题切换区 -->
        <div class="theme-selector">
          <div class="theme-options">
            <div
              v-for="theme in themes"
              :key="theme.id"
              :class="['theme-option', { active: currentTheme === theme.id }]"
              @click="currentTheme = theme.id"
            >
              {{ theme.name }}
            </div>
          </div>
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
            class="generate-btn"
            :loading="generating"
            @click="generateItem"
            size="large"
          >
            开始创造
          </el-button>
        </div>

        <!-- 物品栏 -->
        <item-inventory @select="handleItemSelect" />

        <!-- 配置对话框 -->
        <config-dialog v-model="showConfig" />
      </main>

      <!-- 页脚 -->
      <footer class="app-footer">
        <div class="footer-content">
          <div class="footer-links">
            <a href="https://github.com/senzi/wonderful-item-generator" target="_blank">
              <el-icon><Platform /></el-icon>
              GitHub
            </a>
            <span class="divider">|</span>
            <span class="license">MIT License</span>
            <span class="divider">|</span>
            <span class="authors">Created by senzi & Windsurf</span>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Setting, Platform } from '@element-plus/icons-vue'
import { useThemeStore } from './stores/theme'
import { useConfigStore } from './stores/config'
import { useItemsStore } from './stores/items'
import { generateItem as callGenerateApi } from './api/generator'
import ConfigDialog from './components/ConfigDialog.vue'
import ItemCard from './components/ItemCard.vue'
import ItemInventory from './components/ItemInventory.vue'

const themeStore = useThemeStore()
const configStore = useConfigStore()
const itemsStore = useItemsStore()

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
    // 添加到物品栏
    itemsStore.addItem({
      ...result,
      theme: currentTheme.value,
      model: config.model
    })
  } catch (error) {
    console.error('生成失败:', error)
  } finally {
    generating.value = false
  }
}

// 选择物品栏中的物品
const handleItemSelect = (item) => {
  generatedItem.value = item
}

// 初始化时加载配置
configStore.loadApiConfig()
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  font-family: 'LXGW WenKai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  overflow-x: hidden;
  font-family: inherit;
}

@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
}
</style>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
  width: 100%;
  overflow-x: hidden;
}

.app-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.app-header {
  background: linear-gradient(135deg, #1a1a1a 0%, #2c3e50 100%);
  padding: 20px;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-content h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .header-content h1 {
    font-size: 18px;
  }

  .subtitle {
    display: block;
    margin-left: 0;
    margin-top: 4px;
  }
}

.subtitle {
  font-size: 0.6em;
  color: rgba(255, 255, 255, 0.7);
  font-weight: normal;
  margin-left: 8px;
}

.main-content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.theme-selector {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.theme-options {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .theme-options {
    gap: 8px;
  }

  .theme-option {
    padding: 6px 12px;
    font-size: 14px;
  }
}

.theme-option {
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #606266;
  font-size: 15px;
  user-select: none;
}

.theme-option:hover {
  color: #409eff;
  background: #ecf5ff;
}

.theme-option.active {
  color: #409eff;
  background: #ecf5ff;
  font-weight: 500;
}

.input-area {
  width: calc(100% - 48px);  /* 减去左右padding */
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .app-container {
    width: 100%;
    min-height: 100vh;
    box-shadow: none;
  }

  .main-content {
    width: 100%;
    box-sizing: border-box;
    padding: 16px;
    gap: 16px;
  }

  .theme-selector,
  .input-area {
    width: calc(100% - 32px);  /* 减去左右padding */
    padding: 16px;
    border-radius: 8px;
    margin: 0 auto;
  }

  .input-area :deep(.el-textarea__inner) {
    font-size: 14px;
  }

  .generate-btn {
    width: 100%;
    max-width: 300px;  /* 限制按钮最大宽度 */
  }
}

@media (max-width: 480px) {
  .footer-links {
    flex-direction: column;
    gap: 8px;
  }

  .divider {
    display: none;
  }
}

.setting-btn {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.setting-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.4);
  color: white;
}

.generate-btn {
  min-width: 120px;
  height: 40px;
  font-size: 16px;
  background: #2c3e50;
  border-color: #2c3e50;
  color: white;
  transition: all 0.3s ease;
  font-family: inherit;
}

.generate-btn:deep(.el-button__text) {
  font-family: inherit;
}

.generate-btn:hover {
  background: #34495e;
  border-color: #34495e;
}

.generate-btn:active {
  background: #243342;
  border-color: #243342;
}

.app-footer {
  padding: 24px;
  background-color: #f8f9fa;
  border-top: 1px solid #ebeef5;
}

.footer-content {
  text-align: center;
  color: #606266;
  font-size: 14px;
}

.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.footer-links a {
  color: #409eff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-links a:hover {
  color: #79bbff;
}

.divider {
  color: #dcdfe6;
}

.license, .authors {
  color: #909399;
}
</style>
