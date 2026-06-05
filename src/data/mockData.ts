export interface User {
  id: string
  username: string
  name: string
  email: string
  role: string
  status: number
}

export interface Company {
  id: string
  name: string
  remark: string
  userId: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface Contact {
  id: string
  name: string
  type: number
  contactName: string
  phone: string
  email: string
  remark: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  type: number
  parentId: string | null
  subjectId: string
  subjectCode: string
  isSystemBuiltin: number
  remark: string
  scope: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface Subject {
  id: string
  code: string
  name: string
  level: number
  parentId: string | null
  type: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface Account {
  id: string
  name: string
  type: number
  balance: number
  currency: string
  remark: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface BusinessDoc {
  id: string
  type: string
  typeName: string
  amount: number
  date: string
  contactName: string
  status: number
  statusText: string
  createdAt: string
}

export interface IncomeDetail {
  id: string
  categoryId: string
  categoryName: string
  amount: number
  remark: string
}

export interface IncomeDoc {
  id: string
  docNo: string
  date: string
  contactId: string
  contactName: string
  accountId: string
  accountName: string
  projectId: string | null
  projectName: string
  remark: string
  status: number
  createdAt: string
  updatedAt: string
  details: IncomeDetail[]
}

export interface ExpenseDoc {
  bizDocId: string
  bizDocNo: string
  tradeTime: string
  accountId: string
  accountName: string
  staffId: string
  staffName: string
  deptId: string | null
  deptName: string
  projectId: string | null
  projectName: string
  bizContactId: string | null
  bizContactName: string
  amount: number
  currencyCode: string
  exchangeRate: number
  remark: string
  writerId: string
  writerName: string
  writerTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  status: number
}

export interface InventoryItem {
  id: string
  productName: string
  warehouseName: string
  quantity: number
  costPrice: number
  totalAmount: number
  createdAt: string
}

export interface ReportData {
  period: string
  revenue: number
  expense: number
  profit: number
  profitRate: number
}

export interface Voucher {
  id: string
  voucherNo: string
  date: string
  abstract: string
  subjectName: string
  debitAmount: number
  creditAmount: number
  status: number
  createdAt: string
  type?: string
  amount?: number
}

export interface Inventory {
  id: string
  itemName: string
  sku: string
  stock: number
  minStock: number
}

export const mockUser: User = {
  id: '1',
  username: 'admin',
  name: '管理员',
  email: 'admin@company.com',
  role: '管理员',
  status: 1
}

export const mockCompanies: Company[] = [
  { id: '1', name: '示例科技有限公司', remark: '科技研发公司', userId: '1001', status: 0, createdAt: '2024-01-01 10:00:00', updatedAt: '2024-01-01 10:00:00' },
  { id: '2', name: '创新贸易有限公司', remark: '进出口贸易公司', userId: '1001', status: 0, createdAt: '2024-03-15 14:00:00', updatedAt: '2024-03-15 14:00:00' },
  { id: '3', name: '测试公司A', remark: '', userId: '1001', status: 1, createdAt: '2024-05-20 09:00:00', updatedAt: '2024-05-20 09:00:00' }
]

export const mockContacts: Contact[] = [
  { id: '1', name: '北京客户A', type: 1, contactName: '张三', phone: '13800138001', email: 'zhangsan@example.com', remark: 'VIP客户', status: 1, createdAt: '2024-01-10', updatedAt: '2024-01-10' },
  { id: '2', name: '上海供应商B', type: 2, contactName: '李四', phone: '13900139002', email: 'lisi@example.com', remark: '长期合作', status: 1, createdAt: '2024-02-15', updatedAt: '2024-02-15' },
  { id: '3', name: '广州客户C', type: 1, contactName: '王五', phone: '13700137003', email: 'wangwu@example.com', remark: '', status: 1, createdAt: '2024-03-20', updatedAt: '2024-03-20' },
  { id: '4', name: '深圳供应商D', type: 2, contactName: '赵六', phone: '13600136004', email: 'zhaoliu@example.com', remark: '新供应商', status: 0, createdAt: '2024-04-01', updatedAt: '2024-04-01' }
]

export const mockCategories: Category[] = [
  { id: '1', name: '销售收入', type: 1, parentId: null, subjectId: '1', subjectCode: '6001', isSystemBuiltin: 1, remark: '', scope: '', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '服务收入', type: 1, parentId: null, subjectId: '2', subjectCode: '6002', isSystemBuiltin: 1, remark: '', scope: '', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: '办公费用', type: 2, parentId: null, subjectId: '3', subjectCode: '6602', isSystemBuiltin: 1, remark: '', scope: '', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '4', name: '差旅费', type: 2, parentId: null, subjectId: '4', subjectCode: '6602', isSystemBuiltin: 1, remark: '', scope: '', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
]

export const mockSubjects: Subject[] = [
  { id: '1', code: '1001', name: '库存现金', level: 1, parentId: null, type: 'asset', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', code: '1002', name: '银行存款', level: 1, parentId: null, type: 'asset', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', code: '6001', name: '主营业务收入', level: 1, parentId: null, type: 'income', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '4', code: '6602', name: '管理费用', level: 1, parentId: null, type: 'expense', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
]

export const mockAccounts: Account[] = [
  { id: '1', name: '工商银行', type: 1, balance: 150000.00, currency: 'CNY', remark: '基本账户', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '现金', type: 2, balance: 5000.00, currency: 'CNY', remark: '备用金', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: '建设银行', type: 1, balance: 80000.00, currency: 'CNY', remark: '一般账户', status: 1, createdAt: '2024-02-01', updatedAt: '2024-02-01' }
]

export const mockBusinessDocs: BusinessDoc[] = [
  { id: '1', type: 'income', typeName: '收入', amount: 15000.00, date: '2024-06-01', contactName: '北京客户A', status: 2, statusText: '已审核', createdAt: '2024-06-01 10:30:00' },
  { id: '2', type: 'expense', typeName: '费用支出', amount: 2500.00, date: '2024-06-02', contactName: '', status: 2, statusText: '已审核', createdAt: '2024-06-02 14:15:00' },
  { id: '3', type: 'receipt', typeName: '收款', amount: 10000.00, date: '2024-06-03', contactName: '上海客户B', status: 1, statusText: '待审核', createdAt: '2024-06-03 09:00:00' },
  { id: '4', type: 'income', typeName: '收入', amount: 8000.00, date: '2024-06-04', contactName: '广州客户C', status: 2, statusText: '已审核', createdAt: '2024-06-04 11:20:00' },
  { id: '5', type: 'expense', typeName: '费用支出', amount: 1200.00, date: '2024-06-05', contactName: '', status: 1, statusText: '待审核', createdAt: '2024-06-05 16:45:00' }
]

export const mockInventoryItems: InventoryItem[] = [
  { id: '1', productName: '产品A', warehouseName: '主仓库', quantity: 100, costPrice: 50.00, totalAmount: 5000.00, createdAt: '2024-06-01' },
  { id: '2', productName: '产品B', warehouseName: '主仓库', quantity: 50, costPrice: 120.00, totalAmount: 6000.00, createdAt: '2024-06-02' },
  { id: '3', productName: '产品C', warehouseName: '备用仓库', quantity: 200, costPrice: 30.00, totalAmount: 6000.00, createdAt: '2024-06-03' }
]

export const mockReportData: ReportData[] = [
  { period: '2024-01', revenue: 120000, expense: 85000, profit: 35000, profitRate: 29.17 },
  { period: '2024-02', revenue: 150000, expense: 95000, profit: 55000, profitRate: 36.67 },
  { period: '2024-03', revenue: 135000, expense: 90000, profit: 45000, profitRate: 33.33 },
  { period: '2024-04', revenue: 180000, expense: 110000, profit: 70000, profitRate: 38.89 },
  { period: '2024-05', revenue: 165000, expense: 100000, profit: 65000, profitRate: 39.39 },
  { period: '2024-06', revenue: 190000, expense: 115000, profit: 75000, profitRate: 39.47 }
]

export const mockVouchers: Voucher[] = [
  { id: '1', voucherNo: 'V202406001', date: '2024-06-01', abstract: '销售收入', subjectName: '主营业务收入', debitAmount: 15000, creditAmount: 15000, status: 2, createdAt: '2024-06-01 10:30:00', type: 'debit', amount: 15000 },
  { id: '2', voucherNo: 'V202406002', date: '2024-06-02', abstract: '办公费用', subjectName: '管理费用', debitAmount: 2500, creditAmount: 2500, status: 2, createdAt: '2024-06-02 14:15:00', type: 'credit', amount: 2500 },
  { id: '3', voucherNo: 'V202406003', date: '2024-06-03', abstract: '收到货款', subjectName: '银行存款', debitAmount: 10000, creditAmount: 10000, status: 1, createdAt: '2024-06-03 09:00:00', type: 'debit', amount: 10000 }
]

export const mockInventory: Inventory[] = [
  { id: '1', itemName: '办公用品套装', sku: 'SKU-001', stock: 150, minStock: 50 },
  { id: '2', itemName: '电脑配件', sku: 'SKU-002', stock: 30, minStock: 40 },
  { id: '3', itemName: '办公桌椅', sku: 'SKU-003', stock: 20, minStock: 15 }
]

export const mockEmployees = [
  { id: '1', staffNo: 'EMP001', name: '张三', contact: '13800138001', email: 'zhangsan@company.com', deptIds: '2', deptNames: '财务部', roleIds: ['1', '2'], roleNames: '管理员,财务人员', isActive: 1, allowLoginLedger: 1, department: '财务部', position: '财务经理', phone: '13800138001', status: 1, createdAt: '2024-01-10 09:00:00', updatedAt: '2024-01-10 09:00:00' },
  { id: '2', staffNo: 'EMP002', name: '李四', contact: '13900139002', email: 'lisi@company.com', deptIds: '2', deptNames: '财务部', roleIds: ['2'], roleNames: '财务人员', isActive: 1, allowLoginLedger: 1, department: '财务部', position: '会计', phone: '13900139002', status: 1, createdAt: '2024-02-15 14:00:00', updatedAt: '2024-02-15 14:00:00' },
  { id: '3', staffNo: 'EMP003', name: '王五', contact: '13700137003', email: 'wangwu@company.com', deptIds: '5', deptNames: '销售部', roleIds: ['3'], roleNames: '普通用户', isActive: 1, allowLoginLedger: 0, department: '销售部', position: '销售主管', phone: '13700137003', status: 1, createdAt: '2024-03-20 10:00:00', updatedAt: '2024-03-20 10:00:00' },
  { id: '4', staffNo: 'EMP004', name: '赵六', contact: '13600136004', email: 'zhaoliu@company.com', deptIds: '1,4', deptNames: '技术部,市场部', roleIds: ['1', '3'], roleNames: '管理员,普通用户', isActive: 0, allowLoginLedger: 0, department: '技术部', position: '技术总监', phone: '13600136004', status: 0, createdAt: '2024-04-01 09:00:00', updatedAt: '2024-05-15 16:00:00' }
]

export const mockStaff = mockEmployees

export const mockProjects = [
  { id: '1', projectNo: 'PRJ2024001', projectName: '电商平台开发', groupId: '1', groupName: '技术项目', leaderId: '1', leaderName: '张三', startDate: '2024-01-01', endDate: '2024-12-31', remark: '', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', projectNo: 'PRJ2024002', projectName: '市场推广活动', groupId: '2', groupName: '市场项目', leaderId: '2', leaderName: '李四', startDate: '2024-03-01', endDate: '2024-06-30', remark: 'Q2重点项目', status: 1, createdAt: '2024-03-01', updatedAt: '2024-03-01' }
]

export interface ProjectGroup {
  id: string
  groupName: string
  status: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export const mockProjectGroups: ProjectGroup[] = [
  { id: '1', groupName: '技术项目', status: 1, sortOrder: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', groupName: '市场项目', status: 1, sortOrder: 2, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', groupName: '运营项目', status: 1, sortOrder: 3, createdAt: '2024-02-01', updatedAt: '2024-02-01' }
]

export interface Department {
  id: string
  name: string
  parentId: string | null
  remark: string
  status: number
  createdAt: string
  updatedAt: string
}

export const mockDepartments: Department[] = [
  { id: '1', name: '财务部', parentId: null, remark: '', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '销售部', parentId: null, remark: '', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: '技术部', parentId: null, remark: '', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '4', name: '市场部', parentId: null, remark: '', status: 1, createdAt: '2024-02-01', updatedAt: '2024-02-01' }
]

export const mockRoles = [
  { id: '1', name: '管理员', remark: '系统管理员', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', name: '财务人员', remark: '财务操作权限', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', name: '普通用户', remark: '基础操作权限', status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
]

export const mockCurrencies = [
  { id: '1', code: 'CNY', name: '人民币', symbol: '¥', rate: 1.0000, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '2', code: 'USD', name: '美元', symbol: '$', rate: 7.2450, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' },
  { id: '3', code: 'EUR', name: '欧元', symbol: '€', rate: 7.8500, status: 1, createdAt: '2024-01-01', updatedAt: '2024-01-01' }
]

export const mockLogs = [
  { id: '1', userId: '1', userName: '管理员', action: '登录系统', target: '', ip: '192.168.1.100', createdAt: '2024-06-01 09:00:00' },
  { id: '2', userId: '1', userName: '管理员', action: '创建收入单据', target: '收入单 #IN202406001', ip: '192.168.1.100', createdAt: '2024-06-01 10:30:00' },
  { id: '3', userId: '2', userName: '李四', action: '审核支出单据', target: '支出单 #EX202406001', ip: '192.168.1.101', createdAt: '2024-06-02 14:15:00' }
]

export const mockIncomeDocs: IncomeDoc[] = [
  { id: '1', docNo: 'IN202406001', date: '2024-06-01', contactId: '1', contactName: '北京客户A', accountId: '1', accountName: '工商银行', projectId: '1', projectName: '电商平台开发', remark: 'Q2销售回款', status: 2, createdAt: '2024-06-01 10:30:00', updatedAt: '2024-06-01 10:30:00', details: [{ id: '1-1', categoryId: '1', categoryName: '销售收入', amount: 10000.00, remark: '产品销售' }, { id: '1-2', categoryId: '2', categoryName: '服务收入', amount: 5000.00, remark: '技术支持' }] },
  { id: '2', docNo: 'IN202406002', date: '2024-06-04', contactId: '3', contactName: '广州客户C', accountId: '2', accountName: '现金', projectId: null, projectName: '', remark: '', status: 2, createdAt: '2024-06-04 11:20:00', updatedAt: '2024-06-04 11:20:00', details: [{ id: '2-1', categoryId: '2', categoryName: '服务收入', amount: 8000.00, remark: '' }] },
  { id: '3', docNo: 'IN202406003', date: '2024-06-05', contactId: '1', contactName: '北京客户A', accountId: '1', accountName: '工商银行', projectId: '2', projectName: '市场推广活动', remark: '预付款', status: 1, createdAt: '2024-06-05 14:00:00', updatedAt: '2024-06-05 14:00:00', details: [{ id: '3-1', categoryId: '1', categoryName: '销售收入', amount: 12000.00, remark: '预付款' }] },
  { id: '4', docNo: 'IN202406004', date: '2024-06-06', contactId: '3', contactName: '广州客户C', accountId: '3', accountName: '建设银行', projectId: null, projectName: '', remark: '技术服务费', status: 1, createdAt: '2024-06-06 16:30:00', updatedAt: '2024-06-06 16:30:00', details: [{ id: '4-1', categoryId: '2', categoryName: '服务收入', amount: 5000.00, remark: '技术服务费' }] },
  { id: '5', docNo: 'IN202406005', date: '2024-06-07', contactId: '2', contactName: '上海供应商B', accountId: '1', accountName: '工商银行', projectId: '1', projectName: '电商平台开发', remark: '项目尾款', status: 0, createdAt: '2024-06-07 09:15:00', updatedAt: '2024-06-07 09:15:00', details: [{ id: '5-1', categoryId: '1', categoryName: '销售收入', amount: 15000.00, remark: '产品交付' }, { id: '5-2', categoryId: '2', categoryName: '服务收入', amount: 5000.00, remark: '运维服务' }] }
]

export const mockExpenseDocs: ExpenseDoc[] = [
  { bizDocId: '1', bizDocNo: 'EX202406001', tradeTime: '2024-06-02', accountId: '1', accountName: '工商银行', staffId: '1', staffName: '张三', deptId: '1', deptName: '财务部', projectId: '1', projectName: '电商平台开发', bizContactId: null, bizContactName: '', amount: 2500.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '办公设备采购', writerId: '1', writerName: '张三', writerTime: '2024-06-02 14:15:00', updateId: null, updateName: '', updateTime: null, status: 0 },
  { bizDocId: '2', bizDocNo: 'EX202406002', tradeTime: '2024-06-05', accountId: '2', accountName: '现金', staffId: '2', staffName: '李四', deptId: '2', deptName: '销售部', projectId: null, projectName: '', bizContactId: '2', bizContactName: '上海供应商B', amount: 1200.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '差旅费报销', writerId: '2', writerName: '李四', writerTime: '2024-06-05 16:45:00', updateId: '1', updateName: '张三', updateTime: '2024-06-05 17:00:00', status: 0 },
  { bizDocId: '3', bizDocNo: 'EX202406003', tradeTime: '2024-06-08', accountId: '1', accountName: '工商银行', staffId: '1', staffName: '张三', deptId: '3', deptName: '技术部', projectId: '1', projectName: '电商平台开发', bizContactId: null, bizContactName: '', amount: 5000.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '服务器租赁费用', writerId: '1', writerName: '张三', writerTime: '2024-06-08 10:30:00', updateId: null, updateName: '', updateTime: null, status: 0 },
  { bizDocId: '4', bizDocNo: 'EX202406004', tradeTime: '2024-06-10', accountId: '3', accountName: '建设银行', staffId: '2', staffName: '李四', deptId: '4', deptName: '市场部', projectId: '2', projectName: '市场推广活动', bizContactId: '3', bizContactName: '广州客户C', amount: 8000.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '广告投放费用', writerId: '2', writerName: '李四', writerTime: '2024-06-10 11:00:00', updateId: null, updateName: '', updateTime: null, status: 0 },
  { bizDocId: '5', bizDocNo: 'EX202406005', tradeTime: '2024-06-12', accountId: '2', accountName: '现金', staffId: '3', staffName: '王五', deptId: '2', deptName: '销售部', projectId: null, projectName: '', bizContactId: null, bizContactName: '', amount: 350.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '办公用品采购', writerId: '3', writerName: '王五', writerTime: '2024-06-12 14:30:00', updateId: null, updateName: '', updateTime: null, status: 0 },
  { bizDocId: '6', bizDocNo: 'EX202406006', tradeTime: '2024-06-15', accountId: '1', accountName: '工商银行', staffId: '1', staffName: '张三', deptId: '1', deptName: '财务部', projectId: null, projectName: '', bizContactId: '4', bizContactName: '深圳供应商D', amount: 15000.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '软件许可证费用', writerId: '1', writerName: '张三', writerTime: '2024-06-15 09:00:00', updateId: '2', updateName: '李四', updateTime: '2024-06-15 09:30:00', status: 0 },
  { bizDocId: '7', bizDocNo: 'EX202406007', tradeTime: '2024-06-18', accountId: '2', accountName: '现金', staffId: '2', staffName: '李四', deptId: '3', deptName: '技术部', projectId: '1', projectName: '电商平台开发', bizContactId: null, bizContactName: '', amount: 800.00, currencyCode: 'USD', exchangeRate: 7.24500000, remark: '技术书籍采购', writerId: '2', writerName: '李四', writerTime: '2024-06-18 15:00:00', updateId: null, updateName: '', updateTime: null, status: 0 },
  { bizDocId: '8', bizDocNo: 'EX202406008', tradeTime: '2024-06-20', accountId: '3', accountName: '建设银行', staffId: '3', staffName: '王五', deptId: '4', deptName: '市场部', projectId: '2', projectName: '市场推广活动', bizContactId: null, bizContactName: '', amount: 3000.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '活动场地租赁', writerId: '3', writerName: '王五', writerTime: '2024-06-20 10:00:00', updateId: null, updateName: '', updateTime: null, status: -1 }
]

export interface ArapRecord {
  arapId: number
  bizDocId: number
  bizDocNo: string
  tradeTime: string
  accountId: string
  accountName: string
  bizContactId: string
  bizContactName: string
  amount: number
  offsetAmount: number
  balance: number
  arapType: number
  arapTypeName: string
  dueDate: string | null
  status: number
  currencyCode: string
  exchangeRate: number
  overdue: boolean
  daysOverdue: number
  currentOperation?: { code: string }
}

export const mockArapList: ArapRecord[] = [
  { arapId: 1001, bizDocId: 2001, bizDocNo: 'IN202406001', tradeTime: '2024-06-01', accountId: '1', accountName: '应收账款', bizContactId: '1', bizContactName: '北京客户A', amount: 15000.00, offsetAmount: 5000.00, balance: 10000.00, arapType: 1, arapTypeName: '应收款', dueDate: '2024-07-01', status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: false, daysOverdue: 0 },
  { arapId: 1002, bizDocId: 2002, bizDocNo: 'IN202406002', tradeTime: '2024-06-04', accountId: '1', accountName: '应收账款', bizContactId: '3', bizContactName: '广州客户C', amount: 8000.00, offsetAmount: 0, balance: 8000.00, arapType: 1, arapTypeName: '应收款', dueDate: '2024-07-04', status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: false, daysOverdue: 0 },
  { arapId: 1003, bizDocId: 2003, bizDocNo: 'EX202406001', tradeTime: '2024-06-02', accountId: '2', accountName: '应付账款', bizContactId: '2', bizContactName: '上海供应商B', amount: 25000.00, offsetAmount: 10000.00, balance: 15000.00, arapType: 2, arapTypeName: '应付款', dueDate: '2024-06-15', status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: true, daysOverdue: 15 },
  { arapId: 1004, bizDocId: 2004, bizDocNo: 'EX202406002', tradeTime: '2024-06-05', accountId: '2', accountName: '应付账款', bizContactId: '4', bizContactName: '深圳供应商D', amount: 12000.00, offsetAmount: 0, balance: 12000.00, arapType: 2, arapTypeName: '应付款', dueDate: '2024-07-05', status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: false, daysOverdue: 0 },
  { arapId: 1005, bizDocId: 2005, bizDocNo: 'IN202406003', tradeTime: '2024-06-05', accountId: '3', accountName: '预收账款', bizContactId: '1', bizContactName: '北京客户A', amount: 12000.00, offsetAmount: 0, balance: 12000.00, arapType: 3, arapTypeName: '预收款', dueDate: null, status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: false, daysOverdue: 0 },
  { arapId: 1006, bizDocId: 2006, bizDocNo: 'EX202406003', tradeTime: '2024-06-03', accountId: '4', accountName: '预付账款', bizContactId: '2', bizContactName: '上海供应商B', amount: 30000.00, offsetAmount: 15000.00, balance: 15000.00, arapType: 4, arapTypeName: '预付款', dueDate: null, status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: false, daysOverdue: 0 },
  { arapId: 1007, bizDocId: 2007, bizDocNo: 'IN202405001', tradeTime: '2024-05-10', accountId: '1', accountName: '应收账款', bizContactId: '3', bizContactName: '广州客户C', amount: 5000.00, offsetAmount: 5000.00, balance: 0, arapType: 1, arapTypeName: '应收款', dueDate: '2024-06-10', status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: false, daysOverdue: 0 },
  { arapId: 1008, bizDocId: 2008, bizDocNo: 'EX202405001', tradeTime: '2024-05-15', accountId: '2', accountName: '应付账款', bizContactId: '2', bizContactName: '上海供应商B', amount: 8000.00, offsetAmount: 8000.00, balance: 0, arapType: 2, arapTypeName: '应付款', dueDate: '2024-06-15', status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: false, daysOverdue: 0 },
  { arapId: 1009, bizDocId: 2009, bizDocNo: 'BR202406001', tradeTime: '2024-06-01', accountId: '5', accountName: '其他应付款', bizContactId: '1', bizContactName: '北京客户A', amount: 20000.00, offsetAmount: 0, balance: 20000.00, arapType: 5, arapTypeName: '借入款', dueDate: '2024-12-01', status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: false, daysOverdue: 0 },
  { arapId: 1010, bizDocId: 2010, bizDocNo: 'LO202405001', tradeTime: '2024-05-20', accountId: '6', accountName: '其他应收款', bizContactId: '2', bizContactName: '上海供应商B', amount: 10000.00, offsetAmount: 3000.00, balance: 7000.00, arapType: 6, arapTypeName: '借出款', dueDate: '2024-06-20', status: 0, currencyCode: 'CNY', exchangeRate: 1.00000000, overdue: true, daysOverdue: 10 }
]

export interface ReceiptRecord {
  bizDocId: number
  bizDocNo: string
  bizDocType: number
  bizDocTypeName: string
  tradeTime: string
  accountId: string
  accountName: string
  bizContactId: string
  bizContactName: string
  staffId: string
  staffName: string
  amount: number
  remark: string
  status: number
  writerTime: string
  writerName: string
  currencyCode: string
  exchangeRate: number
  items?: { arapId: number; arapType: number; arapTypeName: string; amount: number; balance: number }[]
}

export const mockReceiptRecords: ReceiptRecord[] = [
  { bizDocId: 3001, bizDocNo: 'RCP202406001', bizDocType: 302, bizDocTypeName: '收回欠款', tradeTime: '2024-06-10', accountId: '1', accountName: '工商银行', bizContactId: '1', bizContactName: '北京客户A', staffId: '1', staffName: '张三', amount: 5000.00, remark: '收到货款', status: 0, writerTime: '2024-06-10 14:30:00', writerName: '张三', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1001, arapType: 1, arapTypeName: '应收款', amount: 5000.00, balance: 0 }] },
  { bizDocId: 3002, bizDocNo: 'RCP202406002', bizDocType: 314, bizDocTypeName: '还欠款', tradeTime: '2024-06-12', accountId: '1', accountName: '工商银行', bizContactId: '2', bizContactName: '上海供应商B', staffId: '2', staffName: '李四', amount: 10000.00, remark: '支付货款', status: 0, writerTime: '2024-06-12 10:00:00', writerName: '李四', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1003, arapType: 2, arapTypeName: '应付款', amount: 10000.00, balance: 0 }] },
  { bizDocId: 3003, bizDocNo: 'RCP202406003', bizDocType: 326, bizDocTypeName: '预收款退回', tradeTime: '2024-06-15', accountId: '2', accountName: '现金', bizContactId: '3', bizContactName: '广州客户C', staffId: '1', staffName: '张三', amount: 2000.00, remark: '客户退款', status: 0, writerTime: '2024-06-15 16:45:00', writerName: '张三', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1007, arapType: 3, arapTypeName: '预收款', amount: 2000.00, balance: 0 }] },
  { bizDocId: 3004, bizDocNo: 'RCP202406004', bizDocType: 338, bizDocTypeName: '预付款退回', tradeTime: '2024-06-18', accountId: '1', accountName: '工商银行', bizContactId: '4', bizContactName: '深圳供应商D', staffId: '2', staffName: '李四', amount: 5000.00, remark: '供应商退款', status: 0, writerTime: '2024-06-18 09:30:00', writerName: '李四', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1006, arapType: 4, arapTypeName: '预付款', amount: 5000.00, balance: 0 }] }
]

export interface WriteOffRecord {
  bizDocId: number
  bizDocNo: string
  bizDocType: number
  bizDocTypeName: string
  tradeTime: string
  accountId: string
  accountName: string
  bizContactId: string
  bizContactName: string
  amount: number
  remark: string
  status: number
  writerTime: string
  writerName: string
  currencyCode: string
  exchangeRate: number
  items?: { arId: number; arAmount: number; apId: number; apAmount: number }[]
}

export const mockWriteOffRecords: WriteOffRecord[] = [
  { bizDocId: 4001, bizDocNo: 'WO202406001', bizDocType: 304, bizDocTypeName: '应收冲应付', tradeTime: '2024-06-08', accountId: '1', accountName: '应收账款', bizContactId: '2', bizContactName: '上海供应商B', amount: 3000.00, remark: '应收应付对冲', status: 0, writerTime: '2024-06-08 11:00:00', writerName: '张三', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arId: 1007, arAmount: 3000.00, apId: 1003, apAmount: 3000.00 }] },
  { bizDocId: 4002, bizDocNo: 'WO202406002', bizDocType: 316, bizDocTypeName: '应付冲应收', tradeTime: '2024-06-14', accountId: '2', accountName: '应付账款', bizContactId: '1', bizContactName: '北京客户A', amount: 2000.00, remark: '应付应收对冲', status: 0, writerTime: '2024-06-14 15:20:00', writerName: '李四', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arId: 1001, arAmount: 2000.00, apId: 1008, apAmount: 2000.00 }] },
  { bizDocId: 4003, bizDocNo: 'WO202406003', bizDocType: 328, bizDocTypeName: '预收冲预付', tradeTime: '2024-06-16', accountId: '3', accountName: '预收账款', bizContactId: '2', bizContactName: '上海供应商B', amount: 5000.00, remark: '预收预付对冲', status: 0, writerTime: '2024-06-16 10:30:00', writerName: '张三', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arId: 1005, arAmount: 5000.00, apId: 1006, apAmount: 5000.00 }] }
]

export interface TransferRecord {
  bizDocId: number
  bizDocNo: string
  bizDocType: number
  bizDocTypeName: string
  tradeTime: string
  bizContactId: string
  bizContactName: string
  categoryId: string
  categoryName: string
  amount: number
  reason: string
  remark: string
  status: number
  writerTime: string
  writerName: string
  currencyCode: string
  exchangeRate: number
  items?: { arapId: number; arapType: number; amount: number }[]
}

export const mockTransferRecords: TransferRecord[] = [
  { bizDocId: 5001, bizDocNo: 'TF202406001', bizDocType: 308, bizDocTypeName: '应收转支出', tradeTime: '2024-06-09', bizContactId: '3', bizContactName: '广州客户C', categoryId: '3', categoryName: '坏账损失', amount: 1000.00, reason: '坏账处理', remark: '客户无力偿还', status: 0, writerTime: '2024-06-09 14:00:00', writerName: '李四', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1002, arapType: 1, amount: 1000.00 }] },
  { bizDocId: 5002, bizDocNo: 'TF202406002', bizDocType: 320, bizDocTypeName: '应付转收入', tradeTime: '2024-06-11', bizContactId: '4', bizContactName: '深圳供应商D', categoryId: '1', categoryName: '营业外收入', amount: 2000.00, reason: '无法支付', remark: '供应商倒闭', status: 0, writerTime: '2024-06-11 09:15:00', writerName: '张三', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1004, arapType: 2, amount: 2000.00 }] },
  { bizDocId: 5003, bizDocNo: 'TF202406003', bizDocType: 332, bizDocTypeName: '预收转收入', tradeTime: '2024-06-17', bizContactId: '1', bizContactName: '北京客户A', categoryId: '1', categoryName: '销售收入', amount: 8000.00, reason: '项目完成', remark: '预收结转', status: 0, writerTime: '2024-06-17 16:00:00', writerName: '李四', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1005, arapType: 3, amount: 8000.00 }] }
]

export interface TransferOffRecord {
  bizDocId: number
  bizDocNo: string
  bizDocType: number
  bizDocTypeName: string
  tradeTime: string
  accountId: string
  accountName: string
  sourceBizContactId: string
  sourceBizContactName: string
  targetBizContactId: string
  targetBizContactName: string
  amount: number
  remark: string
  status: number
  writerTime: string
  writerName: string
  currencyCode: string
  exchangeRate: number
  items?: { arapId: number; amount: number }[]
}

export interface Shareholder {
  id: string
  name: string
  remark: string
  status: number
  createdAt: string
}

export interface ShareChangeListItem {
  bizDocId: number
  bizDocNo: string
  tradeTime: string
  changeType: number
  changeTypeName: string
  shareholder: {
    shareholderId: number
    shareholderName: string
  }
  account: {
    accountId: number
    accountName: string
  }
  amount: number
  currencyCode: string
  exchangeRate: number
  status: number
  writerTime: string
}

export interface ShareChangeDetail {
  bizDocId: number
  bizDocNo: string
  tradeTime: string
  changeType: number
  changeTypeName: string
  shareholderId: number
  shareholderName: string
  accountId: number
  accountName: string
  amount: number
  currencyCode: string
  exchangeRate: number
  remark: string
  writerTime: string
  status: number
  voucher?: {
    voucherId: number
    voucherCode: string
    voucherDate: string
    summary: string
    status: number
  }
  entries?: {
    entryId: number
    subjectId: number
    subjectName: string
    direction: number
    directionName: string
    amount: number
  }[]
}

export interface ShareChangeForm {
  tradeTime: string
  changeType: number
  shareholderId: number
  accountId: number
  amount: number
  currencyCode: string
  exchangeRate: number
  remark?: string
}

export interface VoucherInfo {
  voucherId: string
  voucherCode: string
  voucherDate: string
  summary: string
  status: number
}

export interface VoucherEntry {
  entryId: string
  subjectId: string
  subjectName: string
  direction: number
  amount: number
}

export interface BonusDoc {
  bizDocId: string
  bizDocNo: string
  tradeTime: string
  shareholderId: string
  shareholderName: string
  accountId: string
  accountName: string
  amount: number
  currencyCode: string
  exchangeRate: number
  remark: string
  writerId: string
  writerName: string
  writerTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  status: number
  voucher?: VoucherInfo
  entries?: VoucherEntry[]
}

export const mockShareholders: Shareholder[] = [
  { id: '1', name: '张三', remark: '创始人', status: 1, createdAt: '2024-01-01' },
  { id: '2', name: '李四', remark: '投资人', status: 1, createdAt: '2024-02-15' },
  { id: '3', name: '王五', remark: '合伙人', status: 1, createdAt: '2024-03-20' },
  { id: '4', name: '赵六', remark: '新股东', status: 0, createdAt: '2024-04-01' }
]

export const mockShareChangeDocs: ShareChangeDetail[] = [
  {
    bizDocId: 1001,
    bizDocNo: 'SC-20240401-0001',
    tradeTime: '2024-04-01',
    changeType: 1,
    changeTypeName: '增股',
    shareholderId: 1,
    shareholderName: '张三',
    accountId: 1,
    accountName: '工商银行',
    amount: 500000.00,
    currencyCode: 'CNY',
    exchangeRate: 1.00000000,
    remark: '股东张三增资',
    writerTime: '2024-04-01 14:00:00',
    status: 0,
    voucher: {
      voucherId: 2001,
      voucherCode: '记-202404-001',
      voucherDate: '2024-04-01',
      summary: '股东增资凭证',
      status: 0
    },
    entries: [
      { entryId: 3001, subjectId: 1002, subjectName: '银行存款', direction: 1, directionName: '借', amount: 500000.00 },
      { entryId: 3002, subjectId: 4001, subjectName: '实收资本', direction: 2, directionName: '贷', amount: 500000.00 }
    ]
  },
  {
    bizDocId: 1002,
    bizDocNo: 'SC-20240415-0002',
    tradeTime: '2024-04-15',
    changeType: 1,
    changeTypeName: '增股',
    shareholderId: 2,
    shareholderName: '李四',
    accountId: 1,
    accountName: '工商银行',
    amount: 300000.00,
    currencyCode: 'CNY',
    exchangeRate: 1.00000000,
    remark: '投资人李四增资',
    writerTime: '2024-04-15 10:30:00',
    status: 0,
    voucher: {
      voucherId: 2002,
      voucherCode: '记-202404-002',
      voucherDate: '2024-04-15',
      summary: '股东增资凭证',
      status: 0
    },
    entries: [
      { entryId: 3003, subjectId: 1002, subjectName: '银行存款', direction: 1, directionName: '借', amount: 300000.00 },
      { entryId: 3004, subjectId: 4001, subjectName: '实收资本', direction: 2, directionName: '贷', amount: 300000.00 }
    ]
  },
  {
    bizDocId: 1003,
    bizDocNo: 'SC-20240501-0003',
    tradeTime: '2024-05-01',
    changeType: 2,
    changeTypeName: '减股',
    shareholderId: 3,
    shareholderName: '王五',
    accountId: 2,
    accountName: '现金',
    amount: 100000.00,
    currencyCode: 'CNY',
    exchangeRate: 1.00000000,
    remark: '股东王五减股',
    writerTime: '2024-05-01 09:00:00',
    status: 0,
    voucher: {
      voucherId: 2003,
      voucherCode: '记-202405-001',
      voucherDate: '2024-05-01',
      summary: '股东减资凭证',
      status: 0
    },
    entries: [
      { entryId: 3005, subjectId: 4001, subjectName: '实收资本', direction: 1, directionName: '借', amount: 100000.00 },
      { entryId: 3006, subjectId: 1001, subjectName: '库存现金', direction: 2, directionName: '贷', amount: 100000.00 }
    ]
  },
  {
    bizDocId: 1004,
    bizDocNo: 'SC-20240515-0004',
    tradeTime: '2024-05-15',
    changeType: 1,
    changeTypeName: '增股',
    shareholderId: 4,
    shareholderName: '赵六',
    accountId: 3,
    accountName: '建设银行',
    amount: 200000.00,
    currencyCode: 'CNY',
    exchangeRate: 1.00000000,
    remark: '新股东赵六入股',
    writerTime: '2024-05-15 16:00:00',
    status: 0
  },
  {
    bizDocId: 1005,
    bizDocNo: 'SC-20240601-0005',
    tradeTime: '2024-06-01',
    changeType: 2,
    changeTypeName: '减股',
    shareholderId: 1,
    shareholderName: '张三',
    accountId: 1,
    accountName: '工商银行',
    amount: 150000.00,
    currencyCode: 'CNY',
    exchangeRate: 1.00000000,
    remark: '股东张三部分减资',
    writerTime: '2024-06-01 11:30:00',
    status: -1
  }
]

export const mockBonusDocs: BonusDoc[] = [
  { bizDocId: '1', bizDocNo: 'BO202406001', tradeTime: '2024-06-01', shareholderId: '1', shareholderName: '张三', accountId: '1', accountName: '工商银行', amount: 50000.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '2024年第一季度分红', writerId: '1', writerName: '张三', writerTime: '2024-06-01 10:00:00', updateId: null, updateName: '', updateTime: null, status: 0, voucher: { voucherId: 'V001', voucherCode: '记-202406-001', voucherDate: '2024-06-01', summary: '股东分红凭证', status: 0 }, entries: [{ entryId: 'E001', subjectId: '4103', subjectName: '利润分配', direction: 1, amount: 50000.00 }, { entryId: 'E002', subjectId: '1002', subjectName: '银行存款', direction: 2, amount: 50000.00 }] },
  { bizDocId: '2', bizDocNo: 'BO202406002', tradeTime: '2024-06-05', shareholderId: '2', shareholderName: '李四', accountId: '1', accountName: '工商银行', amount: 30000.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '2024年第一季度分红', writerId: '1', writerName: '张三', writerTime: '2024-06-05 14:30:00', updateId: '2', updateName: '李四', updateTime: '2024-06-05 15:00:00', status: 0, voucher: { voucherId: 'V002', voucherCode: '记-202406-002', voucherDate: '2024-06-05', summary: '股东分红凭证', status: 0 }, entries: [{ entryId: 'E003', subjectId: '4103', subjectName: '利润分配', direction: 1, amount: 30000.00 }, { entryId: 'E004', subjectId: '1002', subjectName: '银行存款', direction: 2, amount: 30000.00 }] },
  { bizDocId: '3', bizDocNo: 'BO202406003', tradeTime: '2024-06-10', shareholderId: '3', shareholderName: '王五', accountId: '2', accountName: '现金', amount: 20000.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '2024年第一季度分红', writerId: '2', writerName: '李四', writerTime: '2024-06-10 09:15:00', updateId: null, updateName: '', updateTime: null, status: 0, voucher: { voucherId: 'V003', voucherCode: '记-202406-003', voucherDate: '2024-06-10', summary: '股东分红凭证', status: 0 }, entries: [{ entryId: 'E005', subjectId: '4103', subjectName: '利润分配', direction: 1, amount: 20000.00 }, { entryId: 'E006', subjectId: '1001', subjectName: '库存现金', direction: 2, amount: 20000.00 }] },
  { bizDocId: '4', bizDocNo: 'BO202406004', tradeTime: '2024-06-15', shareholderId: '1', shareholderName: '张三', accountId: '3', accountName: '建设银行', amount: 40000.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '2024年第二季度分红', writerId: '1', writerName: '张三', writerTime: '2024-06-15 11:00:00', updateId: null, updateName: '', updateTime: null, status: 0 },
  { bizDocId: '5', bizDocNo: 'BO202406005', tradeTime: '2024-06-18', shareholderId: '2', shareholderName: '李四', accountId: '1', accountName: '工商银行', amount: 25000.00, currencyCode: 'CNY', exchangeRate: 1.00000000, remark: '2024年第二季度分红', writerId: '2', writerName: '李四', writerTime: '2024-06-18 16:00:00', updateId: null, updateName: '', updateTime: null, status: -1 }
]

export const mockTransferOffRecords: TransferOffRecord[] = [
  { bizDocId: 6001, bizDocNo: 'TO202406001', bizDocType: 310, bizDocTypeName: '应收款转销', tradeTime: '2024-06-07', accountId: '1', accountName: '应收账款', sourceBizContactId: '3', sourceBizContactName: '广州客户C', targetBizContactId: '1', targetBizContactName: '北京客户A', amount: 5000.00, remark: '债务转移', status: 0, writerTime: '2024-06-07 11:30:00', writerName: '张三', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1002, amount: 5000.00 }] },
  { bizDocId: 6002, bizDocNo: 'TO202406002', bizDocType: 322, bizDocTypeName: '应付款转销', tradeTime: '2024-06-13', accountId: '2', accountName: '应付账款', sourceBizContactId: '4', sourceBizContactName: '深圳供应商D', targetBizContactId: '2', targetBizContactName: '上海供应商B', amount: 3000.00, remark: '债权转移', status: 0, writerTime: '2024-06-13 14:45:00', writerName: '李四', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1004, amount: 3000.00 }] },
  { bizDocId: 6003, bizDocNo: 'TO202406003', bizDocType: 334, bizDocTypeName: '预收款转销', tradeTime: '2024-06-19', accountId: '3', accountName: '预收账款', sourceBizContactId: '1', sourceBizContactName: '北京客户A', targetBizContactId: '3', targetBizContactName: '广州客户C', amount: 2000.00, remark: '客户变更', status: 0, writerTime: '2024-06-19 10:00:00', writerName: '张三', currencyCode: 'CNY', exchangeRate: 1.00000000, items: [{ arapId: 1005, amount: 2000.00 }] }
]

export interface OperationType {
  code: string
  label: string
  type: 'receipt' | 'writeOff' | 'transfer' | 'transferOff' | 'convert'
}

export const arapOperations: Record<number, OperationType[]> = {
  1: [
    { code: 'receipt', label: '收款', type: 'receipt' },
    { code: 'writeOff_ar_ap', label: '应收冲应付', type: 'writeOff' },
    { code: 'writeOff_ar_pre', label: '应收冲预收', type: 'writeOff' },
    { code: 'transfer_ar_expense', label: '转支出', type: 'transfer' },
    { code: 'transferOff', label: '应收转销', type: 'transferOff' }
  ],
  2: [
    { code: 'payment', label: '付款', type: 'receipt' },
    { code: 'writeOff_ap_ar', label: '应付冲应收', type: 'writeOff' },
    { code: 'writeOff_ap_prepay', label: '应付冲预付', type: 'writeOff' },
    { code: 'transfer_ap_income', label: '转收入', type: 'transfer' },
    { code: 'transferOff', label: '应付转销', type: 'transferOff' }
  ],
  3: [
    { code: 'refund_pre', label: '预收款退回', type: 'receipt' },
    { code: 'writeOff_pre_ar', label: '预收冲应收', type: 'writeOff' },
    { code: 'writeOff_pre_prepay', label: '预收冲预付', type: 'writeOff' },
    { code: 'transfer_pre_income', label: '预收转收入', type: 'transfer' },
    { code: 'transferOff', label: '预收转销', type: 'transferOff' }
  ],
  4: [
    { code: 'refund_prepay', label: '预付款退回', type: 'receipt' },
    { code: 'writeOff_prepay_ap', label: '预付冲应付', type: 'writeOff' },
    { code: 'writeOff_prepay_pre', label: '预付冲预收', type: 'writeOff' },
    { code: 'transfer_prepay_expense', label: '预付转支出', type: 'transfer' },
    { code: 'transferOff', label: '预付转销', type: 'transferOff' }
  ],
  5: [
    { code: 'repay_borrowed', label: '借入款归还', type: 'receipt' },
    { code: 'writeOff_borrowed_ar', label: '借入冲应收', type: 'writeOff' },
    { code: 'writeOff_borrowed_ap', label: '借入冲应付', type: 'writeOff' },
    { code: 'transfer_borrowed_income', label: '借入转收入', type: 'transfer' },
    { code: 'transferOff', label: '借入转销', type: 'transferOff' }
  ],
  6: [
    { code: 'collect_loaned', label: '借出款收回', type: 'receipt' },
    { code: 'writeOff_loaned_ar', label: '借出冲应收', type: 'writeOff' },
    { code: 'writeOff_loaned_ap', label: '借出冲应付', type: 'writeOff' },
    { code: 'transfer_loaned_expense', label: '借出转支出', type: 'transfer' },
    { code: 'transferOff', label: '借出转销', type: 'transferOff' }
  ]
}

export interface AssetCategory {
  id: string
  name: string
  defaultLife: number
  defaultSalvageRate: number
}

export interface FixedAssetCard {
  assetId: string
  assetNo: string
  assetName: string
  categoryId: string
  categoryName: string
  specModel: string
  originalValue: number
  salvageRate: number
  salvageValue: number
  usefulLife: number
  monthlyDepreciation: number
  accumulatedDepreciation: number
  netValue: number
  purchaseDate: string
  startDate: string
  deptId: string
  deptName: string
  staffId: string
  staffName: string
  location: string
  status: number
  statusName: string
  remark: string
  createTime: string
}

export interface FixedAssetPurchase {
  bizDocId: string
  bizDocNo: string
  tradeTime: string
  accountId: string
  accountName: string
  amount: number
  supplierId: string
  supplierName: string
  remark: string
  status: number
  voucherId: string
  voucherNo: string
  assetList: FixedAssetCard[]
}

export interface DepreciationDetail {
  detailId: string
  assetId: string
  assetNo: string
  assetName: string
  depreciationYear: number
  depreciationMonth: number
  depreciationPeriod: string
  currentDepreciation: number
  accumulatedDepreciation: number
  netValue: number
  deptId: string
  deptName: string
  voucherNo: string
}

export interface AssetDisposal {
  disposalId: string
  bizDocId: string
  bizDocNo: string
  disposalDate: string
  disposalType: number
  disposalTypeName: string
  assetId: string
  assetNo: string
  assetName: string
  originalValue: number
  accumulatedDepreciation: number
  netValue: number
  disposalAmount: number
  gainLossAmount: number
  accountId: string
  accountName: string
  disposalReason: string
  remark: string
  voucherId: string
  voucherNo: string
}

export const mockAssetCategories: AssetCategory[] = [
  { id: '1', name: '房屋建筑物', defaultLife: 20, defaultSalvageRate: 0.05 },
  { id: '2', name: '机器设备', defaultLife: 10, defaultSalvageRate: 0.05 },
  { id: '3', name: '运输工具', defaultLife: 5, defaultSalvageRate: 0.05 },
  { id: '4', name: '电子设备', defaultLife: 3, defaultSalvageRate: 0.05 },
  { id: '5', name: '办公家具', defaultLife: 5, defaultSalvageRate: 0.05 }
]

export const mockFixedAssets: FixedAssetCard[] = [
  { assetId: '1', assetNo: 'GDZC-20240115-0001', assetName: '联想笔记本电脑', categoryId: '4', categoryName: '电子设备', specModel: 'ThinkPad X1 Carbon', originalValue: 8000.00, salvageRate: 0.05, salvageValue: 400.00, usefulLife: 3, monthlyDepreciation: 211.11, accumulatedDepreciation: 1266.66, netValue: 6733.34, purchaseDate: '2024-01-15', startDate: '2024-01-16', deptId: '1', deptName: '财务部', staffId: '1', staffName: '张三', location: '办公室A区', status: 0, statusName: '在用', remark: '财务主管使用', createTime: '2024-01-15 10:30:00' },
  { assetId: '2', assetNo: 'GDZC-20240115-0002', assetName: 'Dell服务器', categoryId: '2', categoryName: '机器设备', specModel: 'PowerEdge R740', originalValue: 35000.00, salvageRate: 0.05, salvageValue: 1750.00, usefulLife: 10, monthlyDepreciation: 277.08, accumulatedDepreciation: 1662.48, netValue: 33337.52, purchaseDate: '2024-01-15', startDate: '2024-01-20', deptId: '3', deptName: '技术部', staffId: '4', staffName: '赵六', location: '机房', status: 0, statusName: '在用', remark: '生产服务器', createTime: '2024-01-15 11:00:00' },
  { assetId: '3', assetNo: 'GDZC-20240220-0001', assetName: '丰田凯美瑞', categoryId: '3', categoryName: '运输工具', specModel: '2.5G豪华版', originalValue: 220000.00, salvageRate: 0.05, salvageValue: 11000.00, usefulLife: 5, monthlyDepreciation: 3483.33, accumulatedDepreciation: 13933.32, netValue: 206066.68, purchaseDate: '2024-02-20', startDate: '2024-02-25', deptId: '2', deptName: '销售部', staffId: '3', staffName: '王五', location: '公司车库', status: 0, statusName: '在用', remark: '销售总监用车', createTime: '2024-02-20 14:00:00' },
  { assetId: '4', assetNo: 'GDZC-20240301-0001', assetName: '办公桌椅一套', categoryId: '5', categoryName: '办公家具', specModel: 'Herman Miller', originalValue: 5000.00, salvageRate: 0.05, salvageValue: 250.00, usefulLife: 5, monthlyDepreciation: 79.17, accumulatedDepreciation: 395.85, netValue: 4604.15, purchaseDate: '2024-03-01', startDate: '2024-03-05', deptId: '1', deptName: '财务部', staffId: '2', staffName: '李四', location: '办公室B区', status: 0, statusName: '在用', remark: '', createTime: '2024-03-01 09:00:00' },
  { assetId: '5', assetNo: 'GDZC-20240315-0001', assetName: 'HP打印机', categoryId: '4', categoryName: '电子设备', specModel: 'LaserJet Pro M404dn', originalValue: 3500.00, salvageRate: 0.05, salvageValue: 175.00, usefulLife: 3, monthlyDepreciation: 94.44, accumulatedDepreciation: 377.76, netValue: 3122.24, purchaseDate: '2024-03-15', startDate: '2024-03-16', deptId: '1', deptName: '财务部', staffId: '', staffName: '', location: '打印室', status: 0, statusName: '在用', remark: '公用设备', createTime: '2024-03-15 15:30:00' },
  { assetId: '6', assetNo: 'GDZC-20240401-0001', assetName: '会议室投影仪', categoryId: '4', categoryName: '电子设备', specModel: 'Epson CB-FH52', originalValue: 8500.00, salvageRate: 0.05, salvageValue: 425.00, usefulLife: 3, monthlyDepreciation: 226.39, accumulatedDepreciation: 452.78, netValue: 8047.22, purchaseDate: '2024-04-01', startDate: '2024-04-05', deptId: '4', deptName: '市场部', staffId: '', staffName: '', location: '大会议室', status: 1, statusName: '闲置', remark: '新采购未启用', createTime: '2024-04-01 10:00:00' },
  { assetId: '7', assetNo: 'GDZC-20240410-0001', assetName: '空调机组', categoryId: '2', categoryName: '机器设备', specModel: '美的MDV-450W/D2SN1-8V1', originalValue: 45000.00, salvageRate: 0.05, salvageValue: 2250.00, usefulLife: 10, monthlyDepreciation: 356.25, accumulatedDepreciation: 712.50, netValue: 44287.50, purchaseDate: '2024-04-10', startDate: '2024-04-15', deptId: '3', deptName: '技术部', staffId: '', staffName: '', location: '机房', status: 0, statusName: '在用', remark: '机房专用空调', createTime: '2024-04-10 14:30:00' },
  { assetId: '8', assetNo: 'GDZC-20240501-0001', assetName: '办公桌', categoryId: '5', categoryName: '办公家具', specModel: 'Steelcase', originalValue: 2000.00, salvageRate: 0.05, salvageValue: 100.00, usefulLife: 5, monthlyDepreciation: 31.67, accumulatedDepreciation: 31.67, netValue: 1968.33, purchaseDate: '2024-05-01', startDate: '2024-05-05', deptId: '2', deptName: '销售部', staffId: '', staffName: '', location: '销售办公室', status: 0, statusName: '在用', remark: '', createTime: '2024-05-01 09:00:00' },
  { assetId: '9', assetNo: 'GDZC-20240515-0001', assetName: '苹果MacBook Pro', categoryId: '4', categoryName: '电子设备', specModel: '14-inch M3 Pro', originalValue: 16999.00, salvageRate: 0.05, salvageValue: 849.95, usefulLife: 3, monthlyDepreciation: 459.03, accumulatedDepreciation: 0, netValue: 16999.00, purchaseDate: '2024-05-15', startDate: '2024-05-16', deptId: '3', deptName: '技术部', staffId: '4', staffName: '赵六', location: '办公室C区', status: 0, statusName: '在用', remark: '技术总监专用', createTime: '2024-05-15 11:00:00' },
  { assetId: '10', assetNo: 'GDZC-20240601-0001', assetName: '扫描仪', categoryId: '4', categoryName: '电子设备', specModel: 'Fujitsu ScanSnap iX1600', originalValue: 2500.00, salvageRate: 0.05, salvageValue: 125.00, usefulLife: 3, monthlyDepreciation: 66.67, accumulatedDepreciation: 0, netValue: 2500.00, purchaseDate: '2024-06-01', startDate: '2024-06-02', deptId: '1', deptName: '财务部', staffId: '', staffName: '', location: '财务办公室', status: 0, statusName: '在用', remark: '新采购', createTime: '2024-06-01 16:00:00' },
  { assetId: '11', assetNo: 'GDZC-20230101-0001', assetName: '办公大楼', categoryId: '1', categoryName: '房屋建筑物', specModel: '', originalValue: 5000000.00, salvageRate: 0.05, salvageValue: 250000.00, usefulLife: 20, monthlyDepreciation: 19791.67, accumulatedDepreciation: 277083.38, netValue: 4722916.62, purchaseDate: '2023-01-01', startDate: '2023-01-01', deptId: '', deptName: '', staffId: '', staffName: '', location: '总部大楼', status: 0, statusName: '在用', remark: '公司总部办公楼', createTime: '2023-01-01 00:00:00' },
  { assetId: '12', assetNo: 'GDZC-20220615-0001', assetName: '旧打印机', categoryId: '4', categoryName: '电子设备', specModel: 'HP LaserJet P2055', originalValue: 2000.00, salvageRate: 0.05, salvageValue: 100.00, usefulLife: 3, monthlyDepreciation: 52.78, accumulatedDepreciation: 2000.00, netValue: 0, purchaseDate: '2022-06-15', startDate: '2022-06-20', deptId: '1', deptName: '财务部', staffId: '', staffName: '', location: '', status: 2, statusName: '已处置', remark: '已报废', createTime: '2022-06-15 10:00:00' }
]

export const mockFixedAssetPurchases: FixedAssetPurchase[] = [
  { bizDocId: '1', bizDocNo: 'CG-20240115-0001', tradeTime: '2024-01-15', accountId: '1', accountName: '工商银行', amount: 43000.00, supplierId: '2', supplierName: '上海供应商B', remark: 'IT设备采购', status: 1, voucherId: 'V001', voucherNo: '记-202401-001', assetList: [mockFixedAssets[0], mockFixedAssets[1]] },
  { bizDocId: '2', bizDocNo: 'CG-20240220-0001', tradeTime: '2024-02-20', accountId: '1', accountName: '工商银行', amount: 220000.00, supplierId: '4', supplierName: '深圳供应商D', remark: '公司车辆采购', status: 1, voucherId: 'V002', voucherNo: '记-202402-001', assetList: [mockFixedAssets[2]] },
  { bizDocId: '3', bizDocNo: 'CG-20240301-0001', tradeTime: '2024-03-01', accountId: '2', accountName: '现金', amount: 5000.00, supplierId: '2', supplierName: '上海供应商B', remark: '办公家具', status: 1, voucherId: 'V003', voucherNo: '记-202403-001', assetList: [mockFixedAssets[3]] },
  { bizDocId: '4', bizDocNo: 'CG-20240410-0001', tradeTime: '2024-04-10', accountId: '1', accountName: '工商银行', amount: 45000.00, supplierId: '2', supplierName: '上海供应商B', remark: '机房空调', status: 1, voucherId: 'V004', voucherNo: '记-202404-001', assetList: [mockFixedAssets[6]] },
  { bizDocId: '5', bizDocNo: 'CG-20240601-0001', tradeTime: '2024-06-01', accountId: '3', accountName: '建设银行', amount: 2500.00, supplierId: '4', supplierName: '深圳供应商D', remark: '办公设备', status: 0, voucherId: '', voucherNo: '', assetList: [mockFixedAssets[9]] }
]

export interface SalaryAccruedDetail {
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

export interface SalaryAccrued {
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
  items: SalaryAccruedDetail[]
  voucher?: { voucherId: number; voucherCode: string; voucherDate: string; amount: number }
  issueInfo?: { issueCount: number; issuedAmount: number }
}

export interface SalaryIssueDetail {
  itemId: number
  staffId: number
  staffName: string
  deptId: number
  deptName: string
  netAmount: number
  accruedAmount: number
  remark: string
}

export interface SalaryIssue {
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
  items: SalaryIssueDetail[]
  voucher?: { voucherId: number; voucherCode: string; voucherDate: string; amount: number }
}

export const mockSalaryAccruedList: SalaryAccrued[] = [
  {
    bizDocId: 10001,
    bizDocNo: 'SAC-20260317-0001',
    bizDocType: 270,
    salaryPeriod: '2026-03',
    tradeTime: '2026-03-31',
    grossAmount: 21000.00,
    taxAmount: 800.00,
    otherAmount: 3200.00,
    amount: 17000.00,
    docStatus: 1,
    docStatusName: '已确认',
    remark: '3月份工资计提',
    writerName: '张三',
    writerTime: '2026-03-17 10:30:00',
    items: [
      {
        itemId: 1,
        staffId: 2001,
        staffName: '李四',
        deptId: 101,
        deptName: '销售部',
        categoryId: 1001,
        categoryName: '销售费用-工资',
        baseSalary: 8000.00,
        positionAllowance: 1000.00,
        performanceBonus: 2000.00,
        otherSubsidy: 0,
        grossAmount: 11000.00,
        socialSecurity: 800.00,
        housingFund: 600.00,
        personalTax: 300.00,
        otherDeduction: 0,
        deductionTotal: 1700.00,
        netAmount: 9300.00,
        remark: ''
      },
      {
        itemId: 2,
        staffId: 2002,
        staffName: '王五',
        deptId: 102,
        deptName: '技术部',
        categoryId: 1002,
        categoryName: '管理费用-工资',
        baseSalary: 10000.00,
        positionAllowance: 0,
        performanceBonus: 0,
        otherSubsidy: 0,
        grossAmount: 10000.00,
        socialSecurity: 1000.00,
        housingFund: 800.00,
        personalTax: 500.00,
        otherDeduction: 0,
        deductionTotal: 2300.00,
        netAmount: 7700.00,
        remark: ''
      }
    ],
    voucher: { voucherId: 5001, voucherCode: '记-202603-001', voucherDate: '2026-03-31', amount: 21000.00 },
    issueInfo: { issueCount: 1, issuedAmount: 17000.00 }
  },
  {
    bizDocId: 10002,
    bizDocNo: 'SAC-20260410-0001',
    bizDocType: 270,
    salaryPeriod: '2026-04',
    tradeTime: '2026-04-30',
    grossAmount: 25000.00,
    taxAmount: 1000.00,
    otherAmount: 4000.00,
    amount: 20000.00,
    docStatus: 1,
    docStatusName: '已确认',
    remark: '4月份工资计提',
    writerName: '李四',
    writerTime: '2026-04-10 14:00:00',
    items: [
      {
        itemId: 3,
        staffId: 2001,
        staffName: '李四',
        deptId: 101,
        deptName: '销售部',
        categoryId: 1001,
        categoryName: '销售费用-工资',
        baseSalary: 8500.00,
        positionAllowance: 1000.00,
        performanceBonus: 2500.00,
        otherSubsidy: 0,
        grossAmount: 12000.00,
        socialSecurity: 850.00,
        housingFund: 650.00,
        personalTax: 400.00,
        otherDeduction: 0,
        deductionTotal: 1900.00,
        netAmount: 10100.00,
        remark: ''
      },
      {
        itemId: 4,
        staffId: 2002,
        staffName: '王五',
        deptId: 102,
        deptName: '技术部',
        categoryId: 1002,
        categoryName: '管理费用-工资',
        baseSalary: 10000.00,
        positionAllowance: 2000.00,
        performanceBonus: 1000.00,
        otherSubsidy: 0,
        grossAmount: 13000.00,
        socialSecurity: 1000.00,
        housingFund: 800.00,
        personalTax: 600.00,
        otherDeduction: 0,
        deductionTotal: 2400.00,
        netAmount: 10600.00,
        remark: ''
      }
    ],
    voucher: { voucherId: 5002, voucherCode: '记-202604-001', voucherDate: '2026-04-30', amount: 25000.00 },
    issueInfo: { issueCount: 0, issuedAmount: 0 }
  },
  {
    bizDocId: 10003,
    bizDocNo: 'SAC-20260508-0001',
    bizDocType: 270,
    salaryPeriod: '2026-05',
    tradeTime: '2026-05-31',
    grossAmount: 28000.00,
    taxAmount: 1200.00,
    otherAmount: 4500.00,
    amount: 22300.00,
    docStatus: 0,
    docStatusName: '草稿',
    remark: '5月份工资计提',
    writerName: '张三',
    writerTime: '2026-05-08 09:30:00',
    items: [
      {
        itemId: 5,
        staffId: 2001,
        staffName: '李四',
        deptId: 101,
        deptName: '销售部',
        categoryId: 1001,
        categoryName: '销售费用-工资',
        baseSalary: 9000.00,
        positionAllowance: 1000.00,
        performanceBonus: 3000.00,
        otherSubsidy: 0,
        grossAmount: 13000.00,
        socialSecurity: 900.00,
        housingFund: 700.00,
        personalTax: 500.00,
        otherDeduction: 0,
        deductionTotal: 2100.00,
        netAmount: 10900.00,
        remark: ''
      },
      {
        itemId: 6,
        staffId: 2002,
        staffName: '王五',
        deptId: 102,
        deptName: '技术部',
        categoryId: 1002,
        categoryName: '管理费用-工资',
        baseSalary: 10000.00,
        positionAllowance: 3000.00,
        performanceBonus: 2000.00,
        otherSubsidy: 0,
        grossAmount: 15000.00,
        socialSecurity: 1000.00,
        housingFund: 800.00,
        personalTax: 700.00,
        otherDeduction: 0,
        deductionTotal: 2500.00,
        netAmount: 12500.00,
        remark: ''
      }
    ]
  },
  {
    bizDocId: 10004,
    bizDocNo: 'SAC-20260215-0001',
    bizDocType: 270,
    salaryPeriod: '2026-02',
    tradeTime: '2026-02-28',
    grossAmount: 19000.00,
    taxAmount: 700.00,
    otherAmount: 3000.00,
    amount: 15300.00,
    docStatus: 2,
    docStatusName: '已作废',
    remark: '2月份工资计提-已作废',
    writerName: '张三',
    writerTime: '2026-02-15 11:00:00',
    items: [
      {
        itemId: 7,
        staffId: 2001,
        staffName: '李四',
        deptId: 101,
        deptName: '销售部',
        categoryId: 1001,
        categoryName: '销售费用-工资',
        baseSalary: 7500.00,
        positionAllowance: 1000.00,
        performanceBonus: 1500.00,
        otherSubsidy: 0,
        grossAmount: 10000.00,
        socialSecurity: 750.00,
        housingFund: 550.00,
        personalTax: 250.00,
        otherDeduction: 0,
        deductionTotal: 1550.00,
        netAmount: 8450.00,
        remark: ''
      },
      {
        itemId: 8,
        staffId: 2002,
        staffName: '王五',
        deptId: 102,
        deptName: '技术部',
        categoryId: 1002,
        categoryName: '管理费用-工资',
        baseSalary: 9000.00,
        positionAllowance: 0,
        performanceBonus: 0,
        otherSubsidy: 0,
        grossAmount: 9000.00,
        socialSecurity: 900.00,
        housingFund: 700.00,
        personalTax: 450.00,
        otherDeduction: 0,
        deductionTotal: 2050.00,
        netAmount: 6950.00,
        remark: ''
      }
    ],
    voucher: { voucherId: 5003, voucherCode: '记-202602-001', voucherDate: '2026-02-28', amount: 19000.00 }
  }
]

export const mockSalaryIssueList: SalaryIssue[] = [
  {
    bizDocId: 20001,
    bizDocNo: 'SIS-20260410-0001',
    bizDocType: 271,
    salaryPeriod: '2026-03',
    accruedId: 10001,
    accruedNo: 'SAC-20260317-0001',
    accountId: 1001,
    accountName: '工商银行基本户',
    tradeTime: '2026-04-10',
    amount: 17000.00,
    docStatus: 1,
    docStatusName: '已发放',
    remark: '3月份工资发放',
    writerName: '张三',
    writerTime: '2026-04-10 10:30:00',
    items: [
      {
        itemId: 1,
        staffId: 2001,
        staffName: '李四',
        deptId: 101,
        deptName: '销售部',
        netAmount: 9300.00,
        accruedAmount: 9300.00,
        remark: ''
      },
      {
        itemId: 2,
        staffId: 2002,
        staffName: '王五',
        deptId: 102,
        deptName: '技术部',
        netAmount: 7700.00,
        accruedAmount: 7700.00,
        remark: ''
      }
    ],
    voucher: { voucherId: 5004, voucherCode: '记-202604-002', voucherDate: '2026-04-10', amount: 17000.00 }
  },
  {
    bizDocId: 20002,
    bizDocNo: 'SIS-20260515-0001',
    bizDocType: 271,
    salaryPeriod: '2026-04',
    accruedId: 10002,
    accruedNo: 'SAC-20260410-0001',
    accountId: 1001,
    accountName: '工商银行基本户',
    tradeTime: '2026-05-15',
    amount: 20000.00,
    docStatus: 0,
    docStatusName: '草稿',
    remark: '4月份工资发放',
    writerName: '李四',
    writerTime: '2026-05-15 14:00:00',
    items: [
      {
        itemId: 3,
        staffId: 2001,
        staffName: '李四',
        deptId: 101,
        deptName: '销售部',
        netAmount: 10100.00,
        accruedAmount: 10100.00,
        remark: ''
      },
      {
        itemId: 4,
        staffId: 2002,
        staffName: '王五',
        deptId: 102,
        deptName: '技术部',
        netAmount: 9900.00,
        accruedAmount: 10600.00,
        remark: '绩效调整'
      }
    ]
  },
  {
    bizDocId: 20003,
    bizDocNo: 'SIS-20260120-0001',
    bizDocType: 271,
    salaryPeriod: '2026-01',
    accruedId: 0,
    accruedNo: '',
    accountId: 1002,
    accountName: '现金',
    tradeTime: '2026-01-20',
    amount: 15000.00,
    docStatus: 2,
    docStatusName: '已作废',
    remark: '1月份工资发放-已作废',
    writerName: '张三',
    writerTime: '2026-01-20 09:00:00',
    items: [
      {
        itemId: 5,
        staffId: 2001,
        staffName: '李四',
        deptId: 101,
        deptName: '销售部',
        netAmount: 8000.00,
        accruedAmount: 0,
        remark: ''
      },
      {
        itemId: 6,
        staffId: 2002,
        staffName: '王五',
        deptId: 102,
        deptName: '技术部',
        netAmount: 7000.00,
        accruedAmount: 0,
        remark: ''
      }
    ],
    voucher: { voucherId: 5005, voucherCode: '记-202601-001', voucherDate: '2026-01-20', amount: 15000.00 }
  }
]

export const mockDepreciationDetails: DepreciationDetail[] = [
  { detailId: '1', assetId: '1', assetNo: 'GDZC-20240115-0001', assetName: '联想笔记本电脑', depreciationYear: 2024, depreciationMonth: 2, depreciationPeriod: '2024-02', currentDepreciation: 211.11, accumulatedDepreciation: 211.11, netValue: 7788.89, deptId: '1', deptName: '财务部', voucherNo: '记-202402-001' },
  { detailId: '2', assetId: '1', assetNo: 'GDZC-20240115-0001', assetName: '联想笔记本电脑', depreciationYear: 2024, depreciationMonth: 3, depreciationPeriod: '2024-03', currentDepreciation: 211.11, accumulatedDepreciation: 422.22, netValue: 7577.78, deptId: '1', deptName: '财务部', voucherNo: '记-202403-001' },
  { detailId: '3', assetId: '1', assetNo: 'GDZC-20240115-0001', assetName: '联想笔记本电脑', depreciationYear: 2024, depreciationMonth: 4, depreciationPeriod: '2024-04', currentDepreciation: 211.11, accumulatedDepreciation: 633.33, netValue: 7366.67, deptId: '1', deptName: '财务部', voucherNo: '记-202404-001' },
  { detailId: '4', assetId: '1', assetNo: 'GDZC-20240115-0001', assetName: '联想笔记本电脑', depreciationYear: 2024, depreciationMonth: 5, depreciationPeriod: '2024-05', currentDepreciation: 211.11, accumulatedDepreciation: 844.44, netValue: 7155.56, deptId: '1', deptName: '财务部', voucherNo: '记-202405-001' },
  { detailId: '5', assetId: '1', assetNo: 'GDZC-20240115-0001', assetName: '联想笔记本电脑', depreciationYear: 2024, depreciationMonth: 6, depreciationPeriod: '2024-06', currentDepreciation: 211.11, accumulatedDepreciation: 1055.55, netValue: 6944.45, deptId: '1', deptName: '财务部', voucherNo: '记-202406-001' },
  { detailId: '6', assetId: '1', assetNo: 'GDZC-20240115-0001', assetName: '联想笔记本电脑', depreciationYear: 2024, depreciationMonth: 7, depreciationPeriod: '2024-07', currentDepreciation: 211.11, accumulatedDepreciation: 1266.66, netValue: 6733.34, deptId: '1', deptName: '财务部', voucherNo: '记-202407-001' },
  { detailId: '7', assetId: '2', assetNo: 'GDZC-20240115-0002', assetName: 'Dell服务器', depreciationYear: 2024, depreciationMonth: 2, depreciationPeriod: '2024-02', currentDepreciation: 277.08, accumulatedDepreciation: 277.08, netValue: 34722.92, deptId: '3', deptName: '技术部', voucherNo: '记-202402-001' },
  { detailId: '8', assetId: '2', assetNo: 'GDZC-20240115-0002', assetName: 'Dell服务器', depreciationYear: 2024, depreciationMonth: 3, depreciationPeriod: '2024-03', currentDepreciation: 277.08, accumulatedDepreciation: 554.16, netValue: 34445.84, deptId: '3', deptName: '技术部', voucherNo: '记-202403-001' },
  { detailId: '9', assetId: '2', assetNo: 'GDZC-20240115-0002', assetName: 'Dell服务器', depreciationYear: 2024, depreciationMonth: 4, depreciationPeriod: '2024-04', currentDepreciation: 277.08, accumulatedDepreciation: 831.24, netValue: 34168.76, deptId: '3', deptName: '技术部', voucherNo: '记-202404-001' },
  { detailId: '10', assetId: '2', assetNo: 'GDZC-20240115-0002', assetName: 'Dell服务器', depreciationYear: 2024, depreciationMonth: 5, depreciationPeriod: '2024-05', currentDepreciation: 277.08, accumulatedDepreciation: 1108.32, netValue: 33891.68, deptId: '3', deptName: '技术部', voucherNo: '记-202405-001' },
  { detailId: '11', assetId: '2', assetNo: 'GDZC-20240115-0002', assetName: 'Dell服务器', depreciationYear: 2024, depreciationMonth: 6, depreciationPeriod: '2024-06', currentDepreciation: 277.08, accumulatedDepreciation: 1385.40, netValue: 33614.60, deptId: '3', deptName: '技术部', voucherNo: '记-202406-001' },
  { detailId: '12', assetId: '2', assetNo: 'GDZC-20240115-0002', assetName: 'Dell服务器', depreciationYear: 2024, depreciationMonth: 7, depreciationPeriod: '2024-07', currentDepreciation: 277.08, accumulatedDepreciation: 1662.48, netValue: 33337.52, deptId: '3', deptName: '技术部', voucherNo: '记-202407-001' },
  { detailId: '13', assetId: '3', assetNo: 'GDZC-20240220-0001', assetName: '丰田凯美瑞', depreciationYear: 2024, depreciationMonth: 3, depreciationPeriod: '2024-03', currentDepreciation: 3483.33, accumulatedDepreciation: 3483.33, netValue: 216516.67, deptId: '2', deptName: '销售部', voucherNo: '记-202403-001' },
  { detailId: '14', assetId: '3', assetNo: 'GDZC-20240220-0001', assetName: '丰田凯美瑞', depreciationYear: 2024, depreciationMonth: 4, depreciationPeriod: '2024-04', currentDepreciation: 3483.33, accumulatedDepreciation: 6966.66, netValue: 213033.34, deptId: '2', deptName: '销售部', voucherNo: '记-202404-001' },
  { detailId: '15', assetId: '3', assetNo: 'GDZC-20240220-0001', assetName: '丰田凯美瑞', depreciationYear: 2024, depreciationMonth: 5, depreciationPeriod: '2024-05', currentDepreciation: 3483.33, accumulatedDepreciation: 10449.99, netValue: 209550.01, deptId: '2', deptName: '销售部', voucherNo: '记-202405-001' },
  { detailId: '16', assetId: '3', assetNo: 'GDZC-20240220-0001', assetName: '丰田凯美瑞', depreciationYear: 2024, depreciationMonth: 6, depreciationPeriod: '2024-06', currentDepreciation: 3483.33, accumulatedDepreciation: 13933.32, netValue: 206066.68, deptId: '2', deptName: '销售部', voucherNo: '记-202406-001' },
  { detailId: '17', assetId: '3', assetNo: 'GDZC-20240220-0001', assetName: '丰田凯美瑞', depreciationYear: 2024, depreciationMonth: 7, depreciationPeriod: '2024-07', currentDepreciation: 3483.33, accumulatedDepreciation: 17416.65, netValue: 202583.35, deptId: '2', deptName: '销售部', voucherNo: '记-202407-001' },
  { detailId: '18', assetId: '4', assetNo: 'GDZC-20240301-0001', assetName: '办公桌椅一套', depreciationYear: 2024, depreciationMonth: 4, depreciationPeriod: '2024-04', currentDepreciation: 79.17, accumulatedDepreciation: 79.17, netValue: 4920.83, deptId: '1', deptName: '财务部', voucherNo: '记-202404-001' },
  { detailId: '19', assetId: '4', assetNo: 'GDZC-20240301-0001', assetName: '办公桌椅一套', depreciationYear: 2024, depreciationMonth: 5, depreciationPeriod: '2024-05', currentDepreciation: 79.17, accumulatedDepreciation: 158.34, netValue: 4841.66, deptId: '1', deptName: '财务部', voucherNo: '记-202405-001' },
  { detailId: '20', assetId: '4', assetNo: 'GDZC-20240301-0001', assetName: '办公桌椅一套', depreciationYear: 2024, depreciationMonth: 6, depreciationPeriod: '2024-06', currentDepreciation: 79.17, accumulatedDepreciation: 237.51, netValue: 4762.49, deptId: '1', deptName: '财务部', voucherNo: '记-202406-001' },
  { detailId: '21', assetId: '4', assetNo: 'GDZC-20240301-0001', assetName: '办公桌椅一套', depreciationYear: 2024, depreciationMonth: 7, depreciationPeriod: '2024-07', currentDepreciation: 79.17, accumulatedDepreciation: 316.68, netValue: 4683.32, deptId: '1', deptName: '财务部', voucherNo: '记-202407-001' },
  { detailId: '22', assetId: '5', assetNo: 'GDZC-20240315-0001', assetName: 'HP打印机', depreciationYear: 2024, depreciationMonth: 4, depreciationPeriod: '2024-04', currentDepreciation: 94.44, accumulatedDepreciation: 94.44, netValue: 3405.56, deptId: '1', deptName: '财务部', voucherNo: '记-202404-001' },
  { detailId: '23', assetId: '5', assetNo: 'GDZC-20240315-0001', assetName: 'HP打印机', depreciationYear: 2024, depreciationMonth: 5, depreciationPeriod: '2024-05', currentDepreciation: 94.44, accumulatedDepreciation: 188.88, netValue: 3311.12, deptId: '1', deptName: '财务部', voucherNo: '记-202405-001' },
  { detailId: '24', assetId: '5', assetNo: 'GDZC-20240315-0001', assetName: 'HP打印机', depreciationYear: 2024, depreciationMonth: 6, depreciationPeriod: '2024-06', currentDepreciation: 94.44, accumulatedDepreciation: 283.32, netValue: 3216.68, deptId: '1', deptName: '财务部', voucherNo: '记-202406-001' },
  { detailId: '25', assetId: '5', assetNo: 'GDZC-20240315-0001', assetName: 'HP打印机', depreciationYear: 2024, depreciationMonth: 7, depreciationPeriod: '2024-07', currentDepreciation: 94.44, accumulatedDepreciation: 377.76, netValue: 3122.24, deptId: '1', deptName: '财务部', voucherNo: '记-202407-001' },
  { detailId: '26', assetId: '11', assetNo: 'GDZC-20230101-0001', assetName: '办公大楼', depreciationYear: 2024, depreciationMonth: 1, depreciationPeriod: '2024-01', currentDepreciation: 19791.67, accumulatedDepreciation: 217708.37, netValue: 4782291.63, deptId: '', deptName: '', voucherNo: '记-202401-001' },
  { detailId: '27', assetId: '11', assetNo: 'GDZC-20230101-0001', assetName: '办公大楼', depreciationYear: 2024, depreciationMonth: 2, depreciationPeriod: '2024-02', currentDepreciation: 19791.67, accumulatedDepreciation: 237500.04, netValue: 4762499.96, deptId: '', deptName: '', voucherNo: '记-202402-001' },
  { detailId: '28', assetId: '11', assetNo: 'GDZC-20230101-0001', assetName: '办公大楼', depreciationYear: 2024, depreciationMonth: 3, depreciationPeriod: '2024-03', currentDepreciation: 19791.67, accumulatedDepreciation: 257291.71, netValue: 4742708.29, deptId: '', deptName: '', voucherNo: '记-202403-001' },
  { detailId: '29', assetId: '11', assetNo: 'GDZC-20230101-0001', assetName: '办公大楼', depreciationYear: 2024, depreciationMonth: 4, depreciationPeriod: '2024-04', currentDepreciation: 19791.67, accumulatedDepreciation: 277083.38, netValue: 4722916.62, deptId: '', deptName: '', voucherNo: '记-202404-001' },
  { detailId: '30', assetId: '11', assetNo: 'GDZC-20230101-0001', assetName: '办公大楼', depreciationYear: 2024, depreciationMonth: 5, depreciationPeriod: '2024-05', currentDepreciation: 19791.67, accumulatedDepreciation: 296875.05, netValue: 4703124.95, deptId: '', deptName: '', voucherNo: '记-202405-001' }
]

export const mockAssetDisposals: AssetDisposal[] = [
  { disposalId: '1', bizDocId: '1', bizDocNo: 'CZ-20240615-0001', disposalDate: '2024-06-15', disposalType: 1, disposalTypeName: '报废', assetId: '12', assetNo: 'GDZC-20220615-0001', assetName: '旧打印机', originalValue: 2000.00, accumulatedDepreciation: 2000.00, netValue: 0, disposalAmount: 0, gainLossAmount: 0, accountId: '', accountName: '', disposalReason: '设备老化', remark: '已使用超过5年', voucherId: 'V001', voucherNo: '记-202406-005' }
]

export interface PurchaseInItem {
  itemId: string
  productId: string
  productName: string
  quantity: number
  price: number
  originalAmount: number
  costAmount: number
  remark: string
}

export interface PurchaseInDoc {
  bizDocId: string
  bizDocNo: string
  tradeTime: string
  bizContactId: string
  bizContactName: string
  warehouseId: string
  warehouseName: string
  accountId: string
  accountName: string
  staffId: string
  staffName: string
  currencyCode: string
  exchangeRate: number
  deptId: string | null
  deptName: string
  projectId: string | null
  projectName: string
  totalCost: number
  remark: string
  writerId: string
  writerName: string
  writerTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  status: number
  items: PurchaseInItem[]
}

export interface Warehouse {
  id: string
  name: string
  remark: string
  status: number
}

export interface Product {
  id: string
  name: string
  spec: string
  unit: string
  stock: number
}

export const mockWarehouses: Warehouse[] = [
  { id: '1', name: '主仓库', remark: '公司主仓库', status: 1 },
  { id: '2', name: '备用仓库', remark: '备用存储仓库', status: 1 },
  { id: '3', name: '成品仓库', remark: '成品存储仓库', status: 1 },
  { id: '4', name: '原材料仓库', remark: '原材料存储', status: 0 }
]

export const mockProducts: Product[] = [
  { id: '1', name: '产品A', spec: '型号A1', unit: '件', stock: 100 },
  { id: '2', name: '产品B', spec: '型号B2', unit: '件', stock: 50 },
  { id: '3', name: '产品C', spec: '型号C3', unit: '箱', stock: 200 },
  { id: '4', name: '原材料D', spec: '规格D4', unit: '公斤', stock: 500 },
  { id: '5', name: '配件E', spec: '型号E5', unit: '个', stock: 1000 }
]

export const mockPurchaseInDocs: PurchaseInDoc[] = [
  { 
    bizDocId: '1', 
    bizDocNo: 'PI-20240601-0001', 
    tradeTime: '2024-06-01', 
    bizContactId: '2', 
    bizContactName: '上海供应商B', 
    warehouseId: '1', 
    warehouseName: '主仓库', 
    accountId: '1', 
    accountName: '工商银行', 
    staffId: '1', 
    staffName: '张三', 
    currencyCode: 'CNY', 
    exchangeRate: 1.00000000, 
    deptId: '3', 
    deptName: '技术部', 
    projectId: '1', 
    projectName: '电商平台开发', 
    totalCost: 50000.00, 
    remark: '采购产品A', 
    writerId: '1', 
    writerName: '张三', 
    writerTime: '2024-06-01 14:00:00', 
    updateId: null, 
    updateName: '', 
    updateTime: null, 
    status: 0,
    items: [
      { itemId: '1-1', productId: '1', productName: '产品A', quantity: 100.00, price: 500.00, originalAmount: 50000.00, costAmount: 50000.00, remark: '批量采购' }
    ]
  },
  { 
    bizDocId: '2', 
    bizDocNo: 'PI-20240605-0002', 
    tradeTime: '2024-06-05', 
    bizContactId: '4', 
    bizContactName: '深圳供应商D', 
    warehouseId: '2', 
    warehouseName: '备用仓库', 
    accountId: '2', 
    accountName: '现金', 
    staffId: '2', 
    staffName: '李四', 
    currencyCode: 'CNY', 
    exchangeRate: 1.00000000, 
    deptId: '2', 
    deptName: '销售部', 
    projectId: null, 
    projectName: '', 
    totalCost: 12000.00, 
    remark: '办公用品采购', 
    writerId: '2', 
    writerName: '李四', 
    writerTime: '2024-06-05 10:30:00', 
    updateId: '1', 
    updateName: '张三', 
    updateTime: '2024-06-05 11:00:00', 
    status: 0,
    items: [
      { itemId: '2-1', productId: '3', productName: '产品C', quantity: 40.00, price: 300.00, originalAmount: 12000.00, costAmount: 12000.00, remark: '' }
    ]
  },
  { 
    bizDocId: '3', 
    bizDocNo: 'PI-20240610-0003', 
    tradeTime: '2024-06-10', 
    bizContactId: '2', 
    bizContactName: '上海供应商B', 
    warehouseId: '1', 
    warehouseName: '主仓库', 
    accountId: '3', 
    accountName: '建设银行', 
    staffId: '3', 
    staffName: '王五', 
    currencyCode: 'USD', 
    exchangeRate: 7.24500000, 
    deptId: '3', 
    deptName: '技术部', 
    projectId: '1', 
    projectName: '电商平台开发', 
    totalCost: 72450.00, 
    remark: '进口原材料', 
    writerId: '3', 
    writerName: '王五', 
    writerTime: '2024-06-10 16:00:00', 
    updateId: null, 
    updateName: '', 
    updateTime: null, 
    status: 0,
    items: [
      { itemId: '3-1', productId: '4', productName: '原材料D', quantity: 1000.00, price: 10.00, originalAmount: 10000.00, costAmount: 72450.00, remark: '进口原材料' }
    ]
  },
  { 
    bizDocId: '4', 
    bizDocNo: 'PI-20240615-0004', 
    tradeTime: '2024-06-15', 
    bizContactId: '2', 
    bizContactName: '上海供应商B', 
    warehouseId: '3', 
    warehouseName: '成品仓库', 
    accountId: '1', 
    accountName: '工商银行', 
    staffId: '1', 
    staffName: '张三', 
    currencyCode: 'CNY', 
    exchangeRate: 1.00000000, 
    deptId: null, 
    deptName: '', 
    projectId: '2', 
    projectName: '市场推广活动', 
    totalCost: 25000.00, 
    remark: '活动物资采购', 
    writerId: '1', 
    writerName: '张三', 
    writerTime: '2024-06-15 09:00:00', 
    updateId: null, 
    updateName: '', 
    updateTime: null, 
    status: -1,
    items: [
      { itemId: '4-1', productId: '2', productName: '产品B', quantity: 200.00, price: 125.00, originalAmount: 25000.00, costAmount: 25000.00, remark: '' },
      { itemId: '4-2', productId: '5', productName: '配件E', quantity: 500.00, price: 10.00, originalAmount: 5000.00, costAmount: 5000.00, remark: '配件' }
    ]
  },
  { 
    bizDocId: '5', 
    bizDocNo: 'PI-20240620-0005', 
    tradeTime: '2024-06-20', 
    bizContactId: '4', 
    bizContactName: '深圳供应商D', 
    warehouseId: '1', 
    warehouseName: '主仓库', 
    accountId: '2', 
    accountName: '现金', 
    staffId: '2', 
    staffName: '李四', 
    currencyCode: 'CNY', 
    exchangeRate: 1.00000000, 
    deptId: '1', 
    deptName: '财务部', 
    projectId: null, 
    projectName: '', 
    totalCost: 8000.00, 
    remark: '日常办公耗材', 
    writerId: '2', 
    writerName: '李四', 
    writerTime: '2024-06-20 14:30:00', 
    updateId: null, 
    updateName: '', 
    updateTime: null, 
    status: 0,
    items: [
      { itemId: '5-1', productId: '5', productName: '配件E', quantity: 800.00, price: 10.00, originalAmount: 8000.00, costAmount: 8000.00, remark: '办公耗材' }
    ]
  }
]

export interface BorrowLend {
  bizDocId: string
  bizDocNo: string
  tradeTime: string
  arapType: number
  arapTypeName: string
  accountId: string
  accountName: string
  fundAccountId: string
  fundAccountName: string
  bizContactId: string
  bizContactName: string
  amount: number
  dueDate: string | null
  currencyCode: string
  exchangeRate: number
  tag: string
  remark: string
  writerId: string
  writerName: string
  writerTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  status: number
  statusName: string
  voucherNo?: string
}

export const mockBorrowLendList: BorrowLend[] = [
  { bizDocId: '1', bizDocNo: 'BL-20240601-0001', tradeTime: '2024-06-01', arapType: 5, arapTypeName: '借入款', accountId: '5', accountName: '其他应付款', fundAccountId: '1', fundAccountName: '工商银行', bizContactId: '1', bizContactName: '北京客户A', amount: 20000.00, dueDate: '2024-12-01', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '短期借款', remark: '流动资金周转', writerId: '1', writerName: '张三', writerTime: '2024-06-01 10:00:00', updateId: null, updateName: '', updateTime: null, status: 0, statusName: '正常', voucherNo: '记-202406-001' },
  { bizDocId: '2', bizDocNo: 'BL-20240605-0001', tradeTime: '2024-06-05', arapType: 5, arapTypeName: '借入款', accountId: '5', accountName: '其他应付款', fundAccountId: '1', fundAccountName: '工商银行', bizContactId: '2', bizContactName: '上海供应商B', amount: 15000.00, dueDate: '2024-09-05', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '短期借款,周转', remark: '临时资金需求', writerId: '2', writerName: '李四', writerTime: '2024-06-05 14:30:00', updateId: '1', updateName: '张三', updateTime: '2024-06-05 15:00:00', status: 0, statusName: '正常', voucherNo: '记-202406-005' },
  { bizDocId: '3', bizDocNo: 'BL-20240520-0001', tradeTime: '2024-05-20', arapType: 6, arapTypeName: '借出款', accountId: '6', accountName: '其他应收款', fundAccountId: '2', fundAccountName: '现金', bizContactId: '2', bizContactName: '上海供应商B', amount: 10000.00, dueDate: '2024-06-20', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '员工借款', remark: '备用金借款', writerId: '1', writerName: '张三', writerTime: '2024-05-20 09:15:00', updateId: null, updateName: '', updateTime: null, status: 0, statusName: '正常', voucherNo: '记-202405-020' },
  { bizDocId: '4', bizDocNo: 'BL-20240610-0001', tradeTime: '2024-06-10', arapType: 6, arapTypeName: '借出款', accountId: '6', accountName: '其他应收款', fundAccountId: '1', fundAccountName: '工商银行', bizContactId: '3', bizContactName: '广州客户C', amount: 8000.00, dueDate: '2024-08-10', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '预付款', remark: '项目预付款', writerId: '2', writerName: '李四', writerTime: '2024-06-10 11:00:00', updateId: null, updateName: '', updateTime: null, status: 0, statusName: '正常', voucherNo: '记-202406-010' },
  { bizDocId: '5', bizDocNo: 'BL-20240615-0001', tradeTime: '2024-06-15', arapType: 5, arapTypeName: '借入款', accountId: '5', accountName: '其他应付款', fundAccountId: '3', fundAccountName: '建设银行', bizContactId: '4', bizContactName: '深圳供应商D', amount: 50000.00, dueDate: '2025-06-15', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '长期借款', remark: '设备采购资金', writerId: '1', writerName: '张三', writerTime: '2024-06-15 16:00:00', updateId: null, updateName: '', updateTime: null, status: 0, statusName: '正常', voucherNo: '记-202406-015' },
  { bizDocId: '6', bizDocNo: 'BL-20240401-0001', tradeTime: '2024-04-01', arapType: 6, arapTypeName: '借出款', accountId: '6', accountName: '其他应收款', fundAccountId: '2', fundAccountName: '现金', bizContactId: '1', bizContactName: '北京客户A', amount: 3000.00, dueDate: '2024-05-01', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '', remark: '差旅费借款', writerId: '2', writerName: '李四', writerTime: '2024-04-01 10:30:00', updateId: '1', updateName: '张三', updateTime: '2024-05-05 09:00:00', status: -1, statusName: '已删除', voucherNo: '记-202404-001' }
]

export interface Advance {
  bizDocId: string
  bizDocNo: string
  tradeTime: string
  arapType: number
  arapTypeName: string
  accountId: string
  accountName: string
  fundAccountId: string
  fundAccountName: string
  bizContactId: string
  bizContactName: string
  amount: number
  dueDate: string | null
  currencyCode: string
  exchangeRate: number
  tag: string
  remark: string
  writerId: string
  writerName: string
  writerTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  status: number
  statusName: string
  voucherNo?: string
}

export const mockAdvanceList: Advance[] = [
  { bizDocId: '1', bizDocNo: 'AD-20240601-0001', tradeTime: '2024-06-01', arapType: 3, arapTypeName: '预收', accountId: '3', accountName: '预收账款', fundAccountId: '1', fundAccountName: '工商银行', bizContactId: '1', bizContactName: '北京客户A', amount: 12000.00, dueDate: '2024-07-01', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '项目定金', remark: '电商平台开发预付款', writerId: '1', writerName: '张三', writerTime: '2024-06-01 10:00:00', updateId: null, updateName: '', updateTime: null, status: 0, statusName: '正常', voucherNo: '记-202406-001' },
  { bizDocId: '2', bizDocNo: 'AD-20240603-0001', tradeTime: '2024-06-03', arapType: 4, arapTypeName: '预付', accountId: '4', accountName: '预付账款', fundAccountId: '1', fundAccountName: '工商银行', bizContactId: '2', bizContactName: '上海供应商B', amount: 30000.00, dueDate: '2024-07-03', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '采购预付款', remark: 'IT设备采购预付款', writerId: '2', writerName: '李四', writerTime: '2024-06-03 14:30:00', updateId: '1', updateName: '张三', updateTime: '2024-06-03 15:00:00', status: 0, statusName: '正常', voucherNo: '记-202406-003' },
  { bizDocId: '3', bizDocNo: 'AD-20240605-0001', tradeTime: '2024-06-05', arapType: 3, arapTypeName: '预收', accountId: '3', accountName: '预收账款', fundAccountId: '2', fundAccountName: '现金', bizContactId: '3', bizContactName: '广州客户C', amount: 8000.00, dueDate: null, currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '服务定金', remark: '技术服务预付款', writerId: '1', writerName: '张三', writerTime: '2024-06-05 09:15:00', updateId: null, updateName: '', updateTime: null, status: 0, statusName: '正常', voucherNo: '记-202406-005' },
  { bizDocId: '4', bizDocNo: 'AD-20240608-0001', tradeTime: '2024-06-08', arapType: 4, arapTypeName: '预付', accountId: '4', accountName: '预付账款', fundAccountId: '3', fundAccountName: '建设银行', bizContactId: '4', bizContactName: '深圳供应商D', amount: 15000.00, dueDate: '2024-08-08', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '软件采购', remark: '财务软件许可证', writerId: '2', writerName: '李四', writerTime: '2024-06-08 11:00:00', updateId: null, updateName: '', updateTime: null, status: 0, statusName: '正常', voucherNo: '记-202406-008' },
  { bizDocId: '5', bizDocNo: 'AD-20240610-0001', tradeTime: '2024-06-10', arapType: 3, arapTypeName: '预收', accountId: '3', accountName: '预收账款', fundAccountId: '1', fundAccountName: '工商银行', bizContactId: '2', bizContactName: '上海供应商B', amount: 20000.00, dueDate: '2024-09-10', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '长期项目', remark: '年度服务合同预付款', writerId: '1', writerName: '张三', writerTime: '2024-06-10 16:00:00', updateId: null, updateName: '', updateTime: null, status: 0, statusName: '正常', voucherNo: '记-202406-010' },
  { bizDocId: '6', bizDocNo: 'AD-20240501-0001', tradeTime: '2024-05-01', arapType: 4, arapTypeName: '预付', accountId: '4', accountName: '预付账款', fundAccountId: '2', fundAccountName: '现金', bizContactId: '1', bizContactName: '北京客户A', amount: 5000.00, dueDate: '2024-06-01', currencyCode: 'CNY', exchangeRate: 1.00000000, tag: '', remark: '办公用品采购', writerId: '2', writerName: '李四', writerTime: '2024-05-01 10:30:00', updateId: '1', updateName: '张三', updateTime: '2024-05-15 09:00:00', status: -1, statusName: '已删除', voucherNo: '记-202405-001' }
]

export interface TrialBalanceItem {
  subjectId: string
  subjectCode: string
  subjectName: string
  subjectLevel: number
  debitAmount: number
  creditAmount: number
  balanceType: 'debit' | 'credit' | 'zero'
  balanceAmount: number
}

export interface TrialBalanceSummary {
  period: string
  totalDebit: number
  totalCredit: number
  isBalanced: boolean
  difference: number
  voucherCount: number
  items: TrialBalanceItem[]
}

export const mockTrialBalanceList: TrialBalanceSummary[] = [
  {
    period: '2024-06',
    totalDebit: 1585000.00,
    totalCredit: 1585000.00,
    isBalanced: true,
    difference: 0,
    voucherCount: 45,
    items: [
      { subjectId: '1', subjectCode: '1001', subjectName: '库存现金', subjectLevel: 1, debitAmount: 50000.00, creditAmount: 35000.00, balanceType: 'debit', balanceAmount: 15000.00 },
      { subjectId: '2', subjectCode: '1002', subjectName: '银行存款', subjectLevel: 1, debitAmount: 850000.00, creditAmount: 620000.00, balanceType: 'debit', balanceAmount: 230000.00 },
      { subjectId: '3', subjectCode: '1122', subjectName: '应收账款', subjectLevel: 1, debitAmount: 150000.00, creditAmount: 80000.00, balanceType: 'debit', balanceAmount: 70000.00 },
      { subjectId: '4', subjectCode: '2202', subjectName: '应付账款', subjectLevel: 1, debitAmount: 60000.00, creditAmount: 120000.00, balanceType: 'credit', balanceAmount: 60000.00 },
      { subjectId: '5', subjectCode: '4001', subjectName: '实收资本', subjectLevel: 1, debitAmount: 0, creditAmount: 800000.00, balanceType: 'credit', balanceAmount: 800000.00 },
      { subjectId: '6', subjectCode: '6001', subjectName: '主营业务收入', subjectLevel: 1, debitAmount: 200000.00, creditAmount: 200000.00, balanceType: 'zero', balanceAmount: 0 },
      { subjectId: '7', subjectCode: '6602', subjectName: '管理费用', subjectLevel: 1, debitAmount: 180000.00, creditAmount: 180000.00, balanceType: 'zero', balanceAmount: 0 },
      { subjectId: '8', subjectCode: '6601', subjectName: '销售费用', subjectLevel: 1, debitAmount: 90000.00, creditAmount: 90000.00, balanceType: 'zero', balanceAmount: 0 },
      { subjectId: '9', subjectCode: '1601', subjectName: '固定资产', subjectLevel: 1, debitAmount: 520000.00, creditAmount: 0, balanceType: 'debit', balanceAmount: 520000.00 },
      { subjectId: '10', subjectCode: '1602', subjectName: '累计折旧', subjectLevel: 1, debitAmount: 0, creditAmount: 30000.00, balanceType: 'credit', balanceAmount: 30000.00 },
      { subjectId: '11', subjectCode: '4103', subjectName: '利润分配', subjectLevel: 1, debitAmount: 100000.00, creditAmount: 0, balanceType: 'debit', balanceAmount: 100000.00 },
      { subjectId: '12', subjectCode: '5001', subjectName: '生产成本', subjectLevel: 1, debitAmount: 60000.00, creditAmount: 60000.00, balanceType: 'zero', balanceAmount: 0 }
    ]
  },
  {
    period: '2024-05',
    totalDebit: 1420000.00,
    totalCredit: 1420500.00,
    isBalanced: false,
    difference: -500.00,
    voucherCount: 38,
    items: [
      { subjectId: '1', subjectCode: '1001', subjectName: '库存现金', subjectLevel: 1, debitAmount: 45000.00, creditAmount: 40000.00, balanceType: 'debit', balanceAmount: 5000.00 },
      { subjectId: '2', subjectCode: '1002', subjectName: '银行存款', subjectLevel: 1, debitAmount: 780000.00, creditAmount: 590000.00, balanceType: 'debit', balanceAmount: 190000.00 },
      { subjectId: '3', subjectCode: '1122', subjectName: '应收账款', subjectLevel: 1, debitAmount: 120000.00, creditAmount: 95000.00, balanceType: 'debit', balanceAmount: 25000.00 },
      { subjectId: '4', subjectCode: '2202', subjectName: '应付账款', subjectLevel: 1, debitAmount: 50000.00, creditAmount: 110000.00, balanceType: 'credit', balanceAmount: 60000.00 },
      { subjectId: '5', subjectCode: '4001', subjectName: '实收资本', subjectLevel: 1, debitAmount: 0, creditAmount: 700000.00, balanceType: 'credit', balanceAmount: 700000.00 },
      { subjectId: '6', subjectCode: '6001', subjectName: '主营业务收入', subjectLevel: 1, debitAmount: 180000.00, creditAmount: 180500.00, balanceType: 'credit', balanceAmount: 500.00 },
      { subjectId: '7', subjectCode: '6602', subjectName: '管理费用', subjectLevel: 1, debitAmount: 160000.00, creditAmount: 160000.00, balanceType: 'zero', balanceAmount: 0 },
      { subjectId: '8', subjectCode: '6601', subjectName: '销售费用', subjectLevel: 1, debitAmount: 85000.00, creditAmount: 85000.00, balanceType: 'zero', balanceAmount: 0 },
      { subjectId: '9', subjectCode: '1601', subjectName: '固定资产', subjectLevel: 1, debitAmount: 420000.00, creditAmount: 0, balanceType: 'debit', balanceAmount: 420000.00 },
      { subjectId: '10', subjectCode: '1602', subjectName: '累计折旧', subjectLevel: 1, debitAmount: 0, creditAmount: 20000.00, balanceType: 'credit', balanceAmount: 20000.00 }
    ]
  },
  {
    period: '2024-04',
    totalDebit: 1250000.00,
    totalCredit: 1250000.00,
    isBalanced: true,
    difference: 0,
    voucherCount: 32,
    items: [
      { subjectId: '1', subjectCode: '1001', subjectName: '库存现金', subjectLevel: 1, debitAmount: 30000.00, creditAmount: 25000.00, balanceType: 'debit', balanceAmount: 5000.00 },
      { subjectId: '2', subjectCode: '1002', subjectName: '银行存款', subjectLevel: 1, debitAmount: 650000.00, creditAmount: 480000.00, balanceType: 'debit', balanceAmount: 170000.00 },
      { subjectId: '3', subjectCode: '1122', subjectName: '应收账款', subjectLevel: 1, debitAmount: 100000.00, creditAmount: 70000.00, balanceType: 'debit', balanceAmount: 30000.00 },
      { subjectId: '4', subjectCode: '2202', subjectName: '应付账款', subjectLevel: 1, debitAmount: 45000.00, creditAmount: 90000.00, balanceType: 'credit', balanceAmount: 45000.00 },
      { subjectId: '5', subjectCode: '4001', subjectName: '实收资本', subjectLevel: 1, debitAmount: 0, creditAmount: 500000.00, balanceType: 'credit', balanceAmount: 500000.00 },
      { subjectId: '6', subjectCode: '6001', subjectName: '主营业务收入', subjectLevel: 1, debitAmount: 150000.00, creditAmount: 150000.00, balanceType: 'zero', balanceAmount: 0 },
      { subjectId: '7', subjectCode: '6602', subjectName: '管理费用', subjectLevel: 1, debitAmount: 140000.00, creditAmount: 140000.00, balanceType: 'zero', balanceAmount: 0 },
      { subjectId: '8', subjectCode: '6601', subjectName: '销售费用', subjectLevel: 1, debitAmount: 75000.00, creditAmount: 75000.00, balanceType: 'zero', balanceAmount: 0 },
      { subjectId: '9', subjectCode: '1601', subjectName: '固定资产', subjectLevel: 1, debitAmount: 380000.00, creditAmount: 0, balanceType: 'debit', balanceAmount: 380000.00 },
      { subjectId: '10', subjectCode: '1602', subjectName: '累计折旧', subjectLevel: 1, debitAmount: 0, creditAmount: 15000.00, balanceType: 'credit', balanceAmount: 15000.00 }
    ]
  }
]
