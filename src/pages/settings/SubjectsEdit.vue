<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑科目</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="科目编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入科目编码" style="width: 400px" maxlength="20" />
          <span class="input-tip">最多20个字符</span>
        </el-form-item>
        <el-form-item label="科目名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入科目名称" style="width: 400px" maxlength="50" />
          <span class="input-tip">最多50个字符</span>
        </el-form-item>
        <el-form-item label="层级" prop="level">
          <el-select v-model="form.level" placeholder="请选择层级" style="width: 400px">
            <el-option label="第一级" :value="1" />
            <el-option label="第二级" :value="2" />
            <el-option label="第三级" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio label="asset">资产</el-radio>
            <el-radio label="liability">负债</el-radio>
            <el-radio label="equity">权益</el-radio>
            <el-radio label="income">收入</el-radio>
            <el-radio label="expense">费用</el-radio>
          </el-radio-group>
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
import { mockSubjects } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()

const form = reactive({
  id: '',
  code: '',
  name: '',
  level: 1,
  type: 'asset' as 'asset' | 'liability' | 'equity' | 'income' | 'expense',
  status: 1
})

const rules: FormRules = {
  code: [{ required: true, message: '请输入科目编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入科目名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择层级', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
}

onMounted(() => {
  const id = route.params.id as string
  const subject = mockSubjects.find(item => item.id === id)
  if (subject) {
    form.id = subject.id
    form.code = subject.code
    form.name = subject.name
    form.level = subject.level
    form.type = subject.type as 'asset' | 'liability' | 'equity' | 'income' | 'expense'
    form.status = subject.status
  } else {
    router.push('/settings/subjects')
  }
})

const handleBack = () => {
  router.push('/settings/subjects')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const index = mockSubjects.findIndex(item => item.id === form.id)
  if (index !== -1) {
    mockSubjects[index] = {
      ...mockSubjects[index],
      code: form.code,
      name: form.name,
      level: form.level,
      type: form.type,
      status: form.status,
      updatedAt: new Date().toISOString()
    }
  }

  router.push('/settings/subjects')
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