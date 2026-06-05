<template>
  <div class="dashboard">
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <span class="stat-icon income">📈</span>
          <div class="stat-info">
            <p class="stat-label">本月收入</p>
            <p class="stat-value">¥ {{ formatNumber(totalIncome) }}</p>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <span class="stat-icon expense">📉</span>
          <div class="stat-info">
            <p class="stat-label">本月支出</p>
            <p class="stat-value expense">¥ {{ formatNumber(totalExpense) }}</p>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <span class="stat-icon profit">💰</span>
          <div class="stat-info">
            <p class="stat-label">本月利润</p>
            <p class="stat-value">¥ {{ formatNumber(totalProfit) }}</p>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <span class="stat-icon balance">💳</span>
          <div class="stat-info">
            <p class="stat-label">账户余额</p>
            <p class="stat-value">¥ {{ formatNumber(accountBalance) }}</p>
          </div>
        </div>
      </el-card>
    </div>

    <div class="dashboard-row">
      <el-card class="chart-card">
        <template #header>
          <span>收支趋势</span>
        </template>
        <div class="chart-container">
          <div class="bar-chart">
            <div
              v-for="item in reportData"
              :key="item.period"
              class="bar-group"
            >
              <div class="bar income-bar" :style="{ height: getBarHeight(item.revenue) + '%' }">
                <span class="bar-value">{{ (item.revenue / 1000).toFixed(0) }}k</span>
              </div>
              <div class="bar expense-bar" :style="{ height: getBarHeight(item.expense) + '%' }">
                <span class="bar-value">{{ (item.expense / 1000).toFixed(0) }}k</span>
              </div>
              <span class="bar-label">{{ item.period.slice(5) }}月</span>
            </div>
          </div>
          <div class="chart-legend">
            <span><span class="legend-dot income"></span> 收入</span>
            <span><span class="legend-dot expense"></span> 支出</span>
          </div>
        </div>
      </el-card>

      <el-card class="list-card">
        <template #header>
          <span>最近业务</span>
        </template>
        <el-table :data="recentBusiness" border :show-header="false">
          <el-table-column>
            <template #default="scope">
              <div class="business-item">
                <span class="business-type" :class="scope.row.type">{{ scope.row.typeName }}</span>
                <span class="business-desc">{{ scope.row.abstract || scope.row.contactName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #default="scope">
              <span class="business-amount" :class="scope.row.type === 'income' ? 'income' : 'expense'">
                {{ scope.row.type === 'income' ? '+' : '-' }}¥{{ scope.row.amount.toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column width="80">
            <template #default="scope">
              <el-tag :type="scope.row.status === 2 ? 'success' : 'warning'">
                {{ scope.row.statusText }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockReportData, mockAccounts, mockBusinessDocs } from '@/data/mockData'

const reportData = mockReportData

const totalIncome = computed(() => {
  const latest = reportData[reportData.length - 1]
  return latest?.revenue || 0
})

const totalExpense = computed(() => {
  const latest = reportData[reportData.length - 1]
  return latest?.expense || 0
})

const totalProfit = computed(() => totalIncome.value - totalExpense.value)

const accountBalance = computed(() => {
  return mockAccounts.reduce((sum, acc) => sum + acc.balance, 0)
})

const recentBusiness = computed(() => {
  const docs = mockBusinessDocs.slice(0, 5)
  return docs.map(doc => ({
    ...doc,
    abstract: doc.type === 'income' ? '销售业务' : doc.type === 'expense' ? '费用报销' : ''
  }))
})

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const maxValue = computed(() => {
  return Math.max(...reportData.map(item => Math.max(item.revenue, item.expense)))
})

const getBarHeight = (value: number): number => {
  return (value / maxValue.value) * 100
}
</script>

<style scoped>
.dashboard {
  padding: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  height: 120px;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 40px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-icon.income {
  background-color: #dcfce7;
}

.stat-icon.expense {
  background-color: #fee2e2;
}

.stat-icon.profit {
  background-color: #fef3c7;
}

.stat-icon.balance {
  background-color: #dbeafe;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.stat-value.expense {
  color: #ef4444;
}

.dashboard-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-card {
  min-height: 300px;
}

.chart-container {
  padding-top: 20px;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e5e7eb;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar {
  width: 30px;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.3s;
}

.income-bar {
  background-color: #22c55e;
}

.expense-bar {
  background-color: #ef4444;
}

.bar-value {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #6b7280;
  white-space: nowrap;
}

.bar-label {
  font-size: 12px;
  color: #6b7280;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
}

.legend-dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
}

.legend-dot.income {
  background-color: #22c55e;
}

.legend-dot.expense {
  background-color: #ef4444;
}

.business-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.business-type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}

.business-type.income {
  background-color: #dcfce7;
  color: #16a34a;
}

.business-type.expense {
  background-color: #fee2e2;
  color: #dc2626;
}

.business-type.receipt {
  background-color: #dbeafe;
  color: #2563eb;
}

.business-type.payment {
  background-color: #fef3c7;
  color: #d97706;
}

.business-desc {
  font-size: 14px;
  color: #374151;
}

.business-amount {
  font-size: 14px;
  font-weight: 600;
}

.business-amount.income {
  color: #22c55e;
}

.business-amount.expense {
  color: #ef4444;
}
</style>
