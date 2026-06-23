<template>
  <div class="page-container">
    <el-card class="page-card">
      <template #header>
        <div class="header-content">
          <span>新增附件</span>
          <el-button size="small" @click="handleBack">返回</el-button>
        </div>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" class="form-container">
        <el-form-item label="附件名称" prop="attachmentName">
          <el-input v-model="form.attachmentName" placeholder="请输入附件名称" style="width: 400px" maxlength="100" />
        </el-form-item>

        <el-form-item label="文件上传" prop="file">
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            :file-list="fileList"
            :limit="1"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt,.zip"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">支持 pdf/doc/xls/img/zip 等格式，单文件不超过 20MB</div>
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

        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注信息（可选）" style="width: 400px" :rows="3" maxlength="256" />
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import type { FormInstance, FormRules, UploadUserFile } from 'element-plus'
import { mockAttachments } from '@/data/mockData'
import type { BizType } from '@/types/attachment'

const router = useRouter()

const formRef = ref<FormInstance>()
const fileList = ref<UploadUserFile[]>([])
const rawFile = ref<File | null>(null)

const form = reactive({
  attachmentName: '',
  bizType: '' as BizType | '',
  bizDocId: '',
  remark: '',
  file: null as File | null
})

const rules: FormRules = {
  attachmentName: [{ required: true, message: '请输入附件名称', trigger: 'blur' }],
  bizType: [{ required: true, message: '请选择业务类型', trigger: 'change' }],
  bizDocId: [{ required: true, message: '请输入业务单据ID', trigger: 'blur' }],
  file: [{ required: true, message: '请上传文件', trigger: 'change' }]
}

const handleFileChange = (_file: UploadUserFile, list: UploadUserFile[]) => {
  fileList.value = list
  const last = list[list.length - 1]
  rawFile.value = (last as any)?.raw || null
  form.file = rawFile.value
  if (rawFile.value && !form.attachmentName) {
    form.attachmentName = rawFile.value.name
  }
}

const handleFileRemove = () => {
  fileList.value = []
  rawFile.value = null
  form.file = null
}

const handleBack = () => {
  router.push('/attachment')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  const now = new Date()
  const nextId = String(Number(mockAttachments[mockAttachments.length - 1]?.attachmentId || '0') + 1)
  const file = rawFile.value
  const name = file?.name || form.attachmentName
  const size = file?.size || 0
  const type = file?.type || getTypeByName(name)

  mockAttachments.push({
    attachmentId: nextId,
    attachmentName: form.attachmentName,
    fileName: name,
    fileSize: size,
    fileType: type,
    fileUrl: URL.createObjectURL(new Blob([file ?? ''])),
    bizType: form.bizType as BizType,
    bizDocId: form.bizDocId,
    uploaderId: '1',
    uploaderName: '管理员',
    uploadTime: now.toLocaleString('zh-CN'),
    remark: form.remark
  })

  ElMessage.success('新增成功')
  router.push('/attachment')
}

const getTypeByName = (name: string): string => {
  const ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase()
  const map: Record<string, string> = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    txt: 'text/plain',
    zip: 'application/zip'
  }
  return map[ext] || 'application/octet-stream'
}
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

.upload-demo {
  width: 400px;
}

.upload-demo :deep(.el-upload-dragger) {
  width: 100%;
}
</style>
