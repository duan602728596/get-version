/* reducers */
import { combineReducers } from 'redux-immutable';
import indexReducer from '../modules/Index/store/reducer';

const reducers: Object = {
  ...indexReducer
};

/* 创建reducer */
export function createReducer(asyncReducers: Object): Function{
  return combineReducers({
    ...reducers,
    ...asyncReducers
  });
}