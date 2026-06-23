<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>账本详情</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <div v-if="data" class="view-container">
        <div class="view-row">
          <div class="view-label">账本名称</div>
          <div class="view-value">{{ data.ledgerName }}</div>
        </div>
        <div class="view-row">
          <div class="view-label">账本类型</div>
          <div class="view-value">{{ data.ledgerType }}</div>
        </div>
        <div class="view-row">
          <div class="view-label">本位币</div>
          <div class="view-value">{{ getCurrencyLabel(data.currencyCode) }}</div>
        </div>
        <div class="view-row">
          <div class="view-label">开始日期</div>
          <div class="view-value">{{ data.startDate }}</div>
        </div>
        <div class="view-row">
          <div class="view-label">状态</div>
          <div class="view-value">
            <el-tag :type="data.status === 0 ? 'success' : data.status === 1 ? 'warning' : 'info'">
              {{ data.status === 0 ? '正常' : data.status === 1 ? '停用' : '已删除' }}
            </el-tag>
          </div>
        </div>
        <div class="view-row">
          <div class="view-label">创建时间</div>
          <div class="view-value">{{ data.createTime }}</div>
        </div>
        <div class="view-row">
          <div class="view-label">更新时间</div>
          <div class="view-value">{{ data.updateTime }}</div>
        </div>
        <div class="view-row">
          <div class="view-label">是否有交易记录</div>
          <div class="view-value">{{ data.hasTransactions ? '是' : '否' }}</div>
        </div>

        <div class="view-actions">
          <el-button type="primary" @click="handleEdit">编辑</el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockLedgers, mockCurrencies } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string)

const data = computed(() => mockLedgers.find(item => item.id === id.value) || null)

const getCurrencyLabel = (code: string) => {
  const found = mockCurrencies.find(c => c.code === code)
  return found ? `${found.code} ${found.name}` : code
}

const handleEdit = () => {
  if (!data.value) return
  router.push(`/settings/ledger/edit/${data.value.id}`)
}

const handleBack = () => {
  router.push('/settings/ledger')
}
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
  max-width: 700px;
  margin: 0 auto;
  padding: 20px 0;
}

.view-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
}

.view-label {
  width: 160px;
  color: #606266;
  font-weight: 500;
}

.view-value {
  flex: 1;
  color: #303133;
}

.view-actions {
  margin-top: 30px;
  padding-left: 160px;
}
</style>
