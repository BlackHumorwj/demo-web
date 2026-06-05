export interface VoucherEntry {
  entryId: number
  voucherId: number
  subjectId: number
  subjectCode: string
  subjectName: string
  direction: number
  directionDesc: string
  amount: number
  remark: string
}

export interface Voucher {
  voucherId: number
  voucherCode: string
  voucherDate: string
  summary: string
  writerId: number
  writerName: string
  writerTime: string
  status: number
  statusDesc: string
  ledgerId: number
  bizDocId: number
  bizDocNo: string
  bizDocType: number
  bizDocTypeDesc: string
  tradeTime: string
  categoryId: number
  categoryName: string
  accountId: number
  accountName: string
  staffId: number
  staffName: string
  deptId: number
  deptName: string
  companyId: number
  createTime: string
  entryList: VoucherEntry[]
}

export interface VoucherQueryDTO {
  page?: number
  pageSize?: number
  ledgerId?: number
  voucherCode?: string
  startDate?: string
  endDate?: string
  status?: number
  bizDocCode?: string
}

export interface VoucherPageResponse {
  code: number
  msg: string
  data: {
    total: number
    page: number
    pageSize: number
    list: Voucher[]
  }
}

export interface VoucherDetailResponse {
  code: number
  msg: string
  data: Voucher
}

export interface OperationResponse {
  code: number
  msg: string
}

export const STATUS_MAP: Record<number, string> = {
  0: '未审核',
  1: '已审核',
  2: '已记账'
}

export const STATUS_TYPE_MAP: Record<number, string> = {
  0: 'warning',
  1: 'info',
  2: 'success'
}

export const BIZ_DOC_TYPE_MAP: Record<number, string> = {
  1: '收入',
  2: '支出',
  3: '转账',
  4: '其他'
}

export const DIRECTION_MAP: Record<number, string> = {
  1: '借方',
  2: '贷方'
}