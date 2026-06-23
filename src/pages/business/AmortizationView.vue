<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>待摊费用详情 - {{ data?.bizDocNo }}</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <div v-if="data">
        <el-descriptions title="方案信息" :column="3" border>
          <el-descriptions-item label="单据编号">{{ data.bizDocNo }}</el-descriptions-item>
          <el-descriptions-item label="业务日期">{{ data.tradeDate }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusTagType(data.status)">{{ data.statusName }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="待摊名称">{{ data.name }}</el-descriptions-item>
          <el-descriptions-item label="付款账户">{{ data.accountName }}</el-descriptions-item>
          <el-descriptions-item label="支出类别">{{ data.categoryName }}</el-descriptions-item>
          <el-descriptions-item label="业务员">{{ data.staffName }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ data.deptName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="项目">{{ data.projectName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="币种">{{ data.currencyCode }}</el-descriptions-item>
          <el-descriptions-item label="汇率">{{ data.exchangeRate }}</el-descriptions-item>
          <el-descriptions-item label="摊销方式">{{ data.amortPeriodTypeName }} / 平均法</el-descriptions-item>
          <el-descriptions-item label="备注" :span="3">{{ data.remark || '-' }}</el-descriptions-item>
        </el-descriptions>

        <el-row :gutter="20" style="margin-top: 16px">
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-label">总金额</div>
              <div class="stat-value">¥{{ data.totalAmount.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-label">每期金额</div>
              <div class="stat-value">¥{{ data.periodAmount.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-label">累计已摊销</div>
              <div class="stat-value" style="color: #67c23a">¥{{ data.amortizedAmount.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-label">剩余金额</div>
              <div class="stat-value" style="color: #e6a23c">¥{{ (data.totalAmount - data.amortizedAmount).toFixed(2) }}</div>
            </el-card>
          </el-col>
        </el-row>

        <el-card shadow="never" style="margin-top: 16px">
          <div slot="header" class="card-header">
            <span>摊销进度</span>
            <el-tag size="small">期限：{{ data.amortStartDate }} ~ {{ data.amortEndDate }}</el-tag>
          </div>
          <el-progress
            :percentage="Math.round((data.amortizedAmount / data.totalAmount) * 100)"
            :stroke-width="20"
            :text-inside="true"
          />
          <div class="progress-info">
            <span>已完成 {{ data.amortRecords.length }} / {{ data.totalPeriods }} 期</span>
            <span v-if="data.nextAmortDate">下一期：{{ data.nextAmortDate }}</span>
          </div>
        </el-card>

        <el-divider content-position="left">摊销执行明细</el-divider>
        <el-table :data="data.amortRecords" border>
          <el-table-column prop="periodNo" label="期次" width="80" align="center" />
          <el-table-column prop="amortDate" label="摊销日期" width="120" />
          <el-table-column label="摊销金额" width="140" align="right">
            <template #default="scope">¥{{ scope.row.amortAmount.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="voucherNo" label="凭证编号" min-width="160" />
          <el-table-column prop="createTime" label="执行时间" min-width="180" />
        </el-table>

        <el-empty v-if="!data.amortRecords.length" description="暂无摊销执行记录" />

        <el-descriptions title="关联凭证" :column="2" border style="margin-top: 16px">
          <el-descriptions-item label="登记凭证">{{ data.voucherNo || '-' }}</el-descriptions-item>
          <el-descriptions-item label="制单人">{{ data.writerName }} · {{ data.writeTime }}</el-descriptions-item>
        </el-descriptions>

        <div class="view-actions">
          <el-button v-if="data.status === 0" type="primary" @click="handleEdit">编辑</el-button>
          <el-button
            v-if="data.status === 0 || data.status === 1"
            type="success"
            @click="handleExecute"
          >
            执行一期
          </el-button>
          <el-button
            v-if="data.status === 0 || data.status === 1"
            type="warning"
            @click="handleAbort"
          >
            中止摊销
          </el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockAmortizations, type AmortizationRecord } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string)
const data = computed(() => mockAmortizations.find(r => r.id === id.value) || null)

const statusTagType = (status: number) => {
  switch (status) {
    case 0: return 'info'
    case 1: return 'primary'
    case 2: return 'success'
    case 3: return 'warning'
    default: return ''
  }
}

const handleBack = () => router.push('/business/amortization')
const handleEdit = () => {
  if (!data.value) return
  router.push(`/business/amortization/edit/${data.value.id}`)
}

const handleExecute = async () => {
  if (!data.value) return
  await ElMessageBox.confirm(`对「${data.value.name}」手动执行一期摊销？`, '执行一期', { type: 'warning' })
  const r = data.value
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
  ElMessage.success(`执行成功，凭证：${newRecord.voucherNo}`)
}

const handleAbort = async () => {
  if (!data.value) return
  await ElMessageBox.confirm(`中止「${data.value.name}」的摊销方案？`, '中止', { type: 'warning' })
  data.value.status = 3
  data.value.statusName = '已中止'
  data.value.nextAmortDate = ''
  ElMessage.success('已中止')
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
.stat-card { text-align: center; }
.stat-label { font-size: 13px; color: #909399; }
.stat-value { font-size: 22px; font-weight: 600; margin-top: 8px; color: #303133; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.progress-info { margin-top: 12px; display: flex; justify-content: space-between; color: #606266; font-size: 13px; }
.view-actions { margin-top: 30px; text-align: center; }
.view-actions .el-button { margin: 0 8px; }
</style>
