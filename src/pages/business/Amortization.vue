<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>待摊费用（费用摊销）</span>
          <div>
            <el-button size="small" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>&nbsp;刷新
            </el-button>
            <el-button type="primary" size="small" @click="handleAdd">新增待摊费用</el-button>
          </div>
        </div>
      </template>

      <div class="summary-bar">
        <el-tag type="info">方案总数：<strong>{{ summary.totalCount }}</strong></el-tag>
        <el-tag type="warning">待执行：<strong>{{ summary.pendingCount }}</strong></el-tag>
        <el-tag type="primary">执行中：<strong>{{ summary.runningCount }}</strong></el-tag>
        <el-tag type="success">已完成：<strong>{{ summary.finishedCount }}</strong></el-tag>
        <el-tag type="info">已中止：<strong>{{ summary.abortedCount }}</strong></el-tag>
        <el-divider direction="vertical" />
        <el-tag type="danger">总金额：<strong>¥{{ summary.totalAmount.toFixed(2) }}</strong></el-tag>
        <el-tag>已摊销：<strong>¥{{ summary.amortizedAmount.toFixed(2) }}</strong></el-tag>
        <el-tag type="success">剩余：<strong>¥{{ summary.remainingAmount.toFixed(2) }}</strong></el-tag>
      </div>

      <div class="search-bar">
        <el-input v-model="searchForm.keyword" placeholder="按单据编号/待摊名称搜索" class="search-input" @keyup.enter="handleSearch" clearable>
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
        <el-select v-model="searchForm.status" placeholder="摊销状态" class="search-select" clearable>
          <el-option label="待执行" :value="0" />
          <el-option label="执行中" :value="1" />
          <el-option label="已完成" :value="2" />
          <el-option label="已中止" :value="3" />
        </el-select>
        <el-select v-model="searchForm.periodType" placeholder="周期类型" class="search-select" clearable>
          <el-option label="月" :value="1" />
          <el-option label="季" :value="2" />
          <el-option label="年" :value="3" />
        </el-select>
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          class="search-date"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <el-table :data="paginatedList" border>
        <el-table-column prop="bizDocNo" label="单据编号" min-width="170" />
        <el-table-column prop="name" label="待摊名称" min-width="140" />
        <el-table-column prop="tradeDate" label="业务日期" width="110" />
        <el-table-column prop="accountName" label="付款账户" min-width="120" />
        <el-table-column prop="categoryName" label="支出类别" min-width="110" />
        <el-table-column prop="staffName" label="业务员" width="90" />
        <el-table-column label="总金额" width="120" align="right">
          <template #default="scope">¥{{ scope.row.totalAmount.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="每期金额" width="120" align="right">
          <template #default="scope">¥{{ scope.row.periodAmount.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="amortPeriodTypeName" label="周期" width="70" align="center" />
        <el-table-column label="期限" min-width="140">
          <template #default="scope">{{ scope.row.amortStartDate }} ~ {{ scope.row.amortEndDate }}</template>
        </el-table-column>
        <el-table-column label="进度" min-width="140">
          <template #default="scope">
            <el-progress
              :percentage="scope.row.totalPeriods ? Math.round((scope.row.amortizedAmount / scope.row.totalAmount) * 100) : 0"
              :color="progressColor(scope.row)"
              :stroke-width="10"
            />
            <div class="progress-text">
              {{ scope.row.amortRecords.length }}/{{ scope.row.totalPeriods }} 期
            </div>
          </template>
        </el-table-column>
        <el-table-column label="累计摊销" width="130" align="right">
          <template #default="scope">
            <span style="color: #67c23a">¥{{ scope.row.amortizedAmount.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下一期日期" width="110" align="center">
          <template #default="scope">
            <span v-if="scope.row.nextAmortDate">{{ scope.row.nextAmortDate }}</span>
            <span v-else style="color: #c0c4cc">-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="90" align="center" fixed="right">
          <template #default="scope">
            <el-tag :type="statusTagType(scope.row.status)">{{ scope.row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="340" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button v-if="scope.row.status === 0" type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status === 0 || scope.row.status === 1"
              type="text"
              size="small"
              style="color: #67c23a"
              @click="handleExecute(scope.row)"
            >
              执行一期
            </el-button>
            <el-button
              v-if="scope.row.status === 0 || scope.row.status === 1"
              type="text"
              size="small"
              style="color: #e6a23c"
              @click="handleAbort(scope.row)"
            >
              中止
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

      <el-pagination
        class="pagination"
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :total="filteredList.length"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockAmortizations, type AmortizationRecord } from '@/data/mockData'
import { Search, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

const records = ref<AmortizationRecord[]>(JSON.parse(JSON.stringify(mockAmortizations)))

const searchForm = reactive({
  keyword: '',
  status: '' as number | '',
  periodType: '' as number | '',
  dateRange: null as string[] | null
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10
})

const filteredList = computed(() => {
  return records.value.filter(item => {
    if (searchForm.keyword) {
      const kw = searchForm.keyword.toLowerCase()
      if (!item.bizDocNo.toLowerCase().includes(kw) && !item.name.toLowerCase().includes(kw)) return false
    }
    if (searchForm.status !== '' && item.status !== searchForm.status) return false
    if (searchForm.periodType !== '' && item.amortPeriodType !== searchForm.periodType) return false
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      const [start, end] = searchForm.dateRange
      if (item.tradeDate < start || item.tradeDate > end) return false
    }
    return true
  })
})

const summary = computed(() => {
  const list = records.value
  return {
    totalCount: list.length,
    pendingCount: list.filter(r => r.status === 0).length,
    runningCount: list.filter(r => r.status === 1).length,
    finishedCount: list.filter(r => r.status === 2).length,
    abortedCount: list.filter(r => r.status === 3).length,
    totalAmount: list.reduce((s, r) => s + r.totalAmount, 0),
    amortizedAmount: list.reduce((s, r) => s + r.amortizedAmount, 0),
    remainingAmount: list.reduce((s, r) => s + Math.max(0, r.totalAmount - r.amortizedAmount), 0)
  }
})

const paginatedList = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  return filteredList.value.slice(start, start + pagination.pageSize)
})

const statusTagType = (status: number) => {
  switch (status) {
    case 0: return 'info'
    case 1: return 'primary'
    case 2: return 'success'
    case 3: return 'warning'
    default: return ''
  }
}

const progressColor = (row: AmortizationRecord) => {
  const pct = row.totalAmount ? (row.amortizedAmount / row.totalAmount) * 100 : 0
  if (pct >= 100) return '#67c23a'
  if (pct >= 50) return '#409eff'
  return '#e6a23c'
}

const handleSearch = () => { pagination.currentPage = 1 }

const handleRefresh = () => {
  records.value = JSON.parse(JSON.stringify(mockAmortizations))
  searchForm.keyword = ''
  searchForm.status = ''
  searchForm.periodType = ''
  searchForm.dateRange = null
  pagination.currentPage = 1
  ElMessage.success('已刷新')
}

const handleAdd = () => router.push('/business/amortization/add')
const handleView = (row: AmortizationRecord) => router.push(`/business/amortization/view/${row.id}`)
const handleEdit = (row: AmortizationRecord) => router.push(`/business/amortization/edit/${row.id}`)

const handleExecute = async (row: AmortizationRecord) => {
  await ElMessageBox.confirm(`对「${row.name}」手动执行一期摊销？执行后将自动生成摊销凭证。`, '执行一期', { type: 'warning' })
  const idx = records.value.findIndex(r => r.id === row.id)
  if (idx === -1) return
  const r = records.value[idx]
  if (r.remainingPeriods <= 0) {
    ElMessage.warning('已无剩余期数')
    return
  }
  const now = new Date()
  const nextPeriodNo = r.amortRecords.length + 1
  const nextDate = r.nextAmortDate || r.amortStartDate
  const periodAmount = r.periodAmount
  const newRecord = {
    recordId: `${r.id}-R${nextPeriodNo}`,
    periodNo: nextPeriodNo,
    amortDate: nextDate,
    amortAmount: periodAmount,
    voucherNo: `记-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${String(nextPeriodNo).padStart(3, '0')}`,
    createTime: now.toLocaleString('zh-CN', { hour12: false })
  }
  r.amortRecords.push(newRecord)
  r.amortizedAmount = Number((r.amortizedAmount + periodAmount).toFixed(4))
  r.remainingPeriods = r.totalPeriods - r.amortRecords.length
  r.status = r.remainingPeriods <= 0 ? 2 : 1
  r.statusName = r.status === 2 ? '已完成' : '执行中'
  r.nextAmortDate = r.remainingPeriods > 0 ? calcNextDate(r.amortStartDate, r.amortPeriodType, r.amortRecords.length) : ''
  r.updateTime = now.toLocaleString('zh-CN', { hour12: false })
  ElMessage.success(`执行成功，生成凭证：${newRecord.voucherNo}`)
}

const handleAbort = async (row: AmortizationRecord) => {
  await ElMessageBox.confirm(`中止「${row.name}」的摊销方案？中止后可选生成冲销凭证。`, '中止摊销', { type: 'warning' })
  const idx = records.value.findIndex(r => r.id === row.id)
  if (idx !== -1) {
    records.value[idx].status = 3
    records.value[idx].statusName = '已中止'
    records.value[idx].nextAmortDate = ''
    ElMessage.success('已中止摊销方案')
  }
}

const handleDelete = async (row: AmortizationRecord) => {
  await ElMessageBox.confirm(`确定删除「${row.name}」吗？删除后不可恢复`, '删除', { type: 'error' })
  const idx = records.value.findIndex(r => r.id === row.id)
  if (idx !== -1) {
    records.value.splice(idx, 1)
    ElMessage.success('已删除')
  }
}

const calcNextDate = (start: string, periodType: number, elapsedPeriods: number): string => {
  const d = new Date(start)
  const step = periodType === 1 ? 1 : periodType === 2 ? 3 : 12
  d.setMonth(d.getMonth() + step * elapsedPeriods)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
</script>

<style scoped>
.page-container { padding: 24px; }
.page-card { min-height: 400px; }
.header-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.summary-bar { margin-bottom: 16px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.search-bar { margin-bottom: 16px; display: flex; gap: 10px; align-items: center; }
.search-input { width: 280px; }
.search-select { width: 130px; }
.search-date { width: 260px; }
.pagination { margin-top: 16px; text-align: right; }
.progress-text { text-align: center; font-size: 12px; color: #606266; margin-top: 2px; }
</style>
