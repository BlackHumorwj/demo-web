<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑收入</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="单据编号">
          <el-input v-model="form.docNo" disabled style="width: 400px" />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker v-model="form.date" type="date" placeholder="请选择日期" style="width: 400px" />
        </el-form-item>
        <el-form-item label="客户" prop="contactId">
          <el-select v-model="form.contactId" placeholder="请选择客户" style="width: 400px">
            <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="账户" prop="accountId">
          <el-select v-model="form.accountId" placeholder="请选择账户" style="width: 400px">
            <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目">
          <el-select v-model="form.projectId" placeholder="请选择项目（可选）" style="width: 400px" allow-create>
            <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="单据明细">
          <div class="detail-table-container">
            <el-table :data="form.details" border style="width: 100%" :key="tableKey">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column label="收支类别" width="200">
                <template #default="scope">
                  <el-select v-model="scope.row.categoryId" placeholder="请选择类别" style="width: 100%">
                    <el-option v-for="item in incomeCategoryList" :key="item.id" :label="item.name" :value="item.id" @change="onCategoryChange(scope.row, $event)" />
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
                  <el-button type="text" size="small" style="color: #ef4444" @click="removeDetail(scope.$index)" v-if="form.details.length > 1">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer">
              <el-button type="primary" size="small" @click="addDetail">+ 添加明细</el-button>
              <div class="total-amount">
                <span class="label">合计金额：</span>
                <span class="value">¥ {{ totalAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 400px">
            <el-option :value="0" label="未提交" />
            <el-option :value="1" label="待审核" />
            <el-option :value="2" label="已审核" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息" style="width: 400px" :rows="3" maxlength="256" />
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import { mockIncomeDocs, mockContacts, mockCategories, mockAccounts, mockProjects } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const tableKey = ref(0)

const form = reactive({
  id: '',
  docNo: '',
  date: '',
  contactId: '',
  accountId: '',
  projectId: '',
  status: 0,
  remark: '',
  details: [] as any[]
})

const rules: FormRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  contactId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  accountId: [{ required: true, message: '请选择账户', trigger: 'change' }]
}

const customerList = computed(() => mockContacts.filter(c => c.type === 1))
const incomeCategoryList = computed(() => mockCategories.filter(c => c.type === 1))
const accountList = computed(() => mockAccounts.filter(a => a.status === 1))
const projectList = computed(() => mockProjects.filter(p => p.status === 1))

const totalAmount = computed(() => {
  return form.details.reduce((sum, item: any) => sum + (item.amount || 0), 0)
})

const onCategoryChange = (row: any, value: string) => {
  const category = mockCategories.find(c => c.id === value)
  if (category) {
    row.categoryName = category.name
  }
}

const addDetail = () => {
  form.details.push({ id: '', categoryId: '', categoryName: '', amount: 0, remark: '' })
  tableKey.value++
}

const removeDetail = (index: number) => {
  form.details.splice(index, 1)
  tableKey.value++
}

const handleBack = () => {
  router.push('/business/income')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const hasValidDetail = form.details.some((d: any) => d.categoryId && d.amount > 0)
  if (!hasValidDetail) {
    alert('请至少添加一条有效的明细')
    return
  }

  const contact = mockContacts.find(c => c.id === form.contactId)
  const account = mockAccounts.find(a => a.id === form.accountId)
  const project = form.projectId ? mockProjects.find(p => p.id === form.projectId) : null

  form.details.forEach((detail: any, index: number) => {
    if (!detail.id) {
      detail.id = `${form.id}-${index + 1}`
    }
    if (!detail.categoryName && detail.categoryId) {
      const category = mockCategories.find(c => c.id === detail.categoryId)
      detail.categoryName = category?.name || ''
    }
  })

  const index = mockIncomeDocs.findIndex(item => item.id === form.id)
  if (index !== -1) {
    mockIncomeDocs[index] = {
      ...mockIncomeDocs[index],
      date: form.date,
      contactId: form.contactId,
      contactName: contact?.name || '',
      accountId: form.accountId,
      accountName: account?.name || '',
      projectId: form.projectId || null,
      projectName: project?.projectName || '',
      status: form.status,
      remark: form.remark,
      details: [...form.details],
      updatedAt: new Date().toISOString()
    }
  }

  router.push('/business/income')
}

onMounted(() => {
  const id = route.params.id as string
  const income = mockIncomeDocs.find(item => item.id === id)
  if (income) {
    form.id = income.id
    form.docNo = income.docNo
    form.date = income.date
    form.contactId = income.contactId
    form.accountId = income.accountId
    form.projectId = income.projectId || ''
    form.status = income.status
    form.remark = income.remark
    form.details = income.details.map(d => ({ ...d }))
  } else {
    router.push('/business/income')
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
  color: #22c55e;
  font-weight: 600;
  font-size: 18px;
  margin-left: 8px;
}
</style>