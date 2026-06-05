<template>
  <div class="page-container">
    <div class="page-header">
      <h2>新增资产处置</h2>
      <div class="header-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <div class="page-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="资产选择" prop="assetId">
          <el-select v-model="form.assetId" placeholder="请选择资产" @change="handleAssetChange">
            <el-option
              v-for="asset in availableAssets"
              :key="asset.assetId"
              :label="`${asset.assetNo} - ${asset.assetName}`"
              :value="asset.assetId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="处置方式" prop="disposalType">
          <el-select v-model="form.disposalType" placeholder="请选择处置方式">
            <el-option label="报废" :value="1" />
            <el-option label="出售" :value="2" />
            <el-option label="盘亏" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="处置日期" prop="disposalDate">
          <el-date-picker v-model="form.disposalDate" type="date" placeholder="请选择处置日期" />
        </el-form-item>

        <el-form-item label="账面净值">
          <el-input v-model="bookValue" disabled />
        </el-form-item>

        <el-form-item label="处置收入" prop="disposalAmount">
          <el-input v-model.number="form.disposalAmount" placeholder="请输入处置收入" />
        </el-form-item>

        <el-form-item label="处置损益">
          <el-input v-model="gainLoss" disabled :class="gainLossClass" />
        </el-form-item>

        <el-form-item label="处置原因">
          <el-textarea v-model="form.disposalReason" placeholder="请输入处置原因" rows="3" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockAssetDisposals, mockFixedAssets } from '@/data/mockData'

const router = useRouter()

const formRef = ref()

const form = ref({
  assetId: '',
  disposalType: 1,
  disposalDate: '',
  disposalAmount: 0,
  disposalReason: ''
})

const bookValue = ref('0.00')
const selectedAsset = ref<typeof mockFixedAssets[0] | null>(null)

const disposalTypeNames: Record<number, string> = {
  1: '报废',
  2: '出售',
  3: '盘亏'
}

const rules = {
  assetId: [{ required: true, message: '请选择资产', trigger: 'change' }],
  disposalType: [{ required: true, message: '请选择处置方式', trigger: 'change' }],
  disposalDate: [{ required: true, message: '请选择处置日期', trigger: 'change' }]
}

const availableAssets = computed(() => {
  return mockFixedAssets.filter(asset => asset.status !== 2)
})

const gainLoss = computed(() => {
  const disposalAmount = form.value.disposalAmount || 0
  const bookVal = parseFloat(bookValue.value.replace(/,/g, ''))
  const loss = disposalAmount - bookVal
  return loss >= 0 ? `+${loss.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` : loss.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
})

const gainLossClass = computed(() => {
  const disposalAmount = form.value.disposalAmount || 0
  const bookVal = parseFloat(bookValue.value.replace(/,/g, ''))
  return disposalAmount >= bookVal ? 'text-green' : 'text-red'
})

const handleAssetChange = () => {
  const asset = mockFixedAssets.find(a => a.assetId === form.value.assetId)
  if (asset) {
    selectedAsset.value = asset
    bookValue.value = asset.netValue.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
  }
}

const handleCancel = () => {
  router.push('/fixedAsset/disposal')
}

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    
    if (!selectedAsset.value) {
      alert('请选择资产')
      return
    }
    
    const now = new Date()
    const dateStr = now.toISOString().split('T')[0]
    const bookVal = parseFloat(bookValue.value.replace(/,/g, ''))
    const disposalAmount = form.value.disposalAmount || 0
    const gainLossAmount = disposalAmount - bookVal
    
    const newDisposal = {
      disposalId: String(mockAssetDisposals.length + 1),
      bizDocId: String(mockAssetDisposals.length + 1),
      bizDocNo: `CZ-${dateStr.replace(/-/g, '')}-${String(mockAssetDisposals.length + 1).padStart(4, '0')}`,
      disposalDate: form.value.disposalDate,
      disposalType: form.value.disposalType,
      disposalTypeName: disposalTypeNames[form.value.disposalType] || '其他',
      assetId: selectedAsset.value.assetId,
      assetNo: selectedAsset.value.assetNo,
      assetName: selectedAsset.value.assetName,
      originalValue: selectedAsset.value.originalValue,
      accumulatedDepreciation: selectedAsset.value.accumulatedDepreciation,
      netValue: bookVal,
      disposalAmount: disposalAmount,
      gainLossAmount: gainLossAmount,
      accountId: '',
      accountName: '',
      disposalReason: form.value.disposalReason,
      remark: '',
      voucherId: '',
      voucherNo: ''
    }
    
    mockAssetDisposals.push(newDisposal)
    
    const assetIndex = mockFixedAssets.findIndex(a => a.assetId === form.value.assetId)
    if (assetIndex !== -1) {
      mockFixedAssets[assetIndex].status = 2
      mockFixedAssets[assetIndex].statusName = '已处置'
    }
    
    alert('保存成功')
    router.push('/fixedAsset/disposal')
  })
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.page-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
  width: 600px;
}

.text-green {
  color: #67c23a;
}

.text-red {
  color: #f56c6c;
}
</style>