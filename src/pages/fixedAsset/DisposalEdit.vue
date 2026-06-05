<template>
  <div class="page-container">
    <div class="page-header">
      <h2>编辑资产处置</h2>
      <div class="header-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <div class="page-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="处置单号">
          <el-input v-model="form.bizDocNo" disabled />
        </el-form-item>

        <el-form-item label="资产信息">
          <el-input v-model="assetInfo" disabled />
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
          <el-input v-model="form.netValueStr" disabled />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockAssetDisposals } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref()
const disposalId = ref('')

const disposalTypeNames: Record<number, string> = {
  1: '报废',
  2: '出售',
  3: '盘亏'
}

const form = ref({
  bizDocNo: '',
  disposalType: 1,
  disposalDate: '',
  disposalAmount: 0,
  disposalReason: '',
  netValueStr: '0.00'
})

const assetInfo = ref('')

const rules = {
  disposalType: [{ required: true, message: '请选择处置方式', trigger: 'change' }],
  disposalDate: [{ required: true, message: '请选择处置日期', trigger: 'change' }]
}

const gainLoss = computed(() => {
  const disposalAmount = form.value.disposalAmount || 0
  const bookVal = parseFloat(form.value.netValueStr.replace(/,/g, ''))
  const loss = disposalAmount - bookVal
  return loss >= 0 ? `+${loss.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` : loss.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
})

const gainLossClass = computed(() => {
  const disposalAmount = form.value.disposalAmount || 0
  const bookVal = parseFloat(form.value.netValueStr.replace(/,/g, ''))
  return disposalAmount >= bookVal ? 'text-green' : 'text-red'
})

const handleCancel = () => {
  router.push('/fixedAsset/disposal')
}

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    
    const disposalIndex = mockAssetDisposals.findIndex(item => item.disposalId === disposalId.value)
    if (disposalIndex !== -1) {
      const bookVal = parseFloat(form.value.netValueStr.replace(/,/g, ''))
      const disposalAmount = form.value.disposalAmount || 0
      const gainLossAmount = disposalAmount - bookVal
      
      mockAssetDisposals[disposalIndex] = {
        ...mockAssetDisposals[disposalIndex],
        disposalType: form.value.disposalType,
        disposalTypeName: disposalTypeNames[form.value.disposalType] || '其他',
        disposalDate: form.value.disposalDate,
        disposalAmount: disposalAmount,
        gainLossAmount: gainLossAmount,
        disposalReason: form.value.disposalReason
      }
      
      alert('保存成功')
      router.push('/fixedAsset/disposal')
    }
  })
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    disposalId.value = id as string
    const disposal = mockAssetDisposals.find(item => item.disposalId === id)
    if (disposal) {
      form.value = {
        bizDocNo: disposal.bizDocNo,
        disposalType: disposal.disposalType,
        disposalDate: disposal.disposalDate,
        disposalAmount: disposal.disposalAmount,
        disposalReason: disposal.disposalReason || '',
        netValueStr: disposal.netValue.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
      }
      
      assetInfo.value = `${disposal.assetNo} - ${disposal.assetName}`
    }
  }
})
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