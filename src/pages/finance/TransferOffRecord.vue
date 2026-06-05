<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <span>转销记录</span>
        <div class="header-actions">
          <el-button type="primary" icon="Plus" @click="handleAdd">新增转销记录</el-button>
          <el-button icon="Refresh" @click="refreshList">刷新</el-button>
        </div>
      </template>

      <!-- 顶部搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="业务日期">
            <el-date-picker v-model="searchForm.tradeTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
          </el-form-item>
          <el-form-item label="原往来单位">
            <el-select v-model="searchForm.sourceBizContactId" placeholder="请选择原往来单位" clearable>
              <el-option v-for="contact in contactOptions" :key="contact.value" :label="contact.label" :value="contact.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="目标往来单位">
            <el-select v-model="searchForm.targetBizContactId" placeholder="请选择目标往来单位" clearable>
              <el-option v-for="contact in contactOptions" :key="contact.value" :label="contact.label" :value="contact.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型">
            <el-select v-model="searchForm.bizDocType" placeholder="请选择业务类型" clearable>
              <el-option label="应收款转销" :value="310" />
              <el-option label="应付款转销" :value="322" />
              <el-option label="预收款转销" :value="334" />
              <el-option label="预付款转销" :value="344" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="正常" :value="0" />
              <el-option label="已删除" :value="-1" />
            </el-select>
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
          <p class="summary-label">转销记录总数</p>
          <p class="summary-value">{{ pagination.total }}</p>
        </div>
        <div class="summary-card">
          <p class="summary-label">转销金额合计</p>
          <p class="summary-value highlight">¥ {{ formatNumber(totalAmount) }}</p>
        </div>
      </div>

      <!-- 数据列表区 -->
      <el-table :data="tableData" border v-loading="loading">
        <el-table-column prop="bizDocNo" label="业务单号" />
        <el-table-column prop="bizDocTypeName" label="业务类型" width="120" />
        <el-table-column prop="tradeTime" label="业务日期" width="120" />
        <el-table-column prop="sourceBizContactName" label="原往来单位" />
        <el-table-column prop="targetBizContactName" label="目标往来单位" />
        <el-table-column prop="accountName" label="往来账户" />
        <el-table-column prop="amount" label="转销金额" width="140">
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
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="text" size="small" @click="viewDetail(scope.row)">查看</el-button>
            <template v-if="scope.row.status === 0">
              <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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

    <!-- 新增/编辑弹窗 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="600px" @close="closeDialog">
      <div class="dialog-content">
        <el-form :model="formData" label-width="120px">
          <el-card class="form-card">
            <template #header>
              <span>基础信息</span>
            </template>
            <el-form-item label="业务日期" required>
              <el-date-picker v-model="formData.tradeTime" type="date" placeholder="请选择业务日期" />
            </el-form-item>
            <el-form-item label="往来账户" required>
              <el-select v-model="formData.accountId" placeholder="请选择往来账户">
                <el-option v-for="account in accountOptions" :key="account.value" :label="account.label" :value="account.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="原往来单位" required>
              <el-select v-model="formData.sourceBizContactId" placeholder="请选择原往来单位">
                <el-option v-for="contact in contactOptions" :key="contact.value" :label="contact.label" :value="contact.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="目标往来单位" required>
              <el-select v-model="formData.targetBizContactId" placeholder="请选择目标往来单位">
                <el-option v-for="contact in contactOptions" :key="contact.value" :label="contact.label" :value="contact.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="转销金额" required>
              <el-input-number v-model="formData.amount" :min="0.01" step="0.01" />
            </el-form-item>
            <el-form-item label="部门">
              <el-select v-model="formData.deptId" placeholder="请选择部门">
                <el-option v-for="dept in deptOptions" :key="dept.value" :label="dept.label" :value="dept.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目">
              <el-select v-model="formData.projectId" placeholder="请选择项目">
                <el-option v-for="project in projectOptions" :key="project.value" :label="project.label" :value="project.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formData.remark" type="textarea" :maxlength="256" placeholder="请输入备注（最多256字）" />
            </el-form-item>
          </el-card>
        </el-form>
      </div>
      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 详情弹窗 -->
    <el-dialog :title="detailTitle" :visible.sync="detailVisible" width="700px">
      <div v-if="detailData" class="detail-content">
        <el-card class="detail-card">
          <template #header>
            <span>基本信息</span>
          </template>
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
            <span class="detail-label">往来账户：</span>
            <span class="detail-value">{{ detailData.accountName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">原往来单位：</span>
            <span class="detail-value">{{ detailData.sourceBizContactName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">目标往来单位：</span>
            <span class="detail-value">{{ detailData.targetBizContactName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">转销金额：</span>
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

        <el-card class="detail-card" v-if="detailData.items && detailData.items.length > 0">
          <template #header>
            <span>转销明细</span>
          </template>
          <el-table :data="detailData.items" border>
            <el-table-column prop="arapId" label="挂账ID" />
            <el-table-column prop="amount" label="转销金额">
              <template #default="scope">¥ {{ formatNumber(scope.row.amount) }}</template>
            </el-table-column>
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
import { mockContacts, mockTransferOffRecords, mockAccounts, mockDepartments, mockProjects } from '@/data/mockData'

const activeTab = ref('writeOff')
const loading = ref(false)

const searchForm = reactive({
  tradeTime: [] as Date[],
  sourceBizContactId: '',
  targetBizContactId: '',
  bizDocType: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)

const detailVisible = ref(false)
const detailTitle = ref('')
const detailData = ref<any>(null)

const formData = reactive({
  tradeTime: new Date(),
  accountId: '',
  sourceBizContactId: '',
  targetBizContactId: '',
  amount: 0,
  deptId: '',
  projectId: '',
  remark: ''
})

const contactOptions = computed(() => 
  mockContacts.map(c => ({ value: c.id, label: c.name }))
)

const accountOptions = computed(() => 
  mockAccounts.map(a => ({ value: a.id, label: a.name }))
)

const deptOptions = computed(() => 
  mockDepartments.map(d => ({ value: d.id, label: d.name }))
)

const projectOptions = computed(() => 
  mockProjects.map(p => ({ value: p.id, label: p.projectName }))
)

const tableData = computed(() => {
  let data = mockTransferOffRecords.filter(r => r.status === 0)
  
  if (searchForm.sourceBizContactId) {
    data = data.filter(r => r.sourceBizContactId === searchForm.sourceBizContactId)
  }
  if (searchForm.targetBizContactId) {
    data = data.filter(r => r.targetBizContactId === searchForm.targetBizContactId)
  }
  if (searchForm.bizDocType) {
    data = data.filter(r => r.bizDocType === parseInt(searchForm.bizDocType))
  }
  
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return data.slice(start, end)
})

const totalAmount = computed(() => {
  return mockTransferOffRecords
    .filter(r => r.status === 0)
    .reduce((sum, r) => sum + r.amount, 0)
})

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleSearch = () => {
  pagination.page = 1
}

const resetSearch = () => {
  searchForm.tradeTime = []
  searchForm.sourceBizContactId = ''
  searchForm.targetBizContactId = ''
  searchForm.bizDocType = ''
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
  isEdit.value = false
  dialogTitle.value = '新增转销记录'
  formData.tradeTime = new Date()
  formData.accountId = ''
  formData.sourceBizContactId = ''
  formData.targetBizContactId = ''
  formData.amount = 0
  formData.deptId = ''
  formData.projectId = ''
  formData.remark = ''
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  dialogTitle.value = '编辑转销记录'
  formData.tradeTime = row.tradeTime
  formData.accountId = row.accountId
  formData.sourceBizContactId = row.sourceBizContactId
  formData.targetBizContactId = row.targetBizContactId
  formData.amount = row.amount
  formData.remark = row.remark || ''
  dialogVisible.value = true
}

const viewDetail = (row: any) => {
  detailData.value = row
  detailTitle.value = `${row.bizDocTypeName}详情`
  detailVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
}

const closeDetail = () => {
  detailVisible.value = false
  detailData.value = null
}

const submitForm = () => {
  console.log('提交表单:', formData)
  closeDialog()
  refreshList()
  ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
}

const handleDelete = (row: any) => {
  ElMessageBox.confirm('确认删除此转销记录？删除后将同时回滚相关挂账、账户明细及凭证数据。', {
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
  display: flex;
  gap: 8px;
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