import { createAction } from "@reduxjs/toolkit";
import createRestAction from "../../../utils/restActionCreator";


export const getUserInfoAction = createAction('GET_USER_INFO_INTERNAL');

export const {
    action: getUserInfo,
    success: getUserInfoSuccess,
    error: getUserInfoError,
  } = createRestAction('USER_INFO', 'me', 'GET');