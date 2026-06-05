<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-select v-model="searchForm.year" placeholder="年份" class="search-select">
          <el-option v-for="year in years" :key="year" :label="year + '年'" :value="year" />
        </el-select>
        <el-select v-model="searchForm.month" placeholder="月份" class="search-select">
          <el-option v-for="month in months" :key="month" :label="month + '月'" :value="month" />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="状态" class="search-select">
          <el-option label="全部" value="" />
          <el-option label="未计提" :value="0" />
          <el-option label="已计提" :value="1" />
        </el-select>
        <el-button @click="handleSearch" class="search-btn">搜索</el-button>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleBatchDepreciate">批量计提折旧</el-button>
      </div>
    </div>

    <div class="page-card">
      <div class="depreciation-summary">
        <div class="summary-card">
          <div class="summary-label">本期应计提折旧</div>
          <div class="summary-value">{{ formatAmount(totalDepreciation) }}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">已计提资产数</div>
          <div class="summary-value">{{ depreciatedCount }} 项</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">未计提资产数</div>
          <div class="summary-value">{{ notDepreciatedCount }} 项</div>
        </div>
      </div>

      <el-table :data="filteredAssets" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="assetNo" label="资产编号" width="140" />
        <el-table-column prop="assetName" label="资产名称" />
        <el-table-column prop="categoryName" label="资产类别" width="120" />
        <el-table-column prop="originalValue" label="原值" width="120">
          <template #default="scope">
            {{ formatAmount(scope.row.originalValue) }}
          </template>
        </el-table-column>
        <el-table-column prop="monthlyDepreciation" label="月折旧额" width="120">
          <template #default="scope">
            {{ formatAmount(scope.row.monthlyDepreciation) }}
          </template>
        </el-table-column>
        <el-table-column prop="accumulatedDepreciation" label="累计折旧" width="120">
          <template #default="scope">
            {{ formatAmount(scope.row.accumulatedDepreciation) }}
          </template>
        </el-table-column>
        <el-table-column prop="netValue" label="净值" width="120">
          <template #default="scope">
            {{ formatAmount(scope.row.netValue) }}
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="启用日期" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'warning'">
              {{ scope.row.status === 0 ? '在用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="depreciationStatus" label="计提状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.depreciationStatus === 1 ? 'success' : 'info'">
              {{ scope.row.depreciationStatus === 1 ? '已计提' : '未计提' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleDepreciate(scope.row)"
              :disabled="scope.row.depreciationStatus === 1 || scope.row.status !== 0"
            >
              计提
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="filteredAssets.length"
          layout="total, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockFixedAssets } from '@/data/mockData'

const years = [2024, 2025, 2026]
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const now = new Date()
const currentYear = now.getFullYear()
const currentMonth = now.getMonth() + 1

const searchForm = ref({
  year: currentYear,
  month: currentMonth,
  status: ''
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

const depreciationRecords = ref<Record<string, string[]>>({})

const assetsWithDepreciation = computed(() => {
  return mockFixedAssets.map(asset => {
    const key = `${searchForm.value.year}-${String(searchForm.value.month).padStart(2, '0')}`
    const assetKey = `${asset.assetId}-${key}`
    const hasDepreciation = depreciationRecords.value[assetKey] !== undefined
    return {
      ...asset,
      depreciationStatus: hasDepreciation ? 1 : 0
    }
  })
})

const filteredAssets = computed(() => {
  let result = [...assetsWithDepreciation.value]
  
  if (searchForm.value.status !== '') {
    result = result.filter(item => item.depreciationStatus === Number(searchForm.value.status))
  }
  
  result = result.filter(item => item.status === 0 || item.status === 1)
  
  return result
})

const totalDepreciation = computed(() => {
  return filteredAssets.value
    .filter(item => item.depreciationStatus === 0 && item.status === 0)
    .reduce((sum, item) => sum + item.monthlyDepreciation, 0)
})

const depreciatedCount = computed(() => {
  return filteredAssets.value.filter(item => item.depreciationStatus === 1).length
})

const notDepreciatedCount = computed(() => {
  return filteredAssets.value.filter(item => item.depreciationStatus === 0 && item.status === 0).length
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const handleSearch = () => {
  pagination.value.currentPage = 1
}

const handleDepreciate = (asset: any) => {
  if (asset.depreciationStatus === 1) {
    alert('该资产本月已计提折旧')
    return
  }
  
  if (asset.status !== 0) {
    alert('只有在用状态的资产才能计提折旧')
    return
  }
  
  const key = `${searchForm.value.year}-${String(searchForm.value.month).padStart(2, '0')}`
  const assetKey = `${asset.assetId}-${key}`
  
  depreciationRecords.value[assetKey] = ['depreciated']
  
  const assetIndex = mockFixedAssets.findIndex(a => a.assetId === asset.assetId)
  if (assetIndex !== -1) {
    mockFixedAssets[assetIndex].accumulatedDepreciation += asset.monthlyDepreciation
    mockFixedAssets[assetIndex].netValue -= asset.monthlyDepreciation
  }
  
  alert('计提成功')
}

const handleBatchDepreciate = () => {
  const toDepreciate = filteredAssets.value.filter(
    item => item.depreciationStatus === 0 && item.status === 0
  )
  
  if (toDepreciate.length === 0) {
    alert('没有需要计提折旧的资产')
    return
  }
  
  if (confirm(`确定要对 ${toDepreciate.length} 项资产进行批量计提吗？`)) {
    const key = `${searchForm.value.year}-${String(searchForm.value.month).padStart(2, '0')}`
    
    toDepreciate.forEach(asset => {
      const assetKey = `${asset.assetId}-${key}`
      depreciationRecords.value[assetKey] = ['depreciated']
      
      const assetIndex = mockFixedAssets.findIndex(a => a.assetId === asset.assetId)
      if (assetIndex !== -1) {
        mockFixedAssets[assetIndex].accumulatedDepreciation += asset.monthlyDepreciation
        mockFixedAssets[assetIndex].netValue -= asset.monthlyDepreciation
      }
    })
    
    alert(`成功计提 ${toDepreciate.length} 项资产`)
  }
}

onMounted(() => {})
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

.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-select {
  width: 120px;
}

.search-btn {
  padding: 0 24px;
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

.depreciation-summary {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.summary-card {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  padding: 20px;
  color: #fff;
  text-align: center;
}

.summary-label {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 24px;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>