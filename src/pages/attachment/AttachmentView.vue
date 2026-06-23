<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>查看附件</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <template v-if="detail">
        <div class="view-container">
          <div class="view-row">
            <span class="view-label">附件编号</span>
            <span class="view-value">{{ detail.attachmentId }}</span>
          </div>
          <div class="view-row">
            <span class="view-label">附件名称</span>
            <span class="view-value">{{ detail.attachmentName }}</span>
          </div>
          <div class="view-row">
            <span class="view-label">文件名</span>
            <span class="view-value">{{ detail.fileName }}</span>
          </div>
          <div class="view-row">
            <span class="view-label">文件类型</span>
            <span class="view-value">{{ getFileExt(detail.fileName) }}</span>
          </div>
          <div class="view-row">
            <span class="view-label">文件大小</span>
            <span class="view-value">{{ formatFileSize(detail.fileSize) }}</span>
          </div>
          <div class="view-row">
            <span class="view-label">业务类型</span>
            <el-tag :type="getBizTagType(detail.bizType)">{{ getBizTypeName(detail.bizType) }}</el-tag>
          </div>
          <div class="view-row">
            <span class="view-label">业务单据ID</span>
            <span class="view-value">{{ detail.bizDocId }}</span>
          </div>
          <div class="view-row">
            <span class="view-label">上传人</span>
            <span class="view-value">{{ detail.uploaderName }}</span>
          </div>
          <div class="view-row">
            <span class="view-label">上传时间</span>
            <span class="view-value">{{ detail.uploadTime }}</span>
          </div>
          <div class="view-row">
            <span class="view-label">备注</span>
            <span class="view-value">{{ detail.remark || '-' }}</span>
          </div>

          <div class="view-row preview-section">
            <span class="view-label">文件预览</span>
            <div class="preview-content">
              <template v-if="isImage">
                <img :src="detail.fileUrl" :alt="detail.fileName" class="preview-image" />
              </template>
              <template v-else-if="isPdf">
                <iframe :src="detail.fileUrl" class="preview-frame" frameborder="0"></iframe>
              </template>
              <template v-else>
                <div class="no-preview">
                  <el-icon size="48" color="#c0c4cc"><document /></el-icon>
                  <p>该文件类型暂不支持在线预览</p>
                  <el-button type="primary" size="small" @click="handleDownload">下载后查看</el-button>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="view-actions">
          <el-button type="primary" @click="handleDownload">下载</el-button>
          <el-button @click="handleEdit">编辑</el-button>
          <el-button @click="handleBack">返回</el-button>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { mockAttachments } from '@/data/mockData'
import { bizTypeMap, formatFileSize, isImageFile, type AttachmentDoc, type BizType } from '@/types/attachment'

const router = useRouter()
const route = useRoute()

const detail = ref<AttachmentDoc | null>(null)

const getBizTypeName = (t: BizType) => bizTypeMap[t] || '-'

const getBizTagType = (t: BizType): string => {
  const map: Record<BizType, string> = { 1: 'success', 2: 'danger', 3: 'warning', 4: 'info', 5: '', 6: 'primary' }
  return map[t] || 'info'
}

const getFileExt = (fileName: string): string => {
  const idx = fileName.lastIndexOf('.')
  return idx >= 0 ? fileName.substring(idx + 1).toUpperCase() : '-'
}

const isImage = computed(() => (detail.value ? isImageFile(detail.value.fileType) : false))

const isPdf = computed(() => {
  if (!detail.value) return false
  return detail.value.fileType === 'application/pdf' || detail.value.fileName.toLowerCase().endsWith('.pdf')
})

const handleBack = () => {
  router.push('/attachment')
}

const handleEdit = () => {
  if (detail.value) {
    router.push(`/attachment/edit/${detail.value.attachmentId}`)
  }
}

const handleDownload = () => {
  if (!detail.value) return
  const link = document.createElement('a')
  link.href = detail.value.fileUrl
  link.download = detail.value.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success(`开始下载 ${detail.value.fileName}`)
}

onMounted(() => {
  const id = route.params.id as string
  detail.value = mockAttachments.find(item => item.attachmentId === id) || null
  if (!detail.value) {
    router.push('/attachment')
  }
})
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-card {
  min-height: 400px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.view-container {
  max-width: 860px;
  margin: 40px auto;
}

.view-row {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.view-row.preview-section {
  flex-direction: column;
}

.view-row.preview-section .view-label {
  margin-bottom: 12px;
}

.view-label {
  width: 120px;
  color: #999;
  font-weight: 500;
}

.view-value {
  flex: 1;
  color: #333;
  word-break: break-all;
}

.preview-content {
  flex: 1;
  background: #fafafa;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 16px;
  min-height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  max-width: 100%;
  max-height: 480px;
  border-radius: 4px;
}

.preview-frame {
  width: 100%;
  height: 520px;
  border: none;
}

.no-preview {
  text-align: center;
  color: #999;
}

.no-preview p {
  margin: 12px 0;
}

.view-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
</style>
