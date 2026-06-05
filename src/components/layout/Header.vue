<template>
  <header class="header">
    <div class="header-left">
      <h2 class="page-title">{{ pageTitle }}</h2>
    </div>
    <div class="header-right">
      <ReviewModeToggle />
      <el-button
        v-if="isReviewMode"
        size="small"
        :type="isSidebarOpen ? 'primary' : 'default'"
        @click="toggleSidebar"
        class="sidebar-toggle-btn"
      >
        <EditPen class="icon" />
        {{ isSidebarOpen ? '关闭批注' : '批注面板' }}
      </el-button>
      <el-dropdown>
        <span class="user-info">
          <span>{{ user?.name }}</span>
          <el-icon class="el-icon-caret-down" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'
import { useReviewStore } from '@/stores/reviewStore'
import { EditPen } from '@element-plus/icons-vue'
import ReviewModeToggle from '@/components/ReviewModeToggle.vue'

const router = useRouter()
const route = useRoute()
const store = useAppStore()
const reviewStore = useReviewStore()

const user = computed(() => store.user)
const isReviewMode = computed(() => reviewStore.isReviewMode)
const isSidebarOpen = computed(() => reviewStore.isSidebarOpen)

function toggleSidebar() {
  reviewStore.toggleSidebar()
}

const pageTitleMap: Record<string, string> = {
  '/dashboard': '首页仪表盘',
  '/settings/company': '公司管理',
  '/settings/employees': '员工管理',
  '/settings/contacts': '往来单位',
  '/settings/categories': '收支类别',
  '/settings/subjects': '科目管理',
  '/settings/accounts': '账户管理',
  '/settings/projects': '项目管理',
  '/settings/departments': '部门管理',
  '/settings/roles': '角色管理',
  '/settings/currencies': '币种管理',
  '/settings/logs': '业务日志',
  '/business/income': '收入管理',
  '/business/expense': '费用支出',
  '/purchase/in': '采购入库',
  '/finance/receivable': '往来款管理',
  '/analysis/overview': '数据分析',
  '/analysis/income': '收入分析',
  '/analysis/expense': '支出分析'
}

const pageTitle = computed(() => pageTitleMap[route.path] || '财务SaaS')

const handleLogout = () => {
  store.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #374151;
}

.sidebar-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sidebar-toggle-btn .icon {
  width: 14px;
  height: 14px;
}
</style>
