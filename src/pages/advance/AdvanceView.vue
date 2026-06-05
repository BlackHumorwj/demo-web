<template>
  <div class="page-container">
    <div class="page-header">
      <h2>预收预付详情</h2>
      <div class="header-actions">
        <el-button @click="handleBack">返回列表</el-button>
      </div>
    </div>

    <div class="page-card" v-if="advance">
      <div class="detail-section">
        <div class="detail-title">基础信息</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">单据编号</span>
            <span class="value">{{ advance.bizDocNo }}</span>
          </div>
          <div class="detail-item">
            <span class="label">业务日期</span>
            <span class="value">{{ advance.tradeTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">挂账类型</span>
            <span class="value">
              <el-tag :type="advance.arapType === 3 ? 'success' : 'warning'">
                {{ advance.arapTypeName }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item">
            <span class="label">状态</span>
            <span class="value">
              <el-tag :type="advance.status === 0 ? 'success' : 'info'">
                {{ advance.statusName }}
              </el-tag>
            </span>
          </div>
          <div class="detail-item">
            <span class="label">挂账账户</span>
            <span class="value">{{ advance.accountName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">资金账户</span>
            <span class="value">{{ advance.fundAccountName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">往来单位</span>
            <span class="value">{{ advance.bizContactName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">金额</span>
            <span class="value amount">{{ formatAmount(advance.amount) }} {{ advance.currencyCode }}</span>
          </div>
          <div class="detail-item">
            <span class="label">到期日</span>
            <span class="value">{{ advance.dueDate || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">币种</span>
            <span class="value">{{ advance.currencyCode }}</span>
          </div>
          <div class="detail-item">
            <span class="label">汇率</span>
            <span class="value">{{ advance.exchangeRate.toFixed(8) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">标签</span>
            <span class="value">{{ advance.tag || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-title">备注</div>
        <div class="remark-content">
          {{ advance.remark || '-' }}
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-title">操作信息</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">制单人</span>
            <span class="value">{{ advance.writerName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">制单时间</span>
            <span class="value">{{ advance.writerTime }}</span>
          </div>
          <div class="detail-item">
            <span class="label">修改人</span>
            <span class="value">{{ advance.updateName || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">修改时间</span>
            <span class="value">{{ advance.updateTime || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section" v-if="advance.voucherNo">
        <div class="detail-title">凭证信息</div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">凭证编号</span>
            <span class="value">{{ advance.voucherNo }}</span>
          </div>
        </div>
      </div>

      <div class="detail-actions">
        <el-button @click="handleBack">返回</el-button>
        <el-button
          type="primary"
          @click="handleEdit"
          :disabled="advance.status !== 0"
        >
          编辑
        </el-button>
      </div>
    </div>

    <div class="empty-state" v-else>
      <el-empty description="未找到相关记录" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockAdvanceList } from '@/data/mockData'
import type { Advance } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const advance = ref<Advance | null>(null)

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const handleBack = () => {
  router.push('/advance')
}

const handleEdit = () => {
  if (advance.value) {
    router.push(`/advance/edit/${advance.value.bizDocId}`)
  }
}

onMounted(() => {
  advance.value = mockAdvanceList.find(item => item.bizDocId === route.params.id) || null
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

.page-header h2 {
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

.detail-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeeef;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
}

.detail-item .value.amount {
  font-weight: 600;
  font-size: 16px;
}

.remark-content {
  font-size: 14px;
  color: #303133;
  line-height: 1.8;
  padding: 12px;
  background-color: #fafafa;
  border-radius: 4px;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.empty-state {
  padding: 60px 0;
}
</style>