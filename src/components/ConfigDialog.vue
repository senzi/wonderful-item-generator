<template>
  <el-dialog
    v-model="dialogVisible"
    title="API配置"
    width="500px"
  >
    <div class="preset-providers">
      <el-select
        v-model="selectedProvider"
        class="provider-select"
        placeholder="选择供应商"
        @change="handleProviderChange"
      >
        <el-option label="自定义配置" value="custom" />
        <el-option label="Moonshot" value="moonshot" />
        <el-option label="Deepseek" value="deepseek" />
        <el-option label="Gemini" value="gemini" />
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
const dialogVisible = ref(props.modelValue)
const form = ref({
  baseUrl: '',
  apiKey: '',
  model: ''
})
const formRef = ref(null)

// 预设供应商配置
const providers = {
  custom: {
    baseUrl: '',
    model: ''
  },
  moonshot: {
    baseUrl: 'https://api.moonshot.cn/v1',
    model: 'moonshot-v1-8k'
  },
  deepseek: {
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat'
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    model: 'gemini-pro'
  }
}

const selectedProvider = ref('custom')

// 切换供应商
const handleProviderChange = (provider) => {
  if (provider !== 'custom') {
    form.value.baseUrl = providers[provider].baseUrl
    form.value.model = providers[provider].model
  } else {
    form.value.baseUrl = ''
    form.value.model = ''
  }
}

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
  
  // 检查是否匹配预设供应商
  const provider = Object.entries(providers).find(([key, value]) => 
    value.baseUrl === config.baseUrl && value.model === config.model
  )
  selectedProvider.value = provider ? provider[0] : 'custom'
}

// 保存配置
const saveConfig = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      configStore.setApiConfig(form.value)
      dialogVisible.value = false
      ElMessage.success('配置已保存')
    } else {
      ElMessage.warning('请填写完整的API配置信息')
    }
  })
}

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

loadConfig()
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.preset-providers {
  margin-bottom: 20px;
}

.provider-select {
  width: 100%;
}
</style>
