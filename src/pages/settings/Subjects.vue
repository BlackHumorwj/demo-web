<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>科目管理</span>
          <el-button type="primary" size="small" @click="handleAdd">新增科目</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按科目名称/编码搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
        
        <el-select v-model="typeFilter" placeholder="类型筛选" class="filter-select">
          <el-option label="全部" value="" />
          <el-option label="资产" value="asset" />
          <el-option label="负债" value="liability" />
          <el-option label="权益" value="equity" />
          <el-option label="收入" value="income" />
          <el-option label="费用" value="expense" />
        </el-select>
        
        <el-select v-model="statusFilter" placeholder="状态筛选" class="filter-select">
          <el-option label="全部" :value="-1" />
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </div>

      <el-table :data="paginatedSubjects" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="code" label="科目编码" />
        <el-table-column prop="name" label="科目名称" />
        <el-table-column label="层级" width="80">
          <template #default="scope">
            <el-tag type="info">第{{ scope.row.level }}级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">
              {{ getTypeName(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
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
      <p>确定要删除科目「{{ deleteItem?.code }} {{ deleteItem?.name }}」吗？</p>
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
import { mockSubjects } from '@/data/mockData'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()
const subjects = ref([...mockSubjects])
const searchKeyword = ref('')
const typeFilter = ref('')
const statusFilter = ref(-1)
const currentPage = ref(1)
const pageSize = ref(10)
const deleteDialogVisible = ref(false)
const deleteItem = ref<typeof mockSubjects[0] | null>(null)

const getTypeTag = (type: string): string => {
  const map: Record<string, string> = {
    asset: 'primary',
    liability: 'warning',
    equity: 'info',
    income: 'success',
    expense: 'danger'
  }
  return map[type] || 'default'
}

const getTypeName = (type: string): string => {
  const map: Record<string, string> = {
    asset: '资产',
    liability: '负债',
    equity: '权益',
    income: '收入',
    expense: '费用'
  }
  return map[type] || type
}

const filteredSubjects = computed(() => {
  let result = subjects.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item => 
      item.name.toLowerCase().includes(keyword) || item.code.toLowerCase().includes(keyword)
    )
  }
  
  if (typeFilter.value) {
    result = result.filter(item => item.type === typeFilter.value)
  }
  
  if (statusFilter.value !== -1) {
    result = result.filter(item => item.status === statusFilter.value)
  }
  
  return result
})

const total = computed(() => filteredSubjects.value.length)

const paginatedSubjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredSubjects.value.slice(start, end)
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
  router.push('/settings/subjects/add')
}

const handleEdit = (row: typeof mockSubjects[0]) => {
  router.push(`/settings/subjects/edit/${row.id}`)
}

const openDeleteConfirm = (row: typeof mockSubjects[0]) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const handleDelete = () => {
  if (deleteItem.value) {
    subjects.value = subjects.value.filter(item => item.id !== deleteItem.value?.id)
  }
  deleteDialogVisible.value = false
}

const toggleStatus = (row: typeof mockSubjects[0]) => {
  const index = subjects.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    subjects.value[index].status = subjects.value[index].status === 1 ? 0 : 1
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