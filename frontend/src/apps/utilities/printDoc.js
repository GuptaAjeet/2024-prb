import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import columns from "./columns";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function getDocDefinition(
    printParams,
    agGridApi,
    agGridColumnApi,
    data,
    columns=[],
    functinName
  ) {
    const
      PDF_HEADER_COLOR = '#f8f8f8',
      PDF_INNER_BORDER_COLOR = '#dde2eb',
      PDF_OUTER_BORDER_COLOR = '#babfc7',
      PDF_ODD_BKG_COLOR = '#dde2eb',
      PDF_EVEN_BKG_COLOR = '#dde2eb',
      PDF_HEADER_HEIGHT = 25,
      PDF_ROW_HEIGHT = 15,
      PDF_PAGE_ORITENTATION = "landscape",
      PDF_WITH_CELL_FORMATTING = true,
      PDF_WITH_COLUMNS_AS_LINKS = true,
      PDF_SELECTED_ROWS_ONLY = false,
      PDF_WITH_HEADER_IMAGE = true,
      PDF_WITH_FOOTER_PAGE_COUNT = true,
      PDF_LOGO = 'https://prabandh.education.gov.in/static/media/emblem.0f1110c62e826b2ac82c.png';
    
    const widths = columns.map(() => (100 / columns.length).toString()+"%")

    return (function () {
      
      const header = PDF_WITH_HEADER_IMAGE
        ? {
          columns: [
            { image: 'ag-grid-logo', width: 200, alignment: 'left', color:'#021a3b', border: [0, 0, 0, 1]}, 
            { text: 'PRABANDH', bold: true, color:'#021a3b', fontSize: 30, alignment: 'right', width: '*', border: [0, 0, 0, 1]},
            { text: '', bold: true, color:'#021a3b', fontSize: 30, alignment: 'right', width: '1', border: [1, 1, 1, 1]},
            { image: 'ag-grid-logo', width: 200, alignment: 'right', color:'#021a3b', border: [0, 0, 1, 1]}, 
          ],
          margin: [15,10,15,10], 
        }
        : null;
  
      const footer = PDF_WITH_FOOTER_PAGE_COUNT
        ? function (currentPage, pageCount) {

            const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'  });
            return {
              columns: [
                { 
                  text: today, 
                  alignment: 'left', 
                  width: '50%', 
                  // background: "#2b4a91" 
                },
                { 
                  text: currentPage.toString() + ' of ' + pageCount, 
                  alignment: 'right', 
                  width: '*', 
                  // background: "#e7515a" 
                },
              ],
              margin: [15, 0, 15, 0],
            };
          }
        : null;
        
      const body = [
        // , colSpan: 2
        // , colSpan: 2
        columns.map(item=>{
          item.text= item.headerName; 
          return {
            ...item, 
            style: "tableHeader", 
            borderWidth: 0.5
          };
        }), 
        ...data.map((item,i)=>{ 
          return Object.entries(item).filter(([key, value]) => key !== 'srl').map(([key, text]) =>{
            return { 
              text, 
              style: "tableCell", 
              fillColor: (i%2===1 ? '#e7e7e7' : '#fff') 
            }
          }); 
        })
      ]
      console.log("body", body)

      const docDefintiion = {
        pageOrientation: PDF_PAGE_ORITENTATION,
        header,
        footer,
        content: [
          {
            stack: [
              { text: '\n Costing Sheet \n\n',color: '#cf2c35', fontSize: 30,bold: true,alignment: 'center', },
              { text: '(Samagra Shiksha) \n\n',color: '#cf2c35', fontSize: 30,bold: true,alignment: 'center', },
              { text: 'of \n\n',color: '#cf2c35', fontSize: 20,bold: true,alignment: 'center', },
              { text: 'Goa \n\n',color: '#cf2c35', fontSize: 30,bold: true,alignment: 'center', },
              { text: '2024-2025 \n\n\n\n',color: '#cf2c35', fontSize: 30,bold: true,alignment: 'center', },
              { text: '(Prepared by - Goa)',color: '#042a61',fontSize: 18,bold: true,alignment: 'center', },
            ]
          },
          {
            text: 'Summary at a Glance',fontSize: 20,bold: true,alignment: 'center', pageBreak: 'before'
          },
          {
            style: 'myTable2',
            table: {
              headerRows:1,
              widths:["25%", "25%", "25%", "25%"],
              body: [[
                    {
                        "headerName": "Name",
                        "field": "user_name",
                        "filter": "agMultiColumnFilter",
                        "text": "Name",
                        "style": "tableHeader",
                        "borderWidth": 0.5,
                        "fillColor": "#2b4a91",
                        "_margin": [0,3,0,3],
                        "_inlines": [],
                        "_minWidth": 29.2080078125,
                        "_maxWidth": 29.2080078125,
                        "positions": [],
                        colSpan: 2
                    },
                    {},
                    {
                        "headerName": "Mobile Number",
                        "field": "user_mobile",
                        "filter": "agMultiColumnFilter",
                        "width": 150,
                        "text": "Mobile Number",
                        "style": "tableHeader",
                        "borderWidth": 0.5,
                        "fillColor": "#2b4a91",
                        "_margin": [0,3,0,3],
                        "_inlines": [],
                        "_minWidth": 39.466796875,
                        "_maxWidth": 75.7431640625,
                        "positions": [],
                        colSpan: 2
                    },
                    {}
                ],
                [
                  {
                      "headerName": "Name",
                      "field": "user_name",
                      "filter": "agMultiColumnFilter",
                      "text": "Name",
                      "style": "tableHeader",
                      "borderWidth": 0.5,
                      "fillColor": "#2b4a91",
                      "_margin": [0,3,0,3],
                      "_inlines": [],
                      "_minWidth": 29.2080078125,
                      "_maxWidth": 29.2080078125,
                      "positions": [],
                  },
                  {
                      "headerName": "Name",
                      "field": "user_name",
                      "filter": "agMultiColumnFilter",
                      "text": "Name",
                      "style": "tableHeader",
                      "borderWidth": 0.5,
                      "fillColor": "#2b4a91",
                      "_margin": [0,3,0,3],
                      "_inlines": [],
                      "_minWidth": 29.2080078125,
                      "_maxWidth": 29.2080078125,
                      "positions": [],
                  },
                  {
                      "headerName": "Mobile Number",
                      "field": "user_mobile",
                      "filter": "agMultiColumnFilter",
                      "width": 150,
                      "text": "Mobile Number",
                      "style": "tableHeader",
                      "borderWidth": 0.5,
                      "fillColor": "#2b4a91",
                      "_margin": [0,3,0,3],
                      "_inlines": [],
                      "_minWidth": 39.466796875,
                      "_maxWidth": 75.7431640625,
                      "positions": []
                  },
                  {
                      "headerName": "Email",
                      "field": "user_email",
                      "filter": "agMultiColumnFilter",
                      "text": "Email",
                      "style": "tableHeader",
                      "borderWidth": 0.5,
                      "fillColor": "#2b4a91",
                      "_margin": [0,3,0,3],
                      "_inlines": [],
                      "_minWidth": 27.33349609375,
                      "_maxWidth": 27.33349609375,
                      "positions": []
                  }
                ],
                [
                  {
                      "text": " Prabandh Admin",
                      "style": "tableCell",
                      "fillColor": "#fff",
                      "_margin": null,
                      "_inlines": [],
                      "_minWidth": 38.3994140625,
                      "_maxWidth": 66.6298828125,
                  },
                  {
                      "text": "9999999999",
                      "style": "tableCell",
                      "fillColor": "#fff",
                      "_margin": null,
                      "_inlines": [],
                      "_minWidth": 50.58105468749999,
                      "_maxWidth": 50.58105468749999,
                      "positions": [
                          {
                              "pageNumber": 2,
                              "pageOrientation": "landscape",
                              "pageInnerHeight": 514.28,
                              "pageInnerWidth": 811.89,
                              "left": 121.36125,
                              "top": 81.890625,
                              "verticalRatio": 0.0522879073656374,
                              "horizontalRatio": 0.1310045079998522
                          }
                      ]
                  },
                  {
                      "text": " prabandh-edu@gov.in",
                      "style": "tableCell",
                      "fillColor": "#fff",
                      "_margin": null,
                      "_inlines": [],
                      "_minWidth": 46.4326171875,
                      "_maxWidth": 86.6953125,
                      "positions": [
                          {
                              "pageNumber": 2,
                              "pageOrientation": "landscape",
                              "pageInnerHeight": 514.28,
                              "pageInnerWidth": 811.89,
                              "left": 222.7225,
                              "top": 81.890625,
                              "verticalRatio": 0.0522879073656374,
                              "horizontalRatio": 0.25585054625626624
                          }
                      ]
                  },
                  {
                      "text": " prabandh-edu@gov.in",
                      "style": "tableCell",
                      "fillColor": "#fff",
                      "_margin": null,
                      "_inlines": [],
                      "_minWidth": 46.4326171875,
                      "_maxWidth": 86.6953125,
                      "positions": [
                          {
                              "pageNumber": 2,
                              "pageOrientation": "landscape",
                              "pageInnerHeight": 514.28,
                              "pageInnerWidth": 811.89,
                              "left": 222.7225,
                              "top": 81.890625,
                              "verticalRatio": 0.0522879073656374,
                              "horizontalRatio": 0.25585054625626624
                          }
                      ]
                  },
                ]
              ],
              heights:15,
            }
          },
          {
            text: 'Tentative Proposed Release F.Y. 2024-25',fontSize: 20,bold: true,alignment: 'center',
          },
          {
            style: 'myTable2',
            table: {
              headerRows:1,
              widths:["16.666666666%", "16.666666666%", "16.666666666%", "16.666666666%", "16.666666666%", "16.666666666%"],
              body: [[
                    {
                        "headerName": "Name",
                        "field": "user_name",
                        "filter": "agMultiColumnFilter",
                        "text": "Name",
                        "style": "tableHeader",
                        "borderWidth": 0.5,
                        "fillColor": "#328ad1",
                        "_margin": [0,3,0,3],
                        "_inlines": [],
                        "_minWidth": 29.2080078125,
                        "_maxWidth": 29.2080078125,
                        "positions": [],
                    },
                    {
                      "text": " Prabandh Admin",
                      "style": "tableCell",
                      "fillColor": "#fff",
                      "_margin": [0,3,0,3],
                    },
                    {
                        "headerName": "Mobile Number",
                        "field": "user_mobile",
                        "filter": "agMultiColumnFilter",
                        "width": 150,
                        "text": "Mobile Number",
                        "style": "tableHeader",
                        "borderWidth": 0.5,
                        "fillColor": "#328ad1",
                        "_margin": [0,3,0,3],
                        "_inlines": [],
                        "_minWidth": 39.466796875,
                        "_maxWidth": 75.7431640625,
                        "positions": [],
                    },
                    {
                      "text": " Prabandh Admin",
                      "style": "tableCell",
                      "fillColor": "#fff",
                      "_margin": [0,3,0,3],
                    },
                    {
                        "headerName": "Mobile Number",
                        "field": "user_mobile",
                        "filter": "agMultiColumnFilter",
                        "width": 150,
                        "text": "Mobile Number",
                        "style": "tableHeader",
                        "borderWidth": 0.5,
                        "fillColor": "#328ad1",
                        "_margin": [0,3,0,3],
                        "_inlines": [],
                        "_minWidth": 39.466796875,
                        "_maxWidth": 75.7431640625,
                        "positions": [],
                    },
                    {
                      "text": "aaaaaaaa 111",
                      "style": "tableCell",
                      "fillColor": "#fff",
                      "_margin": [0,3,0,3],
                    },
                ],
              ],
              heights:15,
            }
          },
          {
            text: 'Anticipated Expenditure Details till 31st March 2024',fontSize: 20,bold: true,alignment: 'center',
          },
          {
            style: 'myTable',
            table: {
              headerRows:1,
              widths:widths,
              body,
              heights:15,
            },
            layout: {
              // fillColor: "gray",
              // hLineWidth: (i, node) => i === 0 || i === node.table.body.length ? 1 : 1,
              // vLineWidth: (i, node) => i === 0 || i === node.table.body.length ? 1 : 1,
              // hLineColor: "green",
              // vLineColor: "pink",
            }
          },
        ],
        images: {
          'ag-grid-logo': PDF_LOGO,
        },
        styles: {
          myTable: {
            margin: [0, 20, 0, 20],
          },
          myTable2: {
            margin: [0, 20, 0, 20],
          },
          tableHeader: {
            bold: true,
            margin: [0, 3, 0, 3],
            fillColor: '#2b4a91',
            color: "white",
            alignment: "left",
            fontSize: 11
          },
          tableCell: {
            // fillColor: '#e7515a',
            fontSize: 9
          }
        },
        pageMargins: [ 15, PDF_WITH_HEADER_IMAGE ? 55 : 20, 15, PDF_WITH_FOOTER_PAGE_COUNT ? 26 : 10],
        // pageBreakBefore: function(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
        //   // Add a page break before the first node on each page after the first one
        //   return (followingNodesOnPage.length === 0 && currentNode !== null);
        // },
      };
  
      return docDefintiion;
    })();
}
  

function printDoc(printParams, gridApi, columnApi,data, columns) {
    const docDefinition = getDocDefinition(printParams, gridApi, columnApi, data, columns);
    pdfMake.createPdf(docDefinition).download();
}

export default printDoc;