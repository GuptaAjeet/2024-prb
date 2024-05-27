const stateProposedExcelReport = (reportRelatedData, workSheet) => {
    let headingData = [reportRelatedData?.report_header, '', '', '', '', '', '', '', '', '', '', 'Rs In Lakh'];

    workSheet.addRow(headingData);
    workSheet.mergeCells(`A1:K1`);
    workSheet.getRow(1).font = { size: 14, bold: true, name: 'Trebuchet MS' }
    workSheet.getCell('L1').font = { size: 9, bold: true, name: 'Arial' }

    workSheet.getCell('L1').alignment = {
        horizontal: 'right',
        vertical: 'middle'
    }

    var run1 = { text: 'Yellow Color Indicates Activity Master Detail Total', font: { color: { argb: 'FFFFFF00' }, size: 9, bold: true, name: 'Arial' } }; // Green color
    var run2 = { text: '\nOrange Color Indicates Master Total Total', font: { color: { argb: 'FFFF4400' }, size: 9, bold: true, name: 'Arial' } }; // Orange color
    var run3 = { text: '\nGreen Color Indicates  Sub Component  Total', font: { color: { argb: 'FF00B500' }, size: 9, bold: true, name: 'Arial' } }; // Yellow color
    var run4 = { text: '\nGray Color Indicates  Major Component Total', font: { color: { argb: 'FF666666' }, size: 9, bold: true, name: 'Arial' } }; // Yellow color
    var run5 = { text: '\nLight Gray Color Indicates Overall Total', font: { color: { argb: 'FF999999' }, size: 9, bold: true, name: 'Arial' } }; // Yellow color FF222222

    workSheet.getCell('K2').value = { richText: [run1, run2, run3, run4, run5] };

    workSheet.mergeCells(`A2:J2`)

    workSheet.getCell('A2:J2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFC4BC96'
        }
    }

    workSheet.getCell('A2:J2').alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true
    }

    workSheet.mergeCells(`K2:L2`)
    workSheet.getCell('K2:L2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFC4BC96'
        }
    }

    workSheet.getCell('K2:L2').alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true
    }

    workSheet.getRow(2).height = 65;

    workSheet.getCell('A3').value = { richText: [{ text: 'Particulars', font: { color: { argb: 'FFFFFFFF' }, size: 14, bold: true, name: 'Trebuchet MS' } }] }
    workSheet.mergeCells(`A3:E3`);
    workSheet.getCell('A3:E3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF025D91'
        }
    }
    workSheet.getCell('A3:E3').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }

    workSheet.getCell('F3').value = { richText: [{ text: 'Proposal', font: { color: { argb: 'FFFFFFFF' }, size: 14, bold: true, name: 'Trebuchet MS' } }] }
    workSheet.mergeCells(`F3:H3`)
    workSheet.getCell('F3:H3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF025D91'
        }
    }
    workSheet.getCell('F3:H3').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }

    workSheet.getCell('I3').value = { richText: [{ text: 'Recommended', font: { color: { argb: 'FFFFFFFF' }, size: 14, bold: true, name: 'Trebuchet MS' } }] }
    workSheet.mergeCells(`I3:L3`)
    workSheet.getCell('I3:L3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF025D91'
        }
    }
    workSheet.getCell('I3:L3').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }

    workSheet.getRow(3).height = 25

    workSheet.addRow(['Scheme Name', 'Major Component', 'Sub Component', 'Activity Master', 'Sub Activity', 'Physical', 'Unit Cost', 'Financial', 'Physical', 'Unit Cost', 'Financial', 'Co-ordinator Remarks']);

    ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4', 'K4', 'L4'].forEach((key) => {
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
        let rowElement = [itm.scheme_id === '555555' ? 'Grand Total' : itm.scheme_name, itm.major_component_id === '666666' ? 'Total' : itm.major_component_name, itm.sub_component_id === '777777' ? itm.major_component_id === '666666' ? 'Total' : `Total ${itm.major_component_name}` : itm.sub_component_name, itm.activity_master_id === '888888' ? itm.sub_component_id === '777777' ? 'Total' : `Total ${itm.sub_component_name}` : itm.activity_master_name, itm.activity_master_details_id === '999999' ? itm.activity_master_id === '888888' ? 'Total' : `Total ${itm.activity_master_name}` : itm.activity_master_details_name, itm.physical_quantity === null ? 0 : parseFloat(itm.physical_quantity), itm.unit_cost === null ? 0 : parseFloat(itm.unit_cost), itm.financial_amount === null ? 0 : parseFloat(itm.financial_amount), itm.proposed_physical_quantity === null ? 0 : parseFloat(itm.proposed_physical_quantity), itm.proposed_unit_cost === null ? 0 : parseFloat(itm.proposed_unit_cost), itm.proposed_financial_amount === null ? 0 : parseFloat(itm.proposed_financial_amount), itm.scheme_id === '555555' || itm.major_component_id === '666666' || itm.sub_component_id === '777777' || itm.activity_master_id === '888888' || itm.activity_master_details_id === '999999' ? "" : itm.coordinator_remarks];
        workSheet.addRow(rowElement)
    })

    workSheet.eachRow((row, rowNum) => {
        row.eachCell((cell, cellNum) => {
            if (reportRelatedData?.reportData[rowNum - 5]?.scheme_id === "555555") {
                if (cellNum >= 1 && cellNum <= 12)
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF999999' }
                    }
            }

            if (reportRelatedData?.reportData[rowNum - 5]?.major_component_id === "666666" && reportRelatedData?.reportData[rowNum - 5]?.scheme_id !== "555555") {
                if (cellNum >= 2 && cellNum <= 12)
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF666666' }
                    }
            }

            if (reportRelatedData?.reportData[rowNum - 5]?.sub_component_id === "777777" && reportRelatedData?.reportData[rowNum - 5]?.major_component_id !== "666666") {

                if (cellNum >= 3 && cellNum <= 12)
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF00B500' }
                    }
            }

            if (reportRelatedData?.reportData[rowNum - 5]?.activity_master_id === "888888" && reportRelatedData?.reportData[rowNum - 5]?.sub_component_id !== "777777") {

                if (cellNum >= 4 && cellNum <= 12)
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFF4400' }
                    }
            }

            if (reportRelatedData?.reportData[rowNum - 5]?.activity_master_details_id === "999999" && reportRelatedData?.reportData[rowNum - 5]?.activity_master_id !== "888888") {

                if (cellNum >= 5 && cellNum <= 12)
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