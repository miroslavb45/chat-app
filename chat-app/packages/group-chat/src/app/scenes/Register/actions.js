import createRestAction from '../../../utils/restActionCreator';

export const {
  action: registerUser,
  success: registerUserSuccess,
  error: registerUserError,
} = createRestAction('REGISTER_USER', 'register', 'POST');
