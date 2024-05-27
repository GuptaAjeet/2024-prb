const stateExcelReport = (reportRelatedData, workSheet) => {

    let headingData = [reportRelatedData?.report_header, '', '', '', '', '','', 'Rs In Lakh'];

    workSheet.addRow(headingData);
    workSheet.mergeCells(`A1:G1`);
    workSheet.getRow(1).font = { size: 14, bold: true, name: 'Trebuchet MS' }
    workSheet.getCell('H1').font = { size: 9, bold: true, name: 'Arial' }

    workSheet.getCell('H1').alignment = {
        horizontal: 'right',
        vertical: 'middle'
    }

    // workSheet.views = [{
    //     showGridLines: false
    // }]

    var run1 = { text: 'Yellow Color Indicates Activity Master Total', font: { color: { argb: 'FFFFFF00' }, size: 9, bold: true, name: 'Arial' } }; // Green color
    var run2 = { text: '\nOrange Color Indicates Sub Component Total', font: { color: { argb: 'FFFF4400' }, size: 9, bold: true, name: 'Arial' } }; // Orange color
    var run3 = { text: '\nGreen Color Indicates Major Component Total', font: { color: { argb: 'FF00B500' }, size: 9, bold: true, name: 'Arial' } }; // Yellow color
    var run4 = { text: '\nGray Color Indicates Overall Total', font: { color: { argb: 'FF666666' }, size: 9, bold: true, name: 'Arial' } }; // Yellow color

    workSheet.getCell('G2').value = { richText: [run1, run2, run3, run4] };

    workSheet.mergeCells(`A2:F2`)
    workSheet.getRow(2).height = 15

    workSheet.getCell('A2:F2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFC4BC96'
        }
    }

    workSheet.getCell('A2:F2').alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true
    }

    workSheet.mergeCells(`G2:H2`)
    workSheet.getCell('G2:H2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFC4BC96'
        }
    }

    workSheet.getCell('G2:H2').alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true
    }

    workSheet.getRow(2).height = 55;

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

    workSheet.getRow(3).height = 25

    workSheet.addRow(['Scheme Name','Major Component', 'Sub Component', 'Activity Master', 'Sub Activity', 'Physical', 'Unit Cost', 'Financial']);

    ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4','H4'].forEach((key) => {
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

    let widths = [30, 35, 40, 40, 40, 20, 20, 20];

    widths.forEach((key, index) => {
        workSheet.getColumn(index + 1).width = key
    })

    workSheet.getRow(4).font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12, name: 'Trebuchet MS' }
    workSheet.getRow(4).height = 25

    reportRelatedData?.reportData.forEach((itm, idx) => {
        let rowElement = [itm.scheme_id === '555555'? 'Grand Total':itm.scheme_name,itm.major_component_id === '666666' ? 'Total' : itm.major_component_name, itm.sub_component_id === '777777' ? itm.major_component_id === '666666' ? 'Total' : `Total ${itm.major_component_name}` : itm.sub_component_name, itm.activity_master_id === '888888' ? itm.sub_component_id === '777777' ? 'Total' : `Total ${itm.sub_component_name}` : itm.activity_master_name, itm.activity_master_details_id === '999999' ? itm.activity_master_id === '888888' ? 'Total' : `Total ${itm.activity_master_name}` : itm.activity_master_details_name, parseFloat(itm.physical_quantity), itm?.unit_cost===null?0:parseFloat(itm.unit_cost), parseFloat(itm.financial_amount)];
        workSheet.addRow(rowElement)
    })

    workSheet.eachRow((row, rowNum) => {
        row.eachCell((cell, cellNum) => {
            if (reportRelatedData?.reportData[rowNum-5]?.major_component_id === "666666") {
                if(cellNum >= 2 && cellNum <= 8)

                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF666666' }
                }
            }

            if (reportRelatedData?.reportData[rowNum-5]?.sub_component_id === "777777" && reportRelatedData?.reportData[rowNum-5]?.major_component_id !== "666666") {
            
                if(cellNum >= 3 && cellNum <= 8)
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF00B500' }
                }
            }

            if (reportRelatedData?.reportData[rowNum-5]?.activity_master_id === "888888" && reportRelatedData?.reportData[rowNum-5]?.sub_component_id !== "777777") {

                if(cellNum >= 4 && cellNum <= 8)
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF4400' }
                }
            }

            if (reportRelatedData?.reportData[rowNum-5]?.activity_master_details_id === "999999" && reportRelatedData?.reportData[rowNum-5]?.activity_master_id !== "888888") {
                
                if(cellNum >= 5 && cellNum <= 8)
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFFF00' }
                }
            }

        });
    });

    // activityMasterRowSpan.forEach((val, index) => {
    //     if (val > 0) {
    //       workSheet.mergeCells(`C${index > 0 ? index + 6 : index + 5}:C${index + val + 5}`);
    //     }
    //   });

    //   subComponentNameRowSpan.forEach((val, index) => {
    //     if (val > 0) {
    //       workSheet.mergeCells(`B${index > 0 ? index + 6 : index + 5}:B${index + val + 5}`);
    //     }
    //   });

    //   majorComponentNameRowSpan.forEach((val, index) => {
    //     if (val > 0) {
    //       workSheet.mergeCells(`A${index > 0 ? index + 6 : index + 5}:A${index + val + 5}`);
    //     }
    //   });



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


export default stateExcelReport