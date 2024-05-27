const stateProposedExcelReport = (reportRelatedData, workSheet) => {
    workSheet.addRow(['Major Component', 'Sub Component', 'Activity', 'Sub Activity', 'R/NR', 'Proposed by State', '', '', 'Recommended by DoSEL', '', '', 'Co-ordinator Remarks']);
    workSheet.addRow(['', '', '', '', '', 'Phy Qty', 'Unit Cost', 'Amount (In Lakhs)', 'Recommended by DoSEL', '', '', 'Co-ordinator Remarks']);

    ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4','H4', 'I4', 'J4', 'K4', 'L4'].forEach((key) => {
        workSheet.getCell(key).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF025D91'
            }
        }
        workSheet.getCell(key).alignment = {
            horizontal: 'center',
            vertical: 'middle'
        }
    });

    let widths = [30, 35, 40, 40, 40, 20, 20, 20, 20, 20, 20, 35];

    widths.forEach((key, index) => {
        workSheet.getColumn(index + 1).width = key
    })

    workSheet.getRow(4).font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12, name: 'Trebuchet MS' }
    workSheet.getRow(4).height = 25

    reportRelatedData?.reportData.forEach((itm, idx) => {
        let rowElement = [itm.scheme_id==='555555'? 'Grand Total':itm.scheme_name,itm.major_component_id === '666666' ? 'Total' : itm.major_component_name, itm.sub_component_id === '777777' ? itm.major_component_id === '666666' ? 'Total' : `Total ${itm.major_component_name}` : itm.sub_component_name, itm.activity_master_id === '888888' ? itm.sub_component_id === '777777' ? 'Total' : `Total ${itm.sub_component_name}` : itm.activity_master_name, itm.activity_master_details_id === '999999' ? itm.activity_master_id === '888888' ? 'Total' : `Total ${itm.activity_master_name}` : itm.activity_master_details_name,itm.physical_quantity===null ? 0: parseFloat(itm.physical_quantity), itm.unit_cost===null ? 0:parseFloat(itm.unit_cost), itm.financial_amount===null ? 0:parseFloat(itm.financial_amount),itm.proposed_physical_quantity===null ? 0: parseFloat(itm.proposed_physical_quantity), itm.proposed_unit_cost===null ? 0:parseFloat(itm.proposed_unit_cost), itm.proposed_financial_amount===null ? 0:parseFloat(itm.proposed_financial_amount), itm.coordinator_remarks];
        workSheet.addRow(rowElement)
    })

    workSheet.eachRow((row, rowNum) => {
        row.eachCell((cell, cellNum) => {
            if (reportRelatedData?.reportData[rowNum-5]?.major_component_id === "666666") {
                if(cellNum >= 2 && cellNum <= 12)

                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF666666' }
                }
            }

            if (reportRelatedData?.reportData[rowNum-5]?.sub_component_id === "777777" && reportRelatedData?.reportData[rowNum-5]?.major_component_id !== "666666") {
            
                if(cellNum >= 3 && cellNum <= 12)
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF00B500' }
                }
            }

            if (reportRelatedData?.reportData[rowNum-5]?.activity_master_id === "888888" && reportRelatedData?.reportData[rowNum-5]?.sub_component_id !== "777777") {

                if(cellNum >= 4 && cellNum <= 12)
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF4400' }
                }
            }

            if (reportRelatedData?.reportData[rowNum-5]?.activity_master_details_id === "999999" && reportRelatedData?.reportData[rowNum-5]?.activity_master_id !== "888888") {
                
                if(cellNum >= 5 && cellNum <= 12)
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFF00' }
                }
            }

        });
    });

    workSheet.eachRow((row, rowNum) => {
        row.eachCell((cell, cellNum) => {
            if (rowNum > 4) {
                cell.alignment = {
                    wrapText: true,
                    vertical: "middle",
                };
            }
        });
    });

};


export default stateProposedExcelReport