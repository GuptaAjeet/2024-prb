import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import UserLogs from "./UserLogs";

// import * as pdfjs from 'pdfjs-dist';

// pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.mjs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const exportToPdfFunctions = {
  UserLogs,
};

function getDocDefinition(data, columns = [], reportName) {
  const PDF_HEADER_COLOR = "#f8f8f8",
    PDF_INNER_BORDER_COLOR = "#dde2eb",
    PDF_OUTER_BORDER_COLOR = "#babfc7",
    PDF_ODD_BKG_COLOR = "#dde2eb",
    PDF_EVEN_BKG_COLOR = "#dde2eb",
    PDF_HEADER_HEIGHT = 25,
    PDF_ROW_HEIGHT = 15,
    PDF_PAGE_ORITENTATION = "landscape",
    PDF_WITH_CELL_FORMATTING = true,
    PDF_WITH_COLUMNS_AS_LINKS = true,
    PDF_SELECTED_ROWS_ONLY = false,
    PDF_WITH_HEADER_IMAGE = true,
    PDF_WITH_FOOTER_PAGE_COUNT = true,
    PDF_LOGO =
      "https://prabandh.education.gov.in/static/media/emblem.0f1110c62e826b2ac82c.png";
  
      

  return new Promise((resolve, reject) => {
    exportToPdfFunctions[reportName](data, columns).then(
      ({ content, styles }) => {
        const header = PDF_WITH_HEADER_IMAGE
          ? {
              columns: [
                {
                  image: "ag-grid-logo",
                  width: 200,
                  alignment: "left",
                  color: "#021a3b",
                  border: [0, 0, 0, 1],
                },
                {
                  text: "PRABANDH",
                  bold: true,
                  color: "#021a3b",
                  fontSize: 30,
                  alignment: "right",
                  width: "*",
                  border: [0, 0, 0, 1],
                },
                {
                  text: "",
                  bold: true,
                  color: "#021a3b",
                  fontSize: 30,
                  alignment: "right",
                  width: "1",
                  border: [1, 1, 1, 1],
                },
                {
                  image: "image2",
                  width: 200,
                  alignment: "right",
                  color: "#021a3b",
                  border: [0, 0, 1, 1],
                },
              ],
              margin: [15, 10, 15, 10],
            }
          : null;

        // const footer = PDF_WITH_FOOTER_PAGE_COUNT
        //     ? function (currentPage, pageCount) {

        //         const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'  });
        //         return {
        //         columns: [
        //             {
        //             text: today,
        //             alignment: 'left',
        //             width: '50%',
        //             // background: "#2b4a91"
        //             },
        //             {
        //             text: currentPage.toString() + ' of ' + pageCount,
        //             alignment: 'right',
        //             width: '*',
        //             // background: "#e7515a"
        //             },
        //         ],
        //         margin: [15, 0, 15, 0],
        //         };
        //     }
        //     : null;
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true,
        });
        const footer = PDF_WITH_FOOTER_PAGE_COUNT
          ? function (currentPage, pageCount) {
              const today = new Date().toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              });
              return {
                columns: [
                  {
                    columns: [
                      {
                        text: "PRABANDH | ",
                        bold: true,
                        color: "#2b4a91",
                        fontSize: 20,
                        alignment: "left",
                        width: "*",
                      },
                      {
                        image: "ag-grid-logo",
                        width: 120,
                        alignment: "left",
                        color: "#021a3b",
                      },
                    ],
                    alignment: "left",
                    width: "30%",
                  },
                  {
                    text: "",
                    alignment: "center",
                    width: "10%",
                  },
                  {
                    text:
                      "Page no " + currentPage.toString() + " of " + pageCount,
                    alignment: "center",
                    width: "20%",
                    // background: "#e7515a"
                  },
                  {
                    text: "",
                    alignment: "center",
                    width: "18%",
                  },
                  {
                    text: `Generated on ${formattedDate} 
                        https://prabandh.education.gov.in`,
                    alignment: "left",
                    width: "22%",
                    color: "#2b4a91",
                    fontSize: 10,
                    // background: "#2b4a91"
                  },
                ],
                margin: [15, 0, 15, 0],
              };
            }
          : null;

        const docDefintiion = {
          watermark: {
            text: "PRABANDH",
            color: "#2b4a91",
            opacity: 0.2,
            bold: true,
            italics: false,
          },
          pageOrientation: PDF_PAGE_ORITENTATION,
          // header,
          footer,
          content: content,
          images: {
            "ag-grid-logo": PDF_LOGO,
            // ...images
          },
          styles: { ...styles },
          pageMargins: [
            15,
            PDF_WITH_HEADER_IMAGE ? 55 : 20,
            15,
            PDF_WITH_FOOTER_PAGE_COUNT ? 26 : 10,
          ],
          // pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
          //   // Add a page break before the first node on each page after the first one
          //   return (followingNodesOnPage.length === 0 && currentNode !== null);
          // },
        };

        resolve(docDefintiion);
      }
    );
  });
}

// const convertPdfToImages = async (pdfUrl) => {
//     const loadingTask = pdfjs.getDocument(pdfUrl);
//     const pdf = await loadingTask.promise;

//     const numPages = pdf.numPages;
//     const imageObj = {};

//     for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
//       const page = await pdf.getPage(pageNumber);
//       const viewport = page.getViewport({ scale: 0.1 }); // You can adjust the scale as needed

//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d');
//       canvas.width = viewport.width;
//       canvas.height = viewport.height;

//       const renderTask = page.render({ canvasContext: context, viewport });
//       await renderTask.promise;

//       const imageDataUrl = canvas.toDataURL('image/png');
//       imageObj[`image${pageNumber}`] = imageDataUrl;
//     }
//     return imageObj;
// };

async function printDoc(data, columns, reportName) {
  // const pdfUrl = 'https://getsamplefiles.com/download/pdf/sample-1.pdf';
  // let images = await convertPdfToImages(pdfUrl);

  const docDefinition = await getDocDefinition(data, columns, reportName);
  pdfMake.createPdf(docDefinition).download();
}

export default printDoc;
