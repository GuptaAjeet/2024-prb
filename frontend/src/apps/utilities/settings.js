import { Helper } from "..";

const user_role_id = Helper.auth?.user?.user_role_id;

const handleIncludesOperation = (arr, key = +user_role_id, isNotInArray = false, isKeyForcedString = false) => {
    if(arr === null || arr === undefined || arr.length === 0 || key === null || key === undefined){
        return false;
    }
    else if(isNotInArray === true){
        if(isKeyForcedString === true){
            return (!arr.includes(key.toString()))
        }
        else{
            return (!arr.includes(key))
        }
    }
    else{
        if(isKeyForcedString === true){
            return (arr.includes(key.toString()))
        }
        else{
            return (arr.includes(key))
        } 
    }
}

const isAdminUser = () => {
    return handleIncludesOperation([1], +user_role_id);
};

const isNotViewer = () => {
    return handleIncludesOperation([7, 11, 12], +user_role_id, true);
};

const isNationalUser = (userId = +user_role_id) => {
    return handleIncludesOperation([1, 2, 3, 15, 16, 17, 12, 23, 24, 25], userId);
};

const isDistrictUser = (userId = +user_role_id) => {
    return handleIncludesOperation([8, 9, 10, 11], userId);
};

const isNationalOrStateUser = () => {
    return handleIncludesOperation([1, 2, 3, 4, 5, 6, 7], +user_role_id);
};

const isNotTeacher = () => {
    return handleIncludesOperation([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], +user_role_id);
};

const isNotNationalUser = () => {
    return handleIncludesOperation([1, 2, 3, 15,17], +user_role_id, true);
};

const isStateApproverUser = () => {
    return handleIncludesOperation([4, 6], +user_role_id);
};

const districtStatus = (district_status) => {
    return handleIncludesOperation([1, 2], +district_status);
};

const checkStateId = (data, state_id) => {
    return handleIncludesOperation(data, state_id, false, true);
};

const isDataExistsInArray = (data, key) => {
    return handleIncludesOperation(data, key);
};

const isDataNotExistsInArray = (data, key) => {
    return handleIncludesOperation(data, key, true);
};

const isDistrictApproverUser = () => {
    return handleIncludesOperation([8, 10], +user_role_id);
};

const isStateUser = (userId = +user_role_id) => {
    return handleIncludesOperation([4, 5, 6, 7], userId);
};

const isStateDataEntryUser = () => {
    return handleIncludesOperation([4, 5, 17]);
};

const isNFCNICSC = () => {
    return handleIncludesOperation([2, 3, 15,17], +user_role_id);
};

const isNotDistrictUser = () => {
    return handleIncludesOperation([1, 2, 3, 4, 5, 6, 7, 12, 15, 17, 16, 23, 24], +user_role_id);
};

const isAdminNFCNICSC = (userId = +user_role_id) => {
    return handleIncludesOperation([1, 2, 3,12, 15,17, 16], +userId);
};

const isAdminOrStateUser = () => {
    return handleIncludesOperation([1, 4, 5, 6, 7], +user_role_id);
};

const isMultiStateUser = (userId) => {
    return handleIncludesOperation([15, 17, 23, 24], +userId);
};

const isMultiStateUserButNotCooridnator = (userId) => {
    return handleIncludesOperation([17, 23, 24], +userId);
};

const isDietUser = (userId = +user_role_id) => {
    return handleIncludesOperation([25,26,27], +userId);
};

const AllRsInLacksLabel = "(All ₹ In Lakhs)" 

const settings = {
    isAdminUser,
    isNotViewer,
    isNationalUser,
    isDistrictUser,
    isNationalOrStateUser,
    isNotTeacher,
    isNotNationalUser,
    isStateUser,
    districtStatus,
    checkStateId,
    isDataExistsInArray,
    isDataNotExistsInArray,
    isStateApproverUser,
    isStateDataEntryUser,
    isDistrictApproverUser,
    isNFCNICSC,
    isNotDistrictUser,
    isAdminNFCNICSC,
    isAdminOrStateUser,
    isMultiStateUser,
    isMultiStateUserButNotCooridnator,
    isDietUser,
    AllRsInLacksLabel
};

export default settings;