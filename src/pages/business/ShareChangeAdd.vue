<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>新增股权变更</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="140px" class="form-container">
        <el-form-item label="业务日期" prop="tradeTime">
          <el-date-picker 
            v-model="form.tradeTime" 
            type="date" 
            placeholder="请选择业务日期" 
            style="width: 400px"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        
        <el-form-item label="变更类型" prop="changeType">
          <el-radio-group v-model="form.changeType">
            <el-radio :label="1">增股</el-radio>
            <el-radio :label="2">减股</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="股东" prop="shareholderId">
          <el-select v-model="form.shareholderId" placeholder="请选择股东" style="width: 400px">
            <el-option v-for="item in shareholderList" :key="item.id" :label="item.name" :value="Number(item.id)" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="收付款账户" prop="accountId">
          <el-select v-model="form.accountId" placeholder="请选择收付款账户" style="width: 400px">
            <el-option v-for="item in filteredAccounts" :key="item.id" :label="item.name" :value="Number(item.id)" />
          </el-select>
          <span class="account-tip">{{ form.changeType === 1 ? '（增股请选择收款账户）' : form.changeType === 2 ? '（减股请选择付款账户）' : '' }}</span>
        </el-form-item>
        
        <el-form-item label="变更金额" prop="amount">
          <el-input 
            v-model.number="form.amount" 
            placeholder="请输入变更金额" 
            style="width: 400px"
            :prefix-icon="Money"
          />
          <span class="input-tip">最多4位小数，必须大于0</span>
        </el-form-item>
        
        <el-form-item label="币种" prop="currencyCode">
          <el-select v-model="form.currencyCode" placeholder="请选择币种" style="width: 400px">
            <el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="汇率" prop="exchangeRate">
          <el-input 
            v-model.number="form.exchangeRate" 
            placeholder="请输入汇率" 
            style="width: 400px"
          />
          <span class="input-tip">最多8位小数，默认1.00000000</span>
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input 
            v-model="form.remark" 
            type="textarea" 
            placeholder="请输入备注信息（可选）" 
            style="width: 400px" 
            :rows="3" 
            maxlength="256" 
          />
          <span class="input-tip">最多256个字符</span>
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
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { Money } from '@element-plus/icons-vue'
import { mockShareChangeDocs, mockShareholders, mockAccounts, mockCurrencies } from '@/data/mockData'

const router = useRouter()

const formRef = ref<FormInstance>()

const form = reactive({
  tradeTime: '',
  changeType: 1,
  shareholderId: 0,
  accountId: 0,
  amount: 0,
  currencyCode: 'CNY',
  exchangeRate: 1.00000000,
  remark: ''
})

const rules: FormRules = {
  tradeTime: [{ required: true, message: '请选择业务日期', trigger: 'change' }],
  changeType: [{ required: true, message: '请选择变更类型', trigger: 'change' }],
  shareholderId: [{ required: true, message: '请选择股东', trigger: 'change' }],
  accountId: [{ required: true, message: '请选择收付款账户', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入变更金额', trigger: 'blur' },
    { 
      validator: (rule: any, value: number, callback: any) => {
        if (value <= 0) {
          callback(new Error('变更金额必须大于0'))
        } else if (value.toString().split('.')[1]?.length > 4) {
          callback(new Error('金额最多支持4位小数'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  currencyCode: [{ required: true, message: '请选择币种', trigger: 'change' }],
  exchangeRate: [
    { required: true, message: '请输入汇率', trigger: 'blur' },
    { 
      validator: (rule: any, value: number, callback: any) => {
        if (value <= 0) {
          callback(new Error('汇率必须大于0'))
        } else if (value.toString().split('.')[1]?.length > 8) {
          callback(new Error('汇率最多支持8位小数'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const shareholderList = computed(() => mockShareholders.filter(s => s.status === 1))
const currencyList = computed(() => mockCurrencies.filter(c => c.status === 1))

const filteredAccounts = computed(() => {
  return mockAccounts.filter(a => a.status === 1)
})

const disabledDate = (time: Date) => {
  return time > new Date()
}

const handleBack = () => {
  router.push('/business/share-change')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const shareholder = mockShareholders.find(s => Number(s.id) === form.shareholderId)
  const account = mockAccounts.find(a => Number(a.id) === form.accountId)

  const maxId = Math.max(...mockShareChangeDocs.map(item => item.bizDocId), 0)
  const newId = maxId + 1
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const seq = String(mockShareChangeDocs.filter(item => item.bizDocNo.startsWith(`SC-${year}${month}${day}`)).length + 1).padStart(4, '0')
  const docNo = `SC-${year}${month}${day}-${seq}`

  mockShareChangeDocs.push({
    bizDocId: newId,
    bizDocNo: docNo,
    tradeTime: form.tradeTime,
    changeType: form.changeType,
    changeTypeName: form.changeType === 1 ? '增股' : '减股',
    shareholderId: form.shareholderId,
    shareholderName: shareholder?.name || '',
    accountId: form.accountId,
    accountName: account?.name || '',
    amount: form.amount,
    currencyCode: form.currencyCode,
    exchangeRate: form.exchangeRate,
    remark: form.remark || '',
    writerTime: now.toLocaleString('zh-CN'),
    status: 0
  })

  router.push('/business/share-change')
}

onMounted(() => {
  const today = new Date().toISOString().split('T')[0]
  form.tradeTime = today
})
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

.account-tip {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #666;
}
</style>