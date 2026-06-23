<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>编辑附件</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form v-if="form.attachmentId" :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="附件编号">
          <el-input v-model="form.attachmentId" disabled style="width: 400px" />
        </el-form-item>
        <el-form-item label="附件名称" prop="attachmentName">
          <el-input v-model="form.attachmentName" placeholder="请输入附件名称" style="width: 400px" maxlength="100" />
        </el-form-item>

        <el-form-item label="当前文件">
          <div class="current-file">
            <el-link type="primary" :href="form.fileUrl" target="_blank">{{ form.fileName }}</el-link>
            <span class="file-size">{{ formatFileSize(form.fileSize) }}</span>
          </div>
        </el-form-item>

        <el-form-item label="替换文件">
          <el-upload
            class="upload-demo"
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :file-list="fileList"
            :limit="1"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.zip"
          >
            <el-button type="primary" plain>选择新文件</el-button>
            <template #tip>
              <div class="el-upload__tip">可选，若不替换则保持原文件</div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="业务类型" prop="bizType">
          <el-select v-model="form.bizType" placeholder="请选择业务类型" style="width: 400px">
            <el-option :value="1" label="收入" />
            <el-option :value="2" label="支出" />
            <el-option :value="3" label="往来" />
            <el-option :value="4" label="库存" />
            <el-option :value="5" label="固定资产" />
            <el-option :value="6" label="工资" />
          </el-select>
        </el-form-item>

        <el-form-item label="业务单据ID" prop="bizDocId">
          <el-input v-model="form.bizDocId" placeholder="请输入关联的业务单据ID" style="width: 400px" />
        </el-form-item>

        <el-form-item label="上传人">
          <el-input v-model="form.uploaderName" disabled style="width: 400px" />
        </el-form-item>

        <el-form-item label="上传时间">
          <el-input v-model="form.uploadTime" disabled style="width: 400px" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息" style="width: 400px" :rows="3" maxlength="256" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
          <el-button @click="handleBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { mockAttachments } from '@/data/mockData'
import { formatFileSize, type BizType } from '@/types/attachment'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const fileList = ref<UploadUserFile[]>([])
const rawFile = ref<File | null>(null)

const form = reactive({
  attachmentId: '',
  attachmentName: '',
  fileName: '',
  fileSize: 0,
  fileType: '',
  fileUrl: '',
  bizType: 1 as BizType,
  bizDocId: '',
  uploaderId: '',
  uploaderName: '',
  uploadTime: '',
  remark: ''
})

const rules: FormRules = {
  attachmentName: [{ required: true, message: '请输入附件名称', trigger: 'blur' }],
  bizType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
  bizDocId: [{ required: true, message: '请输入业务单据ID', trigger: 'blur' }]
}

const handleFileChange = (_file: UploadUserFile, list: UploadUserFile[]) => {
  fileList.value = list
  const last = list[list.length - 1]
  rawFile.value = (last as any)?.raw || null
}

const handleFileRemove = () => {
  fileList.value = []
  rawFile.value = null
}

const handleBack = () => {
  router.push('/attachment')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  const index = mockAttachments.findIndex(item => item.attachmentId === form.attachmentId)
  if (index === -1) {
    ElMessage.error('未找到对应附件')
    router.push('/attachment')
    return
  }

  const target = mockAttachments[index]
  if (rawFile.value) {
    target.fileName = rawFile.value.name
    target.fileSize = rawFile.value.size
    target.fileType = rawFile.value.type || target.fileType
    target.fileUrl = URL.createObjectURL(new Blob([rawFile.value]))
  }
  target.attachmentName = form.attachmentName
  target.bizType = form.bizType
  target.bizDocId = form.bizDocId
  target.remark = form.remark

  mockAttachments[index] = { ...target }

  ElMessage.success('保存成功')
  router.push('/attachment')
}

onMounted(() => {
  const id = route.params.id as string
  const item = mockAttachments.find(x => x.attachmentId === id)
  if (!item) {
    router.push('/attachment')
    return
  }
  Object.assign(form, { ...item })
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

.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 0;
}

.current-file {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-size {
  color: #999;
  font-size: 13px;
}

.upload-demo {
  width: 400px;
}
</style>
