<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>单位换算关系管理</span>
          <div>
            <el-button size="small" @click="handleBack">返回</el-button>
            <el-button type="primary" size="small" @click="openAdd">新增换算</el-button>
          </div>
        </div>
      </template>

      <el-alert
        title="换算规则：源单位与目标单位必须属于同一分组；1 源单位 = conversionRate 目标单位；自动支持双向换算。"
        type="info"
        :closable="false"
        show-icon
        class="tip-alert"
      />

      <el-table :data="paginatedList" border stripe>
        <el-table-column label="源单位" min-width="140">
          <template #default="scope">
            {{ scope.row.fromUnitName }}（{{ scope.row.fromUnitSymbol }}）
          </template>
        </el-table-column>
        <el-table-column label="换算公式" width="180" align="center">
          <template #default="scope">
            <span class="formula">
              1 {{ scope.row.fromUnitSymbol }} =
              <span class="rate">{{ scope.row.conversionRate }}</span>
              {{ scope.row.toUnitSymbol }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="目标单位" min-width="140">
          <template #default="scope">
            {{ scope.row.toUnitName }}（{{ scope.row.toUnitSymbol }}）
          </template>
        </el-table-column>
        <el-table-column prop="description" label="说明" min-width="160" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button
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

    <el-dialog title="新增换算关系" v-model="dialogVisible" width="520px">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="源单位" prop="fromUnitId">
          <el-select v-model="form.fromUnitId" placeholder="请选择源单位" style="width: 100%">
            <el-option
              v-for="u in availableUnits"
              :key="u.id"
              :label="`${u.unitName}（${u.unitSymbol}）- ${u.groupName}`"
              :value="u.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标单位" prop="toUnitId">
          <el-select v-model="form.toUnitId" placeholder="请选择目标单位" style="width: 100%">
            <el-option
              v-for="u in targetOptions"
              :key="u.id"
              :label="`${u.unitName}（${u.unitSymbol}）`"
              :value="u.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="换算比例" prop="conversionRate">
          <el-input-number
            v-model="form.conversionRate"
            :min="0.000001"
            :precision="6"
            :step="1"
            style="width: 100%"
          />
          <span class="input-tip">1 源单位 = X 目标单位，必须大于 0</span>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="form.description" type="textarea" :rows="2" maxlength="256" />
        </el-form-item>
        <el-form-item v-if="previewText" label="双向预览">
          <span class="preview">{{ previewText }}</span>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="确认删除" v-model="deleteVisible" width="360px">
      <p>确定删除换算关系吗？</p>
      <p class="tip">删除后将同时失效双向换算。</p>
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { mockUnits, mockUnitConversions, type UnitConversion } from '@/data/mockData'

const router = useRouter()

const conversions = ref<UnitConversion[]>([...mockUnitConversions])
const currentPage = ref(1)
const pageSize = ref(10)

const dialogVisible = ref(false)
const deleteVisible = ref(false)
const deleteItem = ref<UnitConversion | null>(null)

const formRef = ref<FormInstance>()
const form = reactive({
  fromUnitId: '',
  toUnitId: '',
  conversionRate: 1,
  description: ''
})

const rules: FormRules = {
  fromUnitId: [{ required: true, message: '请选择源单位', trigger: 'change' }],
  toUnitId: [{ required: true, message: '请选择目标单位', trigger: 'change' }],
  conversionRate: [{ required: true, message: '请输入换算比例', trigger: 'blur' }]
}

const availableUnits = computed(() => mockUnits.filter(u => u.status !== -1))

const sourceUnit = computed(() => mockUnits.find(u => u.id === form.fromUnitId))

const targetOptions = computed(() => {
  if (!sourceUnit.value) return []
  return mockUnits.filter(
    u =>
      u.status !== -1 &&
      u.groupId === sourceUnit.value?.groupId &&
      u.id !== form.fromUnitId
  )
})

const previewText = computed(() => {
  const s = sourceUnit.value
  const t = mockUnits.find(u => u.id === form.toUnitId)
  if (!s || !t) return ''
  const rate = Number(form.conversionRate) || 0
  const reverse = rate > 0 ? (1 / rate).toFixed(6) : '-'
  return `1 ${s.unitSymbol} = ${rate} ${t.unitSymbol}   |   1 ${t.unitSymbol} = ${reverse} ${s.unitSymbol}`
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return conversions.value.slice(start, start + pageSize.value)
})
const total = computed(() => conversions.value.length)

const handleBack = () => router.push('/settings/unit')

const openAdd = () => {
  form.fromUnitId = ''
  form.toUnitId = ''
  form.conversionRate = 1
  form.description = ''
  dialogVisible.value = true
}

const handleSave = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const s = sourceUnit.value
  const t = mockUnits.find(u => u.id === form.toUnitId)
  if (!s || !t) return ElMessage.error('请选择有效单位')
  if (s.groupId !== t.groupId) return ElMessage.error('源单位与目标单位必须属于同一分组')
  if (s.id === t.id) return ElMessage.error('源单位与目标单位不能相同')
  if (Number(form.conversionRate) <= 0) return ElMessage.error('换算比例必须大于 0')

  const id = String(Date.now())
  mockUnitConversions.push({
    id,
    fromUnitId: s.id,
    fromUnitName: s.unitName,
    fromUnitSymbol: s.unitSymbol,
    toUnitId: t.id,
    toUnitName: t.unitName,
    toUnitSymbol: t.unitSymbol,
    conversionRate: Number(form.conversionRate),
    description: form.description,
    status: 0,
    createTime: new Date().toLocaleString('zh-CN')
  })
  conversions.value = [...mockUnitConversions]
  ElMessage.success('新增成功')
  dialogVisible.value = false
}

const openDelete = (row: UnitConversion) => {
  deleteItem.value = row
  deleteVisible.value = true
}

const handleDelete = () => {
  if (!deleteItem.value) return
  const idx = mockUnitConversions.findIndex(c => c.id === deleteItem.value?.id)
  if (idx !== -1) mockUnitConversions.splice(idx, 1)
  conversions.value = [...mockUnitConversions]
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

.tip-alert {
  margin: 12px 0 16px;
}

.formula {
  font-family: Menlo, Consolas, monospace;
}

.formula .rate {
  color: #f56c6c;
  font-weight: 600;
  margin: 0 4px;
}

.pagination {
  margin-top: 16px;
  text-align: right;
}

.input-tip {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}

.preview {
  font-family: Menlo, Consolas, monospace;
  color: #409eff;
}

.tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}
</style>
