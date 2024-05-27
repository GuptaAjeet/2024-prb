import { Settings } from "../../../../../apps";
const tableToExcelReport = (reportRelatedData, workSheet) => {
    let headerKeys = [],
        headerValues = [];

    reportRelatedData?.headers.forEach((itm) => {
        headerKeys.push(Object.keys(itm)[0]);
        headerValues.push(Object.values(itm)[0]);
    });

    workSheet.addRow(headerValues);

    reportRelatedData?.reportData.forEach((row, index) => {
        let rowData = [];
        headerKeys.forEach((col) => {
            rowData.push(col == "srl" || col == "id" ? index + 1 : row[col]);
        });

        workSheet.addRow(rowData);
    });

    workSheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, function (cell) {
            var columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });

        column.width = maxLength < 10 ? 10 : maxLength == 10 ? 15 : maxLength > 35 ? 35 : maxLength;
    });

    workSheet.eachRow((row, rowNum) => {
        row.eachCell((cell, cellNum) => {
            if (rowNum == 1) {
                row.font = { color: { argb: 'FFFFFFFF' }, size: 13, bold: true };
                row.height = 20;
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: 'FF025D91'
                    }
                }
            } else {
                cell.alignment = {
                    wrapText: true,
                    vertical: "middle",
                    horizontal: Settings.isDataExistsInArray(
                        [headerKeys.indexOf("physical_quantity") + 1, headerKeys.indexOf("unit_cost") + 1, headerKeys.indexOf("financial_amount") + 1]
                        , cellNum)
                        ? "right"
                        : "left",
                };
            }
        });
    });
};

export default tableToExcelReport;