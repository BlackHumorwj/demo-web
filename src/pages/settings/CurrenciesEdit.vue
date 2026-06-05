<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑币种</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="币种代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入币种代码" style="width: 400px" maxlength="3" />
          <span class="input-tip">最多3个字符，如：CNY、USD</span>
        </el-form-item>
        <el-form-item label="币种名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入币种名称" style="width: 400px" maxlength="50" />
          <span class="input-tip">最多50个字符</span>
        </el-form-item>
        <el-form-item label="符号" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入币种符号" style="width: 400px" maxlength="10" />
          <span class="input-tip">最多10个字符，如：¥、$</span>
        </el-form-item>
        <el-form-item label="汇率" prop="rate">
          <el-input type="number" v-model="form.rate" placeholder="请输入汇率" style="width: 400px" step="0.0001" />
          <span class="input-tip">相对于人民币的汇率</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { mockCurrencies } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()

const form = reactive({
  id: '',
  code: '',
  name: '',
  symbol: '',
  rate: 1,
  status: 1
})

const rules: FormRules = {
  code: [{ required: true, message: '请输入币种代码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入币种名称', trigger: 'blur' }],
  symbol: [{ required: true, message: '请输入币种符号', trigger: 'blur' }]
}

onMounted(() => {
  const id = route.params.id as string
  const currency = mockCurrencies.find(item => item.id === id)
  if (currency) {
    form.id = currency.id
    form.code = currency.code
    form.name = currency.name
    form.symbol = currency.symbol
    form.rate = currency.rate
    form.status = currency.status
  } else {
    router.push('/settings/currencies')
  }
})

const handleBack = () => {
  router.push('/settings/currencies')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const index = mockCurrencies.findIndex(item => item.id === form.id)
  if (index !== -1) {
    mockCurrencies[index] = {
      ...mockCurrencies[index],
      code: form.code.toUpperCase(),
      name: form.name,
      symbol: form.symbol,
      rate: form.rate,
      status: form.status,
      updatedAt: new Date().toISOString()
    }
  }

  router.push('/settings/currencies')
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-card {
  min-height: 400px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 0;
}

.input-tip {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>