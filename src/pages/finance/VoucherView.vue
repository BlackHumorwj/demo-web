<template>
  <div class="page-container">
    <div class="page-header">
      <el-button @click="goBack">返回列表</el-button>
      <h2>凭证详情</h2>
    </div>

    <el-card v-if="voucher" class="info-card">
      <template #header>
        <span>凭证基本信息</span>
      </template>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">凭证编号</span>
          <span class="value">{{ voucher.voucherCode }}</span>
        </div>
        <div class="info-item">
          <span class="label">凭证日期</span>
          <span class="value">{{ voucher.voucherDate }}</span>
        </div>
        <div class="info-item">
          <span class="label">凭证摘要</span>
          <span class="value">{{ voucher.summary }}</span>
        </div>
        <div class="info-item">
          <span class="label">制单人</span>
          <span class="value">{{ voucher.writerName }}</span>
        </div>
        <div class="info-item">
          <span class="label">制单时间</span>
          <span class="value">{{ voucher.writerTime }}</span>
        </div>
        <div class="info-item">
          <span class="label">凭证状态</span>
          <el-tag :type="getStatusType(voucher.status)">
            {{ voucher.statusDesc }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <el-card v-if="voucher" class="info-card">
      <template #header>
        <span>关联业务信息</span>
      </template>
      <div class="info-grid">
        <div class="info-item">
          <span class="label">业务类型</span>
          <span class="value">{{ voucher.bizDocTypeDesc }}</span>
        </div>
        <div class="info-item">
          <span class="label">业务单据编号</span>
          <span class="value">{{ voucher.bizDocNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">收支类别</span>
          <span class="value">{{ voucher.categoryName }}</span>
        </div>
        <div class="info-item">
          <span class="label">账户</span>
          <span class="value">{{ voucher.accountName }}</span>
        </div>
        <div class="info-item">
          <span class="label">业务员</span>
          <span class="value">{{ voucher.staffName }}</span>
        </div>
        <div class="info-item">
          <span class="label">部门</span>
          <span class="value">{{ voucher.deptName }}</span>
        </div>
      </div>
    </el-card>

    <el-card v-if="voucher" class="entry-card">
      <template #header>
        <span>分录信息</span>
      </template>
      <el-table :data="voucher.entryList" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="subjectCode" label="科目编码" width="100" />
        <el-table-column prop="subjectName" label="科目名称" width="150" />
        <el-table-column label="方向" width="80">
          <template #default="scope">
            <span :class="scope.row.direction === 1 ? 'debit' : 'credit'">
              {{ scope.row.directionDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="金额" width="140">
          <template #default="scope">
            <span :class="scope.row.direction === 1 ? 'debit' : 'credit'">
              ¥ {{ formatAmount(scope.row.amount) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="150" />
      </el-table>

      <div class="balance-row">
        <span class="balance-item">
          <span class="label">借方合计：</span>
          <span class="debit">¥ {{ formatAmount(debitTotal) }}</span>
        </span>
        <span class="balance-item">
          <span class="label">贷方合计：</span>
          <span class="credit">¥ {{ formatAmount(creditTotal) }}</span>
        </span>
        <span :class="['balance-status', isBalanced ? 'balanced' : 'unbalanced']">
          {{ isBalanced ? '✓ 借贷平衡' : `✗ 借贷不平衡，差额：¥ ${formatAmount(Math.abs(debitTotal - creditTotal))}` }}
        </span>
      </div>
    </el-card>

    <div class="action-bar" v-if="voucher">
      <el-button
        v-if="voucher.status === 0"
        type="primary"
        @click="showApproveDialog = true"
      >
        审核
      </el-button>
      <el-button
        v-if="voucher.status === 1"
        type="primary"
        @click="showPostDialog = true"
      >
        记账
      </el-button>
      <el-button
        v-if="voucher.status === 0"
        type="danger"
        @click="showDeleteDialog = true"
      >
        删除
      </el-button>
    </div>

    <el-dialog title="凭证审核" :visible.sync="showApproveDialog" width="400px">
      <div class="dialog-content">
        <p>确定要审核以下凭证吗？</p>
        <div class="dialog-info">
          <div>凭证编号：{{ voucher?.voucherCode }}</div>
          <div>凭证日期：{{ voucher?.voucherDate }}</div>
          <div>凭证摘要：{{ voucher?.summary }}</div>
          <div class="balance-info">
            <span>借方合计：¥ {{ formatAmount(debitTotal) }}</span>
            <span>贷方合计：¥ {{ formatAmount(creditTotal) }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showApproveDialog = false">取消</el-button>
        <el-button type="primary" @click="handleApprove">确定审核</el-button>
      </template>
    </el-dialog>

    <el-dialog title="凭证记账" :visible.sync="showPostDialog" width="400px">
      <div class="dialog-content">
        <p>确定要记账以下凭证吗？</p>
        <div class="dialog-info">
          <div>凭证编号：{{ voucher?.voucherCode }}</div>
          <div>凭证日期：{{ voucher?.voucherDate }}</div>
          <div>凭证摘要：{{ voucher?.summary }}</div>
          <div>会计期间：{{ getAccountingPeriod(voucher?.voucherDate) }}</div>
        </div>
      </div>
      <template #footer>
        <el-button @click="showPostDialog = false">取消</el-button>
        <el-button type="primary" @click="handlePost">确定记账</el-button>
      </template>
    </el-dialog>

    <el-dialog title="凭证删除" :visible.sync="showDeleteDialog" width="400px">
      <div class="dialog-content">
        <p>确定要删除以下凭证吗？</p>
        <div class="dialog-info">
          <div>凭证编号：{{ voucher?.voucherCode }}</div>
          <div>凭证日期：{{ voucher?.voucherDate }}</div>
          <div>凭证摘要：{{ voucher?.summary }}</div>
        </div>
        <p class="warning-text">⚠ 注意：删除后将无法恢复</p>
      </div>
      <template #footer>
        <el-button @click="showDeleteDialog = false">取消</el-button>
        <el-button type="danger" @click="handleDelete">确定删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getVoucherDetail, approveVoucher, postVoucher, deleteVoucher } from '@/services/voucher'
import type { Voucher } from '@/types/voucher'
import { STATUS_TYPE_MAP } from '@/types/voucher'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const voucher = ref<Voucher | null>(null)
const loading = ref(true)
const showApproveDialog = ref(false)
const showPostDialog = ref(false)
const showDeleteDialog = ref(false)

const getStatusType = (status: number): string => {
  return STATUS_TYPE_MAP[status] || 'default'
}

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const debitTotal = computed(() => {
  if (!voucher.value?.entryList) return 0
  return voucher.value.entryList
    .filter(entry => entry.direction === 1)
    .reduce((sum, entry) => sum + entry.amount, 0)
})

const creditTotal = computed(() => {
  if (!voucher.value?.entryList) return 0
  return voucher.value.entryList
    .filter(entry => entry.direction === 2)
    .reduce((sum, entry) => sum + entry.amount, 0)
})

const isBalanced = computed(() => {
  return Math.abs(debitTotal.value - creditTotal.value) < 0.01
})

const getAccountingPeriod = (date?: string): string => {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}年${d.getMonth() + 1}月`
}

const goBack = () => {
  router.push('/finance/voucher')
}

const fetchDetail = async () => {
  loading.value = true
  const voucherId = parseInt(route.params.id as string)
  try {
    const response = await getVoucherDetail(voucherId)
    if (response.code === 0) {
      voucher.value = response.data
    } else {
      ElMessage.error(response.msg)
    }
  } catch (error) {
    console.error('获取凭证详情失败:', error)
    ElMessage.error('获取凭证详情失败')
  } finally {
    loading.value = false
  }
}

const handleApprove = async () => {
  if (!voucher.value) return
  const response = await approveVoucher(voucher.value.voucherId)
  if (response.code === 0) {
    ElMessage.success('审核成功')
    showApproveDialog.value = false
    await fetchDetail()
  } else {
    ElMessage.error(response.msg)
  }
}

const handlePost = async () => {
  if (!voucher.value) return
  const response = await postVoucher(voucher.value.voucherId)
  if (response.code === 0) {
    ElMessage.success('记账成功')
    showPostDialog.value = false
    await fetchDetail()
  } else {
    ElMessage.error(response.msg)
  }
}

const handleDelete = async () => {
  if (!voucher.value) return
  const response = await deleteVoucher(voucher.value.voucherId)
  if (response.code === 0) {
    ElMessage.success('删除成功')
    showDeleteDialog.value = false
    router.push('/finance/voucher')
  } else {
    ElMessage.error(response.msg)
  }
}

onMounted(() => {
  fetchDetail()
})
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.info-card {
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 14px;
  color: #999;
}

.info-item .value {
  font-size: 14px;
  font-weight: 500;
}

.entry-card {
  margin-bottom: 20px;
}

.balance-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 16px;
  border-top: 1px solid #eee;
  margin-top: 16px;
}

.balance-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.balance-item .label {
  color: #999;
}

.balance-status {
  font-weight: 600;
}

.balance-status.balanced {
  color: #22c55e;
}

.balance-status.unbalanced {
  color: #ef4444;
}

.debit {
  color: #22c55e;
}

.credit {
  color: #ef4444;
}

.action-bar {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.dialog-content {
  padding: 16px 0;
}

.dialog-info {
  margin-top: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.dialog-info > div {
  margin-bottom: 8px;
}

.dialog-info > div:last-child {
  margin-bottom: 0;
}

.balance-info {
  display: flex;
  gap: 24px;
  margin-top: 12px !important;
}

.warning-text {
  color: #ef4444;
  margin-top: 16px;
}
</style>