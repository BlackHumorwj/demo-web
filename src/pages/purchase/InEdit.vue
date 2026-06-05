<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑采购入库</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>
      
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="业务日期" prop="tradeTime">
          <el-date-picker v-model="form.tradeTime" type="date" placeholder="请选择业务日期" style="width: 400px" />
        </el-form-item>
        
        <el-form-item label="供应商" prop="bizContactId">
          <el-select v-model="form.bizContactId" placeholder="请选择供应商" style="width: 400px">
            <el-option v-for="item in supplierList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="仓库" prop="warehouseId">
          <el-select v-model="form.warehouseId" placeholder="请选择仓库" style="width: 400px">
            <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="结算账户" prop="accountId">
          <el-select v-model="form.accountId" placeholder="请选择结算账户" style="width: 400px">
            <el-option v-for="item in accountList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="业务员" prop="staffId">
          <el-select v-model="form.staffId" placeholder="请选择业务员" style="width: 400px">
            <el-option v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="部门">
          <el-select v-model="form.deptId" placeholder="请选择部门（可选）" style="width: 400px">
            <el-option :value="''" label="请选择" />
            <el-option v-for="item in deptList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="项目">
          <el-select v-model="form.projectId" placeholder="请选择项目（可选）" style="width: 400px">
            <el-option :value="''" label="请选择" />
            <el-option v-for="item in projectList" :key="item.id" :label="item.projectName" :value="item.id" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="币种">
          <el-select v-model="form.currencyCode" placeholder="请选择币种" style="width: 400px">
            <el-option v-for="item in currencyList" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="汇率">
          <el-input v-model.number="form.exchangeRate" type="number" placeholder="请输入汇率" style="width: 400px" />
        </el-form-item>
        
        <el-form-item label="商品明细">
          <div class="detail-table-container">
            <el-table :data="form.items" border style="width: 100%" :key="tableKey">
              <el-table-column type="index" label="序号" width="60" />
              <el-table-column label="商品" width="200">
                <template #default="scope">
                  <el-select v-model="scope.row.productId" placeholder="请选择商品" style="width: 100%" @change="onProductChange(scope.row, $event)">
                    <el-option v-for="item in productList" :key="item.id" :label="item.name" :value="item.id" />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="规格" width="150">
                <template #default="scope">
                  <span>{{ scope.row.spec }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数量" width="120">
                <template #default="scope">
                  <el-input v-model.number="scope.row.quantity" type="number" placeholder="数量" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="单价" width="120">
                <template #default="scope">
                  <el-input v-model.number="scope.row.price" type="number" placeholder="单价" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="金额" width="120">
                <template #default="scope">
                  <span class="amount">¥ {{ (scope.row.quantity * scope.row.price).toFixed(2) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="备注">
                <template #default="scope">
                  <el-input v-model="scope.row.remark" placeholder="备注" style="width: 100%" />
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default="scope">
                  <el-button type="text" size="small" style="color: #ef4444" @click="removeDetail(scope.$index)" v-if="form.items.length > 1">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="table-footer">
              <el-button type="primary" size="small" @click="addDetail">+ 添加商品</el-button>
              <div class="total-amount">
                <span class="label">合计金额：</span>
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
import { mockPurchaseInDocs, mockContacts, mockWarehouses, mockAccounts, mockStaff, mockDepartments, mockProjects, mockCurrencies, mockProducts } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const tableKey = ref(0)

interface PurchaseItem {
  productId: string
  productName: string
  spec: string
  quantity: number
  price: number
  remark: string
}

const form = reactive({
  tradeTime: '',
  bizContactId: '',
  warehouseId: '',
  accountId: '',
  staffId: '',
  deptId: '',
  projectId: '',
  currencyCode: 'CNY',
  exchangeRate: 1.00000000,
  remark: '',
  items: [] as PurchaseItem[]
})

const rules: FormRules = {
  tradeTime: [{ required: true, message: '请选择业务日期', trigger: 'change' }],
  bizContactId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  accountId: [{ required: true, message: '请选择结算账户', trigger: 'change' }],
  staffId: [{ required: true, message: '请选择业务员', trigger: 'change' }]
}

const supplierList = computed(() => mockContacts.filter(c => c.type === 2 && c.status === 1))
const warehouseList = computed(() => mockWarehouses.filter(w => w.status === 1))
const accountList = computed(() => mockAccounts.filter(a => a.status === 1))
const staffList = computed(() => mockStaff.filter(s => s.status === 1))
const deptList = computed(() => mockDepartments.filter(d => d.status === 1))
const projectList = computed(() => mockProjects.filter(p => p.status === 1))
const currencyList = computed(() => mockCurrencies.filter(c => c.status === 1))
const productList = computed(() => mockProducts)

const totalAmount = computed(() => {
  return form.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
})

const onProductChange = (row: PurchaseItem, value: string) => {
  const product = mockProducts.find(p => p.id === value)
  if (product) {
    row.productName = product.name
    row.spec = product.spec
  } else {
    row.productName = ''
    row.spec = ''
  }
}

const addDetail = () => {
  form.items.push({ productId: '', productName: '', spec: '', quantity: 0, price: 0, remark: '' })
  tableKey.value++
}

const removeDetail = (index: number) => {
  form.items.splice(index, 1)
  tableKey.value++
}

const handleBack = () => {
  router.push('/purchase/in')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const hasValidDetail = form.items.some(d => d.productId && d.quantity > 0 && d.price > 0)
  if (!hasValidDetail) {
    alert('请至少添加一条有效的商品明细')
    return
  }

  const id = route.params.id as string
  const index = mockPurchaseInDocs.findIndex(item => item.bizDocId === id)
  
  if (index !== -1) {
    const supplier = mockContacts.find(c => c.id === form.bizContactId)
    const warehouse = mockWarehouses.find(w => w.id === form.warehouseId)
    const account = mockAccounts.find(a => a.id === form.accountId)
    const staff = mockStaff.find(s => s.id === form.staffId)
    const dept = form.deptId ? mockDepartments.find(d => d.id === form.deptId) : null
    const project = form.projectId ? mockProjects.find(p => p.id === form.projectId) : null

    const now = new Date()
    const nowStr = now.toISOString().replace('T', ' ').substring(0, 19)

    mockPurchaseInDocs[index] = {
      ...mockPurchaseInDocs[index],
      tradeTime: form.tradeTime,
      bizContactId: form.bizContactId,
      bizContactName: supplier?.name || '',
      warehouseId: form.warehouseId,
      warehouseName: warehouse?.name || '',
      accountId: form.accountId,
      accountName: account?.name || '',
      staffId: form.staffId,
      staffName: staff?.name || '',
      currencyCode: form.currencyCode,
      exchangeRate: form.exchangeRate,
      deptId: form.deptId || null,
      deptName: dept?.name || '',
      projectId: form.projectId || null,
      projectName: project?.projectName || '',
      totalCost: totalAmount.value,
      remark: form.remark,
      updateId: '1',
      updateName: '管理员',
      updateTime: nowStr,
      items: form.items.map((item, i) => ({
        itemId: `${id}-${i + 1}`,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        originalAmount: item.quantity * item.price,
        costAmount: item.quantity * item.price * form.exchangeRate,
        remark: item.remark
      }))
    }
  }

  router.push('/purchase/in')
}

onMounted(() => {
  const id = route.params.id as string
  const purchaseDoc = mockPurchaseInDocs.find(item => item.bizDocId === id)
  
  if (purchaseDoc) {
    form.tradeTime = purchaseDoc.tradeTime
    form.bizContactId = purchaseDoc.bizContactId
    form.warehouseId = purchaseDoc.warehouseId
    form.accountId = purchaseDoc.accountId
    form.staffId = purchaseDoc.staffId
    form.deptId = purchaseDoc.deptId || ''
    form.projectId = purchaseDoc.projectId || ''
    form.currencyCode = purchaseDoc.currencyCode
    form.exchangeRate = purchaseDoc.exchangeRate
    form.remark = purchaseDoc.remark
    
    form.items = purchaseDoc.items.map(item => ({
      productId: item.productId,
      productName: item.productName,
      spec: mockProducts.find(p => p.id === item.productId)?.spec || '',
      quantity: item.quantity,
      price: item.price,
      remark: item.remark
    }))
    
    tableKey.value++
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

.amount {
  color: #22c55e;
  font-weight: 500;
}
</style>