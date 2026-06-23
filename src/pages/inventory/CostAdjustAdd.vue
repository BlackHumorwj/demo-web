<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>{{ isEdit ? '编辑成本调整单' : '新增成本调整单' }}</span>
          <el-button @click="handleSave">{{ isView ? '返回' : '保存' }}</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="110px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="调整单号">
              <el-input v-model="form.docNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调整日期" prop="adjustDate">
              <el-date-picker v-model="form.adjustDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" class="full-width" :disabled="isView" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仓库" prop="warehouseId">
              <el-select v-model="form.warehouseId" placeholder="选择仓库" class="full-width" :disabled="isView" @change="handleWarehouseChange">
                <el-option v-for="w in mockWarehouses" :key="w.id" :label="w.name" :value="w.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="调整原因" prop="reason">
              <el-input v-model="form.reason" placeholder="请输入调整原因" :disabled="isView" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="选填" :disabled="isView" />
        </el-form-item>
      </el-form>

      <el-divider content-position="left">调整明细</el-divider>

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
              @change="(val: string) => handleProdChange(val, scope.$index)"
              class="full-width"
            >
              <el-option v-for="p in mockProducts" :key="p.id" :label="`${p.name} (${p.spec})`" :value="p.id" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="单位" width="80" align="center" />
        <el-table-column label="库存数量" width="100" align="right">
          <template #default="scope">{{ scope.row.stockQty }}</template>
        </el-table-column>
        <el-table-column label="调整前单价" width="120" align="right">
          <template #default="scope">
            <el-input-number v-model="scope.row.beforeCostPrice" :precision="2" :min="0" :disabled="isView" controls-position="right" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="调整后单价" width="120" align="right">
          <template #default="scope">
            <el-input-number v-model="scope.row.afterCostPrice" :precision="2" :min="0" :disabled="isView" controls-position="right" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="调整金额" width="130" align="right">
          <template #default="scope">
            <span :style="{ color: calcAdjustAmount(scope.row) < 0 ? '#f56c6c' : '#67c23a' }">
              ¥{{ calcAdjustAmount(scope.row).toFixed(2) }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="120">
          <template #default="scope">
            <el-input v-model="scope.row.remark" :disabled="isView" />
          </template>
        </el-table-column>
        <el-table-column v-if="!isView" label="操作" width="80" align="center">
          <template #default="scope">
            <el-button type="text" size="small" style="color: #ef4444" @click="removeDetail(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-card v-if="form.details.length > 0" class="total-card" shadow="never">
        <div>
          合计调整金额：
          <span :style="{ color: totalAdjustAmount < 0 ? '#f56c6c' : '#67c23a', fontWeight: 600, fontSize: '16px' }">
            ¥{{ totalAdjustAmount.toFixed(2) }}
          </span>
        </div>
      </el-card>

      <el-divider v-if="isView" content-position="left">状态与凭证</el-divider>
      <el-descriptions v-if="isView" :column="2" border>
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
import { mockWarehouses, mockProducts, mockCostAdjustDocs, CostAdjustDoc, CostAdjustDetail } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => route.query.mode === 'edit' || !!route.params.id)
const isView = computed(() => route.query.mode === 'view')

const formRef = ref()
const form = reactive<CostAdjustDoc>({
  id: '',
  docNo: '',
  adjustDate: new Date().toISOString().slice(0, 10),
  warehouseId: '',
  warehouseName: '',
  reason: '',
  status: 0,
  statusName: '草稿',
  totalAmount: 0,
  writerId: '1',
  writerName: '张三',
  writeTime: '',
  remark: '',
  voucherNo: null,
  details: []
})

const rules = {
  adjustDate: [{ required: true, message: '请选择调整日期', trigger: 'change' }],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  reason: [{ required: true, message: '请输入调整原因', trigger: 'blur' }]
}

const totalAdjustAmount = computed(() => {
  return form.details.reduce((sum, d) => sum + calcAdjustAmount(d), 0)
})

const calcAdjustAmount = (d: CostAdjustDetail) => {
  return (d.afterCostPrice - d.beforeCostPrice) * (d.stockQty || 0)
}

const genDocNo = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `CA-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${String(Math.floor(Math.random() * 9000) + 1000)}`
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
    form.details[index].stockQty = p.stock
  }
}

const addDetail = () => {
  const newDetail: CostAdjustDetail = {
    id: `D${Date.now()}`,
    prodId: '',
    prodName: '',
    prodSpec: '',
    unit: '',
    warehouseId: form.warehouseId,
    warehouseName: form.warehouseName,
    stockQty: 0,
    beforeCostPrice: 0,
    afterCostPrice: 0,
    adjustAmount: 0,
    remark: ''
  }
  form.details.push(newDetail)
}

const removeDetail = (index: number) => {
  form.details.splice(index, 1)
}

const loadDetail = () => {
  if (!route.params.id) {
    form.docNo = genDocNo()
    form.writeTime = new Date().toLocaleString('zh-CN', { hour12: false })
    return
  }
  const id = route.params.id as string
  const doc = mockCostAdjustDocs.find(d => d.id === id)
  if (doc) {
    Object.assign(form, JSON.parse(JSON.stringify(doc)))
  }
}

const handleSave = async () => {
  if (isView.value) {
    router.push('/inventory/cost-adjust')
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
  form.totalAmount = totalAdjustAmount.value
  ElMessage.success('保存成功')
  router.push('/inventory/cost-adjust')
}

onMounted(loadDetail)
</script>

<style scoped>
.page-container {
  padding: 16px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.full-width {
  width: 100%;
}

.toolbar {
  margin-bottom: 8px;
}

.total-card {
  margin-top: 12px;
  text-align: right;
  background: #f9fafb;
}
</style>
