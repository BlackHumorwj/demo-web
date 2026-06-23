<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>查看产品</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <div class="view-container">
        <div class="view-row">
          <span class="view-label">产品名称</span>
          <span class="view-value">{{ product?.productName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">规格型号</span>
          <span class="view-value">{{ product?.specification || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">单位</span>
          <span class="view-value">{{ product?.unit || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">成本价</span>
          <span class="view-value amount">¥{{ Number(product?.costPrice || 0).toFixed(4) }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">收入类别</span>
          <span class="view-value">{{ product?.incomeCategoryName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">成本类别</span>
          <span class="view-value">{{ product?.costCategoryName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">产品分组</span>
          <span class="view-value">{{ product?.productGroupName || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">期初库存</span>
          <span class="view-value">{{ product?.initialStock ?? '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">状态</span>
          <el-tag :type="product?.status === 0 ? 'success' : 'info'">
            {{ product?.status === 0 ? '正常' : '已删除' }}
          </el-tag>
        </div>

        <div class="view-row detail-section">
          <span class="view-label">库存信息</span>
          <div class="detail-content">
            <el-table
              v-if="product?.inventories && product.inventories.length > 0"
              :data="product.inventories"
              border
              style="width: 100%"
            >
              <el-table-column prop="warehouseName" label="仓库名称" />
              <el-table-column prop="quantity" label="库存数量" width="120" />
              <el-table-column label="单位成本" width="140">
                <template #default="scope">
                  <span class="amount">¥{{ Number(scope.row.unitCost).toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="总成本" width="160">
                <template #default="scope">
                  <span class="amount">¥{{ Number(scope.row.totalCost).toFixed(2) }}</span>
                </template>
              </el-table-column>
            </el-table>
            <div v-else class="empty-tip">暂无库存信息</div>
          </div>
        </div>

        <div class="view-row">
          <span class="view-label">备注</span>
          <span class="view-value">{{ product?.remark || '-' }}</span>
        </div>
        <div class="view-row">
          <span class="view-label">创建时间</span>
          <span class="view-value">{{ product?.writerTime || '-' }}</span>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockProductsDetail } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const product = ref<typeof mockProductsDetail[0] | null>(null)

const handleBack = () => {
  router.push('/settings/product')
}

const handleEdit = () => {
  if (product.value) {
    router.push(`/settings/product/edit/${product.value.id}`)
  }
}

onMounted(() => {
  const id = route.params.id as string
  product.value = mockProductsDetail.find(item => item.id === id) || null
  if (!product.value) {
    router.push('/settings/product')
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
}

.detail-content {
  flex: 1;
  margin-top: 12px;
}

.empty-tip {
  padding: 16px;
  text-align: center;
  color: #999;
  background: #fafafa;
  border: 1px dashed #e8e8e8;
}

.view-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
