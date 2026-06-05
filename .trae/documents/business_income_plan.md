# 业务模块 - 收入管理页面实现计划

## 1. 需求分析

根据用户要求，业务模块中的收入管理需要按照设置模块的模式进行修改，实现以下功能：
- 新增页面：创建收入单据
- 编辑页面：修改收入单据信息
- 查看页面：查看收入单据详情
- 列表页面：支持搜索、筛选、分页功能

## 2. 字段设计

参考财务系统收入管理的通用字段设计：

| 字段名 | 类型 | 说明 | 是否必填 |
|--------|------|------|----------|
| id | string | 主键ID | 系统生成 |
| docNo | string | 单据编号 | 系统生成 |
| date | string | 日期 | 必填 |
| contactId | string | 客户ID | 必填 |
| contactName | string | 客户名称 | 必填 |
| categoryId | string | 类别ID | 必填 |
| categoryName | string | 类别名称 | 必填 |
| amount | number | 金额 | 必填 |
| accountId | string | 账户ID | 必填 |
| accountName | string | 账户名称 | 必填 |
| projectId | string | 项目ID | 可选 |
| projectName | string | 项目名称 | 可选 |
| remark | string | 备注 | 可选 |
| status | number | 状态(0-待审核, 1-已审核) | 默认0 |
| createdAt | string | 创建时间 | 系统生成 |
| updatedAt | string | 更新时间 | 系统生成 |

## 3. 文件修改清单

### 3.1 修改文件
1. **src/data/mockData.ts** - 添加收入单据接口定义和模拟数据
2. **src/router/index.ts** - 添加收入管理相关路由
3. **src/pages/business/Income.vue** - 更新列表页面，添加搜索、筛选、分页

### 3.2 新建文件
1. **src/pages/business/IncomeAdd.vue** - 新增收入页面
2. **src/pages/business/IncomeEdit.vue** - 编辑收入页面
3. **src/pages/business/IncomeView.vue** - 查看收入详情页面

## 4. 路由配置

```typescript
{ path: '/business/income', component: BusinessIncome },
{ path: '/business/income/add', component: BusinessIncomeAdd },
{ path: '/business/income/edit/:id', component: BusinessIncomeEdit },
{ path: '/business/income/view/:id', component: BusinessIncomeView }
```

## 5. 实现步骤

1. 更新 mockData.ts，添加 IncomeDoc 接口和模拟数据
2. 更新路由配置
3. 创建 IncomeAdd.vue 新增页面
4. 创建 IncomeEdit.vue 编辑页面
5. 创建 IncomeView.vue 查看页面
6. 更新 Income.vue 列表页面

## 6. 依赖和风险

### 依赖
- Element Plus 组件库
- Vue Router 路由管理
- 现有 mock 数据（客户、类别、账户、项目）

### 风险
- 需要确保 mock 数据中存在相关的客户、类别、账户等数据供选择

## 7. 参考页面

参考设置模块的公司管理页面实现模式：
- CompanyAdd.vue - 新增页面模板
- CompanyEdit.vue - 编辑页面模板
- Company.vue - 列表页面模板
