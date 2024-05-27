import React from "react";
import Header from "./header";
import Body from "./body";
const Table = (props) => {
  const object = props.object !== null ? props.object : null;

  return (
    <>
      <Header object={object} />
      <div className=" p-0 br-6">
        <div className=" ">
          <div className="dataTables_wrapper p-0">
            <Body preference={props.preference} object={object} height={props.height} />
            {/* {object.count > 0 ? (
              <Body preference={props.preference} object={object} />
            ) : (
              <h3 className="text-center p-5 text-danger">
                Oops! No record found.
              </h3>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
