const districtProgressExcelReport = (reportRelatedData, workSheet) => {
  let cellNum = 1, prevCellNum = 1;

  reportRelatedData?.reportData?.forEach((row, index) => {

    let stateData = [`STATE: ${row?.state_name} | DISTRICTS: ${row?.districts.length} (Approved: ${row.districts.filter((district) => district?.status == 6 || district?.status == 9).length}, Pending: ${row.districts.filter((district) => district?.status < 6).length}) | STATUS: +${row.min} === 6 ? STATE APPROVED : STATE PENDING`];

    workSheet.addRow(stateData);
    workSheet.addRow([]);

    let districtDataHeader = ['S.No.', 'District Name', 'Status'];

    workSheet.addRow(districtDataHeader);

    if (index == 0) {
      workSheet.getColumn(1).width = 10;
      workSheet.getColumn(2).width = 40;
      workSheet.getColumn(3).width = 40;
    } else {
      cellNum = prevCellNum + reportRelatedData?.reportData[index - 1]?.districts.length + 4;
      prevCellNum = cellNum;
    }

    workSheet.mergeCells(`A${cellNum}:C${cellNum}`);

    workSheet.getRow(cellNum).font = { size: 12, bold: true }
    workSheet.getRow(cellNum + 2).font = { size: 11, bold: true }

    row.districts.forEach((col, idx) => {
      let districtData = [];

      districtData.push((idx + 1).toString(), col?.district_name, reportRelatedData?.planStatusObj[col?.status])
      workSheet.addRow(districtData);
    });

    workSheet.addRow([]);
  });
};


export default districtProgressExcelReport