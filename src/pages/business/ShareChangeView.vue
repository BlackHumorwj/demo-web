<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>股权变更详情</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <div v-if="detail" class="detail-container">
        <div class="detail-section">
          <h3 class="section-title">基本信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">单据编号</span>
              <span class="value">{{ detail.bizDocNo }}</span>
            </div>
            <div class="info-item">
              <span class="label">业务日期</span>
              <span class="value">{{ detail.tradeTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">变更类型</span>
              <el-tag :type="detail.changeType === 1 ? 'success' : 'warning'">
                {{ detail.changeTypeName }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="label">状态</span>
              <el-tag :type="detail.status === 0 ? 'success' : 'danger'">
                {{ detail.status === 0 ? '正常' : '已删除' }}
              </el-tag>
            </div>
            <div class="info-item">
              <span class="label">变更金额</span>
              <span :class="['value', 'amount', detail.changeType === 1 ? 'income' : 'expense']">
                {{ detail.changeType === 2 ? '-' : '' }}¥ {{ detail.amount.toLocaleString() }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">币种</span>
              <span class="value">{{ getCurrencyName(detail.currencyCode) }}</span>
            </div>
            <div class="info-item">
              <span class="label">汇率</span>
              <span class="value">{{ detail.exchangeRate.toFixed(8) }}</span>
            </div>
            <div class="info-item">
              <span class="label">制单时间</span>
              <span class="value">{{ detail.writerTime }}</span>
            </div>
          </div>
        </div>
        
        <div class="detail-section">
          <h3 class="section-title">关联信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">股东</span>
              <span class="value">{{ detail.shareholderName }}</span>
            </div>
            <div class="info-item">
              <span class="label">收付款账户</span>
              <span class="value">{{ detail.accountName }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="detail.voucher" class="detail-section">
          <h3 class="section-title">财务信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">凭证编号</span>
              <span class="value">{{ detail.voucher.voucherCode }}</span>
            </div>
            <div class="info-item">
              <span class="label">凭证日期</span>
              <span class="value">{{ detail.voucher.voucherDate }}</span>
            </div>
            <div class="info-item">
              <span class="label">凭证摘要</span>
              <span class="value">{{ detail.voucher.summary }}</span>
            </div>
          </div>
          
          <div v-if="detail.entries && detail.entries.length > 0" class="entries-table">
            <h4 class="entries-title">凭证分录</h4>
            <el-table :data="detail.entries" border>
              <el-table-column prop="subjectName" label="科目名称" />
              <el-table-column label="方向">
                <template #default="scope">
                  <el-tag :type="scope.row.direction === 1 ? 'primary' : 'success'">
                    {{ scope.row.directionName }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="金额">
                <template #default="scope">
                  <span class="amount">{{ scope.row.direction === 1 ? '' : '-' }}¥ {{ scope.row.amount.toLocaleString() }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        
        <div class="detail-section">
          <h3 class="section-title">备注</h3>
          <div class="remark-content">
            {{ detail.remark || '无' }}
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <el-empty description="暂无数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockShareChangeDocs, mockCurrencies, type ShareChangeDetail } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const detail = ref<ShareChangeDetail | null>(null)

const getCurrencyName = (code: string) => {
  const currency = mockCurrencies.find(c => c.code === code)
  return currency?.name || code
}

const loadData = () => {
  const id = Number(route.params.id)
  const record = mockShareChangeDocs.find(item => item.bizDocId === id)
  
  if (!record) {
    alert('记录不存在')
    router.push('/business/share-change')
    return
  }
  
  detail.value = record
}

const handleBack = () => {
  router.push('/business/share-change')
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

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.detail-container {
  padding: 20px;
}

.detail-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-item .label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.info-item .value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.amount {
  font-weight: 600;
}

.amount.income {
  color: #22c55e;
}

.amount.expense {
  color: #ef4444;
}

.entries-table {
  margin-top: 16px;
}

.entries-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 12px;
}

.remark-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  padding: 12px;
  background: #fafafa;
  border-radius: 4px;
}

.empty-state {
  padding: 40px;
}
</style>