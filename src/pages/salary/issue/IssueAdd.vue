<template>
  <div class="page-container">
    <div class="page-header">
      <h2>新增工资发放</h2>
      <div class="header-buttons">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
    
    <el-card class="page-card">
      <div class="form-section">
        <h3>基本信息</h3>
        <el-form :model="formData" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工资期间" required>
                <el-date-picker
                  v-model="formData.salaryPeriod"
                  type="month"
                  format="YYYY-MM"
                  value-format="YYYY-MM"
                  placeholder="选择工资期间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发放日期" required>
                <el-date-picker
                  v-model="formData.tradeTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择发放日期"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="关联计提单" required>
                <el-select
                  v-model="formData.accruedId"
                  placeholder="选择计提单"
                  @change="handleAccruedChange"
                >
                  <el-option v-for="accrued in accruedOptions" :key="accrued.bizDocId" :label="accrued.bizDocNo" :value="accrued.bizDocId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="发放账户" required>
                <el-select
                  v-model="formData.accountId"
                  placeholder="选择账户"
                >
                  <el-option v-for="account in accountOptions" :key="account.id" :label="account.name" :value="account.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remark"
                  type="textarea"
                  placeholder="请输入备注信息"
                  :rows="2"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      
      <div class="form-section">
        <div class="section-header">
          <h3>员工发放明细</h3>
        </div>
        
        <el-table :data="formData.items" border>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="staffName" label="员工" width="120" />
          <el-table-column prop="deptName" label="部门" width="100" />
          <el-table-column label="计提金额" width="120">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.accruedAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发放金额" width="120">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.netAmount"
                type="number"
                placeholder="0.00"
              />
            </template>
          </el-table-column>
          <el-table-column label="备注" width="150">
            <template #default="scope">
              <el-input
                v-model="scope.row.remark"
                placeholder="请输入备注"
              />
            </template>
          </el-table-column>
        </el-table>
        
        <div class="summary-row">
          <div class="summary-item">
            <span class="label">发放合计：</span>
            <span class="value">¥ {{ formatAmount(totalAmount) }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockSalaryAccruedList, mockAccounts } from '@/data/mockData'
import type { SalaryIssueDetail } from '@/data/mockData'

const router = useRouter()

const accountOptions = mockAccounts.map(account => ({
  id: parseInt(account.id),
  name: account.name
}))

const accruedOptions = computed(() => {
  return mockSalaryAccruedList
    .filter(item => item.docStatus === 1)
    .map(item => ({
      bizDocId: item.bizDocId,
      bizDocNo: item.bizDocNo
    }))
})

const formData = ref({
  salaryPeriod: '',
  tradeTime: '',
  accruedId: 0,
  accountId: 0,
  remark: '',
  items: [] as SalaryIssueDetail[]
})

const totalAmount = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + (item.netAmount || 0), 0)
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleAccruedChange = () => {
  if (formData.value.accruedId) {
    const accrued = mockSalaryAccruedList.find(item => item.bizDocId === formData.value.accruedId)
    if (accrued) {
      formData.value.salaryPeriod = accrued.salaryPeriod
      formData.value.items = accrued.items.map(item => ({
        itemId: Date.now() + Math.random(),
        staffId: item.staffId,
        staffName: item.staffName,
        deptId: item.deptId,
        deptName: item.deptName,
        netAmount: item.netAmount,
        accruedAmount: item.netAmount,
        remark: ''
      }))
    }
  }
}

const handleSave = () => {
  if (!formData.value.salaryPeriod) {
    alert('请选择工资期间')
    return
  }
  if (!formData.value.tradeTime) {
    alert('请选择发放日期')
    return
  }
  if (!formData.value.accruedId) {
    alert('请选择关联计提单')
    return
  }
  if (!formData.value.accountId) {
    alert('请选择发放账户')
    return
  }
  
  alert('保存成功')
  router.push('/salary/issue')
}

const handleCancel = () => {
  router.push('/salary/issue')
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.page-card {
  min-height: 400px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.summary-row {
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-item .label {
  color: #666;
  font-size: 14px;
}

.summary-item .value {
  font-weight: 600;
  font-size: 18px;
  color: #3b82f6;
}
</style>