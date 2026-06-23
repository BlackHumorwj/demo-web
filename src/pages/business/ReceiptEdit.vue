<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑收款</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="单据编号">
          <el-input v-model="form.bizDocNo" disabled style="width: 400px" />
        </el-form-item>
        <el-form-item label="业务日期" prop="bizDate">
          <el-date-picker
            v-model="form.bizDate"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item label="收款账户" prop="receiptAccountId">
          <el-select v-model="form.receiptAccountId" placeholder="请选择收款账户" style="width: 400px">
            <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="挂账账户">
          <el-select v-model="form.accountId" placeholder="请选择挂账账户（可选）" style="width: 400px" clearable>
            <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="往来单位">
          <el-select v-model="form.contactId" placeholder="请选择往来单位（可选）" style="width: 400px" clearable>
            <el-option v-for="item in contactList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="收款金额" prop="receiptAmount">
          <el-input v-model.number="form.receiptAmount" type="number" placeholder="请输入收款金额" style="width: 400px" />
        </el-form-item>
        <el-form-item label="币种" prop="currencyId">
          <el-select v-model="form.currencyId" placeholder="请选择币种" style="width: 400px">
            <el-option v-for="item in currencyList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="汇率" prop="exchangeRate">
          <el-input v-model.number="form.exchangeRate" type="number" placeholder="请输入汇率" style="width: 400px" />
        </el-form-item>
        <el-form-item label="业务员" prop="bizStaffId">
          <el-select v-model="form.bizStaffId" placeholder="请选择业务员" style="width: 400px">
            <el-option v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="form.bizDeptId" placeholder="请选择部门（可选）" style="width: 400px" clearable>
            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目">
          <el-select v-model="form.bizProjectId" placeholder="请选择项目（可选）" style="width: 400px" clearable>
            <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注信息"
            style="width: 400px"
            :rows="3"
            maxlength="256"
          />
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
import { mockReceiptDocs, mockAccounts, mockStaff, mockDepartments, mockProjects, mockContacts, mockCurrencies } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()

const form = reactive({
  bizDocId: '',
  bizDocNo: '',
  bizDate: '',
  receiptAccountId: '',
  accountId: null as string | null,
  contactId: null as string | null,
  receiptAmount: 0,
  currencyId: '1',
  exchangeRate: 1.0,
  bizStaffId: '',
  bizDeptId: null as string | null,
  bizProjectId: null as string | null,
  remark: ''
})

const rules: FormRules = {
  bizDate: [{ required: true, message: '请选择业务日期', trigger: 'change' }],
  receiptAccountId: [{ required: true, message: '请选择收款账户', trigger: 'change' }],
  receiptAmount: [
    { required: true, message: '请输入收款金额', trigger: 'blur' },
    {
      validator: (_rule: any, value: number, callback: any) => {
        if (value <= 0) {
          callback(new Error('收款金额必须大于0'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  currencyId: [{ required: true, message: '请选择币种', trigger: 'change' }],
  bizStaffId: [{ required: true, message: '请选择业务员', trigger: 'change' }]
}

const accountList = computed(() => mockAccounts.filter(a => a.status === 1))
const staffList = computed(() => mockStaff.filter(s => s.status === 1))
const deptList = computed(() => mockDepartments.filter(d => d.status === 1))
const projectList = computed(() => mockProjects.filter(p => p.status === 1))
const contactList = computed(() => mockContacts.filter(c => c.status === 1))
const currencyList = computed(() => mockCurrencies)

const handleBack = () => {
  router.push('/business/receipt')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch (_e) {
    return
  }

  const receiptAccount = mockAccounts.find(a => a.id === form.receiptAccountId)
  const account = form.accountId ? mockAccounts.find(a => a.id === form.accountId) : null
  const contact = form.contactId ? mockContacts.find(c => c.id === form.contactId) : null
  const staff = mockStaff.find(s => s.id === form.bizStaffId)
  const dept = form.bizDeptId ? mockDepartments.find(d => d.id === form.bizDeptId) : null
  const project = form.bizProjectId ? mockProjects.find(p => p.id === form.bizProjectId) : null
  const currency = mockCurrencies.find(c => c.id === form.currencyId)

  const index = mockReceiptDocs.findIndex(item => item.bizDocId === form.bizDocId)
  if (index !== -1) {
    mockReceiptDocs[index] = {
      ...mockReceiptDocs[index],
      bizDate: form.bizDate,
      receiptAccountId: form.receiptAccountId,
      receiptAccountName: receiptAccount?.name || '',
      accountId: form.accountId,
      accountName: account?.name || '',
      contactId: form.contactId,
      contactName: contact?.name || '',
      receiptAmount: form.receiptAmount,
      currencyId: form.currencyId,
      currencyName: currency?.name || '',
      exchangeRate: form.exchangeRate,
      bizStaffId: form.bizStaffId,
      bizStaffName: staff?.name || '',
      bizDeptId: form.bizDeptId,
      bizDeptName: dept?.name || '',
      bizProjectId: form.bizProjectId,
      bizProjectName: project?.projectName || '',
      remark: form.remark,
      updateId: staff?.id || null,
      updateName: staff?.name || '',
      updateTime: new Date().toLocaleString('zh-CN')
    }
  }

  router.push('/business/receipt')
}

onMounted(() => {
  const id = route.params.id as string
  const receipt = mockReceiptDocs.find(item => item.bizDocId === id)
  if (receipt) {
    form.bizDocId = receipt.bizDocId
    form.bizDocNo = receipt.bizDocNo
    form.bizDate = receipt.bizDate
    form.receiptAccountId = receipt.receiptAccountId
    form.accountId = receipt.accountId
    form.contactId = receipt.contactId
    form.receiptAmount = receipt.receiptAmount
    form.currencyId = receipt.currencyId
    form.exchangeRate = receipt.exchangeRate
    form.bizStaffId = receipt.bizStaffId
    form.bizDeptId = receipt.bizDeptId
    form.bizProjectId = receipt.bizProjectId
    form.remark = receipt.remark
  } else {
    router.push('/business/receipt')
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
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
}
</style>
