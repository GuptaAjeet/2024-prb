import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SLoader from "../apps/components/elements/suspense";
import Mastertype from "../views/admin/users/admin/master/Mastertype";
import Mastercommondata from "../views/admin/users/admin/master/Mastercommondata";
import Uploadfiles from "../views/admin/users/admin/master/Uploadfiles";
import Setting from "../views/admin/users/admin/setting";
import Category from "../views/admin/users/admin/master/contentManagement/Category";
import Subcategory from "../views/admin/users/admin/master/contentManagement/Subcategory";
import Content from "../views/admin/users/admin/master/contentManagement/Content";
import ReportMain from "../views/layouts/reports/ReportMain";
import Reports from "../views/layouts/reports/Reports";
import AnnualReports from "../views/layouts/reports/AnnualPlanReport";
import SpilloverReport from "../views/layouts/reports/SpilloverReport";
import CombinedReport from "../views/layouts/reports/CombinedReport";
import ProgressReportPrev from "../views/layouts/reports/ProgressReportPrev";
import CostingSheet from "../views/admin/users/admin/master/reports/CostingSheet";
import PageNotFound from "../views/web/errors/pageNotFound";
import AccessDenied from "../views/web/errors/accessDenied";
import Superuser from "../views/auth/password/superuser";
import MasterActivityDetails from "../views/admin/users/admin/master/MasterActivityDetails";
import AdditionalStateProposal from "../views/admin/users/admin/master/AdditionalStateProposal";
import { APP_ENVIRONMENT } from "../env";
import TicketSystem from "../views/layouts/prabandh/TicketSystem";
import TestReport from "../views/admin/users/admin/master/reports/TestReport";
import PPTData from "../views/layouts/reports/PPTData";
import RecommendationDetail from "../views/layouts/reports/RecommendationDetail";
import { Allocation, AllocationDashboard } from "../views/layouts/Allocation";
import Uploadadd from "../views/layouts/prabandh/uploadmodule/uploadadd";
import UploadedDocList from "../views/layouts/prabandh/uploadmodule/UploadedDocList";
import UploadedDocSpillover from "../views/layouts/prabandh/uploadmodule/UploadedDocSpillover";
import EditProAfterApproval from "../views/layouts/prabandh/EditProAfterApproval";
import ActivityAssign from "../views/layouts/prabandh/uploadmodule/activityassign/ActivityAssign";
import ProgressTrackinglevel from "../views/layouts/prabandh/progress/ProgressTrackinglevel";
// import Dashboard from "../views/layouts/Allocation/dashboard/Dashboard";
import Dashboard from "../views/layouts/prabandh/Udies/Dashboard";
import Spilloversecond from "../views/layouts/reports/Spilloversecond";
import EditBySchool from "../views/layouts/prabandh/progress/EditBySchool";
import EditByActivity from "../views/layouts/prabandh/progress/EditByActivity";
import AnnexureReport from "../views/layouts/reports/AnnexureReport";
import ProgressTrackingSchoolActivity from "../views/layouts/progress/Admin/ProgressTrackingSchoolActivity";
import ProgressTrackingSchoolActivityDistrict from "../views/layouts/progress/District/ProgressTrackingSchoolActivity";
import DraftPABminutesReport from "../views/layouts/reports/DraftPABminutesReport";
import ConfigureDietPlan from "../views/layouts/prabandh/diet/configureDietPlan";
import SNA from "../views/layouts/Fund/SNA";
import ApprovePlan from "../views/layouts/prabandh/diet/ApprovePlan";
import ServerPage from "../ServerPage";
import FundManagement from "../views/layouts/prabandh/diet/FundManagement";
import SelectProject from "../views/auth/admin/SelectProject";
import SchoolDashboard from "../views/layouts/pmshri/SchoolDashboard";
import PMShri from "../views/layouts/pmshri/PMShri";
import FillPlan from "../views/layouts/prabandh/progress/diet/FillPlan";
import ConfigPlan from "../views/layouts/prabandh/progress/diet/ConfigPlan";
import Hostel from "../views/layouts/prabandh/Hostel";
import DietStatus from "../views/layouts/prabandh/diet/DietStatus";
import DietStatusOfPreCredentials from "../views/layouts/prabandh/DietStatusOfPreCredentials";
import ConfigurePlan from "../views/layouts/prabandh/ConfigurePlan";

const SchoolProgress = lazy(() => import("../views/layouts/prabandh/progress/SchoolProgressReport"));
const Public = lazy(() => import("../apps/components/auth/web/public"));
const AdminGuard = lazy(() => import("../apps/components/auth/guards/admin"));
const WebGuard = lazy(() => import("../apps/components/auth/web/guard"));

/*********************************************************************************************************************/

const Admin = lazy(() => import("../views/admin"));

/*********************************************************************************************************************/

const Root = lazy(() => import("../views/web/home"));
const NodalOfficers = lazy(() => import("../views/web/contact-us/nodal-officers"));
const FAQs = lazy(() => import("../views/web/faqs"));
const PrivacyAndPolicy = lazy(() => import("../views/web/privacy-and-policy"));
const TermsAndConditions = lazy(() => import("../views/web/term-and-conditions"));
const Videos = lazy(() => import("../views/web/documents/videos"));
const AboutPrabandh = lazy(() => import("../views/web/about-us/objective"));
const AboutUs = lazy(() => import("../views/web/about-us/aboutUs"));
const AdminLogin = lazy(() => import("../views/auth/admin/login"));
const ForgotPassword = lazy(() => import("../views/auth/password/forgot-password"));
const ResetPassword = lazy(() => import("../views/auth/password/reset-password"));
// const Prabandh = lazy(() => import("../views/layouts/prabandh"));
const Simulate = lazy(() => import("../views/layouts/prabandh/Simulate"));
const Achievement = lazy(() => import("../views/web/achievment"));
const Download = lazy(() => import("../views/web/download"));
const Plan = lazy(() => import("../views/layouts/prabandh/plan"));
const List = lazy(() => import("../views/admin/users/admin/index"));
const ViewPlan = lazy(() => import("../views/layouts/prabandh/ViewPlan"));
const ExecutePlan = lazy(() => import("../views/layouts/prabandh/ExecutePlan"));
const FormInput = lazy(() => import("../views/layouts/prabandh/FormInput"));
const Report = lazy(() => import("../views/layouts/reports/Index"));
const ViewReport = lazy(() => import("../views/layouts/reports/viewReport"));
const CoordinatorActivityList = lazy(() => import("../views/layouts/prabandh/Coordinator/CoordinatorActivityList"));
const NationalProposalForm = lazy(() => import("../views/layouts/prabandh/Coordinator/NationalProposalForm"));
const ViewEditFormState = lazy(() => import("../views/layouts/prabandh/ViewEditFormState"));
const ViewEditFormActivity = lazy(() => import("../views/layouts/prabandh/ViewEditFormActivity"));
const Spillover = lazy(() => import("../views/layouts/prabandh/Spillover"));
const Expenditure = lazy(() => import("../views/layouts/prabandh/Expenditure"));
const DistrictWiseSchoolSelection = lazy(() => import("../views/layouts/prabandh/DistrictWiseSchoolSelection"));
const SchoolConfigurator = lazy(() => import("../views/layouts/prabandh/School/SchoolConfigurator"));
const AGGridSchoolConfigurator = lazy(() => import("../views/layouts/prabandh/School/AGGridSchoolConfigurator"));
const EnquireNow = lazy(() => import("../views/web/contact-us/enquire-now"));
const SiteMap = lazy(() => import("../views/web/site-map/enquire-now"));
const ChartReport = lazy(() => import("../views/layouts/prabandh/ChartReport"));
const SubmitPlan = lazy(() => import("../views/layouts/prabandh/submitPlan"));
const SubmitStatePlan = lazy(() => import("../views/layouts/prabandh/SubmitStatePlan"));
const SubmitPageNo = lazy(() => import("../views/layouts/prabandh/SubmitPageNo"));
const LoggedUsersList = lazy(() => import("../views/admin/users/admin/logged-users-list"));
const DownloadDocuments = lazy(() => import("../views/layouts/prabandh/DownloadDocuments"));
const DistrictReports = lazy(() => import("../views/layouts/prabandh/DistrictReports"));
const ProgressReport = lazy(() => import("../views/layouts/prabandh/ProgressReport"));
const StateReports = lazy(() => import("../views/layouts/reports/StateReport"));
const Recommendation = lazy(() => import("../views/layouts/reports/Recommendation"));
const FundRelease = lazy(() => import("../views/layouts/Fund/Release"));
const FundReceipt = lazy(() => import("../views/layouts/Fund/Receipt"));

/* const ProgressActivity = lazy(() => import("../views/layouts/progress/ProgressActivity")); */

const MasterSettings = lazy(() => import("../views/admin/users/admin/master/MasterSettings"));
const ProgressTrackingAdmin = lazy(() => import("../views/layouts/progress/Admin/ProgressTracking"));
const ProgressAdminDashboard = lazy(() => import("../views/layouts/progress/Admin/ProgressActivity"));
const ProgressTrackingState = lazy(() => import("../views/layouts/progress/State/ProgressTracking"));
const ProgressStateDashboard = lazy(() => import("../views/layouts/progress/State/ProgressActivity"));
const ProgressTrackingDistrict = lazy(() => import("../views/layouts/progress/District/ProgressTracking"));
const ProgressDistrictDashboard = lazy(() => import("../views/layouts/progress/District/ProgressActivity"));
const ProgressTrackingSchool = lazy(() => import("../views/layouts/progress/School/ProgressTracking"));
const ProgressSchoolDashboard = lazy(() => import("../views/layouts/progress/School/ProgressActivity"));
const ProgressMonth = lazy(() => import("../views/admin/masters/progress_month"));
const OperateUsers = lazy(() => import("../views/admin/users/admin/operate"));

/******************************************************************************************/

const Routers = () => (
  <BrowserRouter
    basename={`${APP_ENVIRONMENT === "testing" ? "/testing" : ""}`}
  >
    <Suspense fallback={<SLoader />}>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Public size={true}>
              <Root />
            </Public>
          }
        />
        <Route
          exact
          path="/static/media"
          element={
            <Public size={true}>
              <Root />
            </Public>
          }
        />

        <Route
          exact
          path="/err"
          element={
            <Public size={true}>
              <ServerPage />
            </Public>
          }
        />

        <Route
          exact
          path="/nodal-officers"
          element={
            <Public size={true}>
              <NodalOfficers />
            </Public>
          }
        />
        <Route
          exact
          path="/achievement-of-system"
          element={
            <Public size={true}>
              <Achievement />
            </Public>
          }
        />
        <Route
          exact
          path="/enquire-now"
          element={
            <Public size={true}>
              <EnquireNow />
            </Public>
          }
        />

        <Route
          exact
          path="/faqs"
          element={
            <Public size={true}>
              <FAQs />
            </Public>
          }
        />

        <Route
          exact
          path="/setting"
          element={
            <AdminGuard>
              <Setting />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/sitemap"
          element={
            <Public size={true}>
              <SiteMap />
            </Public>
          }
        />

        <Route
          exact
          path="/privacy-policy"
          element={
            <Public size={true}>
              <PrivacyAndPolicy />
            </Public>
          }
        />
        <Route
          exact
          path="/privacy-and-policy"
          element={
            <Public size={true}>
              <PrivacyAndPolicy />
            </Public>
          }
        />
        <Route
          exact
          path="/terms-and-conditions"
          element={
            <Public size={true}>
              <TermsAndConditions />
            </Public>
          }
        />

        <Route
          exact
          path="/videos"
          element={
            <Public size={true}>
              <Videos />
            </Public>
          }
        />
        <Route
          exact
          path="/about-prabandh"
          element={
            <Public size={true}>
              <AboutPrabandh />
            </Public>
          }
        />
        <Route
          exact
          path="/about-us"
          element={
            <Public size={true}>
              <AboutUs />
            </Public>
          }
        />

        <Route
          exact
          path="/admin-login"
          element={
            <WebGuard attr={{ title: "Login To", flag: "" }}>
              <AdminLogin />
            </WebGuard>
          }
        />

        <Route
          exact
          path="/project"
          element={
            <WebGuard>
              <SelectProject />
            </WebGuard>
          }
        />

        <Route
          exact
          path="/admin-forgot-password"
          element={
            <WebGuard attr={{ title: "", flag: "" }}>
              <ForgotPassword />
            </WebGuard>
          }
        />
        <Route
          exact
          path="/superuser"
          element={
            <WebGuard attr={{ title: "", flag: "" }}>
              <Superuser />
            </WebGuard>
          }
        />

        <Route
          exact
          path="/download"
          element={
            <Public size={true}>
              <Download />
            </Public>
          }
        />
        <Route
          exact
          path="/admin-reset-password/:parms"
          element={
            <WebGuard attr={{ title: "", flag: "" }}>
              <ResetPassword />
            </WebGuard>
          }
        />

        <Route
          exact
          path="/auth/admin"
          element={
            <AdminGuard>
              <Admin />
            </AdminGuard>
          }
        />
        {/* <Route
              exact
              path="/auth/prabandh"
              element={
                <AdminGuard>
                  <Prabandh />
                </AdminGuard>
              }
            /> */}
        <Route
          exact
          path="/auth/prabandh/simulate"
          element={
            <AdminGuard>
              <Simulate />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/step-1"
          element={
            <AdminGuard>
              <Plan />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/step-0"
          element={
            <AdminGuard>
              <ConfigurePlan />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/mastertype"
          element={
            <AdminGuard>
              <Mastertype />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/mastercommondata"
          element={
            <AdminGuard>
              <Mastercommondata />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/upload"
          element={
            <AdminGuard>
              <Uploadfiles />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/activity"
          element={
            <AdminGuard>
              <MasterActivityDetails />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/additional-state-proposal"
          element={
            <AdminGuard>
              <AdditionalStateProposal />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/category"
          element={
            <AdminGuard>
              <Category />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/subcategory"
          element={
            <AdminGuard>
              <Subcategory />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/content"
          element={
            <AdminGuard>
              <Content />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/reports"
          element={
            <AdminGuard>
              <ReportMain />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/master/report"
          element={
            <AdminGuard>
              <Reports />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/admin/list"
          element={
            <AdminGuard>
              <List />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/overview"
          element={
            <AdminGuard>
              <ViewPlan />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/input"
          element={
            <AdminGuard>
              <ExecutePlan />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/form"
          element={
            <AdminGuard>
              <FormInput />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/national/activity-list"
          element={
            <AdminGuard>
              <CoordinatorActivityList />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/national/proposal-form"
          element={
            <AdminGuard>
              <NationalProposalForm />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/state/edit"
          element={
            <AdminGuard>
              <ViewEditFormState />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/uploadadd"
          element={
            <AdminGuard>
              <Uploadadd />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan-asset-selection"
          element={
            <AdminGuard>
              <ActivityAssign />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/uploadeddoclist-plan"
          element={
            <AdminGuard>
              <UploadedDocList />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/uploadeddoclist-spillover"
          element={
            <AdminGuard>
              <UploadedDocSpillover />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/progress-tracking-level"
          element={
            <AdminGuard>
              <ProgressTrackinglevel />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/activity/edit"
          element={
            <AdminGuard>
              <ViewEditFormActivity />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/spillover"
          element={
            <AdminGuard>
              <Spillover />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/expenditure"
          element={
            <AdminGuard>
              <Expenditure />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/schools/selection"
          element={
            <AdminGuard>
              <DistrictWiseSchoolSelection />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/schools/configurator"
          element={
            <AdminGuard>
              <SchoolConfigurator />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/schools/configure"
          element={
            <AdminGuard>
              <AGGridSchoolConfigurator />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/report"
          element={
            <AdminGuard>
              <Report />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/report/matrixreport"
          element={
            <AdminGuard>
              <AnnualReports />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/report/annexurereport"
          element={
            <AdminGuard>
              <AnnexureReport />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/testreport"
          element={
            <AdminGuard>
              <TestReport />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/report/spilloverreport"
          element={
            <AdminGuard>
              <SpilloverReport />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/report/spilloversecondreport"
          element={
            <AdminGuard>
              <Spilloversecond />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/report/expenditure-report"
          element={
            <AdminGuard>
              <CombinedReport />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/progessprevreport"
          element={
            <AdminGuard>
              <ProgressReportPrev />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/costingreport"
          element={
            <AdminGuard>
              <CostingSheet />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/report/view"
          element={
            <AdminGuard>
              <ViewReport />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/chart-report"
          element={
            <AdminGuard>
              <ChartReport />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/submit"
          element={
            <AdminGuard>
              <SubmitPlan />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/submit-state-plan"
          element={
            <AdminGuard>
              <SubmitStatePlan />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/plan/submit-page-no"
          element={
            <AdminGuard>
              <SubmitPageNo />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/admin/logged-users-list"
          element={
            <AdminGuard>
              <LoggedUsersList />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/prabandh/ticket"
          element={
            <AdminGuard>
              <TicketSystem />
            </AdminGuard>
          }
        />

        {/* <Route
              exact
              path=""
              element={
                <PageNotFound />
              }
            /> */}
        <Route
          path="*"
          element={
            <AdminGuard>
              <PageNotFound />
            </AdminGuard>
          }
        />

        <Route exact path="/access-denied" element={<AccessDenied />} />

        <Route
          exact
          path="/auth/prabandh/master/download"
          element={
            <AdminGuard>
              <DownloadDocuments />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/prabandh/view-district-report"
          element={
            <AdminGuard>
              <DistrictReports />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/prabandh/view-progress-report"
          element={
            <AdminGuard>
              <ProgressReport />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/prabandh/report/view-state-report"
          element={
            <AdminGuard>
              <StateReports />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/prabandh/report/recommendation"
          element={
            <AdminGuard>
              <Recommendation />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/prabandh/report/ppt-report"
          element={
            <AdminGuard>
              <PPTData />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/prabandh/report/recommendation-detail"
          element={
            <AdminGuard>
              <RecommendationDetail />
            </AdminGuard>
          }
        />
        <Route
          exact
          path="/auth/prabandh/report/draft-pab-minutes-Report"
          element={
            <AdminGuard>
              <DraftPABminutesReport />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/allocation/admin"
          element={
            <AdminGuard>
              <AllocationDashboard />
            </AdminGuard>
          }
        />
        {/* <Route
          exact
          path="/auth/allocation/admin"
          element={
            <AdminGuard>
              <Dashboard />
            </AdminGuard>
          }
        /> */}
        <Route
          exact
          path="/auth/allocation/activity"
          element={
            <AdminGuard>
              <Allocation />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/allocation/fund-release"
          element={
            <AdminGuard>
              <FundRelease />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/allocation/fund-receipt"
          element={
            <AdminGuard>
              <FundReceipt />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/configure/month"
          element={
            <AdminGuard>
              <ProgressMonth />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/configure/diet-month"
          element={
            <AdminGuard>
              <ProgressMonth diet={true}/>
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/admin/tracking"
          element={
            <AdminGuard>
              <ProgressTrackingAdmin />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/admin"
          element={
            <AdminGuard>
              <ProgressAdminDashboard />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/state/tracking"
          element={
            <AdminGuard>
              <ProgressTrackingState />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/state"
          element={
            <AdminGuard>
              <ProgressStateDashboard />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/district/tracking"
          element={
            <AdminGuard>
              <ProgressTrackingDistrict />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/district"
          element={
            <AdminGuard>
              <ProgressDistrictDashboard />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/school/tracking"
          element={
            <AdminGuard>
              <ProgressTrackingSchool />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/school"
          element={
            <AdminGuard>
              <ProgressSchoolDashboard />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/prabandh/master/master-settings"
          element={
            <AdminGuard>
              <MasterSettings />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/prabandh/edit-proposal"
          element={
            <AdminGuard>
              <EditProAfterApproval />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/school"
          element={
            <AdminGuard>
              <Dashboard />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/admin/users"
          element={
            <AdminGuard>
              <OperateUsers />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/edit-by-school"
          element={
            <AdminGuard>
              <EditBySchool />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/edit-by-activity"
          element={
            <AdminGuard>
              <EditByActivity />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/admin/tracking-school-activity"
          element={
            <AdminGuard>
              <ProgressTrackingSchoolActivity />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/district/tracking-school-activity"
          element={
            <AdminGuard>
              <ProgressTrackingSchoolActivityDistrict />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/progress/fill-progress"
          element={
            <AdminGuard>
              <SchoolProgress />
            </AdminGuard>
          }
        />

        {/* DIET ROUTES  START*/}
        <Route
          exact
          path="/auth/diet/configure"
          element={
            <AdminGuard>
              <ConfigureDietPlan />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/diet/status"
          element={
            <AdminGuard>
              <DietStatus />
            </AdminGuard>
          }
        />
        {/* DIET ROUTES END */}

        <Route
          exact
          path="/auth/sna"
          element={
            <AdminGuard>
              <SNA />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/diet/approve-plan"
          element={
            <AdminGuard>
              <ApprovePlan />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/diet/fund-management"
          element={
            <AdminGuard>
              <FundManagement />
            </AdminGuard>
          }
        />

        {/* PMSHRI */}
        <Route
          exact
          path="/pmshri/auth/admin"
          element={
            <AdminGuard>
              <SchoolDashboard />
            </AdminGuard>
          }
        />

        {/* <Route path="/pmshri" component={PMShri} /> */}

        <Route
          exact
          path="/auth/diet-progress/config-plan"
          element={
            <AdminGuard>
              <ConfigPlan />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/diet-progress/fill-plan"
          element={
            <AdminGuard>
              <FillPlan />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/hostel"
          element={
            <AdminGuard>
              <Hostel />
            </AdminGuard>
          }
        />

        <Route
          exact
          path="/auth/diet/status-pre-credential"
          element={
            <AdminGuard>
              <DietStatusOfPreCredentials />
            </AdminGuard>
          }
        />

      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default Routers;