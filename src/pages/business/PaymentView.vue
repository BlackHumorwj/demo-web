<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>查看付款</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <div v-if="payment" class="view-container">
        <div class="view-row">
          <span class="view-label">单据编号</span>
          <span class="view-value">{{ payment.bizDocNo }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">业务日期</span>
          <span class="view-value">{{ payment.bizDate }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">付款账户</span>
          <span class="view-value">{{ payment.paymentAccountName }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">挂账账户</span>
          <span class="view-value">{{ payment.accountName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">往来单位</span>
          <span class="view-value">{{ payment.contactName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">付款金额</span>
          <span class="view-value amount expense">-{{ getCurrencySymbol(payment.currencyId) }} {{ (payment.paymentAmount || 0).toLocaleString() }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">币种</span>
          <span class="view-value">{{ payment.currencyName }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">汇率</span>
          <span class="view-value">{{ payment.exchangeRate.toFixed(8) }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">业务员</span>
          <span class="view-value">{{ payment.bizStaffName }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">部门</span>
          <span class="view-value">{{ payment.bizDeptName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">项目</span>
          <span class="view-value">{{ payment.bizProjectName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">备注</span>
          <span class="view-value">{{ payment.remark || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">制单人</span>
          <span class="view-value">{{ payment.createName }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">制单时间</span>
          <span class="view-value">{{ payment.createTime }}</span>
        </div>
        <div v-if="payment.updateName" class="view-row">
          <span class="view-label">修改人</span>
          <span class="view-value">{{ payment.updateName }}</span>
        </div>
        <div v-if="payment.updateTime" class="view-row">
          <span class="view-label">修改时间</span>
          <span class="view-value">{{ payment.updateTime }}</span>
        </div>
        <div v-if="payment.auditName" class="view-row">
          <span class="view-label">审核人</span>
          <span class="view-value">{{ payment.auditName }}</span>
        </div>
        <div v-if="payment.auditTime" class="view-row">
          <span class="view-label">审核时间</span>
          <span class="view-value">{{ payment.auditTime }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">状态</span>
          <el-tag :type="payment.status === 0 ? 'success' : 'danger'">
            {{ payment.status === 0 ? '正常' : '已删除' }}
          </el-tag>
        </div>
      </div>

      <div class="view-actions">
        <el-button type="primary" @click="handleEdit" :disabled="payment?.status !== 0">编辑</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockPaymentDocs, mockCurrencies } from '@/data/mockData'
import type { PaymentDoc } from '@/types/business'

const router = useRouter()
const route = useRoute()

const payment = ref<PaymentDoc | null>(null)

const getCurrencySymbol = (currencyId: string) => {
  const currency = mockCurrencies.find(c => c.id === currencyId)
  return currency ? currency.symbol : '¥'
}

const handleBack = () => {
  router.push('/business/payment')
}

const handleEdit = () => {
  if (payment.value) {
    router.push(`/business/payment/edit/${payment.value.bizDocId}`)
  }
}

onMounted(() => {
  const id = route.params.id as string
  payment.value = mockPaymentDocs.find(item => item.bizDocId === id) || null
  if (!payment.value) {
    router.push('/business/payment')
  }
})
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-card {
  min-height: 400px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.view-container {
  max-width: 800px;
  margin: 40px auto;
}

.view-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.view-label {
  width: 120px;
  color: #999;
  font-weight: 500;
}

.view-value {
  flex: 1;
  color: #333;
}

.view-value.amount {
  font-weight: 600;
  font-size: 18px;
}

.view-value.amount.expense {
  color: #ef4444;
}

.view-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.amount.expense {
  color: #ef4444;
  font-weight: 600;
}
</style>
