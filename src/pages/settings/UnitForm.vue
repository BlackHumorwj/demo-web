<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>{{ pageTitle }}</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="120px"
        class="form-container"
        :disabled="isView"
      >
        <el-form-item label="单位编码" prop="unitCode">
          <el-input
            v-model="form.unitCode"
            placeholder="请输入单位编码（唯一）"
            style="width: 400px"
            maxlength="20"
            :disabled="isEdit"
          />
          <span class="input-tip">最多20个字符，账套内唯一</span>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName">
          <el-input
            v-model="form.unitName"
            placeholder="请输入单位名称"
            style="width: 400px"
            maxlength="50"
          />
          <span class="input-tip">最多50个字符</span>
        </el-form-item>
        <el-form-item label="单位符号" prop="unitSymbol">
          <el-input
            v-model="form.unitSymbol"
            placeholder="如 kg、m、件"
            style="width: 400px"
            maxlength="10"
          />
          <span class="input-tip">最多10个字符</span>
        </el-form-item>
        <el-form-item label="单位类型" prop="unitType">
          <el-select v-model="form.unitType" placeholder="请选择" style="width: 400px">
            <el-option
              v-for="t in unitTypes"
              :key="t.value"
              :label="t.label"
              :value="t.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属分组" prop="groupId">
          <el-select
            v-model="form.groupId"
            placeholder="请选择分组（可选）"
            clearable
            style="width: 400px"
          >
            <el-option
              v-for="g in groupOptions"
              :key="g.id"
              :label="g.groupName"
              :value="g.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="小数位数" prop="decimalPlaces">
          <el-input-number v-model="form.decimalPlaces" :min="0" :max="4" />
          <span class="input-tip">范围 0-4，默认 2</span>
        </el-form-item>
        <el-form-item label="是否内置">
          <el-tag v-if="form.isBuiltIn === 1" type="warning">系统内置</el-tag>
          <el-tag v-else>自定义</el-tag>
        </el-form-item>
        <el-form-item label="备注" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            placeholder="请输入备注（可选）"
            style="width: 400px"
            :rows="3"
            maxlength="256"
          />
          <span class="input-tip">最多256个字符</span>
        </el-form-item>
        <el-form-item v-if="!isView">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { mockUnits, mockUnitGroups, type Unit } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const mode = computed(() => {
  if (route.path.includes('/add')) return 'add'
  if (route.path.includes('/edit')) return 'edit'
  if (route.path.includes('/view')) return 'view'
  return 'add'
})
const isEdit = computed(() => mode.value === 'edit')
const isView = computed(() => mode.value === 'view')
const pageTitle = computed(() => {
  if (mode.value === 'add') return '新增单位'
  if (mode.value === 'edit') return '编辑单位'
  return '查看单位'
})

const unitTypes = [
  { value: 1, label: '数量单位' },
  { value: 2, label: '货币单位' },
  { value: 3, label: '时间单位' },
  { value: 4, label: '面积单位' },
  { value: 5, label: '长度单位' },
  { value: 6, label: '重量单位' },
  { value: 7, label: '体积单位' }
]

const groupOptions = computed(() => mockUnitGroups.filter(g => g.status === 0))

const formRef = ref<FormInstance>()

const form = reactive({
  unitCode: '',
  unitName: '',
  unitSymbol: '',
  unitType: 1,
  groupId: '' as string | null,
  decimalPlaces: 2,
  description: '',
  isBuiltIn: 0
})

const rules: FormRules = {
  unitCode: [
    { required: true, message: '请输入单位编码', trigger: 'blur' },
    { max: 20, message: '最多20个字符', trigger: 'blur' }
  ],
  unitName: [
    { required: true, message: '请输入单位名称', trigger: 'blur' },
    { max: 50, message: '最多50个字符', trigger: 'blur' }
  ],
  unitSymbol: [
    { required: true, message: '请输入单位符号', trigger: 'blur' },
    { max: 10, message: '最多10个字符', trigger: 'blur' }
  ],
  unitType: [{ required: true, message: '请选择单位类型', trigger: 'change' }]
}

const fillForm = (u: Unit) => {
  form.unitCode = u.unitCode
  form.unitName = u.unitName
  form.unitSymbol = u.unitSymbol
  form.unitType = u.unitType
  form.groupId = u.groupId
  form.decimalPlaces = u.decimalPlaces
  form.description = u.description
  form.isBuiltIn = u.isBuiltIn
}

onMounted(() => {
  if (mode.value !== 'add') {
    const id = route.params.id as string
    const u = mockUnits.find(x => x.id === id)
    if (u) {
      fillForm(u)
    } else {
      ElMessage.error('单位不存在')
      router.push('/settings/unit')
    }
  }
})

const handleBack = () => {
  router.push('/settings/unit')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const unitType = unitTypes.find(t => t.value === form.unitType)
  const group = mockUnitGroups.find(g => g.id === form.groupId)

  if (mode.value === 'add') {
    const id = String(Date.now())
    mockUnits.push({
      id,
      unitCode: form.unitCode,
      unitName: form.unitName,
      unitSymbol: form.unitSymbol,
      unitType: form.unitType,
      unitTypeName: unitType?.label || '',
      groupId: form.groupId,
      groupName: group?.groupName || '',
      isBuiltIn: 0,
      decimalPlaces: form.decimalPlaces,
      description: form.description,
      status: 0,
      createTime: new Date().toLocaleString('zh-CN'),
      updateTime: new Date().toLocaleString('zh-CN')
    })
    ElMessage.success('新增成功')
  } else if (mode.value === 'edit') {
    const id = route.params.id as string
    const target = mockUnits.find(u => u.id === id)
    if (target) {
      const allowedEdit = target.isBuiltIn === 1
      target.unitName = form.unitName
      target.unitSymbol = form.unitSymbol
      target.unitType = form.unitType
      target.unitTypeName = unitType?.label || target.unitTypeName
      target.groupId = form.groupId
      target.groupName = group?.groupName || ''
      target.decimalPlaces = form.decimalPlaces
      if (!allowedEdit) {
        target.description = form.description
      } else {
        target.description = form.description
      }
      target.updateTime = new Date().toLocaleString('zh-CN')
      ElMessage.success('保存成功')
    }
  }

  router.push('/settings/unit')
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

.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 0;
}

.input-tip {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
