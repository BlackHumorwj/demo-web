<template>
  <router-view v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
  <ReviewSidebar ref="sidebarRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useReviewStore } from '@/stores/reviewStore'
import { initReviewableElements, cleanupReviewableElements } from '@/utils/review'
import ReviewSidebar from '@/components/ReviewSidebar.vue'

const sidebarRef = ref<InstanceType<typeof ReviewSidebar> | null>(null)

const router = useRouter()
const reviewStore = useReviewStore()

watch(() => router.currentRoute.value.path, async () => {
  cleanupReviewableElements()
  await nextTick()
  if (reviewStore.isReviewMode) {
    initReviewableElements()
  }
})

watch(() => reviewStore.isReviewMode, (isOn) => {
  if (isOn) {
    nextTick(() => {
      initReviewableElements()
    })
  } else {
    cleanupReviewableElements()
  }
})

onMounted(() => {
  reviewStore.loadFromLocalStorage()
  reviewStore.loadLogicCommentsFromStorage()
  nextTick(() => {
    if (reviewStore.isReviewMode) {
      initReviewableElements()
    }
  })
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
