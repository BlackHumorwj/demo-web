<template>
  <div class="page-container">
    <div class="page-header">
      <h2>新增借入借出</h2>
    </div>

    <div class="page-card">
      <el-form :model="form" ref="formRef" label-width="120px" class="form-container">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="日期" prop="tradeTime" required>
              <el-date-picker
                v-model="form.tradeTime"
                type="date"
                placeholder="选择日期"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="挂账类型" prop="arapType" required>
              <el-select
                v-model="form.arapType"
                placeholder="选择挂账类型"
                style="width: 100%;"
                @change="handleArapTypeChange"
              >
                <el-option label="借入款" :value="5" />
                <el-option label="借出款" :value="6" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="挂账账户" prop="accountId" required>
              <el-select
                v-model="form.accountId"
                placeholder="选择挂账账户"
                style="width: 100%;"
              >
                <el-option
                  v-for="account in filteredAccounts"
                  :key="account.id"
                  :label="account.name"
                  :value="account.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资金账户" prop="fundAccountId" required>
              <el-select
                v-model="form.fundAccountId"
                placeholder="选择资金账户"
                style="width: 100%;"
              >
                <el-option
                  v-for="account in mockAccounts"
                  :key="account.id"
                  :label="account.name"
                  :value="account.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="往来单位" prop="bizContactId" required>
              <el-select
                v-model="form.bizContactId"
                placeholder="选择往来单位"
                style="width: 100%;"
              >
                <el-option
                  v-for="contact in mockContacts"
                  :key="contact.id"
                  :label="contact.name"
                  :value="contact.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金额" prop="amount" required>
              <el-input
                v-model.number="form.amount"
                type="number"
                placeholder="请输入金额"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="到期日" prop="dueDate">
              <el-date-picker
                v-model="form.dueDate"
                type="date"
                placeholder="选择到期日"
                :disabled="!form.tradeTime"
                :picker-options="dueDatePickerOptions"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="币种" prop="currencyCode" required>
              <el-select
                v-model="form.currencyCode"
                placeholder="选择币种"
                style="width: 100%;"
              >
                <el-option
                  v-for="currency in mockCurrencies"
                  :key="currency.code"
                  :label="currency.name"
                  :value="currency.code"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="汇率" prop="exchangeRate" required>
              <el-input
                v-model.number="form.exchangeRate"
                type="number"
                placeholder="请输入汇率"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签" prop="tag">
              <el-input
                v-model="form.tag"
                placeholder="多个标签用逗号分隔"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="备注" prop="remark">
          <el-textarea
            v-model="form.remark"
            placeholder="请输入备注"
            :rows="3"
            style="width: 100%;"
          />
        </el-form-item>

        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockContacts, mockAccounts, mockCurrencies, mockBorrowLendList } from '@/data/mockData'

const router = useRouter()

const formRef = ref()

const form = ref({
  tradeTime: '',
  arapType: 5,
  accountId: '',
  fundAccountId: '',
  bizContactId: '',
  amount: 0,
  dueDate: '',
  currencyCode: 'CNY',
  exchangeRate: 1.00000000,
  tag: '',
  remark: ''
})

const dueDatePickerOptions = computed(() => ({
  disabledDate: (time: Date) => {
    if (!form.value.tradeTime) return false
    return time <= new Date(form.value.tradeTime)
  }
}))

const filteredAccounts = computed(() => {
  if (form.value.arapType === 5) {
    return [
      { id: '5', name: '其他应付款' },
      { id: '7', name: '短期借款' },
      { id: '8', name: '长期借款' }
    ]
  } else {
    return [
      { id: '6', name: '其他应收款' },
      { id: '9', name: '备用金' }
    ]
  }
})

const handleArapTypeChange = () => {
  form.value.accountId = ''
}

const handleCancel = () => {
  router.push('/borrowLend')
}

const handleSubmit = () => {
  if (!form.value.tradeTime) {
    alert('请选择日期')
    return
  }
  if (!form.value.accountId) {
    alert('请选择挂账账户')
    return
  }
  if (!form.value.fundAccountId) {
    alert('请选择资金账户')
    return
  }
  if (!form.value.bizContactId) {
    alert('请选择往来单位')
    return
  }
  if (!form.value.amount || form.value.amount <= 0) {
    alert('请输入有效的金额（大于0）')
    return
  }
  if (form.value.dueDate && form.value.dueDate <= form.value.tradeTime) {
    alert('到期日必须大于业务日期')
    return
  }

  const newRecord = {
    bizDocId: String(mockBorrowLendList.length + 1),
    bizDocNo: `BL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(mockBorrowLendList.length + 1).padStart(4, '0')}`,
    tradeTime: form.value.tradeTime,
    arapType: form.value.arapType,
    arapTypeName: form.value.arapType === 5 ? '借入款' : '借出款',
    accountId: form.value.accountId,
    accountName: filteredAccounts.value.find(a => a.id === form.value.accountId)?.name || '',
    fundAccountId: form.value.fundAccountId,
    fundAccountName: mockAccounts.find(a => a.id === form.value.fundAccountId)?.name || '',
    bizContactId: form.value.bizContactId,
    bizContactName: mockContacts.find(c => c.id === form.value.bizContactId)?.name || '',
    amount: form.value.amount,
    dueDate: form.value.dueDate || null,
    currencyCode: form.value.currencyCode,
    exchangeRate: form.value.exchangeRate,
    tag: form.value.tag,
    remark: form.value.remark,
    writerId: '1',
    writerName: '张三',
    writerTime: new Date().toLocaleString('zh-CN'),
    updateId: null,
    updateName: '',
    updateTime: null,
    status: 0,
    statusName: '正常'
  }

  mockBorrowLendList.push(newRecord)
  alert('保存成功')
  router.push('/borrowLend')
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.page-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
}

.form-container {
  max-width: 800px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}
</style>