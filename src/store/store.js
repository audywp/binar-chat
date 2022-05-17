import {applyMiddleware, createStore} from 'redux';
import {persistReducer, persistStore} from 'redux-persist';
import storage from '@react-native-async-storage/async-storage';
import logger from 'redux-logger';
import {allReducers} from './allReducer';

const config = {
  key: 'binar-chat',
  storage,
  timeout: null,
};

const persistedReducer = persistReducer(config, allReducers);
const allMidlleware = applyMiddleware(logger);

export const store = createStore(persistedReducer, {}, allMidlleware);
export const persistor = persistStore(store);
