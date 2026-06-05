<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-input v-model="searchKeyword" placeholder="搜索单据编号、客户名称" class="search-input" />
        <el-select v-model="statusFilter" placeholder="状态筛选" class="filter-select">
          <el-option :value="null" label="全部" />
          <el-option :value="0" label="未提交" />
          <el-option :value="1" label="待审核" />
          <el-option :value="2" label="已审核" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <el-button type="primary" @click="handleAdd">新增收入</el-button>
    </div>
    
    <el-card class="page-card">
      <template #header>
        <span>收入管理</span>
      </template>
      
      <el-table :data="filteredIncomeList" border :loading="loading">
        <el-table-column prop="docNo" label="单据编号" />
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="contactName" label="客户" />
        <el-table-column label="金额" width="140">
          <template #default="scope">
            <span class="amount income">¥ {{ getTotalAmount(scope.row.details).toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="账户" />
        <el-table-column prop="projectName" label="项目" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <span class="total-count">共 {{ filteredIncomeList.length }} 条记录</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredIncomeList.length"
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
import { mockIncomeDocs, type IncomeDetail } from '@/data/mockData'

const router = useRouter()

const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredIncomeList = computed(() => {
  let list = [...mockIncomeDocs]
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(item => 
      item.docNo.toLowerCase().includes(keyword) ||
      item.contactName.toLowerCase().includes(keyword)
    )
  }
  
  if (statusFilter.value !== '') {
    list = list.filter(item => item.status === Number(statusFilter.value))
  }
  
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

const getStatusText = (status: number) => {
  const statusMap: Record<number, string> = {
    0: '未提交',
    1: '待审核',
    2: '已审核'
  }
  return statusMap[status] || '未知'
}

const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'info',
    1: 'warning',
    2: 'success'
  }
  return typeMap[status] || 'info'
}

const getTotalAmount = (details: IncomeDetail[]) => {
  return details.reduce((sum, item) => sum + (item.amount || 0), 0)
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleAdd = () => {
  router.push('/business/income/add')
}

const handleView = (id: string) => {
  router.push(`/business/income/view/${id}`)
}

const handleEdit = (id: string) => {
  router.push(`/business/income/edit/${id}`)
}

const handleDelete = (id: string) => {
  const index = mockIncomeDocs.findIndex(item => item.id === id)
  if (index !== -1) {
    mockIncomeDocs.splice(index, 1)
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

.page-card {
  min-height: 400px;
}

.amount {
  font-weight: 600;
}

.amount.income {
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