export type BizType = 1 | 2 | 3 | 4 | 5 | 6

export const bizTypeMap: Record<BizType, string> = {
  1: '收入',
  2: '支出',
  3: '往来',
  4: '库存',
  5: '固定资产',
  6: '工资'
}

export interface AttachmentDoc {
  attachmentId: string
  attachmentName: string
  fileName: string
  fileSize: number
  fileType: string
  fileUrl: string
  bizType: BizType
  bizDocId: string
  uploaderId: string
  uploaderName: string
  uploadTime: string
  remark: string
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

export const isImageFile = (fileType: string): boolean => {
  return fileType.startsWith('image/')
}
