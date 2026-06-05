<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary" @click="openAddModal">新增支出</el-button>
    </div>

    <el-card class="page-card">
      <template #header>
        <span>费用支出列表</span>
      </template>

      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="业务日期">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="支出账户">
            <el-select v-model="searchForm.accountId" placeholder="请选择账户">
              <el-option label="全部" value="" />
              <el-option v-for="account in mockAccounts" :key="account.id" :label="account.name" :value="account.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="业务员">
            <el-select v-model="searchForm.staffId" placeholder="请选择业务员">
              <el-option label="全部" value="" />
              <el-option v-for="staff in mockStaff" :key="staff.id" :label="staff.name" :value="staff.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态">
              <el-option label="全部" value="" />
              <el-option label="正常" :value="0" />
              <el-option label="已删除" :value="-1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :data="filteredExpenseList" border>
        <el-table-column prop="bizDocNo" label="单据编号" />
        <el-table-column prop="tradeTime" label="业务日期" />
        <el-table-column prop="accountName" label="支出账户" />
        <el-table-column prop="staffName" label="业务员" />
        <el-table-column prop="deptName" label="部门" />
        <el-table-column prop="projectName" label="项目" />
        <el-table-column prop="bizContactName" label="往来单位" />
        <el-table-column label="金额" width="140">
          <template #default="scope">
            <span class="amount expense">-{{ getCurrencySymbol(scope.row.currencyCode) }} {{ (scope.row.amount || 0).toLocaleString() }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="currencyCode" label="币种" width="80" />
        <el-table-column prop="writerName" label="制单人" />
        <el-table-column prop="writerTime" label="制单时间" />
        <el-table-column label="状态" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">
              {{ scope.row.status === 0 ? '正常' : '已删除' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="text" size="small" @click="openDetailModal(scope.row)">查看</el-button>
            <el-button type="text" size="small" @click="openEditModal(scope.row)" :disabled="scope.row.status !== 0">编辑</el-button>
            <el-button type="text" size="small" style="color: #ef4444" @click="handleDelete(scope.row)" :disabled="scope.row.status !== 0">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <span class="total-amount">总支出金额: <span class="amount expense">-¥ {{ totalAmount.toLocaleString() }}</span></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredExpenseList.length"
        />
      </div>
    </el-card>

    <el-dialog :title="isEdit ? '编辑费用支出' : '新增费用支出'" :visible.sync="showModal" width="600px">
      <el-form :model="formData" label-width="120px">
        <el-form-item label="业务日期" prop="tradeTime" :rules="[{ required: true, message: '请选择业务日期' }]">
          <el-date-picker
            v-model="formData.tradeTime"
            type="date"
            placeholder="请选择日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="支出账户" prop="accountId" :rules="[{ required: true, message: '请选择支出账户' }]">
          <el-select v-model="formData.accountId" placeholder="请选择账户" @change="handleAccountChange">
            <el-option v-for="account in mockAccounts" :key="account.id" :label="account.name" :value="account.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务员" prop="staffId" :rules="[{ required: true, message: '请选择业务员' }]">
          <el-select v-model="formData.staffId" placeholder="请选择业务员">
            <el-option v-for="staff in mockStaff" :key="staff.id" :label="staff.name" :value="staff.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="formData.deptId" placeholder="请选择部门">
            <el-option label="请选择" :value="null" />
            <el-option v-for="dept in mockDepartments" :key="dept.id" :label="dept.name" :value="dept.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目">
          <el-select v-model="formData.projectId" placeholder="请选择项目">
            <el-option label="请选择" :value="null" />
            <el-option v-for="project in mockProjects" :key="project.id" :label="project.projectName" :value="project.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="往来单位" :rules="isArapAccount ? [{ required: true, message: '挂账账户必须选择往来单位' }] : []">
          <el-select v-model="formData.bizContactId" placeholder="请选择往来单位">
            <el-option label="请选择" :value="null" />
            <el-option v-for="contact in mockContacts" :key="contact.id" :label="contact.name" :value="contact.id" />
          </el-select>
          <span v-if="isArapAccount" class="required-hint">*</span>
        </el-form-item>
        <el-form-item label="支出金额" prop="amount" :rules="[{ required: true, message: '请输入支出金额' }, { validator: validateAmount, trigger: 'blur' }]">
          <el-input v-model.number="formData.amount" type="number" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="币种">
          <el-select v-model="formData.currencyCode" placeholder="请选择币种">
            <el-option v-for="currency in mockCurrencies" :key="currency.code" :label="currency.name" :value="currency.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="汇率">
          <el-input v-model.number="formData.exchangeRate" type="number" placeholder="请输入汇率" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" rows="3" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showModal = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="费用支出详情" :visible.sync="showDetailModal" width="600px">
      <div v-if="detailData" class="detail-content">
        <div class="detail-row">
          <span class="detail-label">单据编号:</span>
          <span class="detail-value">{{ detailData.bizDocNo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">业务日期:</span>
          <span class="detail-value">{{ detailData.tradeTime }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">支出账户:</span>
          <span class="detail-value">{{ detailData.accountName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">业务员:</span>
          <span class="detail-value">{{ detailData.staffName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">部门:</span>
          <span class="detail-value">{{ detailData.deptName || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">项目:</span>
          <span class="detail-value">{{ detailData.projectName || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">往来单位:</span>
          <span class="detail-value">{{ detailData.bizContactName || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">支出金额:</span>
          <span class="detail-value amount expense">-{{ getCurrencySymbol(detailData.currencyCode) }} {{ (detailData.amount || 0).toLocaleString() }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">币种:</span>
          <span class="detail-value">{{ detailData.currencyCode }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">汇率:</span>
          <span class="detail-value">{{ detailData.exchangeRate.toFixed(8) }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">备注:</span>
          <span class="detail-value">{{ detailData.remark || '-' }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">制单人:</span>
          <span class="detail-value">{{ detailData.writerName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">制单时间:</span>
          <span class="detail-value">{{ detailData.writerTime }}</span>
        </div>
        <div v-if="detailData.updateName" class="detail-row">
          <span class="detail-label">修改人:</span>
          <span class="detail-value">{{ detailData.updateName }}</span>
        </div>
        <div v-if="detailData.updateTime" class="detail-row">
          <span class="detail-label">修改时间:</span>
          <span class="detail-value">{{ detailData.updateTime }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">状态:</span>
          <el-tag :type="detailData.status === 0 ? 'success' : 'danger'">
            {{ detailData.status === 0 ? '正常' : '已删除' }}
          </el-tag>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDetailModal = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">import { ref, computed, reactive } from 'vue';
import { mockExpenseDocs, mockAccounts, mockStaff, mockDepartments, mockProjects, mockContacts, mockCurrencies, type ExpenseDoc } from '@/data/mockData';
const searchForm = reactive({
 dateRange: [] as string[],
 accountId: '',
 staffId: '',
 status: ''
});
const currentPage = ref(1);
const pageSize = ref(10);
const showModal = ref(false);
const showDetailModal = ref(false);
const isEdit = ref(false);
const formData = reactive({
 bizDocId: '',
 bizDocNo: '',
 tradeTime: '',
 accountId: '',
 staffId: '',
 deptId: null as string | null,
 projectId: null as string | null,
 bizContactId: null as string | null,
 amount: 0,
 currencyCode: 'CNY',
 exchangeRate: 1.00000000,
 remark: ''
});
const detailData = ref<ExpenseDoc | null>(null);
const filteredExpenseList = computed(() => {
 let list = [...mockExpenseDocs];
 if (searchForm.dateRange.length === 2) {
 list = list.filter(item => item.tradeTime >= searchForm.dateRange[0] && item.tradeTime <= searchForm.dateRange[1]);
 }
 if (searchForm.accountId) {
 list = list.filter(item => item.accountId === searchForm.accountId);
 }
 if (searchForm.staffId) {
 list = list.filter(item => item.staffId === searchForm.staffId);
 }
 if (searchForm.status !== '') {
 list = list.filter(item => item.status === Number(searchForm.status));
 }
 const start = (currentPage.value - 1) * pageSize.value;
 const end = start + pageSize.value;
 return list.slice(start, end);
});
const totalAmount = computed(() => {
 const list = filteredExpenseList.value;
 if (!list || list.length === 0) return 0;
 return list.reduce((sum, item) => sum + (item.amount || 0), 0);
});
const isArapAccount = computed(() => {
 if (!formData.accountId)
 return false;
 const account = mockAccounts.find(a => a.id === formData.accountId);
 return account ? account.type === 3 : false;
});
const getCurrencySymbol = (code: string) => {
 const currency = mockCurrencies.find(c => c.code === code);
 return currency ? currency.symbol : '¥';
};
const validateAmount = (rule: any, value: number, callback: any) => {
 if (value <= 0) {
 callback(new Error('支出金额必须大于0'));
 }
 else {
 callback();
 }
};
const handleSearch = () => {
 currentPage.value = 1;
};
const handleReset = () => {
 searchForm.dateRange = [];
 searchForm.accountId = '';
 searchForm.staffId = '';
 searchForm.status = '';
 currentPage.value = 1;
};
const handleSizeChange = (val: number) => {
 pageSize.value = val;
 currentPage.value = 1;
};
const handleCurrentChange = (val: number) => {
 currentPage.value = val;
};
const openAddModal = () => {
 isEdit.value = false;
 formData.bizDocId = '';
 formData.bizDocNo = '';
 formData.tradeTime = '';
 formData.accountId = '';
 formData.staffId = '';
 formData.deptId = null;
 formData.projectId = null;
 formData.bizContactId = null;
 formData.amount = 0;
 formData.currencyCode = 'CNY';
 formData.exchangeRate = 1.00000000;
 formData.remark = '';
 showModal.value = true;
};
const openEditModal = (row: ExpenseDoc) => {
 isEdit.value = true;
 formData.bizDocId = row.bizDocId;
 formData.bizDocNo = row.bizDocNo;
 formData.tradeTime = row.tradeTime;
 formData.accountId = row.accountId;
 formData.staffId = row.staffId;
 formData.deptId = row.deptId;
 formData.projectId = row.projectId;
 formData.bizContactId = row.bizContactId;
 formData.amount = row.amount;
 formData.currencyCode = row.currencyCode;
 formData.exchangeRate = row.exchangeRate;
 formData.remark = row.remark;
 showModal.value = true;
};
const openDetailModal = (row: ExpenseDoc) => {
 detailData.value = row;
 showDetailModal.value = true;
};
const handleAccountChange = () => {
};
const handleSubmit = () => {
 if (!formData.tradeTime || !formData.accountId || !formData.staffId || formData.amount <= 0) {
 alert('请填写必填字段');
 return;
 }
 if (isArapAccount.value && !formData.bizContactId) {
 alert('挂账账户必须选择往来单位');
 return;
 }
 if (isEdit.value) {
 alert(`费用支出单 ${formData.bizDocNo} 已更新`);
 }
 else {
 const newNo = `EX${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(mockExpenseDocs.length + 1).padStart(4, '0')}`;
 alert(`费用支出单 ${newNo} 已创建`);
 }
 showModal.value = false;
};
const handleDelete = (row: ExpenseDoc) => {
 if (confirm(`确定要删除费用支出单 ${row.bizDocNo} 吗？`)) {
 alert(`费用支出单 ${row.bizDocNo} 已删除`);
 }
};
</script>

<style scoped>
.page-container {
  padding: 24px;
}

.page-header {
  margin-bottom: 20px;
}

.page-card {
  min-height: 400px;
}

.search-form {
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 4px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 10px 0;
}

.total-amount {
  font-size: 16px;
  font-weight: 600;
}

.amount {
  font-weight: 600;
}

.amount.expense {
  color: #ef4444;
}

.detail-content {
  padding: 10px 0;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
}

.detail-label {
  width: 120px;
  font-weight: 500;
  color: #666;
}

.detail-value {
  flex: 1;
}

.required-hint {
  color: #f56c6c;
  margin-left: 4px;
}

.dialog-footer {
  text-align: right;
}
</style>