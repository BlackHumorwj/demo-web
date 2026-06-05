<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary">新增库存</el-button>
    </div>
    <el-card class="page-card">
      <template #header>
        <span>库存管理</span>
      </template>
      <el-table :data="inventoryList" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="itemName" label="物品名称" />
        <el-table-column prop="sku" label="SKU编码" />
        <el-table-column prop="stock" label="库存数量" />
        <el-table-column label="预警状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.stock < scope.row.minStock ? 'danger' : 'success'">
              {{ scope.row.stock < scope.row.minStock ? '库存不足' : '正常' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="minStock" label="最低库存" />
        <el-table-column label="操作" width="120">
          <template #default>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { mockInventory } from '@/data/mockData'

const inventoryList = mockInventory
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
</style>
