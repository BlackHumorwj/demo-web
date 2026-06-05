<template>
  <div class="page-container">
    <div class="page-header">
      <h2>资产卡片详情</h2>
      <div class="header-actions">
        <el-button @click="handleEdit" v-if="asset && asset.status < 2">编辑</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </div>

    <div class="page-card" v-if="asset">
      <div class="detail-section">
        <h3 class="section-title">基本信息</h3>
        <el-divider />
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">资产编号</span>
            <span class="value">{{ asset.assetNo }}</span>
          </div>
          <div class="detail-item">
            <span class="label">资产名称</span>
            <span class="value">{{ asset.assetName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">资产类别</span>
            <span class="value">{{ asset.categoryName }}</span>
          </div>
          <div class="detail-item">
            <span class="label">规格型号</span>
            <span class="value">{{ asset.specModel }}</span>
          </div>
          <div class="detail-item">
            <span class="label">状态</span>
            <el-tag :type="getStatusTagType(asset.status)">{{ asset.statusName }}</el-tag>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">财务信息</h3>
        <el-divider />
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">原值</span>
            <span class="value amount">{{ formatAmount(asset.originalValue) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">净残值率</span>
            <span class="value">{{ (asset.salvageRate * 100).toFixed(2) }}%</span>
          </div>
          <div class="detail-item">
            <span class="label">预计净残值</span>
            <span class="value amount">{{ formatAmount(asset.salvageValue) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">预计使用年限</span>
            <span class="value">{{ asset.usefulLife }} 年</span>
          </div>
          <div class="detail-item">
            <span class="label">月折旧额</span>
            <span class="value amount">{{ formatAmount(asset.monthlyDepreciation) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">累计折旧</span>
            <span class="value amount">{{ formatAmount(asset.accumulatedDepreciation) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">净值</span>
            <span class="value amount highlight">{{ formatAmount(asset.netValue) }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">使用信息</h3>
        <el-divider />
        <div class="detail-grid">
          <div class="detail-item">
            <span class="label">购置日期</span>
            <span class="value">{{ asset.purchaseDate }}</span>
          </div>
          <div class="detail-item">
            <span class="label">开始使用日期</span>
            <span class="value">{{ asset.startDate }}</span>
          </div>
          <div class="detail-item">
            <span class="label">使用部门</span>
            <span class="value">{{ asset.deptName || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">使用人</span>
            <span class="value">{{ asset.staffName || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">存放地点</span>
            <span class="value">{{ asset.location }}</span>
          </div>
          <div class="detail-item">
            <span class="label">备注</span>
            <span class="value">{{ asset.remark || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h3 class="section-title">折旧明细</h3>
        <el-divider />
        <el-table v-if="depreciationDetails.length > 0" :data="depreciationDetails" border>
          <el-table-column prop="depreciationPeriod" label="折旧期间" width="120" />
          <el-table-column prop="currentDepreciation" label="本期折旧" width="120">
            <template #default="scope">{{ formatAmount(scope.row.currentDepreciation) }}</template>
          </el-table-column>
          <el-table-column prop="accumulatedDepreciation" label="累计折旧" width="120">
            <template #default="scope">{{ formatAmount(scope.row.accumulatedDepreciation) }}</template>
          </el-table-column>
          <el-table-column prop="netValue" label="净值" width="120">
            <template #default="scope">{{ formatAmount(scope.row.netValue) }}</template>
          </el-table-column>
          <el-table-column prop="voucherNo" label="凭证编号" />
        </el-table>
        <div v-else class="empty-tip">暂无折旧记录</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockFixedAssets, mockDepreciationDetails } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const asset = ref<any>(null)

const depreciationDetails = computed(() => {
  if (!asset.value) return []
  return mockDepreciationDetails.filter(d => d.assetId === asset.value.assetId)
})

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const getStatusTagType = (status: number) => {
  switch (status) {
    case 0:
      return 'success'
    case 1:
      return 'warning'
    case 2:
      return 'info'
    default:
      return 'default'
  }
}

onMounted(() => {
  const assetId = route.params.id as string
  asset.value = mockFixedAssets.find(item => item.assetId === assetId)
})

const handleEdit = () => {
  router.push(`/fixedAsset/card/edit/${asset.value.assetId}`)
}

const handleBack = () => {
  router.push('/fixedAsset/card')
}
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

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 14px;
  color: #606266;
}

.detail-item .value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.detail-item .value.amount {
  color: #409eff;
}

.detail-item .value.highlight {
  color: #67c23a;
  font-weight: 600;
}

.empty-tip {
  text-align: center;
  padding: 30px;
  color: #909399;
}

@media (max-width: 992px) {
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>