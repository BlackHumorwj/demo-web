<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="date-picker"
        />
        <el-select v-model="changeTypeFilter" placeholder="变更类型" class="filter-select">
          <el-option :value="null" label="全部" />
          <el-option :value="1" label="增股" />
          <el-option :value="2" label="减股" />
        </el-select>
        <el-select v-model="shareholderFilter" placeholder="股东" class="filter-select">
          <el-option :value="null" label="全部" />
          <el-option v-for="item in shareholderList" :key="item.id" :label="item.name" :value="Number(item.id)" />
        </el-select>
        <el-select v-model="accountFilter" placeholder="收付款账户" class="filter-select">
          <el-option :value="null" label="全部" />
          <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="Number(item.id)" />
        </el-select>
        <el-select v-model="statusFilter" placeholder="状态" class="filter-select">
          <el-option :value="null" label="全部" />
          <el-option :value="0" label="正常" />
          <el-option :value="-1" label="已删除" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <div class="action-buttons">
        <el-button type="primary" @click="handleAdd">新增股权变更</el-button>
        <el-button @click="handleRefresh">刷新</el-button>
      </div>
    </div>
    
    <el-card class="page-card">
      <template #header>
        <span>股权变更管理</span>
      </template>
      
      <el-table :data="filteredList" border :loading="loading">
        <el-table-column prop="bizDocNo" label="单据编号" width="140" />
        <el-table-column prop="tradeTime" label="业务日期" width="120" />
        <el-table-column label="变更类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.changeType === 1 ? 'success' : 'warning'">
              {{ scope.row.changeTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="shareholder.shareholderName" label="股东" width="100" />
        <el-table-column prop="account.accountName" label="收付款账户" width="120" />
        <el-table-column label="变更金额" width="140">
          <template #default="scope">
            <span :class="['amount', scope.row.changeType === 1 ? 'income' : 'expense']">
              {{ scope.row.changeType === 2 ? '-' : '' }}¥ {{ scope.row.amount.toLocaleString() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="currencyCode" label="币种" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="writerTime" label="制单时间" width="160" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row.bizDocId)">查看</el-button>
            <el-button 
              type="text" 
              size="small" 
              @click="handleEdit(scope.row.bizDocId)"
              :disabled="scope.row.status !== 0"
              :class="{ disabled: scope.row.status !== 0 }"
            >编辑</el-button>
            <el-button 
              type="text" 
              size="small" 
              style="color: #ef4444" 
              @click="handleDelete(scope.row.bizDocId)"
              :disabled="scope.row.status !== 0"
              :class="{ disabled: scope.row.status !== 0 }"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container">
        <div class="summary-info">
          <span class="total-count">共 {{ filteredList.length }} 条记录</span>
          <span class="total-amount">总变更金额：¥ {{ totalAmount.toLocaleString() }}</span>
        </div>
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
import { mockShareChangeDocs, mockShareholders, mockAccounts, type ShareChangeDetail } from '@/data/mockData'

const router = useRouter()

const loading = ref(false)
const dateRange = ref<[string, string] | null>(null)
const changeTypeFilter = ref<number | null>(null)
const shareholderFilter = ref<number | null>(null)
const accountFilter = ref<number | null>(null)
const statusFilter = ref<number | null>(null)
const currentPage = ref(1)
const pageSize = ref(10)

const shareholderList = computed(() => mockShareholders.filter(s => s.status === 1))
const accountList = computed(() => mockAccounts.filter(a => a.status === 1))

const filteredList = computed(() => {
  let list = mockShareChangeDocs.map(item => ({
    bizDocId: item.bizDocId,
    bizDocNo: item.bizDocNo,
    tradeTime: item.tradeTime,
    changeType: item.changeType,
    changeTypeName: item.changeTypeName,
    shareholder: {
      shareholderId: item.shareholderId,
      shareholderName: item.shareholderName
    },
    account: {
      accountId: item.accountId,
      accountName: item.accountName
    },
    amount: item.amount,
    currencyCode: item.currencyCode,
    exchangeRate: item.exchangeRate,
    status: item.status,
    writerTime: item.writerTime,
    hasVoucher: !!item.voucher
  }))

  if (dateRange.value) {
    const [startDate, endDate] = dateRange.value
    list = list.filter(item => item.tradeTime >= startDate && item.tradeTime <= endDate)
  }

  if (changeTypeFilter.value !== null) {
    list = list.filter(item => item.changeType === changeTypeFilter.value)
  }

  if (shareholderFilter.value !== null) {
    list = list.filter(item => item.shareholder.shareholderId === shareholderFilter.value)
  }

  if (accountFilter.value !== null) {
    list = list.filter(item => item.account.accountId === accountFilter.value)
  }

  if (statusFilter.value !== null) {
    list = list.filter(item => item.status === statusFilter.value)
  }

  return list.sort((a, b) => new Date(b.writerTime).getTime() - new Date(a.writerTime).getTime())
})

const totalAmount = computed(() => {
  return filteredList.value.reduce((sum, item) => {
    return sum + (item.changeType === 1 ? item.amount : -item.amount)
  }, 0)
})

const getStatusText = (status: number) => {
  return status === 0 ? '正常' : '已删除'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  dateRange.value = null
  changeTypeFilter.value = null
  shareholderFilter.value = null
  accountFilter.value = null
  statusFilter.value = null
  currentPage.value = 1
}

const handleRefresh = () => {
  handleReset()
}

const handleAdd = () => {
  router.push('/business/share-change/add')
}

const handleView = (id: number) => {
  router.push(`/business/share-change/view/${id}`)
}

const handleEdit = (id: number) => {
  const record = mockShareChangeDocs.find(item => item.bizDocId === id)
  if (record?.voucher) {
    alert('该单据已生成凭证，禁止编辑')
    return
  }
  router.push(`/business/share-change/edit/${id}`)
}

const handleDelete = (id: number) => {
  const record = mockShareChangeDocs.find(item => item.bizDocId === id)
  if (record?.voucher) {
    alert('该单据已生成凭证，禁止删除')
    return
  }
  
  if (confirm('确定要删除这条股权变更记录吗？')) {
    const index = mockShareChangeDocs.findIndex(item => item.bizDocId === id)
    if (index !== -1) {
      mockShareChangeDocs[index].status = -1
    }
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

.date-picker {
  width: 280px;
}

.filter-select {
  width: 150px;
}

.action-buttons {
  display: flex;
  gap: 12px;
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

.amount.expense {
  color: #ef4444;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
}

.summary-info {
  display: flex;
  gap: 20px;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.total-amount {
  color: #22c55e;
  font-weight: 600;
  font-size: 14px;
}

.pagination {
  margin: 0;
}

.el-button.disabled {
  color: #999;
  cursor: not-allowed;
}
</style>