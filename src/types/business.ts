export interface PaymentDoc {
  bizDocId: string
  bizDocNo: string
  bizType: string
  bizDate: string
  status: number
  paymentAccountId: string
  paymentAccountName: string
  accountId: string | null
  accountName: string
  contactId: string | null
  contactName: string
  paymentAmount: number
  currencyId: string
  currencyName: string
  exchangeRate: number
  bizStaffId: string
  bizStaffName: string
  bizDeptId: string | null
  bizDeptName: string
  bizProjectId: string | null
  bizProjectName: string
  remark: string
  createId: string
  createName: string
  createTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  auditId: string | null
  auditName: string
  auditTime: string | null
}

export interface ReceiptDoc {
  bizDocId: string
  bizDocNo: string
  bizType: string
  bizDate: string
  status: number
  receiptAccountId: string
  receiptAccountName: string
  accountId: string | null
  accountName: string
  contactId: string | null
  contactName: string
  receiptAmount: number
  currencyId: string
  currencyName: string
  exchangeRate: number
  bizStaffId: string
  bizStaffName: string
  bizDeptId: string | null
  bizDeptName: string
  bizProjectId: string | null
  bizProjectName: string
  remark: string
  createId: string
  createName: string
  createTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  auditId: string | null
  auditName: string
  auditTime: string | null
}
