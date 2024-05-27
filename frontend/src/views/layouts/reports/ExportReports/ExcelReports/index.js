
import { format } from "date-fns";
import ExcelJS from "exceljs";
import FileSaver from "file-saver";
import districtProgressExcelReport from "./ProgressReport";
import spillOverExcelReport from "./SpillOverReport";
import districtExcelReport from "./DistrictReport";
import tableToExcelReport from "./GenericTableReport";
import stateExcelReport from "./StateReport";
import Vieweditformstate from "./Vieweditformstate";
import stateProposedExcelReport from "./StateProposedReport";
import viewReportToExcel from "./viewReport";
import Spilloversecond from "./Spilloversecond";
import PABReport from "./PABReport";


const exportToExcelFunctions = {
    progressReport: districtProgressExcelReport,
    spillOverReport: spillOverExcelReport,
    districtReport: districtExcelReport,
    genericReport: tableToExcelReport,
    stateReport: stateExcelReport,
    vieweditformstate: Vieweditformstate,
    stateProposedReport: stateProposedExcelReport,
    viewReport: viewReportToExcel,
    spilloversecond: Spilloversecond,
    pabReport: PABReport,
    
}


const exportToExcel = (reportName, reportRelatedData) => {
    const workBook = new ExcelJS.Workbook();
    const workSheet = workBook.addWorksheet(reportRelatedData?.sheetName || "Sheet 1");

    let fileName = reportRelatedData?.fileName || Date.now().toString();

    // if (reportRelatedData?.reportData?.length > 0) {
    //     exportToExcelFunctions[reportName](reportRelatedData, workSheet)
    // }
    exportToExcelFunctions[reportName](reportRelatedData, workSheet)

    workBook.xlsx
        .writeBuffer()
        .then((buffer) =>
            FileSaver.saveAs(
                new Blob([buffer]),
                `${fileName}_report_${format(new Date(), "yyyy-MM-dd/HH:mm")}.xlsx`
            )
        )
}

export default exportToExcel;
