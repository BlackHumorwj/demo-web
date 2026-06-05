import { onMounted, onUnmounted, ref } from 'vue'
import { useReviewStore } from '@/stores/reviewStore'

export function useReview() {
  const reviewStore = useReviewStore()
  const elementRef = ref<HTMLElement | null>(null)
  const isHighlighted = ref(false)

  function handleClick(e: MouseEvent) {
    if (!reviewStore.isReviewMode) return
    
    e.stopPropagation()
    
    const target = e.target as HTMLElement
    let selector = ''
    
    if (target.id) {
      selector = `#${target.id}`
    } else if (target.classList.length > 0) {
      selector = `.${Array.from(target.classList).join('.')}`
    } else {
      selector = target.tagName.toLowerCase()
    }
    
    reviewStore.setActiveElement(selector)
  }

  function makeReviewable(el: HTMLElement | null, label?: string) {
    if (!el || !reviewStore.isReviewMode) return
    
    elementRef.value = el
    
    if (label) {
      el.setAttribute('data-review-label', label)
    }
    
    el.style.cursor = 'pointer'
    el.style.outline = '2px dashed #1890ff'
    el.style.outlineOffset = '2px'
    isHighlighted.value = true
    
    el.addEventListener('click', handleClick)
  }

  function removeReviewable(el: HTMLElement | null) {
    if (!el) return
    
    el.style.cursor = ''
    el.style.outline = ''
    el.style.outlineOffset = ''
    isHighlighted.value = false
    
    el.removeEventListener('click', handleClick)
  }

  onMounted(() => {
    reviewStore.loadFromLocalStorage()
  })

  onUnmounted(() => {
    if (elementRef.value) {
      removeReviewable(elementRef.value)
    }
  })

  return {
    isReviewMode: reviewStore.isReviewMode,
    makeReviewable,
    removeReviewable,
    isHighlighted
  }
}