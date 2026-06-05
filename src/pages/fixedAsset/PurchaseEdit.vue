<template>
  <div class="page-container">
    <div class="page-header">
      <h2>编辑购置单据</h2>
      <div class="header-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </div>

    <div class="page-card">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="单据编号" prop="bizDocNo">
          <el-input v-model="form.bizDocNo" disabled />
        </el-form-item>

        <el-form-item label="购置日期" prop="tradeTime">
          <el-date-picker v-model="form.tradeTime" type="date" placeholder="请选择购置日期" />
        </el-form-item>

        <el-form-item label="付款账户" prop="accountId">
          <el-select v-model="form.accountId" placeholder="请选择付款账户">
            <el-option
              v-for="account in mockAccounts"
              :key="account.id"
              :label="account.name"
              :value="account.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="供应商">
          <el-select v-model="form.supplierId" placeholder="请选择供应商">
            <el-option
              v-for="contact in mockContacts"
              :key="contact.id"
              :label="contact.name"
              :value="contact.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="备注">
          <el-textarea v-model="form.remark" placeholder="请输入备注" rows="2" />
        </el-form-item>

        <el-form-item label="资产清单" class="form-section-title">
          <el-divider />
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span>资产列表</span>
            <el-button type="primary" size="small" @click="addAssetRow">+ 添加资产</el-button>
          </div>
          
          <el-table v-if="assetList.length > 0" :data="assetList" border>
            <el-table-column label="资产名称" width="160">
              <template #default="scope">
                <el-input v-model="scope.row.assetName" placeholder="请输入资产名称" />
              </template>
            </el-table-column>
            <el-table-column label="资产类别" width="120">
              <template #default="scope">
                <el-select v-model="scope.row.categoryId" placeholder="请选择类别" @change="handleAssetCategoryChange(scope.$index)">
                  <el-option
                    v-for="cat in mockAssetCategories"
                    :key="cat.id"
                    :label="cat.name"
                    :value="cat.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="规格型号" width="140">
              <template #default="scope">
                <el-input v-model="scope.row.specModel" placeholder="请输入规格型号" />
              </template>
            </el-table-column>
            <el-table-column label="原值" width="120">
              <template #default="scope">
                <el-input v-model.number="scope.row.originalValue" placeholder="请输入原值" />
              </template>
            </el-table-column>
            <el-table-column label="净残值率(%)" width="120">
              <template #default="scope">
                <el-input v-model.number="scope.row.salvageRate" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="使用年限(年)" width="120">
              <template #default="scope">
                <el-input v-model.number="scope.row.usefulLife" placeholder="请输入" />
              </template>
            </el-table-column>
            <el-table-column label="使用部门" width="120">
              <template #default="scope">
                <el-select v-model="scope.row.deptId" placeholder="请选择部门">
                  <el-option
                    v-for="dept in mockDepartments"
                    :key="dept.id"
                    :label="dept.name"
                    :value="dept.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="使用人" width="100">
              <template #default="scope">
                <el-select v-model="scope.row.staffId" placeholder="请选择使用人">
                  <el-option
                    v-for="staff in mockStaff"
                    :key="staff.id"
                    :label="staff.name"
                    :value="staff.id"
                  />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="存放地点" width="120">
              <template #default="scope">
                <el-input v-model="scope.row.location" placeholder="请输入存放地点" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="scope">
                <el-button size="small" type="danger" @click="removeAssetRow(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="empty-tip">暂无资产，请点击上方按钮添加</div>
        </el-form-item>

        <el-form-item label="购置总金额">
          <el-input v-model="totalAmount" disabled />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { mockFixedAssetPurchases, mockFixedAssets, mockAssetCategories, mockDepartments, mockStaff, mockAccounts, mockContacts, FixedAssetCard } from '@/data/mockData'

const router = useRouter()
const route = useRoute()

const formRef = ref()
const purchaseId = ref('')

const form = ref({
  bizDocNo: '',
  tradeTime: '',
  accountId: '',
  accountName: '',
  supplierId: '',
  supplierName: '',
  remark: '',
  status: 0
})

const assetList = ref([
  {
    assetName: '',
    categoryId: '',
    specModel: '',
    originalValue: 0,
    salvageRate: 5,
    usefulLife: 3,
    deptId: '',
    staffId: '',
    location: ''
  }
])

const rules = {
  tradeTime: [{ required: true, message: '请选择购置日期', trigger: 'change' }],
  accountId: [{ required: true, message: '请选择付款账户', trigger: 'change' }]
}

const totalAmount = computed(() => {
  const total = assetList.value.reduce((sum, item) => sum + (item.originalValue || 0), 0)
  return total.toLocaleString('zh-CN', { minimumFractionDigits: 2 })
})

const addAssetRow = () => {
  assetList.value.push({
    assetName: '',
    categoryId: '',
    specModel: '',
    originalValue: 0,
    salvageRate: 5,
    usefulLife: 3,
    deptId: '',
    staffId: '',
    location: ''
  })
}

const removeAssetRow = (index: number) => {
  if (assetList.value.length > 1) {
    assetList.value.splice(index, 1)
  }
}

const handleAssetCategoryChange = (index: number) => {
  const categoryId = assetList.value[index].categoryId
  const category = mockAssetCategories.find(cat => cat.id === categoryId)
  if (category) {
    assetList.value[index].usefulLife = category.defaultLife
    assetList.value[index].salvageRate = category.defaultSalvageRate * 100
  }
}

const handleCancel = () => {
  router.push('/fixedAsset/purchase')
}

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    
    const validAssets = assetList.value.filter(item => item.assetName && item.categoryId && item.originalValue > 0)
    if (validAssets.length === 0) {
      alert('请至少添加一条资产信息')
      return
    }
    
    const purchaseIndex = mockFixedAssetPurchases.findIndex(item => item.bizDocId === purchaseId.value)
    if (purchaseIndex !== -1) {
      mockFixedAssetPurchases[purchaseIndex] = {
        ...mockFixedAssetPurchases[purchaseIndex],
        tradeTime: form.value.tradeTime,
        accountId: form.value.accountId,
        accountName: mockAccounts.find(a => a.id === form.value.accountId)?.name || '',
        amount: parseFloat(totalAmount.value.replace(/,/g, '')),
        supplierId: form.value.supplierId,
        supplierName: mockContacts.find(c => c.id === form.value.supplierId)?.name || '',
        remark: form.value.remark,
        assetList: []
      }
      
      validAssets.forEach((assetItem) => {
        const category = mockAssetCategories.find(cat => cat.id === assetItem.categoryId)
        const dept = mockDepartments.find(d => d.id === assetItem.deptId)
        const staff = mockStaff.find(s => s.id === assetItem.staffId)
        const now = new Date()
        const dateStr = now.toISOString().split('T')[0]
        
        const asset: FixedAssetCard = {
          assetId: String(mockFixedAssets.length + 1),
          assetNo: `GDZC-${dateStr.replace(/-/g, '')}-${String(mockFixedAssets.length + 1).padStart(4, '0')}`,
          assetName: assetItem.assetName,
          categoryId: assetItem.categoryId,
          categoryName: category?.name || '',
          specModel: assetItem.specModel,
          originalValue: assetItem.originalValue,
          salvageRate: assetItem.salvageRate / 100,
          salvageValue: assetItem.originalValue * (assetItem.salvageRate / 100),
          usefulLife: assetItem.usefulLife,
          monthlyDepreciation: (assetItem.originalValue * (1 - assetItem.salvageRate / 100)) / (assetItem.usefulLife * 12),
          accumulatedDepreciation: 0,
          netValue: assetItem.originalValue,
          purchaseDate: form.value.tradeTime,
          startDate: form.value.tradeTime,
          deptId: assetItem.deptId,
          deptName: dept?.name || '',
          staffId: assetItem.staffId,
          staffName: staff?.name || '',
          location: assetItem.location,
          status: 0,
          statusName: '在用',
          remark: '',
          createTime: `${dateStr} ${now.toTimeString().split(' ')[0]}`
        }
        
        mockFixedAssetPurchases[purchaseIndex].assetList.push(asset)
      })
      
      alert('保存成功')
      router.push('/fixedAsset/purchase')
    }
  })
}

onMounted(() => {
  const id = route.params.id
  if (id) {
    purchaseId.value = id as string
    const purchase = mockFixedAssetPurchases.find(item => item.bizDocId === id)
    if (purchase) {
      form.value = {
        bizDocNo: purchase.bizDocNo,
        tradeTime: purchase.tradeTime,
        accountId: purchase.accountId,
        accountName: purchase.accountName,
        supplierId: purchase.supplierId,
        supplierName: purchase.supplierName,
        remark: purchase.remark,
        status: purchase.status
      }
      
      if (purchase.assetList && purchase.assetList.length > 0) {
        assetList.value = purchase.assetList.map(asset => ({
          assetName: asset.assetName,
          categoryId: asset.categoryId,
          specModel: asset.specModel,
          originalValue: asset.originalValue,
          salvageRate: asset.salvageRate * 100,
          usefulLife: asset.usefulLife,
          deptId: asset.deptId,
          staffId: asset.staffId,
          location: asset.location
        }))
      }
    }
  }
})
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.page-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 30px;
}

.form-section-title {
  margin-bottom: 0 !important;
}

.form-section-title .el-divider {
  margin: 0;
}

.empty-tip {
  text-align: center;
  padding: 30px;
  color: #909399;
}
</style>