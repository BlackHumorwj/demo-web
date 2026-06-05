<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>新增往来单位</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入单位名称" style="width: 400px" maxlength="50" />
          <span class="input-tip">最多50个字符</span>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">客户</el-radio>
            <el-radio :label="2">供应商</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入联系人姓名" style="width: 400px" maxlength="30" />
          <span class="input-tip">最多30个字符</span>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" style="width: 400px" maxlength="20" />
          <span class="input-tip">最多20个字符</span>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱地址" style="width: 400px" maxlength="100" />
          <span class="input-tip">最多100个字符</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息（可选）" style="width: 400px" :rows="3" maxlength="256" />
          <span class="input-tip">最多256个字符</span>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { mockContacts } from '@/data/mockData'

const router = useRouter()

const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  type: 1,
  contactName: '',
  phone: '',
  email: '',
  remark: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入单位名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
}

const handleBack = () => {
  router.push('/settings/contacts')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const newId = String(Number(mockContacts[mockContacts.length - 1]?.id) + 1)
  mockContacts.push({
    id: newId,
    name: form.name,
    type: form.type,
    contactName: form.contactName,
    phone: form.phone,
    email: form.email,
    remark: form.remark,
    status: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  router.push('/settings/contacts')
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