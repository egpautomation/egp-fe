// @ts-nocheck
import { createBrowserRouter } from "react-router-dom";

import App from "@/App";
import Root from "@/layouts/Root";
import Dashboard from "@/layouts/Dashboard";
import CreateCompanyRegistration from "@/pages/dashboardLayout/CreateCompanyRegistration";
import PrivateRoute from "@/shared/PrivateRoute/PrivateRoute";
import JobOrder from "@/pages/dashboardLayout/JobOrder/JobOrder";
import Registration from "@/pages/homeLayout/Registration";
import ForgotPassword from "@/pages/homeLayout/ForgotPassword";
import ResetPassword from "@/pages/homeLayout/ResetPassword";
import Login from "@/pages/homeLayout/Login";
import EgpPassEmail from "@/pages/dashboardLayout/EgpPassEmail";
import CreateEgpListedCompany from "@/components/dashboard/CreateEgpListedCompany";
import AllEgpListedCompany from "@/components/dashboard/AllEgpListedCompany";
import UpdateEgpListedCompany from "@/pages/dashboardLayout/UpdateEgpListedCompany";
import ViewEgpListedCompany from "@/pages/dashboardLayout/ViewEgpListedCompany";
import AtAGlance from "@/pages/dashboardLayout/AtAGlance";
import Users from "@/pages/dashboardLayout/Users";
import ViewUser from "@/pages/dashboardLayout/ViewUser";
import AdminRoute from "@/shared/AdminRoute/AdminRoute";
import CompanyMigrations from "@/pages/dashboardLayout/CompanyMigrations";
import EditCompanyMigration from "@/pages/dashboardLayout/EditCompanyMigration";
import CreateJobOrder from "@/pages/dashboardLayout/JobOrder/CreateJobOrder";
import UsersCompanyMigrations from "@/pages/dashboardLayout/UsersCompanyMigrations";
import UpdateCompanyMigration from "@/pages/dashboardLayout/UpdateCompanyMigration";
import CreateService from "@/pages/dashboardLayout/Service/CreateService";
import JobOrderCart from "@/pages/dashboardLayout/JobOrder/JobOrderCart";
import CreatePromoCode from "@/pages/dashboardLayout/PromoCode/CreatePromoCode";
import PromoCodes from "@/pages/dashboardLayout/PromoCode/PromoCodes";
import LiveTenders from "@/pages/dashboardLayout/Tenders/LiveTenders";
import CreateTender from "@/pages/dashboardLayout/Tenders/CreateTender";
import ViewTender from "@/pages/dashboardLayout/Tenders/ViewTender";
import MyJobOrder from "@/pages/dashboardLayout/JobOrder/MyJobOrder";
import LtmTenders from "@/pages/dashboardLayout/Tenders/LtmTenders";
import Payment from "@/pages/dashboardLayout/Payment/Payment";
import TenderDataEntry from "@/pages/dashboardLayout/TenderDataEntry/TenderDataEntry";
import ByPassReport from "@/pages/dashboardLayout/ByPassReport/ByPassReport";
import UpdateJobOrderStatus from "@/pages/dashboardLayout/JobOrder/UpdateJobOrderStatus";
import CreatePayment from "@/pages/dashboardLayout/Payment/CreatePayment";
import TestPrintPdf from "@/pages/dashboardLayout/Tenders/TestPrintPdf";
import LineOfCredit from "@/pages/dashboardLayout/BankService/LineOfCredit/LineOfCredit";
import BankDetails from "@/pages/dashboardLayout/BankService/BankDetails/BankDetails";
import CreateAccountHolderDetails from "@/pages/dashboardLayout/BankService/AccountHolderDetails/AccountHolderDetails";
import UserAllAccounts from "@/pages/dashboardLayout/BankService/AccountHolderDetails/UserAllAccounts";
import UpdateAccountHolderInformation from "@/pages/dashboardLayout/BankService/AccountHolderDetails/EditAccountDetails";
import UpdateTenderInformation from "@/pages/dashboardLayout/Tenders/UpdateTenderInformation";
import TenderIds from "@/pages/dashboardLayout/Tenders/TenderIds";
import NullCategoryTenders from "@/pages/dashboardLayout/Tenders/NullCategoryTenders";
import Departments from "@/pages/dashboardLayout/Departments/Departments";
import CreateDepartment from "@/pages/dashboardLayout/Departments/CreateDepartment";
import EditDepartmentInformation from "@/pages/dashboardLayout/Departments/EditDepartment";
import CreateTutorialCategory from "@/pages/dashboardLayout/Tutorials/CreateTutorialCategory";
import TutorialCategories from "@/pages/dashboardLayout/Tutorials/TutorialCategories";
import EditTutorialCategory from "@/pages/dashboardLayout/Tutorials/EditTutorialCategory";
import UpdateTenderDataEntry from "@/pages/dashboardLayout/TenderDataEntry/UpdateDataEntry";
import TTITenderDataEntry from "@/pages/dashboardLayout/TenderDataEntry/TTIDataEntry";
import OTMTenderIds from "@/pages/dashboardLayout/Tenders/OTMTenderIds";
import LTMTenderIds from "@/pages/dashboardLayout/Tenders/LTMTenderIds";
import OSTETMTenderIds from "@/pages/dashboardLayout/Tenders/OSTETMTenderIds";
import TenderCategoryFinder from "@/pages/dashboardLayout/Tenders/CategoryFinder";
import TenderCategories from "@/pages/dashboardLayout/TenderCategories/TenderCategories";
import CreateBulpJobOrder from "@/pages/dashboardLayout/JobOrder/CreateBulpJobOrder";
import TTIRoute from "@/shared/TTIRoute/TTIRoute";

import SkippedTenders from "@/pages/dashboardLayout/Tenders/SkippedTenders";
import CreateContactInfo from "@/pages/dashboardLayout/TenderPreparation/CreateContactInfo";
import CreateCompanyProfile from "@/pages/dashboardLayout/TenderPreparation/CreateCompnayProfile";
import CreateBOQ from "@/pages/dashboardLayout/TenderPreparation/CreateBOQ";
import PgTwoTowOtmGoodsDetails from "@/pages/dashboardLayout/pg22aOtmGoods/PgTwoTowOtmGoodsDetails";
import PgTwoTowOtmGoods from "@/pages/dashboardLayout/pg22aOtmGoods/pgTwoTowOtmGoods";
import Profile from "@/pages/dashboardLayout/Profile";
import SuccessTest from "@/pages/SuccessTest";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/registration",
        element: <Registration />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
      {
        path: "/public/create-tender",
        element: <CreateTender />,
      },
      {
        path: "/public/update-tender-secondary",
        element: <UpdateTenderInformation />,
      },

      {
        path: "/public/find-tender-subCategory/:id",
        element: (
          <TenderCategoryFinder />
        ),
      },
      {
        path: "/public/tender-tenderIds",
        element: <TenderIds />,
      },
      {
        path: "/public/tender-tenderIds-otm",
        element: <OTMTenderIds />,
      },
      {
        path: "/public/tender-tenderIds-ltm",
        element: <LTMTenderIds />,
      },
      {
        path: "/public/tender-tenderIds-ostetm",
        element: <OSTETMTenderIds />,
      },
      {
        path: "/public/by-pass-report",
        element: <ByPassReport />,
      },
      {
        path: "/public/job-order/update-status",
        element: (
          <UpdateJobOrderStatus />
        ),
      },
      {
        path: "/public/tenders/tender-categories",
        element: (
          <TenderCategories />
        ),
      },
      {
        path: "/public/tenders-preparation/create-contract-info",
        element: (
          <CreateContactInfo />
        ),
      },
      {
        path: "/public/tenders-preparation/create-contract-information",
        element: (
          <CreateCompanyProfile />
        ),
      },
      {
        path: "/public/tenders-preparation/create-BOQ",
        element: (
          <CreateBOQ />
        ),
      },
      {
        path: "/test-success",
        element: <SuccessTest />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: (
          <PrivateRoute>
            <AtAGlance />
          </PrivateRoute>
        ),
      },
      {
        path: "at-a-glance",
        element: (
          <PrivateRoute>
            <AtAGlance />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "create-company-registration",
        element: (
          <PrivateRoute>
            <CreateCompanyRegistration />
          </PrivateRoute>
        ),
      },
      {
        path: "company-registration",
        element: (
          <AdminRoute>
            <CompanyMigrations />
          </AdminRoute>
        ),
      },
      {
        path: "my-registered-company",
        element: (
          <PrivateRoute>
            <UsersCompanyMigrations />
          </PrivateRoute>
        ),
      },
      {
        path: "update-company-migration/:id",
        element: (
          <PrivateRoute>
            <UpdateCompanyMigration />
          </PrivateRoute>
        ),
      },
      {
        path: "edit-company-registration/:id",
        element: (
          <PrivateRoute>
            <EditCompanyMigration />
          </PrivateRoute>
        ),
      },
      {
        path: "create-job-order",
        element: (
          <PrivateRoute>
            <CreateJobOrder />
          </PrivateRoute>
        ),
      },
      {
        path: "create-job-order-bulk",
        element: (
          <PrivateRoute>
            <CreateBulpJobOrder />
          </PrivateRoute>
        ),
      },
      {
        path: "tenderdashboard",
        element: (
          <PrivateRoute>
            <PgTwoTowOtmGoods />
          </PrivateRoute>
        ),
      },
      {
        path: "tenderdashboard/:id",
        element: (
          <PrivateRoute>
            <PgTwoTowOtmGoodsDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "tender-preparation",
        element: (
          <PrivateRoute>
            <PgTwoTowOtmGoods />
          </PrivateRoute>
        ),
      },
      {
        path: "job-order/me",
        element: (
          <PrivateRoute>
            <MyJobOrder />
          </PrivateRoute>
        ),
      },
      {
        path: "job-order",
        element: (
          <AdminRoute>
            <JobOrder />
          </AdminRoute>
        ),
      },


      {
        path: "egp-pass-email",
        element: (
          <PrivateRoute>
            <EgpPassEmail />
          </PrivateRoute>
        ),
      },
      {
        path: "all-egp-listed-company",
        element: (
          <AdminRoute>
            <AllEgpListedCompany />
          </AdminRoute>
        ),
      },
      {
        path: "view-egp-listed-company/:id",
        element: (
          <AdminRoute>
            <ViewEgpListedCompany />
          </AdminRoute>
        ),
      },
      {
        path: "update-egp-listed-company/:id",
        element: (
          <AdminRoute>
            <UpdateEgpListedCompany />
          </AdminRoute>
        ),
      },
      {
        path: "create-egp-listed-company",
        element: (
          <AdminRoute>
            <CreateEgpListedCompany />
          </AdminRoute>
        ),
      },
      {
        path: "create-service",
        element: (
          <AdminRoute>
            <CreateService />
          </AdminRoute>
        ),
      },
      {
        path: "jobOrder-cart",
        element: (
          <PrivateRoute>
            <JobOrderCart />
          </PrivateRoute>
        ),
      },
      {
        path: "promo-codes",
        element: (
          <AdminRoute>
            <PromoCodes />
          </AdminRoute>
        ),
      },
      {
        path: "tenders/ltm-tenders",
        element: (
          <PrivateRoute>
            <LtmTenders />
          </PrivateRoute>
        ),
      },
      {
        path: "live-tenders",
        element: (
          <PrivateRoute>
            <LiveTenders />
          </PrivateRoute>
        ),
      },
      {
        path: "departments",
        element: (
          <AdminRoute>
            <Departments />
          </AdminRoute>
        ),
      },
      {
        path: "create-department",
        element: (
          <AdminRoute>
            <CreateDepartment />
          </AdminRoute>
        ),
      },
      {
        path: "edit-department/:id",
        element: (
          <AdminRoute>
            <EditDepartmentInformation />
          </AdminRoute>
        ),
      },
      {
        path: "update-secondary-tender",
        element: (
          <AdminRoute>
            <UpdateTenderInformation />
          </AdminRoute>
        ),
      },
      {
        path: "create-tender",
        element: (
          <PrivateRoute>
            <CreateTender />
          </PrivateRoute>
        ),
      },
      {
        path: "view-tender/:id",
        element: (
          <PrivateRoute>
            <ViewTender />
          </PrivateRoute>
        ),
      },
      {
        path: "create-promo-code",
        element: (
          <AdminRoute>
            <CreatePromoCode />
          </AdminRoute>
        ),
      },
      {
        path: "users",
        element: (
          <AdminRoute>
            <Users />
          </AdminRoute>
        ),
      },
      {
        path: "users/:userId",
        element: (
          <AdminRoute>
            <ViewUser />
          </AdminRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        ),
      },
      {
        path: "create-payment",
        element: (
          <AdminRoute>
            <CreatePayment />
          </AdminRoute>
        ),
      },
      {
        path: "upload-file",
        element: (
          <AdminRoute>
            <TestPrintPdf />
          </AdminRoute>
        ),
      },

      {
        path: "tender-data-entry",
        element: (
          <AdminRoute>
            <TenderDataEntry />
          </AdminRoute>
        ),
      },
      {
        path: "tender-data-entry-tti",
        element: (
          <TTIRoute>
            <TTITenderDataEntry />
          </TTIRoute>
        ),
      },
      {
        path: "update-tender-data-entry",
        element: (
          <AdminRoute>
            <UpdateTenderDataEntry />
          </AdminRoute>
        ),
      },
      {
        path: "tender-tenderIds",
        element: (
          <AdminRoute>
            <TenderIds />
          </AdminRoute>
        ),
      },
      {
        path: "tender-categoryNull",
        element: (
          <TTIRoute>
            <NullCategoryTenders />
          </TTIRoute>
        ),
      },
      {
        path: "tender-skipped",
        element: (
          <TTIRoute>
            <SkippedTenders />
          </TTIRoute>
        ),
      },

      {
        path: "bankService/line-of-credit",
        element: (
          <PrivateRoute>
            <LineOfCredit />
          </PrivateRoute>
        ),
      },
      {
        path: "bankService/bank-details",
        element: (
          <PrivateRoute>
            <BankDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "bankService/user-accounts",
        element: (
          <PrivateRoute>
            <UserAllAccounts />
          </PrivateRoute>
        ),
      },
      {
        // create
        path: "bankService/account-holder-details",
        element: (
          <PrivateRoute>
            <CreateAccountHolderDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "bankService/edit-account-details/:id",
        element: (
          <PrivateRoute>
            <UpdateAccountHolderInformation />
          </PrivateRoute>
        ),
      },
      {
        path: "tutorials/categories",
        element: (
          <AdminRoute>
            <TutorialCategories />
          </AdminRoute>
        ),
      },
      {
        path: "tutorials/create-category",
        element: (
          <AdminRoute>
            <CreateTutorialCategory />
          </AdminRoute>
        ),
      },
      {
        path: "tutorials/edit-category/:id",
        element: (
          <AdminRoute>
            <EditTutorialCategory />
          </AdminRoute>
        ),
      },
    ],
  },
]);

export default router;
