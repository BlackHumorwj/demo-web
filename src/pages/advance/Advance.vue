<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索单据编号/往来单位"
          class="search-input"
        />
        <el-select
          v-model="searchForm.arapType"
          placeholder="挂账类型"
          class="search-select"
        >
          <el-option label="全部" value="" />
          <el-option label="预收" :value="3" />
          <el-option label="预付" :value="4" />
        </el-select>
        <el-select
          v-model="searchForm.bizContactId"
          placeholder="往来单位"
          class="search-select"
        >
          <el-option label="全部" value="" />
          <el-option
            v-for="contact in mockContacts"
            :key="contact.id"
            :label="contact.name"
            :value="contact.id"
          />
        </el-select>
        <el-select
          v-model="searchForm.status"
          placeholder="状态"
          class="search-select"
        >
          <el-option label="全部" value="" />
          <el-option label="正常" :value="0" />
          <el-option label="已删除" :value="-1" />
        </el-select>
        <el-button @click="handleSearch" class="search-btn">
          搜索
        </el-button>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAdd">
          新增预收预付
        </el-button>
      </div>
    </div>

    <div class="page-card">
      <el-table :data="filteredList" border>
        <el-table-column prop="bizDocNo" label="单据编号" width="160" />
        <el-table-column prop="tradeTime" label="业务日期" width="120" />
        <el-table-column prop="arapTypeName" label="挂账类型" width="100">
          <template #default="scope">
            <el-tag
              :type="scope.row.arapType === 3 ? 'success' : 'warning'"
            >
              {{ scope.row.arapTypeName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="挂账账户" width="140" />
        <el-table-column prop="fundAccountName" label="资金账户" width="140" />
        <el-table-column prop="bizContactName" label="往来单位" />
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="scope">
            {{ formatAmount(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="dueDate" label="到期日" width="120" />
        <el-table-column prop="currencyCode" label="币种" width="80" />
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
              @click="handleView(scope.row.bizDocId)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              @click="handleEdit(scope.row.bizDocId)"
              :disabled="scope.row.status !== 0"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row.bizDocId)"
              :disabled="scope.row.status !== 0"
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
          :total="filteredList.length"
          layout="total, prev, pager, next, jumper"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockAdvanceList, mockContacts } from '@/data/mockData'
import type { Advance } from '@/data/mockData'

const router = useRouter()

const searchForm = ref({
  keyword: '',
  arapType: '',
  bizContactId: '',
  status: ''
})

const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

const filteredList = computed(() => {
  let result = [...mockAdvanceList]
  
  if (searchForm.value.keyword) {
    const keyword = searchForm.value.keyword.toLowerCase()
    result = result.filter(
      item =>
        item.bizDocNo.toLowerCase().includes(keyword) ||
        item.bizContactName.toLowerCase().includes(keyword)
    )
  }
  
  if (searchForm.value.arapType !== '') {
    result = result.filter(item => item.arapType === Number(searchForm.value.arapType))
  }
  
  if (searchForm.value.bizContactId) {
    result = result.filter(item => item.bizContactId === searchForm.value.bizContactId)
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
    case -1:
      return 'info'
    default:
      return 'default'
  }
}

const handleSearch = () => {
  pagination.value.currentPage = 1
}

const handleAdd = () => {
  router.push('/advance/add')
}

const handleView = (bizDocId: string) => {
  router.push(`/advance/view/${bizDocId}`)
}

const handleEdit = (bizDocId: string) => {
  router.push(`/advance/edit/${bizDocId}`)
}

const handleDelete = (bizDocId: string) => {
  if (confirm('确定要删除这条预收预付记录吗？')) {
    const index = mockAdvanceList.findIndex(item => item.bizDocId === bizDocId)
    if (index !== -1) {
      mockAdvanceList[index].status = -1
      mockAdvanceList[index].statusName = '已删除'
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