<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <span>往来业务记录</span>
        <div class="header-actions">
          <el-button type="primary" icon="Refresh" @click="refreshList">刷新</el-button>
        </div>
      </template>

      <!-- 标签导航栏 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="tab-nav">
        <el-tab-pane label="核销单据" name="writeOff">
          <span class="tab-badge">{{ writeOffCount }}</span>
        </el-tab-pane>
        <el-tab-pane label="收付款单据" name="receipt">
          <span class="tab-badge">{{ receiptCount }}</span>
        </el-tab-pane>
        <el-tab-pane label="转收支单据" name="transfer">
          <span class="tab-badge">{{ transferCount }}</span>
        </el-tab-pane>
      </el-tabs>

      <!-- 顶部搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="业务单号">
            <el-input v-model="searchForm.bizDocNo" placeholder="请输入业务单号" clearable />
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
          <p class="summary-label">单据总数</p>
          <p class="summary-value">{{ pagination.total }}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">金额合计</p>
          <p class="summary-value highlight">¥ {{ formatNumber(totalAmount) }}</p>
        </div>
      </div>

      <!-- 数据列表区 -->
      <el-table :data="tableData" border v-loading="loading">
        <el-table-column prop="bizDocId" label="业务单据ID" width="120" />
        <el-table-column prop="bizDocNo" label="业务单号" />
        <el-table-column prop="bizDocTypeName" label="业务类型" width="120" />
        <el-table-column prop="tradeTime" label="业务日期" width="120" />
        <el-table-column prop="bizContactName" label="往来单位" />
        <el-table-column prop="accountName" label="账户" />
        <el-table-column prop="amount" label="金额" width="140">
          <template #default="scope">
            <span class="amount">¥ {{ formatNumber(scope.row.amount) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="writerName" label="制单人" width="100" />
        <el-table-column prop="writerTime" label="制单时间" width="160" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="text" size="small" @click="viewDetail(scope.row)">详情</el-button>
            <template v-if="scope.row.status === 0">
              <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
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
    <el-dialog :title="detailTitle" :visible.sync="detailVisible" width="700px">
      <div v-if="detailData" class="detail-content">
        <el-card class="detail-card">
          <template #header>
            <span>基本信息</span>
          </template>
          <div class="detail-row">
            <span class="detail-label">业务单据ID：</span>
            <span class="detail-value">{{ detailData.bizDocId }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">业务单号：</span>
            <span class="detail-value">{{ detailData.bizDocNo }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">业务类型：</span>
            <span class="detail-value">{{ detailData.bizDocTypeName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">业务日期：</span>
            <span class="detail-value">{{ detailData.tradeTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">往来单位：</span>
            <span class="detail-value">{{ detailData.bizContactName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">账户：</span>
            <span class="detail-value">{{ detailData.accountName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">金额：</span>
            <span class="detail-value highlight">¥ {{ formatNumber(detailData.amount) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">制单人：</span>
            <span class="detail-value">{{ detailData.writerName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">制单时间：</span>
            <span class="detail-value">{{ detailData.writerTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">备注：</span>
            <span class="detail-value">{{ detailData.remark || '-' }}</span>
          </div>
        </el-card>

        <!-- 核销明细 -->
        <el-card class="detail-card" v-if="detailData.items && detailData.items.length > 0">
          <template #header>
            <span>明细</span>
          </template>
          <el-table :data="detailData.items" border>
            <el-table-column prop="arapId" label="挂账ID" />
            <el-table-column prop="amount" label="金额">
              <template #default="scope">¥ {{ formatNumber(scope.row.amount) }}</template>
            </el-table-column>
            <el-table-column prop="arapTypeName" label="挂账类型" v-if="detailData.items[0]?.arapTypeName" />
          </el-table>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockContacts, mockReceiptRecords, mockWriteOffRecords, mockTransferRecords } from '@/data/mockData'

// 标签页状态
const activeTab = ref('writeOff')
const loading = ref(false)

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

// 详情弹窗
const detailVisible = ref(false)
const detailTitle = ref('')
const detailData = ref<any>(null)

// 选项列表
const contactOptions = computed(() => 
  mockContacts.map(c => ({ value: c.id, label: c.name }))
)

// 统计数据
const writeOffCount = computed(() => mockWriteOffRecords.filter(r => r.status === 0).length)
const receiptCount = computed(() => mockReceiptRecords.filter(r => r.status === 0).length)
const transferCount = computed(() => mockTransferRecords.filter(r => r.status === 0).length)

// 当前标签页数据
const tableData = computed(() => {
  let data: any[] = []
  
  switch (activeTab.value) {
    case 'writeOff':
      data = mockWriteOffRecords.filter(r => r.status === 0)
      break
    case 'receipt':
      data = mockReceiptRecords.filter(r => r.status === 0)
      break
    case 'transfer':
      data = mockTransferRecords.filter(r => r.status === 0)
      break
  }
  
  // 搜索过滤
  if (searchForm.bizDocNo) {
    data = data.filter(r => r.bizDocNo?.includes(searchForm.bizDocNo))
  }
  if (searchForm.bizContactId) {
    data = data.filter(r => r.bizContactId === searchForm.bizContactId)
  }
  
  // 分页
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return data.slice(start, end)
})

// 统计金额
const totalAmount = computed(() => {
  let data: any[] = []
  
  switch (activeTab.value) {
    case 'writeOff':
      data = mockWriteOffRecords.filter(r => r.status === 0)
      break
    case 'receipt':
      data = mockReceiptRecords.filter(r => r.status === 0)
      break
    case 'transfer':
      data = mockTransferRecords.filter(r => r.status === 0)
      break
  }
  
  return data.reduce((sum, r) => sum + r.amount, 0)
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

// 查看详情
const viewDetail = (row: any) => {
  detailData.value = row
  detailTitle.value = `${row.bizDocTypeName}详情`
  detailVisible.value = true
}

// 关闭详情
const closeDetail = () => {
  detailVisible.value = false
  detailData.value = null
}

// 删除操作
const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此记录？删除后将同时回滚相关挂账、账户明细及凭证数据。', {
    confirmButtonText: '确认删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    refreshList()
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

.detail-value.highlight {
  color: #22c55e;
  font-weight: 600;
}
</style>