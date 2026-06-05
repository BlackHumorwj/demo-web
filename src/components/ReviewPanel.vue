<template>
  <Transition name="slide">
    <div v-if="isReviewMode" class="review-panel">
      <div class="panel-header">
        <h3 class="panel-title">
          <EditPen class="title-icon" />
          <span>页面审查批注</span>
        </h3>
        <div class="header-actions">
          <el-button size="small" type="primary" @click="exportComments">
            <Download class="icon" />
            导出文档
          </el-button>
        </div>
      </div>

      <div class="panel-body">
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
                <el-button size="mini" @click="updateStatus(comment.id, 'resolved')" v-if="comment.status !== 'resolved'">
                  <Check class="icon" />
                </el-button>
                <el-button size="mini" @click="updateStatus(comment.id, 'rejected')" v-if="comment.status !== 'rejected'">
                  <Close class="icon" />
                </el-button>
                <el-button size="mini" type="danger" @click="deleteComment(comment.id)">
                  <Close class="icon" />
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-footer">
        <span class="total-count">共 {{ currentComments.length }} 条批注</span>
      </div>
    </div>
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
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  EditPen, Download, Edit, Check, Close
} from '@element-plus/icons-vue'
import { useReviewStore } from '@/stores/reviewStore'
import type { ReviewComment } from '@/types/review'

const reviewStore = useReviewStore()
const isReviewMode = computed(() => reviewStore.isReviewMode)
const currentComments = computed(() => reviewStore.currentPageComments)

const activeElement = computed(() => reviewStore.activeElement)

const showAddDialog = ref(false)
const showEditDialog = ref(false)
const editingCommentId = ref<string | null>(null)
const editContent = ref('')

const newCommentElementLabel = ref('')
const newCommentContent = ref('')
const newCommentPriority = ref<'high' | 'medium' | 'low'>('medium')
const selectedElementSelector = ref<string>('')

watch(() => reviewStore.activeElement, (selector) => {
  if (selector) {
    showAddDialog.value = true
    newCommentElementLabel.value = ''
    newCommentContent.value = ''
    newCommentPriority.value = 'medium'
    selectedElementSelector.value = selector
  }
})

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

function editComment(comment: ReviewComment) {
  editingCommentId.value = comment.id
  editContent.value = comment.content
  showEditDialog.value = true
}

function saveEdit() {
  if (editingCommentId.value && editContent.value.trim()) {
    reviewStore.updateComment(editingCommentId.value, editContent.value)
  }
  showEditDialog.value = false
  editingCommentId.value = null
}

function updateStatus(id: string, status: ReviewComment['status']) {
  reviewStore.updateCommentStatus(id, status)
}

function deleteComment(id: string) {
  reviewStore.deleteComment(id)
}

function exportComments() {
  reviewStore.exportAsFile()
}
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

.review-panel {
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

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
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

.panel-body {
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

.panel-footer {
  padding: 12px 16px;
  border-top: 1px solid #e8e8e8;
  text-align: center;
}

.total-count {
  font-size: 12px;
  color: #999;
}
</style>