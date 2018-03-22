import { createAction, handleActions } from 'redux-actions';
import { fromJS } from 'immutable';

const initData: {
  fileList: Array
} = {
  fileList: []  // 文件列表
};

/* Action */
export const fileList: Function = createAction('文件列表');

/* reducer */
const reducer: Function = handleActions({
  [fileList]: ($$state: Immutable.Map, action: Object): Immutable.Map=>{
    return $$state.set('fileList', action.payload.data);
  }
}, fromJS(initData));

export default {
  index: reducer
};