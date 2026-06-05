import type { VoucherQueryDTO, VoucherPageResponse, VoucherDetailResponse, OperationResponse } from '@/types/voucher'
import { mockVouchers } from '@/data/mockData'

const BASE_URL = '/api/vouchers'

export async function getVoucherPage(query: VoucherQueryDTO): Promise<VoucherPageResponse> {
  const { page = 1, pageSize = 10, voucherCode, startDate, endDate, status } = query
  
  let filteredVouchers = [...mockVouchers]
  
  if (voucherCode) {
    filteredVouchers = filteredVouchers.filter(v => 
      v.voucherNo.toLowerCase().includes(voucherCode.toLowerCase())
    )
  }
  
  if (startDate) {
    filteredVouchers = filteredVouchers.filter(v => v.date >= startDate)
  }
  
  if (endDate) {
    filteredVouchers = filteredVouchers.filter(v => v.date <= endDate)
  }
  
  if (status !== undefined && status !== null) {
    filteredVouchers = filteredVouchers.filter(v => v.status === status)
  }
  
  const total = filteredVouchers.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const list = filteredVouchers.slice(start, end).map(v => ({
    voucherId: parseInt(v.id),
    voucherCode: v.voucherNo,
    voucherDate: v.date,
    summary: v.abstract,
    writerId: 1,
    writerName: v.type === 'debit' ? '张三' : '李四',
    writerTime: v.createdAt,
    status: v.status,
    statusDesc: v.status === 2 ? '已记账' : v.status === 1 ? '已审核' : '未审核',
    ledgerId: 1,
    bizDocId: parseInt(v.id) * 100,
    bizDocNo: `IN-202406-${String(parseInt(v.id)).padStart(3, '0')}`,
    bizDocType: v.type === 'debit' ? 1 : 2,
    bizDocTypeDesc: v.type === 'debit' ? '收入' : '支出',
    tradeTime: v.date,
    categoryId: 1,
    categoryName: v.subjectName,
    accountId: 1,
    accountName: '银行存款-工行',
    staffId: 1,
    staffName: '张三',
    deptId: 1,
    deptName: '财务部',
    companyId: 1,
    createTime: v.createdAt,
    entryList: [
      {
        entryId: parseInt(v.id) * 10 + 1,
        voucherId: parseInt(v.id),
        subjectId: v.type === 'debit' ? 1002 : 6602,
        subjectCode: v.type === 'debit' ? '1002' : '6602',
        subjectName: v.type === 'debit' ? '银行存款' : '管理费用',
        direction: 1,
        directionDesc: '借方',
        amount: v.debitAmount,
        remark: v.abstract
      },
      {
        entryId: parseInt(v.id) * 10 + 2,
        voucherId: parseInt(v.id),
        subjectId: v.type === 'debit' ? 6001 : 1002,
        subjectCode: v.type === 'debit' ? '6001' : '1002',
        subjectName: v.type === 'debit' ? '主营业务收入' : '银行存款',
        direction: 2,
        directionDesc: '贷方',
        amount: v.creditAmount,
        remark: v.abstract
      }
    ]
  }))

  return {
    code: 0,
    msg: '成功',
    data: {
      total,
      page,
      pageSize,
      list
    }
  }
}

export async function getVoucherDetail(voucherId: number): Promise<VoucherDetailResponse> {
  const voucher = mockVouchers.find(v => parseInt(v.id) === voucherId)
  
  if (!voucher) {
    return {
      code: 4004,
      msg: '凭证不存在',
      data: {} as any
    }
  }

  return {
    code: 0,
    msg: '成功',
    data: {
      voucherId: parseInt(voucher.id),
      voucherCode: voucher.voucherNo,
      voucherDate: voucher.date,
      summary: voucher.abstract,
      writerId: 1,
      writerName: voucher.type === 'debit' ? '张三' : '李四',
      writerTime: voucher.createdAt,
      status: voucher.status,
      statusDesc: voucher.status === 2 ? '已记账' : voucher.status === 1 ? '已审核' : '未审核',
      ledgerId: 1,
      bizDocId: parseInt(voucher.id) * 100,
      bizDocNo: `IN-202406-${String(parseInt(voucher.id)).padStart(3, '0')}`,
      bizDocType: voucher.type === 'debit' ? 1 : 2,
      bizDocTypeDesc: voucher.type === 'debit' ? '收入' : '支出',
      tradeTime: voucher.date,
      categoryId: 1,
      categoryName: voucher.subjectName,
      accountId: 1,
      accountName: '银行存款-工行',
      staffId: 1,
      staffName: '张三',
      deptId: 1,
      deptName: '财务部',
      companyId: 1,
      createTime: voucher.createdAt,
      entryList: [
        {
          entryId: parseInt(voucher.id) * 10 + 1,
          voucherId: parseInt(voucher.id),
          subjectId: voucher.type === 'debit' ? 1002 : 6602,
          subjectCode: voucher.type === 'debit' ? '1002' : '6602',
          subjectName: voucher.type === 'debit' ? '银行存款' : '管理费用',
          direction: 1,
          directionDesc: '借方',
          amount: voucher.debitAmount,
          remark: voucher.abstract
        },
        {
          entryId: parseInt(voucher.id) * 10 + 2,
          voucherId: parseInt(voucher.id),
          subjectId: voucher.type === 'debit' ? 6001 : 1002,
          subjectCode: voucher.type === 'debit' ? '6001' : '1002',
          subjectName: voucher.type === 'debit' ? '主营业务收入' : '银行存款',
          direction: 2,
          directionDesc: '贷方',
          amount: voucher.creditAmount,
          remark: voucher.abstract
        }
      ]
    }
  }
}

export async function approveVoucher(voucherId: number): Promise<OperationResponse> {
  const voucher = mockVouchers.find(v => parseInt(v.id) === voucherId)
  
  if (!voucher) {
    return { code: 4004, msg: '凭证不存在' }
  }
  
  if (voucher.status !== 0) {
    return { code: 3001, msg: '凭证状态异常，无法审核' }
  }
  
  return { code: 0, msg: '审核成功' }
}

export async function postVoucher(voucherId: number): Promise<OperationResponse> {
  const voucher = mockVouchers.find(v => parseInt(v.id) === voucherId)
  
  if (!voucher) {
    return { code: 4004, msg: '凭证不存在' }
  }
  
  if (voucher.status !== 1) {
    return { code: 3002, msg: '凭证未审核，无法记账' }
  }
  
  return { code: 0, msg: '记账成功' }
}

export async function deleteVoucher(voucherId: number): Promise<OperationResponse> {
  const voucher = mockVouchers.find(v => parseInt(v.id) === voucherId)
  
  if (!voucher) {
    return { code: 4004, msg: '凭证不存在' }
  }
  
  if (voucher.status !== 0) {
    return { code: 3001, msg: '凭证已审核或已记账，无法删除' }
  }
  
  return { code: 0, msg: '删除成功' }
}