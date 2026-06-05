<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>查看收入</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <div class="view-container">
        <div class="view-row">
          <span class="view-label">单据编号</span>
          <span class="view-value">{{ income?.docNo || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">日期</span>
          <span class="view-value">{{ income?.date || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">客户</span>
          <span class="view-value">{{ income?.contactName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">账户</span>
          <span class="view-value">{{ income?.accountName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">项目</span>
          <span class="view-value">{{ income?.projectName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">状态</span>
          <el-tag :type="statusType">{{ statusText }}</el-tag>
        </div>
        
        <div class="view-row detail-section">
          <span class="view-label">单据明细</span>
          <div class="detail-content">
            <el-table :data="income?.details || []" border style="width: 100%">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column prop="categoryName" label="收支类别" width="200" />
              <el-table-column label="金额" width="150">
                <template #default="scope">
                  <span class="amount">¥ {{ scope.row.amount.toLocaleString() }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" />
            </el-table>
            <div class="detail-total">
              <span class="label">合计金额：</span>
              <span class="value">¥ {{ totalAmount.toLocaleString() }}</span>
            </div>
          </div>
        </div>
        
        <div class="view-row">
          <span class="view-label">备注</span>
          <span class="view-value">{{ income?.remark || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">创建时间</span>
          <span class="view-value">{{ formatDateTime(income?.createdAt) }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">更新时间</span>
          <span class="view-value">{{ formatDateTime(income?.updatedAt) }}</span>
        </div>
      </div>
      
      <div class="view-actions">
        <el-button type="primary" @click="handleEdit">编辑</el-button>
        <el-button @click="handleBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockIncomeDocs } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const income = ref<typeof mockIncomeDocs[0] | null>(null)

const statusText = computed(() => {
  const statusMap: Record<number, string> = {
    0: '未提交',
    1: '待审核',
    2: '已审核'
  }
  return statusMap[income.value?.status || 0] || '-'
})

const statusType = computed(() => {
  const typeMap: Record<number, string> = {
    0: 'info',
    1: 'warning',
    2: 'success'
  }
  return typeMap[income.value?.status || 0] || 'info'
})

const totalAmount = computed(() => {
  return (income.value?.details || []).reduce((sum, item) => sum + (item.amount || 0), 0)
})

const formatDateTime = (dateTime?: string) => {
  if (!dateTime) return '-'
  return new Date(dateTime).toLocaleString('zh-CN')
}

const handleBack = () => {
  router.push('/business/income')
}

const handleEdit = () => {
  if (income.value) {
    router.push(`/business/income/edit/${income.value.id}`)
  }
}

onMounted(() => {
  const id = route.params.id as string
  income.value = mockIncomeDocs.find(item => item.id === id) || null
  if (!income.value) {
    router.push('/business/income')
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
  color: #22c55e;
  font-weight: 600;
  font-size: 18px;
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
  color: #22c55e;
  font-weight: 600;
  font-size: 18px;
  margin-left: 8px;
}

.view-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>