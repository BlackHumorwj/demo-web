<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">新增收款</el-button>
    </div>

    <el-card class="page-card">
      <template #header>
        <span>收款单列表</span>
      </template>

      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="单据编号">
            <el-input v-model="searchForm.bizDocNo" placeholder="请输入单据编号" clearable />
          </el-form-item>
          <el-form-item label="业务日期">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="往来单位">
            <el-select v-model="searchForm.contactId" placeholder="请选择往来单位" clearable>
              <el-option label="全部" value="" />
              <el-option v-for="contact in mockContacts" :key="contact.id" :label="contact.name" :value="contact.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="全部" value="" />
              <el-option label="正常" :value="0" />
              <el-option label="已删除" :value="-1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="pagedList" border>
        <el-table-column prop="bizDocNo" label="单据编号" />
        <el-table-column prop="bizDate" label="业务日期" />
        <el-table-column prop="receiptAccountName" label="收款账户" />
        <el-table-column prop="accountName" label="挂账账户" />
        <el-table-column prop="contactName" label="往来单位" />
        <el-table-column label="收款金额" width="140">
          <template #default="scope">
            <span class="amount income">{{ getCurrencySymbol(scope.row.currencyId) }} {{ (scope.row.receiptAmount || 0).toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="currencyName" label="币种" width="80" />
        <el-table-column prop="bizStaffName" label="业务员" />
        <el-table-column prop="bizDeptName" label="部门" />
        <el-table-column prop="createName" label="制单人" />
        <el-table-column prop="createTime" label="制单时间" />
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row)" :disabled="scope.row.status !== 0">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="handleDelete(scope.row)" :disabled="scope.row.status !== 0">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <span class="total-amount">总收款金额: <span class="amount income">{{ getCurrencySymbol('1') }} {{ totalAmount.toLocaleString() }}</span></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredList.length"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockReceiptDocs, mockContacts, mockCurrencies } from '@/data/mockData'
import type { ReceiptDoc } from '@/types/business'

const router = useRouter()

const searchForm = reactive({
  bizDocNo: '',
  dateRange: [] as string[],
  contactId: '',
  status: ''
})

const currentPage = ref(1)
const pageSize = ref(10)

const filteredList = computed(() => {
  let list = [...mockReceiptDocs]
  if (searchForm.bizDocNo) {
    list = list.filter(item => item.bizDocNo.includes(searchForm.bizDocNo))
  }
  if (searchForm.dateRange.length === 2) {
    list = list.filter(item => item.bizDate >= searchForm.dateRange[0] && item.bizDate <= searchForm.dateRange[1])
  }
  if (searchForm.contactId) {
    list = list.filter(item => item.contactId === searchForm.contactId)
  }
  if (searchForm.status !== '') {
    list = list.filter(item => item.status === Number(searchForm.status))
  }
  return list.sort((a, b) => b.bizDate.localeCompare(a.bizDate))
})

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const totalAmount = computed(() => {
  return filteredList.value.reduce((sum, item) => sum + (item.receiptAmount || 0), 0)
})

const getCurrencySymbol = (currencyId: string) => {
  const currency = mockCurrencies.find(c => c.id === currencyId)
  return currency ? currency.symbol : '¥'
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchForm.bizDocNo = ''
  searchForm.dateRange = []
  searchForm.contactId = ''
  searchForm.status = ''
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
  router.push('/business/receipt/add')
}

const handleView = (row: ReceiptDoc) => {
  router.push(`/business/receipt/view/${row.bizDocId}`)
}

const handleEdit = (row: ReceiptDoc) => {
  router.push(`/business/receipt/edit/${row.bizDocId}`)
}

const handleDelete = (row: ReceiptDoc) => {
  if (confirm(`确定要删除收款单 ${row.bizDocNo} 吗？`)) {
    const idx = mockReceiptDocs.findIndex(item => item.bizDocId === row.bizDocId)
    if (idx !== -1) {
      mockReceiptDocs[idx].status = -1
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  margin-bottom: 20px;
}

.page-card {
  min-height: 400px;
}

.search-form {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
}

.total-amount {
  font-size: 16px;
  font-weight: 600;
}

.amount {
  font-weight: 600;
}

.amount.income {
  color: #22c55e;
}
</style>
