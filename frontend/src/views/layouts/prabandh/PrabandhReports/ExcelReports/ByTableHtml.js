import $ from "jquery";


const ByTableHtml = (reportRelatedData, workSheet) => {
    const skipColumn = reportRelatedData.skipColumn || [];
    let tableLength = 0;

    // let th = null;
    // $(reportRelatedData.table).find("thead tr").each(function (){
    //     if(!th || $(this).find("th").length>th.length){
    //         th = $(this).find("th");
    //     }
    // });

    let th = $(reportRelatedData.table).find("tbody").find("tr:first").find("td");

    const tbody = $(reportRelatedData.table).find("tbody");
    let headingData = [reportRelatedData?.report_header, ...Array.from({ length: (th.length-(skipColumn?.length+2)) }), 'Rs In Lakh'];
    
    workSheet.addRow(headingData);
    workSheet.mergeCells(`${String.fromCharCode(65)}1:${String.fromCharCode(65+(th.length-skipColumn?.length-2))}1`);
    workSheet.getRow(1).font = { size: 14, bold: true, name: 'Trebuchet MS' }
    workSheet.getCell(`${String.fromCharCode(65+(th.length-1))}1`).font = { size: 9, bold: true, name: 'Arial' }

    workSheet.getCell(`${String.fromCharCode(65+(th.length-1))}1`).alignment = {
        horizontal: 'right',
        vertical: 'middle'
    }

    let mergeCellObj = {};
    let headerRow = [];
    let oldRowSpanData = {};
    $(reportRelatedData.table).find("thead tr").each(function () {
        const thisRow = $(this);
        let currentHeaderRow = [];

        let thIndex = 0;
        $(thisRow).find("th").each(function(){
            if(skipColumn.indexOf(thIndex)===-1){
                let colspan = parseInt($(this).attr("colspan") || 1);
                let rowspan = parseInt($(this).attr("rowspan") || 1);
                if(rowspan>1){
                    mergeCellObj[`${String.fromCharCode(65+(thIndex))}${$(thisRow).index()+2}`] = `${String.fromCharCode(65+(thIndex))}${$(thisRow).index()+2}:${String.fromCharCode(65+(thIndex))}${$(thisRow).index()+1+parseInt(rowspan)}`;
                    for (let j = $(thisRow).index()+2+1; j < ($(thisRow).index()+2+rowspan); j++) {
                        oldRowSpanData[`${String.fromCharCode(65+(thIndex))}${j}`] = $(this).text();
                    }
                }

                if(colspan>1){
                    mergeCellObj[`${String.fromCharCode(65+(thIndex))}${$(thisRow).index()+2}`] = `${String.fromCharCode(65+(thIndex))}${$(thisRow).index()+2}:${String.fromCharCode(65+(thIndex)+parseInt(colspan)-1)}${$(thisRow).index()+2}`;
                    thIndex = thIndex + colspan;
                }else{
                    thIndex = thIndex + 1;
                }

                for (let i = 0; i < ($(tbody).find("tr:first").find("td").length-skipColumn?.length); i++) {
                    if(oldRowSpanData[`${String.fromCharCode(65+(i))}${$(thisRow).index()+2}`]){
                        currentHeaderRow.push(oldRowSpanData[`${String.fromCharCode(65+(i))}${$(thisRow).index()+2}`])
                        delete oldRowSpanData[`${String.fromCharCode(65+(i))}${$(thisRow).index()+2}`];
                    }
                }

                for (let i = 0; i < colspan; i++) {
                    if(skipColumn.indexOf(thIndex)===-1){
                        currentHeaderRow.push($(this).text())
                    }
                }
            }
        });
        
        headerRow.push(currentHeaderRow);
    })
    tableLength = headerRow.length+1;
    headerRow.map(hrow=>workSheet.addRow(hrow));
    Object.keys(mergeCellObj).map(mc=>{
        workSheet.mergeCells(mergeCellObj[mc]);
    })


    const findRowSpan = (trIndex, tdIndex) => {
        let rowSpan = 1;
        for (let ind = 0; ind < $(tbody).find("tr").length-1; ind++) {
            if(ind>=trIndex){
                const currentTr = $(tbody).find("tr").eq(ind)
                let nextTrTd = $(tbody).find("tr").eq(ind+1).find("td").eq(tdIndex)
                let currentTrTd = $(tbody).find("tr").eq(ind).find("td").eq(tdIndex)

                let nextText = $(nextTrTd).text() || ($(nextTrTd).find("input").attr("type")==="checkbox" ? $(nextTrTd).find("input").is(":checked") : $(nextTrTd).find("input").val() ) || $(nextTrTd).find("select").val()
                let currentText = $(currentTrTd).text() || ($(currentTrTd).find("input").attr("type")==="checkbox" ? $(currentTrTd).find("input").is(":checked") : $(currentTrTd).find("input").val() ) || $(currentTrTd).find("select").val()

                if($(tbody).find("tr").eq(ind+1) && nextText === currentText){
                    rowSpan++;
                }else{
                    break;
                }
            }
        }
        return rowSpan;
    }

    // table body start
    let tBodyMergeCellObj = {};
    let skipSeachRowSpan = {};
    $(tbody).find("tr").each(function(){
        const currentTr = $(this)
        let currentTrText = [];
        $(currentTr).find("td").each(function(){ 
            if(skipColumn.length===0 || skipColumn.indexOf($(this).index())===-1){
                console.log("==============", skipColumn, $(this).index())
                currentTrText.push($(this).text() || ($(this).find("input").attr("type")==="checkbox" ? $(this).find("input").is(":checked") : $(this).find("input").val() ) || $(this).find("select").val())
                
                // for RorSpan
                let rowspan =  1;
                if(!skipSeachRowSpan[$(this).index()] || skipSeachRowSpan[$(this).index()]===1){
                    rowspan =  findRowSpan($(currentTr).index(), $(this).index());
                    skipSeachRowSpan[$(this).index()] = rowspan;
                }else{
                    skipSeachRowSpan[$(this).index()] = skipSeachRowSpan[$(this).index()]-1;
                }
                if(rowspan>1){
                    console.log("rowspan", rowspan)
                    tBodyMergeCellObj[`${String.fromCharCode(65+$(this).index())}${headerRow.length+2+$(currentTr).index()}`] = `${String.fromCharCode(65+$(this).index())}${headerRow.length+2+$(currentTr).index()}:${String.fromCharCode(65+$(this).index())}${headerRow.length+1+$(currentTr).index()+rowspan}`;
                }
            }
        });

        workSheet.addRow(currentTrText);
        tableLength++;
    }) 
    // for RorSpan
    Object.keys(tBodyMergeCellObj).map(mc=>{
        workSheet.mergeCells(tBodyMergeCellObj[mc]);
    })
    // table body end

    let tfootmergeCellObj = {};
    let tfootheaderRow = [];
    let tfootoldRowSpanData = {};
    $(reportRelatedData.table).find("tfoot tr").each(function () {
        const thisRow = $(this);
        let currentHeaderRow = [];

        let thIndex = 0;
        $(thisRow).find("th").each(function(){
            if(skipColumn.indexOf(thIndex)===-1){
                let colspan = parseInt($(this).attr("colspan") || 1);
                let rowspan = parseInt($(this).attr("rowspan") || 1);
                // $(tbody).find("tr").length
                if(rowspan>1){
                    tfootmergeCellObj[`${String.fromCharCode(65+(thIndex))}${tableLength+1}`] = `${String.fromCharCode(65+(thIndex))}${tableLength+1}:${String.fromCharCode(65+(thIndex))}${tableLength+1+parseInt(rowspan)}`;
                    for (let j = tableLength+1+1; j < (tableLength+1+rowspan); j++) {
                        tfootoldRowSpanData[`${String.fromCharCode(65+(thIndex))}${j}`] = $(this).text();
                    }
                }

                if(colspan>1){
                    tfootmergeCellObj[`${String.fromCharCode(65+(thIndex))}${tableLength+1}`] = `${String.fromCharCode(65+(thIndex))}${tableLength+1}:${String.fromCharCode(65+(thIndex)+parseInt(colspan)-1)}${tableLength+1}`;
                }

                for (let i = 0; i < colspan; i++) {
                    if(tfootoldRowSpanData[`${String.fromCharCode(65+(i))}${tableLength+1}`]){
                        currentHeaderRow.push(tfootoldRowSpanData[`${String.fromCharCode(65+(i))}${tableLength+1}`])
                        delete tfootoldRowSpanData[`${String.fromCharCode(65+(i))}${tableLength+1}`];
                    }
                    currentHeaderRow.push($(this).text())
                    thIndex++;
                }
            }
        });

        tfootheaderRow.push(currentHeaderRow);
    })
    if(tfootheaderRow.length){
        tfootheaderRow.map(hrow=>workSheet.addRow(hrow))
        Object.keys(tfootmergeCellObj).map(mc=>{
            workSheet.mergeCells(tfootmergeCellObj[mc]);
        })
    }

    workSheet.columns.forEach((column, i) => {
        if(i>0){
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, function (cell) {
                var columnLength = cell.value ? cell.value.toString().length : 10;
                if (columnLength > maxLength) {
                    maxLength = columnLength;
                }
            });

            column.width = maxLength < 10 ? 10 : maxLength === 10     ? 15 : maxLength > 35 ? 35 : maxLength;
        }
    });


    workSheet.eachRow((row, rowNum) => {
        row.eachCell((cell, cellNum) => {
            if (rowNum > 4) {
                cell.alignment = {
                    wrapText: true,
                    vertical: "middle",
                };
            }
            if((rowNum === (tableLength+1) && cellNum <= workSheet.columns.length && tfootheaderRow.length) || (rowNum < headerRow.length+2  && rowNum > 1)){
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: {
                        argb: 'FF2b4a91'
                    }
                }
                cell.alignment = {
                    horizontal: 'right',
                    vertical: 'middle'
                }
                cell.font = { color: { argb: 'FFFFFFFF' }, bold: true, size: 12, name: 'Trebuchet MS' }
            }
        });
    });
};


export default ByTableHtml