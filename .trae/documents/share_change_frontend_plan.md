# 股权变更模块前端功能实现计划

## 1. 项目概述

根据股权变更模块的业务需求文档和接口规范，本计划将实现股权变更模块的前端功能，包括列表页、新增、编辑和详情查看功能。

### 1.1 技术栈

| 分类   | 技术           | 版本     |
| ---- | ------------ | ------ |
| 框架   | Vue          | 3.4.21 |
| 路由   | Vue Router   | 4.3.0  |
| UI组件 | Element Plus | 2.6.1  |
| 状态管理 | Pinia        | 2.1.7  |
| 构建工具 | Vite         | 6.4.2  |
| 语言   | TypeScript   | 5.4.5  |

### 1.2 参考文档

* [03-股权变更模块-业务功能.md](file:///e:/oneDrive/note/生成代码/04功能清单/02业务/股权变更/03-股权变更模块-业务功能.md)

* [05-股权变更模块-接口规范.md](file:///e:/oneDrive/note/生成代码/04功能清单/02业务/股权变更/05-股权变更模块-接口规范.md)

* [06-股权变更模块-前端交互规范.md](file:///e:/oneDrive/note/生成代码/04功能清单/02业务/股权变更/06-股权变更模块-前端交互规范.md)

***

## 2. 需求分析

### 2.1 功能需求

| 功能点    | 描述                     | 状态  |
| ------ | ---------------------- | --- |
| 列表展示   | 展示股权变更记录列表，支持分页、筛选     | 需实现 |
| 新增股权变更 | 创建新的股权变更单据             | 需实现 |
| 编辑股权变更 | 修改已有股权变更单据（仅限未生成凭证的记录） | 需实现 |
| 删除股权变更 | 逻辑删除股权变更单据（仅限未生成凭证的记录） | 需实现 |
| 查看详情   | 查看股权变更单据的详细信息，包含凭证信息   | 需实现 |

### 2.2 字段定义

根据接口规范，股权变更单据包含以下字段：

| 字段名           | 类型            | 必填 | 说明               |
| ------------- | ------------- | -- | ---------------- |
| tradeTime     | string        | 是  | 业务日期（YYYY-MM-DD） |
| changeType    | int           | 是  | 变更类型（1=增股，2=减股）  |
| shareholderId | long          | 是  | 股东ID             |
| accountId     | long          | 是  | 收付款账户ID          |
| amount        | decimal(19,4) | 是  | 变更金额（>0）         |
| currencyCode  | string        | 是  | 币种代码（默认CNY）      |
| exchangeRate  | decimal(19,8) | 是  | 汇率（默认1.00000000） |
| remark        | string        | 否  | 备注（≤256字）        |

### 2.3 状态码说明

| 状态码  | 说明         |
| ---- | ---------- |
| 0    | 请求成功       |
| 1001 | 参数校验失败     |
| 3002 | 存在关联业务禁止编辑 |
| 3003 | 存在关联业务禁止删除 |
| 4004 | 资源不存在      |

***

## 3. 文件结构规划

### 3.1 新增文件

| 文件路径                                     | 文件说明       |
| ---------------------------------------- | ---------- |
| `src/pages/business/ShareChange.vue`     | 股权变更列表页    |
| `src/pages/business/ShareChangeAdd.vue`  | 新增股权变更页面   |
| `src/pages/business/ShareChangeEdit.vue` | 编辑股权变更页面   |
| `src/pages/business/ShareChangeView.vue` | 查看股权变更详情页面 |

### 3.2 修改文件

| 文件路径                   | 修改内容              |
| ---------------------- | ----------------- |
| `src/router/index.ts`  | 添加股权变更模块路由        |
| `src/data/mockData.ts` | 添加股权变更相关Mock数据和接口 |

***

## 4. 页面设计

### 4.1 列表页（ShareChange.vue）

**布局结构：**

* 顶部搜索栏：业务日期范围、变更类型下拉、股东下拉、收付款账户下拉、状态筛选

* 操作按钮区：新增股权变更、导出、刷新

* 数据列表区：业务日期、变更类型、股东、收付款账户、变更金额、币种、状态、操作

* 底部分页区：页码选择、每页数量选择、总数统计

**交互功能：**

* 多条件组合筛选

* 分页展示

* 查看、编辑、删除操作

### 4.2 新增/编辑页面（ShareChangeAdd.vue / ShareChangeEdit.vue）

**布局结构：**

* 基本信息区：业务日期、变更类型、股东、收付款账户、变更金额、币种、汇率

* 可选信息区：备注

* 操作按钮区：保存、取消

**交互功能：**

* 变更类型切换时自动筛选账户类型（增股=收款账户，减股=付款账户）

* 表单校验（必填字段、格式校验）

* 保存成功后返回列表页并刷新

### 4.3 详情页面（ShareChangeView\.vue）

**布局结构：**

* 基础信息：业务日期、变更类型、变更金额、状态、制单时间、修改时间、备注

* 关联信息：股东名称、收付款账户名称、制单人、修改人

* 财务信息：凭证编号、借贷方科目及金额

* 币种信息：币种代码、汇率

**交互功能：**

* 关闭弹窗返回列表页

***

## 5. 路由规划

| 路由路径                              | 组件              | 说明       |
| --------------------------------- | --------------- | -------- |
| `/business/share-change`          | ShareChange     | 股权变更列表页  |
| `/business/share-change/add`      | ShareChangeAdd  | 新增股权变更   |
| `/business/share-change/edit/:id` | ShareChangeEdit | 编辑股权变更   |
| `/business/share-change/view/:id` | ShareChangeView | 查看股权变更详情 |

***

## 6. 数据模型设计

### 6.1 接口响应结构

```typescript
// 股权变更列表项
interface ShareChangeListItem {
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

// 股权变更详情
interface ShareChangeDetail {
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

// 新增/编辑请求体
interface ShareChangeForm {
  tradeTime: string
  changeType: number
  shareholderId: number
  accountId: number
  amount: number
  currencyCode: string
  exchangeRate: number
  remark?: string
}
```

***

## 7. 实现步骤

### Task 1: 添加Mock数据和类型定义

**文件：** `src/data/mockData.ts`

**内容：**

* 添加股权变更相关的类型定义（ShareChangeListItem, ShareChangeDetail, ShareChangeForm）

* 添加Mock股权变更数据

* 添加股东数据（已有）

### Task 2: 配置路由

**文件：** `src/router/index.ts`

**内容：**

* 导入股权变更相关组件

* 添加路由配置

### Task 3: 实现列表页

**文件：** `src/pages/business/ShareChange.vue`

**功能：**

* 搜索栏（日期范围、变更类型、股东、账户、状态）

* 数据列表（业务日期、变更类型、股东、账户、金额、币种、状态、操作）

* 分页组件

* 新增、查看、编辑、删除操作

### Task 4: 实现新增页面

**文件：** `src/pages/business/ShareChangeAdd.vue`

**功能：**

* 表单字段（业务日期、变更类型、股东、账户、金额、币种、汇率、备注）

* 变更类型联动账户筛选

* 表单校验

* 保存功能

### Task 5: 实现编辑页面

**文件：** `src/pages/business/ShareChangeEdit.vue`

**功能：**

* 根据ID加载原有数据

* 表单字段与新增页面一致

* 保存功能（调用更新接口）

### Task 6: 实现详情页面

**文件：** `src/pages/business/ShareChangeView.vue`

**功能：**

* 根据ID加载详情数据

* 展示基础信息、关联信息、财务信息

* 返回按钮

***

## 8. 进度安排

| 序号 | 任务            | 预计耗时  | 状态      |
| -- | ------------- | ----- | ------- |
| 1  | 添加Mock数据和类型定义 | 0.5小时 | pending |
| 2  | 配置路由          | 0.5小时 | pending |
| 3  | 实现列表页         | 2小时   | pending |
| 4  | 实现新增页面        | 2小时   | pending |
| 5  | 实现编辑页面        | 1.5小时 | pending |
| 6  | 实现详情页面        | 1.5小时 | pending |
| 7  | 测试与验证         | 1小时   | pending |

***

## 9. 注意事项

1. **状态校验**：编辑和删除操作前需检查是否存在关联凭证，若存在则禁止操作
2. **账户类型联动**：变更类型为增股时显示收款账户，减股时显示付款账户
3. **数据格式**：日期格式为YYYY-MM-DD，金额支持4位小数，汇率支持8位小数
4. **错误处理**：根据接口返回的错误码显示对应的错误提示
5. **代码风格**：遵循项目现有代码风格，使用Element Plus组件库

