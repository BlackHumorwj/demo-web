import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ReviewComment, LogicComment } from '@/types/review'
import { logicReviewConfig } from '@/config/logicReview'

export const useReviewStore = defineStore('review', () => {
  const isReviewMode = ref(false)
  const isSidebarOpen = ref(false)
  const comments = ref<ReviewComment[]>([])
  const logicComments = ref<LogicComment[]>([])
  const activeElement = ref<string | null>(null)

  const currentPageComments = computed(() => {
    const currentPath = window.location.pathname
    return comments.value.filter(c => c.pagePath === currentPath)
  })

  const pendingCount = computed(() => {
    return comments.value.filter(c => c.status === 'pending').length
  })

  const currentPageLogicPoints = computed(() => {
    const currentPath = window.location.pathname
    return logicReviewConfig.filter(config => {
      const pattern = new RegExp('^' + config.pagePath.replace(/\*/g, '.*') + '$')
      return pattern.test(currentPath)
    })
  })

  const currentPageLogicComments = computed(() => {
    const currentPath = window.location.pathname
    return logicComments.value.filter(c => {
      const pattern = new RegExp('^' + c.pagePath.replace(/\*/g, '.*') + '$')
      return pattern.test(currentPath)
    })
  })

  function toggleReviewMode() {
    isReviewMode.value = !isReviewMode.value
    if (!isReviewMode.value) {
      isSidebarOpen.value = false
    }
  }

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function setSidebarOpen(open: boolean) {
    isSidebarOpen.value = open
  }

  function setActiveElement(selector: string | null) {
    activeElement.value = selector
  }

  function addComment(data: {
    elementSelector: string
    elementLabel: string
    content: string
    priority: 'high' | 'medium' | 'low'
  }) {
    const newComment: ReviewComment = {
      id: Date.now().toString(),
      pagePath: window.location.pathname,
      elementSelector: data.elementSelector,
      elementLabel: data.elementLabel,
      content: data.content,
      priority: data.priority,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    comments.value.push(newComment)
    saveToLocalStorage()
  }

  function updateComment(id: string, content: string) {
    const index = comments.value.findIndex(c => c.id === id)
    if (index !== -1) {
      comments.value[index].content = content
      comments.value[index].updatedAt = new Date()
      saveToLocalStorage()
    }
  }

  function updateCommentStatus(id: string, status: ReviewComment['status']) {
    const index = comments.value.findIndex(c => c.id === id)
    if (index !== -1) {
      comments.value[index].status = status
      comments.value[index].updatedAt = new Date()
      saveToLocalStorage()
    }
  }

  function deleteComment(id: string) {
    comments.value = comments.value.filter(c => c.id !== id)
    saveToLocalStorage()
  }

  function saveToLocalStorage() {
    localStorage.setItem('review-comments', JSON.stringify(comments.value))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem('review-comments')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        comments.value = parsed.map((c: ReviewComment) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }))
      } catch (e) {
        console.error('Failed to load comments from localStorage')
      }
    }
  }

  function exportToMarkdown(): string {
    const groupedByPage = comments.value.reduce((acc, comment) => {
      if (!acc[comment.pagePath]) {
        acc[comment.pagePath] = []
      }
      acc[comment.pagePath].push(comment)
      return acc
    }, {} as Record<string, ReviewComment[]>)

    let markdown = `# 审查批注汇总\n\n`
    markdown += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`
    markdown += `## 批注统计\n\n`
    markdown += `- 总批注数: ${comments.value.length}\n`
    markdown += `- 待处理: ${comments.value.filter(c => c.status === 'pending').length}\n`
    markdown += `- 已解决: ${comments.value.filter(c => c.status === 'resolved').length}\n`
    markdown += `- 已拒绝: ${comments.value.filter(c => c.status === 'rejected').length}\n\n`

    Object.entries(groupedByPage).forEach(([pagePath, pageComments]) => {
      markdown += `---\n\n`
      markdown += `## 页面: ${pagePath}\n\n`
      markdown += `| 元素 | 优先级 | 状态 | 修改建议 | 创建时间 |\n`
      markdown += `|------|--------|------|----------|----------|\n`
      
      pageComments.forEach(comment => {
        const priorityLabel = { high: '高', medium: '中', low: '低' }[comment.priority]
        const statusLabel = { pending: '待处理', resolved: '已解决', rejected: '已拒绝' }[comment.status]
        markdown += `| ${comment.elementLabel || comment.elementSelector} | ${priorityLabel} | ${statusLabel} | ${comment.content} | ${comment.createdAt.toLocaleString('zh-CN')} |\n`
      })
      markdown += `\n`
    })

    return markdown
  }

  function exportAsFile() {
    const markdown = exportToMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `review-comments-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function addLogicComment(data: {
    logicKey: string
    logicLabel: string
    content: string
    priority: 'high' | 'medium' | 'low'
  }) {
    const logicPoint = logicReviewConfig.find(p => p.key === data.logicKey)
    const newComment: LogicComment = {
      id: Date.now().toString(),
      pagePath: window.location.pathname,
      logicKey: data.logicKey,
      logicType: logicPoint?.type || 'rule',
      logicLabel: data.logicLabel,
      logicDescription: logicPoint?.description || '',
      content: data.content,
      priority: data.priority,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    logicComments.value.push(newComment)
    saveLogicCommentsToStorage()
  }

  function updateLogicComment(id: string, content: string) {
    const index = logicComments.value.findIndex(c => c.id === id)
    if (index !== -1) {
      logicComments.value[index].content = content
      logicComments.value[index].updatedAt = new Date()
      saveLogicCommentsToStorage()
    }
  }

  function updateLogicCommentStatus(id: string, status: LogicComment['status']) {
    const index = logicComments.value.findIndex(c => c.id === id)
    if (index !== -1) {
      logicComments.value[index].status = status
      logicComments.value[index].updatedAt = new Date()
      saveLogicCommentsToStorage()
    }
  }

  function deleteLogicComment(id: string) {
    logicComments.value = logicComments.value.filter(c => c.id !== id)
    saveLogicCommentsToStorage()
  }

  function saveLogicCommentsToStorage() {
    localStorage.setItem('review-logic-comments', JSON.stringify(logicComments.value))
  }

  function loadLogicCommentsFromStorage() {
    const saved = localStorage.getItem('review-logic-comments')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        logicComments.value = parsed.map((c: LogicComment) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt)
        }))
      } catch (e) {
        console.error('Failed to load logic comments from localStorage')
      }
    }
  }

  return {
    isReviewMode,
    isSidebarOpen,
    comments,
    logicComments,
    activeElement,
    currentPageComments,
    currentPageLogicPoints,
    currentPageLogicComments,
    pendingCount,
    toggleReviewMode,
    toggleSidebar,
    setSidebarOpen,
    setActiveElement,
    addComment,
    updateComment,
    updateCommentStatus,
    deleteComment,
    addLogicComment,
    updateLogicComment,
    updateLogicCommentStatus,
    deleteLogicComment,
    loadFromLocalStorage,
    loadLogicCommentsFromStorage,
    exportToMarkdown,
    exportAsFile
  }
})