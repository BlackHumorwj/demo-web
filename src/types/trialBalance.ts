export interface VoucherEntry {
  subjectId: number
  subjectCode: string
  direction: number
  amount: number
  summary?: string
  checkAuxiliary?: boolean
}

export interface ValidateVoucherRequest {
  voucherId?: number
  entries: VoucherEntry[]
  voucherDate: string
  ledgerId: number
  companyId: number
}

export interface ValidationMessage {
  field: string
  message: string
  level: string
}

export interface ValidateVoucherResponse {
  code: number
  msg: string
  data: {
    isBalanced: boolean
    debitTotal: number
    creditTotal: number
    difference: number
    entryCount: number
    errors: ValidationMessage[]
    warnings: ValidationMessage[]
  }
}

export interface ValidateSubjectRequest {
  subjectId: number
  subjectCode: string
  direction: number
  amount: number
  periodId: number
  ledgerId: number
  companyId: number
}

export interface ValidateSubjectResponse {
  code: number
  msg: string
  data: {
    isValid: boolean
    subjectType: number
    subjectTypeName: string
    normalBalanceDirection: number
    currentBalance: number
    newBalance: number
    isNegative: boolean
    warnings: ValidationMessage[]
  }
}

export interface CheckVoucherResponse {
  code: number
  msg: string
  data: {
    isComplete: boolean
    hasError: boolean
    hasWarning: boolean
    errorCount: number
    warningCount: number
    errors: ValidationMessage[]
    warnings: ValidationMessage[]
    canSave: boolean
  }
}

export interface TrialBalanceSubject {
  subjectCode: string
  subjectName: string
  subjectType: number
  subjectTypeName: string
  beginDebit: number
  beginCredit: number
  currentDebit: number
  currentCredit: number
  endDebit: number
  endCredit: number
}

export interface TrialBalanceTotals {
  totalBeginDebit: number
  totalBeginCredit: number
  totalCurrentDebit: number
  totalCurrentCredit: number
  totalEndDebit: number
  totalEndCredit: number
}

export interface BalanceCheck {
  beginBalance: boolean
  currentBalance: boolean
  endBalance: boolean
}

export interface TrialBalanceSheetResponse {
  code: number
  msg: string
  data: {
    periodName: string
    isBalanced: boolean
    subjects: TrialBalanceSubject[]
    totals: TrialBalanceTotals
    balanceCheck: BalanceCheck
  }
}

export interface TrialBalanceLog {
  logId: number
  voucherId?: number
  voucherCode?: string
  checkType: string
  checkResult: number
  debitTotal: number
  creditTotal: number
  difference: number
  errorCount: number
  warningCount: number
  checkUserName: string
  checkTime: string
}

export interface TrialBalanceLogsResponse {
  code: number
  msg: string
  data: {
    total: number
    pages: number
    pageNum: number
    pageSize: number
    list: TrialBalanceLog[]
  }
}

export interface BalanceRule {
  ruleId: number
  subjectType: number
  subjectTypeName: string
  subjectCodeFrom: string
  subjectCodeTo: string
  normalBalanceDirection: number
  allowNegativeBalance: number
  warningThreshold?: number
  status: number
}

export interface BalanceRulesResponse {
  code: number
  msg: string
  data: BalanceRule[]
}