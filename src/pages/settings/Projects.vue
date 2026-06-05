<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>项目管理</span>
          <el-button type="primary" size="small" @click="handleAdd">新增项目</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按项目编号/名称搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
        
        <el-select v-model="groupId" placeholder="项目组筛选" class="filter-select">
          <el-option label="全部" value="" />
          <el-option v-for="group in projectGroups" :key="group.id" :label="group.groupName" :value="group.id" />
        </el-select>
        
        <el-select v-model="statusFilter" placeholder="状态筛选" class="filter-select">
          <el-option label="全部" :value="-1" />
          <el-option label="启用" :value="1" />
          <el-option label="停用" :value="0" />
          <el-option label="归档" :value="2" />
        </el-select>
      </div>

      <el-table :data="paginatedProjects" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="projectNo" label="项目编号" />
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="groupName" label="项目组" />
        <el-table-column prop="leaderName" label="负责人" />
        <el-table-column prop="startDate" label="开始日期" />
        <el-table-column prop="endDate" label="结束日期" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="openDeleteConfirm(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.status === 1 ? '停用' : scope.row.status === 0 ? '启用' : '启用' }}
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
      <p>确定要删除项目「{{ deleteItem?.projectName }}」吗？</p>
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
import { mockProjects, mockProjectGroups } from '@/data/mockData'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const projects = ref([...mockProjects])
const searchKeyword = ref('')
const groupId = ref('')
const statusFilter = ref(-1)
const currentPage = ref(1)
const pageSize = ref(10)
const deleteDialogVisible = ref(false)
const deleteItem = ref<typeof mockProjects[0] | null>(null)

const projectGroups = computed(() => mockProjectGroups.filter(g => g.status === 1))

const getStatusTag = (status: number): string => {
  const map: Record<number, string> = {
    1: 'success',
    0: 'danger',
    2: 'warning'
  }
  return map[status] || 'default'
}

const getStatusName = (status: number): string => {
  const map: Record<number, string> = {
    1: '启用',
    0: '停用',
    2: '归档'
  }
  return map[status] || '未知'
}

const filteredProjects = computed(() => {
  let result = projects.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item => 
      item.projectName.toLowerCase().includes(keyword) || item.projectNo.toLowerCase().includes(keyword)
    )
  }
  
  if (groupId.value) {
    result = result.filter(item => item.groupId === groupId.value)
  }
  
  if (statusFilter.value !== -1) {
    result = result.filter(item => item.status === statusFilter.value)
  }
  
  return result
})

const total = computed(() => filteredProjects.value.length)

const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProjects.value.slice(start, end)
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
  router.push('/settings/projects/add')
}

const handleEdit = (row: typeof mockProjects[0]) => {
  router.push(`/settings/projects/edit/${row.id}`)
}

const openDeleteConfirm = (row: typeof mockProjects[0]) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const handleDelete = () => {
  if (deleteItem.value) {
    projects.value = projects.value.filter(item => item.id !== deleteItem.value?.id)
  }
  deleteDialogVisible.value = false
}

const toggleStatus = (row: typeof mockProjects[0]) => {
  const index = projects.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    projects.value[index].status = projects.value[index].status === 1 ? 0 : 1
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
  width: 150px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>