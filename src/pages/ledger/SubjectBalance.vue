<template>
  <div class="subject-balance-page">
    <div class="page-header">
      <el-button type="primary" icon="Plus" @click="handleAdd">新增余额</el-button>
      <el-button icon="Download" @click="handleExport">导出Excel</el-button>
      <el-button icon="Refresh" @click="handleRefresh">刷新</el-button>
    </div>
    
    <div class="filter-section">
      <el-form :model="filterForm" inline>
        <el-form-item label="账本">
          <el-select v-model="filterForm.ledgerId" placeholder="请选择账本">
            <el-option label="主账本" :value="1" />
            <el-option label="备用账本" :value="2" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="公司">
          <el-select v-model="filterForm.companyId" placeholder="请选择公司">
            <el-option label="示例科技有限公司" :value="101" />
            <el-option label="创新贸易有限公司" :value="102" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="期间">
          <el-select v-model="filterForm.periodId" placeholder="请选择会计期间">
            <el-option label="全部" :value="0" />
            <el-option label="2024年04月" :value="202404" />
            <el-option label="2024年05月" :value="202405" />
            <el-option label="2024年06月" :value="202406" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="科目类型">
          <el-select v-model="filterForm.subjectType" placeholder="请选择科目类型">
            <el-option label="全部" :value="0" />
            <el-option label="资产类" :value="1" />
            <el-option label="负债类" :value="2" />
            <el-option label="权益类" :value="3" />
            <el-option label="成本类" :value="4" />
            <el-option label="损益类" :value="5" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="请选择状态">
            <el-option label="全部" :value="-2" />
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
    
    <div class="summary-section" v-if="summary">
      <el-card class="summary-card">
        <div class="summary-item">
          <span class="summary-label">期初借方总计：</span>
          <span class="summary-value debit">{{ summary.totalBeginDebit.toLocaleString() }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">期初贷方总计：</span>
          <span class="summary-value credit">{{ summary.totalBeginCredit.toLocaleString() }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">期末借方总计：</span>
          <span class="summary-value debit">{{ summary.totalEndDebit.toLocaleString() }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">期末贷方总计：</span>
          <span class="summary-value credit">{{ summary.totalEndCredit.toLocaleString() }}</span>
        </div>
      </el-card>
    </div>
    
    <el-table
      :data="tableData"
      border
      stripe
      :show-summary="true"
      :summary-method="getSummary"
      class="balance-table"
    >
      <el-table-column prop="subjectCode" label="科目编码" width="120" />
      <el-table-column prop="subjectName" label="科目名称" width="150" />
      <el-table-column prop="periodName" label="期间" width="120" />
      <el-table-column prop="subjectTypeName" label="科目类型" width="100" />
      <el-table-column prop="beginDebit" label="期初借方" width="120" align="right">
        <template #default="scope">
          {{ formatAmount(scope.row.beginDebit) }}
        </template>
      </el-table-column>
      <el-table-column prop="beginCredit" label="期初贷方" width="120" align="right">
        <template #default="scope">
          {{ formatAmount(scope.row.beginCredit) }}
        </template>
      </el-table-column>
      <el-table-column prop="currentDebit" label="本期借方" width="120" align="right">
        <template #default="scope">
          {{ formatAmount(scope.row.currentDebit) }}
        </template>
      </el-table-column>
      <el-table-column prop="currentCredit" label="本期贷方" width="120" align="right">
        <template #default="scope">
          {{ formatAmount(scope.row.currentCredit) }}
        </template>
      </el-table-column>
      <el-table-column prop="endDebit" label="期末借方" width="120" align="right">
        <template #default="scope">
          {{ formatAmount(scope.row.endDebit) }}
        </template>
      </el-table-column>
      <el-table-column prop="endCredit" label="期末贷方" width="120" align="right">
        <template #default="scope">
          {{ formatAmount(scope.row.endCredit) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'warning'">
            {{ scope.row.status === 0 ? '正常' : '已删除' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="160" />
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button
            v-if="scope.row.status === 0"
            size="small"
            icon="Edit"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="scope.row.status === 0"
            size="small"
            icon="Delete"
            type="danger"
            @click="handleDelete(scope.row)"
          >删除</el-button>
          <el-button
            v-if="scope.row.status === -1"
            size="small"
            icon="RotateRight"
            type="success"
            @click="handleRestore(scope.row)"
          >恢复</el-button>
          <el-button
            size="small"
            icon="Eye"
            @click="handleView(scope.row)"
          >查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <SubjectBalanceModal
      :visible="modalVisible"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="modalVisible = false"
      @submit="handleModalSubmit"
    />
    
    <el-dialog
      v-if="detailVisible"
      title="科目余额详情"
      :visible="detailVisible"
      width="600px"
      @close="detailVisible = false"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="账本">{{ detailData?.ledgerName }}</el-descriptions-item>
        <el-descriptions-item label="公司">{{ detailData?.companyName }}</el-descriptions-item>
        <el-descriptions-item label="科目编码">{{ detailData?.subjectCode }}</el-descriptions-item>
        <el-descriptions-item label="科目名称">{{ detailData?.subjectName }}</el-descriptions-item>
        <el-descriptions-item label="会计期间">{{ detailData?.periodName }}</el-descriptions-item>
        <el-descriptions-item label="科目类型">{{ getSubjectTypeName(detailData?.subjectType) }}</el-descriptions-item>
        <el-descriptions-item label="期初借方">{{ formatAmount(detailData?.beginDebit) }}</el-descriptions-item>
        <el-descriptions-item label="期初贷方">{{ formatAmount(detailData?.beginCredit) }}</el-descriptions-item>
        <el-descriptions-item label="本期借方">{{ formatAmount(detailData?.currentDebit) }}</el-descriptions-item>
        <el-descriptions-item label="本期贷方">{{ formatAmount(detailData?.currentCredit) }}</el-descriptions-item>
        <el-descriptions-item label="期末借方">{{ formatAmount(detailData?.endDebit) }}</el-descriptions-item>
        <el-descriptions-item label="期末贷方">{{ formatAmount(detailData?.endCredit) }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="detailData?.status === 0 ? 'success' : 'warning'">
            {{ detailData?.status === 0 ? '正常' : '已删除' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注">{{ detailData?.remark || '-' }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ detailData?.creatorName }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ detailData?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新人">{{ detailData?.updaterName }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ detailData?.updateTime }}</el-descriptions-item>
      </el-descriptions>
      
      <div v-if="detailData?.operationLogs?.length" class="logs-section">
        <el-divider content-position="left">操作日志</el-divider>
        <el-timeline>
          <el-timeline-item
            v-for="log in detailData.operationLogs"
            :key="log.logId"
            :timestamp="log.operTime"
          >
            <el-card size="small">
              <div><strong>{{ getOperTypeName(log.operType) }}</strong> - {{ log.operUser }}</div>
              <div>{{ log.content }}</div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
    
    <el-dialog
      v-if="deleteConfirmVisible"
      title="确认删除"
      :visible="deleteConfirmVisible"
      width="400px"
    >
      <p>确定要删除这条科目余额记录吗？</p>
      <el-form-item label="删除原因" prop="deleteReason">
        <el-input
          v-model="deleteReason"
          type="textarea"
          placeholder="请输入删除原因（必填）"
          rows="3"
        />
      </el-form-item>
      <template #footer>
        <el-button @click="deleteConfirmVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmDelete">确定删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import SubjectBalanceModal from '@/components/SubjectBalanceModal.vue'
import {
  getSubjectBalanceList,
  getSubjectBalanceDetail,
  createSubjectBalance,
  updateSubjectBalance,
  deleteSubjectBalance,
  restoreSubjectBalance
} from '@/services/subjectBalance'
import type {
  SubjectBalanceItem,
  SubjectBalanceDetail,
  SubjectBalanceSummary,
  CreateSubjectBalanceRequest,
  UpdateSubjectBalanceRequest
} from '@/types/subjectBalance'

const filterForm = reactive({
  ledgerId: 1,
  companyId: 101,
  periodId: 0,
  subjectType: 0,
  status: -2
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const tableData = ref<SubjectBalanceItem[]>([])
const summary = ref<SubjectBalanceSummary | null>(null)

const modalVisible = ref(false)
const isEdit = ref(false)
const editData = ref<any>({})

const detailVisible = ref(false)
const detailData = ref<SubjectBalanceDetail | null>(null)

const deleteConfirmVisible = ref(false)
const deleteReason = ref('')
const deletingRow = ref<any>(null)

const loading = ref(false)

const subjectTypeNames: Record<number, string> = {
  1: '资产类',
  2: '负债类',
  3: '权益类',
  4: '成本类',
  5: '损益类'
}

const operTypeNames: Record<string, string> = {
  CREATE: '新增',
  UPDATE: '编辑',
  DELETE: '删除',
  RESTORE: '恢复'
}

const getSubjectTypeName = (type?: number) => type ? subjectTypeNames[type] || '未知' : '未知'
const getOperTypeName = (type?: string) => type ? operTypeNames[type] || type : '未知'

const formatAmount = (amount?: number) => {
  if (!amount) return '0.00'
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const getSummary = (param: any) => {
  const { columns, data } = param
  const sums: any[] = []
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = '合计'
      return
    }
    const values = data.map((item: any) => {
      const value = item[column.prop]
      return typeof value === 'number' ? value : 0
    })
    const sum = values.reduce((prev: number, curr: number) => prev + curr, 0)
    sums[index] = formatAmount(sum)
  })
  return sums
}

const fetchData = async () => {
  loading.value = true
  try {
    const params: any = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ledgerId: filterForm.ledgerId,
      companyId: filterForm.companyId
    }
    
    if (filterForm.periodId > 0) {
      params.periodId = filterForm.periodId
    }
    if (filterForm.subjectType > 0) {
      params.subjectType = filterForm.subjectType
    }
    if (filterForm.status !== -2) {
      params.status = filterForm.status
    }
    
    const response = await getSubjectBalanceList(params)
    
    if (response.code === 0) {
      tableData.value = response.data.list.map((item: SubjectBalanceItem) => ({
        ...item,
        subjectTypeName: getSubjectTypeName(item.subjectType)
      }))
      pagination.total = response.data.total
      summary.value = response.data.summary
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  fetchData()
}

const handleReset = () => {
  filterForm.ledgerId = 1
  filterForm.companyId = 101
  filterForm.periodId = 0
  filterForm.subjectType = 0
  filterForm.status = -2
  pagination.page = 1
  fetchData()
}

const handleRefresh = () => {
  fetchData()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}

const handleCurrentChange = (page: number) => {
  pagination.page = page
  fetchData()
}

const handleAdd = () => {
  isEdit.value = false
  editData.value = {}
  modalVisible.value = true
}

const handleEdit = (row: any) => {
  isEdit.value = true
  editData.value = row
  modalVisible.value = true
}

const handleView = async (row: any) => {
  loading.value = true
  try {
    const response = await getSubjectBalanceDetail({
      balanceId: row.balanceId,
      ledgerId: filterForm.ledgerId,
      companyId: filterForm.companyId
    })
    
    if (response.code === 0) {
      detailData.value = response.data
      detailVisible.value = true
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = (row: any) => {
  deletingRow.value = row
  deleteReason.value = ''
  deleteConfirmVisible.value = true
}

const confirmDelete = async () => {
  if (!deleteReason.value.trim()) {
    ElMessage.warning('请输入删除原因')
    return
  }
  
  loading.value = true
  try {
    const response = await deleteSubjectBalance(deletingRow.value.balanceId, {
      ledgerId: filterForm.ledgerId,
      companyId: filterForm.companyId,
      deleteReason: deleteReason.value
    })
    
    if (response.code === 0) {
      ElMessage.success('删除成功')
      deleteConfirmVisible.value = false
      fetchData()
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('删除失败')
  } finally {
    loading.value = false
  }
}

const handleRestore = async (row: any) => {
  loading.value = true
  try {
    const response = await restoreSubjectBalance(row.balanceId, {
      ledgerId: filterForm.ledgerId,
      companyId: filterForm.companyId
    })
    
    if (response.code === 0) {
      ElMessage.success('恢复成功')
      fetchData()
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error('恢复失败')
  } finally {
    loading.value = false
  }
}

const handleModalSubmit = async (data: CreateSubjectBalanceRequest | UpdateSubjectBalanceRequest, edit: boolean, balanceId?: number) => {
  loading.value = true
  try {
    let response
    
    if (edit && balanceId) {
      response = await updateSubjectBalance(balanceId, data as UpdateSubjectBalanceRequest)
    } else {
      response = await createSubjectBalance(data as CreateSubjectBalanceRequest)
    }
    
    if (response.code === 0) {
      ElMessage.success(edit ? '编辑成功' : '新增成功')
      modalVisible.value = false
      fetchData()
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    ElMessage.error(edit ? '编辑失败' : '新增失败')
  } finally {
    loading.value = false
  }
}

const handleExport = () => {
  ElMessage.info('导出功能开发中...')
}

fetchData()
</script>

<style scoped>
.subject-balance-page {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
}

.summary-section {
  margin-bottom: 20px;
}

.summary-card {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-label {
  color: #666;
}

.summary-value {
  font-weight: bold;
  font-size: 16px;
  
  &.debit {
    color: #f5222d;
  }
  
  &.credit {
    color: #52c41a;
  }
}

.balance-table {
  margin-bottom: 20px;
}

.pagination-section {
  text-align: right;
}

.logs-section {
  margin-top: 20px;
}
</style>
