<template>
  <el-dialog
    v-model="dialogVisible"
    title="API配置"
    width="500px"
    @open="onDialogOpen"
  >
    <div class="preset-providers">
      <el-select
        v-model="selectedProvider"
        class="provider-select"
        placeholder="选择供应商"
        @change="handleProviderChange"
      >
        <el-option
          v-for="(config, key) in configStore.apiConfig.providers"
          :key="key"
          :label="config.name"
          :value="key"
        />
      </el-select>
    </div>

    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <el-form-item label="API地址" prop="baseUrl">
        <el-input 
          v-model="form.baseUrl" 
          placeholder="请输入API基础地址"
          :disabled="selectedProvider !== 'custom'"
        />
      </el-form-item>
      <el-form-item label="API密钥" prop="apiKey">
        <el-input 
          v-model="form.apiKey" 
          placeholder="请输入API密钥" 
          show-password 
        />
      </el-form-item>
      <el-form-item label="模型名称" prop="model">
        <el-input 
          v-model="form.model" 
          placeholder="请输入模型名称"
          :disabled="selectedProvider !== 'custom'"
        />
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
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])
const configStore = useConfigStore()
const formRef = ref(null)
const dialogVisible = ref(false)
const selectedProvider = ref('custom')

const form = ref({
  baseUrl: '',
  apiKey: '',
  model: '',
  provider: 'custom'
})

const rules = {
  baseUrl: [
    { required: true, message: '请输入API基础地址', trigger: 'blur' }
  ],
  apiKey: [
    { required: true, message: '请输入API密钥', trigger: 'blur' }
  ],
  model: [
    { required: true, message: '请输入模型名称', trigger: 'blur' }
  ]
}

// 加载配置
const loadConfig = () => {
  const { apiConfig } = configStore
  form.value = {
    baseUrl: apiConfig.baseUrl || '',
    apiKey: apiConfig.apiKey || '',
    model: apiConfig.model || '',
    provider: apiConfig.provider || 'custom'
  }
  selectedProvider.value = form.value.provider
}

// 切换供应商
const handleProviderChange = (provider) => {
  const providerConfig = configStore.apiConfig.providers[provider]
  if (providerConfig) {
    form.value = {
      ...form.value,
      baseUrl: provider === 'custom' ? '' : providerConfig.baseUrl,
      model: provider === 'custom' ? '' : providerConfig.model,
      provider
    }
  }
}

// 对话框打开时的处理
const onDialogOpen = () => {
  loadConfig()
}

// 保存配置
const saveConfig = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    const config = {
      ...configStore.apiConfig,
      baseUrl: form.value.baseUrl,
      apiKey: form.value.apiKey,
      model: form.value.model,
      provider: selectedProvider.value
    }
    configStore.setApiConfig(config)
    dialogVisible.value = false
    emit('update:modelValue', false)
    ElMessage.success('配置已保存')
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请填写完整的配置信息')
  }
}

// 监听对话框显示状态
watch(() => props.modelValue, (val) => {
  dialogVisible.value = val
})

watch(() => dialogVisible.value, (val) => {
  emit('update:modelValue', val)
})
</script>

<style scoped>
.preset-providers {
  margin-bottom: 20px;
}

.provider-select {
  width: 100%;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
