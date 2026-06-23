<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>单位分组管理</span>
          <div>
            <el-button size="small" @click="handleBack">返回</el-button>
            <el-button type="primary" size="small" @click="openAdd">新增分组</el-button>
          </div>
        </div>
      </template>

      <el-table :data="paginatedList" border stripe>
        <el-table-column prop="groupName" label="分组名称" min-width="140" />
        <el-table-column prop="sortOrder" label="排序" width="90" align="center" />
        <el-table-column label="单位数量" width="110" align="center">
          <template #default="scope">
            {{ unitCountMap[scope.row.id] || 0 }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="200" show-overflow-tooltip />
        <el-table-column label="状态" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'info'" size="small">
              {{ scope.row.status === 0 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="openEdit(scope.row)">编辑</el-button>
            <el-button
              v-if="scope.row.status === 0"
              type="text"
              size="small"
              style="color: #ef4444"
              @click="openDelete(scope.row)"
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
      />
    </el-card>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="480px">
      <el-form :model="form" label-width="100px">
        <el-form-item label="分组名称" required>
          <el-input v-model="form.groupName" placeholder="请输入分组名称" maxlength="50" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="form.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.description" type="textarea" :rows="3" maxlength="256" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="确认删除" v-model="deleteVisible" width="360px">
      <p>确定删除分组「{{ deleteItem?.groupName }}」吗？</p>
      <p class="tip">若分组下仍有单位，请先调整或删除对应单位。</p>
      <template #footer>
        <el-button @click="deleteVisible = false">取消</el-button>
        <el-button type="danger" @click="handleDelete">确定删除</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockUnitGroups, mockUnits, type UnitGroup } from '@/data/mockData'

const router = useRouter()

const groups = ref<UnitGroup[]>([...mockUnitGroups])
const currentPage = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const dialogTitle = ref('')
const deleteVisible = ref(false)
const deleteItem = ref<UnitGroup | null>(null)
const editingId = ref<string | null>(null)

const form = reactive({
  groupName: '',
  sortOrder: 0,
  description: ''
})

const unitCountMap = computed(() => {
  const map: Record<string, number> = {}
  mockUnits
    .filter(u => u.status !== -1 && u.groupId)
    .forEach(u => {
      if (u.groupId) map[u.groupId] = (map[u.groupId] || 0) + 1
    })
  return map
})

const filteredList = computed(() => groups.value.filter(g => g.status !== -1))
const total = computed(() => filteredList.value.length)

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const handleBack = () => router.push('/settings/unit')

const resetForm = () => {
  form.groupName = ''
  form.sortOrder = 0
  form.description = ''
  editingId.value = null
}

const openAdd = () => {
  resetForm()
  dialogTitle.value = '新增分组'
  dialogVisible.value = true
}

const openEdit = (row: UnitGroup) => {
  resetForm()
  editingId.value = row.id
  form.groupName = row.groupName
  form.sortOrder = row.sortOrder
  form.description = row.description
  dialogTitle.value = '编辑分组'
  dialogVisible.value = true
}

const handleSave = () => {
  if (!form.groupName.trim()) {
    ElMessage.warning('请输入分组名称')
    return
  }
  if (editingId.value) {
    const target = mockUnitGroups.find(g => g.id === editingId.value)
    if (target) {
      target.groupName = form.groupName
      target.sortOrder = form.sortOrder
      target.description = form.description
      target.updateTime = new Date().toLocaleString('zh-CN')
      ElMessage.success('保存成功')
    }
  } else {
    const id = String(Date.now())
    mockUnitGroups.push({
      id,
      groupName: form.groupName,
      sortOrder: form.sortOrder,
      description: form.description,
      status: 0,
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN')
    })
    ElMessage.success('新增成功')
  }
  groups.value = [...mockUnitGroups]
  dialogVisible.value = false
}

const openDelete = (row: UnitGroup) => {
  deleteItem.value = row
  deleteVisible.value = true
}

const handleDelete = () => {
  if (!deleteItem.value) return
  const count = unitCountMap.value[deleteItem.value.id] || 0
  if (count > 0) {
    ElMessage.error('分组下存在单位，禁止删除')
    deleteVisible.value = false
    return
  }
  const target = mockUnitGroups.find(g => g.id === deleteItem.value?.id)
  if (target) {
    target.status = -1
    target.updateTime = new Date().toLocaleString('zh-CN')
    groups.value = [...mockUnitGroups]
  }
  ElMessage.success('删除成功')
  deleteVisible.value = false
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

.pagination {
  margin-top: 16px;
  text-align: right;
}

.tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>
