<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h1 class="logo">幺鸡测试</h1>
    </div>
    <el-menu
      :default-active="currentRoute"
      mode="vertical"
      class="sidebar-menu"
    >
      <template v-for="group in menuGroups" :key="group.title">
        <el-sub-menu :index="group.title">
          <template #title>
            <span>{{ group.title }}</span>
          </template>
          <el-menu-item
            v-for="item in group.items"
            :key="item.path"
            :index="item.path"
            @click="navigate(item.path)"
          >
            <span>{{ item.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.path)

const menuGroups = [
  {
    title: '首页',
    items: [
      { path: '/dashboard', title: '仪表盘' }
    ]
  },
  {
    title: '设置',
    items: [
      { path: '/settings/company', title: '公司管理' },
      { path: '/settings/employees', title: '员工管理' },
      { path: '/settings/contacts', title: '往来单位' },
      { path: '/settings/categories', title: '收支类别' },
      { path: '/settings/subjects', title: '科目管理' },
      { path: '/settings/accounts', title: '账户管理' },
      { path: '/settings/projects', title: '项目管理' },
      { path: '/settings/departments', title: '部门管理' },
      { path: '/settings/roles', title: '角色管理' },
      { path: '/settings/currencies', title: '币种管理' },
      { path: '/settings/logs', title: '业务日志' }
    ]
  },
  {
    title: '业务',
    items: [
      { path: '/business/income', title: '收入管理' },
      { path: '/business/expense', title: '费用支出' },
      { path: '/business/bonus', title: '分红管理' },
      { path: '/business/share-change', title: '股权变更' }
    ]
  },
  {
    title: '库存',
    items: [
      { path: '/purchase/in', title: '采购入库' }
    ]
  },
  {
    title: '财务',
    items: [
      { path: '/finance/receivable', title: '往来款管理' },
      { path: '/borrowLend', title: '借入借出' },
      { path: '/advance', title: '预收预付' }
    ]
  },
  {
    title: '看账',
    items: [
      { path: '/ledger/subject-balance', title: '科目余额表' },
      { path: '/ledger/trial-balance', title: '试算平衡' }
    ]
  },
  {
    title: '固定资产',
    items: [
      { path: '/fixedAsset/card', title: '资产卡片' },
      { path: '/fixedAsset/purchase', title: '资产购置' },
      { path: '/fixedAsset/depreciation', title: '折旧计提' },
      { path: '/fixedAsset/disposal', title: '资产处置' },
      { path: '/fixedAsset/ledger', title: '资产台账' },
      { path: '/fixedAsset/summary-category', title: '按类别汇总' },
      { path: '/fixedAsset/summary-dept', title: '按部门汇总' }
    ]
  },
  {
    title: '工资',
    items: [
      { path: '/salary/accrued', title: '工资计提' },
      { path: '/salary/issue', title: '工资发放' }
    ]
  },
  {
    title: '分析',
    items: [
      { path: '/analysis/overview', title: '数据分析' },
      { path: '/analysis/income', title: '收入分析' },
      { path: '/analysis/expense', title: '支出分析' }
    ]
  }
]

const navigate = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  background-color: #1f2937;
  color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #374151;
}

.logo {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.sidebar-menu {
  border-right: none;
  background-color: transparent;
  color: #9ca3af;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  color: #9ca3af;
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: #374151;
  color: #fff;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: #3b82f6;
  color: #fff;
}
</style>
