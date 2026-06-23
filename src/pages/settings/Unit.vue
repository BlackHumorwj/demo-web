<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>产品单位管理</span>
          <div>
            <el-button size="small" @click="handleGroup">单位分组</el-button>
            <el-button size="small" @click="handleConversion">换算关系</el-button>
            <el-button type="primary" size="small" @click="handleAdd">新增单位</el-button>
          </div>
        </div>
      </template>

      <div class="search-bar">
        <el-input
          v-model="codeFilter"
          placeholder="单位编码"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-input
          v-model="nameFilter"
          placeholder="单位名称/符号"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-select v-model="typeFilter" placeholder="单位类型" class="filter-select" clearable>
          <el-option v-for="t in unitTypes" :key="t.value" :label="t.label" :value="t.value" />
        </el-select>
        <el-select v-model="groupFilter" placeholder="所属分组" class="filter-select" clearable>
          <el-option
            v-for="g in mockUnitGroups.filter(g => g.status === 0)"
            :key="g.id"
            :label="g.groupName"
            :value="g.id"
          />
        </el-select>
        <el-select v-model="statusFilter" placeholder="状态" class="filter-select" clearable>
          <el-option label="全部" :value="-1" />
          <el-option label="正常" :value="0" />
          <el-option label="停用" :value="1" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleRefresh">刷新</el-button>
      </div>

      <el-table :data="paginatedList" border stripe>
        <el-table-column prop="unitCode" label="单位编码" width="130" />
        <el-table-column prop="unitName" label="单位名称" width="110" />
        <el-table-column prop="unitSymbol" label="单位符号" width="100" />
        <el-table-column prop="unitTypeName" label="单位类型" width="110" />
        <el-table-column prop="groupName" label="所属分组" width="110" />
        <el-table-column label="小数位" width="80" align="center">
          <template #default="scope">{{ scope.row.decimalPlaces }}</template>
        </el-table-column>
        <el-table-column label="内置" width="80" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isBuiltIn === 1" type="warning" size="small">内置</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="140" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'info'" size="small">
              {{ scope.row.status === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              style="color: #e6a23c"
              @click="handleToggle(scope.row, 1)"
            >
              停用
            </el-button>
            <el-button
              v-if="scope.row.status === 1"
              type="text"
              size="small"
              style="color: #67c23a"
              @click="handleToggle(scope.row, 0)"
            >
              启用
            </el-button>
            <el-button
              v-if="scope.row.status === 0 && scope.row.isBuiltIn === 0"
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

    <el-dialog title="确认删除" v-model="deleteDialogVisible" width="360px">
      <p>确定要删除单位「{{ deleteItem?.unitName }}」吗？</p>
      <p class="dialog-tip">删除后将不可恢复，且已被业务单据引用的单位无法删除。</p>
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
import { ElMessage } from 'element-plus'
import { mockUnits, mockUnitGroups, type Unit } from '@/data/mockData'

const router = useRouter()

const unitTypes = [
  { value: 1, label: '数量单位' },
  { value: 2, label: '货币单位' },
  { value: 3, label: '时间单位' },
  { value: 4, label: '面积单位' },
  { value: 5, label: '长度单位' },
  { value: 6, label: '重量单位' },
  { value: 7, label: '体积单位' }
]

const units = ref<Unit[]>([...mockUnits])
const codeFilter = ref('')
const nameFilter = ref('')
const typeFilter = ref<number | ''>('')
const groupFilter = ref<string | null>(null)
const statusFilter = ref(-1)
const currentPage = ref(1)
const pageSize = ref(10)
const deleteDialogVisible = ref(false)
const deleteItem = ref<Unit | null>(null)

const filteredList = computed(() => {
  let result = units.value.filter(u => u.status !== -1)
  if (codeFilter.value) {
    const c = codeFilter.value.toLowerCase()
    result = result.filter(u => u.unitCode.toLowerCase().includes(c))
  }
  if (nameFilter.value) {
    const n = nameFilter.value.toLowerCase()
    result = result.filter(
      u => u.unitName.toLowerCase().includes(n) || u.unitSymbol.toLowerCase().includes(n)
    )
  }
  if (typeFilter.value !== '') {
    result = result.filter(u => u.unitType === typeFilter.value)
  }
  if (groupFilter.value) {
    result = result.filter(u => u.groupId === groupFilter.value)
  }
  if (statusFilter.value !== -1) {
    result = result.filter(u => u.status === statusFilter.value)
  }
  return result
})

const total = computed(() => filteredList.value.length)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredList.value.slice(start, end)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleRefresh = () => {
  codeFilter.value = ''
  nameFilter.value = ''
  typeFilter.value = ''
  groupFilter.value = null
  statusFilter.value = -1
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
  router.push('/settings/unit/add')
}

const handleView = (row: Unit) => {
  router.push(`/settings/unit/view/${row.id}`)
}

const handleEdit = (row: Unit) => {
  router.push(`/settings/unit/edit/${row.id}`)
}

const handleGroup = () => {
  router.push('/settings/unit-group')
}

const handleConversion = () => {
  router.push('/settings/unit-conversion')
}

const handleToggle = (row: Unit, status: number) => {
  const target = mockUnits.find(u => u.id === row.id)
  if (target) {
    target.status = status
    target.updateTime = new Date().toLocaleString('zh-CN')
    units.value = [...mockUnits]
    ElMessage.success(status === 0 ? '已启用' : '已停用')
  }
}

const openDeleteConfirm = (row: Unit) => {
  deleteItem.value = row
  deleteDialogVisible.value = true
}

const handleDelete = () => {
  if (deleteItem.value) {
    const target = mockUnits.find(u => u.id === deleteItem.value?.id)
    if (target) {
      target.status = -1
      target.updateTime = new Date().toLocaleString('zh-CN')
      units.value = [...mockUnits]
    }
    ElMessage.success('删除成功')
  }
  deleteDialogVisible.value = false
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
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input {
  width: 180px;
}

.filter-select {
  width: 140px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

.dialog-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>
