<template>
  <div class="page-container">
    <div class="page-header">
      <h2>凭证分录表</h2>
    </div>

    <el-card class="filter-card">
      <template #header>
        <span>筛选条件</span>
      </template>
      <div class="filter-row">
        <el-input
          v-model="queryForm.voucherCode"
          placeholder="凭证编号"
          class="filter-item"
          clearable
        />
        <el-date-picker
          v-model="queryForm.startDate"
          type="date"
          placeholder="开始日期"
          class="filter-item"
        />
        <el-date-picker
          v-model="queryForm.endDate"
          type="date"
          placeholder="结束日期"
          class="filter-item"
        />
        <el-select
          v-model="queryForm.status"
          placeholder="凭证状态"
          class="filter-item"
          clearable
        >
          <el-option label="全部" :value="null" />
          <el-option label="未审核" :value="0" />
          <el-option label="已审核" :value="1" />
          <el-option label="已记账" :value="2" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-card>

    <el-card class="page-card">
      <template #header>
        <span>凭证列表</span>
        <span class="total-count">共 {{ total }} 条记录</span>
      </template>

      <el-table :data="voucherList" border>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="voucherCode" label="凭证编号" width="140" />
        <el-table-column prop="voucherDate" label="凭证日期" width="100" />
        <el-table-column prop="summary" label="摘要" min-width="150" />
        <el-table-column label="状态" width="90">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="writerName" label="制单人" width="80" />
        <el-table-column prop="writerTime" label="制单时间" width="160" />
        <el-table-column label="操作" width="80">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              @click="handleView(scope.row.voucherId)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="total > 0"
        :current-page="queryForm.page"
        :page-size="queryForm.pageSize"
        :total="total"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        layout="total, prev, pager, next, jumper"
        class="pagination"
      />

      <div v-else class="empty-state">
        <el-empty description="暂无凭证数据" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { getVoucherPage } from '@/services/voucher'
import type { VoucherQueryDTO, Voucher } from '@/types/voucher'
import { STATUS_MAP, STATUS_TYPE_MAP } from '@/types/voucher'

const router = useRouter()

const queryForm = reactive({
  page: 1,
  pageSize: 10,
  voucherCode: '',
  startDate: '',
  endDate: '',
  status: undefined as number | undefined
})

const voucherList = ref<Voucher[]>([])
const total = ref(0)
const loading = ref(false)

const getStatusText = (status: number): string => {
  return STATUS_MAP[status] || '未知'
}

const getStatusType = (status: number): string => {
  return STATUS_TYPE_MAP[status] || 'default'
}

const handleSearch = async () => {
  queryForm.page = 1
  await fetchData()
}

const handleReset = () => {
  queryForm.voucherCode = ''
  queryForm.startDate = ''
  queryForm.endDate = ''
  queryForm.status = undefined
  queryForm.page = 1
  fetchData()
}

const handlePageChange = (page: number) => {
  queryForm.page = page
  fetchData()
}

const handleSizeChange = (pageSize: number) => {
  queryForm.pageSize = pageSize
  queryForm.page = 1
  fetchData()
}

const handleView = (voucherId: number) => {
  router.push(`/finance/voucher/view/${voucherId}`)
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await getVoucherPage({
      page: queryForm.page,
      pageSize: queryForm.pageSize,
      voucherCode: queryForm.voucherCode || undefined,
      startDate: queryForm.startDate || undefined,
      endDate: queryForm.endDate || undefined,
      status: queryForm.status
    })
    if (response.code === 0) {
      voucherList.value = response.data.list
      total.value = response.data.total
    }
  } catch (error) {
    console.error('获取凭证列表失败:', error)
  } finally {
    loading.value = false
  }
}

fetchData()
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-item {
  width: 180px;
}

.page-card {
  min-height: 400px;
}

.total-count {
  float: right;
  color: #999;
  font-size: 14px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}

.empty-state {
  padding: 40px;
}

.el-tag {
  cursor: default;
}
</style>