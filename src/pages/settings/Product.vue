<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>产品管理</span>
          <el-button type="primary" size="small" @click="handleAdd">新增产品</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="productNameFilter"
          placeholder="按产品名称搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <el-input
          v-model="specificationFilter"
          placeholder="按规格型号搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <el-select v-model="statusFilter" placeholder="状态" class="filter-select">
          <el-option label="全部" :value="-1" />
          <el-option label="正常" :value="0" />
          <el-option label="已删除" :value="-1" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleRefresh">刷新</el-button>
      </div>

      <el-table :data="paginatedProducts" border>
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="specification" label="规格型号" />
        <el-table-column prop="unit" label="单位" width="100" />
        <el-table-column label="成本价" width="140">
          <template #default="scope">
            <span class="amount">¥{{ Number(scope.row.costPrice).toFixed(4) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="incomeCategoryName" label="收入类别" />
        <el-table-column prop="costCategoryName" label="成本类别" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'info'">
              {{ scope.row.status === 0 ? '正常' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="writerTime" label="创建时间" width="170" />
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              style="color: #ef4444"
              @click="openDeleteConfirm(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <el-dialog title="确认删除" :visible.sync="deleteDialogVisible" width="300px">
      <p>确定要删除产品「{{ deleteItem?.productName }}」吗？</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleDelete">确定删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockProductsDetail } from '@/data/mockData'

const router = useRouter()

const products = ref([...mockProductsDetail])
const productNameFilter = ref('')
const specificationFilter = ref('')
const statusFilter = ref(-1)
const currentPage = ref(1)
const pageSize = ref(10)
const deleteDialogVisible = ref(false)
const deleteItem = ref<typeof mockProductsDetail[0] | null>(null)

const filteredProducts = computed(() => {
  let result = products.value
  if (productNameFilter.value) {
    result = result.filter(item =>
      item.productName.toLowerCase().includes(productNameFilter.value.toLowerCase())
    )
  }
  if (specificationFilter.value) {
    result = result.filter(item =>
      (item.specification || '').toLowerCase().includes(specificationFilter.value.toLowerCase())
    )
  }
  if (statusFilter.value !== -1) {
    result = result.filter(item => item.status === statusFilter.value)
  }
  return result
})

const total = computed(() => filteredProducts.value.length)

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleRefresh = () => {
  productNameFilter.value = ''
  specificationFilter.value = ''
  statusFilter.value = -1
  currentPage.value = 1
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
}

const handleAdd = () => {
  router.push('/settings/product/add')
}

const handleView = (row: typeof mockProductsDetail[0]) => {
  router.push(`/settings/product/view/${row.id}`)
}

const handleEdit = (row: typeof mockProductsDetail[0]) => {
  router.push(`/settings/product/edit/${row.id}`)
}

const openDeleteConfirm = (row: typeof mockProductsDetail[0]) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const handleDelete = () => {
  if (deleteItem.value) {
    const index = mockProductsDetail.findIndex(item => item.id === deleteItem.value?.id)
    if (index !== -1) {
      mockProductsDetail[index].status = -1
    }
    products.value = [...mockProductsDetail]
  }
  deleteDialogVisible.value = false
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-card {
  min-height: 400px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.search-input {
  width: 220px;
}

.filter-select {
  width: 140px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

.amount {
  font-weight: 600;
  color: #1f2937;
}
</style>
