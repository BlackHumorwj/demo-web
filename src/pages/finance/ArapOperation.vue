<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-bar">
          <el-button type="text" icon="ArrowLeft" @click="goBack">返回</el-button>
          <span>{{ pageTitle }}</span>
        </div>
      </template>

      <!-- 收款/付款表单 -->
      <div v-if="operationType === 'receipt'" class="form-container">
        <el-form :model="formData" label-width="120px">
          <el-card class="form-card">
            <template #header>
              <span>基础信息</span>
            </template>
            <el-form-item label="业务日期" required>
              <el-date-picker v-model="formData.tradeTime" type="date" placeholder="请选择业务日期" />
            </el-form-item>
            <el-form-item label="往来单位" required>
              <el-select v-model="formData.bizContactId" placeholder="请选择往来单位" disabled>
                <el-option v-for="contact in contactOptions" :key="contact.value" :label="contact.label" :value="contact.value" />
              </el-select>
              <span class="form-value">{{ currentContactName }}</span>
            </el-form-item>
            <el-form-item label="收/付款账户" required>
              <el-select v-model="formData.accountId" placeholder="请选择账户">
                <el-option v-for="account in accountOptions" :key="account.value" :label="account.label" :value="account.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="业务员">
              <el-select v-model="formData.staffId" placeholder="请选择业务员">
                <el-option v-for="staff in staffOptions" :key="staff.value" :label="staff.label" :value="staff.value" />
              </el-select>
            </el-form-item>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>核销明细</span>
              <span class="item-count">共 {{ formData.items.length }} 条</span>
            </template>
            <el-table :data="formData.items" border>
              <el-table-column label="选择" width="60">
                <template #default="scope">
                  <el-checkbox v-model="scope.row.selected" @change="updateTotalAmount" />
                </template>
              </el-table-column>
              <el-table-column prop="arapId" label="挂账ID" width="100" />
              <el-table-column prop="tradeTime" label="挂账日期" />
              <el-table-column prop="amount" label="挂账金额">
                <template #default="scope">¥ {{ formatNumber(scope.row.amount) }}</template>
              </el-table-column>
              <el-table-column prop="balance" label="剩余金额">
                <template #default="scope">¥ {{ formatNumber(scope.row.balance) }}</template>
              </el-table-column>
              <el-table-column prop="writeOffAmount" label="本次核销金额">
                <template #default="scope">
                  <el-input-number 
                    v-model="scope.row.writeOffAmount" 
                    :min="0" 
                    :max="scope.row.balance" 
                    :disabled="!scope.row.selected"
                    step="0.01" 
                    @change="updateTotalAmount"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>金额信息</span>
            </template>
            <div class="amount-row">
              <span class="amount-label">应收付金额：</span>
              <span class="amount-value">¥ {{ formatNumber(formData.totalAmount) }}</span>
            </div>
            <div class="amount-row">
              <span class="amount-label">已冲销金额：</span>
              <span class="amount-value">¥ {{ formatNumber(formData.offsetAmount) }}</span>
            </div>
            <div class="amount-row">
              <span class="amount-label">本次核销金额：</span>
              <span class="amount-value highlight">¥ {{ formatNumber(formData.amount) }}</span>
            </div>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>备注信息</span>
            </template>
            <el-form-item label="备注">
              <el-input v-model="formData.remark" type="textarea" :maxlength="256" placeholder="请输入备注（最多256字）" />
            </el-form-item>
          </el-card>
        </el-form>
      </div>

      <!-- 核销表单 -->
      <div v-else-if="operationType === 'writeOff'" class="form-container">
        <el-form :model="formData" label-width="120px">
          <el-card class="form-card">
            <template #header>
              <span>挂账明细</span>
            </template>
            <el-descriptions :column="2" border v-if="currentArap">
              <el-descriptions-item label="挂账ID">{{ currentArap.arapId }}</el-descriptions-item>
              <el-descriptions-item label="挂账类型">{{ currentArap.arapTypeName }}</el-descriptions-item>
              <el-descriptions-item label="往来单位">{{ currentArap.bizContactName }}</el-descriptions-item>
              <el-descriptions-item label="挂账日期">{{ currentArap.tradeTime }}</el-descriptions-item>
              <el-descriptions-item label="挂账金额">
                <span class="amount-highlight">¥ {{ formatNumber(currentArap.amount) }}</span>
              </el-descriptions-item>
              <el-descriptions-item label="已冲销金额">¥ {{ formatNumber(currentArap.offsetAmount) }}</el-descriptions-item>
              <el-descriptions-item label="可冲销金额" :span="2">
                <span class="amount-available">¥ {{ formatNumber(currentArap.balance) }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>基础信息</span>
            </template>
            <el-form-item label="业务日期" required>
              <el-date-picker v-model="formData.tradeTime" type="date" placeholder="请选择业务日期" />
            </el-form-item>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>{{ writeOffTypeInfo.sourceLabel }}</span>
              <span style="font-size: 12px; color: #6b7280;">（仅支持单选）</span>
            </template>
            <el-table :data="formData.sourceItems" border @row-click="handleSourceRowClick">
              <el-table-column prop="arapId" label="挂账ID" />
              <el-table-column prop="tradeTime" label="挂账日期" />
              <el-table-column prop="amount" label="金额">
                <template #default="scope">¥ {{ formatNumber(scope.row.amount) }}</template>
              </el-table-column>
              <el-table-column prop="balance" label="余额">
                <template #default="scope">¥ {{ formatNumber(scope.row.balance) }}</template>
              </el-table-column>
              <el-table-column prop="writeOffAmount" label="冲销金额">
                <template #default="scope">
                  <el-input-number 
                    v-model="scope.row.writeOffAmount" 
                    :min="0" 
                    :max="scope.row.balance" 
                    :disabled="!scope.row.selected"
                    step="0.01" 
                  />
                </template>
              </el-table-column>
              <el-table-column label="选择" width="60">
                <template #default="scope">
                  <el-radio 
                    v-model="formData.sourceSelectedId" 
                    :value="scope.row.arapId" 
                    @change="handleSourceRadioChange(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>{{ writeOffTypeInfo.targetLabel }}</span>
            </template>
            <el-table :data="formData.targetItems" border>
              <el-table-column prop="arapId" label="挂账ID" />
              <el-table-column prop="tradeTime" label="挂账日期" />
              <el-table-column prop="amount" label="金额">
                <template #default="scope">¥ {{ formatNumber(scope.row.amount) }}</template>
              </el-table-column>
              <el-table-column prop="balance" label="余额">
                <template #default="scope">¥ {{ formatNumber(scope.row.balance) }}</template>
              </el-table-column>
              <el-table-column prop="writeOffAmount" label="冲销金额">
                <template #default="scope">
                  <el-input-number v-model="scope.row.writeOffAmount" :min="0" :max="scope.row.balance" step="0.01" />
                </template>
              </el-table-column>
              <el-table-column label="选择">
                <template #default="scope">
                  <el-checkbox v-model="scope.row.selected" />
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-form>
      </div>

      <!-- 转账表单 -->
      <div v-else-if="operationType === 'transfer'" class="form-container">
        <el-form :model="formData" label-width="120px">
          <el-card class="form-card">
            <template #header>
              <span>转账信息</span>
            </template>
            <el-form-item label="业务日期" required>
              <el-date-picker v-model="formData.tradeTime" type="date" placeholder="请选择业务日期" />
            </el-form-item>
            <el-form-item label="目标科目" required>
              <el-select v-model="formData.categoryId" placeholder="请选择目标科目">
                <el-option v-for="category in categoryOptions" :key="category.value" :label="category.label" :value="category.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="转出原因">
              <el-input v-model="formData.reason" placeholder="请输入转出原因" />
            </el-form-item>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>挂账明细</span>
              <span class="item-count">共 {{ formData.items.length }} 条</span>
            </template>
            <el-table :data="formData.items" border>
              <el-table-column label="选择" width="60">
                <template #default="scope">
                  <el-checkbox v-model="scope.row.selected" @change="updateTransferAmount" />
                </template>
              </el-table-column>
              <el-table-column prop="arapId" label="挂账ID" width="100" />
              <el-table-column prop="tradeTime" label="挂账日期" />
              <el-table-column prop="bizContactName" label="往来单位" />
              <el-table-column prop="amount" label="挂账金额">
                <template #default="scope">¥ {{ formatNumber(scope.row.amount) }}</template>
              </el-table-column>
              <el-table-column prop="balance" label="剩余金额">
                <template #default="scope">¥ {{ formatNumber(scope.row.balance) }}</template>
              </el-table-column>
              <el-table-column prop="writeOffAmount" label="本次转账金额">
                <template #default="scope">
                  <el-input-number 
                    v-model="scope.row.writeOffAmount" 
                    :min="0" 
                    :max="scope.row.balance" 
                    :disabled="!scope.row.selected"
                    step="0.01" 
                    @change="updateTransferAmount"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>金额信息</span>
            </template>
            <div class="amount-row">
              <span class="amount-label">可转账金额：</span>
              <span class="amount-value">¥ {{ formatNumber(formData.availableAmount) }}</span>
            </div>
            <div class="amount-row">
              <span class="amount-label">本次转账金额：</span>
              <span class="amount-value highlight">¥ {{ formatNumber(formData.amount) }}</span>
            </div>
          </el-card>
        </el-form>
      </div>

      <!-- 转销表单 -->
      <div v-else-if="operationType === 'transferOff'" class="form-container">
        <el-form :model="formData" label-width="120px">
          <el-card class="form-card">
            <template #header>
              <span>转销信息</span>
            </template>
            <el-form-item label="业务日期" required>
              <el-date-picker v-model="formData.tradeTime" type="date" placeholder="请选择业务日期" />
            </el-form-item>
            <el-form-item label="目标往来单位" required>
              <el-select v-model="formData.targetBizContactId" placeholder="请选择目标往来单位">
                <el-option v-for="contact in contactOptions" :key="contact.value" :label="contact.label" :value="contact.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="转销原因">
              <el-input v-model="formData.reason" type="textarea" placeholder="请输入转销原因" />
            </el-form-item>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>挂账明细</span>
              <span class="item-count">共 {{ formData.items.length }} 条</span>
            </template>
            <el-table :data="formData.items" border>
              <el-table-column label="选择" width="60">
                <template #default="scope">
                  <el-checkbox v-model="scope.row.selected" @change="updateTransferOffAmount" />
                </template>
              </el-table-column>
              <el-table-column prop="arapId" label="挂账ID" width="100" />
              <el-table-column prop="tradeTime" label="挂账日期" />
              <el-table-column prop="amount" label="挂账金额">
                <template #default="scope">¥ {{ formatNumber(scope.row.amount) }}</template>
              </el-table-column>
              <el-table-column prop="balance" label="剩余金额">
                <template #default="scope">¥ {{ formatNumber(scope.row.balance) }}</template>
              </el-table-column>
              <el-table-column prop="writeOffAmount" label="本次转销金额">
                <template #default="scope">
                  <el-input-number 
                    v-model="scope.row.writeOffAmount" 
                    :min="0" 
                    :max="scope.row.balance" 
                    :disabled="!scope.row.selected"
                    step="0.01" 
                    @change="updateTransferOffAmount"
                  />
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <el-card class="form-card">
            <template #header>
              <span>金额信息</span>
            </template>
            <div class="amount-row">
              <span class="amount-label">可转销金额：</span>
              <span class="amount-value">¥ {{ formatNumber(formData.availableAmount) }}</span>
            </div>
            <div class="amount-row">
              <span class="amount-label">本次转销金额：</span>
              <span class="amount-value highlight">¥ {{ formatNumber(formData.amount) }}</span>
            </div>
          </el-card>
        </el-form>
      </div>

      <!-- 转换表单 -->
      <div v-else-if="operationType === 'convert'" class="form-container">
        <el-form :model="formData" label-width="120px">
          <el-card class="form-card">
            <template #header>
              <span>基础信息</span>
            </template>
            <el-form-item label="业务日期" required>
              <el-date-picker v-model="formData.tradeTime" type="date" placeholder="请选择业务日期" />
            </el-form-item>
            <el-form-item label="往来单位" required>
              <el-select v-model="formData.bizContactId" placeholder="请选择往来单位" disabled>
                <el-option v-for="contact in contactOptions" :key="contact.value" :label="contact.label" :value="contact.value" />
              </el-select>
              <span class="form-value">{{ currentContactName }}</span>
            </el-form-item>
            <el-form-item label="转换金额" required>
              <el-input-number v-model="formData.amount" :min="0.01" :max="Math.max(formData.availableAmount, 0.01)" step="0.01" />
              <span class="available-hint">（最大可转换：¥ {{ formatNumber(formData.availableAmount) }}）</span>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="formData.remark" type="textarea" :maxlength="256" placeholder="请输入备注（最多256字）" />
            </el-form-item>
          </el-card>
        </el-form>
      </div>

      <!-- 操作按钮 -->
      <div class="form-actions">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mockContacts, mockArapList, mockAccounts, mockStaff, mockCategories, arapOperations } from '@/data/mockData'

const route = useRoute()
const router = useRouter()

const operationType = ref('receipt')
const arapId = ref(0)
const currentArap = ref<any>(null)

const contactOptions = computed(() => 
  mockContacts.map(c => ({ value: c.id, label: c.name }))
)

const accountOptions = computed(() => 
  mockAccounts.map(a => ({ value: a.id, label: a.name }))
)

const staffOptions = computed(() => 
  mockStaff.map(s => ({ value: s.id, label: s.name }))
)

const categoryOptions = computed(() => 
  mockCategories.map(c => ({ value: c.id, label: c.name }))
)

const currentContactName = computed(() => {
  const contact = mockContacts.find(c => c.id === formData.bizContactId)
  return contact?.name || ''
})

const pageTitle = computed(() => {
  const operationCode = currentArap.value?.currentOperation?.code
  
  if (operationCode) {
    for (const operations of Object.values(arapOperations)) {
      const operation = operations.find(op => op.code === operationCode)
      if (operation) {
        return operation.label
      }
    }
  }
  
  const titles: Record<string, string> = {
    'receipt': '收付款',
    'writeOff': '往来款核销',
    'transfer': '转账',
    'transferOff': '往来款转销',
    'convert': '转换'
  }
  return titles[operationType.value] || '业务操作'
})

const writeOffTypeInfo = computed(() => {
  const typeInfo: Record<string, { sourceLabel: string; targetLabel: string; sourceType: number; targetType: number }> = {
    'writeOff_ar_ap': { sourceLabel: '应收款挂账', targetLabel: '应付款挂账', sourceType: 1, targetType: 2 },
    'writeOff_ap_ar': { sourceLabel: '应付款挂账', targetLabel: '应收款挂账', sourceType: 2, targetType: 1 },
    'writeOff_ar_pre': { sourceLabel: '应收款挂账', targetLabel: '预收款挂账', sourceType: 1, targetType: 3 },
    'writeOff_ap_prepay': { sourceLabel: '应付款挂账', targetLabel: '预付款挂账', sourceType: 2, targetType: 4 },
    'writeOff_pre_ar': { sourceLabel: '预收款挂账', targetLabel: '应收款挂账', sourceType: 3, targetType: 1 },
    'writeOff_pre_prepay': { sourceLabel: '预收款挂账', targetLabel: '预付款挂账', sourceType: 3, targetType: 4 },
    'writeOff_prepay_ap': { sourceLabel: '预付款挂账', targetLabel: '应付款挂账', sourceType: 4, targetType: 2 },
    'writeOff_prepay_pre': { sourceLabel: '预付款挂账', targetLabel: '预收款挂账', sourceType: 4, targetType: 3 },
    'writeOff_borrowed_ar': { sourceLabel: '借入款挂账', targetLabel: '应收款挂账', sourceType: 5, targetType: 1 },
    'writeOff_borrowed_ap': { sourceLabel: '借入款挂账', targetLabel: '应付款挂账', sourceType: 5, targetType: 2 },
    'writeOff_loaned_ar': { sourceLabel: '借出款挂账', targetLabel: '应收款挂账', sourceType: 6, targetType: 1 },
    'writeOff_loaned_ap': { sourceLabel: '借出款挂账', targetLabel: '应付款挂账', sourceType: 6, targetType: 2 }
  }
  return typeInfo[currentArap.value?.currentOperation?.code] || { sourceLabel: '挂账明细', targetLabel: '对冲挂账', sourceType: 1, targetType: 2 }
})

const formData = reactive({
  tradeTime: new Date(),
  bizContactId: '',
  accountId: '',
  staffId: '',
  categoryId: '',
  sourceBizContactId: '',
  targetBizContactId: '',
  amount: 0,
  reason: '',
  remark: '',
  totalAmount: 0,
  offsetAmount: 0,
  availableAmount: 0,
  sourceSelectedId: 0,
  targetSelectedId: 0,
  items: [] as any[],
  arItems: [] as any[],
  apItems: [] as any[],
  sourceItems: [] as any[],
  targetItems: [] as any[]
})

const formatNumber = (num: number) => {
  return num.toFixed(2)
}

const updateTotalAmount = () => {
  formData.amount = formData.items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.writeOffAmount || 0), 0)
}

const updateTransferAmount = () => {
  formData.amount = formData.items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.writeOffAmount || 0), 0)
}

const updateTransferOffAmount = () => {
  formData.amount = formData.items
    .filter(item => item.selected)
    .reduce((sum, item) => sum + (item.writeOffAmount || 0), 0)
}

const handleSourceRowClick = (row: any) => {
  formData.sourceSelectedId = row.arapId
  handleSourceRadioChange(row)
}

const handleSourceRadioChange = (row: any) => {
  formData.sourceItems.forEach(item => {
    item.selected = item.arapId === row.arapId
    if (item.selected) {
      item.writeOffAmount = item.balance
    } else {
      item.writeOffAmount = 0
    }
  })
}

const addItem = () => {
  formData.items.push({
    arapId: 0,
    tradeTime: new Date(),
    amount: 0,
    offsetAmount: 0,
    balance: 0,
    writeOffAmount: 0
  })
}

const removeItem = (index: number) => {
  formData.items.splice(index, 1)
  updateTotalAmount()
}

const loadData = () => {
  const arap = mockArapList.find(a => a.arapId === Number(arapId.value))
  if (arap) {
    currentArap.value = arap
    formData.bizContactId = arap.bizContactId
    formData.sourceBizContactId = arap.bizContactId
    formData.totalAmount = arap.amount
    formData.offsetAmount = arap.offsetAmount
    formData.availableAmount = arap.balance

    if (operationType.value === 'receipt') {
      const sameContactItems = mockArapList.filter(
        a => a.bizContactId === arap.bizContactId && a.arapType === arap.arapType && a.status === 0 && a.balance > 0
      )
      formData.items = sameContactItems.map(a => ({
        arapId: a.arapId,
        tradeTime: a.tradeTime,
        amount: a.amount,
        offsetAmount: a.offsetAmount,
        balance: a.balance,
        writeOffAmount: a.arapId === arap.arapId ? a.balance : 0,
        selected: a.arapId === arap.arapId
      }))
      formData.availableAmount = sameContactItems.reduce((sum, a) => sum + a.balance, 0)
      updateTotalAmount()
    } else if (operationType.value === 'writeOff') {
      const info = writeOffTypeInfo.value
      
      formData.sourceItems = mockArapList
        .filter(a => a.arapType === info.sourceType && a.bizContactId === arap.bizContactId && a.status === 0 && a.balance > 0)
        .map(a => ({ arapId: a.arapId, tradeTime: a.tradeTime, amount: a.amount, balance: a.balance, writeOffAmount: a.arapId === arap.arapId ? a.balance : 0, selected: a.arapId === arap.arapId }))
      
      formData.targetItems = mockArapList
        .filter(a => a.arapType === info.targetType && a.status === 0 && a.balance > 0)
        .map(a => ({ arapId: a.arapId, tradeTime: a.tradeTime, amount: a.amount, balance: a.balance, writeOffAmount: 0, selected: false }))
      
      const defaultSourceItem = formData.sourceItems.find(item => item.selected)
      if (defaultSourceItem) {
        formData.sourceSelectedId = defaultSourceItem.arapId
      }
    } else if (operationType.value === 'transfer') {
      const sameContactItems = mockArapList.filter(
        a => a.bizContactId === arap.bizContactId && a.arapType === arap.arapType && a.status === 0 && a.balance > 0
      )
      formData.items = sameContactItems.map(a => ({
        arapId: a.arapId,
        tradeTime: a.tradeTime,
        bizContactName: a.bizContactName,
        amount: a.amount,
        balance: a.balance,
        writeOffAmount: a.arapId === arap.arapId ? a.balance : 0,
        selected: a.arapId === arap.arapId
      }))
      formData.availableAmount = sameContactItems.reduce((sum, a) => sum + a.balance, 0)
      updateTransferAmount()
    } else if (operationType.value === 'transferOff') {
      const sameContactItems = mockArapList.filter(
        a => a.bizContactId === arap.bizContactId && a.arapType === arap.arapType && a.status === 0 && a.balance > 0
      )
      formData.items = sameContactItems.map(a => ({
        arapId: a.arapId,
        tradeTime: a.tradeTime,
        amount: a.amount,
        balance: a.balance,
        writeOffAmount: a.arapId === arap.arapId ? a.balance : 0,
        selected: a.arapId === arap.arapId
      }))
      formData.availableAmount = sameContactItems.reduce((sum, a) => sum + a.balance, 0)
      updateTransferOffAmount()
    }
  }
}

const goBack = () => {
  router.push('/finance/receivable')
}

const submitForm = () => {
  console.log('提交表单:', formData)
  ElMessage.success('操作成功')
  router.push('/finance/receivable')
}

onMounted(() => {
  operationType.value = String(route.params.operationType) || 'receipt'
  const operationCode = String(route.params.operationCode) || ''
  arapId.value = Number(route.params.arapId) || 0
  
  const arap = mockArapList.find(a => a.arapId === arapId.value)
  if (arap) {
    arap.currentOperation = { code: operationCode }
  }
  
  loadData()
})
</script>

<style scoped>
.page-container {
  padding: 20px;
  min-height: 500px;
}

.page-card {
  min-height: 400px;
}

.header-bar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-container {
  padding: 10px 0;
}

.form-card {
  margin-bottom: 16px;
}

.form-card:deep(.el-card__header) {
  padding: 12px 16px;
  background-color: #f9fafb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-count {
  font-size: 12px;
  color: #6b7280;
}

.form-value {
  margin-left: 12px;
  color: #1f2937;
  font-weight: 500;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.amount-label {
  color: #6b7280;
}

.amount-value {
  font-weight: 500;
}

.amount-value.highlight {
  color: #22c55e;
  font-size: 18px;
}

.add-row {
  margin-top: 12px;
  text-align: right;
}

.available-hint {
  margin-left: 8px;
  color: #6b7280;
  font-size: 12px;
}

.amount-highlight {
  color: #1f2937;
  font-weight: 600;
  font-size: 16px;
}

.amount-available {
  color: #22c55e;
  font-weight: 700;
  font-size: 18px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 0;
}
</style>