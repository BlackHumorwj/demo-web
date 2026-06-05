<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>采购入库详情</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <div v-if="purchase" class="view-container">
        <div class="doc-header">
          <span class="doc-no">{{ purchase.bizDocNo }}</span>
          <el-tag :type="getStatusType(purchase.status)" class="status-tag">{{ getStatusText(purchase.status) }}</el-tag>
        </div>
        
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="基本信息" name="basic">
            <div class="view-grid">
              <div class="view-row">
                <span class="view-label">业务日期</span>
                <span class="view-value">{{ purchase.tradeTime }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">供应商</span>
                <span class="view-value">{{ purchase.bizContactName }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">仓库</span>
                <span class="view-value">{{ purchase.warehouseName }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">结算账户</span>
                <span class="view-value">{{ purchase.accountName }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">业务员</span>
                <span class="view-value">{{ purchase.staffName }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">部门</span>
                <span class="view-value">{{ purchase.deptName || '-' }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">项目</span>
                <span class="view-value">{{ purchase.projectName || '-' }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">币种</span>
                <span class="view-value">{{ getCurrencyName(purchase.currencyCode) }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">汇率</span>
                <span class="view-value">{{ purchase.exchangeRate.toFixed(8) }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">总金额</span>
                <span class="view-value amount">¥ {{ purchase.totalCost.toLocaleString() }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">备注</span>
                <span class="view-value">{{ purchase.remark || '-' }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">制单人</span>
                <span class="view-value">{{ purchase.writerName }}</span>
              </div>
              <div class="view-row">
                <span class="view-label">制单时间</span>
                <span class="view-value">{{ formatDateTime(purchase.writerTime) }}</span>
              </div>
              <div class="view-row" v-if="purchase.updateTime">
                <span class="view-label">更新人</span>
                <span class="view-value">{{ purchase.updateName }}</span>
              </div>
              <div class="view-row" v-if="purchase.updateTime">
                <span class="view-label">更新时间</span>
                <span class="view-value">{{ formatDateTime(purchase.updateTime) }}</span>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="商品明细" name="items">
            <el-table :data="purchase.items" border style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="productName" label="商品名称" />
              <el-table-column prop="quantity" label="数量" width="100" />
              <el-table-column label="单价" width="120">
                <template #default="scope">
                  <span>¥ {{ scope.row.price.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="原币金额" width="120">
                <template #default="scope">
                  <span>¥ {{ scope.row.originalAmount.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="成本金额" width="120">
                <template #default="scope">
                  <span class="amount">¥ {{ scope.row.costAmount.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <div class="total-row">
              <span class="label">合计：</span>
              <span class="value">¥ {{ purchase.totalCost.toLocaleString() }}</span>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="库存流水" name="inventory">
            <el-table :data="inventoryFlows" border style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="productName" label="商品名称" />
              <el-table-column prop="quantityChange" label="数量变化" width="120" />
              <el-table-column label="成本变化" width="120">
                <template #default="scope">
                  <span class="amount">¥ {{ scope.row.costChange.toFixed(2) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          
          <el-tab-pane label="会计凭证" name="voucher">
            <div v-if="voucher" class="voucher-info">
              <div class="voucher-row">
                <span class="voucher-label">凭证编号</span>
                <span class="voucher-value">{{ voucher.voucherCode }}</span>
              </div>
              <div class="voucher-row">
                <span class="voucher-label">凭证日期</span>
                <span class="voucher-value">{{ voucher.voucherDate }}</span>
              </div>
              <div class="voucher-row">
                <span class="voucher-label">摘要</span>
                <span class="voucher-value">{{ voucher.summary }}</span>
              </div>
              <div class="voucher-row">
                <span class="voucher-label">状态</span>
                <el-tag :type="getVoucherStatusType(voucher.status)">{{ getVoucherStatusText(voucher.status) }}</el-tag>
              </div>
            </div>
            <el-table :data="entries" border style="width: 100%" v-if="entries.length">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="subjectName" label="科目名称" />
              <el-table-column label="方向" width="80">
                <template #default="scope">
                  <span :class="scope.row.direction === 1 ? 'debit' : 'credit'">{{ scope.row.direction === 1 ? '借方' : '贷方' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="金额" width="120">
                <template #default="scope">
                  <span>¥ {{ scope.row.amount.toFixed(2) }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div v-else class="empty-tip">暂无凭证信息</div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <div class="view-actions">
        <el-button type="primary" @click="handleEdit" :disabled="purchase?.status !== 0">编辑</el-button>
        <el-button @click="handleDelete" :disabled="purchase?.status !== 0">删除</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockPurchaseInDocs, mockCurrencies, type PurchaseInDoc } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const purchase = ref<PurchaseInDoc | null>(null)
const activeTab = ref('basic')

interface InventoryFlow {
  productName: string
  quantityChange: number
  costChange: number
}

interface VoucherInfo {
  voucherCode: string
  voucherDate: string
  summary: string
  status: number
}

interface VoucherEntry {
  subjectName: string
  direction: number
  amount: number
}

const inventoryFlows = ref<InventoryFlow[]>([])
const voucher = ref<VoucherInfo | null>(null)
const entries = ref<VoucherEntry[]>([])

const getStatusText = (status: number) => {
  const statusMap: Record<string, string> = {
    '0': '正常',
    '-1': '已删除'
  }
  return statusMap[String(status)] || '未知'
}

const getStatusType = (status: number) => {
  const typeMap: Record<string, string> = {
    '0': 'success',
    '-1': 'info'
  }
  return typeMap[String(status)] || 'info'
}

const getCurrencyName = (code: string) => {
  const currency = mockCurrencies.find(c => c.code === code)
  return currency?.name || code
}

const formatDateTime = (dateTime?: string) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
}

const getVoucherStatusText = (status: number) => {
  const statusMap: Record<string, string> = {
    '0': '未审核',
    '1': '已审核',
    '2': '已记账'
  }
  return statusMap[String(status)] || '未知'
}

const getVoucherStatusType = (status: number) => {
  const typeMap: Record<string, string> = {
    '0': 'warning',
    '1': 'primary',
    '2': 'success'
  }
  return typeMap[String(status)] || 'info'
}

const handleBack = () => {
  router.push('/purchase/in')
}

const handleEdit = () => {
  if (purchase.value) {
    router.push(`/purchase/in/edit/${purchase.value.bizDocId}`)
  }
}

const handleDelete = () => {
  if (purchase.value) {
    const index = mockPurchaseInDocs.findIndex(item => item.bizDocId === purchase.value?.bizDocId)
    if (index !== -1) {
      mockPurchaseInDocs[index].status = -1
    }
    router.push('/purchase/in')
  }
}

onMounted(() => {
  const id = route.params.id as string
  purchase.value = mockPurchaseInDocs.find(item => item.bizDocId === id) || null
  
  if (purchase.value) {
    inventoryFlows.value = purchase.value.items.map(item => ({
      productName: item.productName,
      quantityChange: item.quantity,
      costChange: item.costAmount
    }))
    
    voucher.value = {
      voucherCode: `记-${purchase.value.writerTime.substring(0, 4)}${purchase.value.writerTime.substring(5, 7)}-${String(mockPurchaseInDocs.indexOf(purchase.value) + 1).padStart(3, '0')}`,
      voucherDate: purchase.value.tradeTime,
      summary: `采购入库凭证-${purchase.value.bizDocNo}`,
      status: 0
    }
    
    entries.value = [
      { subjectName: '库存商品', direction: 1, amount: purchase.value.totalCost },
      { subjectName: purchase.value.accountName, direction: 2, amount: purchase.value.totalCost }
    ]
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
  font-size: 18px;
  margin-left: 8px;
}

.amount {
  color: #22c55e;
  font-weight: 500;
}

.voucher-info {
  margin-bottom: 20px;
}

.voucher-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.voucher-label {
  width: 120px;
  color: #999;
}

.voucher-value {
  flex: 1;
  color: #333;
}

.debit {
  color: #ef4444;
}

.credit {
  color: #22c55e;
}

.empty-tip {
  text-align: center;
  color: #999;
  padding: 40px;
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