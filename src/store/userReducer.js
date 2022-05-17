import {SET_CHOOSEN_USER} from '../screens/home/redux/action';
import {LOG_OUT, USER_DATA} from '../screens/login/redux/action';

const initialState = {};

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_DATA:
      return {
        ...state,
        _user: action.payload,
      };
    case SET_CHOOSEN_USER:
      return {
        ...state,
        selectedUser: action.payload,
      };
    case LOG_OUT: {
      return {};
    }
    default:
      return state;
  }
};
export default UserReducer;
