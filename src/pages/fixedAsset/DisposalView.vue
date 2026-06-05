<template>
  <div class="page-container">
    <div class="page-header">
      <h2>资产处置详情</h2>
      <div class="header-actions">
        <el-button @click="handleBack">返回</el-button>
      </div>
    </div>

    <div class="page-card" v-if="disposal">
      <div class="detail-section">
        <h3>基本信息</h3>
        <el-divider />
        <div class="info-grid">
          <div class="info-item">
            <label>处置单号</label>
            <span>{{ disposal.bizDocNo }}</span>
          </div>
          <div class="info-item">
            <label>资产编号</label>
            <span>{{ disposal.assetNo }}</span>
          </div>
          <div class="info-item">
            <label>资产名称</label>
            <span>{{ disposal.assetName }}</span>
          </div>
          <div class="info-item">
            <label>处置方式</label>
            <span>{{ disposal.disposalTypeName }}</span>
          </div>
          <div class="info-item">
            <label>处置日期</label>
            <span>{{ disposal.disposalDate }}</span>
          </div>
          <div class="info-item">
            <label>原值</label>
            <span>{{ formatAmount(disposal.originalValue) }}</span>
          </div>
          <div class="info-item">
            <label>累计折旧</label>
            <span>{{ formatAmount(disposal.accumulatedDepreciation) }}</span>
          </div>
          <div class="info-item">
            <label>账面净值</label>
            <span>{{ formatAmount(disposal.netValue) }}</span>
          </div>
          <div class="info-item">
            <label>处置收入</label>
            <span>{{ formatAmount(disposal.disposalAmount) }}</span>
          </div>
          <div class="info-item">
            <label>处置损益</label>
            <span :class="disposal.gainLossAmount >= 0 ? 'text-green' : 'text-red'">
              {{ disposal.gainLossAmount >= 0 ? '+' : '' }}{{ formatAmount(disposal.gainLossAmount) }}
            </span>
          </div>
          <div class="info-item">
            <label>凭证编号</label>
            <span>{{ disposal.voucherNo || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h3>处置原因</h3>
        <el-divider />
        <div class="remark-content">
          {{ disposal.disposalReason || '无' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockAssetDisposals, AssetDisposal } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const disposal = ref<AssetDisposal | null>(null)

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const handleBack = () => {
  router.push('/fixedAsset/disposal')
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    const found = mockAssetDisposals.find(item => item.disposalId === id)
    disposal.value = found || null
  }
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
}

.header-actions {
  display: flex;
  gap: 12px;
}

.page-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  margin: 0 0 10px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 13px;
  color: #909399;
}

.info-item span {
  font-weight: 500;
}

.text-green {
  color: #67c23a;
}

.text-red {
  color: #f56c6c;
}

.remark-content {
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  min-height: 80px;
}
</style>