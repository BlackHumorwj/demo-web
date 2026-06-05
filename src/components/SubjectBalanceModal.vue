<template>
  <el-dialog
    :title="isEdit ? '编辑科目余额' : '新增科目余额'"
    :visible="visible"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="账本" prop="ledgerId">
        <el-select v-model="form.ledgerId" placeholder="请选择账本">
          <el-option label="主账本" :value="1" />
          <el-option label="备用账本" :value="2" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="公司" prop="companyId">
        <el-select v-model="form.companyId" placeholder="请选择公司">
          <el-option label="示例科技有限公司" :value="101" />
          <el-option label="创新贸易有限公司" :value="102" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="科目" prop="subjectId">
        <el-select v-model="form.subjectId" placeholder="请选择会计科目" @change="handleSubjectChange">
          <el-option label="库存现金(1001)" :value="1001" :data-type="1" />
          <el-option label="银行存款(1002)" :value="1002" :data-type="1" />
          <el-option label="应收账款(1122)" :value="1122" :data-type="1" />
          <el-option label="固定资产(1601)" :value="1601" :data-type="1" />
          <el-option label="累计折旧(1602)" :value="1602" :data-type="1" />
          <el-option label="短期借款(2001)" :value="2001" :data-type="2" />
          <el-option label="应付账款(2202)" :value="2202" :data-type="2" />
          <el-option label="实收资本(3001)" :value="3001" :data-type="3" />
          <el-option label="主营业务收入(6001)" :value="6001" :data-type="5" />
          <el-option label="管理费用(6602)" :value="6602" :data-type="5" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="期间" prop="periodId">
        <el-select v-model="form.periodId" placeholder="请选择会计期间">
          <el-option label="2024年04月" :value="202404" />
          <el-option label="2024年05月" :value="202405" />
          <el-option label="2024年06月" :value="202406" />
        </el-select>
      </el-form-item>
      
      <el-form-item v-if="showBeginDebit" label="期初借方" prop="beginDebit">
        <el-input v-model.number="form.beginDebit" type="number" placeholder="请输入期初借方余额" />
      </el-form-item>
      
      <el-form-item v-if="showBeginCredit" label="期初贷方" prop="beginCredit">
        <el-input v-model.number="form.beginCredit" type="number" placeholder="请输入期初贷方余额" />
      </el-form-item>
      
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" rows="3" />
      </el-form-item>
      
      <div v-if="showBalancePreview" class="balance-preview">
        <el-divider content-position="left">余额计算预览</el-divider>
        <div class="preview-item">
          <span>期末借方余额：</span>
          <span class="preview-value">{{ endDebit.toFixed(2) }}</span>
        </div>
        <div class="preview-item">
          <span>期末贷方余额：</span>
          <span class="preview-value">{{ endCredit.toFixed(2) }}</span>
        </div>
      </div>
    </el-form>
    
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CreateSubjectBalanceRequest, UpdateSubjectBalanceRequest } from '@/types/subjectBalance'

const props = defineProps<{
  visible: boolean
  isEdit: boolean
  editData?: any
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: CreateSubjectBalanceRequest | UpdateSubjectBalanceRequest, isEdit: boolean, balanceId?: number): void
}>()

const formRef = ref()

const form = ref({
  ledgerId: 1,
  companyId: 101,
  subjectId: 0,
  periodId: 0,
  beginDebit: 0,
  beginCredit: 0,
  remark: ''
})

const currentSubjectType = ref(1)

const showBeginDebit = computed(() => [1, 4].includes(currentSubjectType.value))
const showBeginCredit = computed(() => [2, 3, 5].includes(currentSubjectType.value))
const showBalancePreview = computed(() => form.value.subjectId > 0)

const endDebit = computed(() => {
  if (showBeginDebit.value) {
    return form.value.beginDebit || 0
  }
  return 0
})

const endCredit = computed(() => {
  if (showBeginCredit.value) {
    return form.value.beginCredit || 0
  }
  return 0
})

const rules = {
  ledgerId: [{ required: true, message: '请选择账本', trigger: 'change' }],
  companyId: [{ required: true, message: '请选择公司', trigger: 'change' }],
  subjectId: [{ required: true, message: '请选择会计科目', trigger: 'change' }],
  periodId: [{ required: true, message: '请选择会计期间', trigger: 'change' }],
  beginDebit: [
    { required: showBeginDebit.value, message: '请输入期初借方余额', trigger: 'blur' },
    { validator: (rule: any, value: number) => value >= 0, message: '期初借方余额必须为非负数', trigger: 'blur' }
  ],
  beginCredit: [
    { required: showBeginCredit.value, message: '请输入期初贷方余额', trigger: 'blur' },
    { validator: (rule: any, value: number) => value >= 0, message: '期初贷方余额必须为非负数', trigger: 'blur' }
  ]
}

const handleSubjectChange = (value: number) => {
  const subjects: Record<number, number> = {
    1001: 1, 1002: 1, 1122: 1, 1601: 1, 1602: 1,
    2001: 2, 2202: 2,
    3001: 3,
    6001: 5, 6602: 5
  }
  currentSubjectType.value = subjects[value] || 1
  form.value.beginDebit = 0
  form.value.beginCredit = 0
}

watch(() => props.visible, (val) => {
  if (val) {
    if (props.isEdit && props.editData) {
      form.value = {
        ledgerId: props.editData.ledgerId || 1,
        companyId: props.editData.companyId || 101,
        subjectId: props.editData.subjectId || 0,
        periodId: props.editData.periodId || 0,
        beginDebit: props.editData.beginDebit || 0,
        beginCredit: props.editData.beginCredit || 0,
        remark: props.editData.remark || ''
      }
      handleSubjectChange(form.value.subjectId)
    } else {
      form.value = {
        ledgerId: 1,
        companyId: 101,
        subjectId: 0,
        periodId: 0,
        beginDebit: 0,
        beginCredit: 0,
        remark: ''
      }
      currentSubjectType.value = 1
    }
  }
})

const handleClose = () => {
  emit('close')
}

const handleSubmit = () => {
  if (!formRef.value) return
  
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      const data: CreateSubjectBalanceRequest = {
        ledgerId: form.value.ledgerId,
        companyId: form.value.companyId,
        subjectId: form.value.subjectId,
        periodId: form.value.periodId,
        remark: form.value.remark
      }
      
      if (showBeginDebit.value) {
        data.beginDebit = form.value.beginDebit
      } else if (showBeginCredit.value) {
        data.beginCredit = form.value.beginCredit
      }
      
      emit('submit', data, props.isEdit, props.editData?.balanceId)
    }
  })
}
</script>

<style scoped>
.balance-preview {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.preview-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.preview-value {
  font-weight: bold;
  color: #1890ff;
}
</style>
