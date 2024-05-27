const Model = require('../../models').HostelModel;
const Message = require('../../helpers/Message');
const { Hash } = require('../../libraries');
const Exception = require('../Assets/ExceptionHandler');
const Response = require('../Assets/ResponseHandler');

exports.index = async (req, res) => {
    try {
        const request = req.body;
        const object = await Model.query().select(['md.id', 'md.district_name', 'md.district_status', 'ms.name']).
            join('master_states as ms', 'ms.id', '=', 'md.district_state_id').
            orderBy('md.district_name').limit(request.limit).offset(request.limit * (request.page - 1));
        const count = await Model.count();
        // res.status(200).json({ status: true, 'data': object, 'count': count });
        return Response.handle(req, res, 'index', 200, { status: true, 'data': object, 'count': count })
    } catch (e) {
        return Exception.handle(e, res, req, 'index');
    }
}

exports.list = async (req, res) => {
    try {
        const object = await Model.list()
    //    res.status(200).json({ status: true, 'data': object });
        return Response.handle(req, res, 'list', 200, { status: true, 'data': object })
    } catch (e) {
        return Exception.handle(e, res, req, 'list');
    }
}

exports.selectlist = async (req, res) => {
    try {
        const object = await Model.selectlist(req.body);
    //    res.status(200).json({ status: true, 'data': object });
        return Response.handle(req, res, 'selectlist', 200, { status: true, 'data': object })
    } catch (e) {
        return Exception.handle(e, res, req, 'selectlist');
    }
}

exports.create = async (req, res) => {
    try {
        const decryptObj = JSON.parse(Hash.decrypt(req.body.secure));        
        let schools = decryptObj.school;
        delete decryptObj.school;

        if(req.file){
            decryptObj.survey_doc = req.file.filename;
        }

        if (decryptObj.hostel_id) {
            const afterUpdate = await Model.update({ 
                state_id: decryptObj.state_id,
                district_id: decryptObj.district_id,
                udise_block_code: decryptObj.udise_block_code,
                hostel_code: decryptObj.hostel_code,
                address: decryptObj.address,
                habitation: decryptObj.habitation,
                population: decryptObj.population,
                capacity: decryptObj.capacity,
                hostel_type: decryptObj.hostel_type,
                longitude: decryptObj.longitude,
                latitude: decryptObj.latitude,
                survey_number: decryptObj.survey_number,
                survey_doc: decryptObj.survey_doc,
                area_of_land: decryptObj.area_of_land,
                nature_of_land: decryptObj.nature_of_land,
                sanction_amount: decryptObj.sanction_amount,
                tender_floated: decryptObj.tender_floated,
                construction_agency: decryptObj.construction_agency,
                hostel_construction_agency: decryptObj.hostel_construction_agency,
            }, decryptObj.hostel_id);
            
            if(afterUpdate){
                await Model.host_sch_rel_delete(decryptObj.hostel_id);
                let hot_sch_rel_create = []
                for (let i = 0; i < schools.length; i++) {
                    hot_sch_rel_create.push({udise_sch_code: schools[i], hostel_id: decryptObj.hostel_id})
                }
                await Model.host_sch_rel_create(hot_sch_rel_create);
            }

            return Response.handle(req, res, 'update', 200, { status: true, message: Message.updated("Data") })
        } else {
            const count = await Model.find({ udise_block_code: decryptObj.udise_block_code });
            decryptObj.hostel_code = `PMJH0${count.length}${decryptObj.udise_block_code}`
            const afterCreate = await Model.create({ ...decryptObj });
            if(afterCreate.length > 0){
                let hot_sch_rel_create = []
                for (let i = 0; i < schools.length; i++) {
                    hot_sch_rel_create.push({udise_sch_code: schools[i], hostel_id: afterCreate[0]['hostel_id']})
                }
                await Model.host_sch_rel_create(hot_sch_rel_create);
            }

            return Response.handle(req, res, 'create', 200, { status: true, message: Message.saved("Data") })
        }
        
    } catch (e) {
        return Exception.handle(e, res, req, 'create');
    }
}

exports.update = async (req, res) => {
    try {
        const { district_name, district_state_id } = req.body;
        const result = await Model.findOne({ id });
        if (result != null) {
            const object = await Model.update({ district_name, district_state_id }, id);
            const message = (object) ? Message.updated(district_name) : Message.default();
        //    res.status(200).json({ status: true, message: message });
            return Response.handle(req, res, 'update', 200, { status: true, message: message })
        } else {
        //    res.status(200).json({ status: false, message: Message.notFound('Record') });
            return Response.handle(req, res, 'update', 200, { status: false, message: Message.notFound('Record') })
        }
    } catch (e) {
        return Exception.handle(e, res, req, 'update');
    }
}

exports.delete = async (req, res) => {
    try {
        const { id } = req.body;
        const object = await Model.findOne({ id });
        if (object != null) {
            const message = (Model.delete({ id })) ? Message.deleted(object.district_name) : Message.default();
        //    res.status(200).json({ status: true, message: message });
            return Response.handle(req, res, 'delete', 200, { status: true, message: message })
        } else {
        //    res.status(404).json({ status: false, message: Message.notFound('Record') });
            return Response.handle(req, res, 'delete', 404, { status: false, message: Message.notFound('Record') })
        }
    } catch (e) {
        return Exception.handle(e, res, req, 'delete');
    }
}

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.body;
        const object = await Model.findOne({ id });
        if (object != null) {
            const status = (object.district_status == 1) ? 0 : 1;
            const result = await Model.update({ district_status: status }, id);
            const message = (result) ? Message.status('Record', status) : Message.default();
        //    res.status(200).json({ status: true, message: message });
            return Response.handle(req, res, 'updateStatus', 200, { status: true, message: message })
        } else {
        //    res.status(404).json({ status: false, message: Message.notFound('Record') });
            return Response.handle(req, res, 'updateStatus', 404, { status: false, message: Message.notFound('Record') })
        }
    } catch (e) {
        return Exception.handle(e, res, req, 'updateStatus');
    }
}

exports.find = async (req, res) => {
    try {
        let where = '';
        if(req.body.state_id){
            where = `where mh.state_id = ${req.body.state_id}`
        }
        // const object = await Model.knx().raw(`select mh.*, 
        //     mh.hostel_id,
        //     state_name,
        //     district_name,
        //     block_name,
        //     address,
        //     capacity,
        //     (SELECT STRING_AGG(psm.school_name , ',<br/>') AS school_names
        //     FROM master_hostel_school_rel mhsr left join prb_school_master psm on  psm.udise_sch_code = mhsr.udise_sch_code where hostel_id = mh.hostel_id 
        //     GROUP BY hostel_id),
        //     (SELECT STRING_AGG(mhsr.udise_sch_code , ',') AS school
        //     FROM master_hostel_school_rel mhsr where hostel_id = mh.hostel_id 
        //     GROUP BY hostel_id)
        // from
        //     master_hostel mh
        // left join master_states ms on
        //     ms.state_id = mh.state_id
        // left join master_districts md on
        //     md.district_id = mh.district_id
        // left join master_blocks mb on
        //     mb.udise_block_code = mh.udise_block_code 
        //     ${where} order by state_name, district_name, block_name`);

        const object = await Model.knx().raw(`SELECT 	
            mh.hostel_id,mh.state_id,mh.district_id,mh.udise_block_code,mh.hostel_code,mh.address,mh.habitation,mh.population,mh.hostel_type,
            mh.capacity,mh.longitude,mh.latitude,mh.survey_number,mh.survey_doc,mh.area_of_land,mh.nature_of_land,mh.sanction_amount,mh.tender_floated,
            mh.hostel_construction_agency,mh.construction_agency,mh.hostel_id,ms.state_name,md.district_name,mb.block_name,
            STRING_AGG(psm.school_name , ',<br/>') AS school_names,STRING_AGG(mhsr.udise_sch_code , ',') AS school
        FROM
            master_hostel mh
        LEFT JOIN master_states ms ON ms.state_id = mh.state_id
        LEFT JOIN master_districts md ON md.district_id = mh.district_id
        LEFT JOIN master_blocks mb ON mb.udise_block_code = mh.udise_block_code 
        LEFT JOIN master_hostel_school_rel mhsr ON mhsr.hostel_id = mh.hostel_id
        LEFT JOIN prb_school_master psm ON psm.udise_sch_code = mhsr.udise_sch_code
        ${where}
        GROUP by mh.hostel_id,mh.state_id,mh.district_id,mh.udise_block_code,mh.hostel_code,mh.address,mh.habitation,mh.population,
            mh.hostel_type,mh.capacity,mh.longitude,mh.latitude,mh.survey_number,mh.survey_doc,mh.area_of_land,mh.nature_of_land,mh.sanction_amount,
            mh.tender_floated,mh.hostel_construction_agency,mh.construction_agency,ms.state_name,md.district_name,mb.block_name
        ORDER BY
            state_name, district_name, block_name`)    
        if (object != null) {
            return Response.handle(req, res, 'find', 200, { status: true, 'data': object.rows })
        } else {
            return Response.handle(req, res, 'find', 404, { status: false, message: Message.notFound('Record') })
        }
    } catch (e) {
        return Exception.handle(e, res, req, 'find');
    }
}