<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑账本</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-alert
        v-if="ledger?.hasTransactions"
        title="该账本存在交易记录，仅允许修改账本名称"
        type="warning"
        :closable="false"
        show-icon
        style="max-width: 600px; margin: 20px auto 0;"
      />

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="账本名称" prop="ledgerName">
          <el-input v-model="form.ledgerName" placeholder="请输入账本名称" style="width: 400px" maxlength="50" />
          <span class="input-tip">最多50个字符</span>
        </el-form-item>
        <el-form-item label="账本类型" prop="ledgerType">
          <el-select v-model="form.ledgerType" placeholder="请选择账本类型" style="width: 400px" :disabled="!!ledger?.hasTransactions">
            <el-option label="小规模纳税人" value="小规模纳税人" />
            <el-option label="一般纳税人" value="一般纳税人" />
          </el-select>
        </el-form-item>
        <el-form-item label="本位币" prop="currencyCode">
          <el-select v-model="form.currencyCode" placeholder="请选择本位币" style="width: 400px" :disabled="!!ledger?.hasTransactions">
            <el-option v-for="c in mockCurrencies" :key="c.code" :label="`${c.code} - ${c.name}`" :value="c.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="请选择开始日期"
            value-format="YYYY-MM-DD"
            style="width: 400px"
            :disabled="!!ledger?.hasTransactions"
          />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { mockLedgers, mockCurrencies } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const formRef = ref<FormInstance>()

const id = computed(() => route.params.id as string)

const ledger = computed(() => mockLedgers.find(item => item.id === id.value) || null)

const form = reactive({
  ledgerName: '',
  ledgerType: '小规模纳税人',
  currencyCode: 'CNY',
  startDate: ''
})

const rules: FormRules = {
  ledgerName: [{ required: true, message: '请输入账本名称', trigger: 'blur' }]
}

onMounted(() => {
  if (ledger.value) {
    form.ledgerName = ledger.value.ledgerName
    form.ledgerType = ledger.value.ledgerType
    form.currencyCode = ledger.value.currencyCode
    form.startDate = ledger.value.startDate
  }
})

const handleBack = () => {
  router.push('/settings/ledger')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const index = mockLedgers.findIndex(item => item.id === id.value)
  if (index !== -1) {
    const existing = mockLedgers[index]
    mockLedgers[index] = {
      ...existing,
      ledgerName: form.ledgerName,
      ledgerType: form.ledgerType,
      currencyCode: form.currencyCode,
      startDate: form.startDate,
      updateTime: new Date().toISOString()
    }
  }

  router.push('/settings/ledger')
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
