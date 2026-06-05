<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑角色</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" style="width: 400px" maxlength="50" />
          <span class="input-tip">最多50个字符</span>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入角色描述（可选）" style="width: 400px" :rows="3" maxlength="256" />
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { mockRoles } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()

const form = reactive({
  id: '',
  name: '',
  remark: '',
  status: 1
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
}

onMounted(() => {
  const id = route.params.id as string
  const role = mockRoles.find(item => item.id === id)
  if (role) {
    form.id = role.id
    form.name = role.name
    form.remark = role.remark
    form.status = role.status
  } else {
    router.push('/settings/roles')
  }
})

const handleBack = () => {
  router.push('/settings/roles')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const index = mockRoles.findIndex(item => item.id === form.id)
  if (index !== -1) {
    mockRoles[index] = {
      ...mockRoles[index],
      name: form.name,
      remark: form.remark,
      status: form.status,
      updatedAt: new Date().toISOString()
    }
  }

  router.push('/settings/roles')
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