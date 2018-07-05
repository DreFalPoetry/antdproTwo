import { queryAdvStatement,queryEmployee,queryAdvAccount,queryPubStatementSummary } from '../services/api';
import {callbackDeal} from '../utils/serviceCallBack';
import { list } from 'postcss';

export default {
    namespace: 'pubStatement',

    state: {
        dataList:[],
        summaryDataList:[],
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
        *fetchSummary({payload}, { call, put }) {
            const response = yield call(queryPubStatementSummary,payload);
            const finallResult = callbackDeal(response);
            if (finallResult == 'successCallBack') {
                const summaryDataList = response.data;
                summaryDataList.filter((item,index) => {
                    item.uniqueKey = index+1;
                });
                yield put({
                    type: 'asyncSummaryDataList',
                    payload: summaryDataList,
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
        asyncSummaryDataList(state, { payload }) {
            return {
                ...state,
                summaryDataList:payload,
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
