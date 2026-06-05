<template>
  <div class="page-container">
    <div class="page-header">
      <h2>工资计提详情</h2>
      <div class="header-buttons">
        <el-button @click="handleBack">返回列表</el-button>
        <el-button v-if="accruedData?.docStatus === 0" type="primary" @click="handleEdit">编辑</el-button>
      </div>
    </div>
    
    <el-card v-if="accruedData" class="page-card">
      <div class="detail-section">
        <div class="detail-row">
          <div class="detail-item">
            <span class="label">单据编号：</span>
            <span class="value">{{ accruedData.bizDocNo }}</span>
          </div>
          <div class="detail-item">
            <span class="label">工资期间：</span>
            <span class="value">{{ accruedData.salaryPeriod }}</span>
          </div>
          <div class="detail-item">
            <span class="label">计提日期：</span>
            <span class="value">{{ accruedData.tradeTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">状态：</span>
            <el-tag :type="getStatusType(accruedData.docStatus)">{{ accruedData.docStatusName }}</el-tag>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-item">
            <span class="label">制单人：</span>
            <span class="value">{{ accruedData.writerName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">制单时间：</span>
            <span class="value">{{ accruedData.writerTime }}</span>
          </div>
        </div>
        
        <div class="detail-row remark-row">
          <span class="label">备注：</span>
          <span class="value">{{ accruedData.remark || '-' }}</span>
        </div>
      </div>
      
      <div class="detail-section">
        <h3>工资汇总</h3>
        <div class="summary-grid">
          <div class="summary-card">
            <span class="summary-label">应发合计</span>
            <span class="summary-value">¥ {{ formatAmount(accruedData.grossAmount) }}</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">个税合计</span>
            <span class="summary-value">¥ {{ formatAmount(accruedData.taxAmount) }}</span>
          </div>
          <div class="summary-card">
            <span class="summary-label">社保公积金</span>
            <span class="summary-value">¥ {{ formatAmount(accruedData.otherAmount) }}</span>
          </div>
          <div class="summary-card total">
            <span class="summary-label">实发合计</span>
            <span class="summary-value">¥ {{ formatAmount(accruedData.amount) }}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h3>员工工资明细</h3>
        <el-table :data="accruedData.items" border>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="staffName" label="员工" width="120" />
          <el-table-column prop="deptName" label="部门" width="100" />
          <el-table-column prop="categoryName" label="费用类别" width="150" />
          <el-table-column label="基本工资" width="100">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.baseSalary) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="岗位津贴" width="100">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.positionAllowance) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="绩效奖金" width="100">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.performanceBonus) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="应发合计" width="100">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.grossAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="社保代扣" width="100">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.socialSecurity) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="公积金代扣" width="100">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.housingFund) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="个税代扣" width="100">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.personalTax) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="代扣合计" width="100">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.deductionTotal) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="实发金额" width="100">
            <template #default="scope">
              <span class="text-success">{{ formatAmount(scope.row.netAmount) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      
      <div v-if="accruedData.voucher" class="detail-section">
        <h3>凭证信息</h3>
        <div class="voucher-info">
          <div class="voucher-item">
            <span class="label">凭证编号：</span>
            <span class="value">{{ accruedData.voucher.voucherCode }}</span>
          </div>
          <div class="voucher-item">
            <span class="label">凭证日期：</span>
            <span class="value">{{ accruedData.voucher.voucherDate }}</span>
          </div>
          <div class="voucher-item">
            <span class="label">凭证金额：</span>
            <span class="value">¥ {{ formatAmount(accruedData.voucher.amount) }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockSalaryAccruedList } from '@/data/mockData'
import type { SalaryAccrued } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const accruedData = ref<SalaryAccrued | null>(null)

const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return typeMap[status] || 'info'
}

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleBack = () => {
  router.push('/salary/accrued')
}

const handleEdit = () => {
  router.push(`/salary/accrued/edit/${accruedData.value?.bizDocId}`)
}

onMounted(() => {
  const id = parseInt(route.params.id as string)
  accruedData.value = mockSalaryAccruedList.find(item => item.bizDocId === id) || null
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

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-item .label {
  color: #666;
  font-size: 14px;
  min-width: 80px;
}

.detail-item .value {
  font-weight: 500;
  font-size: 14px;
}

.remark-row {
  flex-direction: column;
  align-items: flex-start;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.summary-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.summary-card.total {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
}

.summary-card.total .summary-label,
.summary-card.total .summary-value {
  color: #fff;
}

.summary-label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.text-success {
  color: #22c55e;
  font-weight: 600;
}

.voucher-info {
  display: flex;
  gap: 24px;
}

.voucher-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.voucher-item .label {
  color: #666;
  font-size: 14px;
}

.voucher-item .value {
  font-weight: 500;
}
</style>