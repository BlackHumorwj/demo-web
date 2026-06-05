<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <span>往来款挂账列表</span>
        <div class="header-actions">
          <el-button type="primary" icon="Refresh" @click="refreshList">刷新</el-button>
        </div>
      </template>

      <!-- 标签导航栏 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="tab-nav">
        <el-tab-pane label="应收款" name="receivable">
          <span class="tab-badge">{{ receivableCount }}</span>
        </el-tab-pane>
        <el-tab-pane label="应付款" name="payable">
          <span class="tab-badge">{{ payableCount }}</span>
        </el-tab-pane>
        <el-tab-pane label="预收款" name="preReceipt">
          <span class="tab-badge">{{ preReceiptCount }}</span>
        </el-tab-pane>
        <el-tab-pane label="预付款" name="prePayment">
          <span class="tab-badge">{{ prePaymentCount }}</span>
        </el-tab-pane>
        <el-tab-pane label="借入款" name="borrowed">
          <span class="tab-badge">{{ borrowedCount }}</span>
        </el-tab-pane>
        <el-tab-pane label="借出款" name="loaned">
          <span class="tab-badge">{{ loanedCount }}</span>
        </el-tab-pane>
      </el-tabs>

      <!-- 顶部搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="业务单据编号">
            <el-input v-model="searchForm.bizDocNo" placeholder="请输入业务单据编号" clearable />
          </el-form-item>
          <el-form-item label="往来单位">
            <el-select v-model="searchForm.bizContactId" placeholder="请选择往来单位" clearable>
              <el-option v-for="contact in contactOptions" :key="contact.value" :label="contact.label" :value="contact.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务日期">
            <el-date-picker v-model="searchForm.tradeTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 统计卡片 -->
      <div class="summary-cards">
        <div class="summary-card">
          <p class="summary-label">挂账金额</p>
          <p class="summary-value">¥ {{ formatNumber(totalAmount) }}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">已核销金额</p>
          <p class="summary-value secondary">¥ {{ formatNumber(totalOffsetAmount) }}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">余额</p>
          <p class="summary-value highlight">¥ {{ formatNumber(totalBalance) }}</p>
        </div>
      </div>

      <!-- 数据列表区 -->
      <el-table :data="tableData" border v-loading="loading">
        <el-table-column prop="arapId" label="挂账ID" width="100" />
        <el-table-column prop="bizDocNo" label="业务单据编号" />
        <el-table-column prop="bizContactName" label="往来单位" />
        <el-table-column prop="accountName" label="挂账账户" />
        <el-table-column prop="tradeTime" label="业务日期" width="120" />
        <el-table-column prop="dueDate" label="到期日" width="120">
          <template #default="scope">
            <span :class="{ 'overdue': scope.row.overdue }">{{ scope.row.dueDate || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="挂账金额" width="140">
          <template #default="scope">
            <span class="amount">¥ {{ formatNumber(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="offsetAmount" label="已核销金额" width="140">
          <template #default="scope">
            <span>¥ {{ formatNumber(scope.row.offsetAmount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="balance" label="余额" width="140">
          <template #default="scope">
            <span :class="{ 'balance-warning': scope.row.balance > 0 && scope.row.overdue }">¥ {{ formatNumber(scope.row.balance) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400">
          <template #default="scope">
            <div class="operation-buttons">
              <el-button type="text" size="small" @click="viewDetail(scope.row)">查看明细</el-button>
              <template v-if="scope.row.status === 0">
                <el-button 
                  v-for="op in getOperations(scope.row.arapType)" 
                  :key="op.code"
                  type="text" 
                  size="small" 
                  @click="handleOperation(scope.row, op)"
                >{{ op.label }}</el-button>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页区 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog :title="detailTitle" :visible.sync="detailVisible" width="600px">
      <div v-if="currentRow" class="detail-content">
        <el-card class="detail-card">
          <template #header>
            <span>挂账信息</span>
          </template>
          <div class="detail-row">
            <span class="detail-label">挂账ID：</span>
            <span class="detail-value">{{ currentRow.arapId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">业务单据编号：</span>
            <span class="detail-value">{{ currentRow.bizDocNo }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">往来单位：</span>
            <span class="detail-value">{{ currentRow.bizContactName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">挂账账户：</span>
            <span class="detail-value">{{ currentRow.accountName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">业务日期：</span>
            <span class="detail-value">{{ currentRow.tradeTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">到期日：</span>
            <span class="detail-value" :class="{ 'overdue': currentRow.overdue }">{{ currentRow.dueDate || '-' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">挂账金额：</span>
            <span class="detail-value">¥ {{ formatNumber(currentRow.amount) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">已核销金额：</span>
            <span class="detail-value">¥ {{ formatNumber(currentRow.offsetAmount) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">余额：</span>
            <span class="detail-value" :class="{ 'balance-warning': currentRow.balance > 0 && currentRow.overdue }">¥ {{ formatNumber(currentRow.balance) }}</span>
          </div>
          <div v-if="currentRow.overdue" class="detail-row">
            <span class="detail-label">逾期天数：</span>
            <span class="detail-value overdue">{{ currentRow.daysOverdue }}天</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">状态：</span>
            <span class="detail-value">{{ currentRow.status === 0 ? '正常' : '已删除' }}</span>
          </div>
        </el-card>
      </div>
      <template #footer>
        <el-button @click="closeDetail">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockContacts, mockArapList, arapOperations } from '@/data/mockData'

// 标签页状态
const activeTab = ref('receivable')
const loading = ref(false)
const router = useRouter()

// 搜索表单
const searchForm = reactive({
  bizDocNo: '',
  bizContactId: '',
  tradeTime: [] as Date[]
})

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 当前选中行
const currentRow = ref<any>(null)

// 详情弹窗状态
const detailVisible = ref(false)
const detailTitle = ref('')

// 挂账类型映射
const arapTypeMap: Record<string, number> = {
  receivable: 1,
  payable: 2,
  preReceipt: 3,
  prePayment: 4,
  borrowed: 5,
  loaned: 6
}

// 往来单位选项
const contactOptions = computed(() => 
  mockContacts
    .filter(c => c.status === 1)
    .map(c => ({ value: c.id, label: c.name }))
)

// 表单数据
const formData = reactive({
  bizContactId: '',
  sourceBizContactId: ''
})

// 统计数据
const receivableCount = computed(() => mockArapList.filter(a => a.arapType === 1 && a.status === 0).length)
const payableCount = computed(() => mockArapList.filter(a => a.arapType === 2 && a.status === 0).length)
const preReceiptCount = computed(() => mockArapList.filter(a => a.arapType === 3 && a.status === 0).length)
const prePaymentCount = computed(() => mockArapList.filter(a => a.arapType === 4 && a.status === 0).length)
const borrowedCount = computed(() => mockArapList.filter(a => a.arapType === 5 && a.status === 0).length)
const loanedCount = computed(() => mockArapList.filter(a => a.arapType === 6 && a.status === 0).length)

// 当前标签页数据
const tableData = computed(() => {
  const type = arapTypeMap[activeTab.value]
  let data = mockArapList.filter(a => a.arapType === type && a.status === 0)
  
  // 搜索过滤
  if (searchForm.bizDocNo) {
    data = data.filter(a => a.bizDocNo?.includes(searchForm.bizDocNo))
  }
  if (searchForm.bizContactId) {
    data = data.filter(a => a.bizContactId === searchForm.bizContactId)
  }
  
  // 分页
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return data.slice(start, end)
})

// 统计金额
const totalAmount = computed(() => {
  const type = arapTypeMap[activeTab.value]
  return mockArapList
    .filter(a => a.arapType === type && a.status === 0)
    .reduce((sum, a) => sum + a.amount, 0)
})

const totalOffsetAmount = computed(() => {
  const type = arapTypeMap[activeTab.value]
  return mockArapList
    .filter(a => a.arapType === type && a.status === 0)
    .reduce((sum, a) => sum + a.offsetAmount, 0)
})

const totalBalance = computed(() => totalAmount.value - totalOffsetAmount.value)

// 当前往来单位名称
const currentContactName = computed(() => {
  const id = formData.bizContactId || formData.sourceBizContactId
  return mockContacts.find(c => c.id === id)?.name || ''
})

// 格式化金额
const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 标签切换
const handleTabChange = () => {
  pagination.page = 1
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
}

// 重置搜索
const resetSearch = () => {
  searchForm.bizDocNo = ''
  searchForm.bizContactId = ''
  searchForm.tradeTime = []
  pagination.page = 1
}

// 分页变更
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
}

const handlePageChange = (page: number) => {
  pagination.page = page
}

// 刷新列表
const refreshList = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
}

// 获取当前挂账类型的可用操作
const getOperations = (arapType: number) => {
  return arapOperations[arapType] || []
}

// 处理业务操作 - 路由跳转
const handleOperation = (row: any, op: any) => {
  router.push(`/finance/receivable/operation/${op.type}/${op.code}/${row.arapId}`)
}

// 查看详情
const viewDetail = (row: any) => {
  currentRow.value = row
  detailTitle.value = `${row.arapTypeName}详情`
  detailVisible.value = true
}

// 关闭详情弹窗
const closeDetail = () => {
  detailVisible.value = false
  currentRow.value = null
}



</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-card {
  min-height: 500px;
}

.header-actions {
  float: right;
}

.tab-nav {
  margin-bottom: 20px;
}

.tab-badge {
  background-color: #409eff;
  color: #fff;
  font-size: 12px;
  padding: 0 6px;
  border-radius: 10px;
  margin-left: 4px;
}

.search-bar {
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;
}

.summary-cards {
  display: flex;
  gap: 20px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
  margin-bottom: 20px;
}

.summary-card {
  flex: 1;
  text-align: center;
}

.summary-label {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.summary-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.summary-value.secondary {
  color: #6b7280;
}

.summary-value.highlight {
  color: #22c55e;
}

.pagination-container {
  text-align: right;
  margin-top: 20px;
}

.amount {
  font-weight: 500;
}

.balance-warning {
  color: #f59e0b;
}

.overdue {
  color: #ef4444;
}

.dialog-content {
  max-height: 60vh;
  overflow-y: auto;
}

.form-card {
  margin-bottom: 16px;
}

.form-card:deep(.el-card__header) {
  padding: 12px 16px;
  background-color: #f9fafb;
}

.form-value {
  margin-left: 8px;
  color: #1f2937;
  font-weight: 500;
}

.available-hint {
  margin-left: 8px;
  color: #6b7280;
  font-size: 13px;
}

.badge {
  background-color: #409eff;
  color: #fff;
  font-size: 12px;
  padding: 0 6px;
  border-radius: 10px;
}

.detail-content {
  max-height: 60vh;
  overflow-y: auto;
}

.detail-card {
  margin-bottom: 16px;
}

.detail-card:deep(.el-card__header) {
  padding: 12px 16px;
  background-color: #f9fafb;
}

.detail-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-label {
  width: 120px;
  color: #6b7280;
  flex-shrink: 0;
}

.detail-value {
  flex: 1;
  color: #1f2937;
}

.operation-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>