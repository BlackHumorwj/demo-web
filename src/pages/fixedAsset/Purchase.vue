<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索单据编号/供应商"
          class="search-input"
        />
        <el-select
          v-model="searchForm.status"
          placeholder="状态"
          class="search-select"
        >
          <el-option label="全部" value="" />
          <el-option label="待审核" :value="0" />
          <el-option label="已审核" :value="1" />
        </el-select>
        <el-button @click="handleSearch" class="search-btn">
          搜索
        </el-button>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          新增购置单据
        </el-button>
      </div>
    </div>

    <div class="page-card">
      <el-table :data="filteredPurchases" border>
        <el-table-column prop="bizDocNo" label="单据编号" width="160" />
        <el-table-column prop="tradeTime" label="购置日期" width="120" />
        <el-table-column prop="supplierName" label="供应商" />
        <el-table-column prop="amount" label="购置金额" width="140">
          <template #default="scope">
            {{ formatAmount(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="付款账户" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">
              {{ scope.row.status === 1 ? '已审核' : '待审核' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="voucherNo" label="凭证编号" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleView(scope.row.bizDocId)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              @click="handleEdit(scope.row.bizDocId)"
              :disabled="scope.row.status === 1"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.bizDocId)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :total="filteredPurchases.length"
          layout="total, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockFixedAssetPurchases } from '@/data/mockData'

const router = useRouter()

const searchForm = ref({
  keyword: '',
  status: ''
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

const filteredPurchases = computed(() => {
  let result = [...mockFixedAssetPurchases]
  
  if (searchForm.value.keyword) {
    const keyword = searchForm.value.keyword.toLowerCase()
    result = result.filter(
      item =>
        item.bizDocNo.toLowerCase().includes(keyword) ||
        item.supplierName.toLowerCase().includes(keyword)
    )
  }
  
  if (searchForm.value.status !== '') {
    result = result.filter(item => item.status === Number(searchForm.value.status))
  }
  
  return result
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const handleSearch = () => {
  pagination.value.currentPage = 1
}

const handleAdd = () => {
  router.push('/fixedAsset/purchase/add')
}

const handleView = (bizDocId: string) => {
  router.push(`/fixedAsset/purchase/view/${bizDocId}`)
}

const handleEdit = (bizDocId: string) => {
  router.push(`/fixedAsset/purchase/edit/${bizDocId}`)
}

const handleDelete = (bizDocId: string) => {
  if (confirm('确定要删除这条购置记录吗？')) {
    const index = mockFixedAssetPurchases.findIndex(item => item.bizDocId === bizDocId)
    if (index !== -1) {
      mockFixedAssetPurchases.splice(index, 1)
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

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>