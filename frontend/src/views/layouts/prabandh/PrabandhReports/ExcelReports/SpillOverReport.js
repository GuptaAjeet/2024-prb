const spillOverExcelReport = (reportRelatedData, workSheet) => {
  reportRelatedData?.columns.forEach((headerRow, rowIndex) => {
    const row = workSheet.addRow();
    headerRow.forEach((column, colIndex) => {
      const cell = row.getCell(colIndex + 1);
      cell.value = column?.name;
    });
  });

  reportRelatedData?.columns.forEach((headerRow, rowIndex) => {
    headerRow.forEach((column, colIndex) => {
      if (column?.rowSpan || column?.colSpan) {
        workSheet.mergeCells(`${column?.startCell}:${column?.endCell}`);
      }
    });
  });

  let lastColumns = reportRelatedData?.columns.pop();

  reportRelatedData?.reportData.forEach((row, index) => {
    let rowData = lastColumns.map((column) => {
      if (column?.key === "key") {
        return (index + 1).toString();
      } else if (column?.key === "fresh_total") {
        return (
          +row?.exp_against_fresh_app_phy_ip +
          +row?.exp_against_fresh_app_phy_ns +
          +row?.exp_against_fresh_app_phy_c
        );
      } else if (column.key === "exp_total") {
        return (
          +row?.physical_quantity_progress_progress_inception +
          +row?.physical_quantity_progress_notstart_inception +
          +row?.physical_quantity_progress_complete_inception
        );
      } else {
        return row[column?.key];
      }
    });
    workSheet.addRow(rowData);
  });

  workSheet.eachRow((row, rowNum) => {
    row.eachCell((cell, cellNum) => {
      if (rowNum <= 4) {
        row.font = {  color: { argb: 'FFFFFFFF' }, size: 13, bold: true };

        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };

        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: {
            argb: 'FF025D91'
          }
        }

      } else {
        if (cellNum > 6) {
          cell.alignment = {
            vertical: "middle",
            horizontal: "right",
          };
          workSheet.getColumn(cellNum).width = 20;
        } else if (cellNum === 1) {
          workSheet.getColumn(cellNum).width = 10;
        } else {
          workSheet.getColumn(cellNum).width = 30;
        }
      }
    });
  });
};

export default spillOverExcelReport;
