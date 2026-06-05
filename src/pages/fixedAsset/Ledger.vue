<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-select v-model="searchForm.categoryId" placeholder="资产类别" class="search-select">
          <el-option label="全部" value="" />
          <el-option
            v-for="cat in mockAssetCategories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="状态" class="search-select">
          <el-option label="全部" value="" />
          <el-option label="在用" :value="0" />
          <el-option label="停用" :value="1" />
          <el-option label="已处置" :value="2" />
        </el-select>
        <el-button @click="handleSearch" class="search-btn">搜索</el-button>
      </div>
      <div class="header-actions">
        <el-button @click="handleExport">导出</el-button>
      </div>
    </div>

    <div class="page-card">
      <div class="report-summary">
        <div class="summary-item">
          <span class="summary-label">资产总数</span>
          <span class="summary-value">{{ filteredAssets.length }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">原值合计</span>
          <span class="summary-value">{{ formatAmount(totalOriginalValue) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">累计折旧</span>
          <span class="summary-value">{{ formatAmount(totalAccumulatedDepreciation) }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">净值合计</span>
          <span class="summary-value">{{ formatAmount(totalNetValue) }}</span>
        </div>
      </div>

      <el-table :data="filteredAssets" border>
        <el-table-column prop="assetNo" label="资产编号" width="140" />
        <el-table-column prop="assetName" label="资产名称" />
        <el-table-column prop="categoryName" label="资产类别" width="120" />
        <el-table-column prop="specModel" label="规格型号" width="120" />
        <el-table-column prop="originalValue" label="原值" width="120">
          <template #default="scope">
            {{ formatAmount(scope.row.originalValue) }}
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
        <el-table-column prop="deptName" label="使用部门" width="100" />
        <el-table-column prop="staffName" label="使用人" width="100" />
        <el-table-column prop="purchaseDate" label="购置日期" width="100" />
        <el-table-column prop="startDate" label="启用日期" width="100" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
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
import { ref, computed } from 'vue'
import { mockFixedAssets, mockAssetCategories } from '@/data/mockData'

const searchForm = ref({
  categoryId: '',
  status: ''
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

const filteredAssets = computed(() => {
  let result = [...mockFixedAssets]
  
  if (searchForm.value.categoryId) {
    result = result.filter(item => item.categoryId === searchForm.value.categoryId)
  }
  
  if (searchForm.value.status !== '') {
    result = result.filter(item => item.status === Number(searchForm.value.status))
  }
  
  return result
})

const totalOriginalValue = computed(() => {
  return filteredAssets.value.reduce((sum, item) => sum + item.originalValue, 0)
})

const totalAccumulatedDepreciation = computed(() => {
  return filteredAssets.value.reduce((sum, item) => sum + item.accumulatedDepreciation, 0)
})

const totalNetValue = computed(() => {
  return filteredAssets.value.reduce((sum, item) => sum + item.netValue, 0)
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const getStatusName = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '在用',
    1: '停用',
    2: '已处置'
  }
  return statusMap[status] || '未知'
}

const getStatusTagType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'success',
    1: 'warning',
    2: 'danger'
  }
  return typeMap[status] || 'info'
}

const handleSearch = () => {
  pagination.value.currentPage = 1
}

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

.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-select {
  width: 150px;
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

.report-summary {
  display: flex;
  gap: 30px;
  margin-bottom: 20px;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.summary-item {
  display: flex;
  flex-direction: column;
}

.summary-label {
  font-size: 13px;
  color: #909399;
}

.summary-value {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>