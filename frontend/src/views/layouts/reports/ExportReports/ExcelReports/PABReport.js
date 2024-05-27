


const PABReport = (reportRelatedData, workSheet) => {

    workSheet.mergeCells(`A2:L2`);
    workSheet.getCell(`A2:L2`).value = { richText: [{ text: `Draft PAB Minutes Report - ${reportRelatedData?.stateName} `, font: { color: { argb: '0' }, size: 15, bold: true, name: reportRelatedData?.stateName } }] };
    workSheet.getCell(`A2:L2`).fill = {
        type: 'pattern', pattern: 'solid', fgColor: {
            argb: 'FFE2A03F'
        }

    }
    workSheet.getRow(2).height = 25
    workSheet.getRow(3).height = 25
    workSheet.getRow(4).height = 25

    let headers = [
        {
            heading: " Major Component",
            cell: "A3",
            cells: "A3:A4"
        },
        {
            heading: " Sub Component",
            cell: "B3",
            cells: "B3:B4"
        },
        {
            heading: "Activity",
            cell: "C3",
            cells: "C3:C4"
        },
        {
            heading: " Sub Activity",
            cell: "D3",
            cells: "D3:D4"
        },
        {
            heading: "R/NR",
            cell: "E3",
            cells: "E3:E4"
        },
        {
            heading: "Proposed by State",
            cell: "F3",
            cells: "F3:H3"
        },
        {
            heading: "Phy Qty",
            cell: "F4",
            cells: null
        },
        {
            heading: "Unit Cost",
            cell: "G4",
            cells: null
        },
        {
            heading: "Amount (In Lakhs)",
            cell: "H4",
            cells: null
        },
        {
            heading: " Recommended by DoSEL",
            cell: "I3",
            cells: "I3:K3"
        },
        {
            heading: "Phy Qty",
            cell: "I4",
            cells: null
        },
        {
            heading: "Unit Cost",
            cell: "J4",
            cells: null
        },
        {
            heading: "Amount (In Lakhs)",
            cell: "K4",
            cells: null
        },
        {
            heading: "Coordinator Remarks",
            cell: "L3",
            cells: "L3:L4"
        }
    ]


    headers.forEach((val) => {
        workSheet.getCell(val.cell).value = { richText: [{ text: val.heading, font: { color: { argb: '0' }, size: 10, bold: true, name: val.heading } }] };
        if (val.cells != null) {
            workSheet.mergeCells(val.cells);
        }
        workSheet.getCell(val.cell).font = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {
                argb: 'FF025D91'
            }
        }
        workSheet.getCell(val.cell).alignment = {
            horizontal: 'center',
            vertical: 'middle'
        }

        workSheet.getCell(val.cell).fill = {
            type: 'pattern', pattern: 'solid', fgColor: {
                argb: 'FF2054CC'
            }
        }
    });


    let widths = [30, 35, 40, 40, 40, 8, 20, 20, 20, 20, 20, 55];

    widths.forEach((key, index) => {
        workSheet.getColumn(index + 1).width = key
    })

    workSheet.addRow();
    workSheet.mergeCells(`A5:L5`);
    workSheet.getCell("A5").value = { richText: [{ text: `Scheme name - ${reportRelatedData?.reportData[0].schemename}`, font: { color: { argb: '0' }, size: 12, name: reportRelatedData?.reportData[0].schemename } }] };
    let starting_row = 6, starting_row_total = 6;
    let preval = reportRelatedData?.reportData[0].schemename;
    let arr = [];
    reportRelatedData?.reportData.forEach((itm, idx) => {
        if (preval != itm.schemename) {
            workSheet.addRow();
            let scheme_name = itm.schemename != null ? `Scheme name - ${itm.schemename}` : "Grand Total";
            workSheet.mergeCells(`A${idx + starting_row_total}:L${idx + starting_row_total}`);
            workSheet.getCell(`A${idx + starting_row_total}`).value = { richText: [{ text: scheme_name, font: { color: { argb: '0' }, size: 12, name: scheme_name } }] };
            preval = itm.schemename;
            starting_row_total = starting_row_total + 1;
        }
        let object1 = {};
        if (itm.majorcomponentname === null) {
            object1.value = "Total";
            object1.cell = `A${idx + starting_row_total}`;
            object1.cells = `A${idx + starting_row_total}:E${idx + starting_row_total}`;
            arr.push(object1);
        }

        else if (itm.subcomponentname === null) {

            object1.value = `Total ${itm.majorcomponentname}`;
            object1.cell = `B${idx + starting_row_total}`;
            object1.cells = `B${idx + starting_row_total}:E${idx + starting_row_total};`

            arr.push(object1);
        }
        else if (itm.activitymastername === null) {

            object1.value = `Total ${itm.subcomponentname}`;
            object1.cell = `C${idx + starting_row_total}`;
            object1.cells = `C${idx + starting_row_total}:E${idx + starting_row_total};`

            arr.push(object1);
        }
        else if (itm.activitymasterdetailname === null) {
            object1.value = `Total ${itm.activitymastername}`;
            object1.cell = `D${idx + starting_row_total}`;
            object1.cells = `D${idx + starting_row_total}:E${idx + starting_row_total}`;
            arr.push(object1);


        }



        let rowElement = [
            itm.majorcomponentid === '666666' ? 'Total' : itm.majorcomponentname,
            itm.subcomponentid === '777777' ? itm.majorcomponentid === '666666' ? 'Total' : `Total ${itm.majorcomponentname}` : itm.subcomponentname,
            itm.activitymasterid === '888888' ? itm.subcomponentid === '777777' ? 'Total' : `Total ${itm.subcomponentname}` : itm.activitymastername,
            itm.activitymasterdetailsid === '999999' ? itm.activitymasterid === '888888' ? 'Total' : `Total ${itm.activitymastername}` : itm.activitymasterdetailname,
            itm.recuringnonrecuring,
            itm.physicalquantity === null ? 0 : parseFloat(itm.physicalquantity),
            itm.unitcost === null ? 0 : parseFloat(itm.unitcost),
            itm.financialamount === null ? 0 : parseFloat(itm.financialamount),
            itm.proposedphysicalquantity === null ? 0 : parseFloat(itm.proposedphysicalquantity),
            itm.proposedunitcost === null ? 0 : parseFloat(itm.proposedunitcost),
            itm.proposedfinancialamount === null ? 0 : parseFloat(itm.proposedfinancialamount),
            itm.schemeid === '555555' || itm.majorcomponentid === '666666' || itm.subcomponentid === '777777' || itm.activitymasterid === '888888' || itm.activitymasterdetailsid === '999999' ? "" : itm.coordinatorremarks];
        workSheet.addRow(rowElement)

    });
    workSheet.getColumn("L").alignment = {wrapText:true};


    let arr1 = [];

    let prev_scheme_name = reportRelatedData?.reportData[0].schemename;
    let prev_major_component_name = reportRelatedData?.reportData[0].majorcomponentname;
    let prev_sub_component_name = reportRelatedData?.reportData[0].subcomponentname;
    let prev_activity_master_name = reportRelatedData?.reportData[0].activitymastername;




    let prev = starting_row, prev1 = starting_row, prev2 = starting_row, prev3 = starting_row;
    reportRelatedData?.reportData.forEach((row, idx) => {

        if (row?.schemename != prev_scheme_name) {
            starting_row = starting_row + 1;
            prev_scheme_name = row?.schemename;
            prev = idx + starting_row;
        }

        if (row?.majorcomponentname != prev_major_component_name) {
            let object = {};
            object.value = prev_major_component_name;
            object.cell = `A${prev3}`;
            object.cells = `A${prev3}:A${idx + starting_row - 1}`
            prev3 = idx + starting_row;
            arr1.push(object);
            prev_major_component_name = row?.majorcomponentname;
        }


        if (row?.subcomponentname != prev_sub_component_name) {

            let object = {};
            object.value = prev_sub_component_name;
            object.cell = `B${prev1}`;
            object.cells = `B${prev1}:B${idx + starting_row - 1}`
            prev1 = idx + starting_row;
            arr1.push(object);
            prev_sub_component_name = row?.subcomponentname;
        }

        if (row?.activitymastername != prev_activity_master_name) {
            let object = {};
            object.value = prev_activity_master_name;
            object.cell = `C${prev2}`;
            object.cells = `C${prev2}:C${idx + starting_row - 1}`

            arr1.push(object);


            prev2 = idx + starting_row;

            prev_activity_master_name = row?.activitymastername;
        }

    })



    function removeDuplicates(array1, array2, key) {
        const allObjects = [...array1, ...array2];
        const seen = new Set();
        const filteredArray = [];

        for (const obj of array2) {
            const uniqueId = obj[key];
            if (!seen.has(uniqueId)) {
                filteredArray.push(obj);
                seen.add(uniqueId);
            }

        }

        for (const obj of allObjects) {
            const uniqueId = obj[key];
            if (!seen.has(uniqueId)) {
                filteredArray.push(obj);
                seen.add(uniqueId);
            }
        }

        return filteredArray;
    }


    const newArray = removeDuplicates(arr1, arr, 'cell');

    newArray.forEach((val) => {
        if (val.value != null) {
            if (val.value.startsWith("Total") || val.value.startsWith("Grand Total")) {
                let newcell = val.cell;
                let cell_no = newcell.substring(1);
                let col_arr = ["F","H", "I", "K"];
                col_arr.forEach((col) => {
                    workSheet.getCell(`${col}${cell_no}`).font = { color: { argb: '0' }, size: 11, bold: true };
                })
                workSheet.getCell(`G${cell_no}`).value = "";
                workSheet.getCell(`J${cell_no}`).value = "";

                workSheet.getCell(val.cell).value = { richText: [{ text: val.value, font: { color: { argb: '0' }, size: 10, bold: true, name: val.value } }] };

            }
            else {
                workSheet.getCell(val.cell).value = val.value;
            }
            workSheet.mergeCells(val.cells);
            workSheet.getCell(val.cell).alignment = {
                horizontal: 'left',
                vertical: 'top'
            }

        }
    });

}

export default PABReport;