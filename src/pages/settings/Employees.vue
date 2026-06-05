<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>员工列表</span>
          <el-button type="primary" size="small" @click="handleAdd">新增员工</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按姓名搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
        
        <el-select v-model="statusFilter" placeholder="状态筛选" class="filter-select">
          <el-option label="全部" :value="-1" />
          <el-option label="在职" :value="1" />
          <el-option label="离职" :value="0" />
        </el-select>
      </div>

      <el-table :data="paginatedEmployees" border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="staffNo" label="员工编号" width="100" />
        <el-table-column prop="name" label="员工姓名" />
        <el-table-column prop="contact" label="联系方式" />
        <el-table-column prop="email" label="工作邮箱" />
        <el-table-column prop="deptNames" label="所属部门" />
        <el-table-column prop="roleNames" label="角色" />
        <el-table-column prop="createdAt" label="入职时间" />
        <el-table-column label="在职状态" width="80">
          <template #default="scope">
            <el-tag :type="(scope.row.isActive || scope.row.status) === 1 ? 'success' : 'danger'">
              {{ (scope.row.isActive || scope.row.status) === 1 ? '在职' : '离职' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="openDeleteConfirm(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="toggleStatus(scope.row)">
              {{ (scope.row.isActive || scope.row.status) === 1 ? '离职' : '复职' }}
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
      <p>确定要删除员工「{{ deleteItem?.name }}」吗？</p>
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
import { mockEmployees } from '@/data/mockData'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()

const employees = ref([...mockEmployees])
const searchKeyword = ref('')
const statusFilter = ref(-1)
const currentPage = ref(1)
const pageSize = ref(10)
const deleteDialogVisible = ref(false)
const deleteItem = ref<typeof mockEmployees[0] | null>(null)

const filteredEmployees = computed(() => {
  let result = employees.value
  
  if (searchKeyword.value) {
    result = result.filter(item => 
      item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  if (statusFilter.value !== -1) {
    result = result.filter(item => (item.isActive || item.status) === statusFilter.value)
  }
  
  return result
})

const total = computed(() => filteredEmployees.value.length)

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredEmployees.value.slice(start, end)
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
  router.push('/settings/employees/add')
}

const handleEdit = (row: typeof mockEmployees[0]) => {
  router.push(`/settings/employees/edit/${row.id}`)
}

const openDeleteConfirm = (row: typeof mockEmployees[0]) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const handleDelete = () => {
  if (deleteItem.value) {
    const index = mockEmployees.findIndex(item => item.id === deleteItem.value?.id)
    if (index !== -1) {
      mockEmployees.splice(index, 1)
    }
    employees.value = [...mockEmployees]
  }
  deleteDialogVisible.value = false
}

const toggleStatus = (row: typeof mockEmployees[0]) => {
  const index = employees.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    const currentStatus = employees.value[index].isActive !== undefined ? employees.value[index].isActive : employees.value[index].status
    if (employees.value[index].isActive !== undefined) {
      employees.value[index].isActive = currentStatus === 1 ? 0 : 1
    }
    employees.value[index].status = currentStatus === 1 ? 0 : 1
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
