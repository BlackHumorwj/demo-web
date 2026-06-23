<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>库存盘点</span>
          <div>
            <el-button size="small" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>&nbsp;刷新
            </el-button>
            <el-button type="primary" size="small" @click="handleAdd">新增盘点单</el-button>
          </div>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按盘点单号/仓库搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
        <el-select v-model="searchStatus" placeholder="状态" class="search-status" clearable>
          <el-option label="盘点中" :value="0" />
          <el-option label="已完成" :value="1" />
          <el-option label="已删除" :value="-1" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <el-table :data="paginatedRecords" border>
        <el-table-column prop="docNo" label="盘点单号" min-width="180" />
        <el-table-column prop="takeDate" label="盘点日期" min-width="120" />
        <el-table-column prop="warehouseName" label="仓库" min-width="120" />
        <el-table-column label="盘点类型" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.takeType === 1 ? 'primary' : 'info'">{{ scope.row.takeTypeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalKinds" label="产品种数" width="100" align="center" />
        <el-table-column prop="profitKinds" label="盘盈种数" width="100" align="center" />
        <el-table-column prop="lossKinds" label="盘亏种数" width="100" align="center" />
        <el-table-column label="盘盈金额" width="120" align="right">
          <template #default="scope">
            <span style="color: #67c23a">¥{{ scope.row.profitAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="盘亏金额" width="120" align="right">
          <template #default="scope">
            <span style="color: #f56c6c">¥{{ scope.row.lossAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : scope.row.status === -1 ? 'info' : 'warning'">
              {{ scope.row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              style="color: #67c23a"
              @click="handleConfirm(scope.row)"
            >
              确认完成
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
            <el-button
              v-if="scope.row.status === 1"
              type="text"
              size="small"
              @click="handleCancel(scope.row)"
            >
              取消完成
            </el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockStocktakeRecords, type StocktakeRecord } from '@/data/mockData'
import { Search, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

const records = ref<StocktakeRecord[]>(JSON.parse(JSON.stringify(mockStocktakeRecords)))
const searchKeyword = ref('')
const searchStatus = ref<number | ''>('')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredRecords = computed(() => {
  return records.value.filter(item => {
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      if (!item.docNo.toLowerCase().includes(kw) && !item.warehouseName.toLowerCase().includes(kw)) return false
    }
    if (searchStatus.value !== '' && item.status !== searchStatus.value) return false
    return true
  })
})

const total = computed(() => filteredRecords.value.length)
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredRecords.value.slice(start, start + pageSize.value)
})

const handleSearch = () => { currentPage.value = 1 }
const handleRefresh = () => {
  records.value = JSON.parse(JSON.stringify(mockStocktakeRecords))
  searchKeyword.value = ''
  searchStatus.value = ''
  currentPage.value = 1
}
const handleSizeChange = (val: number) => { pageSize.value = val }
const handleCurrentChange = (val: number) => { currentPage.value = val }

const handleAdd = () => router.push('/inventory/stocktake/add')
const handleView = (row: StocktakeRecord) => router.push(`/inventory/stocktake/view/${row.id}`)
const handleEdit = (row: StocktakeRecord) => router.push(`/inventory/stocktake/edit/${row.id}`)

const handleConfirm = async (row: StocktakeRecord) => {
  await ElMessageBox.confirm(`确认完成盘点单「${row.docNo}」？确认后将自动生成盘盈入库单和盘亏出库单。`, '确认完成', { type: 'warning' })
  const idx = records.value.findIndex(r => r.id === row.id)
  if (idx !== -1) {
    records.value[idx] = {
      ...records.value[idx],
      status: 1,
      statusName: '已完成',
      relatedProfitDocNo: records.value[idx].profitAmount > 0 ? `PI-${row.takeDate.replace(/-/g, '')}-0001` : null,
      relatedLossDocNo: records.value[idx].lossAmount > 0 ? `LO-${row.takeDate.replace(/-/g, '')}-0001` : null
    }
    ElMessage.success('盘点已确认完成，已生成盈亏处理单据')
  }
}

const handleDelete = async (row: StocktakeRecord) => {
  await ElMessageBox.confirm(`确定要删除盘点单「${row.docNo}」吗？`, '提示', { type: 'warning' })
  const idx = records.value.findIndex(r => r.id === row.id)
  if (idx !== -1) {
    records.value[idx] = { ...records.value[idx], status: -1, statusName: '已删除' }
    ElMessage.success('已删除')
  }
}

const handleCancel = async (row: StocktakeRecord) => {
  await ElMessageBox.confirm(`取消完成将删除已生成的盈亏处理单据，并回到盘点中状态，确定继续？`, '取消完成', { type: 'warning' })
  const idx = records.value.findIndex(r => r.id === row.id)
  if (idx !== -1) {
    records.value[idx] = {
      ...records.value[idx],
      status: 0,
      statusName: '盘点中',
      relatedProfitDocNo: null,
      relatedLossDocNo: null
    }
    ElMessage.success('已取消完成，关联单据已删除')
  }
}
</script>

<style scoped>
.page-container { padding: 24px; }
.page-card { min-height: 400px; }
.header-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.search-bar { margin-bottom: 16px; display: flex; gap: 8px; align-items: center; }
.search-input { width: 320px; }
.search-status { width: 140px; }
.pagination { margin-top: 16px; text-align: right; }
</style>
