<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <span>编辑分红</span>
      </template>
      
      <div v-if="loading" class="loading-container">
        <el-loading text="加载中..." />
      </div>
      
      <el-form v-else ref="formRef" :model="formData" label-width="120px" class="bonus-form">
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
import { reactive, computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockBonusDocs, mockShareholders, mockAccounts, mockCurrencies } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref()
const loading = ref(true)

const formData = reactive({
  bizDocId: '',
  bizDocNo: '',
  tradeTime: '',
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

const loadData = () => {
  const bizDocId = route.params.id as string
  const doc = mockBonusDocs.find(item => item.bizDocId === bizDocId)
  
  if (!doc) {
    ElMessage.error('数据不存在')
    router.push('/business/bonus')
    return
  }
  
  if (doc.status === -1) {
    ElMessage.error('已删除的记录不能编辑')
    router.push('/business/bonus')
    return
  }
  
  if (doc.voucher) {
    ElMessage.error('已生成凭证的记录不能编辑')
    router.push('/business/bonus')
    return
  }
  
  formData.bizDocId = doc.bizDocId
  formData.bizDocNo = doc.bizDocNo
  formData.tradeTime = doc.tradeTime
  formData.shareholderId = doc.shareholderId
  formData.amount = String(doc.amount)
  formData.accountId = doc.accountId
  formData.currencyCode = doc.currencyCode
  formData.exchangeRate = String(doc.exchangeRate)
  formData.remark = doc.remark
  
  loading.value = false
}

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
  
  const index = mockBonusDocs.findIndex(item => item.bizDocId === formData.bizDocId)
  if (index !== -1) {
    mockBonusDocs[index] = {
      ...mockBonusDocs[index],
      tradeTime: formData.tradeTime,
      shareholderId: formData.shareholderId,
      shareholderName: mockShareholders.find(s => s.id === formData.shareholderId)?.name || '',
      amount: parseFloat(formData.amount),
      accountId: formData.accountId,
      accountName: mockAccounts.find(a => a.id === formData.accountId)?.name || '',
      currencyCode: formData.currencyCode,
      exchangeRate: parseFloat(formData.exchangeRate),
      remark: formData.remark,
      updateId: '1',
      updateName: '管理员',
      updateTime: new Date().toLocaleString('zh-CN')
    }
    
    ElMessage.success('保存成功')
    router.push('/business/bonus')
  }
}

const handleCancel = () => {
  router.push('/business/bonus')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-card {
  min-height: 400px;
}

.loading-container {
  padding: 40px;
  text-align: center;
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