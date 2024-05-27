const spillOverExcelHeadersArray = () => {
    return [
        [
          {
            name: "S.No.",
            rowSpan: 4,
            startCell: "A1",
            endCell: "A4",
          },
          {
            name: "Scheme",
            rowSpan: 4,
            startCell: "B1",
            endCell: "B4",
          },
          {
            name: "Major Component",
            rowSpan: 4,
            startCell: "C1",
            endCell: "C4",
          },
          {
            name: "Sub Component",
            rowSpan: 4,
            startCell: "D1",
            endCell: "D4",
          },
          {
            name: "Activity Master",
            rowSpan: 4,
            startCell: "E1",
            endCell: "E4",
          },
          {
            name: "Sub Activity",
            rowSpan: 4,
            startCell: "F1",
            endCell: "F4",
          },
          {
            name: "Fresh Approval 2023-2024",
            colSpan: true,
            startCell: "G1",
            endCell: "H1",
          },
          {
            name: "Fresh Approval 2023-2024",
          },
          {
            name: "Expenditure Against Fresh Approval 2023-2024",
            colSpan: true,
            startCell: "I1",
            endCell: "M1",
          },
          {
            name: "Expenditure Against Fresh Approval 2023-2024",
          },
          {
            name: "Expenditure Against Fresh Approval 2023-2024",
          },
          {
            name: "Expenditure Against Fresh Approval 2023-2024",
          },
          {
            name: "Expenditure Against Fresh Approval 2023-2024",
          },
          {
            name: "Cumulative Spillover Approved As Per Minutes 2023-2024",
            colSpan: true,
            startCell: "N1",
            endCell: "O1",
          },
          {
            name: "Cumulative Spillover Approved As Per Minutes 2023-2024",
          },
          {
            name: "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
            colSpan: true,
            startCell: "P1",
            endCell: "T1",
          },
          {
            name: "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
          },
          {
            name: "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
          },
          {
            name: "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
          },
          {
            name: "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
          },
        ],
        [
          {
            name: "S.No.",
          },
          {
            name: "Scheme",
          },
          {
            name: "Major Component",
          },
          {
            name: "Sub Component",
          },
          {
            name: "Activity Master",
          },
          {
            name: "Sub Activity",
          },
          {
            name: "Physical",
            rowSpan: 3,
            startCell: "G2",
            endCell: "G4",
          },
          {
            name: "Financial (In ₹ Lakh)",
            rowSpan: 3,
            startCell: "H2",
            endCell: "H4",
          },
          {
            name: "Anticipated 31st March 2024",
            colSpan: true,
            startCell: "I2",
            endCell: "M2",
          },
          {
            name: "Anticipated 31st March 2024",
          },
          {
            name: "Anticipated 31st March 2024",
          },
          {
            name: "Anticipated 31st March 2024",
          },
          {
            name: "Anticipated 31st March 2024",
          },
          {
            name: "Physical",
            rowSpan: 3,
            startCell: "N2",
            endCell: "N4",
          },
          {
            name: "Financial (In ₹ Lakh)",
            rowSpan: 3,
            startCell: "O2",
            endCell: "O4",
          },
          {
            name: "Anticipated 31st March 2024",
            colSpan: true,
            startCell: "P2",
            endCell: "T2",
          },
          {
            name: "Anticipated 31st March 2024",
          },
          {
            name: "Anticipated 31st March 2024",
          },
          {
            name: "Anticipated 31st March 2024",
          },
          {
            name: "Anticipated 31st March 2024",
          },
        ],
        [
          {
            name: "S.No.",
          },
          {
            name: "Scheme",
          },
          {
            name: "Major Component",
          },
          {
            name: "Sub Component",
          },
          {
            name: "Activity Master",
          },
          {
            name: "Sub Activity",
          },
          {
            name: "Physical",
          },
          {
            name: "Financial (In ₹ Lakh)",
          },
          {
            name: "Physical",
            colSpan: true,
            startCell: "I3",
            endCell: "L3",
          },
          {
            name: "Physical",
          },
          {
            name: "Physical",
          },
          {
            name: "Physical",
          },
          {
            name: "Financial (In ₹ Lakh)",
            rowSpan: 2,
            startCell: "M3",
            endCell: "M4",
          },
          {
            name: "Physical",
          },
          {
            name: "Financial (In ₹ Lakh)",
          },
          {
            name: "Physical",
            colSpan: true,
            startCell: "P3",
            endCell: "S3",
          },
          {
            name: "Physical",
          },
          {
            name: "Physical",
          },
          {
            name: "Physical",
          },
          {
            name: "Financial (In ₹ Lakh)",
            rowSpan: 2,
            startCell: "T3",
            endCell: "T4",
          },
        ],
        [
          {
            name: "S.No.",
            key: "key",
          },
          {
            name: "Scheme",
            key: "scheme_name",
          },
          {
            name: "Major Component",
            key: "major_component_name",
          },
          {
            name: "Sub Component",
            key: "sub_component_name",
          },
          {
            name: "Activity Master",
            key: "activity_master_name",
          },
          {
            name: "Sub Activity",
            key: "activity_master_details_name",
          },
          {
            name: "Physical",
            key: "fresh_approval_physical_quantity",
          },
          {
            name: "Financial (In ₹ Lakh)",
            key: "fresh_approval_financial_amount",
          },
          {
            name: "In Progress",
            key: "exp_against_fresh_app_phy_ip",
          },
          {
            name: "Not Started",
            key: "exp_against_fresh_app_phy_ns",
          },
          {
            name: "Completed",
            key: "exp_against_fresh_app_phy_c",
          },
          {
            name: "Total",
            key: "fresh_total",
          },
          {
            name: "Financial (In ₹ Lakh)",
            key: "exp_against_fresh_app_fin",
          },
          {
            name: "Physical",
            key: "physical_quantity_cummu_inception",
          },
          {
            name: "Financial (In ₹ Lakh)",
            key: "financial_amount_cummu_inception",
          },
          {
            name: "In Progress",
            key: "physical_quantity_progress_progress_inception",
          },
          {
            name: "Not Started",
            key: "physical_quantity_progress_notstart_inception",
          },
          {
            name: "Completed",
            key: "physical_quantity_progress_complete_inception",
          },
          {
            name: "Total",
            key: "exp_total",
          },
          {
            name: "Financial (In ₹ Lakh)",
            key: "financial_amount_progress_inception",
          },
        ],
      ]
}

export default {spillOverExcelHeadersArray}