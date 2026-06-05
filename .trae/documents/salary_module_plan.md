# 工资发放与工资计提模块前端实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

---

## 一、需求分析

### 1.1 工资发放模块需求

**核心功能：**
- 工资发放单管理（新增、编辑、删除、查看）
- 员工发放明细管理（添加、编辑、删除）
- 从计提单导入员工数据
- 工资发放（生成凭证）
- 工资发放单作废

**状态流转：**
```
草稿 → 已发放 → 已作废
  ↑              ↑
  └──────────────┘
```

### 1.2 工资计提模块需求

**核心功能：**
- 工资计提单管理（新增、编辑、删除、查看）
- 员工工资明细管理（应发、代扣、实发）
- 批量导入员工工资
- 工资计提确认（生成凭证）
- 工资计提单作废

**状态流转：**
```
草稿 → 已确认 → 已作废
  ↑              ↑
  └──────────────┘
```

---

## 二、技术架构

### 2.1 技术栈
| 分类 | 技术 | 版本 |
|------|------|------|
| 框架 | Vue | 3.4+ |
| 路由 | Vue Router | 4.3+ |
| UI组件 | Element Plus | 2.6+ |
| 状态管理 | Pinia | 2.1+ |
| 构建工具 | Vite | 6.4+ |
| 语言 | TypeScript | 5.4+ |

### 2.2 项目结构

```
src/
├── pages/
│   └── salary/
│       ├── accrued/          # 工资计提
│       │   ├── Accrued.vue           # 列表页
│       │   ├── AccruedAdd.vue        # 新增页
│       │   ├── AccruedEdit.vue       # 编辑页
│       │   └── AccruedView.vue       # 详情页
│       └── issue/            # 工资发放
│           ├── Issue.vue             # 列表页
│           ├── IssueAdd.vue          # 新增页
│           ├── IssueEdit.vue         # 编辑页
│           └── IssueView.vue         # 详情页
├── router/
│   └── index.ts              # 路由配置
├── data/
│   └── mockData.ts           # Mock数据
└── types/
    └── salary.ts             # 类型定义（新增）
```

### 2.3 路由规划

| 模块 | 路径 | 组件 |
|------|------|------|
| 工资计提列表 | `/salary/accrued` | Accrued.vue |
| 新增工资计提 | `/salary/accrued/add` | AccruedAdd.vue |
| 编辑工资计提 | `/salary/accrued/edit/:id` | AccruedEdit.vue |
| 查看工资计提 | `/salary/accrued/view/:id` | AccruedView.vue |
| 工资发放列表 | `/salary/issue` | Issue.vue |
| 新增工资发放 | `/salary/issue/add` | IssueAdd.vue |
| 编辑工资发放 | `/salary/issue/edit/:id` | IssueEdit.vue |
| 查看工资发放 | `/salary/issue/view/:id` | IssueView.vue |

---

## 三、接口对接

### 3.1 工资发放接口

| 接口 | 方法 | 路径 |
|------|------|------|
| 列表查询 | GET | `/api/salary-issue/list` |
| 新增 | POST | `/api/salary-issue` |
| 详情 | GET | `/api/salary-issue/{id}` |
| 编辑 | PUT | `/api/salary-issue/{id}` |
| 删除 | DELETE | `/api/salary-issue/{id}` |
| 发放 | POST | `/api/salary-issue/{id}/issue` |
| 作废 | POST | `/api/salary-issue/{id}/void` |
| 添加明细 | POST | `/api/salary-issue/{id}/items` |
| 编辑明细 | PUT | `/api/salary-issue/items/{itemId}` |
| 删除明细 | DELETE | `/api/salary-issue/items/{itemId}` |
| 从计提单导入 | POST | `/api/salary-issue/import-from-accrued` |
| 获取可计提列表 | GET | `/api/salary-issue/accrued-list` |

### 3.2 工资计提接口

| 接口 | 方法 | 路径 |
|------|------|------|
| 列表查询 | GET | `/api/salary-accrued/list` |
| 新增 | POST | `/api/salary-accrued` |
| 详情 | GET | `/api/salary-accrued/{id}` |
| 编辑 | PUT | `/api/salary-accrued/{id}` |
| 删除 | DELETE | `/api/salary-accrued/{id}` |
| 确认 | POST | `/api/salary-accrued/{id}/confirm` |
| 作废 | POST | `/api/salary-accrued/{id}/void` |
| 添加明细 | POST | `/api/salary-accrued/{id}/items` |
| 编辑明细 | PUT | `/api/salary-accrued/items/{itemId}` |
| 删除明细 | DELETE | `/api/salary-accrued/items/{itemId}` |
| 批量导入 | POST | `/api/salary-accrued/{id}/import` |

---

## 四、任务清单

### Task 1: 创建类型定义文件

**文件:**
- 新增: `src/types/salary.ts`

**内容:**
- SalaryAccruedVO - 工资计提单视图对象
- SalaryAccruedItemVO - 工资计提明细视图对象
- SalaryIssueVO - 工资发放单视图对象
- SalaryIssueItemVO - 工资发放明细视图对象
- AccruedForIssueVO - 可关联的工资计提单视图对象

### Task 2: 添加路由配置

**文件:**
- 修改: `src/router/index.ts`

**内容:**
- 添加工资计提模块路由（列表、新增、编辑、查看）
- 添加工资发放模块路由（列表、新增、编辑、查看）

### Task 3: 创建Mock数据

**文件:**
- 修改: `src/data/mockData.ts`

**内容:**
- 添加工资计提单Mock数据
- 添加工资发放单Mock数据
- 添加员工工资明细Mock数据

### Task 4: 实现工资计提列表页

**文件:**
- 新增: `src/pages/salary/accrued/Accrued.vue`

**功能:**
- 列表展示（单号、期间、计提日期、应发合计、实发合计、状态、制单人）
- 筛选条件（期间、状态、日期范围、关键字）
- 分页功能
- 操作按钮（新增、查看、编辑、删除、确认、作废）

### Task 5: 实现工资计提新增页

**文件:**
- 新增: `src/pages/salary/accrued/AccruedAdd.vue`

**功能:**
- 工资所属期间选择
- 计提日期选择
- 员工明细表格（员工、部门、费用类别、基本工资、岗位津贴、绩效奖金、其他补贴、社保代扣、公积金代扣、个税代扣、其他代扣）
- 自动计算应发合计、代扣合计、实发金额
- 添加/删除员工明细
- 保存按钮

### Task 6: 实现工资计提编辑页

**文件:**
- 新增: `src/pages/salary/accrued/AccruedEdit.vue`

**功能:**
- 加载已有数据
- 编辑主表信息（期间、日期、备注）
- 编辑员工明细
- 保存按钮

### Task 7: 实现工资计提详情页

**文件:**
- 新增: `src/pages/salary/accrued/AccruedView.vue`

**功能:**
- 展示工资计提单完整信息
- 展示员工明细列表
- 展示汇总统计（应发合计、代扣合计、实发合计）
- 展示关联凭证信息（已确认时）
- 操作按钮（编辑、删除、确认、作废）

### Task 8: 实现工资发放列表页

**文件:**
- 新增: `src/pages/salary/issue/Issue.vue`

**功能:**
- 列表展示（单号、期间、关联计提单号、发放账户、发放日期、实发合计、状态、制单人）
- 筛选条件（期间、发放账户、状态、日期范围、关键字）
- 分页功能
- 操作按钮（新增、查看、编辑、删除、发放、作废）

### Task 9: 实现工资发放新增页

**文件:**
- 新增: `src/pages/salary/issue/IssueAdd.vue`

**功能:**
- 工资所属期间选择
- 关联计提单选择（可选）
- 发放账户选择
- 发放日期选择
- 员工明细表格（员工、部门、实发金额）
- 从计提单导入员工数据功能
- 自动计算实发合计
- 添加/删除员工明细
- 保存按钮

### Task 10: 实现工资发放编辑页

**文件:**
- 新增: `src/pages/salary/issue/IssueEdit.vue`

**功能:**
- 加载已有数据
- 编辑主表信息（账户、日期、备注）
- 编辑员工明细
- 保存按钮

### Task 11: 实现工资发放详情页

**文件:**
- 新增: `src/pages/salary/issue/IssueView.vue`

**功能:**
- 展示工资发放单完整信息
- 展示关联计提单信息
- 展示员工明细列表
- 展示汇总统计（实发合计）
- 展示关联凭证信息（已发放时）
- 操作按钮（编辑、删除、发放、作废）

---

## 五、依赖关系

```
Task 1 ──→ Task 2 ──→ Task 3
     │          │          │
     ↓          ↓          ↓
Task 4 ──→ Task 5 ──→ Task 6 ──→ Task 7
     │          │          │          │
     ↓          ↓          ↓          ↓
Task 8 ──→ Task 9 ──→ Task 10 ──→ Task 11
```

**说明：**
- Task 1-3 为基础准备工作，可并行执行
- Task 4-7 为工资计提模块，需按顺序执行
- Task 8-11 为工资发放模块，需按顺序执行
- 工资发放模块依赖工资计提模块的Mock数据

---

## 六、进度预估

| 任务 | 预估工时（小时） |
|------|----------------|
| Task 1 | 1 |
| Task 2 | 0.5 |
| Task 3 | 2 |
| Task 4 | 3 |
| Task 5 | 4 |
| Task 6 | 2 |
| Task 7 | 2 |
| Task 8 | 3 |
| Task 9 | 4 |
| Task 10 | 2 |
| Task 11 | 2 |
| **总计** | **25** |

---

## 七、代码规范

### 7.1 文件命名
- 使用 PascalCase 命名组件文件
- 使用 kebab-case 命名路由路径

### 7.2 组件规范
- 每个组件职责单一
- 使用 `<script setup lang="ts">` 语法
- 使用 TypeScript 类型定义
- 遵循 Element Plus 组件使用规范

### 7.3 样式规范
- 使用 scoped 样式
- 遵循项目现有的样式风格
- 使用 Tailwind CSS 工具类（如项目已配置）

### 7.4 数据规范
- Mock数据结构与接口返回结构保持一致
- 使用响应式数据（ref/reactive）
- 遵循 Vue 3 Composition API 规范