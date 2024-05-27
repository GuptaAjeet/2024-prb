const headers = async () => {
    return [
        {
          headerName: "S. No.",
          width: 100,
          valueGetter: params => {
            return params.node.rowIndex + 1;
          }
        },
        {
          headerName: "Name",
          field: "user_name",
          filter: "agMultiColumnFilter",
          cellStyle: params => {
            return { textAlign: 'left' };
          },
        },
        {
          headerName: "Mobile Number",
          field: "user_mobile",
          filter: "agMultiColumnFilter",
          width: 150,
          cellStyle: params => {
            return { textAlign: 'left' };
          },
        },
        {
          headerName: "Email",
          field: "user_email",
          filter: "agMultiColumnFilter",
          cellStyle: params => {
            return { textAlign: 'left' };
          },
        },
        {
          headerName: "Role",
          field: "user_role",
          filter: "agMultiColumnFilter",
          cellStyle: params => {
            return { textAlign: 'left' };
          },
        },
        {
          headerName: "Designation",
          field: "designation",
          filter: "agMultiColumnFilter",
          cellStyle: params => {
            return { textAlign: 'left' };
          },
        },
        {
          headerName: "District Name",
          field: "district_name",
          filter: "agMultiColumnFilter",
          cellStyle: params => {
            return { textAlign: 'left' };
          }
        },
        {
          headerName: "State Name",
          field: "state_name",
          filter: "agMultiColumnFilter",
          cellStyle: params => {
            return { textAlign: 'left' };
          }
        },
        {
          headerName: "Login Time",
          field: "logged_in",
          cellStyle: params => {
            return { textAlign: 'left' };
          }
        }
      ]
};

export default {
    headers
}