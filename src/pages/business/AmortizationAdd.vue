<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>{{ isEdit ? '编辑待摊费用' : '新增待摊费用' }}</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-card shadow="never" class="form-section">
          <template #header><span>基础信息</span></template>
          <div class="form-row">
            <el-form-item label="业务日期" prop="tradeDate" class="form-item">
              <el-date-picker v-model="form.tradeDate" type="date" placeholder="请选择业务日期" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
            <el-form-item label="待摊名称" prop="name" class="form-item">
              <el-input v-model="form.name" placeholder="如：预付房租" maxlength="100" show-word-limit />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="待摊总金额" prop="totalAmount" class="form-item">
              <el-input-number v-model="form.totalAmount" :min="0.0001" :precision="4" :step="1000" style="width: 100%" />
            </el-form-item>
            <el-form-item label="币种" prop="currencyCode" class="form-item">
              <el-select v-model="form.currencyCode" style="width: 100%">
                <el-option v-for="c in currencyList" :key="c.code" :label="`${c.name} (${c.code})`" :value="c.code" />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="汇率" prop="exchangeRate" class="form-item">
              <el-input-number v-model="form.exchangeRate" :min="0.00000001" :precision="8" :step="0.01" style="width: 100%" />
            </el-form-item>
            <el-form-item label="付款账户" prop="accountId" class="form-item">
              <el-select v-model="form.accountId" placeholder="请选择付款账户" style="width: 100%">
                <el-option v-for="a in accountList" :key="a.id" :label="a.name" :value="a.id" />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="支出类别" prop="categoryId" class="form-item">
              <el-select v-model="form.categoryId" placeholder="请选择支出类别" style="width: 100%">
                <el-option v-for="c in expenseCategoryList" :key="c.id" :label="c.name" :value="c.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="业务员" prop="staffId" class="form-item">
              <el-select v-model="form.staffId" placeholder="请选择业务员" style="width: 100%" clearable>
                <el-option v-for="s in staffList" :key="s.id" :label="s.name" :value="s.id" />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="部门" class="form-item">
              <el-select v-model="form.deptId" placeholder="请选择部门（选填）" style="width: 100%" clearable>
                <el-option v-for="d in deptList" :key="d.id" :label="d.name" :value="d.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="项目" class="form-item">
              <el-select v-model="form.projectId" placeholder="请选择项目（选填）" style="width: 100%" clearable filterable allow-create>
                <el-option v-for="p in projectList" :key="p.id" :label="p.projectName" :value="p.id" />
              </el-select>
            </el-form-item>
          </div>
        </el-card>

        <el-card shadow="never" class="form-section">
          <template #header><span>摊销方案</span></template>
          <div class="form-row">
            <el-form-item label="摊销开始日期" prop="amortStartDate" class="form-item">
              <el-date-picker
                v-model="form.amortStartDate"
                type="date"
                placeholder="开始日期"
                value-format="YYYY-MM-DD"
                :disabled-date="disableBeforeTradeDate"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="摊销结束日期" prop="amortEndDate" class="form-item">
              <el-date-picker
                v-model="form.amortEndDate"
                type="date"
                placeholder="结束日期"
                value-format="YYYY-MM-DD"
                :disabled-date="disableBeforeStartDate"
                style="width: 100%"
              />
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="摊销周期" prop="amortPeriodType" class="form-item">
              <el-radio-group v-model="form.amortPeriodType" style="width: 100%">
                <el-radio :label="1">月</el-radio>
                <el-radio :label="2">季</el-radio>
                <el-radio :label="3">年</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="摊销方式" prop="amortMethod" class="form-item">
              <el-radio-group v-model="form.amortMethod" style="width: 100%">
                <el-radio :label="1">平均法</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>

          <div class="calc-box">
            <div class="calc-item">
              <div class="label">总期数</div>
              <div class="value">{{ calcTotalPeriods }}</div>
            </div>
            <div class="calc-item">
              <div class="label">每期摊销金额</div>
              <div class="value highlight">¥{{ calcPeriodAmount.toFixed(2) }}</div>
            </div>
            <div class="calc-item">
              <div class="label">总金额</div>
              <div class="value">¥{{ form.totalAmount.toFixed(2) }}</div>
            </div>
          </div>
        </el-card>

        <el-card shadow="never" class="form-section">
          <template #header><span>备注</span></template>
          <el-form-item label-width="0" class="full-width">
            <el-input v-model="form.remark" type="textarea" placeholder="选填，最多256字" :rows="3" maxlength="256" show-word-limit />
          </el-form-item>
        </el-card>

        <el-form-item class="form-actions">
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
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import {
  mockAmortizations,
  mockAccounts,
  mockCategories,
  mockStaff,
  mockDepartments,
  mockProjects,
  mockCurrencies,
  type AmortizationRecord
} from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string)
const isEdit = computed(() => !!id.value)
const existing = computed(() => (isEdit.value ? mockAmortizations.find(r => r.id === id.value) : null))

const formRef = ref<FormInstance>()

const today = new Date()
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

const form = reactive({
  tradeDate: todayStr,
  name: '',
  totalAmount: 0,
  accountId: '',
  categoryId: '',
  staffId: '',
  deptId: null as string | null,
  projectId: null as string | null,
  currencyCode: 'CNY',
  exchangeRate: 1,
  amortStartDate: todayStr,
  amortEndDate: addYears(todayStr, 1),
  amortPeriodType: 1 as number,
  amortMethod: 1 as number,
  remark: ''
})

const rules: FormRules = {
  tradeDate: [{ required: true, message: '请选择业务日期', trigger: 'change' }],
  name: [{ required: true, message: '请输入待摊名称', trigger: 'blur' }],
  totalAmount: [
    { required: true, message: '请输入待摊总金额', trigger: 'blur' },
    { validator: (_r, v, cb) => (v > 0 ? cb() : cb(new Error('金额必须大于0'))), trigger: 'blur' }
  ],
  accountId: [{ required: true, message: '请选择付款账户', trigger: 'change' }],
  categoryId: [{ required: true, message: '请选择支出类别', trigger: 'change' }],
  amortStartDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  amortEndDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  amortPeriodType: [{ required: true, message: '请选择周期类型', trigger: 'change' }]
}

const accountList = computed(() => mockAccounts.filter(a => a.status === 1))
const expenseCategoryList = computed(() => mockCategories.filter(c => c.type === 2 && c.status === 1))
const staffList = computed(() => mockStaff.filter(s => s.status === 1))
const deptList = computed(() => mockDepartments.filter(d => d.status === 1))
const projectList = computed(() => mockProjects.filter(p => p.status === 1))
const currencyList = computed(() => mockCurrencies)

const calcTotalPeriods = computed(() => {
  if (!form.amortStartDate || !form.amortEndDate) return 0
  const s = new Date(form.amortStartDate)
  const e = new Date(form.amortEndDate)
  if (e < s) return 0
  const step = form.amortPeriodType === 1 ? 1 : form.amortPeriodType === 2 ? 3 : 12
  let p = 0
  const cur = new Date(s)
  while (cur <= e) {
    p++
    cur.setMonth(cur.getMonth() + step)
  }
  return p
})

const calcPeriodAmount = computed(() => {
  if (!form.totalAmount || calcTotalPeriods.value === 0) return 0
  return form.totalAmount / calcTotalPeriods.value
})

const disableBeforeTradeDate = (date: Date) => {
  return date < new Date(form.tradeDate)
}
const disableBeforeStartDate = (date: Date) => {
  return date < new Date(form.amortStartDate)
}

function addYears(dateStr: string, years: number): string {
  const d = new Date(dateStr)
  d.setFullYear(d.getFullYear() + years)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const handleBack = () => router.push('/business/amortization')

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning('请完善表单信息')
    return
  }
  if (form.amortEndDate < form.amortStartDate) {
    ElMessage.error('摊销结束日期不能早于开始日期')
    return
  }
  if (calcTotalPeriods.value === 0) {
    ElMessage.error('请设置有效的摊销期限')
    return
  }
  if (form.totalAmount <= 0) {
    ElMessage.error('总金额必须大于0')
    return
  }

  if (isEdit.value && existing.value) {
    const idx = mockAmortizations.findIndex(r => r.id === existing.value!.id)
    if (idx !== -1) {
      const r = mockAmortizations[idx]
      const canEditCore = r.status === 0
      const newRecord: AmortizationRecord = {
        ...r,
        name: form.name,
        totalAmount: canEditCore ? form.totalAmount : r.totalAmount,
        accountId: form.accountId,
        accountName: accountList.value.find(a => a.id === form.accountId)?.name || r.accountName,
        categoryId: canEditCore ? form.categoryId : r.categoryId,
        categoryName: expenseCategoryList.value.find(c => c.id === form.categoryId)?.name || r.categoryName,
        staffId: form.staffId || r.staffId,
        staffName: staffList.value.find(s => s.id === form.staffId)?.name || r.staffName,
        deptId: form.deptId,
        deptName: form.deptId ? deptList.value.find(d => d.id === form.deptId)?.name || '' : '',
        projectId: form.projectId,
        projectName: form.projectId ? projectList.value.find(p => p.id === form.projectId)?.projectName || '' : '',
        currencyCode: form.currencyCode,
        exchangeRate: form.exchangeRate,
        amortStartDate: canEditCore ? form.amortStartDate : r.amortStartDate,
        amortEndDate: canEditCore ? form.amortEndDate : r.amortEndDate,
        amortPeriodType: canEditCore ? form.amortPeriodType : r.amortPeriodType,
        amortPeriodTypeName: periodTypeName(canEditCore ? form.amortPeriodType : r.amortPeriodType),
        periodAmount: canEditCore ? calcPeriodAmount.value : r.periodAmount,
        totalPeriods: canEditCore ? calcTotalPeriods.value : r.totalPeriods,
        remainingPeriods: canEditCore ? calcTotalPeriods.value - r.amortRecords.length : r.remainingPeriods,
        status: canEditCore ? 0 : r.status,
        statusName: canEditCore ? '待执行' : r.statusName,
        nextAmortDate: canEditCore ? form.amortStartDate : r.nextAmortDate,
        remark: form.remark,
        updateTime: new Date().toLocaleString('zh-CN', { hour12: false })
      }
      mockAmortizations[idx] = newRecord
      ElMessage.success('保存成功')
    }
  } else {
    const newId = `AM${String(Date.now()).slice(-6)}`
    const now = new Date()
    const nowStr = now.toLocaleString('zh-CN', { hour12: false })
    const docNo = `AT-${form.tradeDate.replace(/-/g, '')}-${String(mockAmortizations.length + 1).padStart(4, '0')}`
    const account = accountList.value.find(a => a.id === form.accountId)
    const category = expenseCategoryList.value.find(c => c.id === form.categoryId)
    const staff = staffList.value.find(s => s.id === form.staffId)
    const dept = form.deptId ? deptList.value.find(d => d.id === form.deptId) : null
    const project = form.projectId ? projectList.value.find(p => p.id === form.projectId) : null
    const voucherNo = `记-${form.tradeDate.substring(0, 7).replace('-', '')}-${String(mockAmortizations.length + 1).padStart(3, '0')}`
    mockAmortizations.push({
      id: newId,
      bizDocNo: docNo,
      tradeDate: form.tradeDate,
      name: form.name,
      totalAmount: form.totalAmount,
      accountId: form.accountId,
      accountName: account?.name || '',
      categoryId: form.categoryId,
      categoryName: category?.name || '',
      staffId: form.staffId,
      staffName: staff?.name || '',
      deptId: form.deptId,
      deptName: dept?.name || '',
      projectId: form.projectId,
      projectName: project?.projectName || '',
      currencyCode: form.currencyCode,
      exchangeRate: form.exchangeRate,
      amortStartDate: form.amortStartDate,
      amortEndDate: form.amortEndDate,
      amortPeriodType: form.amortPeriodType,
      amortPeriodTypeName: periodTypeName(form.amortPeriodType),
      amortMethod: form.amortMethod,
      periodAmount: calcPeriodAmount.value,
      totalPeriods: calcTotalPeriods.value,
      remainingPeriods: calcTotalPeriods.value,
      amortizedAmount: 0,
      status: 0,
      statusName: '待执行',
      nextAmortDate: form.amortStartDate,
      remark: form.remark,
      writerId: staff?.id || '1',
      writerName: staff?.name || '张三',
      writeTime: nowStr,
      updateTime: nowStr,
      voucherNo,
      amortRecords: []
    })
    ElMessage.success('新增成功，已生成支付凭证')
  }
  router.push('/business/amortization')
}

function periodTypeName(t: number): string {
  return t === 1 ? '月' : t === 2 ? '季' : '年'
}

onMounted(() => {
  if (isEdit.value && existing.value) {
    const r = existing.value
    form.tradeDate = r.tradeDate
    form.name = r.name
    form.totalAmount = r.totalAmount
    form.accountId = r.accountId
    form.categoryId = r.categoryId
    form.staffId = r.staffId
    form.deptId = r.deptId
    form.projectId = r.projectId
    form.currencyCode = r.currencyCode
    form.exchangeRate = r.exchangeRate
    form.amortStartDate = r.amortStartDate
    form.amortEndDate = r.amortEndDate
    form.amortPeriodType = r.amortPeriodType
    form.amortMethod = r.amortMethod
    form.remark = r.remark
  }
})
</script>

<style scoped>
.page-container { padding: 24px; }
.page-card { min-height: 400px; }
.header-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.form-container { max-width: 1000px; margin: 0 auto; padding: 10px 0; }
.form-section { margin-bottom: 16px; }
.form-row { display: flex; gap: 20px; margin-bottom: 10px; }
.form-item { flex: 1; }
.full-width { width: 100%; }
.calc-box { display: flex; gap: 20px; padding: 16px; background: #f5f7fa; border-radius: 4px; }
.calc-item { flex: 1; text-align: center; }
.calc-item .label { font-size: 13px; color: #606266; margin-bottom: 6px; }
.calc-item .value { font-size: 22px; font-weight: 600; color: #303133; }
.calc-item .value.highlight { color: #409eff; }
.form-actions { text-align: center; margin-top: 20px; }
</style>
