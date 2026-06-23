<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑产品</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="120px"
        class="form-container"
      >
        <el-form-item label="产品名称" prop="productName">
          <el-input
            v-model="form.productName"
            placeholder="请输入产品名称"
            style="width: 400px"
            maxlength="255"
            :disabled="isDeleted"
          />
          <span class="input-tip">最多255个字符</span>
        </el-form-item>
        <el-form-item label="规格型号" prop="specification">
          <el-input
            v-model="form.specification"
            placeholder="请输入规格型号（可选）"
            style="width: 400px"
            maxlength="255"
            :disabled="isDeleted"
          />
          <span class="input-tip">最多255个字符</span>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select
            v-model="form.unit"
            placeholder="请选择单位"
            filterable
            style="width: 400px"
            :disabled="isDeleted"
          >
            <el-option
              v-for="u in unitOptions"
              :key="u.id"
              :label="`${u.unitName}（${u.unitSymbol}）`"
              :value="u.unitName"
            />
          </el-select>
          <span class="input-tip">可在「产品单位」中维护</span>
        </el-form-item>
        <el-form-item label="成本价" prop="costPrice">
          <el-input-number
            v-model="form.costPrice"
            :min="0.0001"
            :precision="4"
            :step="10"
            style="width: 400px"
            :disabled="isDeleted"
          />
        </el-form-item>
        <el-form-item label="收入类别" prop="incomeCategoryId">
          <el-select
            v-model="form.incomeCategoryId"
            placeholder="请选择收入类别"
            style="width: 400px"
            :disabled="isDeleted"
          >
            <el-option
              v-for="item in incomeCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="成本类别" prop="costCategoryId">
          <el-select
            v-model="form.costCategoryId"
            placeholder="请选择成本类别"
            style="width: 400px"
            :disabled="isDeleted"
          >
            <el-option
              v-for="item in costCategories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="产品分组" prop="productGroupId">
          <el-select
            v-model="form.productGroupId"
            placeholder="请选择产品分组（可选）"
            clearable
            style="width: 400px"
            :disabled="isDeleted"
          >
            <el-option
              v-for="item in productGroups"
              :key="item.id"
              :label="item.groupName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="期初库存" prop="initialStock">
          <el-input-number
            v-model="form.initialStock"
            :min="0"
            style="width: 400px"
            :disabled="isDeleted"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入备注信息（可选）"
            style="width: 400px"
            :rows="3"
            maxlength="500"
            :disabled="isDeleted"
          />
          <span class="input-tip">最多500个字符</span>
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
import { mockCategories, mockProductsDetail, mockProjectGroups, mockUnits } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()

const incomeCategories = computed(() => mockCategories.filter(item => item.type === 1))
const costCategories = computed(() => mockCategories.filter(item => item.type === 2))
const productGroups = computed(() => mockProjectGroups)
const unitOptions = computed(() => mockUnits.filter(u => u.status === 0))

const form = reactive({
  id: '',
  productName: '',
  specification: '',
  unit: '',
  costPrice: 0.0001,
  incomeCategoryId: '',
  costCategoryId: '',
  productGroupId: '' as string | null,
  initialStock: 0,
  remark: '',
  status: 0
})

const isDeleted = computed(() => form.status !== 0)

const rules: FormRules = {
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  costPrice: [{ required: true, message: '请输入成本价', trigger: 'blur' }],
  incomeCategoryId: [{ required: true, message: '请选择收入类别', trigger: 'change' }],
  costCategoryId: [{ required: true, message: '请选择成本类别', trigger: 'change' }],
  initialStock: [{ required: true, message: '请输入期初库存', trigger: 'blur' }]
}

const handleBack = () => {
  router.push('/settings/product')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const index = mockProductsDetail.findIndex(item => item.id === form.id)
  if (index !== -1) {
    const incomeCategory = mockCategories.find(item => item.id === form.incomeCategoryId)
    const costCategory = mockCategories.find(item => item.id === form.costCategoryId)
    const productGroup = mockProjectGroups.find(item => item.id === form.productGroupId)

    mockProductsDetail[index] = {
      ...mockProductsDetail[index],
      productName: form.productName,
      specification: form.specification,
      unit: form.unit,
      costPrice: Number(form.costPrice),
      incomeCategoryId: form.incomeCategoryId,
      incomeCategoryName: incomeCategory?.name || '',
      costCategoryId: form.costCategoryId,
      costCategoryName: costCategory?.name || '',
      productGroupId: form.productGroupId,
      productGroupName: productGroup?.groupName || '',
      initialStock: Number(form.initialStock),
      remark: form.remark
    }
  }

  router.push('/settings/product')
}

onMounted(() => {
  const id = route.params.id as string
  const product = mockProductsDetail.find(item => item.id === id)
  if (product) {
    form.id = product.id
    form.productName = product.productName
    form.specification = product.specification || ''
    form.unit = product.unit
    form.costPrice = Number(product.costPrice)
    form.incomeCategoryId = product.incomeCategoryId
    form.costCategoryId = product.costCategoryId
    form.productGroupId = product.productGroupId
    form.initialStock = Number(product.initialStock)
    form.remark = product.remark || ''
    form.status = product.status
  } else {
    router.push('/settings/product')
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
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 0;
}

.input-tip {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
