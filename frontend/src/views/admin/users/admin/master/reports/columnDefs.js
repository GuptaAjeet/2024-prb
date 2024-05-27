const COL_SELECTION = {
    headerCheckboxSelection: true,
    checkboxSelection: true,
    colId: "selection-col",
    maxWidth: 50,
    pdfExportOptions: {
        skipColumn: true
    }
};

const COL_ATHLETE = {
    headerName: "Scheme Name",
    field: "scheme_name",
  
    pdfExportOptions: {
        createURL: value => {
            if (!value) {
                return `https://en.wikipedia.org/wiki/${value.replace(/\s/g, "_")}`;
            }
            return `https://en.wikipedia.org/wiki/${value.replace(/\s/g, "_")}`;
        }
    },
 
};
const COL_COUNTRY = {
    headerName: "Major Component",
    field: "major_component_name",
    pdfExportOptions: {
        styles: {
          
            bold: true,
            color: "white",
            alignment: "center"
        }
    }
};
// const COL_AGE = {
//     headerName: "Recuring Nonrecuring",
//     field: "recuring_nonrecuring",
    
//     pdfExportOptions: {
//         skipColumn: false,
//         styles: {
          
//             bold: true,
//             color: "white",
//             alignment: "center"
//         }
//     }
// };
// const COL_DATE = {
//     headerName: "Date",
//     colId: "date",
//     valueGetter: params => {
//         if (params.node.group) {
//             return null;
//         }
//         let date = params.data.date;
//         var dd = String(date.getDate()).padStart(2, "0");
//         var mm = String(date.getMonth() + 1).padStart(2, "0"); //January is 0!
//         var yyyy = date.getFullYear();
//         return mm + "/" + dd + "/" + yyyy;
//     }
// };
const COL_SPORT = { headerName: "Sub Component", 
field: "sub_component_name",
pdfExportOptions: {
    skipColumn: false,
    styles: {
      
        bold: true,
        color: "white",
        alignment: "center"
    }
}
 };
 const Activity_Master = { headerName: "Activity Master", field: "activity_master_details_name", aggFunc: "sum" };
const COL_GOLD = { headerName: "Unit Cost", field: "PRAKASAM_financial_amount", aggFunc: "sum" };

const COL_GOLDp = { headerName: "Physical", field: "PRAKASAM_financial_amount", aggFunc: "sum" };
const COL_SILVER = { headerName: "Financial", field: "PRAKASAM_physical_quantity", aggFunc: "sum" };
const COL_BRONZE = { headerName: "Remarks", field: "PRAKASAM_unit_cost", aggFunc: "sum" };
const COL_GOLDh = { headerName: "Physical", field: "PRAKASAM_financial_amount", aggFunc: "sum" };
const COL_BRONZEhr = { headerName: "Financial", field: "PRAKASAM_unit_cost", aggFunc: "sum" };
const COL_BRONZEh = { headerName: "Unit Cost", field: "PRAKASAM_unit_cost", aggFunc: "sum" };


export const COLDEFS_WITH_GROUPING = [
    COL_SELECTION,
    {
        headerName: "Particulars",
        colId: "Particulars",
        children: [COL_COUNTRY, COL_SPORT,Activity_Master]
    },
   
    //COL_DATE,
    {
        headerName: "Particulars",
        colId: "Particulars",
        children: [COL_GOLDh, COL_BRONZEh, COL_BRONZEhr,COL_GOLDp]
    },
    {
        headerName: "Final Approved Outlay",
        colId: "Final Approved Outlay",
        children: [COL_GOLD, COL_SILVER, COL_BRONZE]
    }
];

export const COLDEFS_WITHOUT_GROUPING = [
   
    COL_ATHLETE,
    COL_SELECTION,
    COL_COUNTRY,
    COL_SPORT,
    //COL_AGE,
   // COL_DATE,
    COL_GOLD,
    COL_SILVER,
    COL_BRONZE,
    COL_GOLDh,

    COL_BRONZEh,
    COL_BRONZEhr,
    
];
