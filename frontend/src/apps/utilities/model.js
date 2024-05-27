const settingsValue = () => {
  return [
    { id: 1, name: "Master Blocks" },
    { id: 2, name: "Master Districts" },
    { id: 3, name: "Master Roles" },
    { id: 4, name: "Master States" },
    { id: 5, name: "Master States Tentative Proposal" },
    { id: 6, name: "Master Status" },
    { id: 7, name: "Master Year" },
    { id: 8, name: "Notifications Master" },
    { id: 9, name: "System Menus" },
    { id: 10, name: "System Permissions" },
    { id: 11, name: "Sub Component Master" },
    { id: 12, name: "Activities Master" },
    { id: 13, name: "Sub Activities Master" },
    { id: 14, name: "Group Master" },
    { id: 15, name: "Locations Group Mapping" },
    { id: 16, name: "Activities Group Mapping" },
    { id: 17, name: "Reports Master" },
    { id: 18, name: "Report Permissions" },
  ];
};
const approve = {
  state: "Approved by State",
  district: "Approved by District",
};

const activityLevel = () => {
  return [
    { id: 1, name: "Scheme" },
    { id: 2, name: "Major Component" },
    { id: 3, name: "Sub Component" },
    { id: 4, name: "Activity" },
    { id: 5, name: "Sub Activity" },
  ];
};

const activityRegionType = () => {
  return [
    { id: 1, name: "National" },
    { id: 2, name: "State" },
    { id: 3, name: "District" },
    { id: 4, name: "Block" },
    //    { id: 5, name: "School" }
  ];
};

const notificationType = () => {
  return [
    { value: "GLOBAL", name: "GLOBAL" },
    { value: "NATIONAL", name: "NATIONAL" },
    { value: "STATE", name: "STATE" },
    { value: "DISTRICT", name: "DISTRICT" },
  ];
};

const monthsOfYear = [
  { key: 1, value: "1", name: "April" },
  { key: 2, value: "2", name: "May" },
  { key: 3, value: "3", name: "June" },
  { key: 4, value: "4", name: "July" },
  { key: 5, value: "5", name: "August" },
  { key: 6, value: "6", name: "September" },
  { key: 7, value: "7", name: "October" },
  { key: 8, value: "8", name: "November" },
  { key: 9, value: "9", name: "December" },
  { key: 10, value: "10", name: "January" },
  { key: 11, value: "11", name: "February" },
  { key: 12, value: "12", name: "March" },
];

const planStatus = {
  0: "No Action",
  1: "No Action",
  2: "In progress at District",
  3: "Approved by District",
  4: "In progress at State",
  5: "Rejected at State",
  6: "Approved by State",
  7: "In progress at Center",
  8: "Rejected at Center",
  9: "Approved by Center",
  10: "Completed",
  11: "Rejected by District",
};

const scheme = {
    1: "Primary Education",
    2: "Secondary Education",
    3: "Teacher's Education",
}

const modulesOfMenu = [
    { name: "PLAN", value: "plan" },
    { name: "ALLOCATION", value: "allocation" },
    { name: "PROGRESS", value: "progress" }
]

const groupType = [
  { id: 1, name: "Activity" },
  { id: 2, name: "Location" }
]

const model={
    settingsValue,
    activityLevel,
    activityRegionType,
    notificationType,
    approve,
    monthsOfYear,
    planStatus,
    scheme,
    modulesOfMenu,
    groupType
}
export default model;