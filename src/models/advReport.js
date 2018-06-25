import { queryadvReport } from '../services/api';
import {callbackDeal} from '../utils/serviceCallBack';

export default {
    namespace: 'advReport',

    state: {
        dataList:[]
    },

    effects: {
        *fetch(_, { call, put }) {
            const response = yield call(queryadvReport);
            const finallResult = callbackDeal(response);
            if (finallResult == 'successCallBack') {
                const dataList = response.data;
                dataList.filter((item,index) => {
                    item.uniqueKey = index+1;
                });
                yield put({
                    type: 'asyncDataList',
                    payload: dataList,
                });
            }
            
        },
    },

    reducers: {
        asyncDataList(state, { payload }) {
            return {
                ...state,
                dataList:payload,
            };
        },
        clear() {
            return {
                dataList:[]
            };
        },
    },
};
