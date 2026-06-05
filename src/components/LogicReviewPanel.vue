<template>
  <Transition name="slide">
    <div v-if="isReviewMode" class="logic-panel">
      <div class="panel-header">
        <h3 class="panel-title">
          <EditPen class="title-icon" />
          <span>逻辑批注</span>
        </h3>
      </div>
      
      <div class="panel-body">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  
  <el-dialog title="添加逻辑批注" v-model="showAddDialog" width="450px">
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
          v-model="newCommentContent"
          placeholder="请输入对该逻辑的修改建议..."
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
      <el-button type="primary" @click="submitLogicComment">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { EditPen, Edit } from '@element-plus/icons-vue'
import { useReviewStore } from '@/stores/reviewStore'
import type { LogicPoint } from '@/config/logicReview'
import type { LogicType } from '@/types/review'

const reviewStore = useReviewStore()
const isReviewMode = computed(() => reviewStore.isReviewMode)
const currentPageLogicPoints = computed(() => reviewStore.currentPageLogicPoints)
const currentPageLogicComments = computed(() => reviewStore.currentPageLogicComments)

const showAddDialog = ref(false)
const selectedLogicPoint = ref<LogicPoint | null>(null)
const newCommentContent = ref('')
const newCommentPriority = ref<'high' | 'medium' | 'low'>('medium')

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

function getCommentsForLogic(logicKey: string) {
  return currentPageLogicComments.value.filter(c => c.logicKey === logicKey)
}

function addLogicComment(point: LogicPoint) {
  selectedLogicPoint.value = point
  newCommentContent.value = ''
  newCommentPriority.value = 'medium'
  showAddDialog.value = true
}

function submitLogicComment() {
  if (!newCommentContent.value.trim() || !selectedLogicPoint.value) return
  
  reviewStore.addLogicComment({
    logicKey: selectedLogicPoint.value.key,
    logicLabel: selectedLogicPoint.value.label,
    content: newCommentContent.value,
    priority: newCommentPriority.value
  })
  
  showAddDialog.value = false
  selectedLogicPoint.value = null
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.logic-panel {
  position: fixed;
  left: 200px;
  top: 60px;
  bottom: 0;
  width: 300px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
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
  color: #52c41a;
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

.comment-content {
  font-size: 12px;
  color: #666;
  margin: 0 0 6px;
}

.comment-meta {
  display: flex;
  gap: 6px;
}

.icon {
  width: 14px;
  height: 14px;
}
</style>