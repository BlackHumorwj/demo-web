<template>
  <div class="page-container">
    <el-card class="analysis-card">
      <template #header>
        <span>收入分析</span>
      </template>
      
      <div class="analysis-summary">
        <div class="summary-item">
          <p class="summary-label">总收入</p>
          <p class="summary-value">¥ {{ formatNumber(totalIncome) }}</p>
        </div>
        <div class="summary-item">
          <p class="summary-label">订单数量</p>
          <p class="summary-value">{{ orderCount }}</p>
        </div>
        <div class="summary-item">
          <p class="summary-label">平均订单金额</p>
          <p class="summary-value">¥ {{ formatNumber(avgOrderAmount) }}</p>
        </div>
      </div>

      <div class="chart-section">
        <h3>月度收入趋势</h3>
        <div class="bar-chart">
          <div
            v-for="item in reportData"
            :key="item.period"
            class="bar-item"
          >
            <div 
              class="bar income" 
              :style="{ height: getBarHeight(item.revenue) + '%' }"
            >
              <span class="bar-tooltip">¥ {{ item.revenue.toLocaleString() }}</span>
            </div>
            <span class="bar-label">{{ item.period.slice(5) }}月</span>
          </div>
        </div>
      </div>

      <div class="table-section">
        <h3>收入明细</h3>
        <el-table :data="incomeDetails" border>
          <el-table-column prop="date" label="日期" />
          <el-table-column prop="customer" label="客户" />
          <el-table-column prop="category" label="类别" />
          <el-table-column label="金额" width="140">
            <template #default="scope">
              <span class="amount">¥ {{ scope.row.amount.toLocaleString() }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockReportData, mockContacts, mockCategories } from '@/data/mockData'

const reportData = mockReportData

const totalIncome = computed(() => reportData.reduce((sum, item) => sum + item.revenue, 0))
const orderCount = 127
const avgOrderAmount = computed(() => totalIncome.value / orderCount)

const maxValue = computed(() => Math.max(...reportData.map(item => item.revenue)))
const getBarHeight = (value: number): number => (value / maxValue.value) * 100

const incomeDetails = computed(() => {
  const customers = mockContacts.filter(c => c.type === 1)
  const categories = mockCategories.filter(c => c.type === 1)
  
  return [
    { date: '2024-06-01', customer: customers[0].name, category: categories[0].name, amount: 15000, status: '已收款' },
    { date: '2024-06-02', customer: customers[1].name, category: categories[1].name, amount: 8000, status: '已收款' },
    { date: '2024-06-03', customer: customers[2].name, category: categories[0].name, amount: 12000, status: '待收款' },
    { date: '2024-06-04', customer: customers[0].name, category: categories[1].name, amount: 6500, status: '已收款' },
    { date: '2024-06-05', customer: customers[1].name, category: categories[0].name, amount: 9000, status: '已收款' },
  ]
})

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.analysis-card {
  min-height: 600px;
}

.analysis-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  color: #22c55e;
  margin: 0;
}

.chart-section {
  margin-bottom: 30px;
}

.chart-section h3 {
  font-size: 16px;
  color: #374151;
  margin: 0 0 20px 0;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 20px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar {
  width: 40px;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.3s;
}

.bar.income {
  background-color: #22c55e;
}

.bar-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1f2937;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
}

.bar:hover .bar-tooltip {
  opacity: 1;
}

.bar-label {
  font-size: 12px;
  color: #6b7280;
}

.table-section h3 {
  font-size: 16px;
  color: #374151;
  margin: 0 0 20px 0;
}

.amount {
  font-weight: 600;
  color: #22c55e;
}
</style>
