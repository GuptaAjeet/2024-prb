import React from "react";
import Features from "../../../redux/features";
import { useSelector, useDispatch } from "react-redux";

const Footer = (props) => {
  const style = { fontSize: "16px", fontWeight: "bold" };
  const handler = useSelector((state) => state.handler);
  const dispatch = useDispatch();
  const object = props.object !== null ? props.object : null;
  const total = object !== null && object.count !== null ? +object.count : 0;
  const TPages = Math.ceil(total / handler.limit);
  const recordPerPages = (e) => {
    dispatch(Features.makeHandler({ limit: +e.target.value }));
  };

  const firstPages = () => {
    dispatch(Features.makeHandler({ page: 1, limit: handler.limit }));
  };

  const previousPages = () => {
    if (handler.page !== 1) {
      dispatch(
        Features.makeHandler({ page: handler.page - 1, limit: handler.limit })
      );
    }
  };

  const nextPages = () => {
    if (handler.page !== TPages) {
      dispatch(
        Features.makeHandler({ page: handler.page + 1, limit: handler.limit })
      );
    }
  };

  const lastPages = () => {
    dispatch(Features.makeHandler({ page: TPages, limit: handler.limit }));
  };

  const disabled = +handler.page === 1 ? true : false;

  return (
    <div className="row pb-2 pt-2 ms-2 me-2 need_hide_footer">
      <div className="col-sm-12 col-md-4">
        <div className="dataTables_length" id="alter_pagination_length">
          <div className="dataTables_info border-0">
            Rows per page:
            <select
              name="alter_pagination_length"
              aria-controls="alter_pagination"
              className="form-control"
              onChange={recordPerPages}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              {/* <option value={props?.object?.count}>All</option> */}
            </select>
          </div>
        </div>
      </div>
      <div className="col-sm-12 col-md-4 text-center border-0">
        <div className="dataTables_paginate paging_full_numbers text-center">
          <ul className="pagination mt-2">
            <li
              className="paginate_button page-item first me-2 bs-tooltip rounded"
              onClick={total > 0 ? firstPages : undefined}
              title="First"
            >
              <i
                style={style}
                className={`fa-solid fa-angles-left ${disabled ? "pg-text-secondary" : "text-primary"
                  } me-2`}
              ></i>
            </li>
            <li
              className="paginate_button page-item previous me-2"
              onClick={total > 0 ? previousPages : undefined}
              title="Previous"
            >
              <i
                style={style}
                className={`fa-solid fa-angle-left ${disabled ? "pg-text-secondary" : "text-primary"
                  } me-2`}
              ></i>
            </li>
            <li
              className="paginate_button page-item next me-2"
              onClick={total > 0 ? nextPages : undefined}
              title="Next"
            >
              <i
                style={style}
                className={`fa-solid fa-angle-right ${total > 10 && handler.page !== TPages
                    ? "text-primary"
                    : "pg-text-secondary"
                  }  me-2`}
              ></i>
            </li>
            <li
              className="paginate_button page-item last"
              onClick={total > 0 ? lastPages : undefined}
              title="Last"
            >
              <i
                style={style}
                className={`fa-solid fa-angles-right ${total > 10 && handler.page !== TPages
                    ? "text-primary"
                    : "pg-text-secondary"
                  } `}
              ></i>
            </li>
          </ul>
        </div>
      </div>
      <div className="col-sm-12 col-md-4">
        <div className="dataTables_info mt-1 ms-2 border-0 float-end">
          Showing: {handler.page} of {TPages} |{" "}
          <span className="text-success">Total: {total}</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
