import React from "react";
import PreferenceFooter from "./preference-footer";
import Footer from "./footer";
import "../../../views/layouts/prabandh/spill.css";

const Body = (props) => {
  const object = props.object !== null ? props.object : null;
  const tableSize = props?.preference?.size ? props?.preference?.size : "";

  let height = props.height === "auto" ? "auto" : "476px";
  return (
    <>
      <div
        className="table-scroll-section"
        style={{
          height,
          borderBottom: `${+object.count > 0 ? "solid 1px  #D2D2D2" : ""}`,
        }}
      >
        <table
          className={`${tableSize} table-scroll `}
          style={{ width: "100%" }}
        >
          {object.columns !== undefined && (
            <thead style={{ position: "" }}>
              <tr role="row" key={-1}>
                {object?.columns?.map((data, thi) => (
                  <th
                    key={thi}
                    width={data[Object.keys(data)[1]]}
                    className={data[Object.keys(data)[2]]}
                  >
                    {data[Object.keys(data)[0]]}
                    {object.checkbox &&
                      object?.data?.length !== 0 &&
                      thi === 0 && (
                        <input
                          className="form-check-input"
                          disabled={+object?.status === 6}
                          checked={
                            object?.deletes?.length === object.data.length
                              ? true
                              : ""
                          }
                          style={{
                            border: "1px solid black",
                            marginTop: "5px",
                            marginLeft: "3px",
                          }}
                          type="checkbox"
                          value=""
                          id="flexCheckChecked"
                          onChange={(e) => props?.object?.handleCheckboxAll(e)}
                        />
                      )}

                    {object.checkbox_action &&
                      object?.data?.length !== 0 &&
                      thi === object?.columns.length - 1 && (
                        <input
                          className="form-check-input"
                          disabled={+object?.status === 6}
                          checked={
                            object?.deletes?.length === object.data.length
                              ? true
                              : ""
                          }
                          style={{
                            border: "1px solid black",
                            marginTop: "5px",
                            marginLeft: "3px",
                          }}
                          type="checkbox"
                          value=""
                          id="flexCheckChecked"
                          onChange={(e) => props?.object?.handleCheckboxAll(e)}
                        />
                      )}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          {+object.count > 0 ? (
            <tbody>
              {object.data.map((row, i) => (
                <tr role="row" key={++i}>
                  {Object.keys(row).map((key, tdi) => (
                    <td
                      key={tdi}
                      className={`${object?.columns[tdi]?.className} ? '${object?.columns[tdi]?.className}' : 'text-left'`}
                    >
                      {row[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr role="row">
                <td colSpan={object.columns.length}>
                  <h3
                    className="text-center text-danger"
                    style={{ width: "100%" }}
                  >
                    Oops! No record found.
                  </h3>
                </td>
              </tr>
            </tbody>
          )}

          {props?.object?.tfoot && (
            <tfoot>
              <tr>
                <th
                  colSpan={props?.object?.tfoot?.colSpanAtStart}
                  className="text-end"
                >
                  Total
                </th>
                {Object.keys(props?.object?.tfoot?.column).map((td) => {
                  if (props?.object?.tfoot?.column[td] !== false) {
                    return (
                      <th className="text-end">
                        {props?.object?.tfoot?.column[td]}
                      </th>
                    );
                  } else {
                    return <th className="text-end"></th>;
                  }
                })}
                {props?.object?.tfoot?.colSpanAtEnd && (
                  <th colSpan={props?.object?.tfoot?.colSpanAtEnd}></th>
                )}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      {props.preference !== undefined && props.preference === 1 ? (
        <PreferenceFooter object={object} />
      ) : (
        <Footer object={object} />
      )}
    </>
  );
};

export default Body;
