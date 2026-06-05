import { reviewConfig } from '@/config/review'
import { useReviewStore } from '@/stores/reviewStore'

export function initReviewableElements() {
  const reviewStore = useReviewStore()
  
  if (!reviewStore.isReviewMode) return
  
  const currentPath = window.location.pathname
  
  const pageConfig = reviewConfig.find(config => {
    const pattern = new RegExp('^' + config.path.replace(/\*/g, '.*') + '$')
    return pattern.test(currentPath)
  })
  
  if (!pageConfig) return
  
  pageConfig.elements.forEach(({ selector, label }) => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(el => {
      const htmlEl = el as HTMLElement
      htmlEl.setAttribute('review-label', label)
      htmlEl.setAttribute('review-selector', selector)
      
      htmlEl.style.outline = '2px dashed #1890ff'
      htmlEl.style.outlineOffset = '2px'
      htmlEl.style.cursor = 'pointer'
      
      htmlEl.addEventListener('click', handleElementClick)
    })
  })
}

export function cleanupReviewableElements() {
  const elements = document.querySelectorAll('[review-label]')
  elements.forEach(el => {
    const htmlEl = el as HTMLElement
    htmlEl.style.outline = ''
    htmlEl.style.outlineOffset = ''
    htmlEl.style.cursor = ''
    htmlEl.removeAttribute('review-label')
    htmlEl.removeAttribute('review-selector')
    htmlEl.removeEventListener('click', handleElementClick)
  })
}

function handleElementClick(e: MouseEvent) {
  e.stopPropagation()
  const el = e.target as HTMLElement
  const label = el.getAttribute('review-label') || '未命名元素'
  const selector = el.getAttribute('review-selector') || ''
  
  const reviewStore = useReviewStore()
  reviewStore.setActiveElement(selector || label)
}