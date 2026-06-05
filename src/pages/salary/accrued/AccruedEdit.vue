<template>
  <div class="page-container">
    <div class="page-header">
      <h2>编辑工资计提</h2>
      <div class="header-buttons">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </div>
    
    <el-card v-if="accruedData" class="page-card">
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
              <el-form-item label="计提日期" required>
                <el-date-picker
                  v-model="formData.tradeTime"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  placeholder="选择计提日期"
                />
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
          <h3>员工工资明细</h3>
          <el-button type="primary" size="small" @click="handleAddItem">添加员工</el-button>
        </div>
        
        <el-table :data="formData.items" border>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column label="员工" width="120">
            <template #default="scope">
              <el-select
                v-model="scope.row.staffId"
                placeholder="选择员工"
                @change="handleStaffChange(scope.row)"
              >
                <el-option v-for="staff in staffOptions" :key="staff.id" :label="staff.name" :value="staff.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="deptName" label="部门" width="100" />
          <el-table-column label="费用类别" width="150">
            <template #default="scope">
              <el-select
                v-model="scope.row.categoryId"
                placeholder="选择费用类别"
              >
                <el-option v-for="cat in categoryOptions" :key="cat.id" :label="cat.name" :value="cat.id" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="基本工资" width="100">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.baseSalary"
                type="number"
                placeholder="0.00"
                @input="calculateRow(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="岗位津贴" width="100">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.positionAllowance"
                type="number"
                placeholder="0.00"
                @input="calculateRow(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="绩效奖金" width="100">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.performanceBonus"
                type="number"
                placeholder="0.00"
                @input="calculateRow(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="其他补贴" width="100">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.otherSubsidy"
                type="number"
                placeholder="0.00"
                @input="calculateRow(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="应发合计" width="100">
            <template #default="scope">
              <span class="amount">{{ formatAmount(scope.row.grossAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="社保代扣" width="100">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.socialSecurity"
                type="number"
                placeholder="0.00"
                @input="calculateRow(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="公积金代扣" width="100">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.housingFund"
                type="number"
                placeholder="0.00"
                @input="calculateRow(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="个税代扣" width="100">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.personalTax"
                type="number"
                placeholder="0.00"
                @input="calculateRow(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="其他代扣" width="100">
            <template #default="scope">
              <el-input
                v-model.number="scope.row.otherDeduction"
                type="number"
                placeholder="0.00"
                @input="calculateRow(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="代扣合计" width="100">
            <template #default="scope">
              <span class="amount">{{ formatAmount(scope.row.deductionTotal) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实发金额" width="100">
            <template #default="scope">
              <span class="amount text-success">{{ formatAmount(scope.row.netAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="scope">
              <el-button type="text" size="small" style="color: #ef4444" @click="handleDeleteItem(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="summary-row">
          <div class="summary-item">
            <span class="label">应发合计：</span>
            <span class="value">¥ {{ formatAmount(totalGrossAmount) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">个税合计：</span>
            <span class="value">¥ {{ formatAmount(totalTaxAmount) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">社保公积金合计：</span>
            <span class="value">¥ {{ formatAmount(totalOtherAmount) }}</span>
          </div>
          <div class="summary-item total">
            <span class="label">实发合计：</span>
            <span class="value">¥ {{ formatAmount(totalAmount) }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockSalaryAccruedList } from '@/data/mockData'
import type { SalaryAccrued, SalaryAccruedDetail } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const staffOptions = [
  { id: 2001, name: '李四', deptId: 101, deptName: '销售部' },
  { id: 2002, name: '王五', deptId: 102, deptName: '技术部' },
  { id: 2003, name: '赵六', deptId: 101, deptName: '销售部' },
  { id: 2004, name: '钱七', deptId: 102, deptName: '技术部' }
]

const categoryOptions = [
  { id: 1001, name: '销售费用-工资' },
  { id: 1002, name: '管理费用-工资' },
  { id: 1003, name: '生产成本-工资' },
  { id: 1004, name: '制造费用-工资' }
]

const accruedData = ref<SalaryAccrued | null>(null)

const formData = ref({
  salaryPeriod: '',
  tradeTime: '',
  remark: '',
  items: [] as SalaryAccruedDetail[]
})

const totalGrossAmount = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + (item.grossAmount || 0), 0)
})

const totalTaxAmount = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + (item.personalTax || 0), 0)
})

const totalOtherAmount = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + (item.socialSecurity || 0) + (item.housingFund || 0), 0)
})

const totalAmount = computed(() => {
  return formData.value.items.reduce((sum, item) => sum + (item.netAmount || 0), 0)
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const calculateRow = (row: SalaryAccruedDetail) => {
  row.grossAmount = (row.baseSalary || 0) + (row.positionAllowance || 0) + (row.performanceBonus || 0) + (row.otherSubsidy || 0)
  row.deductionTotal = (row.socialSecurity || 0) + (row.housingFund || 0) + (row.personalTax || 0) + (row.otherDeduction || 0)
  row.netAmount = row.grossAmount - row.deductionTotal
}

const handleStaffChange = (row: SalaryAccruedDetail) => {
  const staff = staffOptions.find(s => s.id === row.staffId)
  if (staff) {
    row.staffName = staff.name
    row.deptId = staff.deptId
    row.deptName = staff.deptName
  }
}

const handleAddItem = () => {
  const newItem: SalaryAccruedDetail = {
    itemId: Date.now(),
    staffId: 0,
    staffName: '',
    deptId: 0,
    deptName: '',
    categoryId: 0,
    categoryName: '',
    baseSalary: 0,
    positionAllowance: 0,
    performanceBonus: 0,
    otherSubsidy: 0,
    grossAmount: 0,
    socialSecurity: 0,
    housingFund: 0,
    personalTax: 0,
    otherDeduction: 0,
    deductionTotal: 0,
    netAmount: 0,
    remark: ''
  }
  formData.value.items.push(newItem)
}

const handleDeleteItem = (index: number) => {
  formData.value.items.splice(index, 1)
}

const handleSave = () => {
  if (!formData.value.salaryPeriod) {
    alert('请选择工资期间')
    return
  }
  if (!formData.value.tradeTime) {
    alert('请选择计提日期')
    return
  }
  if (formData.value.items.length === 0) {
    alert('请添加至少一条员工明细')
    return
  }
  for (const item of formData.value.items) {
    if (!item.staffId) {
      alert('请选择员工')
      return
    }
    if (!item.categoryId) {
      alert('请选择费用类别')
      return
    }
    if (!item.baseSalary || item.baseSalary <= 0) {
      alert('基本工资必须大于0')
      return
    }
  }
  
  if (accruedData.value) {
    accruedData.value.salaryPeriod = formData.value.salaryPeriod
    accruedData.value.tradeTime = formData.value.tradeTime
    accruedData.value.remark = formData.value.remark
    accruedData.value.items = formData.value.items
    accruedData.value.grossAmount = totalGrossAmount.value
    accruedData.value.taxAmount = totalTaxAmount.value
    accruedData.value.otherAmount = totalOtherAmount.value
    accruedData.value.amount = totalAmount.value
  }
  
  alert('保存成功')
  router.push('/salary/accrued')
}

const handleCancel = () => {
  router.push('/salary/accrued')
}

onMounted(() => {
  const id = parseInt(route.params.id as string)
  accruedData.value = mockSalaryAccruedList.find(item => item.bizDocId === id) || null
  
  if (accruedData.value) {
    formData.value = {
      salaryPeriod: accruedData.value.salaryPeriod,
      tradeTime: accruedData.value.tradeTime,
      remark: accruedData.value.remark,
      items: JSON.parse(JSON.stringify(accruedData.value.items))
    }
  }
})
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

.amount {
  font-weight: 600;
  color: #333;
}

.text-success {
  color: #22c55e;
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
  font-size: 16px;
  color: #333;
}

.summary-item.total .value {
  color: #3b82f6;
  font-size: 18px;
}
</style>