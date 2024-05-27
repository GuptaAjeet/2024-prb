import { Helper, Settings } from "../../../../../apps";

const Vieweditformstate = (reportRelatedData, workSheet) => {
    let headerKeys = [],
        headerValues = [];

    reportRelatedData?.headers.forEach((itm) => {
        headerKeys.push(Object.keys(itm)[0]);
        headerValues.push(Object.values(itm)[0]);
    });

    workSheet.addRow(headerValues);

    let widths = [10, 25, 25, 40, 30, 30, 15, 15, 15];

    widths.forEach((key, index) => {
        workSheet.getColumn(index + 1).width = key
    })
    reportRelatedData?.reportData.forEach((row, index) => {
        let rowData = [];
        headerKeys.forEach((col) => {
            rowData.push(col == "srl" ? index + 1 : row[col]);
        });

        workSheet.addRow(rowData);
    });
   const quantity =
    reportRelatedData?.reportData?.reduce(
          (accumulator, itm) =>
            parseFloat(accumulator) +
            parseFloat(itm.physical_quantity),
          0
        )
      const financial_amount = reportRelatedData?.reportData &&  Helper.accountFormat(
        reportRelatedData?.reportData?.reduce(
            (accumulator, itm) =>
              parseFloat(accumulator) +
              parseFloat(itm.financial_amount),
            0
          ),5
        )
        
const row = workSheet.addRow(['', '', '', '', '', 'Total', quantity, '', financial_amount]);
row.eachCell({ includeEmpty: true }, (cell) => {
  cell.font = { bold: true };
});

// const lastRowNumber = workSheet.rowCount;
// workSheet.mergeCells(`A${lastRowNumber}:F${lastRowNumber}`);

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
                    horizontal: 
                    Settings.isDataExistsInArray(
                        [headerKeys.indexOf("physical_quantity") + 1, headerKeys.indexOf("unit_cost") + 1, headerKeys.indexOf("financial_amount") + 1]
                        , cellNum)
                        ? "right"
                        : "left",
                };
            }
        });
    });
};

export default Vieweditformstate;