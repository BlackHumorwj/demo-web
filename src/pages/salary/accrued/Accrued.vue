<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-input v-model="searchKeyword" placeholder="搜索单据编号、备注" class="search-input" />
        <el-select v-model="statusFilter" placeholder="状态筛选" class="filter-select">
          <el-option :value="null" label="全部" />
          <el-option :value="0" label="草稿" />
          <el-option :value="1" label="已确认" />
          <el-option :value="2" label="已作废" />
        </el-select>
        <el-input v-model="salaryPeriod" placeholder="工资期间 (YYYY-MM)" class="period-input" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <el-button type="primary" @click="handleAdd">新增工资计提</el-button>
    </div>
    
    <el-card class="page-card">
      <template #header>
        <span>工资计提管理</span>
      </template>
      
      <el-table :data="filteredAccruedList" border :loading="loading">
        <el-table-column prop="bizDocNo" label="单据编号" />
        <el-table-column prop="salaryPeriod" label="工资期间" />
        <el-table-column prop="tradeTime" label="计提日期" />
        <el-table-column label="应发合计" width="120">
          <template #default="scope">
            <span class="amount">¥ {{ formatAmount(scope.row.grossAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实发合计" width="120">
          <template #default="scope">
            <span class="amount">¥ {{ formatAmount(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="writerName" label="制单人" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.docStatus)">
              {{ scope.row.docStatusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="writerTime" label="制单时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row.bizDocId)">查看</el-button>
            <el-button v-if="scope.row.docStatus === 0" type="text" size="small" @click="handleEdit(scope.row.bizDocId)">编辑</el-button>
            <el-button v-if="scope.row.docStatus === 0" type="text" size="small" style="color: #ef4444" @click="handleDelete(scope.row.bizDocId)">删除</el-button>
            <el-button v-if="scope.row.docStatus === 0" type="text" size="small" style="color: #3b82f6" @click="handleConfirm(scope.row.bizDocId)">确认</el-button>
            <el-button v-if="scope.row.docStatus === 1" type="text" size="small" style="color: #f59e0b" @click="handleVoid(scope.row.bizDocId)">作废</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <span class="total-count">共 {{ filteredAccruedList.length }} 条记录</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredAccruedList.length"
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
import { mockSalaryAccruedList } from '@/data/mockData'

const router = useRouter()

const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref<number | null>(null)
const salaryPeriod = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredAccruedList = computed(() => {
  let list = [...mockSalaryAccruedList]
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(item => 
      item.bizDocNo.toLowerCase().includes(keyword) ||
      (item.remark && item.remark.toLowerCase().includes(keyword))
    )
  }
  
  if (statusFilter.value !== null) {
    list = list.filter(item => item.docStatus === statusFilter.value)
  }
  
  if (salaryPeriod.value) {
    list = list.filter(item => item.salaryPeriod === salaryPeriod.value)
  }
  
  return list.sort((a, b) => new Date(b.writerTime).getTime() - new Date(a.writerTime).getTime())
})

const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return typeMap[status] || 'info'
}

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleAdd = () => {
  router.push('/salary/accrued/add')
}

const handleView = (id: number) => {
  router.push(`/salary/accrued/view/${id}`)
}

const handleEdit = (id: number) => {
  router.push(`/salary/accrued/edit/${id}`)
}

const handleDelete = (id: number) => {
  const index = mockSalaryAccruedList.findIndex(item => item.bizDocId === id)
  if (index !== -1) {
    mockSalaryAccruedList.splice(index, 1)
  }
}

const handleConfirm = (id: number) => {
  const item = mockSalaryAccruedList.find(item => item.bizDocId === id)
  if (item) {
    item.docStatus = 1
    item.docStatusName = '已确认'
  }
}

const handleVoid = (id: number) => {
  const item = mockSalaryAccruedList.find(item => item.bizDocId === id)
  if (item) {
    item.docStatus = 2
    item.docStatusName = '已作废'
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

.search-input {
  width: 250px;
}

.filter-select {
  width: 150px;
}

.period-input {
  width: 150px;
}

.page-card {
  min-height: 400px;
}

.amount {
  font-weight: 600;
  color: #333;
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