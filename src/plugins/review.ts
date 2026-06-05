import type { App } from 'vue'
import ReviewPanel from '@/components/ReviewPanel.vue'
import ReviewModeToggle from '@/components/ReviewModeToggle.vue'

export function installReviewPlugin(app: App) {
  app.component('ReviewPanel', ReviewPanel)
  app.component('ReviewModeToggle', ReviewModeToggle)
}