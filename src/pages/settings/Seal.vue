<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>封账管理</span>
          <div>
            <el-button size="small" @click="handleRefresh">
              <el-icon><Refresh /></el-icon>&nbsp;刷新
            </el-button>
            <el-button type="primary" size="small" @click="handleAdd">新增封账</el-button>
          </div>
        </div>
      </template>

      <el-alert
        v-if="currentSeal"
        :title="`当前有效封账日期：${currentSeal.sealDate}（${currentSeal.sealTypeName}）`"
        type="warning"
        show-icon
        :closable="false"
        style="margin-bottom: 16px"
      />
      <el-empty v-else description="暂未设置封账日期" :image-size="80" style="margin-bottom: 16px" />

      <el-table :data="paginatedRecords" border>
        <el-table-column prop="sealDate" label="封账日期" min-width="140" />
        <el-table-column label="封账类型" width="160">
          <template #default="scope">
            <el-tag :type="sealTypeTag(scope.row.sealType)">{{ scope.row.sealTypeName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="previousDate" label="原封账日期" min-width="140">
          <template #default="scope">
            {{ scope.row.previousDate || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
        <el-table-column prop="operatorName" label="操作人" min-width="100" />
        <el-table-column prop="operateTime" label="操作时间" min-width="160" />
        <el-table-column label="操作" width="160">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="handleAdd(scope.row)">调整</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockSealRecords, type SealRecord } from '@/data/mockData'
import { Refresh } from '@element-plus/icons-vue'

const router = useRouter()

const records = ref<SealRecord[]>(JSON.parse(JSON.stringify(mockSealRecords)))
const currentPage = ref(1)
const pageSize = ref(10)

const currentSeal = computed(() => records.value.length ? records.value[records.value.length - 1] : null)
const total = computed(() => records.value.length)
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return records.value.slice(start, start + pageSize.value)
})

const sealTypeTag = (type: number) => {
  switch (type) {
    case 1: return 'primary'
    case 2: return 'success'
    case 3: return 'warning'
    default: return 'info'
  }
}

const handleRefresh = () => {
  records.value = JSON.parse(JSON.stringify(mockSealRecords))
  currentPage.value = 1
}
const handleSizeChange = (val: number) => { pageSize.value = val }
const handleCurrentChange = (val: number) => { currentPage.value = val }

const handleAdd = (row?: SealRecord) => {
  router.push({ path: '/settings/seal/add', query: row?.id ? { from: row.id } : {} })
}

const handleView = (row: SealRecord) => {
  router.push(`/settings/seal/view/${row.id}`)
}
</script>

<style scoped>
.page-container { padding: 24px; }
.page-card { min-height: 400px; }
.header-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.pagination { margin-top: 16px; text-align: right; }
</style>
