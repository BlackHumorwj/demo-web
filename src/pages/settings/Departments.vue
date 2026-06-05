<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>部门管理</span>
          <el-button type="primary" size="small" @click="handleAdd">新增部门</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按部门名称搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
        
        <el-select v-model="statusFilter" placeholder="状态筛选" class="filter-select">
          <el-option label="全部" :value="-1" />
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </div>

      <el-table :data="paginatedDepartments" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="部门名称" />
        <el-table-column label="上级部门" width="100">
          <template #default="scope">
            <span>{{ scope.row.parentId ? getParentName(scope.row.parentId) : '无' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="openDeleteConfirm(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
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

    <el-dialog title="确认删除" :visible.sync="deleteDialogVisible" width="300px">
      <p>确定要删除部门「{{ deleteItem?.name }}」吗？</p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleDelete">确定删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockDepartments } from '@/data/mockData'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const departments = ref([...mockDepartments])
const searchKeyword = ref('')
const statusFilter = ref(-1)
const currentPage = ref(1)
const pageSize = ref(10)
const deleteDialogVisible = ref(false)
const deleteItem = ref<typeof mockDepartments[0] | null>(null)

const getParentName = (parentId: string): string => {
  const parent = departments.value.find(d => d.id === parentId)
  return parent?.name || '未知'
}

const filteredDepartments = computed(() => {
  let result = departments.value
  
  if (searchKeyword.value) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  if (statusFilter.value !== -1) {
    result = result.filter(item => item.status === statusFilter.value)
  }
  
  return result
})

const total = computed(() => filteredDepartments.value.length)

const paginatedDepartments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredDepartments.value.slice(start, end)
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

const handleAdd = () => {
  router.push('/settings/departments/add')
}

const handleEdit = (row: typeof mockDepartments[0]) => {
  router.push(`/settings/departments/edit/${row.id}`)
}

const openDeleteConfirm = (row: typeof mockDepartments[0]) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const handleDelete = () => {
  if (deleteItem.value) {
    departments.value = departments.value.filter(item => item.id !== deleteItem.value?.id)
  }
  deleteDialogVisible.value = false
}

const toggleStatus = (row: typeof mockDepartments[0]) => {
  const index = departments.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    departments.value[index].status = departments.value[index].status === 1 ? 0 : 1
  }
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
  width: 120px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>