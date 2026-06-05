# 会计凭证试算平衡模块前端开发计划

## 1. 需求分析

### 1.1 模块概述
根据接口规范和前端交互规范，会计凭证试算平衡模块包含以下核心功能：

| 功能模块 | 说明 |
|---------|------|
| 试算平衡校验组件 | 凭证录入界面底部的实时校验区域 |
| 科目试算平衡表页面 | 查询指定期间的科目试算平衡表 |
| 校验记录查询 | 查询历史试算平衡校验记录 |
| 科目余额规则 | 获取科目余额方向校验规则配置 |

### 1.2 接口列表

| 接口名称 | 请求方式 | 路径 |
|---------|---------|------|
| 凭证借贷平衡校验 | POST | /api/trial-balance/validate-voucher |
| 科目余额方向校验 | POST | /api/trial-balance/validate-subject |
| 凭证完整性检查 | POST | /api/trial-balance/check-voucher |
| 科目试算平衡表查询 | GET | /api/trial-balance/sheet |
| 试算平衡校验记录查询 | GET | /api/trial-balance/logs |
| 获取科目余额规则 | GET | /api/trial-balance/rules |

## 2. 技术架构

### 2.1 技术栈
- **框架**: Vue 3 + TypeScript
- **UI库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **构建工具**: Vite

### 2.2 文件结构

```
src/
├── components/
│   └── TrialBalanceValidator.vue    # 试算平衡校验组件
├── pages/
│   └── ledger/
│       └── TrialBalance.vue         # 试算平衡表页面（更新）
├── services/
│   └── trialBalance.ts              # API服务层
├── data/
│   └── mockData.ts                  # Mock数据（扩展）
├── types/
│   └── trialBalance.ts              # 类型定义
└── router/
    └── index.ts                     # 路由配置（已配置）
```

## 3. 开发任务

### 任务1：创建类型定义文件

**文件**: `src/types/trialBalance.ts`

定义以下接口：
- VoucherEntry（分录）
- ValidateVoucherRequest（凭证校验请求）
- ValidateVoucherResponse（凭证校验响应）
- ValidateSubjectRequest（科目校验请求）
- ValidateSubjectResponse（科目校验响应）
- CheckVoucherResponse（完整性检查响应）
- TrialBalanceSheet（试算平衡表）
- TrialBalanceLog（校验记录）
- BalanceRule（余额规则）

### 任务2：创建API服务层

**文件**: `src/services/trialBalance.ts`

实现以下方法：
- `validateVoucher` - 凭证借贷平衡校验
- `validateSubject` - 科目余额方向校验
- `checkVoucher` - 凭证完整性检查
- `getTrialBalanceSheet` - 查询试算平衡表
- `getTrialBalanceLogs` - 查询校验记录
- `getBalanceRules` - 获取余额规则

### 任务3：扩展Mock数据

**文件**: `src/data/mockData.ts`

添加试算平衡相关的mock数据：
- 科目试算平衡表数据
- 校验记录数据
- 余额规则数据

### 任务4：更新试算平衡表页面

**文件**: `src/pages/ledger/TrialBalance.vue`

根据前端交互规范更新：
1. 查询条件区域（会计期间、科目级别、科目类型、包含未记账凭证）
2. 平衡状态展示区
3. 数据表格区（期初借方、期初贷方、本期借方、本期贷方、期末借方、期末贷方）
4. 合计行
5. 导出/打印按钮

### 任务5：创建试算平衡校验组件

**文件**: `src/components/TrialBalanceValidator.vue`

实现以下功能：
1. 实时显示借方合计、贷方合计、差额、分录数
2. 平衡状态图标显示（平衡/不平衡）
3. 错误和警告消息列表
4. 防抖校验机制

## 4. 关键交互实现

### 4.1 实时校验交互
- 新增/修改/删除分录时触发校验（防抖500ms）
- 颜色变化：平衡显示绿色，不平衡显示红色
- 根据平衡状态启用/禁用保存按钮

### 4.2 保存前检查交互
- 调用完整性检查接口
- 有错误：显示错误列表，阻止保存
- 仅有警告：弹出确认对话框
- 全部通过：直接保存

### 4.3 试算平衡表查询交互
- 选择会计期间后自动触发查询
- 支持按科目级别和类型筛选
- 显示平衡状态标识
- 支持导出Excel和打印

## 5. 样式规范

### 5.1 配色方案
| 用途 | 颜色值 |
|------|--------|
| 成功/平衡 | #67C23A |
| 错误/不平衡 | #F56C6C |
| 警告 | #E6A23C |
| 正常文字 | #606266 |

### 5.2 金额显示规则
- 保留2位小数
- 千分位分隔
- 负数用红色显示
- 显示货币符号 ¥

## 6. 开发进度

| 任务 | 预计时间 | 状态 |
|------|---------|------|
| 创建类型定义 | 1小时 | 未开始 |
| 创建API服务层 | 2小时 | 未开始 |
| 扩展Mock数据 | 1小时 | 未开始 |
| 更新试算平衡表页面 | 3小时 | 未开始 |
| 创建校验组件 | 2小时 | 未开始 |
| 测试与验证 | 1小时 | 未开始 |

## 7. 依赖与风险

### 7.1 依赖
- Element Plus 组件库
- 路由已配置 `/ledger/trial-balance`

### 7.2 风险点
- 后端接口未就绪，需使用mock数据
- 凭证录入页面尚未开发，校验组件需预留接口