import { queryAdvInvRecord } from '../services/api';
import {callbackDeal} from '../utils/serviceCallBack';

export default {
    namespace: 'advInvRecord',

    state: {
        dataList:[],
        total:0,
        pageSize:20,
        pageCurrent:1,
    },

    effects: {
        *fetch({payload}, { call, put }) {
            const response = yield call(queryAdvInvRecord,payload);
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
                dataList:[],
                total:0,
                pageSize:20,
                pageCurrent:1,
            };
        },
    },
};
