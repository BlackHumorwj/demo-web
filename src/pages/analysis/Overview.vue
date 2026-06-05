<template>
  <div class="page-container">
    <div class="stats-row">
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-icon">📊</span>
          <div>
            <p class="stat-label">总收入趋势</p>
            <p class="stat-value">+15.3% vs 上月</p>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-icon">📈</span>
          <div>
            <p class="stat-label">利润增长</p>
            <p class="stat-value success">+23.8%</p>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-header">
          <span class="stat-icon">⏱️</span>
          <div>
            <p class="stat-label">平均审核时长</p>
            <p class="stat-value">2.5小时</p>
          </div>
        </div>
      </el-card>
    </div>

    <div class="charts-row">
      <el-card class="chart-card">
        <template #header>
          <span>收入支出对比</span>
        </template>
        <div class="pie-chart">
          <div class="pie">
            <div class="pie-slice income" :style="{ '--percent': incomePercent + '%' }"></div>
          </div>
          <div class="pie-legend">
            <div class="legend-item">
              <span class="legend-dot income"></span>
              <span>收入 ¥{{ totalIncome.toLocaleString() }}</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot expense"></span>
              <span>支出 ¥{{ totalExpense.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <span>月度趋势</span>
        </template>
        <div class="line-chart">
          <div class="chart-grid">
            <div
              v-for="item in reportData"
              :key="item.period"
              class="chart-bar-group"
            >
              <div class="bar-stack">
                <div class="bar income" :style="{ height: getBarHeight(item.revenue) + '%' }"></div>
                <div class="bar expense" :style="{ height: getBarHeight(item.expense) + '%' }"></div>
              </div>
              <span class="bar-label">{{ item.period.slice(5) }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <el-card class="table-card">
      <template #header>
        <span>类别分析</span>
      </template>
      <el-table :data="categoryAnalysis" border>
        <el-table-column prop="name" label="类别" />
        <el-table-column prop="type" label="类型" />
        <el-table-column label="金额" width="140">
          <template #default="scope">
            <span :class="scope.row.type === '收入' ? 'amount income' : 'amount expense'">
              ¥ {{ scope.row.amount.toLocaleString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="占比" width="100">
          <template #default="scope">
            <el-progress :percentage="scope.row.percentage" :show-text="false" />
          </template>
        </el-table-column>
        <el-table-column prop="percentageText" label="百分比" width="80" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockReportData, mockCategories } from '@/data/mockData'

const reportData = mockReportData

const totalIncome = computed(() => reportData.reduce((sum, item) => sum + item.revenue, 0))
const totalExpense = computed(() => reportData.reduce((sum, item) => sum + item.expense, 0))
const incomePercent = computed(() => (totalIncome.value / (totalIncome.value + totalExpense.value)) * 100)

const maxValue = computed(() => Math.max(...reportData.map(item => Math.max(item.revenue, item.expense))))

const getBarHeight = (value: number): number => (value / maxValue.value) * 100

const categoryAnalysis = computed(() => {
  const incomeCat = mockCategories.filter(c => c.type === 1)
  const expenseCat = mockCategories.filter(c => c.type === 2)
  
  const incomeTotal = totalIncome.value
  const expenseTotal = totalExpense.value
  
  return [
    ...incomeCat.map(cat => ({
      name: cat.name,
      type: '收入',
      amount: incomeTotal / incomeCat.length,
      percentage: 100 / incomeCat.length,
      percentageText: `${(100 / incomeCat.length).toFixed(1)}%`
    })),
    ...expenseCat.map(cat => ({
      name: cat.name,
      type: '支出',
      amount: expenseTotal / expenseCat.length,
      percentage: 100 / expenseCat.length,
      percentageText: `${(100 / expenseCat.length).toFixed(1)}%`
    }))
  ]
})
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  height: 100px;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 36px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.stat-value.success {
  color: #22c55e;
}

.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  min-height: 280px;
}

.pie-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding-top: 20px;
}

.pie {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(#22c55e var(--percent), #ef4444 0);
  position: relative;
}

.pie::before {
  content: '';
  position: absolute;
  inset: 20px;
  background: #fff;
  border-radius: 50%;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.income {
  background-color: #22c55e;
}

.legend-dot.expense {
  background-color: #ef4444;
}

.line-chart {
  padding-top: 20px;
}

.chart-grid {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 180px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 20px;
}

.bar-stack {
  display: flex;
  flex-direction: column-reverse;
  width: 30px;
  height: 100%;
  gap: 2px;
}

.bar {
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}

.bar.income {
  background-color: #22c55e;
}

.bar.expense {
  background-color: #ef4444;
}

.bar-label {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  margin-top: 8px;
}

.table-card {
  min-height: 300px;
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
</style>
