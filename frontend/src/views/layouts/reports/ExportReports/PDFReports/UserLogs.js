import * as echarts from "echarts";
// import api from "../../../../../apps/utilities/api";
import { Hash } from "../../../../../apps";
import axios from "axios";
import { REACT_APP_URL } from "../../../../../env";
import store from "../../../../../redux/app/store";

const UserLogs = async (data, columns) => {
  let styles = {
      myTable: {
        margin: [0, 20, 0, 20],
      },
      myTable2: {
        margin: [0, 20, 0, 20],
      },
      tableHeader: {
        bold: true,
        margin: [0, 3, 0, 3],
        fillColor: "#2b4a91",
        color: "white",
        alignment: "left",
        fontSize: 11,
      },
      tableCell: {
        // fillColor: '#e7515a',
        fontSize: 9,
      },
    },
    content = [];

  const widths = columns.map(() => (100 / columns.length).toString() + "%");

  const body = [
    // , colSpan: 2
    // , colSpan: 2
    columns.map((item) => {
      item.text = item.headerName;
      return {
        ...item,
        style: "tableHeader",
        borderWidth: 0.5,
      };
    }),
    ...data.map((item, i) => {
      return Object.entries(item)
        .filter(([key, value]) => key !== "srl")
        .map(([key, text]) => {
          return {
            text,
            style: "tableCell",
            fillColor: i % 2 === 1 ? "#e7e7e7" : "#fff",
          };
        });
    }),
  ];

  // Create the echarts instance
  let div = document.createElement("div");
  div.style.height = "500px";
  div.style.width = "500px";
  var myChart = echarts.init(div);

  const apiYear = store.getState().year.year;
  const apiVersion = store.getState().version.version;

  const object = await axios.post(
    REACT_APP_URL + "api/admin-users/dashboard",
    {
      data: {
        state_id: null,
        district_id: null,
        role: 1,
        page: 1,
        limit: 10,
        reload: 0,
        where: {
          value: "",
        },
      },
      secure: Hash.encrypt(
        JSON.stringify({
          state_id: null,
          district_id: null,
          role: 1,
          page: 1,
          limit: 10,
          reload: 0,
          where: {
            value: "",
          },
        })
      ),
    },
    {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        API_Year: apiYear,
        API_Version: apiVersion,
      },
    }
  );

  const chartData = object?.data?.data?.users?.map((v) => ({
    value: +v.financial_amount_recuring + +v.financial_amount_nonrecuring,
    name: v.scheme_name.substring(0, 10) + " " + v.major_component_name,
  }));

  let userTable = object?.data?.data?.users?.map((v, index) => {
    return [
      { text: index + 1 },
      {
        text:
          v.scheme_name.substring(0, 10) +
          " " +
          v.major_component_name +
          " (₹ In Lakhs)",
      },
      { text: +v.financial_amount_recuring + +v.financial_amount_nonrecuring },
    ];
  });

  let options = {
    // "legend": {
    //   "orient": 'horizontal',
    //   "bottom": 0,
    //   "fontSize": 8,
    //   "data": object?.data?.data?.users?.map((v) => (v.scheme_name.substring(0, 10) + " " + v.major_component_name)),
    // },
    title: {
      text: "Components Wise Proposal (figures (In Lakhs))",
      left: "center",
      subtext: "",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
      position: "outside",
      fontSize: 9,
    },
    series: [
      {
        name: "Scheme",
        type: "pie",
        color: [
          "#37A2DA",
          "#32C5E9",
          "#67E0E3",
          "#9FE6B8",
          "#FFDB5C",
          "#ff9f7f",
          "#fb7293",
          "#E062AE",
          "#E690D1",
          "#e7bcf3",
          "#9d96f5",
          "#8378EA",
          "#96BFFF",
        ],
        radius: "50%",
        label: {
          show: true, // Hide the labels
          // Other label configurations...
        },
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  // Draw the chart
  myChart.setOption(options);

  return new Promise((resolve) => {
    setTimeout(() => {
      const pieChartImg = myChart.getDataURL({
        type: "png",
        pixelRatio: 2, // Increase pixel ratio for better quality
        backgroundColor: "#fff", // Set background color if needed
        // excludeComponents: ['toolbox'], // Exclude unnecessary components from the exported image
      });

      content = [
        {
          stack: [
            { text: "Costing Sheet \n\n" },
            { text: "(Samagra Shiksha) \n\n" },
            { text: "of \n\n", fontSize: 20 },
            { text: "Goa \n\n" },
            { text: "2024-2025 \n\n" },
            { text: "(Prepared by - Goa)", color: "#042a61", fontSize: 18 },
          ],
          fontSize: 36,
          bold: true,
          color: "#cf3a42",
          alignment: "center",
        },
        // {
        //   canvas: [
        //     {
        //       type: 'path',
        //       d: 'M 0,20 L 100,160 Q 130,200 150,120 C 190,-40 200,200 300,150 L 400,90',
        //       dash: {length: 5},
        //       // lineWidth: 10,
        //       lineColor: 'blue',
        //     },
        //    ]
        // },
        {
          text: "Summary at a Glance",
          fontSize: 18,
          bold: true,
          alignment: "center",
          pageBreak: "before",
        },
        {
          style: "myTable2",
          table: {
            headerRows: 1,
            widths: [
              "12.5%",
              "12.5%",
              "12.5%",
              "12.5%",
              "12.5%",
              "12.5%",
              "12.5%",
              "12.5%",
            ],
            body: [
              [
                { text: "SNo", fillColor: "#328ad1", rowSpan: 2 },
                { text: "Particulars", fillColor: "#328ad1", rowSpan: 2 },
                {
                  text: "State Plan F.Y. 2024-2025",
                  fillColor: "#328ad1",
                  colSpan: 2,
                  alignment: "center",
                },
                {},
                {
                  text: "Total",
                  fillColor: "#328ad1",
                  rowSpan: 2,
                  alignment: "right",
                },
                {
                  text: "Budget Approved for F.Y. 2023-24",
                  fillColor: "#328ad1",
                  colSpan: 2,
                  alignment: "center",
                },
                {},
                {
                  text: "Total",
                  fillColor: "#328ad1",
                  rowSpan: 2,
                  alignment: "right",
                },
              ],
              [
                {},
                {},
                {
                  text: "Recurring",
                  fillColor: "#328ad1",
                  alignment: "center",
                },
                {
                  text: "Non-Recurring",
                  fillColor: "#328ad1",
                  alignment: "right",
                },
                {},
                {
                  text: "Recurring",
                  fillColor: "#328ad1",
                  alignment: "center",
                },
                {
                  text: "Non-Recurring",
                  fillColor: "#328ad1",
                  alignment: "right",
                },
                {},
              ],
              [
                { text: "1" },
                { text: "Elementary Education " },
                { text: 1086082.30231, alignment: "right" },
                { text: 700586.01748, alignment: "right" },
                { text: 1786668.31979, alignment: "right" },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
              ],
              [
                { text: "2" },
                { text: "Secondary Education " },
                { text: 1086082.30231, alignment: "right" },
                { text: 700586.01748, alignment: "right" },
                { text: 1786668.31979, alignment: "right" },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
              ],
              [
                { text: "3" },
                { text: "Teacher Education " },
                { text: 1086082.30231, alignment: "right" },
                { text: 700586.01748, alignment: "right" },
                { text: 1786668.31979, alignment: "right" },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
              ],
              [
                { text: "4" },
                { text: "Grand Total " },
                { text: 1086082.30231, alignment: "right" },
                { text: 700586.01748, alignment: "right" },
                { text: 1786668.31979, alignment: "right" },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
              ],

              [
                { text: "5" },
                { text: "Central Share(60.0%)" },
                { text: 1086082.30231, alignment: "right", colSpan: 2 },
                { text: 700586.01748, alignment: "right" },
                { text: 1786668.31979, alignment: "right" },
                { text: 0.0, alignment: "right", colSpan: 2 },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
              ],
              [
                { text: "6" },
                { text: "State Share(40.0%)" },
                { text: 1086082.30231, alignment: "right", colSpan: 2 },
                { text: 700586.01748, alignment: "right" },
                { text: 1786668.31979, alignment: "right" },
                { text: 0.0, alignment: "right", colSpan: 2 },
                { text: 0.0, alignment: "right" },
                { text: 0.0, alignment: "right" },
              ],
            ],
            heights: 15,
          },
          fontSize: 9,
        },
        {
          text: "Tentative Proposed Release F.Y. 2024-25",
          fontSize: 20,
          bold: true,
          alignment: "center",
        },
        {
          style: "myTable2",
          table: {
            headerRows: 1,
            widths: [
              "16.666666666%",
              "16.666666666%",
              "16.666666666%",
              "16.666666666%",
              "16.666666666%",
              "16.666666666%",
            ],
            body: [
              [
                {
                  headerName: "Name",
                  field: "user_name",
                  filter: "agMultiColumnFilter",
                  text: "Name",
                  style: "tableHeader",
                  borderWidth: 0.5,
                  fillColor: "#328ad1",
                  _margin: [0, 3, 0, 3],
                  _inlines: [],
                  _minWidth: 29.2080078125,
                  _maxWidth: 29.2080078125,
                  positions: [],
                },
                {
                  text: " Prabandh Admin",
                  style: "tableCell",
                  fillColor: "#fff",
                  _margin: [0, 3, 0, 3],
                },
                {
                  headerName: "Mobile Number",
                  field: "user_mobile",
                  filter: "agMultiColumnFilter",
                  width: 150,
                  text: "Mobile Number",
                  style: "tableHeader",
                  borderWidth: 0.5,
                  fillColor: "#328ad1",
                  _margin: [0, 3, 0, 3],
                  _inlines: [],
                  _minWidth: 39.466796875,
                  _maxWidth: 75.7431640625,
                  positions: [],
                },
                {
                  text: " Prabandh Admin",
                  style: "tableCell",
                  fillColor: "#fff",
                  _margin: [0, 3, 0, 3],
                },
                {
                  headerName: "Mobile Number",
                  field: "user_mobile",
                  filter: "agMultiColumnFilter",
                  width: 150,
                  text: "Mobile Number",
                  style: "tableHeader",
                  borderWidth: 0.5,
                  fillColor: "#328ad1",
                  _margin: [0, 3, 0, 3],
                  _inlines: [],
                  _minWidth: 39.466796875,
                  _maxWidth: 75.7431640625,
                  positions: [],
                },
                {
                  text: "aaaaaaaa 111",
                  style: "tableCell",
                  fillColor: "#fff",
                  _margin: [0, 3, 0, 3],
                },
              ],
            ],
            heights: 15,
          },
        },
        {
          text: "Anticipated Expenditure Details till 31st March 2024",
          fontSize: 20,
          bold: true,
          alignment: "center",
        },

        {
          text: "Summary at a Glance",
          fontSize: 18,
          bold: true,
          alignment: "center",
          pageBreak: "before",
        },

        {
          columns: [
            {
              style: "myTable2",
              table: {
                headerRows: 1,
                widths: ["13.333%", "43.333%", "43.333%"],
                body: [
                  [
                    { text: "SNo", fillColor: "#328ad1" },
                    { text: "Major Component", fillColor: "#328ad1" },
                    { text: "Proposal F.Y.2024-2025", fillColor: "#328ad1" },
                  ],
                  ...object?.data?.data?.users?.map((v, index) => {
                    return [
                      { text: index + 1 },
                      {
                        text:
                          v.scheme_name.substring(0, 10) +
                          " " +
                          v.major_component_name +
                          " (₹ In Lakhs)",
                      },
                      {
                        text:
                          +v.financial_amount_recuring +
                          +v.financial_amount_nonrecuring,
                      },
                    ];
                  }),
                ],
                heights: 15,
              },
              fontSize: 9,
              width: "50%",
            },
            {
              image: pieChartImg,
              width: 400,
              alignment: "center",
              color: "#021a3b",
              border: [0, 0, 0, 1],
            },
          ],
        },

        // {
        //   style: 'myTable',
        //   table: {
        //     headerRows:1,
        //     widths:widths,
        //     body,
        //     heights:15,
        //   },
        //   layout: {
        //     // fillColor: "gray",
        //     // hLineWidth: (i, node) => i === 0 || i === node.table.body.length ? 1 : 1,
        //     // vLineWidth: (i, node) => i === 0 || i === node.table.body.length ? 1 : 1,
        //     // hLineColor: "green",
        //     // vLineColor: "pink",
        //   }
        // },
      ];

      resolve({ content, styles });
    }, 500);
  });

  // return {content, styles};
};

export default UserLogs;
