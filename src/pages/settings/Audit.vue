<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>审核管理</span>
          <div>
            <el-button size="small" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>&nbsp;刷新
            </el-button>
          </div>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按单据编号/类型搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
        <el-select v-model="searchStatus" placeholder="审核状态" class="search-status" clearable>
          <el-option label="待审核" :value="0" />
          <el-option label="已审核" :value="1" />
          <el-option label="已驳回" :value="2" />
          <el-option label="已撤销" :value="3" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <el-table :data="paginatedRecords" border>
        <el-table-column prop="bizDocNo" label="单据编号" min-width="160" />
        <el-table-column prop="bizDocTypeName" label="单据类型" min-width="120" />
        <el-table-column label="审核状态" width="120">
          <template #default="scope">
            <el-tag :type="auditStatusTag(scope.row.auditStatus)">
              {{ scope.row.auditStatusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="auditorName" label="审核人" min-width="100" />
        <el-table-column prop="auditTime" label="审核时间" min-width="160" />
        <el-table-column prop="createTime" label="创建时间" min-width="160" />
        <el-table-column label="操作" width="320">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button
              v-if="scope.row.auditStatus === 0"
              type="text"
              size="small"
              style="color: #67c23a"
              @click="handlePass(scope.row)"
            >
              通过
            </el-button>
            <el-button
              v-if="scope.row.auditStatus === 0"
              type="text"
              size="small"
              style="color: #e6a23c"
              @click="handleReject(scope.row)"
            >
              驳回
            </el-button>
            <el-button
              v-if="scope.row.auditStatus === 1"
              type="text"
              size="small"
              style="color: #909399"
              @click="handleRevoke(scope.row)"
            >
              撤销
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

    <el-dialog title="驳回审核" v-model="rejectDialogVisible" width="480">
      <el-form :model="rejectForm" ref="rejectFormRef" :rules="rejectRules" label-width="80px">
        <el-form-item label="驳回原因" prop="remark">
          <el-input v-model="rejectForm.remark" type="textarea" :rows="3" placeholder="请输入驳回原因" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject">确认驳回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { mockAuditRecords, type AuditRecord } from '@/data/mockData'
import { Search, Refresh } from '@element-plus/icons-vue'

const router = useRouter()

const records = ref<AuditRecord[]>(JSON.parse(JSON.stringify(mockAuditRecords)))
const searchKeyword = ref('')
const searchStatus = ref<number | ''>('')
const currentPage = ref(1)
const pageSize = ref(10)

const rejectDialogVisible = ref(false)
const rejectFormRef = ref<FormInstance>()
const rejectTarget = ref<AuditRecord | null>(null)
const rejectForm = reactive({ remark: '' })
const rejectRules: FormRules = {
  remark: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }]
}

const auditStatusTag = (status: number) => {
  switch (status) {
    case 0: return 'warning'
    case 1: return 'success'
    case 2: return 'danger'
    case 3: return 'info'
    default: return 'info'
  }
}

const filteredRecords = computed(() => {
  return records.value.filter(item => {
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      if (!item.bizDocNo.toLowerCase().includes(kw) && !item.bizDocTypeName.toLowerCase().includes(kw)) return false
    }
    if (searchStatus.value !== '' && item.auditStatus !== searchStatus.value) return false
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
  records.value = JSON.parse(JSON.stringify(mockAuditRecords))
  searchKeyword.value = ''
  searchStatus.value = ''
  currentPage.value = 1
}
const handleSizeChange = (val: number) => { pageSize.value = val }
const handleCurrentChange = (val: number) => { currentPage.value = val }

const handleView = (row: AuditRecord) => {
  router.push(`/settings/audit/view/${row.id}`)
}

const handlePass = async (row: AuditRecord) => {
  await ElMessageBox.confirm(`确认审核通过单据「${row.bizDocNo}」？`, '审核通过', { type: 'warning' })
  const idx = records.value.findIndex(r => r.id === row.id)
  if (idx !== -1) {
    const now = new Date().toLocaleString('zh-CN', { hour12: false })
    records.value[idx] = {
      ...records.value[idx],
      auditStatus: 1,
      auditStatusName: '已审核',
      auditorId: '1',
      auditorName: '管理员',
      auditTime: now,
      auditRemark: '审核通过',
      logs: [
        ...records.value[idx].logs,
        { id: `L${Date.now()}`, auditAction: 1, auditActionName: '审核通过', operatorId: '1', operatorName: '管理员', operatorTime: now, remark: '审核通过' }
      ]
    }
    ElMessage.success('审核通过')
  }
}

const openReject = (row: AuditRecord) => {
  rejectTarget.value = row
  rejectForm.remark = ''
  rejectDialogVisible.value = true
}

const confirmReject = async () => {
  if (!rejectFormRef.value || !rejectTarget.value) return
  const valid = await rejectFormRef.value.validate().catch(() => false)
  if (!valid) return
  const idx = records.value.findIndex(r => r.id === rejectTarget.value?.id)
  if (idx !== -1) {
    const now = new Date().toLocaleString('zh-CN', { hour12: false })
    records.value[idx] = {
      ...records.value[idx],
      auditStatus: 2,
      auditStatusName: '已驳回',
      auditorId: '1',
      auditorName: '管理员',
      auditTime: now,
      auditRemark: rejectForm.remark,
      logs: [
        ...records.value[idx].logs,
        { id: `L${Date.now()}`, auditAction: 2, auditActionName: '驳回', operatorId: '1', operatorName: '管理员', operatorTime: now, remark: rejectForm.remark }
      ]
    }
    ElMessage.success('已驳回')
  }
  rejectDialogVisible.value = false
}

const handleReject = (row: AuditRecord) => {
  openReject(row)
}

const handleRevoke = async (row: AuditRecord) => {
  await ElMessageBox.confirm(`确认撤销单据「${row.bizDocNo}」的审核？撤销后单据回到待审核状态。`, '撤销审核', { type: 'warning' })
  const idx = records.value.findIndex(r => r.id === row.id)
  if (idx !== -1) {
    const now = new Date().toLocaleString('zh-CN', { hour12: false })
    records.value[idx] = {
      ...records.value[idx],
      auditStatus: 3,
      auditStatusName: '已撤销',
      auditorId: null,
      auditorName: '',
      auditTime: null,
      auditRemark: '',
      logs: [
        ...records.value[idx].logs,
        { id: `L${Date.now()}`, auditAction: 3, auditActionName: '撤销审核', operatorId: '1', operatorName: '管理员', operatorTime: now, remark: '撤销审核' }
      ]
    }
    ElMessage.success('已撤销审核，单据回到待审核状态')
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
