import type { LogicType } from '@/types/review'

export interface LogicPoint {
  key: string
  label: string
  description: string
  type: LogicType
  pagePath: string
  codeLocation?: string
}

export const logicReviewConfig: LogicPoint[] = [
  {
    key: 'category.validate.name',
    label: '类别名称校验规则',
    description: '校验类别名称是否为空，最大长度50字符',
    type: 'validation',
    pagePath: '/settings/categories/add',
    codeLocation: 'CategoriesAdd.vue:64-65'
  },
  {
    key: 'category.validate.type',
    label: '类型校验规则',
    description: '校验收入/支出类型必须选择',
    type: 'validation',
    pagePath: '/settings/categories/add',
    codeLocation: 'CategoriesAdd.vue:66'
  },
  {
    key: 'category.calc.newId',
    label: '新类别ID计算',
    description: '根据现有最大ID自动生成新ID',
    type: 'calculation',
    pagePath: '/settings/categories/add',
    codeLocation: 'CategoriesAdd.vue:78'
  },
  {
    key: 'category.filter.search',
    label: '搜索过滤逻辑',
    description: '根据关键词模糊搜索类别名称',
    type: 'rule',
    pagePath: '/settings/categories',
    codeLocation: 'Categories.vue:135-141'
  },
  {
    key: 'category.filter.type',
    label: '类型筛选规则',
    description: '根据收入/支出类型筛选类别',
    type: 'rule',
    pagePath: '/settings/categories',
    codeLocation: 'Categories.vue:144-146'
  },
  {
    key: 'category.filter.status',
    label: '状态筛选规则',
    description: '根据启用/禁用状态筛选类别',
    type: 'rule',
    pagePath: '/settings/categories',
    codeLocation: 'Categories.vue:148-150'
  },
  {
    key: 'category.pagination',
    label: '分页计算逻辑',
    description: '根据当前页码和每页条数计算数据切片',
    type: 'calculation',
    pagePath: '/settings/categories',
    codeLocation: 'Categories.vue:157-161'
  },
  {
    key: 'category.status.toggle',
    label: '状态切换规则',
    description: '切换类别启用/禁用状态',
    type: 'rule',
    pagePath: '/settings/categories',
    codeLocation: 'Categories.vue:198-203'
  },
  {
    key: 'category.edit.load',
    label: '编辑数据加载',
    description: '根据ID加载类别数据并填充表单',
    type: 'transformation',
    pagePath: '/settings/categories/edit/*',
    codeLocation: 'CategoriesEdit.vue:78-91'
  },
  {
    key: 'category.edit.update',
    label: '编辑更新规则',
    description: '更新类别数据，保留创建时间',
    type: 'rule',
    pagePath: '/settings/categories/edit/*',
    codeLocation: 'CategoriesEdit.vue:102-113'
  },
  {
    key: 'storage.load',
    label: '本地存储加载',
    description: '从localStorage加载批注数据',
    type: 'transformation',
    pagePath: '/*',
    codeLocation: 'reviewStore.ts:75-89'
  },
  {
    key: 'storage.save',
    label: '本地存储保存',
    description: '保存批注数据到localStorage',
    type: 'transformation',
    pagePath: '/*',
    codeLocation: 'reviewStore.ts:71-73'
  },
  {
    key: 'markdown.export',
    label: 'Markdown导出格式',
    description: '将批注数据转换为Markdown格式',
    type: 'formatting',
    pagePath: '/*',
    codeLocation: 'reviewStore.ts:91-123'
  },
  {
    key: 'dashboard.stats.calc',
    label: '统计数据计算',
    description: '计算各项统计指标（总收入、总支出、利润等）',
    type: 'calculation',
    pagePath: '/dashboard',
    codeLocation: 'Dashboard.vue'
  },
  {
    key: 'dashboard.chart.format',
    label: '图表数据格式化',
    description: '格式化图表展示数据',
    type: 'formatting',
    pagePath: '/dashboard',
    codeLocation: 'Dashboard.vue'
  },
  {
    key: 'income.filter.date',
    label: '日期范围筛选',
    description: '根据日期范围筛选收入记录',
    type: 'rule',
    pagePath: '/business/income',
    codeLocation: 'Income.vue'
  },
  {
    key: 'expense.filter.date',
    label: '日期范围筛选',
    description: '根据日期范围筛选支出记录',
    type: 'rule',
    pagePath: '/business/expense',
    codeLocation: 'Expense.vue'
  },
  {
    key: 'analysis.date.range',
    label: '分析日期范围',
    description: '设置分析的日期范围参数',
    type: 'rule',
    pagePath: '/analysis/overview',
    codeLocation: 'Overview.vue'
  },
  {
    key: 'analysis.data.aggregate',
    label: '数据聚合计算',
    description: '按时间维度聚合分析数据',
    type: 'calculation',
    pagePath: '/analysis/overview',
    codeLocation: 'Overview.vue'
  }
]