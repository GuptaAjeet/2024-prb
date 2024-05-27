import React, { useState, useRef, useEffect } from "react";
import { Hook, API, Form, Helper } from "../../../../../apps";
// import { Modal } from "../../../../../../apps/components/elements";
import { useDispatch } from 'react-redux';
import Features from "../../../../../redux/features";
import { Modal } from "../../../../../apps/components/elements";
//import validate from "../../../../../apps/utilities/validate";

const MastercommondataOperate = (props) => {
    const currentyr = new Date().getFullYear().toString();
    // var type_code = useRef();
    var typcode = useRef();
    var district_id = useRef();
    var state_id = useRef();
    var block_id = useRef();
    var links_to_school = useRef();
    var linkschool = useRef();
    var master_status = useRef();
    var udise_code = useRef();
    var title = useRef();
    var description = useRef();
    const SOption = Hook.useStates();
    const [DOptions, setDOptions] = useState([]);
    const [BOptions, setBOptions] = useState([]);
    const BOption = Hook.useBlocks();
    const DOption = Hook.useDistricts();
    const defaultValidationInputs = [title, typcode, description, links_to_school, district_id, state_id, block_id, udise_code]
    const [fInputs, SetFInputs] = useState(defaultValidationInputs);
    // const [isEdit, setIsEdit] = useState(true);
    const [fSubmit, setFSubmit] = useState(false);
    const dispatch = useDispatch();
    // const handler = useSelector((state) => state.handler);
    const object = Hook.usePost({
        url: "api/prabandh/mastercommondata/getmastercommondatabyid", data: { 'id': props.id }
    });
    const { handleChange, values, errors, form, } = Hook.useForm(fInputs);
    useEffect(() => {
        state_id.current?.value > 0 && getDistrict();
        district_id?.current?.value > 0 && getBlock();
    }, [state_id.current?.value, district_id?.current?.value])

    const getDistrict = () => {
        if (state_id.current) {
            setDOptions(Helper.districtFilter(DOption, state_id.current.value));
        }
    }
    const getBlock = () => {
        if (state_id.current && district_id.current) {
            setBOptions(Helper.blockFilter(BOption, state_id.current.value, district_id.current.value));
        }
    }
    useEffect(() => {
        updateHandler();
    }, [object])

    const updateHandler = () => {
        if (object !== null && object.data !== undefined) {
            const data = object.data;
            title.current.value = data.title;
            description.current.value = data.description;
            master_status.current.value = data.status;
            typcode.current.value = data.type_code
            state_id.current.value = data.state_id;
            district_id.current.value = data.district_id;
            block_id.current.value = data.block_id;
            udise_code.current.value = data.udise_code;
            linkschool.current.value = data.links_to_school === -1 ? "0" : "1"
            if (data.links_to_school !== -1) {
                links_to_school.current.value = data.links_to_school;
            }
        }
    }
    const typecodeLastdigit = object?.data?.type_code?.slice(-2)
    const createHandler = (e) => {
        setFSubmit(true);
        e.preventDefault()
        dispatch(Features.showLoader());
        const data = {
            id: props.id,
            title: title?.current?.value,
            type_code: typcode?.current?.value,
            status: master_status?.current?.value,
            description: description?.current?.value,
            state_id: state_id?.current?.value,
            district_id: district_id?.current?.value,
            block_id: block_id?.current?.value,
            udise_code: udise_code?.current?.value,
            links_to_school: linkschool.current.value === "1" ? links_to_school?.current?.value.trim().length !== 0 ? links_to_school?.current?.value : -1 : -1,
        }
        API.post(`api/prabandh/mastercommondata/updateall`, data, (response) => {
            setFSubmit(false)
            dispatch(Features.showToast({ message: response.message }));
            dispatch(Features.hideLoader());
            dispatch(Features.hideModal());
            // props.fetchData({
            //     'page': handler.page, 'limit': handler.limit, 'reload': handler.reload, 'where': handler?.where
            // })
            dispatch(Features.makeHandler({ 'reload': (new Date()).getTime(), 'where': Helper.whereMasterObjSelector() }));
        })
    }
    const getalltypecode = Hook.usePost({ url: "api/prabandh/mastertype/getalltypecode", data: {} });
    let typedata = getalltypecode && getalltypecode?.data && getalltypecode?.data.map((v, i) => ({ name: v.type_code + currentyr.slice(-2), id: v.type_code + currentyr.slice(-2) }))

    if (block_id?.current?.value) {
        typedata = typedata && typedata.map(v => ({ name: v.name + block_id.current.value + typecodeLastdigit, id: v.id + block_id.current.value + typecodeLastdigit }))
    }
    return (
        <Modal clickHandler={createHandler}>
            <div className="row p-3">
                <div className="col-md-4 mb-4">
                    <Form.Text attr={{ ref: title, 'id': 'title', 'name': 'title', 'onChange': handleChange, 'onFocus': handleChange, 'maxLength': 100 }} label="Title" error={errors.title} mandatory="true" />
                </div>
                {/* <div className="col-md-4 mb-4">
                    <Form.Text attr={{ ref: state_id, "type": 'number', 'id': 'state_id', 'name': 'state_id', 'onChange': handleChange, 'onFocus': handleChange }} label="State ID" error={errors.state_id} mandatory="true" />
                </div> */}
                <div className="mb-4 col-md-4">
                    <Form.Select options={SOption ? SOption : []} attr={{ ref: state_id, 'id': 'state_id', 'name': 'state_id', 'onChange': handleChange, 'onFocus': handleChange }} label="State" error={errors.state_id} mandatory="true" default="Select State" />
                </div>
                {(values?.state_id !== 0 && values.state_id !== undefined) ?
                    <div className="mb-4 col-md-4">
                        <Form.Select options={DOptions ? DOptions.map(c => ({ name: c.name, id: c.id })) : []} attr={{ ref: district_id, 'id': 'district_id', 'name': 'district_id', 'onChange': handleChange, 'onFocus': handleChange }} label="District" error={errors.district_id} mandatory="true" default="Select District" />
                    </div>
                    :
                    <div className="mb-4 col-md-4">
                        <Form.Select options={DOptions ? DOptions.map(c => ({ name: c.district_name, id: c.id })) : []} attr={{ "disabled": "true", ref: district_id, 'id': 'district_id', 'name': 'district_id', 'onChange': handleChange, 'onFocus': handleChange }} label="District" error={errors.district_id} mandatory="true" default="Select District" />
                    </div>
                }
                {(district_id?.current?.value !== 0 && state_id?.current?.value !== 0 && state_id?.current?.value !== undefined && district_id?.current?.value !== undefined) ?
                    <div className="mb-4 col-md-4">
                        <Form.Select options={BOptions ? BOptions : []} attr={{ ref: block_id, 'id': 'block_id', 'name': 'block_id', 'onChange': handleChange, 'onFocus': handleChange }} label="Block" error={errors.block_id} mandatory="true" default="Select Block" />
                    </div> :
                    <div className="mb-4 col-md-4">
                        <Form.Select options={BOptions ? BOptions : []} attr={{ ref: block_id, "disabled": "true", 'id': 'block_id', 'name': 'block_id', 'onChange': handleChange, 'onFocus': handleChange }} label="Block" error={errors.block_id} mandatory="true" default="Select Block" />
                    </div>
                }


                {/* <div className="col-md-4 mb-4">
                    <Form.Text attr={{ ref: district_id, "type": 'number', 'id': 'district_id', 'name': 'district_id', 'onChange': handleChange, 'onFocus': handleChange }} label="District ID" error={errors.district_id} mandatory="true" />
                </div>
                <div className="col-md-4 mb-4">
                    <Form.Text attr={{ ref: block_id, "type": 'number', 'id': 'block_id', 'name': 'block_id', 'onChange': handleChange, 'onFocus': handleChange }} label="Block ID" error={errors.block_id} mandatory="true" />
                </div> */}
                <div className="mb-4 col-md-4">
                    <Form.Select options={[{ id: '1', name: "Yes" }]} attr={{ ref: linkschool, 'id': 'linkschool', 'name': 'linkschool', 'onChange': handleChange, 'onFocus': handleChange }} label="Link School" mandatory="true" default="No" />
                </div>
                {values.linkschool === undefined ? object?.data?.links_to_school !== -1 &&
                    <div className="col-md-4 mb-4">
                        <Form.Text attr={{ ref: links_to_school, "type": 'number', 'id': 'links_to_school', 'name': 'links_to_school', 'onChange': handleChange, 'onFocus': handleChange }} label="Link to School" error={errors.links_to_school} mandatory="true" />
                    </div> : values.linkschool === "1" && <div className="col-md-4 mb-4">
                        <Form.Text attr={{ ref: links_to_school, "type": 'number', 'id': 'links_to_school', 'name': 'links_to_school', 'onChange': handleChange, 'onFocus': handleChange }} label="Link to School" error={errors.links_to_school} mandatory="true" />
                    </div>
                }

                <div className="col-md-4 mb-4">
                    <Form.Text attr={{ ref: udise_code, "type": 'number', 'id': 'udise_code', 'name': 'udise_code', 'onChange': handleChange, 'onFocus': handleChange }} label="Udise code" error={errors.udise_code} mandatory="true" />
                </div>
                <div className="mb-4 col-md-4">
                    <Form.Select options={[{ id: "1", name: "Active" }]} attr={{ ref: master_status, 'id': 'master_status', 'name': 'master_status', 'onChange': handleChange, 'onFocus': handleChange }} label="Status" mandatory="true" default="Inactive" />
                </div>
                {/* <div className="mb-4 col-md-4">
                    <Form.Select options={typedata ? typedata : []} attr={{ ref: type_code, 'id': 'type_code', 'name': 'type_code', 'onChange': handleChange, 'onFocus': handleChange }} label="Type Code" mandatory="true" default="Select Type Code" />
                </div> */}
                <div className="mb-4 col-md-4">
                    <Form.Select options={typedata ? typedata : []} attr={{ ref: typcode, 'id': 'typcode', 'name': 'typcode', 'onChange': handleChange, 'onFocus': handleChange }} label="Type Code" error={errors.type_code} mandatory="true" default="Select Type Code" />
                </div>
                <div className="col-md-4 mb-4">
                    <Form.Textarea attr={{ ref: description, 'id': 'description', 'name': 'description', 'onChange': handleChange, 'onFocus': handleChange }} label="Description" error={errors.description} mandatory="true" />
                </div>
                <div className="col-md-12">
                    <Form.Button button={{ 'type': 'submit', 'disabled': form.disable, 'onClick': createHandler }} className="btn btn-success float-end" fSubmit={fSubmit} >Save</Form.Button>
                </div>
            </div>
        </Modal>
    )
}

export default MastercommondataOperate