<template>
  <div class="inventory-wrapper">
    <el-table
      :data="itemsStore.items"
      style="width: 100%"
      @row-click="handleRowClick"
      :empty-text="'物品栏空空如也...'"
    >
      <el-table-column prop="name" label="物品名称" min-width="200">
        <template #default="{ row }">
          <span class="item-name">{{ row.name }}</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="theme" label="主题" min-width="120">
        <template #default="{ row }">
          <span class="theme-name">
            {{ themeStore.themes.find(t => t.id === row.theme)?.name }}
          </span>
        </template>
      </el-table-column>
      
      <el-table-column prop="model" label="模型" min-width="150">
        <template #default="{ row }">
          <span class="model-name">{{ row.model }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row, $index }">
          <el-popconfirm
            title="确定要销毁这件物品吗？"
            confirm-button-text="销毁"
            cancel-button-text="取消"
            @confirm="handleDelete($index)"
            width="200"
          >
            <template #reference>
              <el-button
                type="danger"
                size="small"
                :icon="Delete"
              >
                销毁
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import { useItemsStore } from '../stores/items'
import { useThemeStore } from '../stores/theme'

const itemsStore = useItemsStore()
const themeStore = useThemeStore()

const emit = defineEmits(['select'])

const handleRowClick = (row) => {
  emit('select', row)
}

const handleDelete = (index) => {
  itemsStore.removeItem(index)
}

onMounted(() => {
  itemsStore.loadFromLocalStorage()
})
</script>

<style scoped>
.inventory-wrapper {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 24px;
}

:deep(.el-popconfirm__main) {
  min-width: 200px;
  padding: 12px 0;
  white-space: nowrap;
}

.item-name {
  font-weight: 500;
  color: #2c3e50;
}

.theme-name {
  color: #409eff;
}

.model-name {
  font-family: 'Fira Code', monospace;
  color: #67c23a;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .inventory-wrapper {
    padding: 16px;
    border-radius: 8px;
    width: calc(100% - 32px);
  }
}
</style>
