<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>查看支出</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <div v-if="expense" class="view-container">
        <div class="view-row">
          <span class="view-label">单据编号</span>
          <span class="view-value">{{ expense.bizDocNo }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">业务日期</span>
          <span class="view-value">{{ expense.tradeTime }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">支出账户</span>
          <span class="view-value">{{ expense.accountName }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">业务员</span>
          <span class="view-value">{{ expense.staffName }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">部门</span>
          <span class="view-value">{{ expense.deptName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">项目</span>
          <span class="view-value">{{ expense.projectName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">往来单位</span>
          <span class="view-value">{{ expense.bizContactName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">支出金额</span>
          <span class="view-value amount expense">-{{ getCurrencySymbol(expense.currencyCode) }} {{ (expense.amount || 0).toLocaleString() }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">币种</span>
          <span class="view-value">{{ expense.currencyCode }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">汇率</span>
          <span class="view-value">{{ expense.exchangeRate.toFixed(8) }}</span>
        </div>

        <div class="view-row detail-section">
          <span class="view-label">收支明细</span>
          <div class="detail-content">
            <el-table :data="expense.categoryItems || []" border style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="categoryName" label="收支类别" width="200" />
              <el-table-column label="金额" width="150">
                <template #default="scope">
                  <span class="amount expense">-{{ getCurrencySymbol(expense.currencyCode) }} {{ (scope.row.amount || 0).toLocaleString() }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <div class="detail-total">
              <span class="label">合计金额：</span>
              <span class="value expense">{{ getCurrencySymbol(expense.currencyCode) }} {{ totalAmount.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <div class="view-row">
          <span class="view-label">备注</span>
          <span class="view-value">{{ expense.remark || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">制单人</span>
          <span class="view-value">{{ expense.writerName }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">制单时间</span>
          <span class="view-value">{{ expense.writerTime }}</span>
        </div>
        <div v-if="expense.updateName" class="view-row">
          <span class="view-label">修改人</span>
          <span class="view-value">{{ expense.updateName }}</span>
        </div>
        <div v-if="expense.updateTime" class="view-row">
          <span class="view-label">修改时间</span>
          <span class="view-value">{{ expense.updateTime }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">状态</span>
          <el-tag :type="expense.status === 0 ? 'success' : 'danger'">
            {{ expense.status === 0 ? '正常' : '已删除' }}
          </el-tag>
        </div>
      </div>

      <div class="view-actions">
        <el-button type="primary" @click="handleEdit" :disabled="expense?.status !== 0">编辑</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockExpenseDocs, mockCurrencies, type ExpenseDoc } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const expense = ref<ExpenseDoc | null>(null)

const totalAmount = computed(() => {
  if (!expense.value) return 0
  return (expense.value.categoryItems || []).reduce((sum, item) => sum + (item.amount || 0), 0)
})

const getCurrencySymbol = (code: string) => {
  const currency = mockCurrencies.find(c => c.code === code)
  return currency ? currency.symbol : '¥'
}

const handleBack = () => {
  router.push('/business/expense')
}

const handleEdit = () => {
  if (expense.value) {
    router.push(`/business/expense/edit/${expense.value.bizDocId}`)
  }
}

onMounted(() => {
  const id = route.params.id as string
  expense.value = mockExpenseDocs.find(item => item.bizDocId === id) || null
  if (!expense.value) {
    router.push('/business/expense')
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

.view-row.detail-section {
  flex-direction: column;
}

.view-row.detail-section .view-label {
  margin-bottom: 12px;
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

.detail-content {
  flex: 1;
  margin-top: 12px;
}

.detail-total {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 12px;
  background: #fafafa;
  border-top: 1px solid #e8e8e8;
}

.detail-total .label {
  color: #666;
}

.detail-total .value {
  font-weight: 600;
  font-size: 18px;
  margin-left: 8px;
}

.detail-total .value.expense {
  color: #ef4444;
}

.amount.expense {
  color: #ef4444;
  font-weight: 600;
}

.view-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
