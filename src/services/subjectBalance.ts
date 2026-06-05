import type {
  SubjectBalanceListResponse,
  SubjectBalanceDetailResponse,
  CreateSubjectBalanceRequest,
  CreateSubjectBalanceResponse,
  UpdateSubjectBalanceRequest,
  UpdateSubjectBalanceResponse,
  DeleteSubjectBalanceResponse,
  RestoreSubjectBalanceResponse
} from '@/types/subjectBalance'

const BASE_URL = '/api/subjectBalances'
const useMock = true

const mockSubjectBalanceList: SubjectBalanceListResponse = {
  code: 0,
  msg: '成功',
  data: {
    total: 10,
    page: 1,
    pageSize: 20,
    list: [
      {
        balanceId: 1001,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '库存现金',
        subjectCode: '1001',
        subjectType: 1,
        periodName: '2024年04月',
        beginDebit: 5000.00,
        beginCredit: 0.00,
        currentDebit: 10000.00,
        currentCredit: 8000.00,
        endDebit: 7000.00,
        endCredit: 0.00,
        status: 0,
        updateTime: '2024-04-15 16:00:00'
      },
      {
        balanceId: 1002,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '银行存款',
        subjectCode: '1002',
        subjectType: 1,
        periodName: '2024年04月',
        beginDebit: 500000.00,
        beginCredit: 0.00,
        currentDebit: 200000.00,
        currentCredit: 150000.00,
        endDebit: 550000.00,
        endCredit: 0.00,
        status: 0,
        updateTime: '2024-04-15 16:00:00'
      },
      {
        balanceId: 1003,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '短期借款',
        subjectCode: '2001',
        subjectType: 2,
        periodName: '2024年04月',
        beginDebit: 0.00,
        beginCredit: 200000.00,
        currentDebit: 50000.00,
        currentCredit: 0.00,
        endDebit: 0.00,
        endCredit: 150000.00,
        status: 0,
        updateTime: '2024-04-15 16:00:00'
      },
      {
        balanceId: 1004,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '实收资本',
        subjectCode: '3001',
        subjectType: 3,
        periodName: '2024年04月',
        beginDebit: 0.00,
        beginCredit: 305000.00,
        currentDebit: 0.00,
        currentCredit: 100000.00,
        endDebit: 0.00,
        endCredit: 405000.00,
        status: 0,
        updateTime: '2024-04-15 16:00:00'
      },
      {
        balanceId: 1005,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '主营业务收入',
        subjectCode: '6001',
        subjectType: 5,
        periodName: '2024年04月',
        beginDebit: 0.00,
        beginCredit: 0.00,
        currentDebit: 0.00,
        currentCredit: 150000.00,
        endDebit: 0.00,
        endCredit: 150000.00,
        status: 0,
        updateTime: '2024-04-15 16:00:00'
      },
      {
        balanceId: 1006,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '管理费用',
        subjectCode: '6602',
        subjectType: 5,
        periodName: '2024年04月',
        beginDebit: 0.00,
        beginCredit: 0.00,
        currentDebit: 48000.00,
        currentCredit: 0.00,
        endDebit: 48000.00,
        endCredit: 0.00,
        status: 0,
        updateTime: '2024-04-15 16:00:00'
      },
      {
        balanceId: 1007,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '固定资产',
        subjectCode: '1601',
        subjectType: 1,
        periodName: '2024年04月',
        beginDebit: 200000.00,
        beginCredit: 0.00,
        currentDebit: 50000.00,
        currentCredit: 0.00,
        endDebit: 250000.00,
        endCredit: 0.00,
        status: 0,
        updateTime: '2024-04-15 16:00:00'
      },
      {
        balanceId: 1008,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '累计折旧',
        subjectCode: '1602',
        subjectType: 1,
        periodName: '2024年04月',
        beginDebit: 0.00,
        beginCredit: 20000.00,
        currentDebit: 0.00,
        currentCredit: 5000.00,
        endDebit: 0.00,
        endCredit: 25000.00,
        status: 0,
        updateTime: '2024-04-15 16:00:00'
      },
      {
        balanceId: 1009,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '应付账款',
        subjectCode: '2202',
        subjectType: 2,
        periodName: '2024年04月',
        beginDebit: 0.00,
        beginCredit: 80000.00,
        currentDebit: 30000.00,
        currentCredit: 20000.00,
        endDebit: 0.00,
        endCredit: 70000.00,
        status: 0,
        updateTime: '2024-04-15 16:00:00'
      },
      {
        balanceId: 1010,
        ledgerName: '主账本',
        companyName: '示例科技有限公司',
        subjectName: '应收账款',
        subjectCode: '1122',
        subjectType: 1,
        periodName: '2024年04月',
        beginDebit: 100000.00,
        beginCredit: 0.00,
        currentDebit: 60000.00,
        currentCredit: 40000.00,
        endDebit: 120000.00,
        endCredit: 0.00,
        status: -1,
        updateTime: '2024-04-10 10:00:00'
      }
    ],
    summary: {
      totalBeginDebit: 805000.00,
      totalBeginCredit: 585000.00,
      totalEndDebit: 995000.00,
      totalEndCredit: 775000.00
    }
  }
}

const mockSubjectBalanceDetail: SubjectBalanceDetailResponse = {
  code: 0,
  msg: '成功',
  data: {
    balanceId: 1001,
    ledgerId: 1,
    ledgerName: '主账本',
    companyId: 101,
    companyName: '示例科技有限公司',
    subjectId: 1001,
    subjectCode: '1001',
    subjectName: '库存现金',
    subjectType: 1,
    periodId: 202404,
    periodName: '2024年04月',
    beginDebit: 5000.00,
    beginCredit: 0.00,
    currentDebit: 10000.00,
    currentCredit: 8000.00,
    endDebit: 7000.00,
    endCredit: 0.00,
    remark: '4月期初余额初始化',
    status: 0,
    creatorName: '财务管理员',
    createTime: '2024-04-01 10:00:00',
    updaterName: '财务管理员',
    updateTime: '2024-04-15 16:00:00',
    relatedInfo: {
      subjectName: '库存现金',
      subjectType: 1,
      periodStatus: 0,
      periodName: '2024年04月'
    },
    operationLogs: [
      {
        logId: 10001,
        operType: 'CREATE',
        operUser: '财务管理员',
        operTime: '2024-04-01 10:00:00',
        content: '新增2024年04月库存现金科目余额，期初借方5000.00'
      },
      {
        logId: 10002,
        operType: 'UPDATE',
        operUser: '财务管理员',
        operTime: '2024-04-15 16:00:00',
        content: '修改2024年04月库存现金科目余额，期初借方调整为5000.00'
      }
    ]
  }
}

export async function getSubjectBalanceList(params: {
  page?: number
  pageSize?: number
  ledgerId: number
  companyId: number
  periodId?: number
  subjectId?: number
  subjectType?: number
  status?: number
  beginDebitMin?: number
  beginDebitMax?: number
  endCreditMin?: number
  endCreditMax?: number
  createTime?: string
}): Promise<SubjectBalanceListResponse> {
  if (useMock) {
    let list = [...mockSubjectBalanceList.data.list]
    
    if (params.subjectType !== undefined) {
      list = list.filter(item => item.subjectType === params.subjectType)
    }
    if (params.status !== undefined) {
      list = list.filter(item => item.status === params.status)
    }
    
    const summary = list.reduce((acc, item) => ({
      totalBeginDebit: acc.totalBeginDebit + item.beginDebit,
      totalBeginCredit: acc.totalBeginCredit + item.beginCredit,
      totalEndDebit: acc.totalEndDebit + item.endDebit,
      totalEndCredit: acc.totalEndCredit + item.endCredit
    }), {
      totalBeginDebit: 0,
      totalBeginCredit: 0,
      totalEndDebit: 0,
      totalEndCredit: 0
    })
    
    return {
      ...mockSubjectBalanceList,
      data: {
        ...mockSubjectBalanceList.data,
        total: list.length,
        page: params.page || 1,
        pageSize: params.pageSize || 20,
        list,
        summary
      }
    }
  }
  
  const url = new URL(BASE_URL)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value))
    }
  })
  
  const response = await fetch(url.toString())
  return response.json()
}

export async function getSubjectBalanceDetail(params: {
  balanceId: number
  ledgerId: number
  companyId: number
}): Promise<SubjectBalanceDetailResponse> {
  if (useMock) {
    return {
      ...mockSubjectBalanceDetail,
      data: {
        ...mockSubjectBalanceDetail.data,
        balanceId: params.balanceId
      }
    }
  }
  
  const url = new URL(`${BASE_URL}/${params.balanceId}`)
  url.searchParams.set('ledgerId', String(params.ledgerId))
  url.searchParams.set('companyId', String(params.companyId))
  
  const response = await fetch(url.toString())
  return response.json()
}

export async function createSubjectBalance(request: CreateSubjectBalanceRequest): Promise<CreateSubjectBalanceResponse> {
  if (useMock) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
    let endDebit = 0
    let endCredit = 0
    
    if ([1, 4].includes(request.subjectId % 5 + 1)) {
      endDebit = (request.beginDebit || 0)
      endCredit = 0
    } else {
      endDebit = 0
      endCredit = (request.beginCredit || 0)
    }
    
    return {
      code: 0,
      msg: '成功',
      data: {
        balanceId: Date.now(),
        endDebit,
        endCredit,
        createTime: now
      }
    }
  }
  
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  return response.json()
}

export async function updateSubjectBalance(balanceId: number, request: UpdateSubjectBalanceRequest): Promise<UpdateSubjectBalanceResponse> {
  if (useMock) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
    let endDebit = 0
    let endCredit = 0
    
    if (request.beginDebit !== undefined) {
      endDebit = request.beginDebit
    }
    if (request.beginCredit !== undefined) {
      endCredit = request.beginCredit
    }
    
    return {
      code: 0,
      msg: '成功',
      data: {
        balanceId,
        endDebit,
        endCredit,
        updateTime: now
      }
    }
  }
  
  const response = await fetch(`${BASE_URL}/${balanceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  return response.json()
}

export async function deleteSubjectBalance(balanceId: number, params: {
  ledgerId: number
  companyId: number
  deleteReason: string
}): Promise<DeleteSubjectBalanceResponse> {
  if (useMock) {
    return {
      code: 0,
      msg: '成功',
      data: null
    }
  }
  
  const url = new URL(`${BASE_URL}/${balanceId}`)
  url.searchParams.set('ledgerId', String(params.ledgerId))
  url.searchParams.set('companyId', String(params.companyId))
  url.searchParams.set('deleteReason', params.deleteReason)
  
  const response = await fetch(url.toString(), {
    method: 'DELETE'
  })
  return response.json()
}

export async function restoreSubjectBalance(balanceId: number, params: {
  ledgerId: number
  companyId: number
}): Promise<RestoreSubjectBalanceResponse> {
  if (useMock) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
    return {
      code: 0,
      msg: '成功',
      data: {
        balanceId,
        status: 0,
        restoreTime: now
      }
    }
  }
  
  const url = new URL(`${BASE_URL}/${balanceId}/restore`)
  url.searchParams.set('ledgerId', String(params.ledgerId))
  url.searchParams.set('companyId', String(params.companyId))
  
  const response = await fetch(url.toString(), {
    method: 'PUT'
  })
  return response.json()
}
