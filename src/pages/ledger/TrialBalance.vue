<template>
  <div class="trial-balance-page">
    <div class="page-header">
      <h1>科目试算平衡表</h1>
      <div class="action-buttons">
        <el-button type="primary" @click="handleExport" :disabled="!sheetData">
          <el-icon><Download /></el-icon>
          导出 Excel
        </el-button>
        <el-button @click="handlePrint" :disabled="!sheetData">
          <el-icon><Printer /></el-icon>
          打印
        </el-button>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" model="searchForm" class="search-form">
        <el-form-item label="会计期间">
          <el-date-picker
            v-model="searchForm.period"
            type="month"
            format="yyyy-MM"
            placeholder="选择月份"
            @change="handlePeriodChange"
          />
        </el-form-item>
        <el-form-item label="科目级别">
          <el-select v-model="searchForm.subjectLevel" placeholder="全部级别">
            <el-option :label="'全部'" :value="0" />
            <el-option :label="'1级'" :value="1" />
            <el-option :label="'2级'" :value="2" />
            <el-option :label="'3级'" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="科目类型">
          <el-select v-model="searchForm.subjectType" placeholder="全部类型">
            <el-option :label="'全部'" :value="0" />
            <el-option :label="'资产类'" :value="1" />
            <el-option :label="'负债类'" :value="2" />
            <el-option :label="'权益类'" :value="3" />
            <el-option :label="'成本类'" :value="4" />
            <el-option :label="'损益类'" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="searchForm.includeUnposted">包含未记账凭证</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div v-if="sheetData" class="summary-section">
      <el-card class="summary-card" :class="{ balanced: sheetData.isBalanced, unbalanced: !sheetData.isBalanced }">
        <div class="card-header">
          <span class="period-title">{{ sheetData.periodName }}</span>
          <span class="balance-status">
            <el-tag :type="sheetData.isBalanced ? 'success' : 'danger'" size="large">
              <el-icon><CircleCheck v-if="sheetData.isBalanced" /><CircleClose v-else /></el-icon>
              {{ sheetData.isBalanced ? '试算平衡' : '试算不平衡' }}
            </el-tag>
          </span>
        </div>
        <div class="card-content">
          <div class="summary-row">
            <span class="label">期初借方</span>
            <span class="amount">¥ {{ formatAmount(sheetData.totals.totalBeginDebit) }}</span>
          </div>
          <div class="summary-row">
            <span class="label">期初贷方</span>
            <span class="amount">¥ {{ formatAmount(sheetData.totals.totalBeginCredit) }}</span>
          </div>
          <div class="summary-row">
            <span class="label">本期借方</span>
            <span class="amount debit">¥ {{ formatAmount(sheetData.totals.totalCurrentDebit) }}</span>
          </div>
          <div class="summary-row">
            <span class="label">本期贷方</span>
            <span class="amount credit">¥ {{ formatAmount(sheetData.totals.totalCurrentCredit) }}</span>
          </div>
          <div class="summary-row">
            <span class="label">期末借方</span>
            <span class="amount">¥ {{ formatAmount(sheetData.totals.totalEndDebit) }}</span>
          </div>
          <div class="summary-row">
            <span class="label">期末贷方</span>
            <span class="amount">¥ {{ formatAmount(sheetData.totals.totalEndCredit) }}</span>
          </div>
        </div>
        <div class="balance-indicators">
          <div class="indicator" :class="{ success: sheetData.balanceCheck.beginBalance }">
            <el-icon><Check v-if="sheetData.balanceCheck.beginBalance" /><Close v-else /></el-icon>
            <span>期初平衡</span>
          </div>
          <div class="indicator" :class="{ success: sheetData.balanceCheck.currentBalance }">
            <el-icon><Check v-if="sheetData.balanceCheck.currentBalance" /><Close v-else /></el-icon>
            <span>本期平衡</span>
          </div>
          <div class="indicator" :class="{ success: sheetData.balanceCheck.endBalance }">
            <el-icon><Check v-if="sheetData.balanceCheck.endBalance" /><Close v-else /></el-icon>
            <span>期末平衡</span>
          </div>
        </div>
      </el-card>
    </div>

    <el-card v-if="sheetData" class="table-card">
      <template #header>
        <span>科目明细</span>
      </template>
      <el-table
        :data="sheetData.subjects"
        border
        stripe
        class="trial-balance-table"
        :show-summary="true"
        :summary-method="getSummary"
      >
        <el-table-column
          prop="subjectCode"
          label="科目代码"
          width="100"
        />
        <el-table-column
          prop="subjectName"
          label="科目名称"
          width="200"
        />
        <el-table-column
          prop="subjectTypeName"
          label="科目类型"
          width="100"
        />
        <el-table-column
          prop="beginDebit"
          label="期初借方"
          width="130"
          align="right"
          :formatter="formatMoney"
        />
        <el-table-column
          prop="beginCredit"
          label="期初贷方"
          width="130"
          align="right"
          :formatter="formatMoney"
        />
        <el-table-column
          prop="currentDebit"
          label="本期借方"
          width="130"
          align="right"
          :formatter="formatMoney"
        />
        <el-table-column
          prop="currentCredit"
          label="本期贷方"
          width="130"
          align="right"
          :formatter="formatMoney"
        />
        <el-table-column
          prop="endDebit"
          label="期末借方"
          width="130"
          align="right"
          :formatter="formatMoney"
        />
        <el-table-column
          prop="endCredit"
          label="期末贷方"
          width="130"
          align="right"
          :formatter="formatMoney"
        />
      </el-table>
    </el-card>

    <div v-if="!sheetData" class="empty-state">
      <el-empty description="请选择会计期间进行查询" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Download, Printer, CircleCheck, CircleClose, Check, Close } from '@element-plus/icons-vue'
import { getTrialBalanceSheet } from '@/services/trialBalance'
import type { TrialBalanceSheetResponse } from '@/types/trialBalance'

const searchForm = reactive({
  period: '',
  subjectLevel: 0,
  subjectType: 0,
  includeUnposted: false
})

const sheetData = ref<TrialBalanceSheetResponse['data'] | null>(null)

const formatAmount = (amount: number): string => {
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatMoney = (_: unknown, { property }: { property: string }) => {
  const value = (sheetData.value?.subjects[0]?.[property as keyof typeof sheetData.value.subjects[0]] as number) || 0
  return `¥ ${formatAmount(value)}`
}

const getSummary = (param: { columns: unknown[]; data: unknown[] }) => {
  if (!sheetData.value) return []
  const { totals } = sheetData.value
  const sums: string[] = []
  param.columns.forEach((_, index) => {
    if (index === 0) {
      sums.push('合计')
    } else if (index === 1) {
      sums.push('')
    } else if (index === 2) {
      sums.push('')
    } else {
      const keys = ['totalBeginDebit', 'totalBeginCredit', 'totalCurrentDebit', 'totalCurrentCredit', 'totalEndDebit', 'totalEndCredit']
      const key = keys[index - 3] as keyof typeof totals
      sums.push(`¥ ${formatAmount(totals[key])}`)
    }
  })
  return sums
}

const handlePeriodChange = async () => {
  if (searchForm.period) {
    await handleSearch()
  }
}

const handleSearch = async () => {
  if (!searchForm.period) {
    return
  }
  
  const periodId = parseInt(searchForm.period.replace('-', ''))
  
  try {
    const response = await getTrialBalanceSheet({
      periodId,
      ledgerId: 1,
      companyId: 101,
      subjectLevel: searchForm.subjectLevel || undefined,
      subjectType: searchForm.subjectType || undefined,
      includeUnposted: searchForm.includeUnposted
    })
    
    if (response.code === 0) {
      sheetData.value = response.data
    }
  } catch (error) {
    console.error('查询试算平衡表失败:', error)
  }
}

const handleReset = () => {
  searchForm.period = ''
  searchForm.subjectLevel = 0
  searchForm.subjectType = 0
  searchForm.includeUnposted = false
  sheetData.value = null
}

const handleExport = () => {
  if (!sheetData.value) return
  
  let csvContent = '科目代码,科目名称,科目类型,期初借方,期初贷方,本期借方,本期贷方,期末借方,期末贷方\n'
  
  sheetData.value.subjects.forEach(subject => {
    csvContent += `${subject.subjectCode},${subject.subjectName},${subject.subjectTypeName},${subject.beginDebit},${subject.beginCredit},${subject.currentDebit},${subject.currentCredit},${subject.endDebit},${subject.endCredit}\n`
  })
  
  csvContent += `合计,,,${sheetData.value.totals.totalBeginDebit},${sheetData.value.totals.totalBeginCredit},${sheetData.value.totals.totalCurrentDebit},${sheetData.value.totals.totalCurrentCredit},${sheetData.value.totals.totalEndDebit},${sheetData.value.totals.totalEndCredit}\n`
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `试算平衡表_${searchForm.period}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handlePrint = () => {
  window.print()
}
</script>

<style scoped>
.trial-balance-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 20px;
}

.summary-section {
  margin-bottom: 20px;
}

.summary-card {
  max-width: 600px;
  border-left: 4px solid #67C23A;
}

.summary-card.unbalanced {
  border-left-color: #F56C6C;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #EBEEF5;
}

.period-title {
  font-size: 20px;
  font-weight: bold;
}

.card-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.summary-row .label {
  color: #606266;
}

.summary-row .amount {
  font-weight: 600;
}

.summary-row .debit {
  color: #F56C6C;
}

.summary-row .credit {
  color: #67C23A;
}

.balance-indicators {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #EBEEF5;
}

.indicator {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #909399;
}

.indicator.success {
  color: #67C23A;
}

.table-card {
  margin-bottom: 20px;
}

.trial-balance-table {
  width: 100%;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .search-form {
    flex-wrap: wrap;
  }
  
  .card-content {
    grid-template-columns: 1fr;
  }
}
</style>