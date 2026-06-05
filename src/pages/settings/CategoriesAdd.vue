<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>新增收支类别</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入类别名称" style="width: 400px" maxlength="50" />
          <span class="input-tip">最多50个字符</span>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="form.type">
            <el-radio :label="1">收入</el-radio>
            <el-radio :label="2">支出</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联科目" prop="subjectCode">
          <el-select v-model="form.subjectCode" placeholder="请选择科目" style="width: 400px">
            <el-option label="1001 库存现金" value="1001" />
            <el-option label="1002 银行存款" value="1002" />
            <el-option label="1122 应收账款" value="1122" />
            <el-option label="2202 应付账款" value="2202" />
            <el-option label="5001 主营业务收入" value="5001" />
            <el-option label="6001 主营业务成本" value="6001" />
            <el-option label="6601 销售费用" value="6601" />
            <el-option label="6602 管理费用" value="6602" />
          </el-select>
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
import { mockCategories } from '@/data/mockData'

const router = useRouter()

const formRef = ref<FormInstance>()

const form = reactive({
  name: '',
  type: 1,
  subjectCode: '',
  remark: ''
})

const rules: FormRules = {
  name: [{ required: true, message: '请输入类别名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'blur' }]
}

const handleBack = () => {
  router.push('/settings/categories')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const newId = String(Number(mockCategories[mockCategories.length - 1]?.id) + 1)
  mockCategories.push({
    id: newId,
    name: form.name,
    type: form.type,
    parentId: null,
    subjectId: '',
    subjectCode: form.subjectCode,
    isSystemBuiltin: 0,
    remark: form.remark,
    scope: '',
    status: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  router.push('/settings/categories')
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