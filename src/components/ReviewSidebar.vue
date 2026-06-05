<template>
  <Transition name="slide">
    <div v-if="isSidebarOpen" class="review-sidebar">
      <div class="sidebar-header">
        <div class="sidebar-title">
          <EditPen class="title-icon" />
          <span>审查批注</span>
        </div>
        <div class="header-actions">
          <el-button
            size="small"
            type="primary"
            @click="exportComments"
            v-if="activeTab === 'element'"
          >
            <Download class="icon" />
            导出文档
          </el-button>
          <el-button size="small" @click="toggleSidebar">
            <Close class="icon" />
          </el-button>
        </div>
      </div>

      <div class="sidebar-tabs">
        <el-tabs v-model="activeTab" type="card" class="sidebar-tab">
          <el-tab-pane label="页面批注" name="element">
            <div class="tab-content">
              <div v-if="currentComments.length === 0" class="empty-state">
                <el-icon class="empty-icon"><EditPen /></el-icon>
                <p>暂无批注</p>
                <p class="empty-hint">点击页面元素添加修改建议</p>
              </div>

              <div v-else class="comments-list">
                <div
                  v-for="comment in currentComments"
                  :key="comment.id"
                  class="comment-item"
                  :class="{ active: comment.elementSelector === activeElement }"
                >
                  <div class="comment-header">
                    <span class="element-label">{{ comment.elementLabel || comment.elementSelector }}</span>
                    <div class="comment-meta">
                      <el-tag :type="priorityType(comment.priority)" size="small">
                        {{ priorityLabel(comment.priority) }}
                      </el-tag>
                      <el-tag :type="statusType(comment.status)" size="small">
                        {{ statusLabel(comment.status) }}
                      </el-tag>
                    </div>
                  </div>
                  <p class="comment-content">{{ comment.content }}</p>
                  <div class="comment-footer">
                    <span class="create-time">{{ comment.createdAt.toLocaleString('zh-CN') }}</span>
                    <div class="comment-actions">
                      <el-button size="mini" @click="editComment(comment)">
                        <Edit class="icon" />
                      </el-button>
                      <el-button size="mini" @click="updateCommentStatus(comment.id, 'resolved')" v-if="comment.status !== 'resolved'">
                        <Check class="icon" />
                      </el-button>
                      <el-button size="mini" @click="updateCommentStatus(comment.id, 'rejected')" v-if="comment.status !== 'rejected'">
                        <Close class="icon" />
                      </el-button>
                      <el-button size="mini" type="danger" @click="deleteComment(comment.id)">
                        <Delete class="icon" />
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="逻辑批注" name="logic">
            <div class="tab-content">
              <div v-if="currentPageLogicPoints.length === 0" class="empty-state">
                <el-icon class="empty-icon"><EditPen /></el-icon>
                <p>暂无可批注的逻辑点</p>
              </div>

              <div v-else class="logic-list">
                <div
                  v-for="point in currentPageLogicPoints"
                  :key="point.key"
                  class="logic-item"
                >
                  <div class="logic-header">
                    <span class="logic-label">{{ point.label }}</span>
                    <el-tag :type="typeTagType(point.type)" size="small">
                      {{ typeLabel(point.type) }}
                    </el-tag>
                  </div>
                  <p class="logic-description">{{ point.description }}</p>
                  <div class="logic-meta">
                    <span class="code-location">{{ point.codeLocation }}</span>
                  </div>
                  <div class="logic-actions">
                    <el-button size="mini" @click="addLogicComment(point)">
                      <Edit class="icon" />
                      添加批注
                    </el-button>
                  </div>

                  <div v-if="getCommentsForLogic(point.key).length > 0" class="logic-comments">
                    <div
                      v-for="comment in getCommentsForLogic(point.key)"
                      :key="comment.id"
                      class="comment-bubble"
                    >
                      <p class="comment-content">{{ comment.content }}</p>
                      <div class="comment-meta">
                        <el-tag :type="priorityType(comment.priority)" size="small">
                          {{ priorityLabel(comment.priority) }}
                        </el-tag>
                        <el-tag :type="statusType(comment.status)" size="small">
                          {{ statusLabel(comment.status) }}
                        </el-tag>
                      </div>
                      <div class="comment-actions">
                        <el-button size="mini" @click="editLogicComment(comment)">
                          <Edit class="icon" />
                        </el-button>
                        <el-button size="mini" @click="updateLogicCommentStatus(comment.id, 'resolved')" v-if="comment.status !== 'resolved'">
                          <Check class="icon" />
                        </el-button>
                        <el-button size="mini" @click="updateLogicCommentStatus(comment.id, 'rejected')" v-if="comment.status !== 'rejected'">
                          <Close class="icon" />
                        </el-button>
                        <el-button size="mini" type="danger" @click="deleteLogicComment(comment.id)">
                          <Delete class="icon" />
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="sidebar-footer">
        <span class="total-count">
          {{ activeTab === 'element' ? `页面批注: ${currentComments.length} 条` : `逻辑批注: ${currentPageLogicComments.length} 条` }}
        </span>
      </div>
    </div>
  </Transition>

  <Transition name="fade">
    <div v-if="isSidebarOpen" class="sidebar-mask" @click="toggleSidebar" />
  </Transition>

  <el-dialog title="添加批注" v-model="showAddDialog" width="400px">
    <el-form label-width="80px">
      <el-form-item label="元素标识">
        <el-input v-model="newCommentElementLabel" placeholder="输入元素描述（可选）" />
      </el-form-item>
      <el-form-item label="修改建议">
        <el-input
          type="textarea"
          v-model="newCommentContent"
          placeholder="请输入修改建议..."
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="优先级">
        <el-radio-group v-model="newCommentPriority">
          <el-radio label="high">高</el-radio>
          <el-radio label="medium">中</el-radio>
          <el-radio label="low">低</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddDialog = false">取消</el-button>
      <el-button type="primary" @click="submitComment">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog title="编辑批注" v-model="showEditDialog" width="400px">
    <el-input
      type="textarea"
      v-model="editContent"
      placeholder="请输入修改建议..."
      :rows="4"
    />
    <template #footer>
      <el-button @click="showEditDialog = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog title="添加逻辑批注" v-model="showLogicAddDialog" width="450px">
    <el-form label-width="100px">
      <el-form-item label="逻辑点">
        <el-input :value="selectedLogicPoint?.label" disabled />
      </el-form-item>
      <el-form-item label="逻辑描述">
        <el-input :value="selectedLogicPoint?.description" disabled type="textarea" :rows="2" />
      </el-form-item>
      <el-form-item label="修改建议">
        <el-input
          type="textarea"
          v-model="newLogicCommentContent"
          placeholder="请输入对该逻辑的修改建议..."
          :rows="4"
        />
      </el-form-item>
      <el-form-item label="优先级">
        <el-radio-group v-model="newLogicCommentPriority">
          <el-radio label="high">高</el-radio>
          <el-radio label="medium">中</el-radio>
          <el-radio label="low">低</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showLogicAddDialog = false">取消</el-button>
      <el-button type="primary" @click="submitLogicComment">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  EditPen, Download, Edit, Check, Close, Delete
} from '@element-plus/icons-vue'
import { useReviewStore } from '@/stores/reviewStore'
import type { ReviewComment } from '@/types/review'
import type { LogicPoint } from '@/config/logicReview'
import type { LogicType } from '@/types/review'

const reviewStore = useReviewStore()
const isReviewMode = computed(() => reviewStore.isReviewMode)
const isSidebarOpen = computed(() => reviewStore.isSidebarOpen)

const activeTab = ref<'element' | 'logic'>('element')

const currentComments = computed(() => reviewStore.currentPageComments)
const activeElement = computed(() => reviewStore.activeElement)

const currentPageLogicPoints = computed(() => reviewStore.currentPageLogicPoints)
const currentPageLogicComments = computed(() => reviewStore.currentPageLogicComments)

const showAddDialog = ref(false)
const showEditDialog = ref(false)
const showLogicAddDialog = ref(false)
const editingCommentId = ref<string | null>(null)
const editContent = ref('')

const newCommentElementLabel = ref('')
const newCommentContent = ref('')
const newCommentPriority = ref<'high' | 'medium' | 'low'>('medium')
const selectedElementSelector = ref<string>('')

const selectedLogicPoint = ref<LogicPoint | null>(null)
const newLogicCommentContent = ref('')
const newLogicCommentPriority = ref<'high' | 'medium' | 'low'>('medium')

watch(() => reviewStore.activeElement, (selector) => {
  if (selector) {
    reviewStore.setSidebarOpen(true)
    activeTab.value = 'element'
    showAddDialog.value = true
    newCommentElementLabel.value = ''
    newCommentContent.value = ''
    newCommentPriority.value = 'medium'
    selectedElementSelector.value = selector
  }
})

watch(isReviewMode, (isOn) => {
  if (!isOn) {
    reviewStore.setSidebarOpen(false)
  }
})

function toggleSidebar() {
  reviewStore.toggleSidebar()
}

function openSidebar() {
  reviewStore.setSidebarOpen(true)
}

function priorityLabel(priority: string) {
  const labels: Record<string, string> = { high: '高', medium: '中', low: '低' }
  return labels[priority] || priority
}

function priorityType(priority: string) {
  const types: Record<string, string> = { high: 'danger', medium: 'warning', low: 'info' }
  return types[priority] || 'default'
}

function statusLabel(status: string) {
  const labels: Record<string, string> = { pending: '待处理', resolved: '已解决', rejected: '已拒绝' }
  return labels[status] || status
}

function statusType(status: string) {
  const types: Record<string, string> = { pending: 'warning', resolved: 'success', rejected: 'default' }
  return types[status] || 'default'
}

function typeLabel(type: LogicType) {
  const labels: Record<LogicType, string> = {
    rule: '业务规则',
    calculation: '计算逻辑',
    validation: '校验规则',
    transformation: '数据转换',
    formatting: '格式化'
  }
  return labels[type]
}

function typeTagType(type: LogicType) {
  const types: Record<LogicType, string> = {
    rule: 'primary',
    calculation: 'success',
    validation: 'warning',
    transformation: 'info',
    formatting: 'default'
  }
  return types[type]
}

function submitComment() {
  if (!newCommentContent.value.trim()) return

  reviewStore.addComment({
    elementSelector: selectedElementSelector.value,
    elementLabel: newCommentElementLabel.value || selectedElementSelector.value,
    content: newCommentContent.value,
    priority: newCommentPriority.value
  })

  reviewStore.setActiveElement(null)
  selectedElementSelector.value = ''
  showAddDialog.value = false
}

const editingCommentType = ref<'element' | 'logic'>('element')

function editComment(comment: ReviewComment) {
  editingCommentId.value = comment.id
  editContent.value = comment.content
  editingCommentType.value = 'element'
  showEditDialog.value = true
}

function editLogicComment(comment: { id: string; content: string }) {
  editingCommentId.value = comment.id
  editContent.value = comment.content
  editingCommentType.value = 'logic'
  showEditDialog.value = true
}

function saveEdit() {
  if (editingCommentId.value && editContent.value.trim()) {
    if (editingCommentType.value === 'element') {
      reviewStore.updateComment(editingCommentId.value, editContent.value)
    } else {
      reviewStore.updateLogicComment(editingCommentId.value, editContent.value)
    }
  }
  showEditDialog.value = false
  editingCommentId.value = null
}

function updateCommentStatus(id: string, status: ReviewComment['status']) {
  reviewStore.updateCommentStatus(id, status)
}

function deleteComment(id: string) {
  reviewStore.deleteComment(id)
}

function exportComments() {
  reviewStore.exportAsFile()
}

function getCommentsForLogic(logicKey: string) {
  return currentPageLogicComments.value.filter(c => c.logicKey === logicKey)
}

function addLogicComment(point: LogicPoint) {
  selectedLogicPoint.value = point
  newLogicCommentContent.value = ''
  newLogicCommentPriority.value = 'medium'
  showLogicAddDialog.value = true
}

function submitLogicComment() {
  if (!newLogicCommentContent.value.trim() || !selectedLogicPoint.value) return

  reviewStore.addLogicComment({
    logicKey: selectedLogicPoint.value.key,
    logicLabel: selectedLogicPoint.value.label,
    content: newLogicCommentContent.value,
    priority: newLogicCommentPriority.value
  })

  showLogicAddDialog.value = false
  selectedLogicPoint.value = null
}

function updateLogicCommentStatus(id: string, status: 'pending' | 'resolved' | 'rejected') {
  reviewStore.updateLogicCommentStatus(id, status)
}

function deleteLogicComment(id: string) {
  reviewStore.deleteLogicComment(id)
}

defineExpose({
  openSidebar,
  toggleSidebar
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.review-sidebar {
  position: fixed;
  right: 0;
  top: 60px;
  bottom: 0;
  width: 420px;
  background: #fff;
  border-left: 1px solid #e8e8e8;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.sidebar-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.title-icon {
  color: #1890ff;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon {
  width: 14px;
  height: 14px;
}

.sidebar-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
}

.empty-hint {
  font-size: 12px;
  margin-top: 8px;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-item {
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border-left: 4px solid #d9d9d9;
  transition: all 0.2s;
}

.comment-item.active {
  border-left-color: #1890ff;
  background: #e6f7ff;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.element-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.comment-meta {
  display: flex;
  gap: 6px;
}

.comment-content {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 8px;
}

.comment-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-time {
  font-size: 12px;
  color: #999;
}

.comment-actions {
  display: flex;
  gap: 4px;
}

.sidebar-footer {
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
  text-align: center;
}

.total-count {
  font-size: 12px;
  color: #999;
}

.logic-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.logic-item {
  padding: 12px;
  background: #f6ffed;
  border-radius: 8px;
  border-left: 4px solid #b7eb8f;
}

.logic-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.logic-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.logic-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 8px;
  line-height: 1.5;
}

.code-location {
  font-size: 12px;
  color: #999;
  font-family: monospace;
}

.logic-actions {
  margin-top: 12px;
}

.logic-comments {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #d9d9d9;
}

.comment-bubble {
  padding: 8px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 8px;
}

.comment-bubble:last-child {
  margin-bottom: 0;
}
</style>