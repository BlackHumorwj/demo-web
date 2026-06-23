<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑销售退货</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="业务日期" prop="bizDate">
          <el-date-picker v-model="form.bizDate" type="date" placeholder="请选择业务日期" style="width: 400px" />
        </el-form-item>

        <el-form-item label="客户" prop="customerId">
          <el-select v-model="form.customerId" placeholder="请选择客户" style="width: 400px" @change="onCustomerChange">
            <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="联系人">
          <el-select v-model="form.contactId" placeholder="请选择联系人（可选）" style="width: 400px">
            <el-option :value="''" label="请选择" />
            <el-option v-for="item in contactList" :key="item.id" :label="item.contactName || item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="结算账户" prop="accountId">
          <el-select v-model="form.accountId" placeholder="请选择结算账户" style="width: 400px">
            <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="业务员" prop="bizStaffId">
          <el-select v-model="form.bizStaffId" placeholder="请选择业务员" style="width: 400px">
            <el-option v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="部门">
          <el-select v-model="form.bizDeptId" placeholder="请选择部门（可选）" style="width: 400px">
            <el-option :value="''" label="请选择" />
            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="项目">
          <el-select v-model="form.bizProjectId" placeholder="请选择项目（可选）" style="width: 400px">
            <el-option :value="''" label="请选择" />
            <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="收支明细">
          <div class="detail-table-container">
            <el-table :data="form.categoryItems" border style="width: 100%" :key="categoryTableKey">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column label="分类" width="200">
                <template #default="scope">
                  <el-select v-model="scope.row.categoryId" placeholder="请选择分类" style="width: 100%" @change="onCategoryChange(scope.row)">
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="金额" width="140">
                <template #default="scope">
                  <el-input v-model.number="scope.row.amount" type="number" placeholder="金额" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template #default="scope">
                  <el-input v-model="scope.row.remark" placeholder="备注" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <el-button type="text" size="small" style="color: #ef4444" @click="removeCategoryDetail(scope.$index)" v-if="form.categoryItems.length > 1">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer">
              <el-button type="primary" size="small" @click="addCategoryDetail">+ 添加收支明细</el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="库存明细">
          <div class="detail-table-container">
            <el-table :data="form.inventoryItems" border style="width: 100%" :key="inventoryTableKey">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column label="商品" width="200">
                <template #default="scope">
                  <el-select v-model="scope.row.prodId" placeholder="请选择商品" style="width: 100%" @change="onProductChange(scope.row)">
                    <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="prodSpec" label="规格" width="120" />
              <el-table-column prop="unit" label="单位" width="80" />
              <el-table-column label="数量" width="120">
                <template #default="scope">
                  <el-input v-model.number="scope.row.qty" type="number" placeholder="数量" style="width: 100%" @change="updateInventoryAmount(scope.row)" />
                </template>
              </el-table-column>
              <el-table-column label="单价" width="120">
                <template #default="scope">
                  <el-input v-model.number="scope.row.price" type="number" placeholder="单价" style="width: 100%" @change="updateInventoryAmount(scope.row)" />
                </template>
              </el-table-column>
              <el-table-column label="金额" width="120">
                <template #default="scope">
                  <span class="amount">¥ {{ scope.row.amount.toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="仓库" width="140">
                <template #default="scope">
                  <el-select v-model="scope.row.warehouseId" placeholder="仓库" style="width: 100%">
                    <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template #default="scope">
                  <el-input v-model="scope.row.remark" placeholder="备注" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <el-button type="text" size="small" style="color: #ef4444" @click="removeInventoryDetail(scope.$index)" v-if="form.inventoryItems.length > 1">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer">
              <el-button type="primary" size="small" @click="addInventoryDetail">+ 添加库存明细</el-button>
              <div class="total-amount">
                <span class="label">合计数量：</span>
                <span class="value">{{ totalQty.toLocaleString() }}</span>
                <span class="label" style="margin-left: 16px">合计金额：</span>
                <span class="value">¥ {{ totalAmount.toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="备注">
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'
import {
  mockSalesReturnDocs,
  mockContacts,
  mockAccounts,
  mockStaff,
  mockDepartments,
  mockProjects,
  mockCategories,
  mockProducts,
  mockWarehouses
} from '@/data/mockData'
import type { SalesReturnCategoryItem, SalesReturnInventoryItem } from '@/types/inventory'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const categoryTableKey = ref(0)
const inventoryTableKey = ref(0)

const createEmptyCategoryItem = (): SalesReturnCategoryItem => ({
  itemId: '',
  categoryId: '',
  categoryName: '',
  amount: 0,
  remark: ''
})

const createEmptyInventoryItem = (): SalesReturnInventoryItem => ({
  itemId: '',
  prodId: '',
  prodName: '',
  prodSpec: '',
  unit: '',
  qty: 0,
  price: 0,
  amount: 0,
  warehouseId: '',
  remark: ''
})

const form = reactive({
  bizDate: '',
  customerId: '',
  contactId: '',
  accountId: '',
  bizStaffId: '',
  bizDeptId: '',
  bizProjectId: '',
  remark: '',
  categoryItems: [] as SalesReturnCategoryItem[],
  inventoryItems: [] as SalesReturnInventoryItem[]
})

const rules: FormRules = {
  bizDate: [{ required: true, message: '请选择业务日期', trigger: 'change' }],
  customerId: [{ required: true, message: '请选择客户', trigger: 'change' }],
  accountId: [{ required: true, message: '请选择结算账户', trigger: 'change' }],
  bizStaffId: [{ required: true, message: '请选择业务员', trigger: 'change' }]
}

const customerList = computed(() => mockContacts.filter(c => c.type === 1 && c.status === 1))
const contactList = computed(() => mockContacts.filter(c => c.type === 1))
const accountList = computed(() => mockAccounts.filter(a => a.status === 1))
const staffList = computed(() => mockStaff.filter(s => s.status === 1))
const deptList = computed(() => mockDepartments.filter(d => d.status === 1))
const projectList = computed(() => mockProjects.filter(p => p.status === 1))
const categoryList = computed(() => mockCategories.filter(c => c.status === 1))
const productList = computed(() => mockProducts)
const warehouseList = computed(() => mockWarehouses.filter(w => w.status === 1))

const totalQty = computed(() => form.inventoryItems.reduce((sum, item) => sum + (item.qty || 0), 0))
const totalAmount = computed(() => form.inventoryItems.reduce((sum, item) => sum + (item.amount || 0), 0))

const onCustomerChange = () => {
  form.contactId = ''
}

const onCategoryChange = (row: SalesReturnCategoryItem) => {
  const category = mockCategories.find(c => c.id === row.categoryId)
  row.categoryName = category?.name || ''
}

const onProductChange = (row: SalesReturnInventoryItem) => {
  const product = mockProducts.find(p => p.id === row.prodId)
  row.prodName = product?.name || ''
  row.prodSpec = product?.spec || ''
  row.unit = product?.unit || ''
  row.amount = (row.qty || 0) * (row.price || 0)
}

const updateInventoryAmount = (row: SalesReturnInventoryItem) => {
  row.amount = (row.qty || 0) * (row.price || 0)
}

const addCategoryDetail = () => {
  form.categoryItems.push(createEmptyCategoryItem())
  categoryTableKey.value++
}

const removeCategoryDetail = (index: number) => {
  form.categoryItems.splice(index, 1)
  categoryTableKey.value++
}

const addInventoryDetail = () => {
  form.inventoryItems.push(createEmptyInventoryItem())
  inventoryTableKey.value++
}

const removeInventoryDetail = (index: number) => {
  form.inventoryItems.splice(index, 1)
  inventoryTableKey.value++
}

const handleBack = () => {
  router.push('/inventory/sales-return')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const hasValidInventory = form.inventoryItems.some(d => d.prodId && d.qty > 0)
  if (!hasValidInventory) {
    alert('请至少添加一条有效的库存明细')
    return
  }

  const id = route.params.id as string
  const index = mockSalesReturnDocs.findIndex(item => item.bizDocId === id)

  if (index !== -1) {
    const customer = mockContacts.find(c => c.id === form.customerId)
    const account = mockAccounts.find(a => a.id === form.accountId)
    const staff = mockStaff.find(s => s.id === form.bizStaffId)
    const dept = form.bizDeptId ? mockDepartments.find(d => d.id === form.bizDeptId) : null
    const project = form.bizProjectId ? mockProjects.find(p => p.id === form.bizProjectId) : null
    const contact = form.contactId ? mockContacts.find(c => c.id === form.contactId) : null

    const now = new Date()
    const nowStr = now.toISOString().replace('T', ' ').substring(0, 19)

    mockSalesReturnDocs[index] = {
      ...mockSalesReturnDocs[index],
      bizDate: form.bizDate,
      customerId: form.customerId,
      customerName: customer?.name || '',
      contactId: form.contactId || '',
      contactName: contact?.name || '',
      accountId: form.accountId,
      accountName: account?.name || '',
      totalQty: totalQty.value,
      totalAmount: totalAmount.value,
      bizStaffId: form.bizStaffId,
      bizStaffName: staff?.name || '',
      bizDeptId: form.bizDeptId || null,
      bizDeptName: dept?.name || '',
      bizProjectId: form.bizProjectId || null,
      bizProjectName: project?.projectName || '',
      remark: form.remark,
      updateId: '1',
      updateName: '管理员',
      updateTime: nowStr,
      categoryItems: form.categoryItems.map((item, idx) => ({
        itemId: `${id}-C${idx + 1}`,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        amount: item.amount,
        remark: item.remark
      })),
      inventoryItems: form.inventoryItems.map((item, idx) => ({
        itemId: `${id}-I${idx + 1}`,
        prodId: item.prodId,
        prodName: item.prodName,
        prodSpec: item.prodSpec,
        unit: item.unit,
        qty: item.qty,
        price: item.price,
        amount: item.amount,
        warehouseId: item.warehouseId,
        remark: item.remark
      }))
    }
  }

  router.push('/inventory/sales-return')
}

onMounted(() => {
  const id = route.params.id as string
  const doc = mockSalesReturnDocs.find(item => item.bizDocId === id)

  if (doc) {
    form.bizDate = doc.bizDate
    form.customerId = doc.customerId
    form.contactId = doc.contactId || ''
    form.accountId = doc.accountId
    form.bizStaffId = doc.bizStaffId
    form.bizDeptId = doc.bizDeptId || ''
    form.bizProjectId = doc.bizProjectId || ''
    form.remark = doc.remark

    form.categoryItems = doc.categoryItems.map(item => ({
      itemId: item.itemId,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      amount: item.amount,
      remark: item.remark
    }))

    form.inventoryItems = doc.inventoryItems.map(item => ({
      itemId: item.itemId,
      prodId: item.prodId,
      prodName: item.prodName,
      prodSpec: item.prodSpec,
      unit: item.unit,
      qty: item.qty,
      price: item.price,
      amount: item.amount,
      warehouseId: item.warehouseId,
      remark: item.remark
    }))

    categoryTableKey.value++
    inventoryTableKey.value++
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
  max-width: 900px;
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
  font-size: 16px;
  margin-left: 8px;
}

.amount {
  color: #22c55e;
  font-weight: 500;
}
</style>
