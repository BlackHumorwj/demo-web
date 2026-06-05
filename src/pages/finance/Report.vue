<template>
  <div class="page-container">
    <el-card class="report-card">
      <template #header>
        <span>财务报表</span>
      </template>
      <div class="report-summary">
        <div class="summary-item">
          <p class="summary-label">总收入</p>
          <p class="summary-value income">¥ {{ formatNumber(totalRevenue) }}</p>
        </div>
        <div class="summary-item">
          <p class="summary-label">总支出</p>
          <p class="summary-value expense">¥ {{ formatNumber(totalExpense) }}</p>
        </div>
        <div class="summary-item">
          <p class="summary-label">净利润</p>
          <p class="summary-value profit">¥ {{ formatNumber(totalProfit) }}</p>
        </div>
        <div class="summary-item">
          <p class="summary-label">利润率</p>
          <p class="summary-value">{{ avgProfitRate.toFixed(2) }}%</p>
        </div>
      </div>
      <div class="report-table">
        <el-table :data="reportData" border>
          <el-table-column prop="period" label="期间" />
          <el-table-column label="收入" width="140">
            <template #default="scope">
              <span class="amount income">¥ {{ scope.row.revenue.toLocaleString() }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支出" width="140">
            <template #default="scope">
              <span class="amount expense">¥ {{ scope.row.expense.toLocaleString() }}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润" width="140">
            <template #default="scope">
              <span :class="['amount', scope.row.profit >= 0 ? 'profit' : 'loss']">
                {{ scope.row.profit >= 0 ? '+' : '' }}¥ {{ scope.row.profit.toLocaleString() }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="利润率" width="100">
            <template #default="scope">
              <span>{{ scope.row.profitRate.toFixed(2) }}%</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockReportData } from '@/data/mockData'

const reportData = mockReportData

const totalRevenue = computed(() => reportData.reduce((sum, item) => sum + item.revenue, 0))
const totalExpense = computed(() => reportData.reduce((sum, item) => sum + item.expense, 0))
const totalProfit = computed(() => totalRevenue.value - totalExpense.value)
const avgProfitRate = computed(() => {
  const rates = reportData.map(item => item.profitRate)
  return rates.reduce((sum, rate) => sum + rate, 0) / rates.length
})

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.report-card {
  min-height: 500px;
}

.report-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.summary-item {
  text-align: center;
}

.summary-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.summary-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.summary-value.income {
  color: #22c55e;
}

.summary-value.expense {
  color: #ef4444;
}

.summary-value.profit {
  color: #3b82f6;
}

.report-table {
  padding-top: 20px;
}

.amount {
  font-weight: 600;
}

.amount.income {
  color: #22c55e;
}

.amount.expense {
  color: #ef4444;
}

.amount.profit {
  color: #22c55e;
}

.amount.loss {
  color: #ef4444;
}
</style>
