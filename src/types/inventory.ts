export interface SalesOutCategoryItem {
  itemId: string
  categoryId: string
  categoryName: string
  amount: number
  remark: string
}

export interface SalesOutInventoryItem {
  itemId: string
  prodId: string
  prodName: string
  prodSpec: string
  unit: string
  qty: number
  price: number
  amount: number
  warehouseId: string
  remark: string
}

export interface SalesOutDoc {
  bizDocId: string
  bizDocNo: string
  bizType: string
  bizDate: string
  status: number
  ownerId: string
  ownerType: number
  ownerName: string
  contactId: string
  contactName: string
  accountId: string
  accountName: string
  totalQty: number
  totalAmount: number
  bizStaffId: string
  bizStaffName: string
  bizDeptId: string | null
  bizDeptName: string
  bizProjectId: string | null
  bizProjectName: string
  remark: string
  createId: string
  createName: string
  createTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  auditId: string | null
  auditName: string
  auditTime: string | null
  categoryItems: SalesOutCategoryItem[]
  inventoryItems: SalesOutInventoryItem[]
}

export type SalesOutDocInput = Omit<
  SalesOutDoc,
  | 'bizDocId'
  | 'bizDocNo'
  | 'status'
  | 'ownerName'
  | 'contactName'
  | 'accountName'
  | 'bizStaffName'
  | 'bizDeptName'
  | 'bizProjectName'
  | 'createId'
  | 'createName'
  | 'createTime'
  | 'updateId'
  | 'updateName'
  | 'updateTime'
  | 'auditId'
  | 'auditName'
  | 'auditTime'
>

export interface PurchaseReturnCategoryItem {
  itemId: string
  categoryId: string
  categoryName: string
  amount: number
  remark: string
}

export interface PurchaseReturnInventoryItem {
  itemId: string
  prodId: string
  prodName: string
  prodSpec: string
  unit: string
  qty: number
  price: number
  amount: number
  warehouseId: string
  remark: string
}

export interface PurchaseReturnDoc {
  bizDocId: string
  bizDocNo: string
  bizType: string
  bizDate: string
  status: number
  supplierId: string
  supplierName: string
  contactId: string
  contactName: string
  accountId: string
  accountName: string
  totalQty: number
  totalAmount: number
  bizStaffId: string
  bizStaffName: string
  bizDeptId: string | null
  bizDeptName: string
  bizProjectId: string | null
  bizProjectName: string
  remark: string
  createId: string
  createName: string
  createTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  auditId: string | null
  auditName: string
  auditTime: string | null
  categoryItems: PurchaseReturnCategoryItem[]
  inventoryItems: PurchaseReturnInventoryItem[]
}

export interface SalesReturnCategoryItem {
  itemId: string
  categoryId: string
  categoryName: string
  amount: number
  remark: string
}

export interface SalesReturnInventoryItem {
  itemId: string
  prodId: string
  prodName: string
  prodSpec: string
  unit: string
  qty: number
  price: number
  amount: number
  warehouseId: string
  remark: string
}

export interface SalesReturnDoc {
  bizDocId: string
  bizDocNo: string
  bizType: string
  bizDate: string
  status: number
  customerId: string
  customerName: string
  contactId: string
  contactName: string
  accountId: string
  accountName: string
  totalQty: number
  totalAmount: number
  bizStaffId: string
  bizStaffName: string
  bizDeptId: string | null
  bizDeptName: string
  bizProjectId: string | null
  bizProjectName: string
  remark: string
  createId: string
  createName: string
  createTime: string
  updateId: string | null
  updateName: string
  updateTime: string | null
  auditId: string | null
  auditName: string
  auditTime: string | null
  categoryItems: SalesReturnCategoryItem[]
  inventoryItems: SalesReturnInventoryItem[]
}
