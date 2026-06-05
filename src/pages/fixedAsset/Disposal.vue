<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索资产编号/资产名称"
          class="search-input"
        />
        <el-button @click="handleSearch" class="search-btn">搜索</el-button>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">新增处置</el-button>
      </div>
    </div>

    <div class="page-card">
      <el-table :data="filteredDisposals" border>
        <el-table-column prop="bizDocNo" label="处置单号" width="160" />
        <el-table-column prop="assetNo" label="资产编号" width="140" />
        <el-table-column prop="assetName" label="资产名称" />
        <el-table-column prop="disposalTypeName" label="处置方式" width="100" />
        <el-table-column prop="disposalDate" label="处置日期" width="120" />
        <el-table-column prop="netValue" label="账面净值" width="120">
          <template #default="scope">
            {{ formatAmount(scope.row.netValue) }}
          </template>
        </el-table-column>
        <el-table-column prop="disposalAmount" label="处置收入" width="120">
          <template #default="scope">
            {{ formatAmount(scope.row.disposalAmount) }}
          </template>
        </el-table-column>
        <el-table-column prop="gainLossAmount" label="处置损益" width="120">
          <template #default="scope">
            <span :class="scope.row.gainLossAmount >= 0 ? 'text-green' : 'text-red'">
              {{ scope.row.gainLossAmount >= 0 ? '+' : '' }}{{ formatAmount(scope.row.gainLossAmount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleView(scope.row.disposalId)"
            >查看</el-button>
            <el-button
              size="small"
              @click="handleEdit(scope.row.disposalId)"
            >编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.disposalId)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="filteredDisposals.length"
          layout="total, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockAssetDisposals } from '@/data/mockData'

const router = useRouter()

const searchForm = ref({
  keyword: ''
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const filteredDisposals = computed(() => {
  let result = [...mockAssetDisposals]
  
  if (searchForm.value.keyword) {
    const keyword = searchForm.value.keyword.toLowerCase()
    result = result.filter(
      item =>
        item.assetNo.toLowerCase().includes(keyword) ||
        item.assetName.toLowerCase().includes(keyword)
    )
  }
  
  return result
})

const handleSearch = () => {
  pagination.value.currentPage = 1
}

const handleAdd = () => {
  router.push('/fixedAsset/disposal/add')
}

const handleView = (disposalId: string) => {
  router.push(`/fixedAsset/disposal/view/${disposalId}`)
}

const handleEdit = (disposalId: string) => {
  router.push(`/fixedAsset/disposal/edit/${disposalId}`)
}

const handleDelete = (disposalId: string) => {
  if (confirm('确定要删除这条处置记录吗？')) {
    const index = mockAssetDisposals.findIndex(item => item.disposalId === disposalId)
    if (index !== -1) {
      mockAssetDisposals.splice(index, 1)
      alert('删除成功')
    }
  }
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

.search-input {
  width: 200px;
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

.text-green {
  color: #67c23a;
}

.text-red {
  color: #f56c6c;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>