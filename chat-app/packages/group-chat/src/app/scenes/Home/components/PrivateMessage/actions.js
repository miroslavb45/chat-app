import { createAction } from "@reduxjs/toolkit";
import createRestAction from "../../../../../utils/restActionCreator";

export const getPrivateMessagingAction = createAction("GET_PRIVATE_MESSAGING_INTERNAL");

export const {
    action: getPrivateMessaging,
    success: getPrivateMessagingSuccess,
    error:getPrivateMessagingError,
  } = createRestAction('PRIVATE_MESSAGING', 'messaging', 'GET');