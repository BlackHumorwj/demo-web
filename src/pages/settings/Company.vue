<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>公司信息</span>
          <el-button type="primary" size="small" @click="handleAdd">新增公司</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按公司名称搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>
      </div>

      <el-table :data="paginatedCompanies" border>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="公司名称" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column prop="updatedAt" label="更新时间" />
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : scope.row.status === 1 ? '停用' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="openDeleteConfirm(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="toggleStatus(scope.row)">
              {{ scope.row.status === 0 ? '停用' : '启用' }}
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
      <p>确定要删除公司「{{ deleteItem?.name }}」吗？</p>
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
import { mockCompanies } from '@/data/mockData'
import { Search } from '@element-plus/icons-vue'

const router = useRouter()

const companies = ref([...mockCompanies])
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const deleteDialogVisible = ref(false)
const deleteItem = ref<typeof mockCompanies[0] | null>(null)

const filteredCompanies = computed(() => {
  if (!searchKeyword.value) return companies.value
  return companies.value.filter(item => 
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const total = computed(() => filteredCompanies.value.length)

const paginatedCompanies = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredCompanies.value.slice(start, end)
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
  router.push('/settings/company/add')
}

const handleEdit = (row: typeof mockCompanies[0]) => {
  router.push(`/settings/company/edit/${row.id}`)
}

const openDeleteConfirm = (row: typeof mockCompanies[0]) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const handleDelete = () => {
  if (deleteItem.value) {
    const index = mockCompanies.findIndex(item => item.id === deleteItem.value?.id)
    if (index !== -1) {
      mockCompanies.splice(index, 1)
    }
    companies.value = [...mockCompanies]
  }
  deleteDialogVisible.value = false
}

const toggleStatus = (row: typeof mockCompanies[0]) => {
  const index = companies.value.findIndex(item => item.id === row.id)
  if (index !== -1) {
    companies.value[index].status = companies.value[index].status === 0 ? 1 : 0
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
  margin-bottom: 16px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
