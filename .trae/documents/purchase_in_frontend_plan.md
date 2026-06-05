# 采购入库模块前端功能实现计划

## 一、需求分析

根据采购入库模块文档，需要实现以下页面：

| 页面名称 | 路径 | 说明 |
|---------|------|------|
| 采购入库列表 | /purchase/in | 展示采购入库单列表，支持筛选、分页 |
| 新增采购入库 | /purchase/in/add | 新增采购入库单表单 |
| 编辑采购入库 | /purchase/in/edit/{bizDocId} | 编辑采购入库单表单 |
| 采购入库详情 | /purchase/in/detail/{bizDocId} | 查看采购入库单详情 |

## 二、技术架构

### 2.1 技术栈
- Vue 3 + TypeScript
- Element Plus UI组件库
- Vue Router
- Vite 构建工具

### 2.2 文件结构
```
src/
├── pages/
│   └── purchase/
│       ├── In.vue           # 列表页
│       ├── InAdd.vue        # 新增页
│       ├── InEdit.vue       # 编辑页
│       └── InView.vue       # 详情页
├── data/
│   └── mockData.ts          # Mock数据（新增采购入库相关）
└── router/
    └── index.ts             # 路由配置
```

### 2.3 数据模型

根据接口规范，采购入库单数据结构：

| 字段 | 类型 | 说明 |
|------|------|------|
| bizDocId | long | 业务记录ID |
| bizDocNo | string | 单据编号 |
| tradeTime | string | 业务日期 |
| bizContactId | long | 供应商ID |
| bizContactName | string | 供应商名称 |
| warehouseId | long | 仓库ID |
| warehouseName | string | 仓库名称 |
| accountId | long | 结算账户ID |
| accountName | string | 结算账户名称 |
| staffId | long | 业务员ID |
| staffName | string | 业务员名称 |
| currencyCode | string | 币种代码 |
| exchangeRate | decimal | 汇率 |
| deptId | long | 部门ID |
| deptName | string | 部门名称 |
| projectId | long | 项目ID |
| projectName | string | 项目名称 |
| totalCost | decimal | 总金额 |
| remark | string | 备注 |
| writerId | long | 制单人ID |
| writerName | string | 制单人名称 |
| writerTime | string | 制单时间 |
| updateId | long | 更新人ID |
| updateName | string | 更新人名称 |
| updateTime | string | 更新时间 |
| status | int | 状态（0=正常，-1=已删除） |
| items | array | 采购入库明细列表 |

采购入库明细：

| 字段 | 类型 | 说明 |
|------|------|------|
| itemId | long | 明细ID |
| productId | long | 产品ID |
| productName | string | 产品名称 |
| quantity | decimal | 采购数量 |
| price | decimal | 采购单价 |
| originalAmount | decimal | 原币金额 |
| costAmount | decimal | 成本金额 |
| remark | string | 明细备注 |

## 三、任务分解

### Task 1: 更新Mock数据

**文件:** `src/data/mockData.ts`

新增采购入库相关接口类型和Mock数据：
- 定义采购入库单接口类型 `PurchaseInDoc`
- 定义采购入库明细接口类型 `PurchaseInItem`
- 添加模拟采购入库数据

### Task 2: 创建采购入库列表页

**文件:** `src/pages/purchase/In.vue`

实现功能：
- 搜索栏：业务日期范围、供应商、仓库、业务员筛选
- 数据表格展示：单据编号、业务日期、供应商、仓库、总金额、状态、操作
- 分页功能
- 新增、查看、编辑、删除操作

### Task 3: 创建新增采购入库页

**文件:** `src/pages/purchase/InAdd.vue`

实现功能：
- 表单字段：业务日期、供应商、仓库、结算账户、业务员、部门（选填）、项目（选填）、币种、汇率、备注
- 商品明细表格：商品选择、数量、单价、金额、备注
- 合计金额计算
- 表单验证
- 保存和取消操作

### Task 4: 创建编辑采购入库页

**文件:** `src/pages/purchase/InEdit.vue`

实现功能：
- 根据ID加载采购入库单详情
- 表单字段与新增页一致
- 商品明细全量更新
- 保存和取消操作

### Task 5: 创建采购入库详情页

**文件:** `src/pages/purchase/InView.vue`

实现功能：
- 根据ID加载采购入库单详情
- 展示主表信息
- 展示商品明细
- 展示库存流水（Mock数据）
- 展示应付账款（赊购场景，Mock数据）
- 展示会计凭证（Mock数据）
- 编辑、删除、返回操作

### Task 6: 更新路由配置

**文件:** `src/router/index.ts`

添加采购入库相关路由：
- `/purchase/in` - 列表页
- `/purchase/in/add` - 新增页
- `/purchase/in/edit/:id` - 编辑页
- `/purchase/in/detail/:id` - 详情页

## 四、依赖与资源

### 4.1 现有依赖
- Vue 3 + TypeScript
- Element Plus
- Vue Router

### 4.2 资源引用
- 复用现有Mock数据中的供应商、仓库、账户、员工、部门、项目等数据

## 五、风险与注意事项

1. **表单验证**：需确保必填字段验证、数值校验（数量>0，单价>0）
2. **日期校验**：业务日期需小于等于当前日期
3. **状态管理**：只有状态为正常的单据可编辑/删除
4. **错误处理**：需处理接口错误码（如3004期间已过账）
5. **成本重算提示**：编辑或删除触发成本重算时需提示用户

## 六、验证计划

- [ ] Task 1: Mock数据更新完成
- [ ] Task 2: 列表页功能验证（搜索、分页、操作）
- [ ] Task 3: 新增页功能验证（表单验证、保存）
- [ ] Task 4: 编辑页功能验证（加载、更新）
- [ ] Task 5: 详情页功能验证（展示、操作）
- [ ] Task 6: 路由配置验证