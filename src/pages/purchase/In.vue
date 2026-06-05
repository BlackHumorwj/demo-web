<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-date-picker v-model="tradeTimeBegin" type="date" placeholder="开始日期" class="date-picker" />
        <span class="date-separator">至</span>
        <el-date-picker v-model="tradeTimeEnd" type="date" placeholder="结束日期" class="date-picker" />
        <el-select v-model="bizContactId" placeholder="供应商" class="filter-select">
          <el-option :value="''" label="全部" />
          <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-select v-model="warehouseId" placeholder="仓库" class="filter-select">
          <el-option :value="''" label="全部" />
          <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-select v-model="staffId" placeholder="业务员" class="filter-select">
          <el-option :value="''" label="全部" />
          <el-option v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-button type="primary" @click="handleAdd">新增采购入库</el-button>
    </div>
    
    <el-card class="page-card">
      <template #header>
        <span>采购入库管理</span>
      </template>
      
      <el-table :data="filteredPurchaseList" border :loading="loading">
        <el-table-column prop="bizDocNo" label="单据编号" />
        <el-table-column prop="tradeTime" label="业务日期" />
        <el-table-column prop="bizContactName" label="供应商" />
        <el-table-column prop="warehouseName" label="仓库" />
        <el-table-column label="总金额" width="140">
          <template #default="scope">
            <span class="amount">¥ {{ scope.row.totalCost.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="writerName" label="制单人" />
        <el-table-column prop="writerTime" label="制单时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row.bizDocId)">查看</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row.bizDocId)" :disabled="scope.row.status !== 0">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="handleDelete(scope.row.bizDocId)" :disabled="scope.row.status !== 0">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <span class="total-count">共 {{ filteredPurchaseList.length }} 条记录</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredPurchaseList.length"
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
import { mockPurchaseInDocs, mockContacts, mockWarehouses, mockStaff } from '@/data/mockData'

const router = useRouter()

const loading = ref(false)
const tradeTimeBegin = ref('')
const tradeTimeEnd = ref('')
const bizContactId = ref('')
const warehouseId = ref('')
const staffId = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const supplierList = computed(() => mockContacts.filter(c => c.type === 2))
const warehouseList = computed(() => mockWarehouses.filter(w => w.status === 1))
const staffList = computed(() => mockStaff.filter(s => s.status === 1))

const filteredPurchaseList = computed(() => {
  let list = [...mockPurchaseInDocs]
  
  if (tradeTimeBegin.value) {
    list = list.filter(item => item.tradeTime >= tradeTimeBegin.value)
  }
  
  if (tradeTimeEnd.value) {
    list = list.filter(item => item.tradeTime <= tradeTimeEnd.value)
  }
  
  if (bizContactId.value) {
    list = list.filter(item => item.bizContactId === bizContactId.value)
  }
  
  if (warehouseId.value) {
    list = list.filter(item => item.warehouseId === warehouseId.value)
  }
  
  if (staffId.value) {
    list = list.filter(item => item.staffId === staffId.value)
  }
  
  return list.sort((a, b) => new Date(b.writerTime).getTime() - new Date(a.writerTime).getTime())
})

const getStatusText = (status: number) => {
  const statusMap: Record<string, string> = {
    '0': '正常',
    '-1': '已删除'
  }
  return statusMap[String(status)] || '未知'
}

const getStatusType = (status: number) => {
  const typeMap: Record<string, string> = {
    '0': 'success',
    '-1': 'info'
  }
  return typeMap[String(status)] || 'info'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  tradeTimeBegin.value = ''
  tradeTimeEnd.value = ''
  bizContactId.value = ''
  warehouseId.value = ''
  staffId.value = ''
  currentPage.value = 1
}

const handleAdd = () => {
  router.push('/purchase/in/add')
}

const handleView = (id: string) => {
  router.push(`/purchase/in/detail/${id}`)
}

const handleEdit = (id: string) => {
  router.push(`/purchase/in/edit/${id}`)
}

const handleDelete = (id: string) => {
  const index = mockPurchaseInDocs.findIndex(item => item.bizDocId === id)
  if (index !== -1) {
    mockPurchaseInDocs[index].status = -1
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