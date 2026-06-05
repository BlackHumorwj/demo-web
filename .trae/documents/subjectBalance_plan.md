# 科目余额表模块前端开发计划

## 一、开发依据文档

根据文档索引，前端开发按以下顺序阅读：
1. [05-科目余额表模块-接口规范.md]
2. [06-科目余额表模块-前端交互规范.md]
3. [03-科目余额表模块-业务功能.md]

## 二、核心功能清单

| 功能模块 | 功能点 | 接口 | 说明 |
| --- | --- | --- | --- |
| 列表查询 | 科目余额列表 | GET /api/subjectBalances | 支持分页、多维度筛选 |
| 详情查看 | 科目余额详情 | GET /api/subjectBalances/{balanceId} | 包含操作日志 |
| 新增 | 新增科目余额 | POST /api/subjectBalances | 手动录入期初余额 |
| 编辑 | 编辑科目余额 | PUT /api/subjectBalances/{balanceId} | 修改期初余额/备注 |
| 删除 | 删除科目余额 | DELETE /api/subjectBalances/{balanceId} | 逻辑删除，需填原因 |
| 恢复 | 恢复科目余额 | PUT /api/subjectBalances/{balanceId}/restore | 恢复已删除记录 |
| 导出 | 导出Excel | - | 包含筛选条件和汇总数据 |

## 三、文件结构

```
src/
├── types/
│   └── subjectBalance.ts          # 类型定义（基于接口规范）
├── services/
│   └── subjectBalance.ts          # API服务层（基于接口规范）
├── data/
│   └── mockData.ts                # Mock数据扩展
├── pages/
│   └── ledger/
│       └── SubjectBalance.vue     # 主页面（基于前端交互规范）
└── components/
    └── SubjectBalanceModal.vue    # 新增/编辑弹窗组件
```

## 四、开发任务

### 4.1 类型定义（src/types/subjectBalance.ts）

**基于接口规范定义以下类型：**

| 类型 | 字段 | 说明 |
| --- | --- | --- |
| SubjectBalanceItem | balanceId, ledgerName, companyName, subjectName, subjectCode, subjectType, periodName, beginDebit, beginCredit, currentDebit, currentCredit, endDebit, endCredit, status, updateTime | 列表项 |
| SubjectBalanceDetail | balanceId, ledgerId, companyId, subjectId, periodId, beginDebit, beginCredit, currentDebit, currentCredit, endDebit, endCredit, remark, status, creatorName, createTime, updaterName, updateTime, relatedInfo, operationLogs | 详情 |
| OperationLog | logId, operType, operUser, operTime, content | 操作日志 |
| RelatedInfo | subjectName, subjectType, periodStatus, periodName | 关联信息 |
| SubjectBalanceSummary | totalBeginDebit, totalBeginCredit, totalEndDebit, totalEndCredit | 汇总数据 |
| SubjectBalanceListResponse | code, msg, data{total, page, pageSize, list, summary} | 列表响应 |
| SubjectBalanceDetailResponse | code, msg, data | 详情响应 |
| CreateSubjectBalanceRequest | ledgerId, companyId, subjectId, periodId, beginDebit?, beginCredit?, remark? | 新增请求 |
| UpdateSubjectBalanceRequest | ledgerId, companyId, beginDebit?, beginCredit?, remark? | 编辑请求 |

### 4.2 API服务层（src/services/subjectBalance.ts）

**实现以下API方法：**

| 方法名 | 接口地址 | 请求方式 | 参数 | 返回类型 |
| --- | --- | --- | --- | --- |
| getSubjectBalanceList | /api/subjectBalances | GET | page, pageSize, ledgerId, companyId, periodId?, subjectId?, subjectType?, status?, beginDebitMin?, beginDebitMax?, endCreditMin?, endCreditMax?, createTime? | SubjectBalanceListResponse |
| getSubjectBalanceDetail | /api/subjectBalances/{balanceId} | GET | balanceId, ledgerId, companyId | SubjectBalanceDetailResponse |
| createSubjectBalance | /api/subjectBalances | POST | CreateSubjectBalanceRequest | { code, msg, data{balanceId, endDebit, endCredit, createTime} } |
| updateSubjectBalance | /api/subjectBalances/{balanceId} | PUT | balanceId, UpdateSubjectBalanceRequest | { code, msg, data{balanceId, endDebit, endCredit, updateTime} } |
| deleteSubjectBalance | /api/subjectBalances/{balanceId} | DELETE | balanceId, ledgerId, companyId, deleteReason | { code, msg, data } |
| restoreSubjectBalance | /api/subjectBalances/{balanceId}/restore | PUT | balanceId, ledgerId, companyId | { code, msg, data{balanceId, status, restoreTime} } |

### 4.3 Mock数据扩展（src/data/mockData.ts）

**添加以下Mock数据：**

```typescript
export interface SubjectBalance {
  balanceId: number
  ledgerId: number
  ledgerName: string
  companyId: number
  companyName: string
  subjectId: number
  subjectCode: string
  subjectName: string
  subjectType: number
  periodId: number
  periodName: string
  beginDebit: number
  beginCredit: number
  currentDebit: number
  currentCredit: number
  endDebit: number
  endCredit: number
  remark: string
  status: number
  creatorName: string
  createTime: string
  updaterName: string
  updateTime: string
}

export const mockSubjectBalances: SubjectBalance[] = [
  {
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
    remark: '',
    status: 0,
    creatorName: '财务管理员',
    createTime: '2024-04-01 10:00:00',
    updaterName: '财务管理员',
    updateTime: '2024-04-15 16:00:00'
  }
  // ... 更多数据
]
```

### 4.4 主页面（src/pages/ledger/SubjectBalance.vue）

**页面结构（基于前端交互规范）：**

```
┌─────────────────────────────────────────────────────────────┐
│  页面标题栏                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  新增余额   │  │   导出Excel  │  │   刷新      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  筛选区域                                                   │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐       │
│  │ 账本选择 │ 公司选择 │ 期间选择 │ 科目选择 │ 状态筛选│       │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘       │
├─────────────────────────────────────────────────────────────┤
│  数据列表区域                                               │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐   │
│  │科目编码 │科目名称 │期间    │期初借方│期初贷方│期末余额│...│   │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤   │
│  │ 1001   │库存现金│2024-04 │5000    │0       │7000    │...│   │
│  └────────┴────────┴────────┴────────┴────────┴────────┘   │
├─────────────────────────────────────────────────────────────┤
│  分页区域                                                   │
│  ┌─────────────────────────────────────────┐               │
│  │ 共 50 条记录 | 第 1/3 页 | 每页 20 条   │               │
│  └─────────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

**功能实现：**

| 功能 | 说明 |
| --- | --- |
| 查询条件 | 账本、公司、期间、科目、状态筛选 |
| 数据表格 | 展示科目余额列表，支持排序 |
| 分页 | 支持分页导航 |
| 操作按钮 | 编辑、删除、恢复（根据状态显示） |
| 汇总数据 | 显示期初/期末借贷合计 |
| 导出Excel | 导出当前筛选结果 |

### 4.5 弹窗组件（src/components/SubjectBalanceModal.vue）

**弹窗布局（基于前端交互规范）：**

```
┌─────────────────────────────────────────┐
│              新增科目余额 / 编辑科目余额 │
├─────────────────────────────────────────┤
│  ┌───────────────────────────────────┐  │
│  │ 账本：         [账本选择下拉框]   │  │
│  │ 公司：         [公司选择下拉框]   │  │
│  │ 科目：         [科目选择下拉框]   │  │
│  │ 期间：         [期间选择下拉框]   │  │
│  │ 期初借方：     [输入框] (仅资产/成本类) │
│  │ 期初贷方：     [输入框] (仅负债/权益/损益)│
│  │ 备注：         [文本域]           │  │
│  └───────────────────────────────────┘  │
├─────────────────────────────────────────┤
│  ┌───────┐  ┌───────┐                  │
│  │  取消  │  │  确定  │                  │
│  └───────┘  └───────┘                  │
└─────────────────────────────────────────┘
```

**功能实现：**

| 功能 | 说明 |
| --- | --- |
| 表单验证 | 必填字段校验、数值范围校验 |
| 科目类型联动 | 根据科目类型显示/隐藏借方/贷方输入框 |
| 余额计算预览 | 实时计算并显示期末余额 |
| 错误提示 | 根据错误码显示对应提示信息 |

## 五、业务规则实现

### 5.1 科目类型规则

| 科目类型 | 代码 | 允许余额方向 | 期末余额计算 |
| --- | --- | --- | --- |
| 资产类 | 1 | 借方 | endDebit = beginDebit + currentDebit - currentCredit |
| 负债类 | 2 | 贷方 | endCredit = beginCredit + currentCredit - currentDebit |
| 权益类 | 3 | 贷方 | endCredit = beginCredit + currentCredit - currentDebit |
| 成本类 | 4 | 借方 | endDebit = beginDebit + currentDebit - currentCredit |
| 损益类 | 5 | 贷方 | endCredit = currentCredit - currentDebit（收入） |

### 5.2 操作权限控制

| 操作 | 显示条件 |
| --- | --- |
| 编辑 | status=0 且期间未结账 |
| 删除 | status=0 且期间未结账且未生成报表 |
| 恢复 | status=-1（仅管理员） |

### 5.3 错误处理

| 错误码 | 提示信息 |
| --- | --- |
| 1001 | 参数错误，高亮显示对应字段 |
| 1002 | 该科目在当前期间已存在余额记录 |
| 2001 | 资产类科目仅允许填写期初借方余额 |
| 2002 | 会计期间已结账，禁止修改余额 |
| 2003 | 权限不足，无法操作该数据 |
| 2004 | 该余额已生成报表，需先删除报表版本 |
| 4004 | 资源不存在，请刷新后重试 |
| 5000 | 系统繁忙，请稍后再试 |

## 六、测试验证

| 测试项 | 验证内容 |
| --- | --- |
| 页面渲染 | 页面正常加载，布局符合规范 |
| 列表查询 | 多条件筛选、分页、排序功能正常 |
| 新增功能 | 表单验证、科目类型联动、余额计算正确 |
| 编辑功能 | 期初余额修改、期末余额自动计算 |
| 删除功能 | 逻辑删除、删除原因必填 |
| 恢复功能 | 已删除记录恢复 |
| 导出功能 | Excel导出包含筛选条件和汇总数据 |
| 错误处理 | 各错误码正确提示 |

## 七、开发顺序

1. 创建类型定义文件
2. 创建API服务层
3. 扩展Mock数据
4. 创建弹窗组件
5. 创建主页面
6. 测试验证
