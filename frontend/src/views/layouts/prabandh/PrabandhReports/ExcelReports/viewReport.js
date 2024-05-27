import { Settings } from "../../../../../apps";

const viewReportToExcel = (reportRelatedData, workSheet) => {

    workSheet.addRow([
        "S.No.",
        "Scheme",
        "Major Component",
        "Sub Component",
        "Activity",
        "Sub Activity",
        "Total Sum",
        "Physical Quantity",
        "Financial Amount (₹ In Lakhs)",
        "Unit Cost (₹ In Lakhs)",
    ]);

    reportRelatedData?.reportData.forEach((row, index) => {
        let rowData = [
            index + 1,
            row.scheme_name,
            row.major_component_name,
            row.sub_component_name,
            row.activity_master_name,
            row.activity_master_details_name,
            row.sub_component_id === "777777" &&
                row.activity_master_details_id === "999999"
                ? "Activity Master Total"
                : row.activity_master_id === "888888" &&
                    row.activity_master_details_id === "999999"
                    ? "Sub Total"
                    : row.activity_master_details_id === "999999"
                        ? "Total"
                        : null,

            parseFloat(row.physical_quantity),
            parseFloat(row.financial_amount),
            parseFloat(row.unit_cost ? row.unit_cost : 0),
        ];

        workSheet.addRow(rowData);
    });

    reportRelatedData?.schemeNameRowSpan.forEach((val, index) => {
        if (val > 0) {
            workSheet.mergeCells(`B${index + 2}:B${index + val + 1}`);
        }
    });

    reportRelatedData?.majorComponentRowSpan.forEach((val, index) => {
        if (val > 0) {
            workSheet.mergeCells(`C${index + 2}:C${index + val + 1}`);
        }
    });

    reportRelatedData?.activityMasterRowSpan.forEach((val, index) => {
        if (val > 0) {
            workSheet.mergeCells(`D${index + 2}:D${index + val + 1}`);
        }
    });

    reportRelatedData?.schemeNameRowSpan.forEach((val, index) => {
        if (val > 0) {
            workSheet.mergeCells(`E${index + 2}:E${index + val + 1}`);
        }
    });

    workSheet.eachRow((row, rowNum) => {
        row.eachCell((cell, cellNum) => {
            if (row.values[7] === "Activity Master Total") {
                row._cells[5].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "5c5a4d" },
                };
                row._cells[6].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "5c5a4d" },
                };

                row._cells[7].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "5c5a4d" },
                };
                row._cells[8].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "5c5a4d" },
                };
                row._cells[9].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "5c5a4d" },
                };
            }

            if (row.values[7] === "Sub Total") {
                row._cells[5].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "004e47cc" },
                };
                row._cells[6].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "004e47cc" },
                };

                row._cells[7].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "004e47cc" },
                };
                row._cells[8].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "004e47cc" },
                };
                row._cells[9].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "004e47cc" },
                };
            }

            if (row.values[7] === "Total") {
                row._cells[5].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "f0c91a" },
                };
                row._cells[6].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "f0c91a" },
                };

                row._cells[7].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "f0c91a" },
                };
                row._cells[8].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "f0c91a" },
                };
                row._cells[9].fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "f0c91a" },
                };
            }

            if (+rowNum === 1) {
                row.font = { color: { argb: 'FFFFFFFF' }, size: 13, bold: true };
                row.height = 20;
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: 'FF025D91'
                    }
                }

                if (Settings.isDataExistsInArray([7, 8], cellNum)) {
                    workSheet.getColumn(cellNum).width = 20;
                } else if (Settings.isDataExistsInArray([2, 3, 4, 5, 6], cellNum)) {
                    workSheet.getColumn(cellNum).width = 35;
                } else if (+cellNum === 10) {
                    workSheet.getColumn(cellNum).width = 15;
                }
            } else {
                cell.alignment = {
                    wrapText: true,
                    vertical: "middle",
                };

                if (Settings.isDataExistsInArray([7, 8, 9], cellNum)) {
                    cell.alignment = {
                        horizontal: "right",
                        vertical: "middle",
                    };
                }
            }
        });
    });
}

export default viewReportToExcel;