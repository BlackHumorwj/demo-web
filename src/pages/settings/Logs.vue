<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>业务日志</span>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按操作人/操作类型搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
        
        <el-select v-model="actionFilter" placeholder="操作类型" class="filter-select">
          <el-option label="全部" value="" />
          <el-option label="登录系统" value="登录系统" />
          <el-option label="创建收入单据" value="创建收入单据" />
          <el-option label="审核支出单据" value="审核支出单据" />
        </el-select>
      </div>

      <el-table :data="paginatedLogs" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="userName" label="操作人" />
        <el-table-column prop="action" label="操作类型" />
        <el-table-column prop="target" label="操作对象" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="createdAt" label="操作时间" />
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
import { mockLogs } from '@/data/mockData'
import { Search } from '@element-plus/icons-vue'

const logs = ref([...mockLogs])
const searchKeyword = ref('')
const actionFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredLogs = computed(() => {
  let result = logs.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item => 
      item.userName.toLowerCase().includes(keyword) || 
      item.action.toLowerCase().includes(keyword)
    )
  }
  
  if (actionFilter.value) {
    result = result.filter(item => item.action === actionFilter.value)
  }
  
  return result
})

const total = computed(() => filteredLogs.value.length)

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
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

.search-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.search-input {
  width: 300px;
}

.filter-select {
  width: 150px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>