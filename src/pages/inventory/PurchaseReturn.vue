<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-input v-model="bizDocNo" placeholder="单据编号" class="filter-input" clearable />
        <el-date-picker v-model="bizDateBegin" type="date" placeholder="开始日期" class="date-picker" />
        <span class="date-separator">至</span>
        <el-date-picker v-model="bizDateEnd" type="date" placeholder="结束日期" class="date-picker" />
        <el-select v-model="supplierId" placeholder="供应商" class="filter-select" clearable>
          <el-option :value="''" label="全部" />
          <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-select v-model="statusFilter" placeholder="状态" class="filter-select" clearable>
          <el-option :value="''" label="全部" />
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-button type="primary" @click="handleAdd">新增采购退货</el-button>
    </div>

    <el-card class="page-card">
      <template #header>
        <span>采购退货管理</span>
      </template>

      <el-table :data="pagedList" border :loading="loading">
        <el-table-column prop="bizDocNo" label="单据编号" width="180" />
        <el-table-column prop="bizDate" label="日期" width="120" />
        <el-table-column prop="supplierName" label="供应商" />
        <el-table-column prop="bizStaffName" label="业务员" width="110" />
        <el-table-column prop="bizDeptName" label="部门" width="110" />
        <el-table-column label="数量" width="110">
          <template #default="scope">
            <span>{{ scope.row.totalQty.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="140">
          <template #default="scope">
            <span class="amount">¥ {{ scope.row.totalAmount.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row.bizDocId)">查看</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row.bizDocId)" :disabled="scope.row.status !== 0">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="handleDelete(scope.row.bizDocId)" :disabled="scope.row.status !== 0">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <span class="total-count">共 {{ filteredList.length }} 条记录</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredList.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockPurchaseReturnDocs, mockContacts } from '@/data/mockData'
import type { PurchaseReturnDoc } from '@/types/inventory'

const router = useRouter()

const loading = ref(false)
const bizDocNo = ref('')
const bizDateBegin = ref('')
const bizDateEnd = ref('')
const supplierId = ref('')
const statusFilter = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)

const statusOptions = [
  { value: 0, label: '草稿' },
  { value: 1, label: '已保存' },
  { value: 2, label: '已审核' },
  { value: 3, label: '已撤销' },
  { value: -1, label: '已删除' }
]

const supplierList = computed(() => mockContacts.filter(c => c.type === 2 && c.status === 1))

const filteredList = computed(() => {
  let list: PurchaseReturnDoc[] = [...mockPurchaseReturnDocs]

  if (bizDocNo.value) {
    list = list.filter(item => item.bizDocNo.includes(bizDocNo.value))
  }
  if (bizDateBegin.value) {
    list = list.filter(item => item.bizDate >= bizDateBegin.value)
  }
  if (bizDateEnd.value) {
    list = list.filter(item => item.bizDate <= bizDateEnd.value)
  }
  if (supplierId.value) {
    list = list.filter(item => item.supplierId === supplierId.value)
  }
  if (statusFilter.value !== null) {
    list = list.filter(item => item.status === statusFilter.value)
  }

  return list.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
})

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const getStatusText = (status: number) => {
  const map: Record<string, string> = {
    '0': '草稿',
    '1': '已保存',
    '2': '已审核',
    '3': '已撤销',
    '-1': '已删除'
  }
  return map[String(status)] || '未知'
}

const getStatusType = (status: number) => {
  const map: Record<string, string> = {
    '0': 'info',
    '1': 'warning',
    '2': 'success',
    '3': 'danger',
    '-1': 'info'
  }
  return map[String(status)] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  bizDocNo.value = ''
  bizDateBegin.value = ''
  bizDateEnd.value = ''
  supplierId.value = ''
  statusFilter.value = null
  currentPage.value = 1
}

const handleAdd = () => {
  router.push('/inventory/purchase-return/add')
}

const handleView = (id: string) => {
  router.push(`/inventory/purchase-return/view/${id}`)
}

const handleEdit = (id: string) => {
  router.push(`/inventory/purchase-return/edit/${id}`)
}

const handleDelete = (id: string) => {
  const index = mockPurchaseReturnDocs.findIndex(item => item.bizDocId === id)
  if (index !== -1) {
    mockPurchaseReturnDocs[index].status = -1
  }
}
</script>

<style scoped>
.page-container {
  padding: 24px;
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
  flex-wrap: wrap;
}

.filter-input {
  width: 180px;
}

.date-picker {
  width: 180px;
}

.date-separator {
  color: #999;
}

.filter-select {
  width: 150px;
}

.page-card {
  min-height: 400px;
}

.amount {
  font-weight: 600;
  color: #22c55e;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.pagination {
  margin: 0;
}
</style>
