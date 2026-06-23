import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Login from '@/pages/Login.vue'
import Layout from '@/components/layout/Layout.vue'
import Dashboard from '@/pages/Dashboard.vue'

import SettingsCompany from '@/pages/settings/Company.vue'
import SettingsCompanyAdd from '@/pages/settings/CompanyAdd.vue'
import SettingsCompanyEdit from '@/pages/settings/CompanyEdit.vue'
import SettingsEmployees from '@/pages/settings/Employees.vue'
import SettingsEmployeesAdd from '@/pages/settings/EmployeesAdd.vue'
import SettingsEmployeesEdit from '@/pages/settings/EmployeesEdit.vue'
import SettingsContacts from '@/pages/settings/Contacts.vue'
import SettingsContactsAdd from '@/pages/settings/ContactsAdd.vue'
import SettingsContactsEdit from '@/pages/settings/ContactsEdit.vue'
import SettingsCategories from '@/pages/settings/Categories.vue'
import SettingsCategoriesAdd from '@/pages/settings/CategoriesAdd.vue'
import SettingsCategoriesEdit from '@/pages/settings/CategoriesEdit.vue'
import SettingsAccounts from '@/pages/settings/Accounts.vue'
import SettingsAccountsAdd from '@/pages/settings/AccountsAdd.vue'
import SettingsAccountsEdit from '@/pages/settings/AccountsEdit.vue'
import SettingsSubjects from '@/pages/settings/Subjects.vue'
import SettingsSubjectsAdd from '@/pages/settings/SubjectsAdd.vue'
import SettingsSubjectsEdit from '@/pages/settings/SubjectsEdit.vue'
import SettingsProjects from '@/pages/settings/Projects.vue'
import SettingsProjectsAdd from '@/pages/settings/ProjectsAdd.vue'
import SettingsProjectsEdit from '@/pages/settings/ProjectsEdit.vue'
import SettingsDepartments from '@/pages/settings/Departments.vue'
import SettingsDepartmentsAdd from '@/pages/settings/DepartmentsAdd.vue'
import SettingsDepartmentsEdit from '@/pages/settings/DepartmentsEdit.vue'
import SettingsRoles from '@/pages/settings/Roles.vue'
import SettingsRolesAdd from '@/pages/settings/RolesAdd.vue'
import SettingsRolesEdit from '@/pages/settings/RolesEdit.vue'
import SettingsCurrencies from '@/pages/settings/Currencies.vue'
import SettingsCurrenciesAdd from '@/pages/settings/CurrenciesAdd.vue'
import SettingsCurrenciesEdit from '@/pages/settings/CurrenciesEdit.vue'
import SettingsLogs from '@/pages/settings/Logs.vue'
import SettingsLedger from '@/pages/settings/Ledger.vue'
import SettingsLedgerAdd from '@/pages/settings/LedgerAdd.vue'
import SettingsLedgerEdit from '@/pages/settings/LedgerEdit.vue'
import SettingsLedgerView from '@/pages/settings/LedgerView.vue'
import SettingsWarehouse from '@/pages/settings/Warehouse.vue'
import SettingsProduct from '@/pages/settings/Product.vue'
import SettingsAudit from '@/pages/settings/Audit.vue'
import SettingsAuditView from '@/pages/settings/AuditView.vue'
import SettingsSeal from '@/pages/settings/Seal.vue'
import SettingsSealAdd from '@/pages/settings/SealAdd.vue'
import SettingsSealView from '@/pages/settings/SealView.vue'
import SettingsProductAdd from '@/pages/settings/ProductAdd.vue'
import SettingsProductEdit from '@/pages/settings/ProductEdit.vue'
import SettingsProductView from '@/pages/settings/ProductView.vue'
import SettingsUnit from '@/pages/settings/Unit.vue'
import SettingsUnitAdd from '@/pages/settings/UnitAdd.vue'
import SettingsUnitEdit from '@/pages/settings/UnitEdit.vue'
import SettingsUnitView from '@/pages/settings/UnitView.vue'
import SettingsUnitGroup from '@/pages/settings/UnitGroup.vue'
import SettingsUnitConversion from '@/pages/settings/UnitConversion.vue'

import BusinessIncome from '@/pages/business/Income.vue'
import BusinessIncomeAdd from '@/pages/business/IncomeAdd.vue'
import BusinessIncomeEdit from '@/pages/business/IncomeEdit.vue'
import BusinessIncomeView from '@/pages/business/IncomeView.vue'
import BusinessExpense from '@/pages/business/Expense.vue'
import BusinessExpenseAdd from '@/pages/business/ExpenseAdd.vue'
import BusinessExpenseEdit from '@/pages/business/ExpenseEdit.vue'
import BusinessExpenseView from '@/pages/business/ExpenseView.vue'
import BusinessAmortization from '@/pages/business/Amortization.vue'
import BusinessAmortizationAdd from '@/pages/business/AmortizationAdd.vue'
import BusinessAmortizationEdit from '@/pages/business/AmortizationEdit.vue'
import BusinessAmortizationView from '@/pages/business/AmortizationView.vue'
import BusinessBonus from '@/pages/business/Bonus.vue'
import BusinessBonusAdd from '@/pages/business/BonusAdd.vue'
import BusinessBonusEdit from '@/pages/business/BonusEdit.vue'
import BusinessBonusView from '@/pages/business/BonusView.vue'
import BusinessReceipt from '@/pages/business/Receipt.vue'
import BusinessReceiptAdd from '@/pages/business/ReceiptAdd.vue'
import BusinessReceiptEdit from '@/pages/business/ReceiptEdit.vue'
import BusinessReceiptView from '@/pages/business/ReceiptView.vue'
import BusinessPayment from '@/pages/business/Payment.vue'
import BusinessPaymentAdd from '@/pages/business/PaymentAdd.vue'
import BusinessPaymentEdit from '@/pages/business/PaymentEdit.vue'
import BusinessPaymentView from '@/pages/business/PaymentView.vue'
import BusinessNotes from '@/pages/business/Notes.vue'
import BusinessShareChange from '@/pages/business/ShareChange.vue'
import BusinessShareChangeAdd from '@/pages/business/ShareChangeAdd.vue'
import BusinessShareChangeEdit from '@/pages/business/ShareChangeEdit.vue'
import BusinessShareChangeView from '@/pages/business/ShareChangeView.vue'

import InventoryList from '@/pages/inventory/List.vue'
import InventoryIn from '@/pages/inventory/In.vue'
import InventoryOut from '@/pages/inventory/Out.vue'
import SalesOut from '@/pages/inventory/SalesOut.vue'
import SalesOutAdd from '@/pages/inventory/SalesOutAdd.vue'
import SalesOutEdit from '@/pages/inventory/SalesOutEdit.vue'
import SalesOutView from '@/pages/inventory/SalesOutView.vue'
import PurchaseReturn from '@/pages/inventory/PurchaseReturn.vue'
import PurchaseReturnAdd from '@/pages/inventory/PurchaseReturnAdd.vue'
import PurchaseReturnEdit from '@/pages/inventory/PurchaseReturnEdit.vue'
import PurchaseReturnView from '@/pages/inventory/PurchaseReturnView.vue'
import SalesReturn from '@/pages/inventory/SalesReturn.vue'
import SalesReturnAdd from '@/pages/inventory/SalesReturnAdd.vue'
import SalesReturnEdit from '@/pages/inventory/SalesReturnEdit.vue'
import SalesReturnView from '@/pages/inventory/SalesReturnView.vue'
import Stocktake from '@/pages/inventory/Stocktake.vue'
import StocktakeAdd from '@/pages/inventory/StocktakeAdd.vue'
import StocktakeEdit from '@/pages/inventory/StocktakeEdit.vue'
import StocktakeView from '@/pages/inventory/StocktakeView.vue'
import InventoryBalance from '@/pages/inventory/InventoryBalance.vue'
import CostAdjust from '@/pages/inventory/CostAdjust.vue'
import CostAdjustAdd from '@/pages/inventory/CostAdjustAdd.vue'
import CostAdjustEdit from '@/pages/inventory/CostAdjustEdit.vue'
import Assemble from '@/pages/inventory/Assemble.vue'
import AssembleAdd from '@/pages/inventory/AssembleAdd.vue'
import AssembleEdit from '@/pages/inventory/AssembleEdit.vue'
import ProfitLoss from '@/pages/inventory/ProfitLoss.vue'
import ProfitLossAdd from '@/pages/inventory/ProfitLossAdd.vue'
import ProfitLossEdit from '@/pages/inventory/ProfitLossEdit.vue'

import PurchaseIn from '@/pages/purchase/In.vue'
import PurchaseInAdd from '@/pages/purchase/InAdd.vue'
import PurchaseInEdit from '@/pages/purchase/InEdit.vue'
import PurchaseInView from '@/pages/purchase/InView.vue'

import FinanceVoucher from '@/pages/finance/Voucher.vue'
import FinanceVoucherAdd from '@/pages/finance/VoucherAdd.vue'
import FinanceVoucherEdit from '@/pages/finance/VoucherEdit.vue'
import FinanceVoucherView from '@/pages/finance/VoucherView.vue'
import FinanceReport from '@/pages/finance/Report.vue'
import FinanceReceivable from '@/pages/finance/Receivable.vue'
import FinanceReceiptRecord from '@/pages/finance/ReceiptRecord.vue'
import FinanceTransferOffRecord from '@/pages/finance/TransferOffRecord.vue'
import FinanceArapOperation from '@/pages/finance/ArapOperation.vue'

import LedgerTrialBalance from '@/pages/ledger/TrialBalance.vue'
import LedgerSubjectBalance from '@/pages/ledger/SubjectBalance.vue'

import AnalysisOverview from '@/pages/analysis/Overview.vue'
import AnalysisIncome from '@/pages/analysis/Income.vue'
import AnalysisExpense from '@/pages/analysis/Expense.vue'

import FixedAssetCard from '@/pages/fixedAsset/Card.vue'
import FixedAssetCardAdd from '@/pages/fixedAsset/CardAdd.vue'
import FixedAssetCardEdit from '@/pages/fixedAsset/CardEdit.vue'
import FixedAssetCardView from '@/pages/fixedAsset/CardView.vue'
import FixedAssetPurchase from '@/pages/fixedAsset/Purchase.vue'
import FixedAssetPurchaseAdd from '@/pages/fixedAsset/PurchaseAdd.vue'
import FixedAssetPurchaseEdit from '@/pages/fixedAsset/PurchaseEdit.vue'
import FixedAssetPurchaseView from '@/pages/fixedAsset/PurchaseView.vue'
import FixedAssetDepreciation from '@/pages/fixedAsset/Depreciation.vue'
import FixedAssetDisposal from '@/pages/fixedAsset/Disposal.vue'
import FixedAssetDisposalAdd from '@/pages/fixedAsset/DisposalAdd.vue'
import FixedAssetDisposalEdit from '@/pages/fixedAsset/DisposalEdit.vue'
import FixedAssetDisposalView from '@/pages/fixedAsset/DisposalView.vue'
import FixedAssetLedger from '@/pages/fixedAsset/Ledger.vue'
import FixedAssetSummaryByCategory from '@/pages/fixedAsset/SummaryByCategory.vue'
import FixedAssetSummaryByDept from '@/pages/fixedAsset/SummaryByDept.vue'

import BorrowLend from '@/pages/borrowLend/BorrowLend.vue'
import BorrowLendAdd from '@/pages/borrowLend/BorrowLendAdd.vue'
import BorrowLendEdit from '@/pages/borrowLend/BorrowLendEdit.vue'
import BorrowLendView from '@/pages/borrowLend/BorrowLendView.vue'

import Advance from '@/pages/advance/Advance.vue'
import AdvanceAdd from '@/pages/advance/AdvanceAdd.vue'
import AdvanceEdit from '@/pages/advance/AdvanceEdit.vue'
import AdvanceView from '@/pages/advance/AdvanceView.vue'

import SalaryAccrued from '@/pages/salary/accrued/Accrued.vue'
import SalaryAccruedAdd from '@/pages/salary/accrued/AccruedAdd.vue'
import SalaryAccruedEdit from '@/pages/salary/accrued/AccruedEdit.vue'
import SalaryAccruedView from '@/pages/salary/accrued/AccruedView.vue'

import SalaryIssue from '@/pages/salary/issue/Issue.vue'
import SalaryIssueAdd from '@/pages/salary/issue/IssueAdd.vue'
import SalaryIssueEdit from '@/pages/salary/issue/IssueEdit.vue'
import SalaryIssueView from '@/pages/salary/issue/IssueView.vue'

import Attachment from '@/pages/attachment/Attachment.vue'
import AttachmentAdd from '@/pages/attachment/AttachmentAdd.vue'
import AttachmentEdit from '@/pages/attachment/AttachmentEdit.vue'
import AttachmentView from '@/pages/attachment/AttachmentView.vue'

import { useAppStore } from '@/stores/appStore'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/dashboard', component: Dashboard },
      
      { path: '/settings/company', component: SettingsCompany },
      { path: '/settings/company/add', component: SettingsCompanyAdd },
      { path: '/settings/company/edit/:id', component: SettingsCompanyEdit },
      { path: '/settings/employees', component: SettingsEmployees },
      { path: '/settings/employees/add', component: SettingsEmployeesAdd },
      { path: '/settings/employees/edit/:id', component: SettingsEmployeesEdit },
      { path: '/settings/contacts', component: SettingsContacts },
      { path: '/settings/contacts/add', component: SettingsContactsAdd },
      { path: '/settings/contacts/edit/:id', component: SettingsContactsEdit },
      { path: '/settings/categories', component: SettingsCategories },
      { path: '/settings/categories/add', component: SettingsCategoriesAdd },
      { path: '/settings/categories/edit/:id', component: SettingsCategoriesEdit },
      { path: '/settings/subjects', component: SettingsSubjects },
      { path: '/settings/subjects/add', component: SettingsSubjectsAdd },
      { path: '/settings/subjects/edit/:id', component: SettingsSubjectsEdit },
      { path: '/settings/accounts', component: SettingsAccounts },
      { path: '/settings/accounts/add', component: SettingsAccountsAdd },
      { path: '/settings/accounts/edit/:id', component: SettingsAccountsEdit },
      { path: '/settings/projects', component: SettingsProjects },
      { path: '/settings/projects/add', component: SettingsProjectsAdd },
      { path: '/settings/projects/edit/:id', component: SettingsProjectsEdit },
      { path: '/settings/departments', component: SettingsDepartments },
      { path: '/settings/departments/add', component: SettingsDepartmentsAdd },
      { path: '/settings/departments/edit/:id', component: SettingsDepartmentsEdit },
      { path: '/settings/roles', component: SettingsRoles },
      { path: '/settings/roles/add', component: SettingsRolesAdd },
      { path: '/settings/roles/edit/:id', component: SettingsRolesEdit },
      { path: '/settings/currencies', component: SettingsCurrencies },
      { path: '/settings/currencies/add', component: SettingsCurrenciesAdd },
      { path: '/settings/currencies/edit/:id', component: SettingsCurrenciesEdit },
      { path: '/settings/logs', component: SettingsLogs },
      { path: '/settings/ledger', component: SettingsLedger },
      { path: '/settings/ledger/add', component: SettingsLedgerAdd },
      { path: '/settings/ledger/edit/:id', component: SettingsLedgerEdit },
      { path: '/settings/ledger/view/:id', component: SettingsLedgerView },
      { path: '/settings/warehouse', component: SettingsWarehouse },
      { path: '/settings/product', component: SettingsProduct },
      { path: '/settings/product/add', component: SettingsProductAdd },
      { path: '/settings/product/edit/:id', component: SettingsProductEdit },
      { path: '/settings/product/view/:id', component: SettingsProductView },
      { path: '/settings/unit', component: SettingsUnit },
      { path: '/settings/unit/add', component: SettingsUnitAdd },
      { path: '/settings/unit/edit/:id', component: SettingsUnitEdit },
      { path: '/settings/unit/view/:id', component: SettingsUnitView },
      { path: '/settings/unit-group', component: SettingsUnitGroup },
      { path: '/settings/unit-conversion', component: SettingsUnitConversion },
      { path: '/settings/audit', component: SettingsAudit },
      { path: '/settings/audit/view/:id', component: SettingsAuditView },
      { path: '/settings/seal', component: SettingsSeal },
      { path: '/settings/seal/add', component: SettingsSealAdd },
      { path: '/settings/seal/view/:id', component: SettingsSealView },
      
      { path: '/business/income', component: BusinessIncome },
      { path: '/business/income/add', component: BusinessIncomeAdd },
      { path: '/business/income/edit/:id', component: BusinessIncomeEdit },
      { path: '/business/income/view/:id', component: BusinessIncomeView },
      { path: '/business/expense', component: BusinessExpense },
      { path: '/business/expense/add', component: BusinessExpenseAdd },
      { path: '/business/expense/edit/:id', component: BusinessExpenseEdit },
      { path: '/business/expense/view/:id', component: BusinessExpenseView },
      { path: '/business/amortization', component: BusinessAmortization },
      { path: '/business/amortization/add', component: BusinessAmortizationAdd },
      { path: '/business/amortization/edit/:id', component: BusinessAmortizationEdit },
      { path: '/business/amortization/view/:id', component: BusinessAmortizationView },
      { path: '/business/bonus', component: BusinessBonus },
      { path: '/business/bonus/add', component: BusinessBonusAdd },
      { path: '/business/bonus/edit/:id', component: BusinessBonusEdit },
      { path: '/business/bonus/view/:id', component: BusinessBonusView },
      { path: '/business/receipt', component: BusinessReceipt },
      { path: '/business/receipt/add', component: BusinessReceiptAdd },
      { path: '/business/receipt/edit/:id', component: BusinessReceiptEdit },
      { path: '/business/receipt/view/:id', component: BusinessReceiptView },
      { path: '/business/payment', component: BusinessPayment },
      { path: '/business/payment/add', component: BusinessPaymentAdd },
      { path: '/business/payment/edit/:id', component: BusinessPaymentEdit },
      { path: '/business/payment/view/:id', component: BusinessPaymentView },
      { path: '/business/notes', component: BusinessNotes },
      { path: '/business/share-change', component: BusinessShareChange },
      { path: '/business/share-change/add', component: BusinessShareChangeAdd },
      { path: '/business/share-change/edit/:id', component: BusinessShareChangeEdit },
      { path: '/business/share-change/view/:id', component: BusinessShareChangeView },
      
      { path: '/inventory/list', component: InventoryList },
      { path: '/inventory/in', component: InventoryIn },
      { path: '/inventory/out', component: InventoryOut },
      { path: '/inventory/sales-out', component: SalesOut },
      { path: '/inventory/sales-out/add', component: SalesOutAdd },
      { path: '/inventory/sales-out/edit/:id', component: SalesOutEdit },
      { path: '/inventory/sales-out/view/:id', component: SalesOutView },
      { path: '/inventory/purchase-return', component: PurchaseReturn },
      { path: '/inventory/purchase-return/add', component: PurchaseReturnAdd },
      { path: '/inventory/purchase-return/edit/:id', component: PurchaseReturnEdit },
      { path: '/inventory/purchase-return/view/:id', component: PurchaseReturnView },
      { path: '/inventory/sales-return', component: SalesReturn },
      { path: '/inventory/sales-return/add', component: SalesReturnAdd },
      { path: '/inventory/sales-return/edit/:id', component: SalesReturnEdit },
      { path: '/inventory/sales-return/view/:id', component: SalesReturnView },
      { path: '/inventory/stocktake', component: Stocktake },
      { path: '/inventory/stocktake/add', component: StocktakeAdd },
      { path: '/inventory/stocktake/edit/:id', component: StocktakeEdit },
      { path: '/inventory/stocktake/view/:id', component: StocktakeView },
      { path: '/inventory/balance', component: InventoryBalance },
      { path: '/inventory/cost-adjust', component: CostAdjust },
      { path: '/inventory/cost-adjust/add', component: CostAdjustAdd },
      { path: '/inventory/cost-adjust/edit/:id', component: CostAdjustEdit },
      { path: '/inventory/assemble', component: Assemble },
      { path: '/inventory/assemble/add', component: AssembleAdd },
      { path: '/inventory/assemble/edit/:id', component: AssembleEdit },
      { path: '/inventory/pnl', component: ProfitLoss },
      { path: '/inventory/pnl/add', component: ProfitLossAdd },
      { path: '/inventory/pnl/edit/:id', component: ProfitLossEdit },
      
      { path: '/purchase/in', component: PurchaseIn },
      { path: '/purchase/in/add', component: PurchaseInAdd },
      { path: '/purchase/in/edit/:id', component: PurchaseInEdit },
      { path: '/purchase/in/detail/:id', component: PurchaseInView },
      
      { path: '/finance/voucher', component: FinanceVoucher },
      { path: '/finance/voucher/add', component: FinanceVoucherAdd },
      { path: '/finance/voucher/edit/:id', component: FinanceVoucherEdit },
      { path: '/finance/voucher/view/:id', component: FinanceVoucherView },
      { path: '/finance/report', component: FinanceReport },
      { path: '/finance/receivable', component: FinanceReceivable },
      { path: '/finance/receivable/operation/:operationType/:operationCode/:arapId', component: FinanceArapOperation },
      { path: '/finance/receipt-record', component: FinanceReceiptRecord },
      { path: '/finance/transfer-off-record', component: FinanceTransferOffRecord },
      
      { path: '/ledger/subject-balance', component: LedgerSubjectBalance },
      { path: '/ledger/trial-balance', component: LedgerTrialBalance },
      
      { path: '/analysis/overview', component: AnalysisOverview },
      { path: '/analysis/income', component: AnalysisIncome },
      { path: '/analysis/expense', component: AnalysisExpense },
      
      { path: '/fixedAsset/card', component: FixedAssetCard },
      { path: '/fixedAsset/card/add', component: FixedAssetCardAdd },
      { path: '/fixedAsset/card/edit/:id', component: FixedAssetCardEdit },
      { path: '/fixedAsset/card/view/:id', component: FixedAssetCardView },
      { path: '/fixedAsset/purchase', component: FixedAssetPurchase },
      { path: '/fixedAsset/purchase/add', component: FixedAssetPurchaseAdd },
      { path: '/fixedAsset/purchase/edit/:id', component: FixedAssetPurchaseEdit },
      { path: '/fixedAsset/purchase/view/:id', component: FixedAssetPurchaseView },
      { path: '/fixedAsset/depreciation', component: FixedAssetDepreciation },
      { path: '/fixedAsset/disposal', component: FixedAssetDisposal },
      { path: '/fixedAsset/disposal/add', component: FixedAssetDisposalAdd },
      { path: '/fixedAsset/disposal/edit/:id', component: FixedAssetDisposalEdit },
      { path: '/fixedAsset/disposal/view/:id', component: FixedAssetDisposalView },
      { path: '/fixedAsset/ledger', component: FixedAssetLedger },
      { path: '/fixedAsset/summary-category', component: FixedAssetSummaryByCategory },
      { path: '/fixedAsset/summary-dept', component: FixedAssetSummaryByDept },
      
      { path: '/borrowLend', component: BorrowLend },
      { path: '/borrowLend/add', component: BorrowLendAdd },
      { path: '/borrowLend/edit/:id', component: BorrowLendEdit },
      { path: '/borrowLend/view/:id', component: BorrowLendView },
      
      { path: '/advance', component: Advance },
      { path: '/advance/add', component: AdvanceAdd },
      { path: '/advance/edit/:id', component: AdvanceEdit },
      { path: '/advance/view/:id', component: AdvanceView },
      
      { path: '/salary/accrued', component: SalaryAccrued },
      { path: '/salary/accrued/add', component: SalaryAccruedAdd },
      { path: '/salary/accrued/edit/:id', component: SalaryAccruedEdit },
      { path: '/salary/accrued/view/:id', component: SalaryAccruedView },
      
      { path: '/salary/issue', component: SalaryIssue },
      { path: '/salary/issue/add', component: SalaryIssueAdd },
      { path: '/salary/issue/edit/:id', component: SalaryIssueEdit },
      { path: '/salary/issue/view/:id', component: SalaryIssueView },

      { path: '/attachment', component: Attachment },
      { path: '/attachment/add', component: AttachmentAdd },
      { path: '/attachment/edit/:id', component: AttachmentEdit },
      { path: '/attachment/view/:id', component: AttachmentView }
    ]
  }
]

const router = createRouter({
  history: createWebHistory((import.meta.env.BASE_URL as string) || '/'),
  routes
})

router.beforeEach((to, _from, next) => {
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  
  try {
    const store = useAppStore()
    
    if (authRequired && !store.isLoggedIn) {
      next('/login')
    } else {
      next()
    }
  } catch {
    if (authRequired) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
