<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>{{ isEdit ? '编辑盘点单' : '新增盘点单' }}</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-card shadow="never" style="margin-bottom: 20px">
          <div slot="header">基础信息</div>
          <div class="form-row">
            <el-form-item label="盘点日期" prop="takeDate" class="form-item">
              <el-date-picker
                v-model="form.takeDate"
                type="date"
                placeholder="请选择盘点日期"
                value-format="YYYY-MM-DD"
                style="width: 220px"
              />
            </el-form-item>
            <el-form-item label="盘点仓库" prop="warehouseId" class="form-item">
              <el-select v-model="form.warehouseId" placeholder="请选择仓库" style="width: 220px" @change="handleWarehouseChange">
                <el-option v-for="w in warehouseOptions" :key="w.id" :label="w.name" :value="w.id" />
              </el-select>
            </el-form-item>
          </div>
          <div class="form-row">
            <el-form-item label="盘点类型" prop="takeType" class="form-item">
              <el-radio-group v-model="form.takeType">
                <el-radio :label="1">全盘</el-radio>
                <el-radio :label="2">抽盘</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark" class="form-item">
              <el-input v-model="form.remark" placeholder="请输入备注" maxlength="200" show-word-limit style="width: 300px" />
            </el-form-item>
          </div>
        </el-card>

        <el-card shadow="never" style="margin-bottom: 20px">
          <div slot="header" class="detail-header">
            <span>盘点明细</span>
            <el-button v-if="form.takeType === 2" type="primary" size="small" @click="openProductPicker">选择产品</el-button>
            <el-button v-else size="small" @click="loadAllProducts">加载账存</el-button>
          </div>

          <el-table :data="form.details" border size="small">
            <el-table-column prop="prodName" label="产品名称" min-width="140" />
            <el-table-column prop="prodSpec" label="规格型号" min-width="120" />
            <el-table-column prop="unit" label="单位" width="80" />
            <el-table-column label="账存数量" width="120" align="right">
              <template #default="scope">
                <el-input-number v-model="scope.row.bookQty" :min="0" disabled size="small" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column label="实盘数量" width="140" align="right">
              <template #default="scope">
                <el-input-number v-model="scope.row.actualQty" :min="0" size="small" controls-position="right" @change="calcDiff(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column label="盈亏数量" width="120" align="right">
              <template #default="scope">
                <span :style="{ color: diffColor(scope.row.diffQty) }">{{ scope.row.diffQty }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="costPrice" label="成本价" width="100" align="right">
              <template #default="scope">¥{{ scope.row.costPrice.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column label="盈亏金额" width="120" align="right">
              <template #default="scope">
                <span :style="{ color: diffColor(scope.row.diffAmount) }">¥{{ scope.row.diffAmount.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="form.takeType === 2" label="操作" width="80" align="center">
              <template #default="scope">
                <el-button type="text" size="small" style="color: #ef4444" @click="removeDetail(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-if="form.details.length === 0" description="暂无盘点明细，请先选择仓库并加载账存" />

          <div class="summary-row">
            <div>产品种数：<strong>{{ form.details.length }}</strong></div>
            <div style="color: #67c23a">盘盈种数：<strong>{{ profitKinds }}</strong> 金额：¥{{ profitAmount.toFixed(2) }}</div>
            <div style="color: #f56c6c">盘亏种数：<strong>{{ lossKinds }}</strong> 金额：¥{{ lossAmount.toFixed(2) }}</div>
          </div>
        </el-card>

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
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { mockStocktakeRecords, type StocktakeRecord, type StocktakeDetail } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const id = computed(() => route.params.id as string)
const isEdit = computed(() => !!id.value)
const existingRecord = computed(() => isEdit.value ? mockStocktakeRecords.find(r => r.id === id.value) : null)

const formRef = ref<FormInstance>()

const warehouseOptions = [
  { id: '1', name: '主仓库' },
  { id: '2', name: '备用仓库' },
  { id: '3', name: '成品仓库' }
]

const productLibrary: StocktakeDetail[] = [
  { prodId: 'P1', prodName: '产品A', prodSpec: '型号A1', unit: '件', bookQty: 100, actualQty: 100, diffQty: 0, costPrice: 100, diffAmount: 0 },
  { prodId: 'P2', prodName: '产品B', prodSpec: '型号B2', unit: '件', bookQty: 50, actualQty: 50, diffQty: 0, costPrice: 500, diffAmount: 0 },
  { prodId: 'P3', prodName: '产品C', prodSpec: '型号C3', unit: '个', bookQty: 200, actualQty: 200, diffQty: 0, costPrice: 20, diffAmount: 0 },
  { prodId: 'P4', prodName: '产品D', prodSpec: '型号D4', unit: '套', bookQty: 30, actualQty: 30, diffQty: 0, costPrice: 80, diffAmount: 0 },
  { prodId: 'P5', prodName: '配件E', prodSpec: '型号E5', unit: '个', bookQty: 80, actualQty: 80, diffQty: 0, costPrice: 50, diffAmount: 0 },
  { prodId: 'P6', prodName: '配件F', prodSpec: '型号F6', unit: '个', bookQty: 60, actualQty: 60, diffQty: 0, costPrice: 30, diffAmount: 0 }
]

const today = new Date()
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

const form = reactive({
  takeDate: todayStr,
  warehouseId: '1',
  warehouseName: '主仓库',
  takeType: 1 as number,
  remark: '',
  details: [] as StocktakeDetail[]
})

const rules: FormRules = {
  takeDate: [{ required: true, message: '请选择盘点日期', trigger: 'change' }],
  warehouseId: [{ required: true, message: '请选择仓库', trigger: 'change' }],
  takeType: [{ required: true, message: '请选择盘点类型', trigger: 'change' }]
}

const profitKinds = computed(() => form.details.filter(d => d.diffQty > 0).length)
const lossKinds = computed(() => form.details.filter(d => d.diffQty < 0).length)
const profitAmount = computed(() => form.details.filter(d => d.diffAmount > 0).reduce((s, d) => s + d.diffAmount, 0))
const lossAmount = computed(() => form.details.filter(d => d.diffAmount < 0).reduce((s, d) => s + Math.abs(d.diffAmount), 0))

const diffColor = (n: number) => {
  if (n > 0) return '#67c23a'
  if (n < 0) return '#f56c6c'
  return '#909399'
}

const calcDiff = (row: StocktakeDetail) => {
  row.diffQty = row.actualQty - row.bookQty
  row.diffAmount = row.diffQty * row.costPrice
}

const handleWarehouseChange = (wid: string) => {
  const found = warehouseOptions.find(w => w.id === wid)
  form.warehouseName = found ? found.name : ''
}

const loadAllProducts = () => {
  form.details = productLibrary.map(p => ({ ...p, actualQty: p.bookQty, diffQty: 0, diffAmount: 0 }))
}

const openProductPicker = () => {
  const picked = window.prompt('请输入要盘点的产品序号（以逗号分隔，例如：1,3,5），或直接回车加载全部')
  if (picked === null) return
  if (picked.trim() === '') {
    loadAllProducts()
    return
  }
  const indexes = picked.split(/[，,]/).map(s => parseInt(s.trim(), 10)).filter(n => n >= 1 && n <= productLibrary.length)
  form.details = productLibrary.filter((_, i) => indexes.includes(i + 1)).map(p => ({ ...p, actualQty: p.bookQty, diffQty: 0, diffAmount: 0 }))
}

const removeDetail = (idx: number) => {
  form.details.splice(idx, 1)
}

const handleBack = () => router.push('/inventory/stocktake')

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  if (!form.details.length) {
    ElMessage.warning('请先加载盘点明细')
    return
  }
  if (form.details.some(d => d.actualQty === undefined || d.actualQty === null)) {
    ElMessage.warning('请完善每条明细的实盘数量')
    return
  }

  if (isEdit.value && existingRecord.value) {
    const idx = mockStocktakeRecords.findIndex(r => r.id === existingRecord.value!.id)
    if (idx !== -1) {
      mockStocktakeRecords[idx] = {
        ...mockStocktakeRecords[idx],
        takeDate: form.takeDate,
        warehouseId: form.warehouseId,
        warehouseName: form.warehouseName,
        takeType: form.takeType,
        takeTypeName: form.takeType === 1 ? '全盘' : '抽盘',
        remark: form.remark,
        totalKinds: form.details.length,
        profitKinds: profitKinds.value,
        lossKinds: lossKinds.value,
        profitAmount: profitAmount.value,
        lossAmount: lossAmount.value,
        details: JSON.parse(JSON.stringify(form.details))
      }
    }
    ElMessage.success('保存成功')
  } else {
    const newId = `ST${String(Date.now()).slice(-6)}`
    const docNo = `ST-${form.takeDate.replace(/-/g, '')}-${String(mockStocktakeRecords.length + 1).padStart(4, '0')}`
    mockStocktakeRecords.push({
      id: newId,
      docNo,
      takeDate: form.takeDate,
      warehouseId: form.warehouseId,
      warehouseName: form.warehouseName,
      takeType: form.takeType,
      takeTypeName: form.takeType === 1 ? '全盘' : '抽盘',
      status: 0,
      statusName: '盘点中',
      totalKinds: form.details.length,
      profitKinds: profitKinds.value,
      lossKinds: lossKinds.value,
      profitAmount: profitAmount.value,
      lossAmount: lossAmount.value,
      writerId: '1',
      writerName: '管理员',
      writeTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      remark: form.remark,
      details: JSON.parse(JSON.stringify(form.details)),
      relatedProfitDocNo: null,
      relatedLossDocNo: null
    })
    ElMessage.success('新增成功')
  }
  router.push('/inventory/stocktake')
}

onMounted(() => {
  if (isEdit.value && existingRecord.value) {
    const r = existingRecord.value
    form.takeDate = r.takeDate
    form.warehouseId = r.warehouseId
    form.warehouseName = r.warehouseName
    form.takeType = r.takeType
    form.remark = r.remark
    form.details = JSON.parse(JSON.stringify(r.details))
  } else {
    loadAllProducts()
  }
})
</script>

<style scoped>
.page-container { padding: 24px; }
.page-card { min-height: 400px; }
.header-content { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.form-container { max-width: 1100px; margin: 0 auto; padding: 10px 0; }
.form-row { display: flex; gap: 20px; }
.form-item { flex: 1; }
.detail-header { display: flex; justify-content: space-between; align-items: center; }
.summary-row { display: flex; gap: 30px; margin-top: 16px; padding: 12px; background: #f5f7fa; border-radius: 4px; }
</style>
