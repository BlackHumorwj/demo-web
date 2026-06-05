<template>
  <div class="page-container">
    <div class="page-header">
      <h2>购置单据详情</h2>
      <div class="header-actions">
        <el-button @click="handleBack">返回</el-button>
        <el-button type="primary" v-if="purchase?.status === 0" @click="handleAudit">审核</el-button>
      </div>
    </div>

    <div class="page-card" v-if="purchase">
      <div class="detail-section">
        <h3>基本信息</h3>
        <el-divider />
        <div class="info-grid">
          <div class="info-item">
            <label>单据编号</label>
            <span>{{ purchase.bizDocNo }}</span>
          </div>
          <div class="info-item">
            <label>购置日期</label>
            <span>{{ purchase.tradeTime }}</span>
          </div>
          <div class="info-item">
            <label>付款账户</label>
            <span>{{ purchase.accountName }}</span>
          </div>
          <div class="info-item">
            <label>供应商</label>
            <span>{{ purchase.supplierName }}</span>
          </div>
          <div class="info-item">
            <label>购置金额</label>
            <span>{{ formatAmount(purchase.amount) }}</span>
          </div>
          <div class="info-item">
            <label>状态</label>
            <el-tag :type="purchase.status === 1 ? 'success' : 'warning'">
              {{ purchase.status === 1 ? '已审核' : '待审核' }}
            </el-tag>
          </div>
          <div class="info-item">
            <label>凭证编号</label>
            <span>{{ purchase.voucherNo || '-' }}</span>
          </div>
          <div class="info-item">
            <label>备注</label>
            <span>{{ purchase.remark || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <h3>资产清单</h3>
        <el-divider />
        <el-table v-if="purchase.assetList && purchase.assetList.length > 0" :data="purchase.assetList" border>
          <el-table-column prop="assetName" label="资产名称" />
          <el-table-column prop="categoryName" label="资产类别" />
          <el-table-column prop="specModel" label="规格型号" />
          <el-table-column prop="originalValue" label="原值">
            <template #default="scope">
              {{ formatAmount(scope.row.originalValue) }}
            </template>
          </el-table-column>
          <el-table-column prop="salvageRate" label="净残值率">
            <template #default="scope">
              {{ (scope.row.salvageRate * 100).toFixed(2) }}%
            </template>
          </el-table-column>
          <el-table-column prop="usefulLife" label="使用年限(年)" />
          <el-table-column prop="deptName" label="使用部门" />
          <el-table-column prop="staffName" label="使用人" />
          <el-table-column prop="location" label="存放地点" />
        </el-table>
        <div v-else class="empty-tip">暂无资产信息</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockFixedAssetPurchases, mockFixedAssets, FixedAssetPurchase } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const purchase = ref<FixedAssetPurchase | null>(null)

const formatAmount = (amount: number) => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
}

const handleBack = () => {
  router.push('/fixedAsset/purchase')
}

const handleAudit = () => {
  const id = route.params.id
  if (id) {
    const purchaseIndex = mockFixedAssetPurchases.findIndex(item => item.bizDocId === id)
    if (purchaseIndex !== -1) {
      mockFixedAssetPurchases[purchaseIndex].status = 1
      mockFixedAssetPurchases[purchaseIndex].voucherNo = `PZ-${Date.now().toString().slice(-8)}`
      
      mockFixedAssetPurchases[purchaseIndex].assetList.forEach((asset: any) => {
        const existingAsset = mockFixedAssets.find(a => a.assetName === asset.assetName)
        if (existingAsset) {
          existingAsset.status = 0
        }
      })
      
      alert('审核成功')
      purchase.value = mockFixedAssetPurchases[purchaseIndex]
    }
  }
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    purchase.value = mockFixedAssetPurchases.find(item => item.bizDocId === id) || null
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

.empty-tip {
  text-align: center;
  padding: 30px;
  color: #909399;
}
</style>