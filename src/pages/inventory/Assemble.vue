<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>产品组装/拆分</span>
          <div>
            <el-button size="small" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>&nbsp;刷新
            </el-button>
            <el-button type="primary" size="small" @click="handleAdd(1)">新增组装单</el-button>
            <el-button type="warning" size="small" @click="handleAdd(2)">新增拆分单</el-button>
          </div>
        </div>
      </template>

      <div class="search-bar">
        <el-input v-model="searchKeyword" placeholder="单据号/主产品" class="search-input" @keyup.enter="handleSearch" clearable />
        <el-select v-model="searchBizType" placeholder="业务类型" class="search-status" clearable>
          <el-option label="组装" :value="1" />
          <el-option label="拆分" :value="2" />
        </el-select>
        <el-select v-model="searchStatus" placeholder="状态" class="search-status" clearable>
          <el-option label="草稿" :value="0" />
          <el-option label="已完成" :value="1" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <el-table :data="paginatedList" border>
        <el-table-column prop="docNo" label="单据编号" min-width="170" />
        <el-table-column label="类型" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.bizType === 1 ? 'success' : 'warning'">{{ scope.row.bizTypeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bizDate" label="业务日期" min-width="120" />
        <el-table-column prop="warehouseName" label="仓库" min-width="120" />
        <el-table-column prop="mainProdName" label="主产品" min-width="120" />
        <el-table-column label="数量" width="130" align="right">
          <template #default="scope">
            {{ scope.row.mainQty }} {{ scope.row.mainUnit }}
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120" align="right">
          <template #default="scope">
            <span style="color: #f56c6c">¥{{ scope.row.mainAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="明细" width="80" align="center">
          <template #default="scope">{{ scope.row.details.length }}</template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'">{{ scope.row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="writerName" label="制单人" width="100" />
        <el-table-column prop="writeTime" label="制单时间" min-width="160" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button v-if="scope.row.status === 0" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              style="color: #67c23a"
              @click="handleConfirm(scope.row)"
            >
              确认
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              style="color: #ef4444"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredList.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockAssembleDocs, AssembleDoc } from '@/data/mockData'

const router = useRouter()

const searchKeyword = ref('')
const searchBizType = ref<number | ''>('')
const searchStatus = ref<number | ''>('')
const currentPage = ref(1)
const pageSize = ref(10)

const list = reactive<AssembleDoc[]>([...mockAssembleDocs])

const filteredList = computed(() => {
  return list.filter(item => {
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      if (!item.docNo.toLowerCase().includes(kw) && !item.mainProdName.toLowerCase().includes(kw)) return false
    }
    if (searchBizType.value !== '' && item.bizType !== searchBizType.value) return false
    if (searchStatus.value !== '' && item.status !== searchStatus.value) return false
    return true
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const handleSearch = () => { currentPage.value = 1 }
const handleRefresh = () => { list.splice(0, list.length, ...mockAssembleDocs) }
const handleAdd = (bizType: number) => {
  router.push({ path: '/inventory/assemble/add', query: { bizType: String(bizType) } })
}
const handleView = (row: AssembleDoc) => {
  router.push({ path: '/inventory/assemble/edit/' + row.id, query: { mode: 'view' } })
}
const handleEdit = (row: AssembleDoc) => {
  router.push({ path: '/inventory/assemble/edit/' + row.id, query: { mode: 'edit' } })
}

const handleConfirm = async (row: AssembleDoc) => {
  if (row.details.length === 0) {
    ElMessage.warning('请先添加明细')
    return
  }
  await ElMessageBox.confirm(`确认「${row.docNo}」？`)
  row.status = 1
  row.statusName = '已完成'
  row.voucherNo = `记-${row.bizDate.slice(0, 7)}-${String(Math.floor(Math.random() * 999)).padStart(3, '0')}`
  ElMessage.success('确认成功')
}

const handleDelete = async (row: AssembleDoc) => {
  await ElMessageBox.confirm(`确定删除「${row.docNo}」？`, '提示', { type: 'warning' })
  const idx = list.findIndex(i => i.id === row.id)
  if (idx > -1) list.splice(idx, 1)
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.page-container { padding: 16px; }
.header-content { display: flex; justify-content: space-between; align-items: center; }
.search-bar { display: flex; gap: 8px; margin-bottom: 12px; }
.search-input { width: 220px; }
.search-status { width: 160px; }
.pagination-wrap { display: flex; justify-content: flex-end; margin-top: 12px; }
</style>
