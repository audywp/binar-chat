import {combineReducers} from 'redux';
import UserReducer from './userReducer';

export const allReducers = combineReducers({
  user: UserReducer,
});
