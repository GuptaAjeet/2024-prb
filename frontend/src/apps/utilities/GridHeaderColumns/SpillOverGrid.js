import CustomPinnedRowRenderer from "../customPinnedRow";
import quantityValidationFilter from "../quantityValidationFilter";
import amountValidationFilter from "../amountValidationFilter";

const headers = async (saveRow, FREEZE_DATA_ENTRY) => {
  console.log("freeze", FREEZE_DATA_ENTRY)
 return [
    {
      headerName: "S. No.",
      field: "index",
      width: 91,
    },
    {
      headerName: "Scheme",
      field: "scheme_name",
      filter: "agMultiColumnFilter",
      cellStyle: (params) => {
        return { textAlign: "left" };
      },
    },
    {
      headerName: "Major Component",
      field: "major_component_name",
      filter: "agMultiColumnFilter",
      width: 150,
      cellStyle: (params) => {
        return { textAlign: "left" };
      },
    },
    {
      headerName: "Sub Component",
      field: "sub_component_name",
      filter: "agMultiColumnFilter",
      cellStyle: (params) => {
        return { textAlign: "left" };
      },
    },
    {
      headerName: "Activity Master",
      field: "activity_master_name",
      filter: "agMultiColumnFilter",
      cellStyle: (params) => {
        return { textAlign: "left" };
      },
    },
    {
      headerName: "Sub Activity",
      field: "activity_master_details_name",
      filter: "agMultiColumnFilter",
      cellStyle: (params) => {
        return { textAlign: "left" };
      },
      cellRendererSelector: (params) => {
        if (params.node.rowPinned) {
          return {
            component: CustomPinnedRowRenderer,
            params: {
              style: { color: "#000", fontWeight: "bold" },
            },
          };
        } else {
          return undefined;
        }
      },
    },
    {
      headerName: "Fresh Approval 2023-2024",
      children: [
        {
          headerName: "Physical",
          field: "fresh_approval_physical_quantity",
          type: "rightAligned",
          cellStyle: (params) => {
            if (params.node.rowPinned) {
              return undefined;
            } else {
              return {
                border: "1px solid lightgray",
                borderRadius: "5px",
              };
            }
          },
          cellDataType: "number",
          cellEditor: quantityValidationFilter,
          width: 130,
          editable: (params) => {
            if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
              return undefined;
            } else {
              return true;
            }
          },
          cellRendererSelector: (params) => {
            if (params.node.rowPinned) {
              return {
                component: CustomPinnedRowRenderer,
                params: {
                  style: {
                    color: "#000",
                    fontWeight: "bold",
                  },
                },
              };
            } else {
              return undefined;
            }
          },
        },
        {
          headerName: "Financial (In ₹ Lakh)",
          field: "fresh_approval_financial_amount",
          type: "rightAligned",
          cellStyle: (params) => {
            if (params.node.rowPinned) {
              return undefined;
            } else {
              return {
                border: "1px solid lightgray",
                borderRadius: "5px",
              };
            }
          },
          cellDataType: "number",
          cellEditor: amountValidationFilter,
          width: 130,
          editable: (params) => {
            if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
              return false;
            } else {
              return true;
            }
          },
          cellRendererSelector: (params) => {
            if (params.node.rowPinned) {
              return {
                component: CustomPinnedRowRenderer,
                params: {
                  style: {
                    color: "#000",
                    fontWeight: "bold",
                  },
                },
              };
            } else {
              return undefined;
            }
          },
        },
      ],
    },
    {
      headerName:
        "Expenditure Against Fresh Approval 2023-2024",
      children: [
        {
          headerName: "Anticipated 31st March 2024",
          children: [
            {
              headerName: "Physical",
              children: [
                {
                  headerName: "In Progress",
                  field: "exp_against_fresh_app_phy_ip",
                  type: "rightAligned",
                  cellStyle: (params) => {
                    if (params.node.rowPinned) {
                      return undefined;
                    } else {
                      return {
                        border: "1px solid dimgray",
                        borderRadius: "5px",
                      };
                    }
                  },
                  cellDataType: "number",
                  cellEditor: quantityValidationFilter,
                  width: 130,
                  editable: (params) => {
                    if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
                      return false;
                    } else {
                      return true;
                    }
                  },
                  cellRendererSelector: (params) => {
                    if (params.node.rowPinned) {
                      return {
                        component: CustomPinnedRowRenderer,
                        params: {
                          style: {
                            color: "#000",
                            fontWeight: "bold",
                          },
                        },
                      };
                    } else {
                      return undefined;
                    }
                  },
                },
                {
                  headerName: "Not Started",
                  field: "exp_against_fresh_app_phy_ns",
                  type: "rightAligned",
                  cellStyle: (params) => {
                    if (params.node.rowPinned) {
                      return undefined;
                    } else {
                      return {
                        border: "1px solid dimgray",
                        borderRadius: "5px",
                      };
                    }
                  },
                  cellDataType: "number",
                  cellEditor: quantityValidationFilter,
                  width: 130,
                  editable: (params) => {
                    if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
                      return false;
                    } else {
                      return true;
                    }
                  },
                  cellRendererSelector: (params) => {
                    if (params.node.rowPinned) {
                      return {
                        component: CustomPinnedRowRenderer,
                        params: {
                          style: {
                            color: "#000",
                            fontWeight: "bold",
                          },
                        },
                      };
                    } else {
                      return undefined;
                    }
                  },
                },
                {
                  headerName: "Completed",
                  field: "exp_against_fresh_app_phy_c",
                  type: "rightAligned",
                  cellStyle: (params) => {
                    if (params.node.rowPinned) {
                      return undefined;
                    } else {
                      return {
                        border: "1px solid dimgray",
                        borderRadius: "5px",
                      };
                    }
                  },
                  cellDataType: "number",
                  cellEditor: quantityValidationFilter,
                  width: 130,
                  editable: (params) => {
                    if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
                      return false;
                    } else {
                      return true;
                    }
                  },
                  cellRendererSelector: (params) => {
                    if (params.node.rowPinned) {
                      return {
                        component: CustomPinnedRowRenderer,
                        params: {
                          style: {
                            color: "#000",
                            fontWeight: "bold",
                          },
                        },
                      };
                    } else {
                      return undefined;
                    }
                  },
                },
                {
                  headerName: "Total",
                  field: "fresh_total",
                  width: 130,
                  cellRendererSelector: (params) => {
                    if (params.node.rowPinned) {
                      return {
                        component: CustomPinnedRowRenderer,
                        params: {
                          style: {
                            color: "#000",
                            fontWeight: "bold",
                          },
                        },
                      };
                    } else {
                      // rows that are not pinned don't use any cell renderer
                      return undefined;
                    }
                  },
                  valueGetter: (params) =>
                    Number(
                      params.data
                        .exp_against_fresh_app_phy_ip +
                        params.data
                          .exp_against_fresh_app_phy_ns +
                        params.data
                          .exp_against_fresh_app_phy_c
                    ),
                },
              ],
            },
            {
              headerName: "Financial (In ₹ Lakh)",
              field: "exp_against_fresh_app_fin",
              type: "rightAligned",
              cellStyle: (params) => {
                if (params.node.rowPinned) {
                  return undefined;
                } else {
                  return {
                    border: "1px solid dimgray",
                    borderRadius: "5px",
                  };
                }
              },
              cellDataType: "number",
              cellEditor: amountValidationFilter,
              width: 130,
              editable: (params) => {
                if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
                  return false;
                } else {
                  return true;
                }
              },
              cellRendererSelector: (params) => {
                if (params.node.rowPinned) {
                  return {
                    component: CustomPinnedRowRenderer,
                    params: {
                      style: {
                        color: "#000",
                        fontWeight: "bold",
                      },
                    },
                  };
                } else {
                  return undefined;
                }
              },
            },
          ],
        },
      ],
    },
    {
      headerName:
        "Cumulative Spillover Approved As Per Minutes 2023-2024",
      children: [
        {
          headerName: "Physical",
          field: "physical_quantity_cummu_inception",
          type: "rightAligned",
          cellStyle: (params) => {
            if (params.node.rowPinned) {
              return undefined;
            } else {
              return {
                border: "1px solid lightgray",
                borderRadius: "5px",
              };
            }
          },
          cellDataType: "number",
          cellEditor: quantityValidationFilter,
          width: 130,
          editable: (params) => {
            if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
              return false;
            } else {
              return true;
            }
          },
          cellRendererSelector: (params) => {
            if (params.node.rowPinned) {
              return {
                component: CustomPinnedRowRenderer,
                params: {
                  style: {
                    color: "#000",
                    fontWeight: "bold",
                  },
                },
              };
            } else {
              return undefined;
            }
          },
        },
        {
          headerName: "Financial (In ₹ Lakh)",
          field: "financial_amount_cummu_inception",
          type: "rightAligned",
          cellStyle: (params) => {
            if (params.node.rowPinned) {
              return undefined;
            } else {
              return {
                border: "1px solid lightgray",
                borderRadius: "5px",
              };
            }
          },
          cellDataType: "number",
          cellEditor: amountValidationFilter,
          width: 130,
          editable: (params) => {
            if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
              return false;
            } else {
              return true;
            }
          },
          cellRendererSelector: (params) => {
            if (params.node.rowPinned) {
              return {
                component: CustomPinnedRowRenderer,
                params: {
                  style: {
                    color: "#000",
                    fontWeight: "bold",
                  },
                },
              };
            } else {
              return undefined;
            }
          },
        },
      ],
    },
    {
      headerName:
        "Expenditure Against Spillover Approved As Per Minutes 2023-2024",
      children: [
        {
          headerName: "Anticipated 31st March 2024",
          children: [
            {
              headerName: "Physical",
              children: [
                {
                  headerName: "In Progress",
                  field:
                    "physical_quantity_progress_progress_inception",
                  type: "rightAligned",
                  cellStyle: (params) => {
                    if (params.node.rowPinned) {
                      return undefined;
                    } else {
                      return {
                        border: "1px solid dimgray",
                        borderRadius: "5px",
                      };
                    }
                  },
                  cellDataType: "number",
                  cellEditor: quantityValidationFilter,
                  width: 130,
                  editable: (params) => {
                    if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
                      return false;
                    } else {
                      return true;
                    }
                  },
                  cellRendererSelector: (params) => {
                    if (params.node.rowPinned) {
                      return {
                        component: CustomPinnedRowRenderer,
                        params: {
                          style: {
                            color: "#000",
                            fontWeight: "bold",
                          },
                        },
                      };
                    } else {
                      return undefined;
                    }
                  },
                },
                {
                  headerName: "Not Started",
                  field:
                    "physical_quantity_progress_notstart_inception",
                  type: "rightAligned",
                  cellStyle: (params) => {
                    if (params.node.rowPinned) {
                      return undefined;
                    } else {
                      return {
                        border: "1px solid dimgray",
                        borderRadius: "5px",
                      };
                    }
                  },
                  cellDataType: "number",
                  cellEditor: quantityValidationFilter,
                  width: 130,
                  editable: (params) => {
                    if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
                      return false;
                    } else {
                      return true;
                    }
                  },
                  cellRendererSelector: (params) => {
                    if (params.node.rowPinned) {
                      return {
                        component: CustomPinnedRowRenderer,
                        params: {
                          style: {
                            color: "#000",
                            fontWeight: "bold",
                          },
                        },
                      };
                    } else {
                      return undefined;
                    }
                  },
                },
                {
                  headerName: "Completed",
                  field:
                    "physical_quantity_progress_complete_inception",
                  type: "rightAligned",
                  cellStyle: (params) => {
                    if (params.node.rowPinned) {
                      return undefined;
                    } else {
                      return {
                        border: "1px solid dimgray",
                        borderRadius: "5px",
                      };
                    }
                  },
                  cellDataType: "number",
                  cellEditor: quantityValidationFilter,
                  width: 130,
                  editable: (params) => {
                    if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
                      return false;
                    } else {
                      return true;
                    }
                  },
                  cellRendererSelector: (params) => {
                    if (params.node.rowPinned) {
                      return {
                        component: CustomPinnedRowRenderer,
                        params: {
                          style: {
                            color: "#000",
                            fontWeight: "bold",
                          },
                        },
                      };
                    } else {
                      return undefined;
                    }
                  },
                },
                {
                  headerName: "Total",
                  field: "exp_total",
                  width: 130,
                  cellRendererSelector: (params) => {
                    if (params.node.rowPinned) {
                      return {
                        component: CustomPinnedRowRenderer,
                        params: {
                          style: {
                            color: "#000",
                            fontWeight: "bold",
                          },
                        },
                      };
                    } else {
                      return undefined;
                    }
                  },
                  valueGetter: (params) =>
                    Number(
                      params.data
                        .physical_quantity_progress_progress_inception +
                        params.data
                          .physical_quantity_progress_notstart_inception +
                        params.data
                          .physical_quantity_progress_complete_inception
                    ),
                },
              ],
            },
            {
              headerName: "Financial (In ₹ Lakh)",
              field: "financial_amount_progress_inception",
              type: "rightAligned",
              cellStyle: (params) => {
                if (params.node.rowPinned) {
                  return undefined;
                } else {
                  return {
                    border: "1px solid dimgray",
                    borderRadius: "5px",
                  };
                }
              },
              cellDataType: "number",
              cellEditor: amountValidationFilter,
              width: 130,
              editable: (params) => {
                if (params.node.rowPinned || FREEZE_DATA_ENTRY) {
                  return false;
                } else {
                  return true;
                }
              },
              cellRendererSelector: (params) => {
                if (params.node.rowPinned) {
                  return {
                    component: CustomPinnedRowRenderer,
                    params: {
                      style: {
                        color: "#000",
                        fontWeight: "bold",
                      },
                    },
                  };
                } else {
                  return undefined;
                }
              },
            },
          ],
        },
      ],
    },
    {
      headerName: "Action",
      width: 170,
      sortable: false,
      cellRenderer: function StatusRenderer(params) {
        if (params.node.rowPinned) {
          return undefined;
        } else {
          return (
            <div className="text-left pd-2">
              <button
                className="btn btn-success btn-sm"
                disabled={FREEZE_DATA_ENTRY}
                onClick={() =>
                  saveRow(
                    params.data,
                    params?.data?.index - 1
                  )
                }
              >
                <i className="fa fa-save"></i>&nbsp;Save
              </button>
            </div>
          );
        }
      }
    }
  ]
};

const pinnedRow = () => {
  return [
    {
      name: "S.No.",
      key: "key",
    },
    {
      name: "Scheme",
      key: "scheme_name",
    },
    {
      name: "Major Component",
      key: "major_component_name",
    },
    {
      name: "Sub Component",
      key: "sub_component_name",
    },
    {
      name: "Activity Master",
      key: "activity_master_name",
    },
    {
      name: "Sub Activity",
      key: "activity_master_details_name",
    },
    {
      name: "Physical",
      key: "fresh_approval_physical_quantity",
    },
    {
      name: "Financial (In ₹ Lakh)",
      key: "fresh_approval_financial_amount",
    },
    {
      name: "In Progress",
      key: "exp_against_fresh_app_phy_ip",
    },
    {
      name: "Not Started",
      key: "exp_against_fresh_app_phy_ns",
    },
    {
      name: "Completed",
      key: "exp_against_fresh_app_phy_c",
    },
    {
      name: "Total",
      key: "fresh_total",
    },
    {
      name: "Financial (In ₹ Lakh)",
      key: "exp_against_fresh_app_fin",
    },
    {
      name: "Physical",
      key: "physical_quantity_cummu_inception",
    },
    {
      name: "Financial (In ₹ Lakh)",
      key: "financial_amount_cummu_inception",
    },
    {
      name: "In Progress",
      key: "physical_quantity_progress_progress_inception",
    },
    {
      name: "Not Started",
      key: "physical_quantity_progress_notstart_inception",
    },
    {
      name: "Completed",
      key: "physical_quantity_progress_complete_inception",
    },
    {
      name: "Total",
      key: "exp_total",
    },
    {
      name: "Financial (In ₹ Lakh)",
      key: "financial_amount_progress_inception",
    },
  ]
}

  export default {
    headers, pinnedRow
  }