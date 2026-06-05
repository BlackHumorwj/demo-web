<template>
  <div class="page-container">
    <div class="page-header">
      <h2>新增资产卡片</h2>
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
        
        <el-form-item label="资产名称" prop="assetName">
          <el-input v-model="form.assetName" placeholder="请输入资产名称" />
        </el-form-item>

        <el-form-item label="资产类别" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择资产类别" @change="handleCategoryChange">
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
        </el-form-item>

        <el-form-item label="原值" prop="originalValue">
          <el-input v-model.number="form.originalValue" placeholder="请输入原值" />
        </el-form-item>

        <el-form-item label="净残值率" prop="salvageRate">
          <el-input v-model.number="form.salvageRate" placeholder="请输入净残值率" />
          <span class="input-suffix">%</span>
        </el-form-item>

        <el-form-item label="预计使用年限" prop="usefulLife">
          <el-input v-model.number="form.usefulLife" placeholder="请输入预计使用年限" />
          <span class="input-suffix">年</span>
        </el-form-item>

        <el-form-item label="月折旧额">
          <el-input v-model="monthlyDepreciation" disabled placeholder="自动计算" />
        </el-form-item>

        <el-form-item label="预计净残值">
          <el-input v-model="salvageValue" disabled placeholder="自动计算" />
        </el-form-item>

        <el-form-item label="使用信息" class="form-section-title">
          <el-divider />
        </el-form-item>

        <el-form-item label="购置日期" prop="purchaseDate">
          <el-date-picker v-model="form.purchaseDate" type="date" placeholder="请选择购置日期" />
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

        <el-form-item label="备注">
          <el-textarea v-model="form.remark" placeholder="请输入备注" rows="3" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockFixedAssets, mockAssetCategories, mockDepartments, mockStaff } from '@/data/mockData'

const router = useRouter()

const formRef = ref()

const form = ref({
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
  ],
  purchaseDate: [{ required: true, message: '请选择购置日期', trigger: 'change' }]
}

const monthlyDepreciation = computed(() => {
  if (form.value.originalValue && form.value.salvageRate !== undefined && form.value.usefulLife) {
    const salvageRate = form.value.salvageRate / 100
    const value = (form.value.originalValue * (1 - salvageRate)) / (form.value.usefulLife * 12)
    return value.toFixed(2)
  }
  return ''
})

const salvageValue = computed(() => {
  if (form.value.originalValue && form.value.salvageRate !== undefined) {
    const value = form.value.originalValue * (form.value.salvageRate / 100)
    return value.toFixed(2)
  }
  return ''
})

const handleCategoryChange = (categoryId: string) => {
  const category = mockAssetCategories.find(cat => cat.id === categoryId)
  if (category) {
    form.value.usefulLife = category.defaultLife
    form.value.salvageRate = category.defaultSalvageRate * 100
  }
}

const handleCancel = () => {
  router.push('/fixedAsset/card')
}

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const now = new Date()
      const dateStr = now.toISOString().split('T')[0]
      const timeStr = now.toTimeString().split(' ')[0]
      
      const newAsset = {
        assetId: String(mockFixedAssets.length + 1),
        assetNo: `GDZC-${dateStr.replace(/-/g, '')}-${String(mockFixedAssets.length + 1).padStart(4, '0')}`,
        assetName: form.value.assetName,
        categoryId: form.value.categoryId,
        categoryName: mockAssetCategories.find(cat => cat.id === form.value.categoryId)?.name || '',
        specModel: form.value.specModel,
        originalValue: form.value.originalValue,
        salvageRate: form.value.salvageRate / 100,
        salvageValue: form.value.originalValue * (form.value.salvageRate / 100),
        usefulLife: form.value.usefulLife,
        monthlyDepreciation: parseFloat(monthlyDepreciation.value),
        accumulatedDepreciation: 0,
        netValue: form.value.originalValue,
        purchaseDate: form.value.purchaseDate,
        startDate: form.value.startDate || form.value.purchaseDate,
        deptId: form.value.deptId,
        deptName: mockDepartments.find(d => d.id === form.value.deptId)?.name || '',
        staffId: form.value.staffId,
        staffName: mockStaff.find(s => s.id === form.value.staffId)?.name || '',
        location: form.value.location,
        status: 0,
        statusName: '在用',
        remark: form.value.remark,
        createTime: `${dateStr} ${timeStr}`
      }
      
      mockFixedAssets.push(newAsset)
      alert('保存成功')
      router.push('/fixedAsset/card')
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

.input-suffix {
  margin-left: 8px;
  color: #999;
}
</style>