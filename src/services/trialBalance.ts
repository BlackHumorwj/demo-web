import type {
  ValidateVoucherRequest,
  ValidateVoucherResponse,
  ValidateSubjectRequest,
  ValidateSubjectResponse,
  CheckVoucherResponse,
  TrialBalanceSheetResponse,
  TrialBalanceLogsResponse,
  BalanceRulesResponse
} from '@/types/trialBalance'

const BASE_URL = '/api/trial-balance'

const mockValidateVoucherResponse: ValidateVoucherResponse = {
  code: 0,
  msg: '校验通过',
  data: {
    isBalanced: true,
    debitTotal: 10000.00,
    creditTotal: 10000.00,
    difference: 0.00,
    entryCount: 2,
    errors: [],
    warnings: []
  }
}

const mockValidateSubjectResponse: ValidateSubjectResponse = {
  code: 0,
  msg: '校验通过',
  data: {
    isValid: true,
    subjectType: 1,
    subjectTypeName: '资产类',
    normalBalanceDirection: 1,
    currentBalance: 45000.00,
    newBalance: 50000.00,
    isNegative: false,
    warnings: []
  }
}

const mockCheckVoucherResponse: CheckVoucherResponse = {
  code: 0,
  msg: '检查完成',
  data: {
    isComplete: true,
    hasError: false,
    hasWarning: false,
    errorCount: 0,
    warningCount: 0,
    errors: [],
    warnings: [],
    canSave: true
  }
}

const mockTrialBalanceSheetResponse: TrialBalanceSheetResponse = {
  code: 0,
  msg: '查询成功',
  data: {
    periodName: '2026年03月',
    isBalanced: true,
    subjects: [
      {
        subjectCode: '1001',
        subjectName: '库存现金',
        subjectType: 1,
        subjectTypeName: '资产类',
        beginDebit: 5000.00,
        beginCredit: 0.00,
        currentDebit: 10000.00,
        currentCredit: 8000.00,
        endDebit: 7000.00,
        endCredit: 0.00
      },
      {
        subjectCode: '1002',
        subjectName: '银行存款',
        subjectType: 1,
        subjectTypeName: '资产类',
        beginDebit: 500000.00,
        beginCredit: 0.00,
        currentDebit: 200000.00,
        currentCredit: 150000.00,
        endDebit: 550000.00,
        endCredit: 0.00
      },
      {
        subjectCode: '2001',
        subjectName: '短期借款',
        subjectType: 2,
        subjectTypeName: '负债类',
        beginDebit: 0.00,
        beginCredit: 200000.00,
        currentDebit: 50000.00,
        currentCredit: 0.00,
        endDebit: 0.00,
        endCredit: 150000.00
      },
      {
        subjectCode: '3001',
        subjectName: '实收资本',
        subjectType: 3,
        subjectTypeName: '权益类',
        beginDebit: 0.00,
        beginCredit: 305000.00,
        currentDebit: 0.00,
        currentCredit: 100000.00,
        endDebit: 0.00,
        endCredit: 405000.00
      },
      {
        subjectCode: '6001',
        subjectName: '主营业务收入',
        subjectType: 5,
        subjectTypeName: '损益类',
        beginDebit: 0.00,
        beginCredit: 0.00,
        currentDebit: 0.00,
        currentCredit: 150000.00,
        endDebit: 0.00,
        endCredit: 150000.00
      },
      {
        subjectCode: '6602',
        subjectName: '管理费用',
        subjectType: 5,
        subjectTypeName: '损益类',
        beginDebit: 0.00,
        beginCredit: 0.00,
        currentDebit: 48000.00,
        currentCredit: 0.00,
        endDebit: 48000.00,
        endCredit: 0.00
      }
    ],
    totals: {
      totalBeginDebit: 505000.00,
      totalBeginCredit: 505000.00,
      totalCurrentDebit: 448000.00,
      totalCurrentCredit: 448000.00,
      totalEndDebit: 605000.00,
      totalEndCredit: 605000.00
    },
    balanceCheck: {
      beginBalance: true,
      currentBalance: true,
      endBalance: true
    }
  }
}

const mockTrialBalanceLogsResponse: TrialBalanceLogsResponse = {
  code: 0,
  msg: '查询成功',
  data: {
    total: 15,
    pages: 1,
    pageNum: 1,
    pageSize: 20,
    list: [
      {
        logId: 1,
        voucherId: 1001,
        voucherCode: '记-202603-001',
        checkType: 'VOUCHER_SAVE',
        checkResult: 1,
        debitTotal: 10000.00,
        creditTotal: 10000.00,
        difference: 0.00,
        errorCount: 0,
        warningCount: 1,
        checkUserName: '张三',
        checkTime: '2026-03-18 10:30:00'
      },
      {
        logId: 2,
        voucherId: 1002,
        voucherCode: '记-202603-002',
        checkType: 'VOUCHER_SAVE',
        checkResult: 1,
        debitTotal: 50000.00,
        creditTotal: 50000.00,
        difference: 0.00,
        errorCount: 0,
        warningCount: 0,
        checkUserName: '李四',
        checkTime: '2026-03-18 11:15:00'
      },
      {
        logId: 3,
        voucherId: 1003,
        voucherCode: '记-202603-003',
        checkType: 'MANUAL',
        checkResult: 0,
        debitTotal: 20000.00,
        creditTotal: 18000.00,
        difference: 2000.00,
        errorCount: 1,
        warningCount: 0,
        checkUserName: '张三',
        checkTime: '2026-03-18 14:00:00'
      }
    ]
  }
}

const mockBalanceRulesResponse: BalanceRulesResponse = {
  code: 0,
  msg: '查询成功',
  data: [
    {
      ruleId: 1,
      subjectType: 1,
      subjectTypeName: '资产类',
      subjectCodeFrom: '1001',
      subjectCodeTo: '1901',
      normalBalanceDirection: 1,
      allowNegativeBalance: 0,
      status: 1
    },
    {
      ruleId: 2,
      subjectType: 2,
      subjectTypeName: '负债类',
      subjectCodeFrom: '2001',
      subjectCodeTo: '2901',
      normalBalanceDirection: 2,
      allowNegativeBalance: 0,
      status: 1
    },
    {
      ruleId: 3,
      subjectType: 3,
      subjectTypeName: '权益类',
      subjectCodeFrom: '3001',
      subjectCodeTo: '3901',
      normalBalanceDirection: 2,
      allowNegativeBalance: 0,
      status: 1
    },
    {
      ruleId: 4,
      subjectType: 4,
      subjectTypeName: '成本类',
      subjectCodeFrom: '4001',
      subjectCodeTo: '4901',
      normalBalanceDirection: 1,
      allowNegativeBalance: 0,
      status: 1
    },
    {
      ruleId: 5,
      subjectType: 5,
      subjectTypeName: '损益类',
      subjectCodeFrom: '5001',
      subjectCodeTo: '6901',
      normalBalanceDirection: 1,
      allowNegativeBalance: 1,
      status: 1
    }
  ]
}

const useMock = true

export async function validateVoucher(request: ValidateVoucherRequest): Promise<ValidateVoucherResponse> {
  if (useMock) {
    const debitTotal = request.entries
      .filter(e => e.direction === 1)
      .reduce((sum, e) => sum + e.amount, 0)
    const creditTotal = request.entries
      .filter(e => e.direction === 2)
      .reduce((sum, e) => sum + e.amount, 0)
    const difference = Math.abs(debitTotal - creditTotal)
    
    return {
      ...mockValidateVoucherResponse,
      data: {
        ...mockValidateVoucherResponse.data,
        isBalanced: difference < 0.01,
        debitTotal,
        creditTotal,
        difference,
        entryCount: request.entries.length,
        errors: request.entries.length < 2 ? [{ field: 'entries', message: '凭证至少需要2条分录', level: 'ERROR' }] : [],
        warnings: request.entries.some(e => !e.summary) ? [{ field: 'summary', message: '建议补充分录摘要', level: 'WARNING' }] : []
      }
    }
  }
  
  const response = await fetch(`${BASE_URL}/validate-voucher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  return response.json()
}

export async function validateSubject(request: ValidateSubjectRequest): Promise<ValidateSubjectResponse> {
  if (useMock) {
    const isNegative = request.direction === 1 
      ? request.amount > mockValidateSubjectResponse.data.currentBalance
      : false
    
    return {
      ...mockValidateSubjectResponse,
      data: {
        ...mockValidateSubjectResponse.data,
        isNegative,
        newBalance: mockValidateSubjectResponse.data.currentBalance + request.amount
      }
    }
  }
  
  const response = await fetch(`${BASE_URL}/validate-subject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  return response.json()
}

export async function checkVoucher(request: ValidateVoucherRequest): Promise<CheckVoucherResponse> {
  if (useMock) {
    const hasError = request.entries.length < 2
    const hasWarning = request.entries.some(e => !e.summary)
    
    return {
      ...mockCheckVoucherResponse,
      data: {
        ...mockCheckVoucherResponse.data,
        isComplete: !hasError,
        hasError,
        hasWarning,
        errorCount: hasError ? 1 : 0,
        warningCount: hasWarning ? 1 : 0,
        errors: hasError ? [{ field: 'entries', message: '凭证至少需要2条分录', level: 'ERROR' }] : [],
        warnings: hasWarning ? [{ field: 'summary', message: '建议补充分录摘要', level: 'WARNING' }] : [],
        canSave: !hasError
      }
    }
  }
  
  const response = await fetch(`${BASE_URL}/check-voucher`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  return response.json()
}

export async function getTrialBalanceSheet(params: {
  periodId: number
  ledgerId: number
  companyId: number
  subjectLevel?: number
  subjectType?: number
  includeUnposted?: boolean
}): Promise<TrialBalanceSheetResponse> {
  if (useMock) {
    let subjects = [...mockTrialBalanceSheetResponse.data.subjects]
    
    if (params.subjectType) {
      subjects = subjects.filter(s => s.subjectType === params.subjectType)
    }
    
    const totals = subjects.reduce((acc, s) => ({
      totalBeginDebit: acc.totalBeginDebit + s.beginDebit,
      totalBeginCredit: acc.totalBeginCredit + s.beginCredit,
      totalCurrentDebit: acc.totalCurrentDebit + s.currentDebit,
      totalCurrentCredit: acc.totalCurrentCredit + s.currentCredit,
      totalEndDebit: acc.totalEndDebit + s.endDebit,
      totalEndCredit: acc.totalEndCredit + s.endCredit
    }), {
      totalBeginDebit: 0,
      totalBeginCredit: 0,
      totalCurrentDebit: 0,
      totalCurrentCredit: 0,
      totalEndDebit: 0,
      totalEndCredit: 0
    })
    
    return {
      ...mockTrialBalanceSheetResponse,
      data: {
        ...mockTrialBalanceSheetResponse.data,
        subjects,
        totals,
        isBalanced: Math.abs(totals.totalEndDebit - totals.totalEndCredit) < 0.01,
        balanceCheck: {
          beginBalance: Math.abs(totals.totalBeginDebit - totals.totalBeginCredit) < 0.01,
          currentBalance: Math.abs(totals.totalCurrentDebit - totals.totalCurrentCredit) < 0.01,
          endBalance: Math.abs(totals.totalEndDebit - totals.totalEndCredit) < 0.01
        }
      }
    }
  }
  
  const url = new URL(`${BASE_URL}/sheet`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })
  
  const response = await fetch(url.toString())
  return response.json()
}

export async function getTrialBalanceLogs(params: {
  voucherId?: number
  periodId?: number
  checkType?: string
  checkResult?: number
  startDate?: string
  endDate?: string
  pageNum?: number
  pageSize?: number
}): Promise<TrialBalanceLogsResponse> {
  if (useMock) {
    let list = [...mockTrialBalanceLogsResponse.data.list]
    
    if (params.checkResult !== undefined) {
      list = list.filter(l => l.checkResult === params.checkResult)
    }
    
    return {
      ...mockTrialBalanceLogsResponse,
      data: {
        ...mockTrialBalanceLogsResponse.data,
        list,
        total: list.length,
        pages: 1
      }
    }
  }
  
  const url = new URL(`${BASE_URL}/logs`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })
  
  const response = await fetch(url.toString())
  return response.json()
}

export async function getBalanceRules(params: {
  subjectType?: number
  status?: number
}): Promise<BalanceRulesResponse> {
  if (useMock) {
    let data = [...mockBalanceRulesResponse.data]
    
    if (params.subjectType) {
      data = data.filter(r => r.subjectType === params.subjectType)
    }
    if (params.status !== undefined) {
      data = data.filter(r => r.status === params.status)
    }
    
    return {
      ...mockBalanceRulesResponse,
      data
    }
  }
  
  const url = new URL(`${BASE_URL}/rules`)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })
  
  const response = await fetch(url.toString())
  return response.json()
}