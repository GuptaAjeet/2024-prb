const Spilloversecond = (reportRelatedData, workSheet) => {
    let headingData = [reportRelatedData?.report_header, '', '', '', '', '', '', '', '', '', '', '', 'Rs In Lakh'];

    workSheet.addRow(headingData);
    workSheet.mergeCells(`A1:K1`);
    workSheet.getRow(1).font = { size: 14, bold: true, name: 'Trebuchet MS' }
    workSheet.getCell('M1').font = { size: 9, bold: true, name: 'Arial' }

    workSheet.getCell('M1').alignment = {
        horizontal: 'right',
        vertical: 'middle'
    }

    var run1 = { text: 'Yellow Color Indicates Activity Master Detail Total', font: { color: { argb: 'FFFFFF00' }, size: 9, bold: true, name: 'Arial' } }; // Green color
    var run2 = { text: '\nOrange Color Indicates Activity Master Total', font: { color: { argb: 'FFFF4400' }, size: 9, bold: true, name: 'Arial' } }; // Orange color
    var run3 = { text: '\nGreen Color Indicates Sub Component Total', font: { color: { argb: 'FF00B500' }, size: 9, bold: true, name: 'Arial' } }; // Green color 
    var run4 = { text: '\nGray Color Indicates Major Component Total', font: { color: { argb: 'FF666666' }, size: 9, bold: true, name: 'Arial' } }; // Gray color

    workSheet.getCell('L2').value = { richText: [run1, run2, run3, run4] };

    workSheet.mergeCells(`A2:K2`)
    workSheet.getRow(2).height = 15

    workSheet.getCell('A2:K2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFC4BC96'
        }
    }

    workSheet.getCell('A2:K2').alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true
    }

    workSheet.mergeCells(`L2:M2`)
    workSheet.getCell('L2:M2').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FFC4BC96'
        }
    }

    workSheet.getCell('L2:M2').alignment = {
        horizontal: 'left',
        vertical: 'middle',
        wrapText: true
    }

    workSheet.getRow(2).height = 55;

    workSheet.getCell('A3').value = { richText: [{ text: 'Particulars', font: { color: { argb: 'FFFFFFFF' }, size: 14, bold: true, name: 'Trebuchet MS' } }] }
    workSheet.mergeCells(`A3:D3`);
    workSheet.getCell('A3:D3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF025D91'
        }
    }
    workSheet.getCell('A3:D3').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }

    workSheet.getCell('E3').value = { richText: [{ text: 'Budget Approved', font: { color: { argb: 'FFFFFFFF' }, size: 14, bold: true, name: 'Trebuchet MS' } }] }
    workSheet.mergeCells(`E3:F3`)
    workSheet.getCell('E3:F3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF025D91'
        }
    }
    workSheet.getCell('E3:F3').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }

    workSheet.getCell('G3').value = { richText: [{ text: 'Cummulative Progress   (Since Inception)', font: { color: { argb: 'FFFFFFFF' }, size: 14, bold: true, name: 'Trebuchet MS' } }] }
    workSheet.mergeCells(`G3:I3`)
    workSheet.getCell('G3:I3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF025D91'
        }
    }
    workSheet.getCell('J3:M3').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }
    workSheet.getCell('J3').value = { richText: [{ text: 'Spill Over', font: { color: { argb: 'FFFFFFFF' }, size: 14, bold: true, name: 'Trebuchet MS' } }] }
    workSheet.mergeCells(`J3:M3`)
    workSheet.getCell('J3:M3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF025D91'
        }
    }
    workSheet.getCell('J3:M3').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }

    // FOURTH ROW

    workSheet.getCell('G4').value = { richText: [{ text: 'Physical', font: { color: { argb: 'FFFFFFFF' }, size: 14, bold: true, name: 'Trebuchet MS' } }] }
    workSheet.mergeCells(`G4:H4`)
    workSheet.getCell('G4:H4').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF025D91'
        }
    }
    workSheet.getCell('G4:H4').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }

    workSheet.getCell('J4').value = { richText: [{ text: 'Physical', font: { color: { argb: 'FFFFFFFF' }, size: 14, bold: true, name: 'Trebuchet MS' } }] }
    workSheet.mergeCells(`J4:L4`)
    workSheet.getCell('J4:L4').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
            argb: 'FF025D91'
        }
    }
    workSheet.getCell('J4:L4').alignment = {
        horizontal: 'center',
        vertical: 'middle'
    }

    workSheet.getRow(3).height = 25
    // fifth Roww
    workSheet.addRow(['Major Component', 'Sub Component', 'Activity Master', 'Sub Activity', 'Physical', 'Financial Amount', 'Complete', 'In Progress', 'Financial Amount', 'In Progress', 'Not Started', 'Total', 'Financial Amount',]);

    ['A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4', 'I4', 'J4', 'K4', 'L4', 'M4'].forEach((key) => {
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
    //each cell width individual
    let widths = [30, 40, 40, 40, 12, 14, 12, 12, 14, 12, 12, 12, 14];

    widths.forEach((key, index) => {
        workSheet.getColumn(index + 1).width = key
    })

    workSheet.getCell('E4').font = { color: { argb: 'e3f542' }, bold: true, size: 12, name: 'Trebuchet MS' }
    workSheet.getCell('E5').font = { color: { argb: 'e3f542' }, bold: true, size: 12, name: 'Trebuchet MS' }
    workSheet.getRow(4).font = { color: { argb: 'e3f542' }, bold: true, size: 12, name: 'Trebuchet MS', }
    workSheet.getRow(5).font = { color: { argb: '000000' }, bold: true, size: 12, name: 'Trebuchet MS', }
    const borderStyle = {
        style: 'thin', // You can choose 'thin', 'medium', 'dashDot', etc.
        color: { argb: '00000000' } // ARGB color code, '00000000' is black
    };
    const row = workSheet.getRow(4);
    row.eachCell((cell) => {
        cell.border = {
            top: borderStyle,
            left: borderStyle,
            bottom: borderStyle,
            right: borderStyle
        };
    });
    workSheet.getRow(4).height = 25
    // CHANGE TEXT BY CONDITIONALY
    reportRelatedData?.reportData.forEach((itm, idx) => {
        let rowElement = [itm.major_component_id === '666666' ? 'Total' : itm.major_component_name, itm.sub_component_id === '777777' ? itm.major_component_id === '666666' ? "" : 'Total' : itm.sub_component_name, itm.activity_master_id === '888888' ? itm.sub_component_id === '777777' ? "" : 'Total' : itm.activity_master_name, itm.activity_master_details_id === '999999' ? itm.activity_master_id === '888888' ? "" : 'Total' : itm.activity_master_details_name,
        itm.total_physical_budget_approved === null ? 0 : parseFloat(itm.total_physical_budget_approved),
        itm.total_financial_budget_approved === null ? 0 : parseFloat(itm.total_financial_budget_approved),
        itm.physical_quantity_progress_complete_inception === null ? 0 : parseFloat(itm.physical_quantity_progress_complete_inception),
        itm.physical_quantity_progress_progress_inception === null ? 0 : parseFloat(itm.physical_quantity_progress_progress_inception),
        itm.financial_amount_progress_inception === null ? 0 : parseFloat(itm.financial_amount_progress_inception),
        itm.physical_quantity_progress_progress_inception === null ? 0 : parseFloat(itm.physical_quantity_progress_progress_inception),
        itm.physical_quantity_not_started === null ? 0 : parseFloat(itm.physical_quantity_not_started),
        itm.physical_quantity_spill_over === null ? 0 : parseFloat(itm.physical_quantity_spill_over),
        itm.financial_amount_spill_over === null ? 0 : parseFloat(itm.financial_amount_spill_over),];
        workSheet.addRow(rowElement)
    })
    // APPYL COLOR ON THE BASIS OF CONDITION
    workSheet.eachRow((row, rowNum) => {
        row.eachCell((cell, cellNum) => {
            if (reportRelatedData?.reportData[rowNum - 6]?.activity_master_details_id === "999999" && reportRelatedData?.reportData[rowNum - 6]?.activity_master_id !== "888888") {
                if (cellNum >= 4 && cellNum <= 13) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFFFF00' }
                    }
                    cell.font = { bold: true, size: 12 };
                }
            }

            if (reportRelatedData?.reportData[rowNum - 6]?.activity_master_id === "888888" && reportRelatedData?.reportData[rowNum - 6]?.sub_component_id !== "777777") {
                if (cellNum >= 3 && cellNum <= 13) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFFF4400' }
                    }
                    cell.font = { bold: true, size: 12 };
                }
            }

            if (reportRelatedData?.reportData[rowNum - 6]?.sub_component_id === "777777" && reportRelatedData?.reportData[rowNum - 6]?.major_component_id !== "666666") {
                if (cellNum >= 2 && cellNum <= 13) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF00B500' }
                    }
                    cell.font = { bold: true, size: 12 };
                }
            }

            if (reportRelatedData?.reportData[rowNum - 6]?.major_component_id === "666666") {
                if (cellNum >= 1 && cellNum <= 13) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF666666' },
                        width: "auto"
                    }
                    cell.font = { bold: true, size: 12 };
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


export default Spilloversecond