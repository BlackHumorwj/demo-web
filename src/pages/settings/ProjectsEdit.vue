<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑项目</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="项目编号" prop="projectNo">
          <el-input v-model="form.projectNo" placeholder="请输入项目编号" style="width: 400px" maxlength="50" />
          <span class="input-tip">最多50个字符，唯一标识符</span>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" style="width: 400px" maxlength="100" />
          <span class="input-tip">最多100个字符</span>
        </el-form-item>
        <el-form-item label="项目组" prop="groupId">
          <el-select v-model="form.groupId" placeholder="请选择项目组" style="width: 400px">
            <el-option v-for="group in projectGroups" :key="group.id" :label="group.groupName" :value="group.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="leaderId">
          <el-select v-model="form.leaderId" placeholder="请选择负责人" style="width: 400px">
            <el-option v-for="emp in employees" :key="emp.id" :label="emp.name" :value="emp.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始日期" prop="startDate">
          <el-date-picker
            v-model="form.startDate"
            type="date"
            placeholder="请选择开始日期"
            style="width: 400px"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="结束日期" prop="endDate">
          <el-date-picker
            v-model="form.endDate"
            type="date"
            placeholder="请选择结束日期"
            style="width: 400px"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息（可选）" style="width: 400px" :rows="3" maxlength="256" />
          <span class="input-tip">最多256个字符</span>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status">
            <el-option :value="1" label="启用" />
            <el-option :value="0" label="停用" />
            <el-option :value="2" label="归档" />
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
import { mockProjects, mockProjectGroups, mockEmployees } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()

const form = reactive({
  id: '',
  projectNo: '',
  projectName: '',
  groupId: '',
  leaderId: '',
  startDate: '',
  endDate: '',
  remark: '',
  status: 1
})

const rules: FormRules = {
  projectNo: [{ required: true, message: '请输入项目编号', trigger: 'blur' }],
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  groupId: [{ required: true, message: '请选择项目组', trigger: 'blur' }],
  leaderId: [{ required: true, message: '请选择负责人', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'blur' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'blur' }]
}

const projectGroups = computed(() => mockProjectGroups.filter(g => g.status === 1))
const employees = computed(() => mockEmployees.filter(e => e.status === 1))

onMounted(() => {
  const id = route.params.id as string
  const project = mockProjects.find(item => item.id === id)
  if (project) {
    form.id = project.id
    form.projectNo = project.projectNo
    form.projectName = project.projectName
    form.groupId = project.groupId
    form.leaderId = project.leaderId
    form.startDate = project.startDate
    form.endDate = project.endDate
    form.remark = project.remark
    form.status = project.status
  } else {
    router.push('/settings/projects')
  }
})

const handleBack = () => {
  router.push('/settings/projects')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const index = mockProjects.findIndex(item => item.id === form.id)
  if (index !== -1) {
    const group = projectGroups.value.find(g => g.id === form.groupId)
    const leader = employees.value.find(e => e.id === form.leaderId)
    
    mockProjects[index] = {
      ...mockProjects[index],
      projectNo: form.projectNo,
      projectName: form.projectName,
      groupId: form.groupId,
      groupName: group?.groupName || '',
      leaderId: form.leaderId,
      leaderName: leader?.name || '',
      startDate: form.startDate,
      endDate: form.endDate,
      remark: form.remark,
      status: form.status,
      updatedAt: new Date().toISOString()
    }
  }

  router.push('/settings/projects')
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