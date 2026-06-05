<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="日期范围">
            <el-date-picker 
              v-model="searchForm.tradeTime" 
              type="daterange" 
              range-separator="至" 
              start-placeholder="开始日期" 
              end-placeholder="结束日期" 
              class="date-picker"
            />
          </el-form-item>
          <el-form-item label="股东">
            <el-select v-model="searchForm.shareholderId" placeholder="请选择股东" clearable class="select-input">
              <el-option v-for="shareholder in shareholderOptions" :key="shareholder.value" :label="shareholder.label" :value="shareholder.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="付款账户">
            <el-select v-model="searchForm.accountId" placeholder="请选择付款账户" clearable class="select-input">
              <el-option v-for="account in accountOptions" :key="account.value" :label="account.label" :value="account.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable class="select-input">
              <el-option :value="null" label="全部" />
              <el-option :value="0" label="正常" />
              <el-option :value="-1" label="已删除" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="header-actions">
        <el-button type="primary" icon="Refresh" @click="refreshList">刷新</el-button>
        <el-button type="primary" @click="handleAdd">新增分红</el-button>
      </div>
    </div>
    
    <el-card class="page-card">
      <template #header>
        <span>分红管理</span>
        <span class="header-total">分红总金额：<span class="amount">¥ {{ formatNumber(totalAmount) }}</span></span>
      </template>
      
      <el-table :data="tableData" border :loading="loading">
        <el-table-column prop="bizDocNo" label="单据编号" />
        <el-table-column prop="tradeTime" label="日期" width="120" />
        <el-table-column prop="shareholderName" label="股东" />
        <el-table-column prop="accountName" label="付款账户" />
        <el-table-column label="金额" width="140">
          <template #default="scope">
            <span class="amount">¥ {{ formatNumber(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="currencyCode" label="币种" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="writerTime" label="制单时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row.bizDocId)">查看</el-button>
            <template v-if="scope.row.status === 0">
              <el-button type="text" size="small" @click="handleEdit(scope.row.bizDocId)">编辑</el-button>
              <el-button type="text" size="small" style="color: #ef4444" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <span class="total-count">共 {{ pagination.total }} 条记录</span>
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockBonusDocs, mockShareholders, mockAccounts, type BonusDoc } from '@/data/mockData'

const router = useRouter()

const loading = ref(false)

const searchForm = reactive({
  tradeTime: [] as Date[],
  shareholderId: '',
  accountId: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const shareholderOptions = computed(() => 
  mockShareholders
    .filter(s => s.status === 1)
    .map(s => ({ value: s.id, label: s.name }))
)

const accountOptions = computed(() => 
  mockAccounts
    .filter(a => a.status === 1)
    .map(a => ({ value: a.id, label: a.name }))
)

const filteredBonusList = computed(() => {
  let list = [...mockBonusDocs]
  
  if (searchForm.tradeTime && searchForm.tradeTime.length === 2) {
    const startDate = searchForm.tradeTime[0].toISOString().split('T')[0]
    const endDate = searchForm.tradeTime[1].toISOString().split('T')[0]
    list = list.filter(item => item.tradeTime >= startDate && item.tradeTime <= endDate)
  }
  
  if (searchForm.shareholderId) {
    list = list.filter(item => item.shareholderId === searchForm.shareholderId)
  }
  
  if (searchForm.accountId) {
    list = list.filter(item => item.accountId === searchForm.accountId)
  }
  
  if (searchForm.status !== '') {
    list = list.filter(item => item.status === Number(searchForm.status))
  }
  
  return list.sort((a, b) => new Date(b.tradeTime).getTime() - new Date(a.tradeTime).getTime())
})

const tableData = computed(() => {
  pagination.total = filteredBonusList.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredBonusList.value.slice(start, end)
})

const totalAmount = computed(() => {
  return filteredBonusList.value
    .filter(item => item.status === 0)
    .reduce((sum, item) => sum + (item.amount || 0), 0)
})

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusText = (status: number): string => {
  const statusMap: Record<string, string> = {
    '0': '正常',
    '-1': '已删除'
  }
  return statusMap[String(status)] || '未知'
}

const getStatusType = (status: number): string => {
  const typeMap: Record<string, string> = {
    '0': 'success',
    '-1': 'danger'
  }
  return typeMap[String(status)] || 'info'
}

const handleSearch = () => {
  pagination.page = 1
}

const resetSearch = () => {
  searchForm.tradeTime = []
  searchForm.shareholderId = ''
  searchForm.accountId = ''
  searchForm.status = ''
  pagination.page = 1
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
}

const handlePageChange = (page: number) => {
  pagination.page = page
}

const refreshList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const handleAdd = () => {
  router.push('/business/bonus/add')
}

const handleView = (bizDocId: string) => {
  router.push(`/business/bonus/view/${bizDocId}`)
}

const handleEdit = (bizDocId: string) => {
  router.push(`/business/bonus/edit/${bizDocId}`)
}

const handleDelete = (row: BonusDoc) => {
  if (row.voucher) {
    ElMessage.warning('该分红单已生成凭证，禁止删除')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除分红单据 ${row.bizDocNo} 吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = mockBonusDocs.findIndex(item => item.bizDocId === row.bizDocId)
    if (index !== -1) {
      mockBonusDocs[index].status = -1
      mockBonusDocs[index].updateId = '1'
      mockBonusDocs[index].updateName = '管理员'
      mockBonusDocs[index].updateTime = new Date().toLocaleString('zh-CN')
    }
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.search-bar {
  flex: 1;
}

.date-picker {
  width: 300px;
}

.select-input {
  width: 180px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.page-card {
  min-height: 400px;
}

.header-total {
  float: right;
  font-size: 14px;
  color: #666;
}

.header-total .amount {
  font-weight: 600;
  color: #ef4444;
}

.amount {
  font-weight: 600;
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