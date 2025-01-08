<template>
  <el-dialog
    v-model="dialogVisible"
    title="API配置"
    width="500px"
  >
    <el-form :model="form" label-width="100px">
      <el-form-item label="API地址">
        <el-input v-model="form.baseUrl" placeholder="请输入API基础地址" />
      </el-form-item>
      <el-form-item label="API密钥">
        <el-input v-model="form.apiKey" placeholder="请输入API密钥" show-password />
      </el-form-item>
      <el-form-item label="模型名称">
        <el-input v-model="form.model" placeholder="请输入模型名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveConfig">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useConfigStore } from '../stores/config'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const configStore = useConfigStore()
const dialogVisible = ref(props.modelValue)
const form = ref({
  baseUrl: '',
  apiKey: '',
  model: ''
})

// 监听对话框显示状态
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
})

watch(dialogVisible, (val) => {
  emit('update:modelValue', val)
})

// 初始化时加载配置
const loadConfig = () => {
  const config = configStore.apiConfig
  form.value = { ...config }
}

// 保存配置
const saveConfig = () => {
  configStore.setApiConfig(form.value)
  dialogVisible.value = false
}

loadConfig()
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
