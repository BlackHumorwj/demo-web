<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>{{ isView ? '查看' : isEdit ? '编辑' : '新增' }}{{ form.bizTypeName }}</span>
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
                <el-option label="盘盈入库" :value="1" />
                <el-option label="盘亏出库" :value="2" />
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
            <el-form-item label="来源盘点单">
              <el-select v-model="form.relatedStocktakeNo" clearable placeholder="选填" class="full-width" :disabled="isView">
                <el-option v-for="s in stocktakeOptions" :key="s" :label="s" :value="s" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量合计">
              <el-input :value="`${totalQty} 件`" disabled class="full-width" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="form.remark" :disabled="isView" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-divider content-position="left">明细</el-divider>

      <div v-if="!isView" class="toolbar">
        <el-button type="primary" size="small" @click="addDetail">添加明细</el-button>
      </div>

      <el-table :data="form.details" border size="small">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column label="产品" min-width="200">
          <template #default="scope">
            <el-select v-model="scope.row.prodId" filterable placeholder="选择产品" :disabled="isView" @change="(val: string) => handleProdChange(val, scope.$index)" class="full-width">
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
        <el-table-column label="成本单价" width="120" align="right">
          <template #default="scope">
            <el-input-number v-model="scope.row.costPrice" :precision="2" :min="0" :disabled="isView" controls-position="right" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="金额" width="120" align="right">
          <template #default="scope">
            <span style="color: #f56c6c">¥{{ calcDetailAmount(scope.row).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="140">
          <template #default="scope"><el-input v-model="scope.row.remark" :disabled="isView" /></template>
        </el-table-column>
        <el-table-column v-if="!isView" label="操作" width="80" align="center">
          <template #default="scope">
            <el-button type="text" size="small" style="color: #ef4444" @click="removeDetail(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-card v-if="form.details.length > 0" class="total-card" shadow="never">
        合计：<span class="total-amount">¥{{ totalAmount.toFixed(2) }}</span>
      </el-card>

      <el-descriptions v-if="isView" :column="2" border style="margin-top: 16px">
        <el-descriptions-item label="状态">{{ form.statusName }}</el-descriptions-item>
        <el-descriptions-item label="关联凭证">{{ form.voucherNo || '-' }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockWarehouses, mockProducts, mockStocktakeRecords, mockStockProfitLossDocs, StockProfitLossDoc, StockProfitLossDetail } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => route.query.mode === 'edit' || !!route.params.id)
const isView = computed(() => route.query.mode === 'view')

const formRef = ref()
const form = reactive<StockProfitLossDoc>({
  id: '',
  docNo: '',
  bizDate: new Date().toISOString().slice(0, 10),
  bizType: 1,
  bizTypeName: '盘盈入库',
  warehouseId: '',
  warehouseName: '',
  relatedStocktakeNo: null,
  status: 0,
  statusName: '草稿',
  totalKinds: 0,
  totalQty: 0,
  totalAmount: 0,
  writerId: '1',
  writerName: '张三',
  writeTime: '',
  remark: '',
  voucherNo: null,
  details: []
})

const rules = {
  bizDate: [{ required: true, message: '请选择业务日期', trigger: 'change' }],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }]
}

const stocktakeOptions = computed(() => mockStocktakeRecords.map(s => s.docNo))

const totalQty = computed(() => form.details.reduce((s, d) => s + (d.qty || 0), 0))
const totalAmount = computed(() => form.details.reduce((s, d) => s + calcDetailAmount(d), 0))

const calcDetailAmount = (d: StockProfitLossDetail) => (d.qty || 0) * (d.costPrice || 0)

const genDocNo = (bizType: number) => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const prefix = bizType === 1 ? 'PI' : 'LO'
  return `${prefix}-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${String(Math.floor(Math.random() * 9000) + 1000)}`
}

const handleBizTypeChange = (val: number) => {
  form.bizTypeName = val === 1 ? '盘盈入库' : '盘亏出库'
  if (!form.id) form.docNo = genDocNo(val)
}

const handleWarehouseChange = (id: string) => {
  const w = mockWarehouses.find(x => x.id === id)
  form.warehouseName = w ? w.name : ''
}

const handleProdChange = (val: string, index: number) => {
  const p = mockProducts.find(x => x.id === val)
  if (p) {
    form.details[index].prodName = p.name
    form.details[index].prodSpec = p.spec
    form.details[index].unit = p.unit
  }
}

const addDetail = () => {
  const d: StockProfitLossDetail = {
    id: `D${Date.now()}`,
    prodId: '',
    prodName: '',
    prodSpec: '',
    unit: '',
    qty: 0,
    costPrice: 0,
    amount: 0,
    warehouseId: form.warehouseId,
    remark: ''
  }
  form.details.push(d)
}

const removeDetail = (index: number) => {
  form.details.splice(index, 1)
}

const loadDetail = () => {
  if (route.params.id) {
    const doc = mockStockProfitLossDocs.find(d => d.id === route.params.id)
    if (doc) Object.assign(form, JSON.parse(JSON.stringify(doc)))
  } else {
    form.bizType = Number(route.query.bizType || 1)
    handleBizTypeChange(form.bizType)
    form.writeTime = new Date().toLocaleString('zh-CN', { hour12: false })
  }
}

const handleSave = async () => {
  if (isView.value) {
    router.push('/inventory/pnl')
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
  form.totalKinds = form.details.length
  form.totalQty = totalQty.value
  form.totalAmount = totalAmount.value
  ElMessage.success('保存成功')
  router.push('/inventory/pnl')
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
