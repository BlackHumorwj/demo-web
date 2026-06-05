export interface SubjectBalanceItem {
  balanceId: number
  ledgerName: string
  companyName: string
  subjectName: string
  subjectCode: string
  subjectType: number
  periodName: string
  beginDebit: number
  beginCredit: number
  currentDebit: number
  currentCredit: number
  endDebit: number
  endCredit: number
  status: number
  updateTime: string
}

export interface OperationLog {
  logId: number
  operType: string
  operUser: string
  operTime: string
  content: string
}

export interface RelatedInfo {
  subjectName: string
  subjectType: number
  periodStatus: number
  periodName: string
}

export interface SubjectBalanceDetail {
  balanceId: number
  ledgerId: number
  ledgerName: string
  companyId: number
  companyName: string
  subjectId: number
  subjectCode: string
  subjectName: string
  subjectType: number
  periodId: number
  periodName: string
  beginDebit: number
  beginCredit: number
  currentDebit: number
  currentCredit: number
  endDebit: number
  endCredit: number
  remark: string
  status: number
  creatorName: string
  createTime: string
  updaterName: string
  updateTime: string
  relatedInfo: RelatedInfo
  operationLogs: OperationLog[]
}

export interface SubjectBalanceSummary {
  totalBeginDebit: number
  totalBeginCredit: number
  totalEndDebit: number
  totalEndCredit: number
}

export interface SubjectBalanceListResponse {
  code: number
  msg: string
  data: {
    total: number
    page: number
    pageSize: number
    list: SubjectBalanceItem[]
    summary: SubjectBalanceSummary
  }
}

export interface SubjectBalanceDetailResponse {
  code: number
  msg: string
  data: SubjectBalanceDetail
}

export interface CreateSubjectBalanceRequest {
  ledgerId: number
  companyId: number
  subjectId: number
  periodId: number
  beginDebit?: number
  beginCredit?: number
  remark?: string
}

export interface UpdateSubjectBalanceRequest {
  ledgerId: number
  companyId: number
  beginDebit?: number
  beginCredit?: number
  remark?: string
}

export interface DeleteSubjectBalanceRequest {
  balanceId: number
  ledgerId: number
  companyId: number
  deleteReason: string
}

export interface CreateSubjectBalanceResponse {
  code: number
  msg: string
  data: {
    balanceId: number
    endDebit: number
    endCredit: number
    createTime: string
  }
}

export interface UpdateSubjectBalanceResponse {
  code: number
  msg: string
  data: {
    balanceId: number
    endDebit: number
    endCredit: number
    updateTime: string
  }
}

export interface RestoreSubjectBalanceResponse {
  code: number
  msg: string
  data: {
    balanceId: number
    status: number
    restoreTime: string
  }
}

export interface DeleteSubjectBalanceResponse {
  code: number
  msg: string
  data: null
}
