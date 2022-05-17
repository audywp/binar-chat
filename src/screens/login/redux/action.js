export const USER_DATA = 'USER_DATA';
export const LOG_OUT = 'LOG_OUT';

export const setDataUser = payload => {
  return {
    type: USER_DATA,
    payload,
  };
};

export const logOut = () => {
  return {
    type: LOG_OUT,
  };
};
