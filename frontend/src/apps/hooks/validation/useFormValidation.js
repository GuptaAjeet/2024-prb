import Validate from "../../utilities/validate";
import Helper from "../../utilities/helper";
import Rules from "../../utilities/rules";
import React, { useState } from "react";

const useFormValidation = (fInputs) => {
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({});
  const [form, setForm] = useState({ disable: true });

  const errorSetter = (input, msg = "", val = true) => {
    setErrors({ ...errors, [input]: { message: msg, valid: val } });
  };

  const validate = (input, value, e) => {
    switch (input) {
      case "name":
        errorSetter(input);
        Validate.onlyAlphaNumSpace(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.name, false);
        }
        break;
      case "self_user_id":
        errorSetter(input);
        Validate.validMobile(e);
        if (Validate.isEmpty(e)) {
          setForm({ disable: true });
          return errorSetter(input, Rules.user_mobile, false);
        }
        if (Validate.strLen(e) > 0 && Validate.strLen(e) < 10) {
          return errorSetter(input, Rules.validMobile, false);
        }
        break;
      // case "ref_user_id":
      //   errorSetter(input);
      //   Validate.onlyNumeric(e);
      //   if (Validate.isEmpty(e)) {
      //     setForm({ disable: true });
      //     return errorSetter(input, Rules.ref_user_mobile, false);
      //   }
      //   break;
      case "student_count":
        errorSetter(input);
        Validate.removeSpace(e);
        Validate.onlyNumeric(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.selectImpactedStudent, false);
        }
        break;

      case "quantity":
        errorSetter(input);
        Validate.removeSpace(e);
        Validate.onlyNumeric(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.quantity, false);
        }
        break;
      case "recived_qty":
        errorSetter(input);
        Validate.removeSpace(e);
        Validate.onlyNumeric(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.quantity, false);
        }
        break;

      case "approve_qty":
        errorSetter(input);
        Validate.removeSpace(e);
        Validate.onlyNumeric(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.approveQty, false);
        }
        break;

      case "receiptDate":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.receiptDate, false);
        }
        break;

      case "delivery_status":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.deliveyStatus, false);
        }
        break;

      case "reason_closer":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.slelectColser, false);
        }
        break;

      case "darpanId":
        errorSetter(input);
        //Validate.onlyAlpha(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.darpanId, false);
        }
        if (Validate.strLen(e) > 0 && Validate.strLen(e) < 15) {
          return errorSetter(input, Rules.darpanLen, false);
        }
        if (!Validate.validDarpan(e)) {
          return errorSetter(input, Rules.validDarpan, false);
        }
        break;
      case "pan":
        errorSetter(input);
        Validate.onlyAlphaNum(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.panNo, false);
        }
        if (Validate.strLen(e) > 0 && Validate.strLen(e) < 10) {
          return errorSetter(input, Rules.panLen, false);
        }
        if (!Validate.validPan(e)) {
          setForm({ disable: true });
          return errorSetter(input, Rules.validPan, false);
        }
        break;
      case "email":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, "Please enter email id", false);
        }
        if (!Validate.validEmail(e)) {
          setForm({ disable: true });
          return errorSetter(input, Rules.validEmail, false);
        }
        break;
      case "vmobile":
        errorSetter(input);
        if (
          fInputs[5].current.value === "91" &&
          fInputs[5].current.value !== 0
        ) {
          Validate.validMobile(e);
        }
        Validate.removeSpace(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.mobile, false);
        }

        if (
          fInputs[5].current.value === "91" &&
          fInputs[5].current.value !== 0
        ) {
          if (Validate.strLen(e) !== 10) {
            setForm({ disable: true });
          }
          if (Validate.strLen(e) > 0 && Validate.strLen(e) < 10) {
            setForm({ disable: true });
            return errorSetter(input, Rules.validMobile, false);
          }
        } else {
          if (Validate.strLen(e) < 8 || Validate.strLen(e) > 14) {
            setForm({ disable: true });
            Validate.validNriMobile(e);
            return errorSetter(input, Rules.validNriMobile, false);
          } else {
            Validate.validNriMobile(e);
          }
        }
        break;
      case "mobile":
        errorSetter(input);
        Validate.validMobile(e);
        if (Validate.strLen(e) !== 10) {
          setForm({ disable: true });
        }
        if (Validate.isEmpty(e)) {
          return errorSetter(input, "Please enter mobile number", false);
        }
        if (Validate.strLen(e) > 0 && Validate.strLen(e) < 10) {
          return errorSetter(input, Rules.validMobile, false);
        }
        break;
      case "activity_category":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.slelectCategory, false);
        }
        break;
      case "type_master_id":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.slelectCategory, false);
        }
        break;
      case "activity_name":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectActivtyName, false);
        }
        break;
      case "sub_category":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectActivtyName, false);
        }
        break;
      case "activity_class":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectClassName, false);
        }
        break;
      case "maintenance_required":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectMaintenenceName, false);
        }
        break;
      case "specialization":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectSpecializationName, false);
        }
        break;
      case "gender":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectGenderName, false);
        }
        break;
      case "specializations":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectspecializationsName, false);
        }
        break;
      case "start_date":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.selectStartDate, false);
        }
        break;
      case "meetingDate":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.meetingDate, false);
        }
        break;
      case "actualStartDate":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.actualStartDate, false);
        }
        break;
      case "actualEndDate":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.actualEndDate, false);
        }
        break;
      case "last_date":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.selectLastDate, false);
        }
        break;
      case "last_application_date":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.selectLastDate, false);
        }
        break;
      case "expected_date":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.selectLastDate, false);
        }
        break;
      case "duration":
        errorSetter(input);
        Validate.removeSpace(e);
        Validate.onlyNumeric(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.selectDuration, false);
        }
        if (e.target.value > 50) {
          setForm({ disable: true });
          e.target.value = "";
          return errorSetter(input, Rules.maxDuration, false);
        }
        break;
      case "asset_qty":
        Validate.removeSpace(e);
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.Qty, false);
        }
        break;
      case "asset_category_name":
        Validate.removeSpace(e);
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.selectAsset, false);
        }
        break;
      case "asset_sub_category_name":
        // Validate.removeSpace(e);
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.sub_asset, false);
        }
        break;
      case "units":
        // Validate.removeSpace(e);
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.unit, false);
        }
        break;
      case "details":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.details, false);
        }
        if (Helper.countWords(e.target.value) < 20) {
          return errorSetter(input, Rules.minSize, false);
        }
        if (Helper.countWords(e.target.value) > 50) {
          return errorSetter(input, Rules.maxSize, false);
        }
        break;
      case "message":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.message, false);
        }
        if (Helper.countWords(e.target.value) < 20) {
          setForm({ disable: true });
          return errorSetter(input, Rules.minSize, false);
        }
        break;
      case "subject":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.subject, false);
        }
        break;
      case "role":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectRoleName, false);
        }
        break;
      case "state":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectStateName, false);
        }
        break;

      case "vtype":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectVtypeName, false);
        }
        break;

      case "feedback":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.feedback, false);
        }
        break;
      case "district":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectDistrictName, false);
        }
        break;
      case "block":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectBlockName, false);
        }
        break;
      case "udise":
        errorSetter(input);
        Validate.validUdiseCode(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.udisecode, false);
        }
        if (Validate.strLen(e) !== 11) {
          setForm({ disable: true });
          return errorSetter(input, Rules.validUdiseLen, false);
        }
        // if(!Validate.validUdise(e)){
        //     setForm({disable:true});
        //     return errorSetter(input,Rules.validUdiseCode,false);
        // }
        break;
      case "logpass":
        Validate.removeSpace(e);
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.password, false);
        }
        break;
      case "oldpass":
        Validate.removeSpace(e);
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.oldPassword, false);
        }
        break;
      case "password":
        Validate.removeSpace(e);
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.password, false);
        }
        if (Validate.strLen(e) < 8) {
          return errorSetter(input, Rules.passwordLength, false);
        }
        if (!Validate.isPasswordStrong(e) && Validate.strLen(e) > 4) {
          setForm({ disable: true });
          return errorSetter(input, Rules.passwordStrong, false);
        }
        break;
      case "cpassword":
        Validate.removeSpace(e);
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.confirmPassword, false);
        }
        if (Validate.strLen(e) < 8) {
          return errorSetter(input, Rules.passwordLength, false);
        }
        if (!Validate.isPasswordStrong(e) && Validate.strLen(e) > 4) {
          setForm({ disable: true });
          return errorSetter(input, Rules.passwordStrong, false);
        }
        break;
      case "otp":
        Validate.removeSpace(e);
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.otp, false);
        }
        if (Validate.strLen(e) !== 6) {
          setForm({ disable: true });
          return errorSetter(input, Rules.validOtp, false);
        }
        break;
      case "captcha":
        Validate.removeSpace(e);
        errorSetter(input);
        Validate.onlyAlphaNum(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.captcha, false);
        }
        if (Validate.strLen(e) !== 6) {
          setForm({ disable: true });
          return errorSetter(input, Rules.captchaLength, false);
        }
        break;
      case "country":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectCountry, false);
        }
        break;
      case "designation":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.selectDesignationName, false);
        }
        break;
      // case "title":
      //   errorSetter(input);
      //   Validate.onlyAlpha(e);
      //   if (Validate.isEmpty(e)) {
      //     return errorSetter(input, Rules.name, false);
      //   }
      //   break;
      case "description_upload_document":
        errorSetter(input);
        Validate.onlyAlpha(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.description, false);
        }
        break;
      case "status":
        errorSetter(input);
        Validate.onlyAlpha(e);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.status, false);
        }
        break;
      case "type_code":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.typecode, false);
        }
        break;
      case "state_id":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.stateid, false);
        }
        break;
      case "district_id":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.districtid, false);
        }
        break;
      case "block_id":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.blockid, false);
        }
        break;
      case "links_to_school":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.linktoschool, false);
        }
        break;
      case "udise_code":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.udisecode, false);
        }
        break;
      case "upload_year":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.upload_year, false);
        }
        break;

      case "file_type":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.file_type, false);
        }
        break;
      case "document_type":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.document_type, false);
        }
        break;
      case "master_type_detail_id":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.master_type_detail_id, false);
        }
        break;
        case "diet":
        errorSetter(input);
        if (Validate.isSelected(e)) {
          return errorSetter(input, Rules.selectDIETName, false);
        }
        break;
      case "comment":
        errorSetter(input);
        if (Validate.isEmpty(e)) {
          return errorSetter(input, Rules.comment, false);
        }
        if (Helper.countWords(e.target.value) < 3) {
          setForm({ disable: true });
          return errorSetter(input, Rules.commentMinSize, false);
        }
        break;
      default:
        break;
    }
  };

  const handleChange = (e, fieldName = null) => {
    let name, value;
    if (fieldName == null) {
      e.persist();
      if (e.target.type === "file") {
        name = e.target.name;
        value = e.target.files[0];
      } else {
        name = e.target.name;
        value = e.target.value.replace(/^\s+|\s{2,}/g, "");
      }
    } else {
      name = fieldName;
      value = e;
    }
    setValues({ ...values, [name]: value });

    checkFormValidHandler(fInputs);
    validate(name, value, e);
  };

  const checkFormValidHandler = (fInputs) => {
    setForm({ disable: Validate.isFormValid(fInputs) });
  };

  return { form, errors, values, handleChange };
};

export default useFormValidation;
