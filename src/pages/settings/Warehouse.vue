<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>仓库管理</span>
          <el-button type="primary" size="small" @click="handleAdd">新增仓库</el-button>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="searchKeyword"
          placeholder="按仓库名称搜索"
          class="search-input"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch"><el-icon><Search /></el-icon></el-button>
          </template>
        </el-input>

        <el-select v-model="statusFilter" placeholder="状态" class="filter-select">
          <el-option label="全部" :value="-1" />
          <el-option label="正常" :value="0" />
          <el-option label="已删除" :value="-1" />
        </el-select>
      </div>

      <el-table :data="paginatedWarehouses" border>
        <el-table-column prop="warehouseName" label="仓库名称" />
        <el-table-column label="是否默认" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.isDefault === 1" type="primary">是</el-tag>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
            <el-tag v-else-if="scope.row.status === -1" type="info">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="inventoryCount" label="库存数量" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.isDefault !== 1"
              type="text"
              size="small"
              style="color: #ef4444"
              @click="openDeleteConfirm(scope.row)"
            >
              删除
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增仓库' : '编辑仓库'"
      width="480px"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="仓库名称" prop="warehouseName">
          <el-input v-model="form.warehouseName" maxlength="100" show-word-limit placeholder="请输入仓库名称" />
        </el-form-item>
        <el-form-item label="是否默认">
          <el-switch
            v-model="form.isDefault"
            :active-value="1"
            :inactive-value="0"
            active-text="设为默认仓库"
            inactive-text=""
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog title="确认删除" v-model="deleteDialogVisible" width="400px">
      <p v-if="deleteItem?.isDefault === 1" style="color: #e6a23c;">
        删除默认仓库将自动设置其他仓库为默认，确定继续？
      </p>
      <p v-else>
        确定要删除仓库「{{ deleteItem?.warehouseName }}」吗？
      </p>
      <template #footer>
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="handleDelete">确定删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockWarehousesDetail, type WarehouseDetail } from '@/data/mockData'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'

const warehouses = ref<WarehouseDetail[]>([...mockWarehousesDetail])
const searchKeyword = ref('')
const statusFilter = ref(-1)
const currentPage = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const dialogMode = ref<'add' | 'edit'>('add')
const formRef = ref<FormInstance | null>(null)

const form = ref<WarehouseDetail>({
  id: '',
  warehouseName: '',
  isDefault: 0,
  status: 0,
  createTime: '',
  updateTime: '',
  inventoryCount: 0
})

const rules: FormRules = {
  warehouseName: [
    { required: true, message: '请输入仓库名称', trigger: 'blur' },
    { max: 100, message: '长度不能超过100个字符', trigger: 'blur' }
  ]
}

const deleteDialogVisible = ref(false)
const deleteItem = ref<WarehouseDetail | null>(null)

const filteredWarehouses = computed(() => {
  let result = warehouses.value
  if (searchKeyword.value) {
    result = result.filter(item =>
      item.warehouseName.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  if (statusFilter.value !== -1) {
    result = result.filter(item => item.status === statusFilter.value)
  }
  return result
})

const total = computed(() => filteredWarehouses.value.length)

const paginatedWarehouses = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredWarehouses.value.slice(start, end)
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

const resetForm = () => {
  form.value = {
    id: '',
    warehouseName: '',
    isDefault: 0,
    status: 0,
    createTime: '',
    updateTime: '',
    inventoryCount: 0
  }
  formRef.value?.resetFields()
}

const handleAdd = () => {
  dialogMode.value = 'add'
  resetForm()
  dialogVisible.value = true
}

const handleEdit = (row: WarehouseDetail) => {
  dialogMode.value = 'edit'
  form.value = { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (!valid) return

    if (form.value.isDefault === 1) {
      warehouses.value.forEach(w => {
        if (w.id !== form.value.id) {
          w.isDefault = 0
        }
      })
    }

    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)

    if (dialogMode.value === 'add') {
      const newId = Date.now().toString()
      warehouses.value.unshift({
        ...form.value,
        id: newId,
        createTime: now,
        updateTime: now,
        inventoryCount: form.value.inventoryCount || 0
      })
      ElMessage.success('新增成功')
    } else {
      const index = warehouses.value.findIndex(w => w.id === form.value.id)
      if (index !== -1) {
        warehouses.value[index] = {
          ...warehouses.value[index],
          ...form.value,
          updateTime: now
        }
      }
      ElMessage.success('编辑成功')
    }

    dialogVisible.value = false
  })
}

const openDeleteConfirm = (row: WarehouseDetail) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const handleDelete = () => {
  if (!deleteItem.value) return
  const item = warehouses.value.find(w => w.id === deleteItem.value!.id)
  const wasDefault = item?.isDefault === 1

  warehouses.value = warehouses.value.filter(w => w.id !== deleteItem.value?.id)

  if (wasDefault && warehouses.value.length > 0) {
    warehouses.value[0].isDefault = 1
  }

  deleteDialogVisible.value = false
  deleteItem.value = null
  ElMessage.success('删除成功')
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
  width: 140px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}
</style>
