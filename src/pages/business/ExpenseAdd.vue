<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>新增支出</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="业务日期" prop="tradeTime">
          <el-date-picker
            v-model="form.tradeTime"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="支出账户" prop="accountId">
          <el-select v-model="form.accountId" placeholder="请选择账户" style="width: 400px" @change="handleAccountChange">
            <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务员" prop="staffId">
          <el-select v-model="form.staffId" placeholder="请选择业务员" style="width: 400px">
            <el-option v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="form.deptId" placeholder="请选择部门" style="width: 400px" clearable>
            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目">
          <el-select v-model="form.projectId" placeholder="请选择项目（可选）" style="width: 400px" clearable>
            <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="往来单位" :required="isArapAccount">
          <el-select
            v-model="form.bizContactId"
            placeholder="请选择往来单位"
            style="width: 400px"
            clearable
            :rules="isArapAccount ? [{ required: true, message: '挂账账户必须选择往来单位', trigger: 'change' }] : []"
          >
            <el-option v-for="item in contactList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="支出金额" prop="amount">
          <el-input v-model.number="form.amount" type="number" placeholder="请输入金额" style="width: 400px" />
        </el-form-item>
        <el-form-item label="币种" prop="currencyCode">
          <el-select v-model="form.currencyCode" placeholder="请选择币种" style="width: 400px">
            <el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="汇率" prop="exchangeRate">
          <el-input v-model.number="form.exchangeRate" type="number" placeholder="请输入汇率" style="width: 400px" />
        </el-form-item>

        <el-form-item label="收支明细">
          <div class="detail-table-container">
            <el-table :data="form.categoryItems" border style="width: 100%" :key="tableKey">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column label="收支类别" width="200">
                <template #default="scope">
                  <el-select v-model="scope.row.categoryId" placeholder="请选择类别" style="width: 100%">
                    <el-option
                      v-for="item in expenseCategoryList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                      @change="onCategoryChange(scope.row, $event)"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="金额" width="150">
                <template #default="scope">
                  <el-input v-model.number="scope.row.amount" placeholder="请输入金额" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template #default="scope">
                  <el-input v-model="scope.row.remark" placeholder="请输入备注" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <el-button
                    type="text"
                    size="small"
                    style="color: #ef4444"
                    @click="removeDetail(scope.$index)"
                    v-if="form.categoryItems.length > 1"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer">
              <el-button type="primary" size="small" @click="addDetail">+ 添加明细</el-button>
              <div class="total-amount">
                <span class="label">合计金额：</span>
                <span class="value expense">{{ getCurrencySymbol(form.currencyCode) }} {{ totalAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注信息（可选）"
            style="width: 400px"
            :rows="3"
            maxlength="256"
          />
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import {
  mockExpenseDocs,
  mockAccounts,
  mockStaff,
  mockDepartments,
  mockProjects,
  mockContacts,
  mockCurrencies,
  mockCategories,
  type ExpenseDoc,
  type ExpenseCategoryItem
} from '@/data/mockData'

const router = useRouter()

const formRef = ref<FormInstance>()
const tableKey = ref(0)

const form = reactive({
  tradeTime: '',
  accountId: '',
  staffId: '',
  deptId: null as string | null,
  projectId: null as string | null,
  bizContactId: null as string | null,
  amount: 0,
  currencyCode: 'CNY',
  exchangeRate: 1.0,
  remark: '',
  categoryItems: [
    { itemId: '', categoryId: '', categoryName: '', amount: 0, remark: '' }
  ] as ExpenseCategoryItem[]
})

const rules: FormRules = {
  tradeTime: [{ required: true, message: '请选择业务日期', trigger: 'change' }],
  accountId: [{ required: true, message: '请选择支出账户', trigger: 'change' }],
  staffId: [{ required: true, message: '请选择业务员', trigger: 'change' }],
  amount: [
    { required: true, message: '请输入支出金额', trigger: 'blur' },
    {
      validator: (_rule: any, value: number, callback: any) => {
        if (value <= 0) {
          callback(new Error('支出金额必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const accountList = computed(() => mockAccounts.filter(a => a.status === 1))
const staffList = computed(() => mockStaff.filter(s => s.status === 1))
const deptList = computed(() => mockDepartments.filter(d => d.status === 1))
const projectList = computed(() => mockProjects.filter(p => p.status === 1))
const contactList = computed(() => mockContacts.filter(c => c.status === 1))
const currencyList = computed(() => mockCurrencies)
const expenseCategoryList = computed(() => mockCategories.filter(c => c.type === 2))

const isArapAccount = computed(() => {
  if (!form.accountId) return false
  const account = mockAccounts.find(a => a.id === form.accountId)
  return account ? account.type === 3 : false
})

const getCurrencySymbol = (code: string) => {
  const currency = mockCurrencies.find(c => c.code === code)
  return currency ? currency.symbol : '¥'
}

const totalAmount = computed(() => {
  return form.categoryItems.reduce((sum, item) => sum + (item.amount || 0), 0)
})

const onCategoryChange = (row: ExpenseCategoryItem, value: string) => {
  const category = mockCategories.find(c => c.id === value)
  if (category) {
    row.categoryName = category.name
  }
}

const addDetail = () => {
  form.categoryItems.push({ itemId: '', categoryId: '', categoryName: '', amount: 0, remark: '' })
  tableKey.value++
}

const removeDetail = (index: number) => {
  form.categoryItems.splice(index, 1)
  tableKey.value++
}

const handleAccountChange = () => {
  if (!isArapAccount.value) {
    form.bizContactId = null
  }
}

const handleBack = () => {
  router.push('/business/expense')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (_e) {
    return
  }

  const hasValidDetail = form.categoryItems.some(d => d.categoryId && d.amount > 0)
  if (!hasValidDetail) {
    alert('请至少添加一条有效的明细')
    return
  }

  if (isArapAccount.value && !form.bizContactId) {
    alert('挂账账户必须选择往来单位')
    return
  }

  const account = mockAccounts.find(a => a.id === form.accountId)
  const staff = mockStaff.find(s => s.id === form.staffId)
  const dept = form.deptId ? mockDepartments.find(d => d.id === form.deptId) : null
  const project = form.projectId ? mockProjects.find(p => p.id === form.projectId) : null
  const contact = form.bizContactId ? mockContacts.find(c => c.id === form.bizContactId) : null

  const newId = String(Number(mockExpenseDocs[mockExpenseDocs.length - 1]?.bizDocId || '0') + 1)
  const now = new Date()
  const docNo = `EX${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(mockExpenseDocs.length + 1).padStart(4, '0')}`

  form.categoryItems.forEach((detail, index) => {
    detail.itemId = `${newId}-${index + 1}`
    if (!detail.categoryName && detail.categoryId) {
      const category = mockCategories.find(c => c.id === detail.categoryId)
      detail.categoryName = category?.name || ''
    }
  })

  const newDoc: ExpenseDoc = {
    bizDocId: newId,
    bizDocNo: docNo,
    tradeTime: form.tradeTime,
    accountId: form.accountId,
    accountName: account?.name || '',
    staffId: form.staffId,
    staffName: staff?.name || '',
    deptId: form.deptId,
    deptName: dept?.name || '',
    projectId: form.projectId,
    projectName: project?.projectName || '',
    bizContactId: form.bizContactId,
    bizContactName: contact?.name || '',
    amount: form.amount,
    currencyCode: form.currencyCode,
    exchangeRate: form.exchangeRate,
    remark: form.remark,
    writerId: staff?.id || '',
    writerName: staff?.name || '',
    writerTime: now.toLocaleString('zh-CN'),
    updateId: null,
    updateName: '',
    updateTime: null,
    status: 0,
    categoryItems: [...form.categoryItems]
  }

  mockExpenseDocs.push(newDoc)

  router.push('/business/expense')
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
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
}

.input-tip {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}

.detail-table-container {
  margin-top: 10px;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
}

.total-amount {
  display: flex;
  align-items: center;
}

.total-amount .label {
  color: #666;
}

.total-amount .value {
  font-weight: 600;
  font-size: 18px;
  margin-left: 8px;
}

.total-amount .value.expense {
  color: #ef4444;
}
</style>
