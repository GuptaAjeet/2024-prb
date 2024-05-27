
const Model = require("../../models").pmshri;
const allocationModel = require("../../models").allocationModel;
const Hash = require("../../libraries/hash");
const Exception = require("../Assets/ExceptionHandler");
const Response = require("../Assets/ResponseHandler");
const http = require("http");
const fs = require("fs");
const multer = require("multer")
const express = require("express")
const routers = express.Router();
const path = require("path");
const DateTime = require("node-datetime/src/datetime");
const DTime = require("node-datetime");
const { log } = require("console");
const csv = require("csv-parser");
const { logedIn } = require("../../helpers/Message");
const { reconstructFieldPath } = require("express-validator/src/select-fields");


exports.componentsidebar = async (req, res) => {
  var role_id = req.body.id;
  try {
    const object = await Model.knx().raw(`SELECT sp.id,
    sp.role_id,
    sp.menu_id,
    sp.record_create,
    sp.record_read,
    sp.record_update,
    sp.record_delete,
    sm.parent_id,
    sm.name,
    sm.url,
    sm.active_url,
    sm.menu_img,
    sm.menu_type,
    sm.order_no,
    sm.status,
    sm.parent_sm,
    sm.module_group
   FROM system_permissions sp
     LEFT JOIN ( SELECT smg.id,
            smg.parent_id,
            smg.name,
            smg.url,
            smg.active_url,
            smg.menu_img,
            smg.menu_type,
            smg.order_no,
            smg.status,
            smg.module_group,
            smg.created_by,
            smg.updated_by,
            smg.created_at,
            smg.updated_at,
            ( SELECT json_agg(json_build_object('smp_id', smp.id, 'smp_parent_id', smp.parent_id, 'smp_name', smp.name, 'smp_url', smp.url, 'smp_active_url', smp.active_url, 'smp_menu_img', smp.menu_img, 'smp_menu_type', smp.menu_type, 'smp_order_no', smp.order_no, 'smp_status', smp.status)) AS user_object
                   FROM system_menus smp join system_permissions sp2 on smp.id= sp2.menu_id 
                  WHERE smp.parent_id::numeric = smg.id and sp2.role_id=${role_id}) AS parent_sm
           FROM system_menus smg
          WHERE smg.parent_id = 0 AND smg.status = 1) sm ON sm.id = sp.menu_id::numeric
  WHERE sm.parent_id = 0 and sp.role_id =${role_id}
  ORDER BY sm.order_no`);
    return Response.handle(req, res, "componentsaidbar", 200, {
      status: true,
      data: object.rows,
    });
  } catch (e) {
    return Exception.handle(e, res, req, "componentsaidbar");
  }
};
//COMMON FUNCTIONS 
exports.stateList = async (req, res) => {
  try {
    const apiYear = req.headers?.api_year;
    let stateData = await Model.knx().raw(`select state_id as id ,state_name as name  from master_states ms `);
    return Response.handle(req, res, "state list", 200, {
      status: true,
      data: stateData.rows,
    });
  } catch (e) {
    return Exception.handle(e, res, req, "state list");
  }
};
exports.districtList = async (req, res) => {
  try {
    const { state_id } = req.body;
    const apiYear = req.headers?.api_year;
    let distrctData = await Model.knx().raw(`select district_id , district_name from master_districts md  where  district_state_id ='${state_id}' order by district_name `);
    return Response.handle(req, res, "DISTRICT LIST", 200, {
      status: true,
      data: distrctData.rows,
    });
  } catch (e) {
    return Exception.handle(e, res, req, "DISTRICT LIST");
  }
};
exports.schoolList = async (req, res) => {
  try {
    const { state_id, district_id } = req.body;
    const apiYear = req.headers?.api_year;
    let schoolData = await Model.knx().raw(`select udise_sch_code, school_name from pmshri_school_master psm where state_id =${state_id} and district_id ='${district_id}' order by school_name`);

    return Response.handle(req, res, "schoolList", 200, {
      status: true,
      data: schoolData.rows,
    });
  } catch (e) {
    return Exception.handle(e, res, req, "schoolList");
  }
};
// get all activities 
exports.getMajorComponent = async (req, res) => {
  try {
    // const apiYear = req.headers?.api_year;
    let Data = await Model.knx().raw(`select pmc.major_component_name , pmc.major_component_id as id  from pmshri_major_component pmc   `);
    return Response.handle(req, res, "state list", 200, {
      status: true,
      data: Data.rows,
    });
  } catch (e) {
    return Exception.handle(e, res, req, "state list");
  }
};
exports.getSubcomponent = async (req, res) => {
  try {
    const { major_component_id } = req.body
    let Data = await Model.knx().raw(`select psc.sub_component_name , psc.sub_component_id  as id from pmshri_sub_component psc  where psc.major_component_id ='${major_component_id}' `);
    return Response.handle(req, res, "state list", 200, {
      status: true,
      data: Data.rows,
    });
  } catch (e) {
    return Exception.handle(e, res, req, "state list");
  }
};
exports.getActivities = async (req, res) => {
  try {
    const { sub_component_id } = req.body
    let Data = await Model.knx().raw(`select pam.activity_name, pam.sub_component_id as id from pmshri_activity_master pam where pam.sub_component_id  ='${sub_component_id}' `);
    return Response.handle(req, res, "state list", 200, {
      status: true,
      data: Data.rows,
    });
  } catch (e) {
    return Exception.handle(e, res, req, "state list");
  }
};
exports.getActivityDetail = async (req, res) => {
  try {
    const { activity_master_id } = req.body
    let Data = await Model.knx().raw(`select pd.activity_master_details_name, pd.id  as id  from pmshri_data pd where  pd.activity_master_id ='${activity_master_id}'`);
    return Response.handle(req, res, "state list", 200, {
      status: true,
      data: Data.rows,
    });
  } catch (e) {
    return Exception.handle(e, res, req, "state list");
  }
};

// PLAN FUNCTIONS
exports.planActivityList = async (req, res) => {
  try {
    const { state_id, district_id, asset_code } = req.body;
    const apiYear = req?.headers?.api_year;
    let state = ''
    let district = ''
    let assetcode = ''
    if (state_id && +state_id !== 0) {
      state = `and ast.state_id=${state_id}`
    }
    if (district_id && +district_id !== 0) {
      district = `and ast.district_id = '${district_id}'`
    }
    if (asset_code && +asset_code !== 0) {
      assetcode = `and ast.asset_code='${asset_code}' `
    }
    if (asset_code) {
      await Model.knx().raw(`INSERT INTO public.pmshri_ann_wrk_pln_bdgt_data_physical_asset
      (asset_code, asset_type, state_id, district_id, activity_master_details_id, scheme_id, sub_component_id,
        major_component_id, activity_master_id, applicable_yn, plan_year)
       select udise_sch_code as asset_code, '5', psm.state_id, psm.district_id, pd.id as activity_master_details_id, scheme_id, sub_component_id, major_component_id, activity_master_id, 0 as applicable_yn, '${apiYear}' as plan_year
       from pmshri_school_master psm, pmshri_data pd 
       where udise_sch_code = '${asset_code}' on conflict(asset_code, state_id, district_id, activity_master_details_id, plan_year)
    do nothing`)
    }
    let object
    if (asset_code && +asset_code !== 0) {
      object = await Model.knx().raw(`select coalesce (ast.propose_physical_quantity,0) as  propose_physical_quantity, 
              coalesce (ast.propose_financial_amount,0) as propose_financial_amount,
              ast.pmshri_ann_wrk_pln_bdgt_data_physical_asset_id ,
              ast.applicable_yn,
              ast.status,
              ast.propose_unit_cost,
              activity_master_details_id,
              pd.major_component_name , 
              pd.sub_component_name ,
              pd.activity_master_name ,
              pd.activity_master_details_name 
              from public.pmshri_ann_wrk_pln_bdgt_data_physical_asset ast , pmshri_data pd 
              where ast.activity_master_details_id = pd.id 
              and ast.asset_code = '${asset_code}'
              and ast.plan_year = '${apiYear}' 
              order by pd.sub_component_name, pd.activity_master_name,  pd.activity_master_details_name`)
    } else if (+asset_code === 0) {
      object = await Model.knx().raw(`select sum(coalesce (ast.propose_physical_quantity,0)) as  propose_physical_quantity, 
      sum(coalesce (ast.propose_financial_amount,0)) /nullif (sum(coalesce (ast.propose_physical_quantity,0)),0) as propose_unit_cost,
      sum(coalesce (ast.propose_financial_amount,0)) as propose_financial_amount,
      activity_master_details_id,
      pd.major_component_name , 
      pd.sub_component_name ,
      pd.activity_master_name ,
      pd.activity_master_details_name 
      from public.pmshri_ann_wrk_pln_bdgt_data_physical_asset ast , pmshri_data pd 
      where ast.activity_master_details_id = pd.id 
      and ast.plan_year ='${apiYear}'
      ${state}
      ${district}
      group by activity_master_details_id , pd.major_component_name , 
      pd.sub_component_name ,
      pd.activity_master_name ,
      pd.activity_master_details_name 
      order by pd.sub_component_name, pd.activity_master_name,  pd.activity_master_details_name
      `)
    }

    return Response.handle(req, res, "dietActivityList", 200, {
      status: true,
      data: object.rows,
      // activity_status: activityStatus.rows[0].status
    });
  } catch (e) {
    return Exception.handle(e, res, req, "dietActivityList");
  }
};
// by activity 

exports.configurePlanByActivity = async (req, res) => {
  try {
    const { state_id, district_id, activity_master_details_id, asset_code } = req.body
    const apiYear = req?.headers?.api_year;

    let udise = ''
    let district = ''
    let state = ''
    if (+asset_code !== 0) udise = `and psm.udise_sch_code='${asset_code}'`
    if (+district_id !== 0) district = `and pawpbdpa.district_id = '${district_id}'`
    if (+state_id !== 0) state = `and pawpbdpa.state_id = '${state_id}'`
    let Data
    if (+asset_code !== 0) {
      Data = await Model.knx().raw(`select  pawpbdpa.pmshri_ann_wrk_pln_bdgt_data_physical_asset_id, pawpbdpa.propose_physical_quantity, pawpbdpa.propose_financial_amount, pawpbdpa.propose_unit_cost,
      pawpbdpa.applicable_yn,psm.school_name ,
      pawpbdpa.status 
      from public.pmshri_ann_wrk_pln_bdgt_data_physical_asset pawpbdpa , pmshri_school_master psm 
      where activity_master_details_id = '${activity_master_details_id}' and  asset_code = '${asset_code}' and pawpbdpa.plan_year= '${apiYear}' and pawpbdpa.asset_code = psm.udise_sch_code `)
    }
    else if (+district_id !== 0) {
      Data = await Model.knx().raw(`
      select  pawpbdpa.pmshri_ann_wrk_pln_bdgt_data_physical_asset_id, pawpbdpa.propose_physical_quantity, pawpbdpa.propose_financial_amount, pawpbdpa.propose_unit_cost,
      pawpbdpa.applicable_yn,psm.school_name ,pawpbdpa.district_id,
      pawpbdpa.status 
      from public.pmshri_ann_wrk_pln_bdgt_data_physical_asset pawpbdpa , pmshri_school_master psm 
      where activity_master_details_id = '${activity_master_details_id}' and psm.district_id = ${district_id}
      and pawpbdpa.asset_code = psm.udise_sch_code and pawpbdpa.plan_year= '${apiYear}'`)
    } else {
      Data = await Model.knx().raw(`
    select  pawpbdpa.pmshri_ann_wrk_pln_bdgt_data_physical_asset_id, pawpbdpa.propose_physical_quantity, pawpbdpa.propose_financial_amount, pawpbdpa.propose_unit_cost,
    pawpbdpa.applicable_yn,psm.school_name ,pawpbdpa.district_id,
    pawpbdpa.status 
    from public.pmshri_ann_wrk_pln_bdgt_data_physical_asset pawpbdpa , pmshri_school_master psm 
    where activity_master_details_id = '${activity_master_details_id}' and psm.state_id = ${state_id}
    and pawpbdpa.asset_code = psm.udise_sch_code and pawpbdpa.plan_year= '${apiYear}'`)
    }
    // Data = await Model.knx().raw(`
    // select  pawpbdpa.pmshri_ann_wrk_pln_bdgt_data_physical_asset_id, pawpbdpa.propose_physical_quantity, pawpbdpa.propose_financial_amount, pawpbdpa.propose_unit_cost,
    // pawpbdpa.applicable_yn,psm.school_name ,pawpbdpa.district_id,
    // pawpbdpa.status 
    // from public.pmshri_ann_wrk_pln_bdgt_data_physical_asset pawpbdpa , pmshri_school_master psm 
    // where activity_master_details_id = '${activity_master_details_id}' and psm.state_id = ${state_id}
    // and pawpbdpa.asset_code = psm.udise_sch_code and pawpbdpa.plan_year= '${apiYear}'`)


    return Response.handle(req, res, "configure plan list", 200, {
      status: true,
      data: Data?.rows,
    });
  } catch (e) {
    return Exception.handle(e, res, req, "state list");
  }
};
exports.updateconfigureList = async (req, res) => {
  const { update, asset_code } = req.body;
  const apiYear = req?.headers?.api_year;
  try {
    if (asset_code && apiYear) {
      const updateOtherRecordsQuery = await Model.knx().raw(
        `update public.pmshri_ann_wrk_pln_bdgt_data_physical_asset ast set applicable_yn = '0',propose_physical_quantity=0, propose_unit_cost=0, propose_financial_amount=0  where asset_code= '${asset_code}' and plan_year ='${apiYear}'`
      );
      if (update.length !== 0 && updateOtherRecordsQuery) {
        for (let i = 0; i < update.length; i++) {
          const object = await Model.knx().raw(
            `update public.pmshri_ann_wrk_pln_bdgt_data_physical_asset ast set applicable_yn = '1', propose_physical_quantity=${update[i]["propose_physical_quantity"]}, propose_unit_cost=${update[i]["propose_unit_cost"]}, propose_financial_amount=${update[i]["propose_financial_amount"]}  where pmshri_ann_wrk_pln_bdgt_data_physical_asset_id = ${update[i]["pmshri_ann_wrk_pln_bdgt_data_physical_asset_id"]} and plan_year = '${apiYear}'`
          );
        }
      }
    }
    return Response.handle(req, res, "updatedietList", 200, {
      status: true,
      message: "Data Updated Successfully",
    });
  } catch (e) {
    return Exception.handle(e, res, req, "updatedietList");
  }
};

exports.updateconfiguredApprovePlan = async (req, res) => {
  const data = req.body;
  const updated_by = req.auth.user.id;
  const updated_at = DTime.create().format("Y-m-d H:M:S");
  const plan_year = req?.headers?.api_year;

  try {
    const afterUpdate = await Model.knx().raw(`UPDATE public.pmshri_state_ann_wrk_pln_bdgt_data
    set recomended_physical_quantity=${data.recomended_physical_quantity}, recomended_financial_amount=${data.recomended_financial_amount}, recomended_unit_cost=${data.recomended_unit_cost}
    WHERE pmshri_state_ann_wrk_pln_bdgt_data_id=${data.pmshri_state_ann_wrk_pln_bdgt_data_id}`)
    return Response.handle(req, res, "updateConfigureApprovePlan", 200, {
      status: true,
      message: "Data Updated Successfully",
    });

  } catch (e) {
    return Exception.handle(e, res, req, "updateDietApprovePlan");
  }
};
exports.approveConfigurationList = async (req, res) => {
  const { asset_code, status } = req.body;

  const apiYear = req?.headers?.api_year;

  try {
    if (asset_code && apiYear) {
      const query = `update public.pmshri_ann_wrk_pln_bdgt_data_physical_asset ast set status = ${status} where asset_code = '${asset_code}' and plan_year = '${apiYear}'`;
      await Model.knx().raw(
        query
      );
    }
    return Response.handle(req, res, "approveDIETConfigurationList", 200, {
      status: true,
      message: "Data Approved Successfully",
    });
  } catch (e) {
    return Exception.handle(e, res, req, "approveDIETConfigurationList");
  }
};

exports.getRecommandationList = async (req, res) => {
  const { state_id } = req.body;
  const apiYear = req?.headers?.api_year;
  try {
    const inserted = await Model.knx().raw(`INSERT INTO public.pmshri_state_ann_wrk_pln_bdgt_data
    (state_id, scheme_id, sub_component_id, major_component_id, activity_master_id, activity_master_details_id, plan_year, proposed_physical_quantity, proposed_financial_amount)
    select state_id , scheme_id, sub_component_id, major_component_id , activity_master_id, activity_master_details_id, plan_year, 
        sum(coalesce (propose_physical_quantity,0)) , sum(coalesce (propose_financial_amount,0))
    from pmshri_ann_wrk_pln_bdgt_data_physical_asset pawpbdpa 
    where state_id ='${state_id}'  and plan_year ='${apiYear}'
    group by state_id ,scheme_id, sub_component_id, major_component_id , activity_master_id, activity_master_details_id, plan_year 
    on conflict do nothing`)
    const object = await Model.knx().raw(`select	psawpbd.*,pd.activity_master_name ,pd.sub_component_name, pd.activity_master_details_name  from 	public.pmshri_state_ann_wrk_pln_bdgt_data as psawpbd 
    join public.pmshri_data as pd on	psawpbd.activity_master_details_id = pd.id 
    where state_id = ${state_id} and psawpbd.plan_year = '${apiYear}'
    order by pd.sub_component_name, pd.activity_master_name ,	pd.activity_master_details_name`)
    // if (object) {
    return Response.handle(req, res, "updatedietList", 200, {
      status: true,
      data: object?.rows
    });
    // } else
    //   Response.handle(req, res, "error", 400, {
    //     status: false,
    //     message: "Something went wrong",
    //     data: []
    //   });
  } catch (e) {
    return Exception.handle(e, res, req, "updatedietList");
  }
}
exports.submitRecommandationList = async (req, res) => {
  const { state_id } = req.body;
  const apiYear = req?.headers?.api_year;
  try {
    const inserted = await Model.knx().raw(`update `)

    return Response.handle(req, res, "updatedietList", 200, {
      status: true,
      data: object?.rows
    });
  } catch (e) {
    return Exception.handle(e, res, req, "updatedietList");
  }
};
exports.submitApprovedPlanPmshri = async (req, res) => {
  const data = req.body;
  const updated_by = req.auth.user.id;
  const updated_at = DTime.create().format("Y-m-d H:M:S");
  const plan_year = req?.headers?.api_year;

  try {
    const insert = await Model.knx().raw(`UPDATE public.pmshri_state_ann_wrk_pln_bdgt_data
    set status=${data.status}
    WHERE state_id=${data.state_id} `);

    return Response.handle(req, res, "submitApprovedDIETPlan", 200, {
      status: true,
      message: "Data Approved Successfully",
    });

  } catch (e) {
    return Exception.handle(e, res, req, "submitApprovedDIETPlan");
  }
};

// ALLCOATION 

exports.allocationList = async (req, res) => {
  try {
    const { state_id } = req.body;
    const apiYear = req?.headers?.api_year;
    const object = await Model.knx().raw(`
    select psawpbd.*,pd.activity_master_details_name,pd.activity_master_name,pd.sub_component_name,
      psawpbd.activity_master_details_id,
      coalesce(sum(psawpbdpa.allocated_financial_amount),0) as total_financial_amount,
      coalesce(sum(psawpbdpa.allocated_physical_quantity),0) as total_physical_quantity
    from
      public.pmshri_state_ann_wrk_pln_bdgt_data as psawpbd
      left join public.pmshri_data as pd on
      psawpbd.activity_master_details_id = pd.id
      left join
      public.pmshri_state_ann_wrk_pln_bdgt_data_physical_asset as psawpbdpa
      on psawpbd.activity_master_details_id = psawpbdpa.activity_master_details_id 
    where
      psawpbd.state_id = ${state_id} and psawpbd.plan_year='${apiYear}'
        group by psawpbd.activity_master_details_id,
        psawpbd.pmshri_state_ann_wrk_pln_bdgt_data_id,
        pd.activity_master_details_name,
        pd.activity_master_name ,
        pd.sub_component_name
        order by pd.sub_component_name, pd.activity_master_name, pd.activity_master_details_name`)
    if (object?.rows) {
      return Response.handle(req, res, "allocationList", 200, {
        status: true,
        data: object.rows,
        message: "Data fetch successfully.",
      });
    }
  } catch (e) {
    return Exception.handle(e, res, req, "allocationList");
  }
};
exports.submitTempAllocationList = async (req, res) => {
  try {
    const csvData = req.file?.buffer?.toString("utf-8");
    const decryptObj = JSON.parse(Hash.decrypt(req.body.secure));
    const activity_detail_id = decryptObj?.activity_detail_id;
    const state_id = decryptObj?.state_id;
    const year = req.headers?.api_year;

    const deleteall = await Model.knx()
      .raw(`DELETE FROM pmshri_school_validation WHERE state_id =${state_id} and activity_detail_id =${activity_detail_id}`);

    let records = await new Promise((resolve, reject) => {
      const results = [];
      const parser = csv({ columns: true });
      parser.on("data", (data) => {
        results.push(data);
      });
      parser.on("end", () => resolve(results));
      parser.on("error", (error) => reject(error));
      parser.write(csvData);
      parser.end();
    });

    const padZeros = (udiseValue, length) => {
      if (udiseValue.length === length) {
        udiseValue = "0" + udiseValue;
      }
      return udiseValue;
    };
    const udiseValues = records
      .map((record) => padZeros(String(record.UDISE), 10))
      .join("','");

    const chkUDISE = await Model.knx().raw(
      `SELECT udise_sch_code FROM pmshri_school_master WHERE udise_sch_code IN ('${udiseValues}') AND state_id = ${state_id}`
    );
    let insert;
    let success_udise_array = []
    let failed_udise_array = []
    for (const record of records) {
      let obj = {}
      for (let key in record) {
        const sanitizedKey = key.replace(/"/g, "").trim();
        obj[sanitizedKey] = record[key];

        record[sanitizedKey] = record[key];
      }
      let udiseValue = padZeros(String(record.UDISE), 10);

      if (udiseValue.length > 11) {
        udiseValue = udiseValue.slice(0, 11);
      }
      if (
        chkUDISE.rows.find((row) => {
          return row.udise_sch_code === udiseValue;
        })?.udise_sch_code
      ) {
        insert = await allocationModel.create(
          {
            udise_sch_code: record.UDISE,
            financial_amount: !isNaN(record?.["ALLOCATE FINANCIAL AMOUNT"])
              ? +record?.["ALLOCATE FINANCIAL AMOUNT"]
              : 0,
            unit_cost: !isNaN(record?.["ALLOCATE UNIT COST"])
              ? +record?.["ALLOCATE UNIT COST"]
              : 0,
            physical_quantity: !isNaN(record?.["ALLOCATE PHYSICAL QUANTITY"])
              ? +record?.["ALLOCATE PHYSICAL QUANTITY"]
              : 0,
            state_id: state_id,
            activity_detail_id: activity_detail_id,
            valid_udise_yn: 1,
            plan_year: year,
          }
        );
        success_udise_array.push(record.UDISE);
      } else {
        insert = await allocationModel.create(
          {
            udise_sch_code: record.UDISE,
            financial_amount: !isNaN(record?.["ALLOCATE FINANCIAL AMOUNT"])
              ? +record?.["ALLOCATE FINANCIAL AMOUNT"]
              : 0,
            unit_cost: !isNaN(record?.["ALLOCATE UNIT COST"])
              ? +record?.["ALLOCATE UNIT COST"]
              : 0,
            physical_quantity: !isNaN(record?.["ALLOCATE PHYSICAL QUANTITY"])
              ? +record?.["ALLOCATE PHYSICAL QUANTITY"]
              : 0,
            state_id: state_id,
            activity_detail_id: activity_detail_id,
            valid_udise_yn: 0,
            plan_year: year,
          }
        );
        failed_udise_array.push(record.UDISE);
      }
    }
    const strings = success_udise_array.map(num => (`'${num}'`));
    let valid_school_list
    if (strings?.length > 0) {
      valid_school_list = await Model.knx().raw(`SELECT udise_sch_code, school_name FROM pmshri_school_master psm WHERE udise_sch_code IN (${strings})`);
    }
    if (insert) {
      const data = await Model.knx()
        .raw(`select * from pmshri_state_ann_wrk_pln_bdgt_data_physical_asset where state_id =${state_id} and plan_year='${year}'`);
      res.status(200).json({
        status: 200,
        data: data?.rows,
        valid: valid_school_list?.rows || [],
        in_valid: failed_udise_array || [],
        message: "Document Inserted",
      });
    }
  } catch (e) {
    console.log(e);
    return Exception.handle(e, res, req, "state-file-uploaded-detail");
  }
}
exports.submitAllocationList = async (req, res) => {
  try {
    const { state_id, activity_detail_id } = req.body;
    const year = req?.headers?.api_year;

    const recommended_data = await Model.knx().raw(`select * from pmshri_state_ann_wrk_pln_bdgt_data where state_id =${state_id} and activity_master_details_id =${activity_detail_id}`)
    const uploadeddata = await Model.knx().raw(`select coalesce(sum(psv.financial_amount),0) as total_financial_amount,
    coalesce(sum(psv.physical_quantity),0) as total_physical_quantity
  from public.pmshri_school_validation psv where psv.activity_detail_id = '${activity_detail_id}' and valid_udise_yn='1'`)
    let insert
    if (+recommended_data?.rows[0]["recomended_physical_quantity"] === +uploadeddata?.rows[0]['total_physical_quantity'] && +recommended_data?.rows[0]["recomended_financial_amount"] === +uploadeddata.rows[0]["total_financial_amount"]) {

      const deleteall = await Model.knx().raw(`delete from pmshri_state_ann_wrk_pln_bdgt_data_physical_asset where state_id =${state_id} and activity_master_details_id=${activity_detail_id} and plan_year='${year}'`);

      const valid_data = await Model.knx().raw(`select * from pmshri_school_validation psv  where psv.state_id =${state_id} and psv.activity_detail_id =${activity_detail_id} and psv.valid_udise_yn='1'`);

      for (let i = 0; i < valid_data?.rows?.length; i++) {
        insert = await Model.knx().raw(`INSERT INTO public.pmshri_state_ann_wrk_pln_bdgt_data_physical_asset
        (asset_code, asset_type, state_id, district, activity_master_details_id, scheme_id, sub_component_id, major_component_id, activity_master_id, pmshri_ann_wrk_pln_bdgt_data_id, applicable_yn, block, allocated_physical_quantity, allocated_financial_amount, plan_year, pmshri_state_ann_wrk_pln_bdgt_data_physical_asset_id, status, allocated_unit_cost)
        VALUES(${valid_data?.rows[i]["udise_sch_code"]}, 0, ${state_id}, 0, ${activity_detail_id}, 0, 0, 0, 0, 0, 0, 0, ${valid_data?.rows[i]["physical_quantity"]}, ${valid_data?.rows[i]["financial_amount"]}, ${year}, nextval('pmshri_state_ann_wrk_pln_bdgt_pmshri_state_ann_wrk_pln_bdg_seq1'::regclass), 0, ${valid_data?.rows[i]["unit_cost"]})`)
      }
    }
    await Model.knx().raw(`DELETE FROM pmshri_school_validation WHERE state_id =${state_id} and activity_detail_id =${activity_detail_id}`)
    if (insert) {
      return res.status(200).json({
        status: true,
        message: "Document Inserted Successfully",
      });
    } else {
      return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Document Not Inserted.",
      });
    }
  } catch (e) {
    console.log(e);
    return Exception.handle(e, res, req, "state-file-uploaded-detail");
  }
}
exports.DeleteTempAllocationList = async (req, res) => {
  const { state_id, activity_detail_id } = req.body
  const delete_Data = await Model.knx().raw(`DELETE FROM pmshri_school_validation WHERE state_id =${state_id} and activity_detail_id =${activity_detail_id}`);

  res.status(200).json({
    status: true,
    message: "Data not Inserted.",
  });
}
exports.allocationSchoolList = async (req, res) => {
  try {
    const { activity_detail_id, state_id } = req.body;
    const apiYear = req?.headers?.api_year;
    const object = await Model.knx().raw(`select pawpbdpa.asset_code,
    psm.school_name,pawpbdpa.allocated_physical_quantity,pawpbdpa.allocated_financial_amount,pawpbdpa.allocated_unit_cost
    from
    pmshri_state_ann_wrk_pln_bdgt_data_physical_asset pawpbdpa
    left join pmshri_school_master psm on
    pawpbdpa.asset_code = psm.udise_sch_code
    where
    pawpbdpa.activity_master_details_id = ${activity_detail_id} and pawpbdpa.state_id=${state_id}`)

    if (object?.rows) {
      return Response.handle(req, res, "allocationList", 200, {
        status: true,
        data: object.rows,
        message: "Data fetch successfully.",
      });
    }
  } catch (e) {
    return Exception.handle(e, res, req, "allocationList");
  }
};


