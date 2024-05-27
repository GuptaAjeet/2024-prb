const serialNumber = { srl: "S. No.", width: "5%", className: "text-left" };
const action = { action: "Action", width: "5%", className: "text-left" };

const country = () => {
  return [
    serialNumber,
    { country_name: "Country Code", width: "10%" },
    { country_name: "Country Name", width: "70%" },
    { country_status: "Status", width: "10%", className: "text-center" },
  ];
};

const state = () => {
  return [
    serialNumber,
    { state_id: "State ID", width: "10%" },
    { state_name: "State Name", width: "70%" },
    { state_status: "Status", width: "10%", className: "text-center" },
  ];
};

const prabandhData = () => {
  return [
    serialNumber,
    { sub_component: "Sub Component", width: "20%" },
    { activity_master_name: "Activity Name", width: "20%" },
    { activity_master_details: "Activity Details", width: "20%" },
    { norms: "Norms", width: "20%" },
    { criteria_for_appraisal: "Criteria For Appraisal", width: "20%" },
  ];
};

const district = () => {
  return [
    serialNumber,
    { district_name: "District Name", width: "40%" },
    { state_name: "State Name", width: "40%" },
    { district_status: "Status", width: "10%", className: "text-center" },
  ];
};

const block = () => {
  return [
    serialNumber,
    { block_code: "Block Code", width: "5%" },
    { block_name: "Block Name", width: "30%" },
    { district_name: "District Name", width: "25%" },
    { state_name: "State Name", width: "25%" },
    { block_status: "Status", width: "5%", className: "text-center" },
  ];
};

const reasonCloser = () => {
  return [
    serialNumber,
    { reasons_name: "Reason Name", width: "80%" },
    { reasons_status: "Status", width: "10%", className: "text-center" },
    // action,
  ];
};

const ClassCategories = () => {
  return [
    serialNumber,
    { class_category_name: "School Category Name", width: "80%" },
    { class_category_status: "Status", width: "10%", className: "text-center" },
    // action,
  ];
};

const SchoolTypes = () => {
  return [
    serialNumber,
    { school_type_name: "School Type Name", width: "80%" },
    { school_type_status: "Status", width: "10%", className: "text-center" },
    //action,
  ];
};

const SchoolManagements = () => {
  return [
    serialNumber,
    { school_management_name: "School Management Name", width: "80%" },
    {
      school_management_status: "Status",
      width: "10%",
      className: "text-center",
    },
    //action,
  ];
};

const SchoolCategories = () => {
  return [
    serialNumber,
    { school_category_name: "School Category Name", width: "80%" },
    {
      school_category_status: "Status",
      width: "10%",
      className: "text-center",
    },
    // action,
  ];
};

const gender = () => {
  return [
    serialNumber,
    { gender_name: "Gender Name", width: "80%" },
    { gender_status: "Status", width: "10%", className: "text-center" },
    //action,
  ];
};

const adminUser = () => {
  return [
    serialNumber,
    { user_name: "Name" },
    { user_mobile: "Mobile" },
    { user_email: "Email" },
    { user_role: "Role" },
    { district_name: "District Name" },
    { state_name: "State Name" },
    { user_status: "Status", width: "10%", className: "text-left" },
    action,
  ];
};

const mastertype = () => {
  return [
    serialNumber,
    { title: "Title" },
    { type_code: "Type Code" },
    // { 'user_email': '' },
    { description: "Description" },
    { status: "Master Status", width: "10%", className: "text-left" },
    action,
  ];
};

const mastercommondata = () => {
  return [
    serialNumber,
    { title: "Title" },
    { type_code: "Code" },
    { state_id: "State" },
    { district_id: "District" },
    { block_id: "Block" },
    { udise_code: "Udise Code" },
    { master_type: "Master Type" },
    { master_type_detail_id: "Attribute Type" },
    { description: "Description" },
    { status: "Master Status", width: "10%", className: "text-left" },
    action,
  ];
};

const masterUploadFileDumy = () => {
  return [
    serialNumber,
    // { file_type: "File Type" },
    { document_type: "Document Type" },
    { file_name: "File Name" },
    { description: "Description" },
    { action: "Action" },
  ];
};

const downloadDataColumn = () => {
  return [
    serialNumber,
    { file_name: "File Name" },
    { description: "Description" },
    { state_name: "State" },
    { action: "Action" },
  ];
};

const masterUploadFile = () => {
  return [
    serialNumber,
    // { file_type: "File Type" },
    { document_type: "Document Type" },
    { file_name: "File Name" },
    { state_name: "State Name" },
    { district_name: "District Name" },
    { description: "Description" },
    { action: "Action" },
  ];
};
// const handleCheckboxAll = (e, id, amid) => {
//   console.log("first", e, id, amid)
// }
const UploadAddDocument = () => {
  return [
    // { checkbox: <input className="form-check-input" style={{ border: "1px solid black" }} type="checkbox" value="" id="flexCheckChecked" onChange={(e) => handleCheckboxAll(e, row.id, row.activity_master_details_id)} /> },
    serialNumber,
    // { file_type: "File Type" },
    { udise_code: "Udise" },
    { school_name: "Name" },
    { district_name: "District" },
    // { activity_id: "Master Activity" },
    // // { activity_detail_id: "Activity Master Detail" },
    { physical_quantity: "Physical Quantity" },
    { financial_amount: "Financial Amount" },
    { action: "Action" },
  ];
};

const activityListforUpdateholding = () => {
  return [
    serialNumber,
    { major_component_name: "Major Component" },
    { sub_component_name: "Sub Component" },
    { activity_master_name: "Activity Master" },
    { activity_master_details_name: "Activity Master Detail" },
    { action: "Action" },
  ];
};

const progressTrackinglevel = () => {
  return [
    serialNumber,
    { sub_component_name: "Sub Component" },
    { activity_master_name: "Activity Master" },
    { activity_master_details_name: "Activity Master Detail" },
    { state: "State" },
    { district: "District" },
    // { block: "Block" },
    { school: "School" },
  ];
};

const dashboard = () => {
  return [
    serialNumber,
    { scheme_name: "Scheme" },
    { major_component_name: "Major Component" },
    {
      financial_amount_recuring: "Financial (Recurring)",
      className: "text-end",
    },
    {
      financial_amount_nonrecuring: "Financial (Non Recurring)",
      className: "text-end",
    },
  ];
};

const financialStatus = () => {
  return [
    serialNumber,
    { district_name: "District Name" },
    {
      financial_amount_elementary_recuring: "FA Elementary (R)",
      className: "text-end",
    },
    {
      financial_amount_elementary_nonrecuring: "FA Elementary (NR)",
      className: "text-end",
    },
    { financial_amount_elementary: "FA Elementary", className: "text-end" },
    {
      financial_amount_secondary_recuring: "FA Secondary (R)",
      className: "text-end",
    },
    {
      financial_amount_secondary_nonrecuring: "FA Secondary (NR)",
      className: "text-end",
    },
    { financial_amount_secondary: "FA Secondary", className: "text-end" },
    {
      financial_amount_teacher_recuring: "FA Teacher (R)",
      className: "text-end",
    },
    {
      financial_amount_teacher_nonrecuring: "FA Teacher (NR)",
      className: "text-end",
    },
    { financial_amount_teacher: "FA Teacher", className: "text-end" },
    { financial_amount: "Total FA", className: "text-end" },
    // {
    //   district_type: "Total",
    // },
  ];
};

const cmsCategory = () => {
  return [
    serialNumber,
    { title: "Title" },
    { img_icon: "Image/Icon" },
    { description: "Description" },
    { status: "Status" },
    { action: "Action" },
  ];
};

const qualification = () => {
  return [
    serialNumber,
    { qualification_name: "Qualification Name", width: "80%" },
    { qualification_status: "Status", width: "10%", className: "text-center" },
    //action,
  ];
};

const role = () => {
  return [
    serialNumber,
    { role_name: "Role Name", width: "80%" },
    { role_id: "Role ID", width: "8%", className: "text-right" },
    { role_status: "Status", width: "10%", className: "text-center" },
    //action,
  ];
};

const school = () => {
  return [
    serialNumber,
    { udise_code: "Udise Code", width: "10%" },
    { school_name: "School Name", width: "25%" },
    { school_state_name: "State Name", width: "15%" },
    { school_district_name: "District Name", width: "15%" },
    { school_block_name: "Block Name", width: "15%" },
    { school_mobile: "Mobile", width: "10%", className: "text-left" },
    action,
  ];
};

const webOnboardSchool = () => {
  return [
    serialNumber,
    { school_name: "School Name", width: "25%" },
    { school_state_name: "State Name", width: "15%" },
    { school_district_name: "District Name", width: "15%" },
    { school_block_name: "Block Name", width: "15%" },
    {
      ongoing_ativities: "Ongoing Services/Activities",
      width: "10%",
      className: "text-left",
    },
    {
      ongoing_assets: "Ongoing Assets/Material/Equipment",
      width: "10%",
      className: "text-left",
    },
    action,
  ];
};

const webAllSchool = () => {
  return [
    serialNumber,
    { school_name: "School Name", width: "20%" },
    { school_state_name: "State Name", width: "15%" },
    { school_district_name: "District Name", width: "15%" },
    { school_block_name: "Block Name", width: "15%" },
    {
      ongoing_ativities: "Ongoing Services/Activities",
      width: "10%",
      className: "text-left",
    },
    {
      ongoing_assets: "Ongoing Assets/Material/Equipment",
      width: "10%",
      className: "text-left",
    },
    { school_status: "Onboard Status", width: "5%", className: "text-left" },
    action,
  ];
};

const volunteers = () => {
  return [
    serialNumber,
    { user_name: "User Name", width: "20%" },
    { user_state_name: "State Name", width: "15%" },
    { user_district_name: "District Name", width: "15%" },
    { user_mobile: "Mobile", width: "10%", className: "text-left" },
    { user_type: "Volunteer Type", width: "15%" },
    action,
  ];
};

const activities = () => {
  return [
    serialNumber,
    { udise_code: "Udise Code", width: "10%" },
    { school_name: "School Name", width: "25%" },
    { school_state_name: "State Name", width: "20%" },
    { district_name: "District Name", width: "10%" },
    { cat_name: "Categoery Name", width: "15%" },
    { sub_cat_name: "Activity Name", width: "25%" },
    action,
  ];
};

const activitiesCol = () => {
  return [
    serialNumber,
    { cat_name: "Categoery Name", width: "20%" },
    { sub_cat_name: "Title", width: "25%" },
    { start_date: "Start Date", width: "10%" },
    { last_date: "Last receiving date", width: "10%" },
    { volunteer_request: "Volunteer Request", width: "10%" },
    action,
  ];
};

const volunteerAssetsParticipationCol = () => {
  return [
    serialNumber,
    { cat_name: "Assets / Material / Equipment Category", width: "15%" },
    { asset_name: "Assets / Material / Equipment needed", width: "25%" },
    { school_name: "School Name", width: "25%" },
    { state_name: "State / Autonomous Bodies", width: "25%" },
    { district_name: "District / Region", width: "15%" },
    { asset_qty: "Quantity Required", width: "15%" },
    // {'start_date':'Start Date','width':'15%' },
    { date_of_application: "Application last date", width: "20%" },
    //action,
  ];
};

const volunteerParticipationCol = () => {
  return [
    serialNumber,
    { activty_name: "Title", width: "15%" },
    { school_name: "School Name", width: "25%" },
    { state_name: "State / Autonomous Bodies", width: "25%" },
    { district_name: "District / Region", width: "15%" },
    { start_date: "Start Date", width: "15%" },
    { date_of_application: "Application last date", width: "20%" },
    { volunteer_interest: "Interested Volunteers    ", width: "10%" },
    //action,
  ];
};

const volunteerCol = () => {
  return [
    serialNumber,
    { service_name: "Title", width: "20%" },
    { school_name: "School Name", width: "25%" },
    { date_of_application: "Application Date", width: "10%" },
    { start_date: "Start Date", width: "10%" },
    { my_status: "My Status", width: "10%" },
    action,
  ];
};

const volunteerAssetCol = () => {
  return [
    serialNumber,
    { activty_name: "Title", width: "20%" },
    { asste_need: "Quantity Offered", width: "10%" },
    { school_name: "School Name", width: "25%" },
    { start_date: "Expected Date", width: "15%" },
    { my_status: "Application Status", width: "10%" },
    action,
  ];
};

const contributionCol = () => {
  return [
    serialNumber,
    { cat_name: "Categoery Name", width: "25%" },
    { sub_cat_name: "Title", width: "25%" },
    { assets: "Assets Qty", width: "10%" },
    { expected_date: "Expected date", width: "10%" },
    { last_application_date: "Last application date", width: "10%" },
    { volunteer_request: "Volunteer Request", width: "10%" },
    action,
  ];
};

const volunteersCol = () => {
  return [
    serialNumber,
    { name: " Volunteer Name", width: "15%" },
    { email: "Email", width: "15%" },
    { mobile: "Mobile", width: "10%" },
    { status: "Status", width: "10%" },
    // {'invite':'Invite Date','width':'15%' },
    { quantity_offered: "Offered Qty", width: "15%" },
    { quantity_approve: "Approved Qty", width: "15%" },
    { quantity_recived: "Received Qty", width: "18%" },
    { balance_qty: "Balance", width: "15%" },
    { action: "", width: "15%" },
    //action,
  ];
};

const popupVolunteersCol = () => {
  return [
    { name: " Volunteer Name", width: "15%" },
    { email: "Email", width: "20%" },
    { mobile: "Mobile", width: "10%" },
    { state_name: "State Name", width: "10%" },
    { district_name: "District Name", width: "10%" },
    { status: "Status", width: "10%" },
    { invite_date: "Invite Date", width: "10%" },
    { complete_status: "Completion status", width: "10%" },
    { action: "Action", width: "15%", className: "text-left" },
  ];
};

const preferenceCol = () => {
  return [
    serialNumber,
    { contact: " Contact Details", width: "15%" },
    // {'email':'Email','width':'20%' },
    // {'mobile':'Mobile','width':'20%' },
    // {'state_name':'State Name','width':'20%' },
    // {'district_name':'District Name','width':'25%' },
    { interest: "Interested Activities", width: "25%" },
    { assetinterest: "Interested Contributions", width: "25%" },
  ];
};

const status = () => {
  return [
    serialNumber,
    { status_name: "Status Name", width: "80%" },
    { status_id: "Status ID", width: "8%", className: "text-right" },
    { status_order: "Status", width: "10%", className: "text-left" },
    //action,
  ];
};

const volunteerType = () => {
  return [
    serialNumber,
    { volunteer_type_name: "Volunteer Type Name", width: "80%" },
    { status_order: "Status", width: "10%", className: "text-left" },
    action,
  ];
};

const activityCategory = () => {
  return [
    serialNumber,
    { activity_category_name: "Activity Category Name", width: "80%" },
    {
      activity_category_status: "Status",
      width: "10%",
      className: "text-left",
    },
    //action,
  ];
};

const assetCategory = () => {
  return [
    serialNumber,
    { asset_category_name: "Asset Category Name", width: "80%" },
    { asset_category_status: "Status", width: "10%", className: "text-left" },
    //action,
  ];
};

const subActivityCategory = () => {
  return [
    serialNumber,
    { activity_sub_category_name: "Activity Name", width: "40%" },
    { activity_category_name: "Sub Activity Name", width: "40%" },
    {
      activity_sub_category_status: "Status",
      width: "10%",
      className: "text-left",
    },
    //action,
  ];
};

const subAssetCategory = () => {
  return [
    serialNumber,
    { asset_sub_category_name: "Sub Asset Name", width: "40%" },
    { asset_category_name: "Asset Name", width: "40%" },
    {
      asset_sub_category_status: "Status",
      width: "10%",
      className: "text-left",
    },
    //action,
  ];
};

const userLogs = () => {
  return [
    serialNumber,
    { user_name: "Name" },
    { login_status: "Status", width: "10%" },
    { user_login: "Login" },
    { user_logout: "Logout" },
    { user_platform: "Platform" },
    { user_os: "OS" },
    { user_ip: "IP Address" },
    { user_date: "Date", width: "10%" },
  ];
};

const viewPlan = () => {
  return [
    serialNumber,
    { scheme_name: "Scheme" },
    { major_component_name: "Major Component", width: "5%" },
    { sub_component_name: "Sub Component" },
    { activity_master_name: "Activity Master" },
    { activity_master_details_name: "Sub Activity" },
  ];
};

const schoolsList = () => {
  return [
    serialNumber,
    { udise_sch_code: "UDISE", width: "5%" },
    { school_name: "SCHOOL NAME" },
    { action: "Action", width: "15%" },
  ];
};

const schoolsConfiguratorList = () => {
  return [
    serialNumber,
    { udise_sch_code: "UDISE", width: "5%" },
    { school_name: "SCHOOL" },
    { state: "STATE" },
    { district: "DISTRICT" },
    { summary: "SUMMARY" },
    { action: "ACTION", width: "15%" },
  ];
};

const loggedUsers = () => {
  return [
    serialNumber,
    { user_name: "Name" },
    { user_mobile: "Mobile" },
    { user_email: "Email" },
    { user_role: "Role" },
    { designation: "Designation" },
    { district_name: "District Name" },
    { state_name: "State Name" },
    { logged_in: "Login Time" },
  ];
};

const downloadDocuments = () => {
  return [
    serialNumber,
    { file_name: "File Name" },
    { description: "File Description" },
    { action: "Action" },
  ];
};

const budgetAllotment = () => {
  return [
    serialNumber,
    { allocated_amount: "Sanction Number", width: "10%" },
    { installment_number: "Sanction Order Date", width: "10%" },
    { upload_documents: "Sanction Documents", width: "4%" },
    { installment_number: "Installment Number", width: "5%" },
    { installment_type: "Installment Type", width: "5%" },
    // { date_of_allocation: "Date Of Release", width: "16%" },
    { allocated_amount: "Released Amount (₹ in Lakh)", width: "10%" },
    { remarks: "Remarks", width: "20%" },
    { action: "Action", width: "12%", className: "text-left" },
  ];
};

const approvedBudget = () => {
  return [
    {
      total_approved_budget: "Approved Fund (₹ in Lakh)",
      width: "40%",
      className: "border",
    },
    {
      central_share: "Central Share (₹ in Lakh)",
      width: "30%",
      className: "border",
    },
    {
      state_share: "State Share (₹ in Lakh)",
      width: "30%",
      className: "border",
    },
  ];
};

const allotedBudget = () => {
  return [
    serialNumber,
    { installment_number: "Sanction Number", width: "10%" },
    { installment_number: "Sanction Order Date", width: "10%" },
    { installment_number: "Sanction Documents", width: "10%" },
    { installment_number: "Installment Number", width: "5%" },
    { installment_type: "Installment Type", width: "5%" },
    { received_amount: "Received Amount (₹ in Lakh)", width: "15%" },

    // { installment_date: "Date Of Release", width: "15%" },
    // { status: "Status", width: "10%" },
    // action
  ];
};

const receivedAllotment = () => {
  return [
    serialNumber,
    { installment_number: "Sanction Number", width: "10%" },
    { installment_number: "Sanction Order Date", width: "10%" },
    { upload_documents: "Sanction Documents", width: "5%" },
    { installment_number: "Installment Number", width: "5%" },
    { installment_type: "Installment Type", width: "5%" },
    // { date_of_allocation: "Date Of Release", width: "10%" },
    { allocated_amount: "Released Amount (₹ in Lakh)", width: "10%" },
    { remarks: "Remarks", width: "20%" },
    { action: "Action", width: "10%", className: "text-left" },
  ];
};

const progressTracking = () => {
  return [
    serialNumber,
    { target_value: "MONTH", width: "5%" },
    { yet_to_start: "YET TO START" },
    { in_progress: "IN PROGRESS" },
    { completed: "COMPLETED" },
    { financial: "FINANCIAL" },
    { action: "ACTION", width: "15%" },
  ];
};

const statesTentativeProposed = () => {
  return [
    serialNumber,
    { state_id: "State ID", width: "8%" },
    { state_name: "State Name", width: "40%" },
    {
      udise_state_code: "UDISE State Code",
      width: "12%",
      className: "text-right",
    },
    {
      tentative_central_share: "Tentative Central Share",
      width: "12%",
      className: "text-right",
    },
    {
      tentative_state_share: "Tentative State Share",
      width: "12%",
      className: "text-right",
    },
    {
      tentative_total_estimates: "Tentative Total Estimates",
      width: "12%",
      className: "text-right",
    },
    {
      center_share_percent: "Center Share Percentage",
      width: "15%",
      className: "text-right",
    },
    action,
  ];
};

const notificationsMaster = () => {
  return [
    serialNumber,
    { message_id: "Message ID", width: "6%" },
    { message: "Message", width: "70%" },
    { type: "Type", width: "7%", className: "text-left" },
    { status: "Status", width: "7%", className: "text-left" },
    action,
  ];
};

const subComponentMaster = () => {
  return [
    serialNumber,
    { message_id: "Sub Component ID", width: "10%" },
    { message: "Sub Component Title", width: "80%" },
    action,
  ];
};

const systemPermissionsMaster = () => {
  return [
    serialNumber,
    { message_id: "Role Name", width: "40%" },
    // { message: "Menu Name", width: "40%" },
    { action: "Action", width: "10%" },
  ];
};

const masterStateTentativeProposal = () => {
  return [
    serialNumber,
    { state_id: "State ID" },
    { state_name: "State Name" },
    { center_share_percent: "Center Share Percent" },
    { center_share_percent: "State Share Percent" },
    { tentative_central_share: "Tentative Central Share" },
    { tentative_state_share: "Tentative State Share" },
    { tentative_total_estimates: "Tentative Total Estimates" },
    // action,
  ];
};

const masterYear = () => {
  return [
    serialNumber,
    { year_name: "Year Name" },
    { year_code: "Year Code" },
    { status: "Status" },
    //  action,
  ];
};

const masterMenus = () => {
  return [
    serialNumber,
    { name: "Name" },
    { id: "Menu Code" },
    { order_no: "Order No." },
    { url: "Menu Url" },
    { active_url: "Active Url" },
    { menu_img: "Menu Image" },
    action,
  ];
};

const activityMaster = () => {
  return [
    serialNumber,
    { act_id: "Activity Id", width: "10%" },
    { name: "Activity Title" },
    action,
  ];
};

const approvedStateBudget = () => {
  return [
    { total_approved_budget: "Total Received Fund (State + Center)", width: "40%", className: "border" },
    { alloted: "Alloted To Districts", width: "30%", className: "border" },
    { difference: "Difference", width: "30%", className: "border" },
  ];
};

const subActivityMaster = () => {
  return [
    serialNumber,
    { scheme_id: "Scheme ID", width: "5%" },
    { major_cmp_id: "Major Component ID", width: "10%" },
    { sub_cmp_id: "Sub Component ID", width: "10%" },
    { act_id: "Activity ID", width: "6%" },
    { sub_act_id: "Sub Activity ID", width: "8%" },
    { name: "Sub Activity Title", width: "56%" },
    action,
  ];
};

const groupActivityMapping = () => {
  return [
    serialNumber,
  //  { mapping_id: "Mapping ID", width: "10%" },
    { group_id: "Group Code", width: "10%" },
    { group_name: "Group Name", width: "44%" },
    // { scheme_id: "Scheme ID", width: "10%" },
    // { major_cmp_id: "Major Component ID", width: "10%" },
    // { sub_cmp_id: "Sub Component ID", width: "10%" },
    // { act_master_id: "Activity Master ID", width: "10%" },
    // { act_details_id: "Sub Activity ID", width: "10%" },
    { act_level_id: "Activity Level", width: "15%" },
    { region_type_id: "Region Type", width: "15%" },
    { action: "Action", width: "11%" },
  ];
};

const masterGroup = () => {
  return [
    serialNumber,
    { group_code: "Group Code" },
    { group_name: "Group Name" },
    { group_type: "Group Type" },
    { group_description: "Group Description" },
  ];
};

const groupActivityMappingDetails = () => {
  return [
    serialNumber,
    { group_name: "Group Name", width: "10%" },
    { group_region: "Group Region", width: "10%" },
    { group_level: "Group Level", width: "10%" },
    { scheme: "Scheme", width: "10%" },
    { major_component: "Major Component", width: "10%" },
    { sub_component: "Sub Component", width: "10%" },
    { activity_master: "Activity", width: "10%" },
    { activity_master_details: "Sub Activity", width: "14%" },
    { action: "Action", width: "11%" },
  ];
};

const groupActivityMappingView = () => {
  return [
    serialNumber,
    // { group_level: "Group Level", width: "10%" },
    { scheme: "Scheme", width: "10%" },
    { major_component: "Major Component", width: "10%" },
    { sub_component: "Sub Component", width: "10%" },
    { activity_master: "Activity", width: "10%" },
    { activity_master_details: "Sub Activity", width: "14%" },
  ];
};

const schoolDashboardTableView = () => {
  return [
    { field: "index", rowSpan: false },
    { field: "major_component_name", rowSpan: true },
    { field: "sub_component_name", rowSpan: true },
    { field: "activity_master_name", rowSpan: true },
    { field: "activity_master_details_name", rowSpan: false },
    { field: "allocated_physical_quantity", rowSpan: false, type: "number" },
    { field: "allocated_financial_amount", rowSpan: false, type: "number" },
    { field: "physical_progress_yet_to_start", rowSpan: false, edit: true, type: "number" },
    { field: "physical_progress_in_progress", rowSpan: false, edit: true, type: "number" },
    { field: "physical_progress_completed", rowSpan: false, edit: true, type: "number" },
    { field: "financial_expenditure", rowSpan: false, edit: true, type: "number" },
  ]
}

const schoolProgressData = (schemeId) => {
  const commonFields = [
    { field: "index", rowSpan: false },
    { field: "major_component_name", rowSpan: true },
    { field: "sub_component_name", rowSpan: true },
    { field: "activity_master_name", rowSpan: true },
    { field: "activity_master_details_name", rowSpan: false },
    { field: "allocated_physical_quantity", rowSpan: false },
    { field: "allocated_financial_amount", rowSpan: false },
    { field: "physical_progress_yet_to_start", rowSpan: false, edit: true, type: "number" },
    { field: "physical_progress_in_progress", rowSpan: false, edit: true, type: "number" },
    { field: "physical_progress_completed", rowSpan: false, edit: true, type: "number" },
  ];

  if (schemeId) {
    return [...commonFields];
  } else {
    return [
      ...commonFields,
      {
        field: "financial_expenditure",
        rowSpan: false,
        edit: true,
        type: "amount",
      },
    ];
  }
};

const schoolProgressParentHeader = (udise) => {
  const commonHeaders = [
    { name: "S.No.", rowSpan: 2, colSpan: 1 },
    { name: "Major Comp", rowSpan: 2, colSpan: 1 },
    { name: "Sub Comp", rowSpan: 2, colSpan: 1 },
    { name: "Activity", rowSpan: 2, colSpan: 1 },
    { name: "Sub Activity", rowSpan: 2, colSpan: 1 },
    { name: "Allotted", rowSpan: 1, colSpan: 2, className: "text-center" },
    { name: "Not Started", rowSpan: 2, colSpan: 1 },
    { name: "Inprogress", rowSpan: 2, colSpan: 1 },
    { name: "Completed", rowSpan: 2, colSpan: 1 },
  ];

  if (udise) {
    return [...commonHeaders];
  } else {
    return [...commonHeaders, { name: "Expenditure", rowSpan: 2, colSpan: 1 }];
  }
};

const schoolProgressChildHeader = () => {
  return [
    { name: "Physical", rowSpan: 1, colSpan: 1 },
    { name: "Financial", rowSpan: 1, colSpan: 1 },
  ];
};

const allocationDashboardHeader = () => {
  return [
    { name: "S.No.", rowSpan: 1, colSpan: 1 },
    { name: "Major Comp", rowSpan: 1, colSpan: 1 },
    { name: "Sub Comp", rowSpan: 1, colSpan: 1 },
    { name: "Activity", rowSpan: 1, colSpan: 1 },
    { name: "Sub Activity", rowSpan: 1, colSpan: 1 },
    { name: "Recommended Status", rowSpan: 1, colSpan: 1 },
    { name: "Allocation Status", rowSpan: 1, colSpan: 1 },
  ];
}

const allocationDashboardTableView = () => {
  return [
    { field: "index", rowSpan: false },
    { field: "major_component_name", rowSpan: true },
    { field: "sub_component_name", rowSpan: true },
    { field: "activity_master_name", rowSpan: true },
    { field: "activity_master_details_name", rowSpan: false },
    { field: "recomend_status", rowSpan: false },
    { field: "alloc_status", rowSpan: false }
  ]
}
// FOR DIET USER  
const dietConfigurePlan = () => {
  return [
    serialNumber,
    { sub_component_name: "Sub Component" },
    { activity_master_name: "Activity Master" },
    { activity_master_details_name: "Activity Master Detail" },
    { quantity: "Physical" },
    { unit_cost: "Unit Cost" },
    { financial_quantity: "Financial" },
    { action: "Action" },
  ];
};

const locationGroupMapping = () => {
  return [
    serialNumber,
    { group_id: "Group Code", width: "15%" },
    { group_name: "Group Name", width: "50%" },
    //  { location_name: "Location Name", width: "30%" },
    { region_type_id: "Region Type", width: "20%" },
    { action: "Action", width: "10%" },
  ];
};

const locationGroupMappingDetails = () => {
  return [
    serialNumber,
    { group_name: "Group Name", width: "15%" },
    { group_region: "Region Type", width: "15%" },
    { state_name: "State Name", width: "15%" },
    { district_name: "District Name", width: "15%" },
    { block_name: "Block Name", width: "20%" },
    { action: "Action", width: "15%" },
  ];
};

const reportMaster = () => {
  return [
    serialNumber,
    { report_heading: "Report Name" },
    { report_sub_heading: "Report Details" },
    { report_url: "Report Page Url" },
    { id: "Report ID" },
    { action: "Action" },
  ];
};

const reportPermissionsMaster = () => {
  return [
    serialNumber,
    { user_role: "Role Name", width: "40%" },
    { report_name: "Report Name", width: "40%" },
    { action: "Action", width: "10%" },
  ];
};

const columns = {
  dashboard,
  contributionCol,
  preferenceCol,
  volunteersCol,
  activitiesCol,
  activities,
  adminUser,
  mastertype,
  mastercommondata,
  country,
  state,
  district,
  block,
  reasonCloser,
  gender,
  qualification,
  role,
  school,
  status,
  volunteerType,
  activityCategory,
  assetCategory,
  subActivityCategory,
  subAssetCategory,
  ClassCategories,
  SchoolTypes,
  SchoolManagements,
  SchoolCategories,
  volunteers,
  userLogs,
  popupVolunteersCol,
  volunteerCol,
  volunteerAssetCol,
  volunteerParticipationCol,
  volunteerAssetsParticipationCol,
  webOnboardSchool,
  webAllSchool,
  prabandhData,
  viewPlan,
  schoolsList,
  masterUploadFile,
  cmsCategory,
  schoolsConfiguratorList,
  masterUploadFileDumy,
  loggedUsers,
  downloadDocuments,
  financialStatus,
  downloadDataColumn,
  budgetAllotment,
  approvedBudget,
  allotedBudget,
  receivedAllotment,
  UploadAddDocument,
  progressTracking,
  statesTentativeProposed,
  notificationsMaster,
  subComponentMaster,
  systemPermissionsMaster,
  masterStateTentativeProposal,
  masterYear,
  masterMenus,
  activityMaster,
  approvedStateBudget,
  subActivityMaster,
  activityListforUpdateholding,
  groupActivityMapping,
  masterGroup,
  progressTrackinglevel,
  groupActivityMappingDetails,
  groupActivityMappingView,
  schoolDashboardTableView,
  schoolProgressData,
  schoolProgressParentHeader,
  schoolProgressChildHeader,
  allocationDashboardTableView,
  allocationDashboardHeader,
  dietConfigurePlan,
  locationGroupMapping,
  locationGroupMappingDetails,
  reportMaster,
  reportPermissionsMaster
};

export default columns;
