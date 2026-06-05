<template>
  <div class="review-toggle-wrapper">
    <el-tooltip :content="isReviewMode ? '退出审查模式' : '进入审查模式'" placement="bottom">
      <el-button
        :type="isReviewMode ? 'danger' : 'default'"
        size="small"
        @click="toggleMode"
        class="review-toggle-btn"
      >
        <span>{{ isReviewMode ? '审查中' : '审查模式' }}</span>
      </el-button>
    </el-tooltip>
    
    <el-badge
      v-if="pendingCount > 0"
      :value="pendingCount"
      class="review-badge"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useReviewStore } from '@/stores/reviewStore'

const reviewStore = useReviewStore()
const isReviewMode = computed(() => reviewStore.isReviewMode)
const pendingCount = computed(() => reviewStore.pendingCount)

function toggleMode() {
  reviewStore.toggleReviewMode()
}
</script>

<style scoped>
.review-toggle-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.review-toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

.icon {
  width: 16px;
  height: 16px;
}

.review-badge {
  position: absolute;
  top: -8px;
  right: -8px;
}
</style>