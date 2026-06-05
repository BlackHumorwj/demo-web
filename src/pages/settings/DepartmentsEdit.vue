<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑部门</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" style="width: 400px" maxlength="50" />
          <span class="input-tip">最多50个字符</span>
        </el-form-item>
        <el-form-item label="上级部门" prop="parentId">
          <el-select v-model="form.parentId" placeholder="请选择上级部门（可选）" style="width: 400px">
            <el-option label="无（顶级部门）" :value="''" />
            <el-option v-for="dept in parentOptions" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息（可选）" style="width: 400px" :rows="3" maxlength="256" />
          <span class="input-tip">最多256个字符</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { mockDepartments } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()

const form = reactive({
  id: '',
  name: '',
  parentId: '',
  remark: '',
  status: 1
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
}

const parentOptions = computed(() => {
  return mockDepartments.filter(d => d.parentId === null && d.id !== form.id)
})

onMounted(() => {
  const id = route.params.id as string
  const department = mockDepartments.find(item => item.id === id)
  if (department) {
    form.id = department.id
    form.name = department.name
    form.parentId = department.parentId || ''
    form.remark = department.remark
    form.status = department.status
  } else {
    router.push('/settings/departments')
  }
})

const handleBack = () => {
  router.push('/settings/departments')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const index = mockDepartments.findIndex(item => item.id === form.id)
  if (index !== -1) {
    const newParentId = form.parentId ? form.parentId : null
    mockDepartments[index] = {
      ...mockDepartments[index],
      name: form.name,
      parentId: newParentId,
      remark: form.remark,
      status: form.status,
      updatedAt: new Date().toISOString()
    }
  }

  router.push('/settings/departments')
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