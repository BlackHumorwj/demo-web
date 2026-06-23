<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>盘点详情 - {{ data?.docNo }}</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <div v-if="data">
        <el-descriptions title="盘点单信息" :column="3" border>
          <el-descriptions-item label="盘点单号">{{ data.docNo }}</el-descriptions-item>
          <el-descriptions-item label="盘点日期">{{ data.takeDate }}</el-descriptions-item>
          <el-descriptions-item label="仓库">{{ data.warehouseName }}</el-descriptions-item>
          <el-descriptions-item label="盘点类型">{{ data.takeTypeName }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="data.status === 1 ? 'success' : data.status === -1 ? 'info' : 'warning'">
              {{ data.statusName }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="制单人">{{ data.writerName }}</el-descriptions-item>
          <el-descriptions-item label="制单时间" :span="3">{{ data.writeTime }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="3">{{ data.remark || '-' }}</el-descriptions-item>
        </el-descriptions>

        <el-row :gutter="20" style="margin-top: 16px">
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-label">产品种数</div>
              <div class="stat-value">{{ data.totalKinds }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-label">盘盈种数</div>
              <div class="stat-value" style="color: #67c23a">{{ data.profitKinds }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-label">盘盈金额</div>
              <div class="stat-value" style="color: #67c23a">¥{{ data.profitAmount.toFixed(2) }}</div>
            </el-card>
          </el-col>
          <el-col :span="6">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-label">盘亏金额</div>
              <div class="stat-value" style="color: #f56c6c">¥{{ data.lossAmount.toFixed(2) }}</div>
            </el-card>
          </el-col>
        </el-row>

        <el-divider content-position="left">盘点明细</el-divider>

        <el-table :data="data.details" border>
          <el-table-column prop="prodName" label="产品名称" min-width="140" />
          <el-table-column prop="prodSpec" label="规格型号" min-width="120" />
          <el-table-column prop="unit" label="单位" width="80" />
          <el-table-column prop="bookQty" label="账存数量" width="110" align="right" />
          <el-table-column prop="actualQty" label="实盘数量" width="110" align="right" />
          <el-table-column label="盈亏数量" width="110" align="right">
            <template #default="scope">
              <span :style="{ color: diffColor(scope.row.diffQty) }">{{ scope.row.diffQty }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="costPrice" label="成本价" width="110" align="right">
            <template #default="scope">¥{{ scope.row.costPrice.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="盈亏金额" width="120" align="right">
            <template #default="scope">
              <span :style="{ color: diffColor(scope.row.diffAmount) }">¥{{ scope.row.diffAmount.toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <template v-if="data.status === 1">
          <el-divider content-position="left">关联单据</el-divider>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="盘盈入库单">{{ data.relatedProfitDocNo || '-' }}</el-descriptions-item>
            <el-descriptions-item label="盘亏出库单">{{ data.relatedLossDocNo || '-' }}</el-descriptions-item>
          </el-descriptions>
        </template>

        <div class="view-actions">
          <el-button v-if="data.status === 0" type="primary" @click="handleEdit">编辑</el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockStocktakeRecords } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string)
const data = computed(() => mockStocktakeRecords.find(r => r.id === id.value) || null)

const diffColor = (n: number) => {
  if (n > 0) return '#67c23a'
  if (n < 0) return '#f56c6c'
  return '#909399'
}

const handleBack = () => router.push('/inventory/stocktake')
const handleEdit = () => {
  if (!data.value) return
  router.push(`/inventory/stocktake/edit/${data.value.id}`)
}
</script>

<style scoped>
.page-container { padding: 24px; }
.page-card { min-height: 400px; }
.header-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.stat-card { text-align: center; }
.stat-label { font-size: 13px; color: #909399; }
.stat-value { font-size: 22px; font-weight: 600; margin-top: 8px; color: #303133; }
.view-actions { margin-top: 30px; text-align: center; }
.view-actions .el-button { margin: 0 8px; }
</style>
