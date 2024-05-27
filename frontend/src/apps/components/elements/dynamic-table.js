import React from "react";

const DynamicTable = (props) => {
    const renderCell = (item, column, rowIndex) => {
        if (column.rowSpan) {
            const rowSpanCount = getRowSpanCount(props?.data, column.field, rowIndex);
            return rowSpanCount > 1 ? (<td rowSpan={rowSpanCount} className={`${item.alloc_status==="Allocation Finalized" ? "text-light" : ""}`} >{item[column.field]}</td>) : 
                rowSpanCount === 0 ? ([]) : 
                (<td className={`${item.alloc_status==="Allocation Finalized" ? "text-light" : ""}`}>{item[column.field]}</td>);
        }
        return (
            <td className={`${column?.type === 'number' ? 'text-end' : 'text-start'} ${item.alloc_status==="Allocation Finalized" ? "text-light" : ""}`}>{column.field === "index" ? (rowIndex + 1) : (item[column.field])}</td>
        );
    };

    const getRowSpanCount = (data, field, rowIndex) => {
        const johnIndex = data.indexOf(data.find((item) => item[field] === data[rowIndex][field]));

        if (johnIndex < rowIndex) {
            return 0;
        }

        let rowSpanCount = 1;
        rowSpanCount = data.filter((item) => item[field] === data[rowIndex][field])?.length;
        return rowSpanCount;
    };

    return (
        <table className="table table-bordered text-start  progress-tracking">
            <thead>
                <tr>
                    {props?.header.map((itm, idx) => {
                        return (<th className={itm?.className} key={idx} rowSpan={itm?.rowSpan} colSpan={itm?.colSpan}> {itm?.name} </th>)
                    })
                    }
                </tr>
                {props.displayChildHeader === true && <tr>
                    {props.childHeader.map((itm, idx) => {
                        return (<th className={itm?.className} key={idx} rowSpan={itm?.rowSpan} colSpan={itm?.colSpan}> {itm?.name} </th>)
                    })
                    }
                </tr>
                }
            </thead>
            <tbody>
                {props?.data.map((item, rowIndex) => (
                    <tr key={item.id} className={`${item.alloc_status==="Allocation Finalized" ? "bg-success" : ""}`}>
                        {props?.columns.map((column) => renderCell(item, column, rowIndex))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DynamicTable;