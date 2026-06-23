<template>
  <div class="page-container">
    <div class="page-header">
      <div class="search-bar">
        <el-input v-model="searchName" placeholder="附件名称" class="search-input" clearable />
        <el-select v-model="bizTypeFilter" placeholder="业务类型" class="filter-select" clearable>
          <el-option :value="1" label="收入" />
          <el-option :value="2" label="支出" />
          <el-option :value="3" label="往来" />
          <el-option :value="4" label="库存" />
          <el-option :value="5" label="固定资产" />
          <el-option :value="6" label="工资" />
        </el-select>
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          class="date-range"
        />
        <el-input v-model="uploaderNameFilter" placeholder="上传人" class="search-input" clearable />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-button type="primary" @click="handleAdd">新增附件</el-button>
    </div>

    <el-card class="page-card">
      <template #header>
        <span>附件管理</span>
      </template>

      <el-table :data="pagedList" border :loading="loading">
        <el-table-column prop="attachmentName" label="附件名称" min-width="160" show-overflow-tooltip />
        <el-table-column prop="fileName" label="文件名" min-width="180" show-overflow-tooltip />
        <el-table-column label="文件类型" width="120">
          <template #default="scope">
            <span>{{ getFileExt(scope.row.fileName) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="大小" width="110">
          <template #default="scope">
            <span>{{ formatFileSize(scope.row.fileSize) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务类型" width="110">
          <template #default="scope">
            <el-tag :type="getBizTagType(scope.row.bizType)">{{ getBizTypeName(scope.row.bizType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="bizDocId" label="业务单据ID" width="130" />
        <el-table-column prop="uploaderName" label="上传人" width="120" />
        <el-table-column prop="uploadTime" label="上传时间" width="170" />
        <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="handleView(scope.row.attachmentId)">查看</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.row.attachmentId)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDownload(scope.row)">下载</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="handleDelete(scope.row.attachmentId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <span class="total-count">共 {{ filteredList.length }} 条记录</span>
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="filteredList.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          class="pagination"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { mockAttachments } from '@/data/mockData'
import { bizTypeMap, formatFileSize, type BizType, type AttachmentDoc } from '@/types/attachment'

const router = useRouter()

const loading = ref(false)
const searchName = ref('')
const bizTypeFilter = ref<BizType | ''>('')
const dateRange = ref<[string, string] | null>(null)
const uploaderNameFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const getBizTypeName = (t: BizType) => bizTypeMap[t] || '-'

const getBizTagType = (t: BizType): string => {
  const map: Record<BizType, string> = { 1: 'success', 2: 'danger', 3: 'warning', 4: 'info', 5: '', 6: 'primary' }
  return map[t] || 'info'
}

const getFileExt = (fileName: string): string => {
  const idx = fileName.lastIndexOf('.')
  return idx >= 0 ? fileName.substring(idx + 1).toUpperCase() : '-'
}

const filteredList = computed(() => {
  let list = [...mockAttachments]

  if (searchName.value) {
    const kw = searchName.value.toLowerCase()
    list = list.filter(item =>
      item.attachmentName.toLowerCase().includes(kw) ||
      item.fileName.toLowerCase().includes(kw)
    )
  }

  if (bizTypeFilter.value !== '') {
    list = list.filter(item => item.bizType === bizTypeFilter.value)
  }

  if (dateRange.value && dateRange.value.length === 2) {
    const start = dateRange.value[0]
    const end = dateRange.value[1]
    list = list.filter(item => {
      const t = item.uploadTime.substring(0, 10)
      return t >= start && t <= end
    })
  }

  if (uploaderNameFilter.value) {
    const kw = uploaderNameFilter.value.toLowerCase()
    list = list.filter(item => item.uploaderName.toLowerCase().includes(kw))
  }

  return list.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())
})

const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const handleSearch = () => {
  currentPage.value = 1
}

const handleReset = () => {
  searchName.value = ''
  bizTypeFilter.value = ''
  dateRange.value = null
  uploaderNameFilter.value = ''
  currentPage.value = 1
}

const handleAdd = () => {
  router.push('/attachment/add')
}

const handleView = (id: string) => {
  router.push(`/attachment/view/${id}`)
}

const handleEdit = (id: string) => {
  router.push(`/attachment/edit/${id}`)
}

const handleDownload = (row: AttachmentDoc) => {
  const link = document.createElement('a')
  link.href = row.fileUrl
  link.download = row.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  ElMessage.success(`开始下载 ${row.fileName}`)
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('确认删除该附件？', '提示', { type: 'warning' })
    const index = mockAttachments.findIndex(item => item.attachmentId === id)
    if (index !== -1) {
      mockAttachments.splice(index, 1)
      ElMessage.success('删除成功')
    }
  } catch {
    //
  }
}
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.search-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.search-input {
  width: 200px;
}

.filter-select {
  width: 140px;
}

.date-range {
  width: 260px;
}

.page-card {
  min-height: 400px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.pagination {
  margin: 0;
}
</style>
