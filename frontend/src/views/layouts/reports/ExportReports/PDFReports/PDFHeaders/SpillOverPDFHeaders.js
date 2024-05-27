const headers = () => {
    return [
        [
          {
            name: "S.No.",
            rowSpan: 4,
          },
          {
            name: "Scheme",
            rowSpan: 4,
          },
          {
            name: "Major Component",
            rowSpan: 4,
          },
          {
            name: "Sub Component",
            rowSpan: 4,
          },
          {
            name: "Activity Master",
            rowSpan: 4,
          },
          {
            name: "Sub Activity",
            rowSpan: 4,
          },
          {
            name: "Fresh Approval 2023-2024",
            colSpan: 2,
          },
          {
            name: "Expenditure Against Fresh Approval 2023-2024",
            colSpan: 5,
          },
          {
            name: "Cumulative Spillover Approved As Per Minutes 2023-2024",
            colSpan: 2,
          },
          {
            name: "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
            colSpan: 5,
          },
        ],
        [
          {
            name: "Physical",
            rowSpan: 3,
          },
          {
            name: "Financial (In ₹ Lakh)",
            rowSpan: 3,
          },
          {
            name: "Anticipated 31st March 2024",
            colSpan: 5,
          },
          {
            name: "Physical",
            rowSpan: 3,
          },
          {
            name: "Financial (In ₹ Lakh)",
            rowSpan: 3,
          },
          {
            name: "Anticipated 31st March 2024",
            colSpan: 5,
          },
        ],
        [
          {
            name: "Physical",
            colSpan: 4,
          },
          {
            name: "Financial (In ₹ Lakh)",
            rowSpan: 2,
          },
          {
            name: "Physical",
            colSpan: 4,
          },
          {
            name: "Financial (In ₹ Lakh)",
            rowSpan: 2,
          },
        ],
        [
          {
            name: "In Progress",
          },
          {
            name: "Not Started",
          },
          {
            name: "Completed",
          },
          {
            name: "Total",
          },
          {
            name: "In Progress",
          },
          {
            name: "Not Started",
          },
          {
            name: "Completed",
          },
          {
            name: "Total",
          },
        ],
      ]
}

export default {
    headers
}