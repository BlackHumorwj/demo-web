<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary">新增收款</el-button>
    </div>
    <el-card class="page-card">
      <template #header>
        <span>收款管理</span>
      </template>
      <el-table :data="receiptList" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="date" label="日期" />
        <el-table-column prop="contactName" label="客户" />
        <el-table-column label="金额" width="120">
          <template #default="scope">
            <span class="amount income">¥ {{ scope.row.amount.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 2 ? 'success' : 'warning'">
              {{ scope.row.statusText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockBusinessDocs } from '@/data/mockData'

const receiptList = computed(() => mockBusinessDocs.filter(doc => doc.type === 'receipt'))
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  margin-bottom: 20px;
}

.page-card {
  min-height: 400px;
}

.amount {
  font-weight: 600;
}

.amount.income {
  color: #22c55e;
}
</style>
