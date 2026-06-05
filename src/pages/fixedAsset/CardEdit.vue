<template>
  <div class="page-container">
    <div class="page-header">
      <h2>编辑资产卡片</h2>
      <div class="header-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <div class="page-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="基本信息" class="form-section-title">
          <el-divider />
        </el-form-item>
        
        <el-form-item label="资产编号">
          <el-input v-model="form.assetNo" disabled />
        </el-form-item>

        <el-form-item label="资产名称" prop="assetName">
          <el-input v-model="form.assetName" placeholder="请输入资产名称" />
        </el-form-item>

        <el-form-item label="资产类别" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择资产类别" :disabled="isDepreciated">
            <el-option
              v-for="cat in mockAssetCategories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="规格型号">
          <el-input v-model="form.specModel" placeholder="请输入规格型号" />
        </el-form-item>

        <el-form-item label="财务信息" class="form-section-title">
          <el-divider />
          <span v-if="isDepreciated" class="warning-text">（已计提折旧，财务信息不可修改）</span>
        </el-form-item>

        <el-form-item label="原值" prop="originalValue">
          <el-input v-model.number="form.originalValue" :disabled="isDepreciated" placeholder="请输入原值" />
        </el-form-item>

        <el-form-item label="净残值率" prop="salvageRate">
          <el-input v-model.number="form.salvageRate" :disabled="isDepreciated" placeholder="请输入净残值率" />
          <span class="input-suffix">%</span>
        </el-form-item>

        <el-form-item label="预计使用年限" prop="usefulLife">
          <el-input v-model.number="form.usefulLife" :disabled="isDepreciated" placeholder="请输入预计使用年限" />
          <span class="input-suffix">年</span>
        </el-form-item>

        <el-form-item label="月折旧额">
          <el-input v-model="monthlyDepreciation" disabled placeholder="自动计算" />
        </el-form-item>

        <el-form-item label="累计折旧">
          <el-input v-model="accumulatedDepreciation" disabled />
        </el-form-item>

        <el-form-item label="净值">
          <el-input v-model="netValue" disabled />
        </el-form-item>

        <el-form-item label="使用信息" class="form-section-title">
          <el-divider />
        </el-form-item>

        <el-form-item label="购置日期">
          <el-date-picker v-model="form.purchaseDate" type="date" :disabled="isDepreciated" placeholder="请选择购置日期" />
        </el-form-item>

        <el-form-item label="开始使用日期">
          <el-date-picker v-model="form.startDate" type="date" placeholder="请选择开始使用日期" />
        </el-form-item>

        <el-form-item label="使用部门">
          <el-select v-model="form.deptId" placeholder="请选择使用部门">
            <el-option
              v-for="dept in mockDepartments"
              :key="dept.id"
              :label="dept.name"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="使用人">
          <el-select v-model="form.staffId" placeholder="请选择使用人">
            <el-option
              v-for="staff in mockStaff"
              :key="staff.id"
              :label="staff.name"
              :value="staff.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="存放地点">
          <el-input v-model="form.location" placeholder="请输入存放地点" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="在用" :value="0" />
            <el-option label="闲置" :value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-textarea v-model="form.remark" placeholder="请输入备注" rows="3" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockFixedAssets, mockAssetCategories, mockDepartments, mockStaff } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref()
const originalAsset = ref<any>(null)

const form = ref({
  assetId: '',
  assetNo: '',
  assetName: '',
  categoryId: '',
  specModel: '',
  originalValue: 0,
  salvageRate: 5,
  usefulLife: 3,
  purchaseDate: '',
  startDate: '',
  deptId: '',
  staffId: '',
  location: '',
  status: 0,
  remark: ''
})

const rules = {
  assetName: [{ required: true, message: '请输入资产名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择资产类别', trigger: 'change' }],
  originalValue: [
    { required: true, message: '请输入原值', trigger: 'blur' },
    { type: 'number', min: 0.01, message: '原值必须大于0', trigger: 'blur' }
  ],
  salvageRate: [
    { type: 'number', min: 0, max: 100, message: '净残值率必须在0-100之间', trigger: 'blur' }
  ],
  usefulLife: [
    { required: true, message: '请输入使用年限', trigger: 'blur' },
    { type: 'number', min: 1, max: 50, message: '使用年限必须在1-50年之间', trigger: 'blur' }
  ]
}

const isDepreciated = computed(() => {
  return originalAsset.value && originalAsset.value.accumulatedDepreciation > 0
})

const accumulatedDepreciation = computed(() => {
  if (originalAsset.value) {
    return originalAsset.value.accumulatedDepreciation.toFixed(2)
  }
  return ''
})

const netValue = computed(() => {
  if (originalAsset.value) {
    return originalAsset.value.netValue.toFixed(2)
  }
  return ''
})

const monthlyDepreciation = computed(() => {
  if (form.value.originalValue && form.value.salvageRate !== undefined && form.value.usefulLife) {
    const salvageRate = form.value.salvageRate / 100
    const value = (form.value.originalValue * (1 - salvageRate)) / (form.value.usefulLife * 12)
    return value.toFixed(2)
  }
  return ''
})

onMounted(() => {
  const assetId = route.params.id as string
  originalAsset.value = mockFixedAssets.find(item => item.assetId === assetId)
  
  if (originalAsset.value) {
    form.value = {
      assetId: originalAsset.value.assetId,
      assetNo: originalAsset.value.assetNo,
      assetName: originalAsset.value.assetName,
      categoryId: originalAsset.value.categoryId,
      specModel: originalAsset.value.specModel,
      originalValue: originalAsset.value.originalValue,
      salvageRate: originalAsset.value.salvageRate * 100,
      usefulLife: originalAsset.value.usefulLife,
      purchaseDate: originalAsset.value.purchaseDate,
      startDate: originalAsset.value.startDate,
      deptId: originalAsset.value.deptId,
      staffId: originalAsset.value.staffId,
      location: originalAsset.value.location,
      status: originalAsset.value.status,
      remark: originalAsset.value.remark
    }
  }
})

const handleCancel = () => {
  router.push('/fixedAsset/card')
}

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const index = mockFixedAssets.findIndex(item => item.assetId === form.value.assetId)
      if (index !== -1) {
        const asset = mockFixedAssets[index]
        
        if (!isDepreciated.value) {
          asset.originalValue = form.value.originalValue
          asset.salvageRate = form.value.salvageRate / 100
          asset.salvageValue = form.value.originalValue * (form.value.salvageRate / 100)
          asset.usefulLife = form.value.usefulLife
          asset.monthlyDepreciation = parseFloat(monthlyDepreciation.value)
          asset.netValue = form.value.originalValue - asset.accumulatedDepreciation
          asset.purchaseDate = form.value.purchaseDate
        }
        
        asset.assetName = form.value.assetName
        asset.categoryId = form.value.categoryId
        asset.categoryName = mockAssetCategories.find(cat => cat.id === form.value.categoryId)?.name || ''
        asset.specModel = form.value.specModel
        asset.startDate = form.value.startDate || form.value.purchaseDate
        asset.deptId = form.value.deptId
        asset.deptName = mockDepartments.find(d => d.id === form.value.deptId)?.name || ''
        asset.staffId = form.value.staffId
        asset.staffName = mockStaff.find(s => s.id === form.value.staffId)?.name || ''
        asset.location = form.value.location
        asset.status = form.value.status
        asset.statusName = form.value.status === 0 ? '在用' : '闲置'
        asset.remark = form.value.remark
        
        alert('保存成功')
        router.push('/fixedAsset/card')
      }
    }
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
}

.form-section-title {
  margin-bottom: 0 !important;
}

.form-section-title .el-divider {
  margin: 0;
}

.warning-text {
  color: #e6a23c;
  font-size: 14px;
  margin-left: 8px;
}

.input-suffix {
  margin-left: 8px;
  color: #999;
}
</style>