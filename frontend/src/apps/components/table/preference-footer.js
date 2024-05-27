import React from "react";
import Features from "../../../redux/features";
import { useSelector,useDispatch } from 'react-redux';
import { Helper } from "../..";

const Footer = (props) =>{
    const style         =   {'fontSize':'16px','fontWeight':'bold'};
    const preference    =   useSelector((state) => state.preference);
    const dispatch      =   useDispatch();
    const object        =   (props.object !== null) ? props.object : null;
    const total         =   (object !== null && object.count !== null) ? object.count : 0;    
    const TPages        =   Math.ceil(total/preference.limit);
    let userData        =   Helper.auth?.user;
    let searchQuery     =   (object !== null && object.searchQuery !== null) ? object.searchQuery : null;

    const recordPerPage = (e) =>{
        dispatch(Features.makepreferenceHandler({'limit':+e.target.value, where: Helper.whereObjSelector(userData, searchQuery? true : false, searchQuery)}));
    }
    
    const firstPage = () =>{
        dispatch(Features.makepreferenceHandler({'page':1, where: Helper.whereObjSelector(userData, searchQuery? true : false, searchQuery)}));
    }
    
    const previousPage = () =>{        
        if(preference.page !== 1){ 
            dispatch(Features.makepreferenceHandler({'page':(preference.page-1), where: Helper.whereObjSelector(userData, searchQuery? true : false, searchQuery)}));
        }
    }
    
    const nextPage = () =>{        
        if(preference.page !== TPages){ 
            dispatch(Features.makepreferenceHandler({'page':(preference.page+1), where: Helper.whereObjSelector(userData, searchQuery? true : false, searchQuery)}));
        }
    }
    
    const lastPage = () =>{
        dispatch(Features.makepreferenceHandler({'page':TPages, where: Helper.whereObjSelector(userData, searchQuery? true : false, searchQuery)}));
    }

    const disabled  =   (preference.page == 1) ? true : false;

    return(
        <div className="row pb-2 pt-2">
            <div className="col-sm-12 col-md-4">
                <div className="dataTables_length" id="alter_pagination_length">
                    <div className="dataTables_info border-0">
                        Rows per page:
                        <select aria-controls="alter_pagination" className="form-select" onChange={recordPerPage}>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="col-sm-12 col-md-4 text-center">
                <div className="dataTables_paginate paging_full_numbers">
                    <ul className="pagination mt-2">
                        <li className="paginate_button page-item first disabled me-2 bs-tooltip rounded" onClick={(total > 0) && firstPage} title="First">
                            <i style={style} className={`fa-solid fa-angles-left ${(disabled) ? 'pg-text-secondary':'text-primary'} me-2`}></i>
                        </li>
                        <li className="paginate_button page-item previous me-2" onClick={(total > 0) && previousPage} title="Previous">
                            <i style={style} className={`fa-solid fa-angle-left ${(disabled) ? 'pg-text-secondary':'text-primary'} me-2`}></i>
                        </li>
                        <li className="paginate_button page-item next me-2" onClick={(total > 0) && nextPage} title="Next">
                            <i style={style} className={`fa-solid fa-angle-right ${(total > 10 && preference.page !==TPages) ? 'text-primary':'pg-text-secondary'}  me-2`}></i>
                        </li>
                        <li className="paginate_button page-item last" onClick={(total > 0) && lastPage} title="Last">
                            <i style={style} className={`fa-solid fa-angles-right ${(total > 10 && preference.page !==TPages) ? 'text-primary':'pg-text-secondary'} `}></i>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col-sm-12 col-md-4">
                <div className="dataTables_info mt-1 ms-2 border-0 float-end">Showing {preference.page} of {TPages} | <span className="text-success">Total: {total}</span></div>
            </div>
        </div>
    )
}

export default Footer