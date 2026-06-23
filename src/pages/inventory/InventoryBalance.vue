<template>
  <div class="page-container">
    <el-row :gutter="16" class="summary-row">
      <el-col :span="6">
        <el-card class="summary-card total">
          <div class="summary-label">产品品种</div>
          <div class="summary-value">{{ summary.totalKinds }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="summary-card normal">
          <div class="summary-label">库存正常</div>
          <div class="summary-value">{{ summary.normalKinds }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="summary-card warn">
          <div class="summary-label">库存预警</div>
          <div class="summary-value">{{ summary.warnKinds }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="summary-card total-cost">
          <div class="summary-label">库存总成本</div>
          <div class="summary-value">¥{{ summary.totalCost.toFixed(2) }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>库存余额查询</span>
          <div>
            <el-button size="small" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>&nbsp;刷新
            </el-button>
          </div>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="产品名称/编码"
          class="search-input"
          @keyup.enter="handleSearch"
          clearable
        />
        <el-select v-model="searchWarehouse" placeholder="仓库" class="search-status" clearable>
          <el-option
            v-for="w in mockWarehouses"
            :key="w.id"
            :label="w.name"
            :value="w.id"
          />
        </el-select>
        <el-select v-model="searchStatus" placeholder="库存状态" class="search-status" clearable>
          <el-option label="正常" :value="1" />
          <el-option label="库存不足" :value="2" />
          <el-option label="零库存" :value="3" />
          <el-option label="负库存" :value="4" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>

      <el-table :data="paginatedList" border stripe @row-click="handleRowClick">
        <el-table-column prop="prodCode" label="产品编码" min-width="110" />
        <el-table-column prop="prodName" label="产品名称" min-width="120" />
        <el-table-column prop="prodSpec" label="规格型号" min-width="110" />
        <el-table-column prop="categoryName" label="类别" width="100" />
        <el-table-column prop="warehouseName" label="仓库" width="110" />
        <el-table-column prop="unit" label="单位" width="80" align="center" />
        <el-table-column label="库存数量" width="110" align="right">
          <template #default="scope">
            <span :style="{ color: scope.row.stockQty < 0 ? '#f56c6c' : '' }">
              {{ scope.row.stockQty.toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="库存总成本" width="130" align="right">
          <template #default="scope">
            ¥{{ scope.row.totalCost.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="移动加权单价" width="130" align="right">
          <template #default="scope">
            ¥{{ scope.row.costPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="safeStock" label="安全库存" width="100" align="right" />
        <el-table-column label="状态" width="110">
          <template #default="scope">
            <el-tag :type="statusTagType(scope.row.status)" size="small">
              {{ scope.row.statusName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后更新" min-width="150" />
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredList.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </el-card>

    <el-drawer v-model="drawerVisible" :title="currentItem ? `${currentItem.prodName} - 详情` : '详情'" size="640px">
      <template v-if="currentItem">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="产品编码">{{ currentItem.prodCode }}</el-descriptions-item>
          <el-descriptions-item label="产品名称">{{ currentItem.prodName }}</el-descriptions-item>
          <el-descriptions-item label="规格型号">{{ currentItem.prodSpec }}</el-descriptions-item>
          <el-descriptions-item label="单位">{{ currentItem.unit }}</el-descriptions-item>
          <el-descriptions-item label="类别">{{ currentItem.categoryName }}</el-descriptions-item>
          <el-descriptions-item label="仓库">{{ currentItem.warehouseName }}</el-descriptions-item>
          <el-descriptions-item label="库存数量">
            <b>{{ currentItem.stockQty.toFixed(2) }}</b>
          </el-descriptions-item>
          <el-descriptions-item label="移动加权单价">¥{{ currentItem.costPrice.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="库存总成本">¥{{ currentItem.totalCost.toFixed(2) }}</el-descriptions-item>
          <el-descriptions-item label="安全库存">{{ currentItem.safeStock }}</el-descriptions-item>
        </el-descriptions>

        <h4 class="section-title">最近库存变动</h4>
        <el-table :data="mockInventoryFlows" size="small" border>
          <el-table-column prop="bizTypeName" label="业务类型" width="110" />
          <el-table-column prop="bizDocNo" label="单据编号" min-width="170" />
          <el-table-column label="数量变动" width="110" align="right">
            <template #default="scope">
              <span :style="{ color: scope.row.changeQty < 0 ? '#f56c6c' : '#67c23a' }">
                {{ scope.row.changeQty }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="成本变动" width="120" align="right">
            <template #default="scope">
              ¥{{ scope.row.changeCost.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="operateTime" label="操作时间" min-width="160" />
        </el-table>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockInventoryBalances, mockInventoryFlows, mockWarehouses, InventoryBalanceItem } from '@/data/mockData'

const searchKeyword = ref('')
const searchWarehouse = ref('')
const searchStatus = ref<number | ''>('')
const currentPage = ref(1)
const pageSize = ref(10)

const list = ref<InventoryBalanceItem[]>(mockInventoryBalances as InventoryBalanceItem[])

const filteredList = computed(() => {
  return list.value.filter(item => {
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      if (!item.prodName.toLowerCase().includes(kw) && !item.prodCode.toLowerCase().includes(kw)) return false
    }
    if (searchWarehouse.value && item.warehouseId !== searchWarehouse.value) return false
    if (searchStatus.value !== '' && item.status !== searchStatus.value) return false
    return true
  })
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const summary = computed(() => {
  const arr = list.value
  const total = arr.length
  let normal = 0
  let warn = 0
  let totalCost = 0
  arr.forEach(item => {
    if (item.status === 1) normal++
    else warn++
    totalCost += item.totalCost
  })
  return { totalKinds: total, normalKinds: normal, warnKinds: warn, totalCost }
})

const drawerVisible = ref(false)
const currentItem = ref<InventoryBalanceItem | null>(null)

const statusTagType = (status: number) => {
  switch (status) {
    case 1: return 'success'
    case 2: return 'warning'
    case 3: return 'info'
    case 4: return 'danger'
    default: return ''
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleRefresh = () => {
  list.value = [...mockInventoryBalances] as InventoryBalanceItem[]
}

const handleRowClick = (row: InventoryBalanceItem) => {
  currentItem.value = row
  drawerVisible.value = true
}
</script>

<style scoped>
.page-container {
  padding: 16px;
}

.summary-row {
  margin-bottom: 16px;
}

.summary-card {
  text-align: center;
}

.summary-label {
  font-size: 13px;
  color: #6b7280;
}

.summary-value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 600;
  color: #111827;
}

.summary-card.total .summary-value {
  color: #1f2937;
}

.summary-card.normal .summary-value {
  color: #10b981;
}

.summary-card.warn .summary-value {
  color: #f59e0b;
}

.summary-card.total-cost .summary-value {
  color: #3b82f6;
  font-size: 22px;
}

.page-card {
  margin-bottom: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.search-input {
  width: 220px;
}

.search-status {
  width: 160px;
}

.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}

.section-title {
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}
</style>
