<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <span>分红详情</span>
        <div class="header-actions">
          <el-button v-if="detailData.status === 0 && !detailData.voucher" type="primary" @click="handleEdit">编辑</el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <div v-if="loading" class="loading-container">
        <el-loading text="加载中..." />
      </div>
      
      <div v-else class="detail-content">
        <el-card class="detail-section">
          <template #header>
            <span class="section-title">基本信息</span>
          </template>
          
          <div class="detail-row">
            <span class="detail-label">单据编号：</span>
            <span class="detail-value">{{ detailData.bizDocNo }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">业务日期：</span>
            <span class="detail-value">{{ detailData.tradeTime }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">股东：</span>
            <span class="detail-value">{{ detailData.shareholderName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">付款账户：</span>
            <span class="detail-value">{{ detailData.accountName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">分红金额：</span>
            <span class="detail-value amount">¥ {{ formatNumber(detailData.amount) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">状态：</span>
            <span class="detail-value">
              <el-tag :type="getStatusType(detailData.status)">
                {{ getStatusText(detailData.status) }}
              </el-tag>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">备注：</span>
            <span class="detail-value">{{ detailData.remark || '-' }}</span>
          </div>
        </el-card>
        
        <el-card class="detail-section">
          <template #header>
            <span class="section-title">币种信息</span>
          </template>
          
          <div class="detail-row">
            <span class="detail-label">币种代码：</span>
            <span class="detail-value">{{ detailData.currencyCode }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">汇率：</span>
            <span class="detail-value">{{ detailData.exchangeRate.toFixed(8) }}</span>
          </div>
        </el-card>
        
        <el-card class="detail-section">
          <template #header>
            <span class="section-title">操作信息</span>
          </template>
          
          <div class="detail-row">
            <span class="detail-label">制单人：</span>
            <span class="detail-value">{{ detailData.writerName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">制单时间：</span>
            <span class="detail-value">{{ detailData.writerTime }}</span>
          </div>
          <div v-if="detailData.updateId" class="detail-row">
            <span class="detail-label">修改人：</span>
            <span class="detail-value">{{ detailData.updateName }}</span>
          </div>
          <div v-if="detailData.updateTime" class="detail-row">
            <span class="detail-label">修改时间：</span>
            <span class="detail-value">{{ detailData.updateTime }}</span>
          </div>
        </el-card>
        
        <el-card v-if="detailData.voucher" class="detail-section">
          <template #header>
            <span class="section-title">财务凭证</span>
          </template>
          
          <div class="detail-row">
            <span class="detail-label">凭证编号：</span>
            <span class="detail-value">{{ detailData.voucher.voucherCode }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">凭证日期：</span>
            <span class="detail-value">{{ detailData.voucher.voucherDate }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">摘要：</span>
            <span class="detail-value">{{ detailData.voucher.summary }}</span>
          </div>
          
          <div v-if="detailData.entries && detailData.entries.length > 0" class="entries-section">
            <el-table :data="detailData.entries" border size="small" class="entries-table">
              <el-table-column prop="entryId" label="分录ID" />
              <el-table-column prop="subjectName" label="科目名称" />
              <el-table-column label="方向">
                <template #default="scope">
                  <span :class="scope.row.direction === 1 ? 'debit' : 'credit'">
                    {{ scope.row.direction === 1 ? '借方' : '贷方' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="金额">
                <template #default="scope">
                  <span>¥ {{ formatNumber(scope.row.amount) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockBonusDocs, type BonusDoc } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const loading = ref(true)

const detailData = reactive<BonusDoc>({
  bizDocId: '',
  bizDocNo: '',
  tradeTime: '',
  shareholderId: '',
  shareholderName: '',
  accountId: '',
  accountName: '',
  amount: 0,
  currencyCode: '',
  exchangeRate: 0,
  remark: '',
  writerId: '',
  writerName: '',
  writerTime: '',
  updateId: null,
  updateName: '',
  updateTime: null,
  status: 0
})

const loadData = () => {
  const bizDocId = route.params.id as string
  const doc = mockBonusDocs.find(item => item.bizDocId === bizDocId)
  
  if (!doc) {
    ElMessage.error('数据不存在')
    router.push('/business/bonus')
    return
  }
  
  Object.assign(detailData, doc)
  loading.value = false
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const getStatusText = (status: number): string => {
  const statusMap: Record<string, string> = {
    '0': '正常',
    '-1': '已删除'
  }
  return statusMap[String(status)] || '未知'
}

const getStatusType = (status: number): string => {
  const typeMap: Record<string, string> = {
    '0': 'success',
    '-1': 'danger'
  }
  return typeMap[String(status)] || 'info'
}

const handleBack = () => {
  router.push('/business/bonus')
}

const handleEdit = () => {
  router.push(`/business/bonus/edit/${detailData.bizDocId}`)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-card {
  min-height: 400px;
}

.header-actions {
  float: right;
}

.loading-container {
  padding: 40px;
  text-align: center;
}

.detail-content {
  padding: 10px;
}

.detail-section {
  margin-bottom: 20px;
}

.section-title {
  font-weight: 600;
}

.detail-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-label {
  width: 120px;
  color: #6b7280;
  flex-shrink: 0;
}

.detail-value {
  flex: 1;
  color: #1f2937;
}

.detail-value.amount {
  font-weight: 600;
  color: #ef4444;
}

.entries-section {
  margin-top: 16px;
}

.entries-table {
  margin-top: 10px;
}

.debit {
  color: #ef4444;
  font-weight: 500;
}

.credit {
  color: #22c55e;
  font-weight: 500;
}
</style>