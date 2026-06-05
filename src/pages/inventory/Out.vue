<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary">新增出库</el-button>
    </div>
    <el-card class="page-card">
      <template #header>
        <span>出库管理</span>
      </template>
      <el-table :data="inventoryItems" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="productName" label="产品名称" />
        <el-table-column prop="warehouseName" label="仓库" />
        <el-table-column prop="quantity" label="出库数量" />
        <el-table-column label="成本单价" width="100">
          <template #default="scope">
            <span>¥ {{ scope.row.costPrice.toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总金额" width="120">
          <template #default="scope">
            <span class="amount">-¥ {{ scope.row.totalAmount.toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="出库时间" />
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
import { mockInventoryItems } from '@/data/mockData'

const inventoryItems = mockInventoryItems
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
  color: #ef4444;
}
</style>
