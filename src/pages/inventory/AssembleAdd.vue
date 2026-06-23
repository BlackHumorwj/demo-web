<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>{{ isView ? '查看' : isEdit ? '编辑' : '新增' }}{{ form.bizTypeName }}单</span>
          <el-button @click="handleSave">{{ isView ? '返回' : '保存' }}</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="单据编号">
              <el-input v-model="form.docNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务类型">
              <el-select v-model="form.bizType" class="full-width" :disabled="isView" @change="handleBizTypeChange">
                <el-option label="组装" :value="1" />
                <el-option label="拆分" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务日期" prop="bizDate">
              <el-date-picker v-model="form.bizDate" type="date" value-format="YYYY-MM-DD" class="full-width" :disabled="isView" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select v-model="form.warehouseId" class="full-width" :disabled="isView" @change="handleWarehouseChange">
                <el-option v-for="w in mockWarehouses" :key="w.id" :label="w.name" :value="w.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主产品" prop="mainProdId">
              <el-select v-model="form.mainProdId" filterable class="full-width" :disabled="isView" @change="handleMainProdChange">
                <el-option v-for="p in mockProducts" :key="p.id" :label="`${p.name} (${p.spec})`" :value="p.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量" prop="mainQty">
              <el-input-number v-model="form.mainQty" :precision="2" :min="0" :disabled="isView" controls-position="right" class="full-width" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单价">
              <el-input-number v-model="form.mainPrice" :precision="2" :min="0" :disabled="isView" controls-position="right" class="full-width" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="金额">
              <el-input :value="form.mainAmount.toFixed(2)" disabled class="full-width" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原因" prop="reason">
              <el-input v-model="form.reason" :disabled="isView" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" :disabled="isView" />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">
        {{ form.bizType === 1 ? '原料明细（领用出库）' : '明细（领用出库）' }}
      </el-divider>

      <div v-if="!isView" class="toolbar">
        <el-button type="primary" size="small" @click="addDetail">添加明细</el-button>
      </div>

      <el-table :data="form.details" border size="small">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column label="产品" min-width="200">
          <template #default="scope">
            <el-select
              v-model="scope.row.prodId"
              placeholder="选择产品"
              filterable
              :disabled="isView"
              @change="(val: string) => handleDetailProdChange(val, scope.$index)"
              class="full-width"
            >
              <el-option v-for="p in mockProducts" :key="p.id" :label="`${p.name} (${p.spec})`" :value="p.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center" />
        <el-table-column label="数量" width="120" align="right">
          <template #default="scope">
            <el-input-number v-model="scope.row.qty" :precision="2" :min="0" :disabled="isView" controls-position="right" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="单价" width="120" align="right">
          <template #default="scope">
            <el-input-number v-model="scope.row.price" :precision="2" :min="0" :disabled="isView" controls-position="right" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="金额" width="130" align="right">
          <template #default="scope">¥{{ calcDetailAmount(scope.row).toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="仓库" width="120">
          <template #default="scope">
            <el-select v-model="scope.row.warehouseId" :disabled="isView" size="small">
              <el-option v-for="w in mockWarehouses" :key="w.id" :label="w.name" :value="w.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="120">
          <template #default="scope"><el-input v-model="scope.row.remark" :disabled="isView" /></template>
        </el-table-column>
        <el-table-column v-if="!isView" label="操作" width="80" align="center">
          <template #default="scope">
            <el-button type="text" size="small" style="color: #ef4444" @click="removeDetail(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-card v-if="form.details.length > 0" class="total-card" shadow="never">
        合计金额：<span class="total-amount">¥{{ totalDetailAmount.toFixed(2) }}</span>
      </el-card>

      <el-descriptions v-if="isView" :column="2" border style="margin-top: 16px">
        <el-descriptions-item label="状态">{{ form.statusName }}</el-descriptions-item>
        <el-descriptions-item label="关联凭证">{{ form.voucherNo || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockWarehouses, mockProducts, mockAssembleDocs, AssembleDoc, AssembleDetail } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => route.query.mode === 'edit' || !!route.params.id)
const isView = computed(() => route.query.mode === 'view')

const formRef = ref()
const form = reactive<AssembleDoc>({
  id: '',
  docNo: '',
  bizDate: new Date().toISOString().slice(0, 10),
  bizType: 1,
  bizTypeName: '组装',
  warehouseId: '',
  warehouseName: '',
  mainProdId: '',
  mainProdName: '',
  mainProdSpec: '',
  mainUnit: '',
  mainQty: 0,
  mainPrice: 0,
  mainAmount: 0,
  status: 0,
  statusName: '草稿',
  reason: '',
  writerId: '1',
  writerName: '张三',
  writeTime: '',
  remark: '',
  voucherNo: null,
  details: []
})

const rules = {
  bizDate: [{ required: true, message: '请选择业务日期', trigger: 'change' }],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  mainProdId: [{ required: true, message: '请选择主产品', trigger: 'change' }],
  mainQty: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入原因', trigger: 'blur' }]
}

const totalDetailAmount = computed(() => {
  return form.details.reduce((sum, d) => sum + calcDetailAmount(d), 0)
})

const calcDetailAmount = (d: AssembleDetail) => {
  return (d.qty || 0) * (d.price || 0)
}

watch(
  () => [form.mainQty, form.mainPrice],
  () => {
    form.mainAmount = (form.mainQty || 0) * (form.mainPrice || 0)
  }
)

const genDocNo = (bizType: number) => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const prefix = bizType === 1 ? 'AS' : 'DA'
  return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${String(Math.floor(Math.random() * 9000) + 1000)}`
}

const handleBizTypeChange = (val: number) => {
  form.bizTypeName = val === 1 ? '组装' : '拆分'
  if (!form.id) form.docNo = genDocNo(val)
}

const handleWarehouseChange = (id: string) => {
  const w = mockWarehouses.find(x => x.id === id)
  form.warehouseName = w ? w.name : ''
  form.details.forEach(d => { d.warehouseId = id })
}

const handleMainProdChange = (val: string) => {
  const p = mockProducts.find(x => x.id === val)
  if (p) {
    form.mainProdName = p.name
    form.mainProdSpec = p.spec
    form.mainUnit = p.unit
  }
}

const handleDetailProdChange = (val: string, index: number) => {
  const p = mockProducts.find(x => x.id === val)
  if (p) {
    form.details[index].prodName = p.name
    form.details[index].prodSpec = p.spec
    form.details[index].unit = p.unit
  }
}

const addDetail = () => {
  const newDetail: AssembleDetail = {
    id: `D${Date.now()}`,
    prodId: '',
    prodName: '',
    prodSpec: '',
    unit: '',
    qty: 0,
    price: 0,
    amount: 0,
    warehouseId: form.warehouseId,
    remark: ''
  }
  form.details.push(newDetail)
}

const removeDetail = (index: number) => {
  form.details.splice(index, 1)
}

const loadDetail = () => {
  if (route.params.id) {
    const id = route.params.id as string
    const doc = mockAssembleDocs.find(d => d.id === id)
    if (doc) Object.assign(form, JSON.parse(JSON.stringify(doc)))
  } else {
    form.bizType = Number(route.query.bizType || 1)
    handleBizTypeChange(form.bizType)
    form.writeTime = new Date().toLocaleString('zh-CN', { hour12: false })
  }
}

const handleSave = async () => {
  if (isView.value) {
    router.push('/inventory/assemble')
    return
  }
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning('请完善表单')
    return
  }
  if (form.details.length === 0) {
    ElMessage.warning('请至少添加一条明细')
    return
  }
  ElMessage.success('保存成功')
  router.push('/inventory/assemble')
}

onMounted(loadDetail)
</script>

<style scoped>
.page-container { padding: 16px; }
.header-content { display: flex; justify-content: space-between; align-items: center; }
.full-width { width: 100%; }
.toolbar { margin-bottom: 8px; }
.total-card { margin-top: 12px; text-align: right; background: #f9fafb; }
.total-amount { color: #f56c6c; font-weight: 600; font-size: 16px; }
</style>
