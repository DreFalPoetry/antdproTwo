import { queryAdvStatement,queryEmployee,queryAdvAccount } from '../services/api';
import {callbackDeal} from '../utils/serviceCallBack';
import { list } from 'postcss';

export default {
    namespace: 'advStatement',

    state: {
        dataList:[],
        total:0,
        pageSize:20,
        pageCurrent:1,
        headerInfo:{
            total:null,
            invoiced:null,
            rejected:null,
            approved:null
        }
    },

    effects: {
        *fetch({payload}, { call, put }) {
            const response = yield call(queryAdvStatement,payload);
            const finallResult = callbackDeal(response);
            if (finallResult == 'successCallBack') {
                const dataList = response.data;
                const headerInfo = response.headerInfo;
                dataList.filter((item,index) => {
                    item.uniqueKey = index+1;
                });
                yield put({
                    type: 'asyncDataList',
                    payload: dataList,
                });
                yield put({
                    type: 'asyncHeaderInfo',
                    payload: headerInfo,
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
        asyncHeaderInfo(state, { payload }) {
            return {
                ...state,
                headerInfo:payload,
            };
        },
        clear() {
            return {
                dataList:[],
                total:0,
                pageSize:20,
                pageCurrent:1,
                headerInfo:{
                    total:null,
                    invoiced:null,
                    rejected:null,
                    approved:null
                }
            };
        },
    },
};
