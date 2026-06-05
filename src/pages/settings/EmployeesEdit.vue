<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑员工</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="ID">
          <el-input v-model="form.id" disabled style="width: 400px" />
        </el-form-item>
        <el-form-item label="员工编号" prop="staffNo">
          <el-input v-model="form.staffNo" placeholder="请输入员工编号" style="width: 400px" maxlength="32" />
          <span class="input-tip">最多32个字符，需唯一</span>
        </el-form-item>
        <el-form-item label="员工姓名" prop="staffName">
          <el-input v-model="form.staffName" placeholder="请输入员工姓名" style="width: 400px" maxlength="50" />
          <span class="input-tip">最多50个字符</span>
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式（手机号）" style="width: 400px" maxlength="20" />
          <span class="input-tip">最多20个字符，需唯一</span>
        </el-form-item>
        <el-form-item label="工作邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入工作邮箱（可选）" style="width: 400px" maxlength="100" />
          <span class="input-tip">最多100个字符</span>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptIds">
          <el-select v-model="form.deptIds" placeholder="请选择部门（支持多选）" style="width: 400px" multiple>
            <el-option label="技术部" value="1" />
            <el-option label="财务部" value="2" />
            <el-option label="人事部" value="3" />
            <el-option label="市场部" value="4" />
            <el-option label="销售部" value="5" />
          </el-select>
        </el-form-item>
        <el-form-item label="分配角色" prop="roleIds">
          <el-select v-model="form.roleIds" placeholder="请选择角色（支持多选）" style="width: 400px" multiple>
            <el-option label="管理员" value="1" />
            <el-option label="财务人员" value="2" />
            <el-option label="普通用户" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="在职状态" prop="isActive">
          <el-select v-model="form.isActive">
            <el-option :value="1" label="在职" />
            <el-option :value="0" label="离职" />
          </el-select>
        </el-form-item>
        <el-form-item label="允许登录账本" prop="allowLoginLedger">
          <el-select v-model="form.allowLoginLedger">
            <el-option :value="0" label="不允许" />
            <el-option :value="1" label="允许" />
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
import { mockEmployees } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()

const form = reactive({
  id: '',
  staffNo: '',
  staffName: '',
  contact: '',
  email: '',
  deptIds: [] as string[],
  roleIds: [] as string[],
  isActive: 1,
  allowLoginLedger: 0
})

const rules: FormRules = {
  staffNo: [{ required: true, message: '请输入员工编号', trigger: 'blur' }],
  staffName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  contact: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
}

const handleBack = () => {
  router.push('/settings/employees')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const index = mockEmployees.findIndex(item => item.id === form.id)
  if (index !== -1) {
    mockEmployees[index] = {
      ...mockEmployees[index],
      staffNo: form.staffNo,
      name: form.staffName,
      contact: form.contact,
      email: form.email,
      deptIds: form.deptIds.join(','),
      deptNames: form.deptIds.map(id => {
        const deptMap: Record<string, string> = { '1': '技术部', '2': '财务部', '3': '人事部', '4': '市场部', '5': '销售部' }
        return deptMap[id] || ''
      }).join(','),
      roleIds: form.roleIds,
      roleNames: form.roleIds.map(id => {
        const roleMap: Record<string, string> = { '1': '管理员', '2': '财务人员', '3': '普通用户' }
        return roleMap[id] || ''
      }).join(','),
      isActive: form.isActive,
      allowLoginLedger: form.allowLoginLedger,
      department: form.deptIds.length > 0 ? ['技术部', '财务部', '人事部', '市场部', '销售部'][Number(form.deptIds[0]) - 1] : '',
      phone: form.contact,
      status: form.isActive,
      updatedAt: new Date().toISOString()
    }
  }

  router.push('/settings/employees')
}

onMounted(() => {
  const id = route.params.id as string
  const employee = mockEmployees.find(item => item.id === id)
  if (employee) {
    form.id = employee.id
    form.staffNo = employee.staffNo || ''
    form.staffName = employee.name
    form.contact = employee.contact || employee.phone || ''
    form.email = employee.email || ''
    form.deptIds = employee.deptIds ? employee.deptIds.split(',') : []
    form.roleIds = (employee.roleIds as string[]) || []
    form.isActive = employee.isActive !== undefined ? employee.isActive : (employee.status || 1)
    form.allowLoginLedger = employee.allowLoginLedger !== undefined ? employee.allowLoginLedger : 0
  } else {
    router.push('/settings/employees')
  }
})
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
