<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>审核详情 - {{ data?.bizDocNo }}</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <div v-if="data">
        <el-descriptions title="单据信息" :column="3" border>
          <el-descriptions-item label="单据编号">{{ data.bizDocNo }}</el-descriptions-item>
          <el-descriptions-item label="单据类型">{{ data.bizDocTypeName }}</el-descriptions-item>
          <el-descriptions-item label="关联业务ID">{{ data.bizDocId }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ data.createTime }}</el-descriptions-item>
          <el-descriptions-item label="当前状态">
            <el-tag :type="auditStatusTag(data.auditStatus)">{{ data.auditStatusName }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核人">{{ data.auditorName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核时间">{{ data.auditTime || '-' }}</el-descriptions-item>
          <el-descriptions-item label="审核意见" :span="2">{{ data.auditRemark || '-' }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">审核操作日志</el-divider>

        <el-timeline v-if="data.logs && data.logs.length">
          <el-timeline-item
            v-for="log in data.logs"
            :key="log.id"
            :timestamp="log.operatorTime"
            :type="log.auditAction === 2 ? 'danger' : log.auditAction === 3 ? 'info' : 'success'"
          >
            <div class="log-title">{{ log.auditActionName }} · {{ log.operatorName }}</div>
            <div class="log-remark">{{ log.remark || '-' }}</div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无审核日志" />

        <div class="view-actions">
          <el-button v-if="data.auditStatus === 0" type="primary" @click="handlePass">审核通过</el-button>
          <el-button v-if="data.auditStatus === 0" type="warning" @click="openRejectDialog">驳回</el-button>
          <el-button v-if="data.auditStatus === 1" @click="handleRevoke">撤销审核</el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </div>
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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { mockAuditRecords, type AuditRecord } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string)
const data = computed(() => mockAuditRecords.find(r => r.id === id.value) || null)

const rejectDialogVisible = ref(false)
const rejectFormRef = ref<FormInstance>()
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

const handleBack = () => router.push('/settings/audit')

const handlePass = async () => {
  if (!data.value) return
  await ElMessageBox.confirm(`确认审核通过单据「${data.value.bizDocNo}」？`, '审核通过', { type: 'warning' })
  ElMessage.success('审核通过')
  handleBack()
}

const openRejectDialog = () => {
  rejectForm.remark = ''
  rejectDialogVisible.value = true
}

const confirmReject = async () => {
  if (!rejectFormRef.value) return
  const valid = await rejectFormRef.value.validate().catch(() => false)
  if (!valid) return
  ElMessage.success('已驳回')
  rejectDialogVisible.value = false
  handleBack()
}

const handleRevoke = async () => {
  if (!data.value) return
  await ElMessageBox.confirm(`确认撤销单据「${data.value.bizDocNo}」的审核？`, '撤销审核', { type: 'warning' })
  ElMessage.success('已撤销审核')
  handleBack()
}
</script>

<style scoped>
.page-container { padding: 24px; }
.page-card { min-height: 400px; }
.header-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.log-title { font-weight: 500; color: #303133; }
.log-remark { color: #606266; font-size: 13px; margin-top: 4px; }
.view-actions { margin-top: 30px; text-align: center; }
.view-actions .el-button { margin: 0 8px; }
</style>
