<template>
  <div class="page-container">
    <div class="page-header">
      <h2>按部门汇总</h2>
      <div class="header-actions">
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="page-card">
      <div class="chart-section">
        <el-chart :option="chartOption" class="chart" />
      </div>

      <el-table :data="deptSummary" border>
        <el-table-column prop="deptName" label="使用部门" />
        <el-table-column prop="assetCount" label="资产数量" width="100" />
        <el-table-column prop="originalValue" label="原值" width="140">
          <template #default="scope">
            {{ formatAmount(scope.row.originalValue) }}
          </template>
        </el-table-column>
        <el-table-column prop="accumulatedDepreciation" label="累计折旧" width="140">
          <template #default="scope">
            {{ formatAmount(scope.row.accumulatedDepreciation) }}
          </template>
        </el-table-column>
        <el-table-column prop="netValue" label="净值" width="140">
          <template #default="scope">
            {{ formatAmount(scope.row.netValue) }}
          </template>
        </el-table-column>
        <el-table-column prop="percentage" label="占比" width="100">
          <template #default="scope">
            {{ scope.row.percentage }}%
          </template>
        </el-table-column>
      </el-table>

      <div class="total-summary">
        <div class="total-item">
          <span class="total-label">资产总计</span>
          <span class="total-value">{{ totalCount }} 项</span>
        </div>
        <div class="total-item">
          <span class="total-label">原值合计</span>
          <span class="total-value">{{ formatAmount(totalOriginalValue) }}</span>
        </div>
        <div class="total-item">
          <span class="total-label">累计折旧合计</span>
          <span class="total-value">{{ formatAmount(totalAccumulatedDepreciation) }}</span>
        </div>
        <div class="total-item">
          <span class="total-label">净值合计</span>
          <span class="total-value">{{ formatAmount(totalNetValue) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockFixedAssets, mockDepartments } from '@/data/mockData'

interface DeptSummaryItem {
  deptId: string
  deptName: string
  assetCount: number
  originalValue: number
  accumulatedDepreciation: number
  netValue: number
}

const deptSummary = computed(() => {
  const summary: Record<string, DeptSummaryItem> = {}
  
  mockFixedAssets.forEach(asset => {
    const key = asset.deptId || 'unknown'
    if (!summary[key]) {
      const dept = mockDepartments.find(d => d.id === key)
      summary[key] = {
        deptId: key,
        deptName: dept?.name || '未分配',
        assetCount: 0,
        originalValue: 0,
        accumulatedDepreciation: 0,
        netValue: 0
      }
    }
    summary[key].assetCount++
    summary[key].originalValue += asset.originalValue
    summary[key].accumulatedDepreciation += asset.accumulatedDepreciation
    summary[key].netValue += asset.netValue
  })
  
  const total = Object.values(summary).reduce((acc, item) => ({
    originalValue: acc.originalValue + item.originalValue
  }), { originalValue: 0 })
  
  return Object.values(summary).map(item => ({
    ...item,
    percentage: total.originalValue > 0 ? ((item.originalValue / total.originalValue) * 100).toFixed(2) : '0.00'
  }))
})

const totalCount = computed(() => {
  return deptSummary.value.reduce((sum, item: any) => sum + item.assetCount, 0)
})

const totalOriginalValue = computed(() => {
  return deptSummary.value.reduce((sum, item: any) => sum + item.originalValue, 0)
})

const totalAccumulatedDepreciation = computed(() => {
  return deptSummary.value.reduce((sum, item: any) => sum + item.accumulatedDepreciation, 0)
})

const totalNetValue = computed(() => {
  return deptSummary.value.reduce((sum, item: any) => sum + item.netValue, 0)
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const chartOption = computed(() => {
  const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4']
  
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: deptSummary.value.map((item: any) => item.deptName),
      axisLabel: {
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => value.toLocaleString()
      }
    },
    series: [
      {
        name: '原值',
        type: 'bar',
        data: deptSummary.value.map((item: any) => item.originalValue),
        itemStyle: {
          color: colors[0]
        }
      },
      {
        name: '累计折旧',
        type: 'bar',
        data: deptSummary.value.map((item: any) => item.accumulatedDepreciation),
        itemStyle: {
          color: colors[1]
        }
      },
      {
        name: '净值',
        type: 'bar',
        data: deptSummary.value.map((item: any) => item.netValue),
        itemStyle: {
          color: colors[2]
        }
      }
    ]
  }
})

const handleExport = () => {
  alert('导出功能开发中')
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.page-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
}

.chart-section {
  margin-bottom: 20px;
}

.chart {
  height: 350px;
}

.total-summary {
  display: flex;
  gap: 40px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeeef;
}

.total-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.total-label {
  font-size: 14px;
  color: #909399;
}

.total-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}
</style>