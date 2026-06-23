<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>账本管理</span>
          <div>
            <el-button size="small" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>&nbsp;刷新
            </el-button>
            <el-button type="primary" size="small" @click="handleAdd">新增账本</el-button>
          </div>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按账本名称搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
        <el-select v-model="searchStatus" placeholder="状态" class="search-status">
          <el-option label="全部" value="" />
          <el-option label="正常" :value="0" />
          <el-option label="停用" :value="1" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <el-table :data="paginatedLedgers" border>
        <el-table-column prop="ledgerName" label="账本名称" />
        <el-table-column prop="ledgerType" label="账本类型" />
        <el-table-column label="本位币">
          <template #default="scope">
            {{ getCurrencyLabel(scope.row.currencyCode) }}
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="开始日期" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : scope.row.status === 1 ? 'warning' : 'info'">
              {{ scope.row.status === 0 ? '正常' : scope.row.status === 1 ? '停用' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="280">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.status === 0 ? '停用' : '启用' }}
            </el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="openDeleteConfirm(scope.row)">删除</el-button>
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

    <el-dialog title="确认删除" :visible.sync="deleteDialogVisible" width="360px">
      <p>确定要删除账本「{{ deleteItem?.ledgerName }}」吗？</p>
      <p v-if="deleteItem?.hasTransactions" style="color: #e6a23c; font-size: 13px;">该账本存在交易记录，确定删除？</p>
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
import { mockLedgers, mockCurrencies } from '@/data/mockData'
import { Search, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

const ledgers = ref([...mockLedgers])
const searchKeyword = ref('')
const searchStatus = ref<number | ''>('')
const currentPage = ref(1)
const pageSize = ref(10)
const deleteDialogVisible = ref(false)
const deleteItem = ref<typeof mockLedgers[0] | null>(null)

const getCurrencyLabel = (code: string) => {
  const found = mockCurrencies.find(c => c.code === code)
  return found ? `${found.code} ${found.name}` : code
}

const filteredLedgers = computed(() => {
  return ledgers.value.filter(item => {
    if (item.status === -1 && searchStatus.value === '') return false
    if (searchKeyword.value && !item.ledgerName.toLowerCase().includes(searchKeyword.value.toLowerCase())) return false
    if (searchStatus.value !== '' && item.status !== searchStatus.value) return false
    return true
  })
})

const total = computed(() => filteredLedgers.value.length)

const paginatedLedgers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLedgers.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleRefresh = () => {
  ledgers.value = [...mockLedgers]
  searchKeyword.value = ''
  searchStatus.value = ''
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
  router.push('/settings/ledger/add')
}

const handleView = (row: typeof mockLedgers[0]) => {
  router.push(`/settings/ledger/view/${row.id}`)
}

const handleEdit = (row: typeof mockLedgers[0]) => {
  router.push(`/settings/ledger/edit/${row.id}`)
}

const openDeleteConfirm = (row: typeof mockLedgers[0]) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const handleDelete = () => {
  if (deleteItem.value) {
    const index = mockLedgers.findIndex(item => item.id === deleteItem.value?.id)
    if (index !== -1) {
      mockLedgers.splice(index, 1)
    }
    ledgers.value = [...mockLedgers]
  }
  deleteDialogVisible.value = false
}

const toggleStatus = (row: typeof mockLedgers[0]) => {
  const index = mockLedgers.findIndex(item => item.id === row.id)
  if (index !== -1) {
    mockLedgers[index].status = mockLedgers[index].status === 0 ? 1 : 0
  }
  ledgers.value = [...mockLedgers]
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
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.search-input {
  width: 300px;
}

.search-status {
  width: 130px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
