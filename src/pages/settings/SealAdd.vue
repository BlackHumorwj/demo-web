<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>封账设置</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="封账日期" prop="sealDate">
          <el-date-picker
            v-model="form.sealDate"
            type="date"
            placeholder="请选择封账日期（不能晚于今天）"
            value-format="YYYY-MM-DD"
            :disabled-date="disableFutureDate"
            style="width: 300px"
          />
        </el-form-item>

        <el-form-item label="封账类型" prop="sealType">
          <el-radio-group v-model="form.sealType">
            <el-radio :label="1">新增封账</el-radio>
            <el-radio :label="2">调整封账（延长）</el-radio>
            <el-radio :label="3">调整封账（缩短）</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-alert
          v-if="form.sealType === 3"
          title="缩短封账将缩小封账范围，仅系统管理员可操作，且需二次确认"
          type="warning"
          show-icon
          :closable="false"
          style="margin: 10px 0"
        />

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入封账说明" maxlength="200" show-word-limit style="width: 500px" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="runPreCheck">封账前检查</el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card v-if="preCheck" class="page-card" style="margin-top: 16px">
      <template #header>
        <div class="header-content">
          <span>封账前检查结果</span>
          <el-tag :type="preCheck.pass ? 'success' : 'danger'">
            {{ preCheck.pass ? '检查通过' : '检查未通过' }}
          </el-tag>
        </div>
      </template>

      <el-table :data="preCheck.items" border>
        <el-table-column prop="name" label="检查项" min-width="180" />
        <el-table-column label="严重级别" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.level === 'block' ? 'danger' : 'warning'">
              {{ scope.row.level === 'block' ? '阻断' : '警告' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="数量" width="100" align="center" />
        <el-table-column prop="description" label="说明" min-width="300" />
      </el-table>

      <div class="precheck-summary">
        <span style="color: #f56c6c">阻断项：{{ preCheck.blocks }}</span>
        <span style="color: #e6a23c; margin-left: 20px">警告项：{{ preCheck.warnings }}</span>
      </div>

      <div class="form-container" style="padding-top: 0">
        <el-form-item>
          <el-button type="primary" :disabled="!preCheck.pass" @click="handleSubmit">确认封账</el-button>
          <el-button @click="resetPreCheck">重新检查</el-button>
        </el-form-item>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { mockSealRecords, mockSealPreCheck, type SealRecord, type SealPreCheckResult } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const formRef = ref<FormInstance>()
const existingId = (route.query.from as string) || ''
const existingRecord = existingId ? mockSealRecords.find(r => r.id === existingId) : null

const today = new Date()
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

const form = reactive({
  sealDate: todayStr,
  sealType: existingRecord ? 2 : 1,
  remark: existingRecord ? `将封账日期调整至 ${existingRecord.sealDate} 之后` : ''
})

const rules: FormRules = {
  sealDate: [{ required: true, message: '请选择封账日期', trigger: 'change' }]
}

const preCheck = ref<SealPreCheckResult | null>(null)

const disableFutureDate = (date: Date) => {
  return date.getTime() > Date.now()
}

const handleBack = () => router.push('/settings/seal')

const runPreCheck = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  preCheck.value = JSON.parse(JSON.stringify(mockSealPreCheck))
  ElMessage.info('封账前检查已完成')
}

const resetPreCheck = () => {
  preCheck.value = null
}

const handleSubmit = async () => {
  if (!preCheck.value?.pass) {
    ElMessage.error('存在阻断项，无法封账')
    return
  }
  if (form.sealType === 3) {
    await ElMessageBox.confirm('缩短封账将缩小封账范围，确定继续？', '二次确认', { type: 'error' })
  }
  await ElMessageBox.confirm('确定要执行封账操作吗？', '最终确认', { type: 'warning' })

  const newType = form.sealType
  const typeMap: Record<number, string> = { 1: '新增封账', 2: '调整封账（延长）', 3: '调整封账（缩短）' }
  const newRecord: SealRecord = {
    id: `S${Date.now()}`,
    sealDate: form.sealDate,
    sealType: newType,
    sealTypeName: typeMap[newType],
    previousDate: existingRecord?.sealDate || (mockSealRecords.length ? mockSealRecords[mockSealRecords.length - 1].sealDate : null),
    remark: form.remark,
    operatorId: '1',
    operatorName: '管理员',
    operateTime: new Date().toLocaleString('zh-CN', { hour12: false })
  }
  mockSealRecords.push(newRecord)
  ElMessage.success('封账操作成功')
  router.push('/settings/seal')
}
</script>

<style scoped>
.page-container { padding: 24px; }
.page-card { min-height: 200px; }
.header-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.form-container { max-width: 700px; margin: 0 auto; padding: 20px 0; }
.precheck-summary { margin-top: 12px; }
</style>
