<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <span>新增分红</span>
      </template>
      
      <el-form ref="formRef" :model="formData" label-width="120px" class="bonus-form">
        <el-card class="form-section">
          <template #header>
            <span class="section-title">基本信息</span>
          </template>
          
          <el-form-item label="业务日期" prop="tradeTime">
            <el-date-picker 
              v-model="formData.tradeTime" 
              type="date" 
              placeholder="请选择业务日期"
              :max-date="new Date()"
              style="width: 280px"
            />
          </el-form-item>
          
          <el-form-item label="股东" prop="shareholderId">
            <el-select v-model="formData.shareholderId" placeholder="请选择股东" style="width: 280px">
              <el-option v-for="shareholder in shareholderOptions" :key="shareholder.value" :label="shareholder.label" :value="shareholder.value" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="分红金额" prop="amount">
            <el-input 
              v-model="formData.amount" 
              type="number" 
              placeholder="请输入分红金额"
              style="width: 280px"
            />
          </el-form-item>
          
          <el-form-item label="付款账户" prop="accountId">
            <el-select v-model="formData.accountId" placeholder="请选择付款账户" style="width: 280px">
              <el-option v-for="account in accountOptions" :key="account.value" :label="account.label" :value="account.value" />
            </el-select>
          </el-form-item>
        </el-card>
        
        <el-card class="form-section">
          <template #header>
            <span class="section-title">币种信息</span>
          </template>
          
          <el-form-item label="币种代码" prop="currencyCode">
            <el-select v-model="formData.currencyCode" placeholder="请选择币种" style="width: 280px">
              <el-option v-for="currency in currencyOptions" :key="currency.value" :label="currency.label" :value="currency.value" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="汇率" prop="exchangeRate">
            <el-input 
              v-model="formData.exchangeRate" 
              type="number" 
              placeholder="请输入汇率"
              style="width: 280px"
            />
          </el-form-item>
        </el-card>
        
        <el-card class="form-section">
          <template #header>
            <span class="section-title">可选信息</span>
          </template>
          
          <el-form-item label="备注">
            <el-textarea 
              v-model="formData.remark" 
              placeholder="请输入备注（最多256字）"
              :maxlength="256"
              :rows="3"
              style="width: 500px"
            />
          </el-form-item>
        </el-card>
        
        <div class="form-actions">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockBonusDocs, mockShareholders, mockAccounts, mockCurrencies } from '@/data/mockData'

const router = useRouter()

const formRef = ref()

const formData = reactive({
  tradeTime: new Date().toISOString().split('T')[0],
  shareholderId: '',
  amount: '',
  accountId: '',
  currencyCode: 'CNY',
  exchangeRate: '1.00000000',
  remark: ''
})

const shareholderOptions = computed(() => 
  mockShareholders
    .filter(s => s.status === 1)
    .map(s => ({ value: s.id, label: s.name }))
)

const accountOptions = computed(() => 
  mockAccounts
    .filter(a => a.status === 1)
    .map(a => ({ value: a.id, label: a.name }))
)

const currencyOptions = computed(() => 
  mockCurrencies
    .filter(c => c.status === 1)
    .map(c => ({ value: c.code, label: c.name }))
)

const validateForm = () => {
  if (!formData.tradeTime) {
    ElMessage.error('请选择业务日期')
    return false
  }
  
  if (!formData.shareholderId) {
    ElMessage.error('请选择股东')
    return false
  }
  
  const amount = parseFloat(formData.amount)
  if (!formData.amount || isNaN(amount) || amount <= 0) {
    ElMessage.error('请输入有效金额（必须大于0）')
    return false
  }
  
  if (!formData.accountId) {
    ElMessage.error('请选择付款账户')
    return false
  }
  
  return true
}

const handleSubmit = () => {
  if (!validateForm()) return
  
  const newDoc = {
    bizDocId: String(Date.now()),
    bizDocNo: `BO${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(mockBonusDocs.length + 1).padStart(4, '0')}`,
    tradeTime: formData.tradeTime,
    shareholderId: formData.shareholderId,
    shareholderName: mockShareholders.find(s => s.id === formData.shareholderId)?.name || '',
    accountId: formData.accountId,
    accountName: mockAccounts.find(a => a.id === formData.accountId)?.name || '',
    amount: parseFloat(formData.amount),
    currencyCode: formData.currencyCode,
    exchangeRate: parseFloat(formData.exchangeRate),
    remark: formData.remark,
    writerId: '1',
    writerName: '管理员',
    writerTime: new Date().toLocaleString('zh-CN'),
    updateId: null,
    updateName: '',
    updateTime: null,
    status: 0
  }
  
  mockBonusDocs.push(newDoc)
  ElMessage.success('保存成功')
  router.push('/business/bonus')
}

const handleCancel = () => {
  router.push('/business/bonus')
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-card {
  min-height: 400px;
}

.bonus-form {
  padding: 20px;
}

.form-section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 20px;
}
</style>