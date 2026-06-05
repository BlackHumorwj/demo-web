export interface SalaryAccruedVO {
  bizDocId: number
  bizDocNo: string
  bizDocType: number
  salaryPeriod: string
  tradeTime: string
  grossAmount: number
  taxAmount: number
  otherAmount: number
  amount: number
  docStatus: number
  docStatusName: string
  remark: string
  writerName: string
  writerTime: string
  items: SalaryAccruedItemVO[]
  voucher?: VoucherVO
  issueInfo?: IssueInfoVO
}

export interface SalaryAccruedItemVO {
  itemId: number
  staffId: number
  staffName: string
  deptId: number
  deptName: string
  categoryId: number
  categoryName: string
  baseSalary: number
  positionAllowance: number
  performanceBonus: number
  otherSubsidy: number
  grossAmount: number
  socialSecurity: number
  housingFund: number
  personalTax: number
  otherDeduction: number
  deductionTotal: number
  netAmount: number
  remark: string
}

export interface SalaryIssueVO {
  bizDocId: number
  bizDocNo: string
  bizDocType: number
  salaryPeriod: string
  accruedId: number
  accruedNo: string
  accountId: number
  accountName: string
  tradeTime: string
  amount: number
  docStatus: number
  docStatusName: string
  remark: string
  writerName: string
  writerTime: string
  items: SalaryIssueItemVO[]
  voucher?: VoucherVO
}

export interface SalaryIssueItemVO {
  itemId: number
  staffId: number
  staffName: string
  deptId: number
  deptName: string
  netAmount: number
  accruedAmount: number
  remark: string
}

export interface AccruedForIssueVO {
  bizDocId: number
  bizDocNo: string
  salaryPeriod: string
  tradeTime: string
  grossAmount: number
  amount: number
  issuedAmount: number
  remainAmount: number
  staffCount: number
}

export interface VoucherVO {
  voucherId: number
  voucherCode: string
  voucherDate: string
  amount: number
}

export interface IssueInfoVO {
  issueCount: number
  issuedAmount: number
}

export interface SalaryAccruedListVO {
  bizDocId: number
  bizDocNo: string
  salaryPeriod: string
  tradeTime: string
  grossAmount: number
  amount: number
  staffCount: number
  docStatus: number
  docStatusName: string
  writerName: string
  writerTime: string
}

export interface SalaryIssueListVO {
  bizDocId: number
  bizDocNo: string
  salaryPeriod: string
  accruedNo: string
  accountName: string
  tradeTime: string
  amount: number
  staffCount: number
  docStatus: number
  docStatusName: string
  writerName: string
  writerTime: string
}

export interface SalaryAccruedCreateDTO {
  salaryPeriod: string
  tradeTime: string
  remark?: string
  items?: SalaryAccruedItemCreateDTO[]
}

export interface SalaryAccruedItemCreateDTO {
  staffId: number
  categoryId: number
  baseSalary: number
  positionAllowance?: number
  performanceBonus?: number
  otherSubsidy?: number
  socialSecurity?: number
  housingFund?: number
  personalTax?: number
  otherDeduction?: number
  remark?: string
}

export interface SalaryIssueCreateDTO {
  salaryPeriod: string
  accruedId?: number
  accountId: number
  tradeTime: string
  remark?: string
  items?: SalaryIssueItemCreateDTO[]
}

export interface SalaryIssueItemCreateDTO {
  staffId: number
  netAmount: number
  remark?: string
}