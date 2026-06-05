<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索资产编号/名称"
          class="search-input"
        />
        <el-select
          v-model="searchForm.categoryId"
          placeholder="资产类别"
          class="search-select"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="cat in mockAssetCategories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
          />
        </el-select>
        <el-select
          v-model="searchForm.deptId"
          placeholder="使用部门"
          class="search-select"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="dept in mockDepartments"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          />
        </el-select>
        <el-select
          v-model="searchForm.status"
          placeholder="状态"
          class="search-select"
        >
          <el-option label="全部" value="" />
          <el-option label="在用" :value="0" />
          <el-option label="闲置" :value="1" />
          <el-option label="已处置" :value="2" />
        </el-select>
        <el-button @click="handleSearch" class="search-btn">
          搜索
        </el-button>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          新增资产卡片
        </el-button>
      </div>
    </div>

    <div class="page-card">
      <el-table :data="filteredAssets" border>
        <el-table-column prop="assetNo" label="资产编号" width="160" />
        <el-table-column prop="assetName" label="资产名称" />
        <el-table-column prop="categoryName" label="资产类别" width="120" />
        <el-table-column prop="specModel" label="规格型号" />
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
        <el-table-column prop="deptName" label="使用部门" width="120" />
        <el-table-column prop="staffName" label="使用人" width="100" />
        <el-table-column prop="statusName" label="状态" width="100">
          <template #default="scope">
            <el-tag
              :type="getStatusTagType(scope.row.status)"
            >
              {{ scope.row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleView(scope.row.assetId)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              @click="handleEdit(scope.row.assetId)"
              :disabled="scope.row.status >= 2"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.assetId)"
              :disabled="scope.row.status >= 2 || scope.row.accumulatedDepreciation > 0"
            >
              删除
            </el-button>
            <el-button
              size="small"
              type="warning"
              @click="handleDispose(scope.row.assetId)"
              :disabled="scope.row.status >= 2"
            >
              处置
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockFixedAssets, mockAssetCategories, mockDepartments } from '@/data/mockData'
import type { FixedAssetCard } from '@/data/mockData'

const router = useRouter()

const searchForm = ref({
  keyword: '',
  categoryId: '',
  deptId: '',
  status: ''
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

const filteredAssets = computed(() => {
  let result = [...mockFixedAssets]
  
  if (searchForm.value.keyword) {
    const keyword = searchForm.value.keyword.toLowerCase()
    result = result.filter(
      item =>
        item.assetNo.toLowerCase().includes(keyword) ||
        item.assetName.toLowerCase().includes(keyword)
    )
  }
  
  if (searchForm.value.categoryId) {
    result = result.filter(item => item.categoryId === searchForm.value.categoryId)
  }
  
  if (searchForm.value.deptId) {
    result = result.filter(item => item.deptId === searchForm.value.deptId)
  }
  
  if (searchForm.value.status !== '') {
    result = result.filter(item => item.status === Number(searchForm.value.status))
  }
  
  return result
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const getStatusTagType = (status: number) => {
  switch (status) {
    case 0:
      return 'success'
    case 1:
      return 'warning'
    case 2:
      return 'info'
    default:
      return 'default'
  }
}

const handleSearch = () => {
  pagination.value.currentPage = 1
}

const handleAdd = () => {
  router.push('/fixedAsset/card/add')
}

const handleView = (assetId: string) => {
  router.push(`/fixedAsset/card/view/${assetId}`)
}

const handleEdit = (assetId: string) => {
  router.push(`/fixedAsset/card/edit/${assetId}`)
}

const handleDelete = (assetId: string) => {
  if (confirm('确定要删除这条资产记录吗？')) {
    const index = mockFixedAssets.findIndex(item => item.assetId === assetId)
    if (index !== -1) {
      mockFixedAssets[index].status = -1
      alert('删除成功')
    }
  }
}

const handleDispose = (assetId: string) => {
  router.push(`/fixedAsset/disposal/add?assetId=${assetId}`)
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