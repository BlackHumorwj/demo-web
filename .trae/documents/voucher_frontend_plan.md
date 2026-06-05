# 凭证分录表前端功能完善计划

## 1. 需求分析

根据凭证分录表模块文档，前端需要实现以下功能：

### 1.1 页面需求
| 页面 | 功能 | 状态 |
|------|------|------|
| 凭证列表页 | 筛选（编号、日期、状态）、分页、查看入口 | 部分实现 |
| 凭证详情页 | 展示凭证信息、分录列表、操作按钮（审核/记账/删除） | 未实现 |
| 操作对话框 | 审核确认、记账确认、删除确认 | 未实现 |

### 1.2 接口需求
| 接口 | 方法 | 路径 | 状态 |
|------|------|------|------|
| 分页查询凭证 | POST | `/api/vouchers/page` | 未实现 |
| 查询凭证详情 | GET | `/api/vouchers/{voucherId}` | 未实现 |
| 凭证审核 | PUT | `/api/vouchers/{voucherId}/approve` | 未实现 |
| 凭证记账 | PUT | `/api/vouchers/{voucherId}/post` | 未实现 |
| 凭证删除 | DELETE | `/api/vouchers/{voucherId}` | 未实现 |

---

## 2. 实现计划

### 2.1 创建类型定义文件

**文件路径**: `src/types/voucher.ts`

定义凭证相关的类型：
- Voucher（凭证主信息）
- VoucherEntry（分录信息）
- VoucherQueryDTO（查询参数）
- VoucherPageResponse（分页响应）

### 2.2 创建服务层

**文件路径**: `src/services/voucher.ts`

封装接口调用：
- `getVoucherPage(query: VoucherQueryDTO)` - 分页查询
- `getVoucherDetail(voucherId: number)` - 获取详情
- `approveVoucher(voucherId: number)` - 审核凭证
- `postVoucher(voucherId: number)` - 记账凭证
- `deleteVoucher(voucherId: number)` - 删除凭证

### 2.3 更新凭证列表页面

**文件路径**: `src/pages/finance/Voucher.vue`

完善功能：
- 添加筛选区域（凭证编号、日期范围、状态下拉）
- 添加分页组件
- 修改表格列（序号、凭证编号、凭证日期、摘要、状态、制单人、操作）
- 状态标签样式（橙色-未审核、蓝色-已审核、绿色-已记账）
- 操作列只显示"查看"按钮

### 2.4 创建凭证详情页面

**文件路径**: `src/pages/finance/VoucherView.vue`

实现功能：
- 展示凭证基本信息（编号、日期、摘要、制单人、状态）
- 展示关联业务信息（业务类型、单据编号、收支类别、账户、业务员、部门）
- 展示分录列表（科目编码、科目名称、方向、金额、备注）
- 显示借贷平衡校验
- 根据状态显示操作按钮（审核/记账/删除）
- 操作确认对话框

### 2.5 更新路由配置

**文件路径**: `src/router/index.ts`

添加详情页路由：
```typescript
{ path: '/finance/voucher/view/:id', component: FinanceVoucherView }
```

### 2.6 更新模拟数据

**文件路径**: `src/data/mockData.ts`

完善凭证模拟数据结构，包含：
- 分录列表
- 关联业务信息
- 完整的状态流转

---

## 3. 文件修改清单

| 文件路径 | 修改类型 | 说明 |
|----------|----------|------|
| `src/types/voucher.ts` | 新建 | 凭证类型定义 |
| `src/services/voucher.ts` | 新建 | 凭证服务层 |
| `src/pages/finance/Voucher.vue` | 修改 | 完善列表页 |
| `src/pages/finance/VoucherView.vue` | 新建 | 凭证详情页 |
| `src/router/index.ts` | 修改 | 添加详情页路由 |
| `src/data/mockData.ts` | 修改 | 更新模拟数据 |

---

## 4. 状态流转规则

| 当前状态 | 可执行操作 | 操作后状态 |
|----------|-----------|-----------|
| 未审核(0) | 审核、删除 | 审核→已审核(1)，删除→已删除(-1) |
| 已审核(1) | 记账 | 记账→已记账(2) |
| 已记账(2) | 无 | - |

---

## 5. 前端交互规范

### 5.1 筛选区域组件
| 字段 | 组件类型 | 说明 |
|------|---------|------|
| 凭证编号 | el-input | 支持模糊匹配 |
| 开始日期 | el-date-picker | 格式 YYYY-MM-DD |
| 结束日期 | el-date-picker | 格式 YYYY-MM-DD |
| 凭证状态 | el-select | 全部/未审核/已审核/已记账 |

### 5.2 状态标签样式
| 状态 | 标签类型 | 样式 |
|------|---------|------|
| 未审核 | warning | 橙色 |
| 已审核 | info | 蓝色 |
| 已记账 | success | 绿色 |

### 5.3 操作按钮显示规则
| 凭证状态 | 显示按钮 |
|----------|---------|
| 未审核(0) | 审核、删除 |
| 已审核(1) | 记账 |
| 已记账(2) | 无 |

---

## 6. 风险与注意事项

1. **接口兼容性**：确保服务层调用与后端接口规范一致
2. **状态校验**：前端需要根据凭证状态控制按钮显示
3. **借贷平衡展示**：详情页需显示借方合计和贷方合计
4. **分页参数**：默认 page=1, pageSize=10
5. **日期格式**：统一使用 YYYY-MM-DD 格式