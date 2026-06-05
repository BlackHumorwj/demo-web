export interface ReviewableElement {
  selector: string
  label: string
  description?: string
}

export interface PageReviewConfig {
  path: string
  elements: ReviewableElement[]
}

export const reviewConfig: PageReviewConfig[] = [
  {
    path: '/settings/categories',
    elements: [
      { selector: '.header-content', label: '页面头部', description: '包含页面标题和操作按钮' },
      { selector: '.search-bar', label: '搜索栏', description: '包含搜索输入框和筛选条件' },
      { selector: '.el-table', label: '数据表格', description: '展示收支类别列表' },
      { selector: '.pagination', label: '分页组件', description: '分页导航控件' }
    ]
  },
  {
    path: '/settings/categories/add',
    elements: [
      { selector: '.header-content', label: '页面头部', description: '包含页面标题和返回按钮' },
      { selector: '.form-container', label: '表单区域', description: '新增收支类别表单' },
      { selector: '[prop="name"]', label: '类别名称字段', description: '输入类别名称' },
      { selector: '[prop="type"]', label: '类型字段', description: '选择收入或支出类型' },
      { selector: '[prop="subjectCode"]', label: '关联科目字段', description: '选择关联的会计科目' },
      { selector: '[prop="remark"]', label: '备注字段', description: '输入备注信息' }
    ]
  },
  {
    path: '/settings/categories/edit/*',
    elements: [
      { selector: '.header-content', label: '页面头部', description: '包含页面标题和返回按钮' },
      { selector: '.form-container', label: '表单区域', description: '编辑收支类别表单' },
      { selector: '[prop="name"]', label: '类别名称字段', description: '输入类别名称' },
      { selector: '[prop="type"]', label: '类型字段', description: '选择收入或支出类型' },
      { selector: '[prop="subjectCode"]', label: '关联科目字段', description: '选择关联的会计科目' },
      { selector: '[prop="remark"]', label: '备注字段', description: '输入备注信息' },
      { selector: 'label:contains("状态")', label: '状态字段', description: '选择启用或禁用状态' }
    ]
  },
  {
    path: '/dashboard',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.stats-cards', label: '统计卡片区域' },
      { selector: '.chart-section', label: '图表区域' },
      { selector: '.recent-transactions', label: '最近交易列表' }
    ]
  },
  {
    path: '/settings/company',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.form-container', label: '公司信息表单' },
      { selector: '[prop="name"]', label: '公司名称字段' },
      { selector: '[prop="address"]', label: '地址字段' },
      { selector: '[prop="contact"]', label: '联系人字段' }
    ]
  },
  {
    path: '/settings/employees',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.search-bar', label: '搜索栏' },
      { selector: '.el-table', label: '员工列表表格' },
      { selector: '.pagination', label: '分页组件' }
    ]
  },
  {
    path: '/settings/subjects',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.search-bar', label: '搜索栏' },
      { selector: '.el-table', label: '科目列表表格' },
      { selector: '.pagination', label: '分页组件' }
    ]
  },
  {
    path: '/settings/contacts',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.search-bar', label: '搜索栏' },
      { selector: '.el-table', label: '往来单位列表' },
      { selector: '.pagination', label: '分页组件' }
    ]
  },
  {
    path: '/settings/accounts',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.search-bar', label: '搜索栏' },
      { selector: '.el-table', label: '账户列表' },
      { selector: '.pagination', label: '分页组件' }
    ]
  },
  {
    path: '/settings/projects',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.search-bar', label: '搜索栏' },
      { selector: '.el-table', label: '项目列表' },
      { selector: '.pagination', label: '分页组件' }
    ]
  },
  {
    path: '/business/income',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.search-bar', label: '搜索栏' },
      { selector: '.el-table', label: '收入列表' },
      { selector: '.pagination', label: '分页组件' }
    ]
  },
  {
    path: '/business/expense',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.search-bar', label: '搜索栏' },
      { selector: '.el-table', label: '支出列表' },
      { selector: '.pagination', label: '分页组件' }
    ]
  },
  {
    path: '/analysis/overview',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.summary-section', label: '汇总数据区域' },
      { selector: '.chart-section', label: '分析图表区域' }
    ]
  },
  {
    path: '/analysis/income',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.filter-section', label: '筛选区域' },
      { selector: '.chart-section', label: '收入图表' },
      { selector: '.detail-table', label: '明细表格' }
    ]
  },
  {
    path: '/analysis/expense',
    elements: [
      { selector: '.header-content', label: '页面头部' },
      { selector: '.filter-section', label: '筛选区域' },
      { selector: '.chart-section', label: '支出图表' },
      { selector: '.detail-table', label: '明细表格' }
    ]
  }
]