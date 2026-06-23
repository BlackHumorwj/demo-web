<template>
  <div class="page-container">
    <div class="page-header">
      <el-button @click="goBack">返回列表</el-button>
      <h2>新增凭证</h2>
    </div>

    <el-card class="form-card">
      <template #header>
        <span>凭证基本信息</span>
      </template>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="voucher-form"
      >
        <div class="form-grid">
          <el-form-item label="凭证编号">
            <el-input v-model="form.voucherCode" disabled placeholder="保存时自动生成" />
          </el-form-item>
          <el-form-item label="凭证日期" prop="voucherDate">
            <el-date-picker
              v-model="form.voucherDate"
              type="date"
              placeholder="请选择凭证日期"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="业务类型" prop="bizDocType">
            <el-select
              v-model="form.bizDocType"
              placeholder="请选择业务类型"
              style="width: 100%"
              @change="handleBizTypeChange"
            >
              <el-option
                v-for="item in bizDocTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="业务单据号">
            <el-select
              v-model="form.bizDocNo"
              placeholder="请选择业务单据"
              style="width: 100%"
              clearable
              filterable
              :disabled="!form.bizDocType"
              @change="handleBizDocChange"
            >
              <el-option
                v-for="doc in filteredBizDocs"
                :key="doc.id"
                :label="`${doc.docNo} - ${doc.summary || doc.typeName}`"
                :value="doc.docNo"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="附件数">
            <el-input-number v-model="form.attachmentCount" :min="0" :max="99" />
          </el-form-item>
          <el-form-item label="附件ID">
            <el-input v-model="form.attachmentIds" placeholder="多个附件ID用逗号分隔" />
          </el-form-item>
        </div>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入凭证备注"
            :rows="2"
            maxlength="256"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="entry-card">
      <template #header>
        <div class="entry-header">
          <span>凭证分录</span>
          <el-button type="primary" size="small" @click="addEntry">+ 新增分录</el-button>
        </div>
      </template>
      <el-table :data="form.entryList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="摘要" width="180">
          <template #default="scope">
            <el-input v-model="scope.row.summary" placeholder="摘要" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="科目" width="220">
          <template #default="scope">
            <el-select
              v-model="scope.row.subjectCode"
              placeholder="选择科目"
              filterable
              size="small"
              style="width: 100%"
              @change="(val: string) => handleSubjectChange(scope.row, val)"
            >
              <el-option
                v-for="s in subjectOptions"
                :key="s.code"
                :label="`${s.code} - ${s.name}`"
                :value="s.code"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="借方金额" width="140">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.debitAmount"
              :min="0"
              :precision="2"
              :step="0.01"
              size="small"
              style="width: 100%"
              @change="(val: number) => handleDebitCreditChange(scope.row, val, 'debit')"
            />
          </template>
        </el-table-column>
        <el-table-column label="贷方金额" width="140">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.creditAmount"
              :min="0"
              :precision="2"
              :step="0.01"
              size="small"
              style="width: 100%"
              @change="(val: number) => handleDebitCreditChange(scope.row, val, 'credit')"
            />
          </template>
        </el-table-column>
        <el-table-column label="币种" width="110">
          <template #default="scope">
            <el-select v-model="scope.row.currencyCode" size="small" style="width: 100%">
              <el-option
                v-for="c in currencyOptions"
                :key="c.code"
                :label="c.code"
                :value="c.code"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="汇率" width="100">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.exchangeRate"
              :min="0"
              :precision="4"
              :step="0.0001"
              size="small"
              style="width: 100%"
            />
          </template>
        </el-table-column>
        <el-table-column label="部门" width="130">
          <template #default="scope">
            <el-select
              v-model="scope.row.deptId"
              placeholder="部门"
              size="small"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="d in deptOptions"
                :key="d.id"
                :label="d.name"
                :value="d.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="项目" width="130">
          <template #default="scope">
            <el-select
              v-model="scope.row.projectId"
              placeholder="项目"
              size="small"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="p in projectOptions"
                :key="p.id"
                :label="p.projectName"
                :value="p.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="员工" width="130">
          <template #default="scope">
            <el-select
              v-model="scope.row.employeeId"
              placeholder="员工"
              size="small"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="e in employeeOptions"
                :key="e.id"
                :label="e.name"
                :value="e.id"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="附件ID" width="140">
          <template #default="scope">
            <el-input v-model="scope.row.attachmentIds" placeholder="附件ID" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="70" fixed="right">
          <template #default="scope">
            <el-button
              type="text"
              size="small"
              style="color: #ef4444"
              :disabled="form.entryList.length <= 1"
              @click="removeEntry(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="balance-row">
        <span class="balance-item">
          <span class="label">借方合计：</span>
          <span class="debit">¥ {{ formatAmount(debitTotal) }}</span>
        </span>
        <span class="balance-item">
          <span class="label">贷方合计：</span>
          <span class="credit">¥ {{ formatAmount(creditTotal) }}</span>
        </span>
        <span :class="['balance-status', isBalanced ? 'balanced' : 'unbalanced']">
          {{ isBalanced ? '✓ 借贷平衡' : `✗ 借贷不平衡，差额：¥ ${formatAmount(Math.abs(debitTotal - creditTotal))}` }}
        </span>
      </div>
    </el-card>

    <div class="action-bar">
      <el-button type="primary" :disabled="!isBalanced" @click="handleSubmit">保存</el-button>
      <el-button @click="goBack">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import {
  mockSubjects,
  mockCurrencies,
  mockDepartments,
  mockProjects,
  mockEmployees,
  mockBusinessDocs,
  mockVouchers
} from '@/data/mockData'
import { BIZ_DOC_TYPE_MAP } from '@/types/voucher'

const router = useRouter()
const formRef = ref<FormInstance>()

interface VoucherEntryRow {
  summary: string
  subjectCode: string
  subjectName: string
  debitAmount: number | null
  creditAmount: number | null
  currencyCode: string
  exchangeRate: number
  deptId: string
  projectId: string
  employeeId: string
  attachmentIds: string
}

const createEmptyEntry = (): VoucherEntryRow => ({
  summary: '',
  subjectCode: '',
  subjectName: '',
  debitAmount: null,
  creditAmount: null,
  currencyCode: 'CNY',
  exchangeRate: 1,
  deptId: '',
  projectId: '',
  employeeId: '',
  attachmentIds: ''
})

const form = reactive({
  voucherCode: '',
  voucherDate: new Date().toISOString().slice(0, 10),
  bizDocType: null as number | null,
  bizDocNo: '',
  attachmentCount: 0,
  attachmentIds: '',
  remark: '',
  entryList: [createEmptyEntry(), createEmptyEntry()] as VoucherEntryRow[]
})

const rules: FormRules = {
  voucherDate: [{ required: true, message: '请选择凭证日期', trigger: 'change' }]
}

const bizDocTypeOptions = computed(() =>
  Object.entries(BIZ_DOC_TYPE_MAP).map(([value, label]) => ({
    value: Number(value),
    label
  }))
)

const subjectOptions = computed(() => mockSubjects.filter(s => s.status === 1))
const currencyOptions = computed(() => mockCurrencies)
const deptOptions = computed(() => mockDepartments.filter(d => d.status === 1))
const projectOptions = computed(() => mockProjects.filter(p => p.status === 1))
const employeeOptions = computed(() => mockEmployees.filter(e => e.status === 1))

const filteredBizDocs = computed(() => {
  if (!form.bizDocType) return []
  return mockBusinessDocs.filter(d => {
    const typeName = BIZ_DOC_TYPE_MAP[form.bizDocType!]
    return d.typeName === typeName
  })
})

const debitTotal = computed(() =>
  form.entryList.reduce((sum, e) => sum + (e.debitAmount || 0), 0)
)
const creditTotal = computed(() =>
  form.entryList.reduce((sum, e) => sum + (e.creditAmount || 0), 0)
)
const isBalanced = computed(() => {
  const hasAmount = form.entryList.some(
    e => (e.debitAmount || 0) > 0 || (e.creditAmount || 0) > 0
  )
  if (!hasAmount) return false
  return Math.abs(debitTotal.value - creditTotal.value) < 0.01
})

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

const addEntry = () => {
  form.entryList.push(createEmptyEntry())
}

const removeEntry = (index: number) => {
  if (form.entryList.length <= 1) return
  form.entryList.splice(index, 1)
}

const handleSubjectChange = (row: VoucherEntryRow, code: string) => {
  const subject = mockSubjects.find(s => s.code === code)
  if (subject) {
    row.subjectName = subject.name
    row.summary = row.summary || subject.name
  }
}

const handleDebitCreditChange = (
  row: VoucherEntryRow,
  val: number,
  type: 'debit' | 'credit'
) => {
  if (val && val > 0) {
    if (type === 'debit') {
      row.creditAmount = null
    } else {
      row.debitAmount = null
    }
  }
}

const handleBizTypeChange = () => {
  form.bizDocNo = ''
  resetEntries()
}

const handleBizDocChange = (docNo: string) => {
  const doc = mockBusinessDocs.find(d => d.docNo === docNo)
  if (!doc) return
  form.voucherDate = form.voucherDate || doc.date
  form.remark = doc.remark || ''
  form.entryList = [
    {
      ...createEmptyEntry(),
      summary: doc.summary || doc.typeName,
      debitAmount: doc.amount,
      creditAmount: null
    },
    {
      ...createEmptyEntry(),
      summary: doc.summary || doc.typeName,
      debitAmount: null,
      creditAmount: doc.amount
    }
  ]
}

const resetEntries = () => {
  form.entryList = [createEmptyEntry(), createEmptyEntry()]
}

const generateVoucherCode = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const prefix = `V${year}${month}`
  const nums = mockVouchers
    .map(v => v.voucherNo)
    .filter(n => n.startsWith(prefix))
    .map(n => parseInt(n.slice(prefix.length), 10))
    .filter(n => !isNaN(n))
  const next = (nums.length ? Math.max(...nums) : 0) + 1
  return `${prefix}${String(next).padStart(3, '0')}`
}

const goBack = () => {
  router.push('/finance/voucher')
}

const validateEntries = (): boolean => {
  for (let i = 0; i < form.entryList.length; i++) {
    const e = form.entryList[i]
    if (!e.subjectCode) {
      ElMessage.error(`第 ${i + 1} 行分录请选择科目`)
      return false
    }
    if ((e.debitAmount || 0) > 0 && (e.creditAmount || 0) > 0) {
      ElMessage.error(`第 ${i + 1} 行分录借贷不能同时有金额`)
      return false
    }
    if (!e.debitAmount && !e.creditAmount) {
      ElMessage.error(`第 ${i + 1} 行分录请填写借方或贷方金额`)
      return false
    }
  }
  if (!isBalanced.value) {
    ElMessage.error('借贷不平衡，无法保存')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  if (!validateEntries()) return

  form.voucherCode = generateVoucherCode()

  const now = new Date()
  const created = {
    id: String(mockVouchers.length + 1),
    voucherNo: form.voucherCode,
    date: form.voucherDate,
    abstract: form.remark || form.entryList[0]?.summary || '',
    subjectName: form.entryList[0]?.subjectName || '',
    debitAmount: debitTotal.value,
    creditAmount: creditTotal.value,
    status: 0,
    createdAt: now.toISOString().replace('T', ' ').slice(0, 19),
    type: form.entryList[0]?.debitAmount ? 'debit' : 'credit',
    amount: debitTotal.value || creditTotal.value
  }
  mockVouchers.push(created as any)

  ElMessage.success('凭证保存成功')
  router.push('/finance/voucher')
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.form-card,
.entry-card {
  margin-bottom: 20px;
}

.voucher-form {
  padding: 8px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 24px;
}

.entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.balance-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 16px;
  border-top: 1px solid #eee;
  margin-top: 16px;
}

.balance-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.balance-item .label {
  color: #999;
}

.balance-status {
  font-weight: 600;
}

.balance-status.balanced {
  color: #22c55e;
}

.balance-status.unbalanced {
  color: #ef4444;
}

.debit {
  color: #22c55e;
}

.credit {
  color: #ef4444;
}

.action-bar {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}
</style>
