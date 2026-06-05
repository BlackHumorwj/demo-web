<template>
  <div class="page-container">
    <div class="page-header">
      <div class="header-left">
        <h2>借入借出详情</h2>
      </div>
      <div class="header-actions">
        <el-button @click="handleBack">返回</el-button>
        <el-button
          type="primary"
          @click="handleEdit"
          :disabled="borrowLend?.status !== 0"
        >
          编辑
        </el-button>
      </div>
    </div>

    <div class="page-card" v-if="borrowLend">
      <div class="detail-section">
        <div class="section-title">基本信息</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">单据编号</span>
            <span class="value">{{ borrowLend.bizDocNo }}</span>
          </div>
          <div class="detail-item">
            <span class="label">业务日期</span>
            <span class="value">{{ borrowLend.tradeTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">挂账类型</span>
            <span class="value">
              <el-tag :type="borrowLend.arapType === 5 ? 'success' : 'warning'">
                {{ borrowLend.arapTypeName }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item">
            <span class="label">状态</span>
            <span class="value">
              <el-tag :type="getStatusTagType(borrowLend.status)">
                {{ borrowLend.statusName }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item">
            <span class="label">金额</span>
            <span class="value">{{ formatAmount(borrowLend.amount) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">到期日</span>
            <span class="value">{{ borrowLend.dueDate || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">币种</span>
            <span class="value">{{ borrowLend.currencyCode }}</span>
          </div>
          <div class="detail-item">
            <span class="label">汇率</span>
            <span class="value">{{ borrowLend.exchangeRate.toFixed(8) }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">账户信息</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">挂账账户</span>
            <span class="value">{{ borrowLend.accountName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">资金账户</span>
            <span class="value">{{ borrowLend.fundAccountName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">往来单位</span>
            <span class="value">{{ borrowLend.bizContactName }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">制单信息</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">制单人</span>
            <span class="value">{{ borrowLend.writerName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">制单时间</span>
            <span class="value">{{ borrowLend.writerTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">修改人</span>
            <span class="value">{{ borrowLend.updateName || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">修改时间</span>
            <span class="value">{{ borrowLend.updateTime || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">财务信息</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">凭证编号</span>
            <span class="value">{{ borrowLend.voucherNo || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">标签</span>
            <span class="value">{{ borrowLend.tag || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-title">备注</div>
        <div class="remark-content">
          {{ borrowLend.remark || '-' }}
        </div>
      </div>
    </div>

    <div class="page-card" v-else>
      <div class="empty-state">
        <el-empty description="记录不存在" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockBorrowLendList } from '@/data/mockData'
import type { BorrowLend } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const borrowLend = ref<BorrowLend | null>(null)

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const getStatusTagType = (status: number) => {
  switch (status) {
    case 0:
      return 'success'
    case -1:
      return 'info'
    default:
      return 'default'
  }
}

const handleBack = () => {
  router.push('/borrowLend')
}

const handleEdit = () => {
  if (borrowLend.value) {
    router.push(`/borrowLend/edit/${borrowLend.value.bizDocId}`)
  }
}

onMounted(() => {
  const id = route.params.id as string
  borrowLend.value = mockBorrowLendList.find(item => item.bizDocId === id) || null
})
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.page-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item .label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.detail-item .value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.remark-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.8;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 80px;
}

.empty-state {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}
</style>