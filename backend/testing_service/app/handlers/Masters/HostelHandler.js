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
            const afterUpdate = await Model.update({ district_name, district_state_id });
            if(afterUpdate.length > 0){
                await Model.host_sch_rel_delete(schools.map((s=>s.id)));
                let hot_sch_rel_create = []
                for (let i = 0; i < schools.length; i++) {
                    hot_sch_rel_create.push({udise_sch_code: schools[i], hostel_id: afterUpdate[0]['hostel_id']})
                }
                await Model.host_sch_rel_create(hot_sch_rel_create);
            }

            return Response.handle(req, res, 'update', 200, { status: true, message: Message.saved("Data") })
        } else {
            const afterCreate = await Model.create({ ...decryptObj });
            if(afterCreate.length > 0){
                let hot_sch_rel_create = []
                for (let i = 0; i < schools.length; i++) {
                    hot_sch_rel_create.push({udise_sch_code: schools[i], hostel_id: afterCreate[0]['hostel_id']})
                }
                await Model.host_sch_rel_create(hot_sch_rel_create);
            }

            return Response.handle(req, res, 'create', 200, { status: false, message: Message.updated("Data") })
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
        // const object = await Model.find(req.body.where);
        const object = await Model.knx().raw(`select mh.*, 
            mh.hostel_id,
            state_name,
            district_name,
            block_name,
            hostel_name,
            address,
            capacity,
            (SELECT STRING_AGG(psm.school_name , ',<br/>') AS schools
            FROM master_hostel_school_rel mhsr left join prb_school_master psm on  psm.udise_sch_code = mhsr.udise_sch_code where hostel_id = mh.hostel_id 
            GROUP BY hostel_id)
        from
            master_hostel mh
        left join master_states ms on
            ms.state_id = mh.state_id
        left join master_districts md on
            md.district_id = mh.district_id
        left join master_blocks mb on
            mb.udise_block_code = mh.udise_block_code`);
        if (object != null) {
        //    res.status(200).json({ status: true, 'data': object });
            return Response.handle(req, res, 'updateStatus', 200, { status: true, 'data': object.rows })
        } else {
        //    res.status(404).json({ status: false, message: Message.notFound('Record') });
            return Response.handle(req, res, 'updateStatus', 404, { status: false, message: Message.notFound('Record') })
        }
    } catch (e) {
        return Exception.handle(e, res, req, 'find');
    }
}