import React, { useState } from 'react'
import { Error } from '../../../../../../apps/components/elements'
import { Column, Table } from '../../../../../../apps';

export default function Subcategory() {
    const [errors, setErrors] = useState([]);
    const [data, setData] = useState({created_By:'' })


    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value });
    }
    const handleFocus = (e) => {
        const { name } = e.target
        const er = [...errors]
        const index = errors && errors.indexOf(name)
        if (index === -1) {
            er.push(name)
            setErrors(er)
        }
    }
    const handleUploadfile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData({ ...data, img_icon: file })
        }
        else {
            setData({ ...data, img_icon: '' })
        }
    }
    const options = [{ id: 1, name: "Active" }]

    const object = null
    const row = []

    const onSubmitSubCategory = () => {
    }
    return (
        <div className="dashboard-main-content">
            <div className="dashboard-main-content__header mb-3">
                <h1>Subcategory</h1>
            </div>
            <div className="dashboard-main-content-info mb-3">
                <div className="row">
                    <div className="col-md-4 mb-4">
                        <label >
                            Categorey
                            {/* {(errors.includes("title") && (data?.st === undefined || data?.slug.length === 0)) && <Error> Please Select Status</Error>} */}
                        </label>
                        <select className={`form-select`} value={data?.category_id} name='category_id' id='category_id' onChange={handleChange} onFocus={handleFocus} >
                            (<option value="0">Select Categorey</option>)
                            {
                                (options !== null) && options.map((row, i) => {
                                    return <option key={row.id + row.name} value={row.id}> {row.name} </option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-md-4 mb-4">
                        <label htmlFor='' >
                            Title
                            {(errors.includes("title") && (data?.title === undefined || data?.title.length === 0)) && <Error> Please Enter Title</Error>}
                        </label>
                        <input onChange={handleChange} value={data?.title} onFocus={handleFocus} name='title' id='title' autoComplete="off" className={`form-control `} />
                    </div>
                    <div className="col-md-4 mb-4">
                        <label >
                            Status
                            {/* {(errors.includes("title") && (data?.st === undefined || data?.slug.length === 0)) && <Error> Please Select Status</Error>} */}
                        </label>
                        <select className={`form-select`} value={data?.status} name='status' id='status' onChange={handleChange} onFocus={handleFocus} >
                            (<option value="0">Inactive</option>)
                            {
                                (options !== null) && options.map((row, i) => {
                                    return <option key={row.id + row.name} value={row.id}> {row.name} </option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-md-4 mb-4" >
                        <label>
                            Icon
                            {(errors.includes("img_icon") && (data?.img_icon === undefined || data?.img_icon.length === 0)) && <Error> Please Enter img_icon</Error>}
                        </label>
                        {/* <br /> */}
                        <div style={{ padding: '5px 10px', display: "flex", alignItems: 'center', border: '1px solid #dbdbdb' }}>
                            <label htmlFor='upload-2' style={{ fontSize: '1rem' }}>
                                <i className="bi bi-upload" style={{ fontSize: "1.5rem", marginRight: '0.8rem' }}></i> {data?.img_icon?.name === undefined ? "Choose a File" : data?.img_icon?.name}
                            </label>
                            <input type="file" hidden onChange={handleUploadfile} onFocus={handleFocus} id="upload-2" accept="image/png, image/gif, image/jpeg" />
                        </div>
                        {/* 
                        <input onChange={handleChange} value={data?.img_icon} name='img_icon' id='img_icon' onFocus={handleFocus} autoComplete="off" className={`form-control `} /> */}
                    </div>
                    <div className="col-md-4 mb-4">
                        <label >
                            Description
                            {(errors.includes("description") && (data?.description === undefined || data?.description.length === 0)) && <Error> Please Enter Description</Error>}
                        </label>
                        <textarea onChange={handleChange} value={data?.description} onFocus={handleFocus} autoComplete="off" name='description' id='description' className={`form-control-textarea `} ></textarea>
                    </div>
                    <div className="col-md-4 mb-4" style={{ marginTop: '1.2rem' }} >
                        {/* <button disabled className={buttonClass}> <i className="fas fa-circle-notch fa-spin"></i>  Please Wait ... </button> */}
                        <button className='btn btn-success' disabled={data?.title?.length > 0 && data?.category_id?.length > 0 && data?.img_icon?.name?.length > 0 && data?.description?.length > 0 ? false : true} onClick={onSubmitSubCategory}>Save </button>
                    </div>
                    <div className="dashboard-main-content-info">
                        <div className="col-xl-12 col-lg-12 col-sm-12">
                            {object && (
                                <Table
                                    object={{
                                        columns: Column.cmsCategory(),
                                        data: row,
                                        count: object.count,
                                        create: false,
                                        search: true,
                                        // handleChange: searchData,
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div >
        </div>
    )
}
