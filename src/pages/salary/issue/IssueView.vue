<template>
  <div class="page-container">
    <div class="page-header">
      <h2>工资发放详情</h2>
      <div class="header-buttons">
        <el-button @click="handleBack">返回列表</el-button>
        <el-button v-if="issueData?.docStatus === 0" type="primary" @click="handleEdit">编辑</el-button>
      </div>
    </div>
    
    <el-card v-if="issueData" class="page-card">
      <div class="detail-section">
        <div class="detail-row">
          <div class="detail-item">
            <span class="label">单据编号：</span>
            <span class="value">{{ issueData.bizDocNo }}</span>
          </div>
          <div class="detail-item">
            <span class="label">工资期间：</span>
            <span class="value">{{ issueData.salaryPeriod }}</span>
          </div>
          <div class="detail-item">
            <span class="label">发放日期：</span>
            <span class="value">{{ issueData.tradeTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">状态：</span>
            <el-tag :type="getStatusType(issueData.docStatus)">{{ issueData.docStatusName }}</el-tag>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-item">
            <span class="label">关联计提单：</span>
            <span class="value">{{ issueData.accruedNo }}</span>
          </div>
          <div class="detail-item">
            <span class="label">发放账户：</span>
            <span class="value">{{ issueData.accountName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">发放金额：</span>
            <span class="value highlight">¥ {{ formatAmount(issueData.amount) }}</span>
          </div>
        </div>
        
        <div class="detail-row">
          <div class="detail-item">
            <span class="label">制单人：</span>
            <span class="value">{{ issueData.writerName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">制单时间：</span>
            <span class="value">{{ issueData.writerTime }}</span>
          </div>
        </div>
        
        <div class="detail-row remark-row">
          <span class="label">备注：</span>
          <span class="value">{{ issueData.remark || '-' }}</span>
        </div>
      </div>
      
      <div class="detail-section">
        <h3>员工发放明细</h3>
        <el-table :data="issueData.items" border>
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="staffName" label="员工" width="120" />
          <el-table-column prop="deptName" label="部门" width="100" />
          <el-table-column label="计提金额" width="120">
            <template #default="scope">
              <span>{{ formatAmount(scope.row.accruedAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发放金额" width="120">
            <template #default="scope">
              <span class="text-success">{{ formatAmount(scope.row.netAmount) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="150" />
        </el-table>
      </div>
      
      <div v-if="issueData.voucher" class="detail-section">
        <h3>凭证信息</h3>
        <div class="voucher-info">
          <div class="voucher-item">
            <span class="label">凭证编号：</span>
            <span class="value">{{ issueData.voucher.voucherCode }}</span>
          </div>
          <div class="voucher-item">
            <span class="label">凭证日期：</span>
            <span class="value">{{ issueData.voucher.voucherDate }}</span>
          </div>
          <div class="voucher-item">
            <span class="label">凭证金额：</span>
            <span class="value">¥ {{ formatAmount(issueData.voucher.amount) }}</span>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockSalaryIssueList } from '@/data/mockData'
import type { SalaryIssue } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const issueData = ref<SalaryIssue | null>(null)

const getStatusType = (status: number) => {
  const typeMap: Record<number, string> = {
    0: 'info',
    1: 'success',
    2: 'warning'
  }
  return typeMap[status] || 'info'
}

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const handleBack = () => {
  router.push('/salary/issue')
}

const handleEdit = () => {
  router.push(`/salary/issue/edit/${issueData.value?.bizDocId}`)
}

onMounted(() => {
  const id = parseInt(route.params.id as string)
  issueData.value = mockSalaryIssueList.find(item => item.bizDocId === id) || null
})
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.page-card {
  min-height: 400px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-item .label {
  color: #666;
  font-size: 14px;
  min-width: 100px;
}

.detail-item .value {
  font-weight: 500;
  font-size: 14px;
}

.detail-item .value.highlight {
  color: #3b82f6;
  font-size: 18px;
  font-weight: 600;
}

.remark-row {
  flex-direction: column;
  align-items: flex-start;
}

.text-success {
  color: #22c55e;
  font-weight: 600;
}

.voucher-info {
  display: flex;
  gap: 24px;
}

.voucher-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.voucher-item .label {
  color: #666;
  font-size: 14px;
}

.voucher-item .value {
  font-weight: 500;
}
</style>