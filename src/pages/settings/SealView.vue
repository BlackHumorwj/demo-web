<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>封账详情</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <div v-if="data" class="view-container">
        <el-descriptions title="封账记录信息" :column="2" border>
          <el-descriptions-item label="封账日期">{{ data.sealDate }}</el-descriptions-item>
          <el-descriptions-item label="封账类型">
            <el-tag :type="sealTypeTag(data.sealType)">{{ data.sealTypeName }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="原封账日期">{{ data.previousDate || '-' }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ data.operatorName }}</el-descriptions-item>
          <el-descriptions-item label="操作时间" :span="2">{{ data.operateTime }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ data.remark || '-' }}</el-descriptions-item>
        </el-descriptions>

        <div class="view-actions">
          <el-button type="primary" @click="handleAdjust">调整封账日期</el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { mockSealRecords } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string)
const data = computed(() => mockSealRecords.find(r => r.id === id.value) || null)

const sealTypeTag = (type: number) => {
  switch (type) {
    case 1: return 'primary'
    case 2: return 'success'
    case 3: return 'warning'
    default: return 'info'
  }
}

const handleBack = () => router.push('/settings/seal')
const handleAdjust = () => {
  if (!data.value) return
  router.push({ path: '/settings/seal/add', query: { from: data.value.id } })
}
</script>

<style scoped>
.page-container { padding: 24px; }
.page-card { min-height: 400px; }
.header-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.view-container { max-width: 800px; margin: 0 auto; padding: 20px 0; }
.view-actions { margin-top: 30px; text-align: center; }
.view-actions .el-button { margin: 0 8px; }
</style>
