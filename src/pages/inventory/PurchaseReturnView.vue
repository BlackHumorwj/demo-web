<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>采购退货详情</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <div v-if="doc" class="view-container">
        <div class="doc-header">
          <span class="doc-no">{{ doc.bizDocNo }}</span>
          <el-tag :type="getStatusType(doc.status)" class="status-tag">{{ getStatusText(doc.status) }}</el-tag>
        </div>

        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="基本信息" name="basic">
            <div class="view-grid">
              <div class="view-row">
                <span class="view-label">业务日期</span>
                <span class="view-value">{{ doc.bizDate }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">供应商</span>
                <span class="view-value">{{ doc.supplierName }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">联系人</span>
                <span class="view-value">{{ doc.contactName || '-' }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">结算账户</span>
                <span class="view-value">{{ doc.accountName }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">业务员</span>
                <span class="view-value">{{ doc.bizStaffName }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">部门</span>
                <span class="view-value">{{ doc.bizDeptName || '-' }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">项目</span>
                <span class="view-value">{{ doc.bizProjectName || '-' }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">总数量</span>
                <span class="view-value">{{ doc.totalQty.toLocaleString() }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">总金额</span>
                <span class="view-value amount">¥ {{ doc.totalAmount.toLocaleString() }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">备注</span>
                <span class="view-value">{{ doc.remark || '-' }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">制单人</span>
                <span class="view-value">{{ doc.createName }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">制单时间</span>
                <span class="view-value">{{ formatDateTime(doc.createTime) }}</span>
              </div>
              <div class="view-row" v-if="doc.updateTime">
                <span class="view-label">更新人</span>
                <span class="view-value">{{ doc.updateName }}</span>
              </div>
              <div class="view-row" v-if="doc.updateTime">
                <span class="view-label">更新时间</span>
                <span class="view-value">{{ formatDateTime(doc.updateTime) }}</span>
              </div>
              <div class="view-row" v-if="doc.auditTime">
                <span class="view-label">审核人</span>
                <span class="view-value">{{ doc.auditName }}</span>
              </div>
              <div class="view-row" v-if="doc.auditTime">
                <span class="view-label">审核时间</span>
                <span class="view-value">{{ formatDateTime(doc.auditTime) }}</span>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="支出明细" name="category">
            <el-table :data="doc.categoryItems" border style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="categoryName" label="分类" />
              <el-table-column label="金额" width="140">
                <template #default="scope">
                  <span>¥ {{ scope.row.amount.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <div class="total-row">
              <span class="label">合计：</span>
              <span class="value">¥ {{ totalCategoryAmount.toLocaleString() }}</span>
            </div>
          </el-tab-pane>

          <el-tab-pane label="库存明细" name="inventory">
            <el-table :data="doc.inventoryItems" border style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="prodName" label="商品名称" />
              <el-table-column prop="prodSpec" label="规格" width="120" />
              <el-table-column prop="unit" label="单位" width="80" />
              <el-table-column prop="qty" label="数量" width="100" />
              <el-table-column label="单价" width="120">
                <template #default="scope">
                  <span>¥ {{ scope.row.price.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="金额" width="120">
                <template #default="scope">
                  <span class="amount">¥ {{ scope.row.amount.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="warehouseId" label="仓库" width="100" />
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <div class="total-row">
              <span class="label">合计数量：</span>
              <span class="value">{{ doc.totalQty.toLocaleString() }}</span>
              <span class="label" style="margin-left: 16px">合计金额：</span>
              <span class="value">¥ {{ doc.totalAmount.toLocaleString() }}</span>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="view-actions">
        <el-button type="primary" @click="handleEdit" :disabled="doc?.status !== 0">编辑</el-button>
        <el-button @click="handleDelete" :disabled="doc?.status !== 0">删除</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockPurchaseReturnDocs } from '@/data/mockData'
import type { PurchaseReturnDoc } from '@/types/inventory'

const router = useRouter()
const route = useRoute()

const doc = ref<PurchaseReturnDoc | null>(null)
const activeTab = ref('basic')

const statusOptions = [
  { value: 0, label: '草稿', type: 'info' },
  { value: 1, label: '已保存', type: 'warning' },
  { value: 2, label: '已审核', type: 'success' },
  { value: 3, label: '已撤销', type: 'danger' },
  { value: -1, label: '已删除', type: 'info' }
]

const getStatusText = (status: number) => {
  const option = statusOptions.find(o => o.value === status)
  return option?.label || '未知'
}

const getStatusType = (status: number) => {
  const option = statusOptions.find(o => o.value === status)
  return option?.type || 'info'
}

const totalCategoryAmount = computed(() => {
  if (!doc.value) return 0
  return doc.value.categoryItems.reduce((sum, item) => sum + item.amount, 0)
})

const formatDateTime = (dateTime?: string) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
}

const handleBack = () => {
  router.push('/inventory/purchase-return')
}

const handleEdit = () => {
  if (doc.value) {
    router.push(`/inventory/purchase-return/edit/${doc.value.bizDocId}`)
  }
}

const handleDelete = () => {
  if (doc.value) {
    const index = mockPurchaseReturnDocs.findIndex(item => item.bizDocId === doc.value?.bizDocId)
    if (index !== -1) {
      mockPurchaseReturnDocs[index].status = -1
    }
    router.push('/inventory/purchase-return')
  }
}

onMounted(() => {
  const id = route.params.id as string
  doc.value = mockPurchaseReturnDocs.find(item => item.bizDocId === id) || null
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
  padding: 20px 0;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.doc-no {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.status-tag {
  margin-left: 16px;
}

.detail-tabs {
  margin-bottom: 24px;
}

.view-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.view-row {
  display: flex;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
}

.view-label {
  width: 100px;
  color: #999;
  font-weight: 500;
}

.view-value {
  flex: 1;
  color: #333;
}

.view-value.amount {
  color: #22c55e;
  font-weight: 600;
  font-size: 16px;
}

.total-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px;
  background: #fafafa;
  margin-top: 12px;
}

.total-row .label {
  color: #666;
}

.total-row .value {
  color: #22c55e;
  font-weight: 600;
  font-size: 16px;
  margin-left: 8px;
}

.amount {
  color: #22c55e;
  font-weight: 500;
}

.view-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

@media (max-width: 768px) {
  .view-grid {
    grid-template-columns: 1fr;
  }
}
</style>
