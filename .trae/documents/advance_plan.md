# 预收预付款模块前端实现计划

## 1. 需求分析

### 1.1 模块定位
预收预付款模块负责处理企业预收款和预付款的业务登记、凭证自动生成及相关管理功能。

### 1.2 核心功能
| 功能 | 说明 |
| --- | --- |
| 新增预收预付款单据 | 支持预收(3)和预付(4)两种类型 |
| 编辑预收预付款单据 | 仅允许状态为正常的记录编辑 |
| 删除预收预付款单据 | 逻辑删除，禁止删除已关联业务的记录 |
| 查看预收预付款详情 | 展示完整的单据信息 |
| 查询预收预付款列表 | 支持多条件筛选和分页 |

### 1.3 核心字段
| 字段 | 说明 | 约束 |
| --- | --- | --- |
| tradeTime | 业务日期 | 必填，≤当前日期 |
| arapType | 挂账类型 | 必填，3=预收，4=预付 |
| accountId | 挂账科目 | 必填，预收=预收类，预付=预付类 |
| fundAccountId | 资金账户 | 必填，预收=收款，预付=付款 |
| bizContactId | 往来单位 | 必填 |
| amount | 挂账金额 | 必填，>0 |
| dueDate | 到期日 | 选填，>业务日期 |
| currencyCode | 币种代码 | 必填，默认CNY |
| exchangeRate | 汇率 | 必填，默认1.00000000 |
| tag | 标签 | 选填 |
| remark | 备注 | 选填 |

## 2. 技术方案

### 2.1 技术栈
- Vue 3 + TypeScript
- Vite 构建工具
- Element Plus UI组件库
- Vue Router 4 路由管理

### 2.2 文件结构
```
src/
├── data/
│   └── mockData.ts          # 新增 Advance 接口和 mock 数据
├── pages/
│   └── advance/             # 新增目录
│       ├── Advance.vue      # 列表页面
│       ├── AdvanceAdd.vue   # 新增页面
│       ├── AdvanceEdit.vue  # 编辑页面
│       └── AdvanceView.vue  # 详情页面
├── router/
│   └── index.ts             # 添加路由配置
└── components/
    └── layout/
        └── Sidebar.vue      # 添加菜单项
```

### 2.3 接口定义
```typescript
export interface Advance {
  bizDocId: string
  bizDocNo: string
  tradeTime: string
  arapType: number          // 3=预收, 4=预付
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
  status: number            // 0=正常, -1=已删除
  statusName: string
}
```

## 3. 实现步骤

### 3.1 步骤一：添加数据类型和Mock数据
- 修改 `src/data/mockData.ts`
- 添加 `Advance` 接口定义
- 添加 `mockAdvanceList` mock数据

### 3.2 步骤二：创建列表页面
- 创建 `src/pages/advance/Advance.vue`
- 实现搜索筛选功能（关键词、挂账类型、往来单位、状态）
- 实现表格展示（单据编号、业务日期、挂账类型、挂账账户、资金账户、往来单位、金额、到期日、币种、状态）
- 实现分页功能
- 实现操作按钮（查看、编辑、删除）

### 3.3 步骤三：创建新增页面
- 创建 `src/pages/advance/AdvanceAdd.vue`
- 实现表单（日期、挂账类型、挂账账户、资金账户、往来单位、金额、到期日、币种、汇率、标签、备注）
- 实现表单校验（金额>0、到期日>业务日期）
- 实现挂账类型联动挂账账户

### 3.4 步骤四：创建编辑页面
- 创建 `src/pages/advance/AdvanceEdit.vue`
- 加载现有数据
- 实现表单编辑（同新增页面）
- 实现更新逻辑

### 3.5 步骤五：创建详情页面
- 创建 `src/pages/advance/AdvanceView.vue`
- 展示完整的单据信息
- 展示关联信息（往来单位、挂账科目、资金账户等）

### 3.6 步骤六：配置路由
- 修改 `src/router/index.ts`
- 添加4个路由：列表、新增、编辑、详情

### 3.7 步骤七：添加侧边栏菜单
- 修改 `src/components/layout/Sidebar.vue`
- 在"财务"菜单组下添加"预收预付"菜单项

## 4. 依赖与风险

### 4.1 依赖
- 已存在的 mock 数据：mockContacts、mockAccounts、mockCurrencies
- 路由配置和侧边栏组件已存在

### 4.2 风险点
| 风险 | 描述 | 应对方案 |
| --- | --- | --- |
| 数据校验 | 到期日必须大于业务日期 | 在表单中添加日期校验 |
| 挂账类型联动 | 挂账账户需根据类型筛选 | 监听类型变化，动态更新账户列表 |
| 状态控制 | 删除后不可恢复 | 使用逻辑删除，标记status=-1 |

## 5. 测试要点

- 新增单据：验证必填字段校验、金额>0校验、到期日校验
- 编辑单据：验证仅正常状态可编辑
- 删除单据：验证仅正常状态可删除、逻辑删除生效
- 查询功能：验证各筛选条件生效
- 挂账类型联动：验证预收/预付对应的账户列表正确

## 6. 输出物

| 文件 | 说明 |
| --- | --- |
| src/data/mockData.ts | 添加 Advance 接口和 mock 数据 |
| src/pages/advance/Advance.vue | 列表页面 |
| src/pages/advance/AdvanceAdd.vue | 新增页面 |
| src/pages/advance/AdvanceEdit.vue | 编辑页面 |
| src/pages/advance/AdvanceView.vue | 详情页面 |
| src/router/index.ts | 路由配置 |
| src/components/layout/Sidebar.vue | 菜单配置 |