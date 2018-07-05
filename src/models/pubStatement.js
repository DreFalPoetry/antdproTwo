import { queryAffiliate,queryCampaign,queryEmployee,queryPubStatement,queryPubStatementSummary } from '../services/api';
import {callbackDeal} from '../utils/serviceCallBack';

export default {
    namespace: 'pubStatement',

    state: {
        dataList:[],
        summaryDataList:[],
        total:0,
        pageSize:20,
        pageCurrent:1,
        total1:0,
        pageSize1:20,
        pageCurrent1:1,
        headerInfo:{
            total:null,
            invoiced:null,
            rejected:null,
            approved:null
        },
        affiliateList:[],
        campaignList:[],
        tableQuery:{
            affiliateId:null,
            campaignId:null,
            employeeId:null,
            month:'',
            status:null
        }
    },

    effects: {
        *fetch({payload}, { call, put }) {
            const response = yield call(queryPubStatement,payload);
            const finallResult = callbackDeal(response);
            if (finallResult == 'successCallBack') {
                const dataList = response.data;
                const headerInfo = response.headerInfo;
                const total = response.total;
                const pageSize = response.pageSize;
                const pageCurrent = response.pageCurrent;
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
                yield put({
					type: 'syancTablePage',
					payload: { total, pageSize, pageCurrent},
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
                const total1 = response.total;
                const pageSize1 = response.pageSize;
                const pageCurrent1 = response.pageCurrent;
				yield put({
					type: 'syancTablePage1',
					payload: { total1, pageSize1, pageCurrent1},
				});
                yield put({
                    type: 'asyncSummaryDataList',
                    payload: summaryDataList,
                });
            }
        },
        *fetchAffiliate({ payload }, { call, put }) {
            const response = yield call(queryAffiliate,payload);
            const finallResult = callbackDeal(response);
            if (finallResult == 'successCallBack') {
                const affiliateTempList = response.data;
                let affiliateList = [];
                affiliateList = affiliateTempList.map((item,index) => {
                    let listItem = {};
                    listItem.text = `${item.id} - ${item.name}`;
                    listItem.value = item.id; 
                    listItem.key = index+1;
                    return listItem;
                });
                yield put({
                    type: 'asyncAffiliateList',
                    payload: affiliateList,
                });
            }
        },
        *fetchCampaign({ payload }, { call, put }) {
            const response = yield call(queryCampaign,payload);
            const finallResult = callbackDeal(response);
            if (finallResult == 'successCallBack') {
                const tempCampaignList = response.data;
                let campaignList = [];
                campaignList = tempCampaignList.map((item,index) => {
                    let listItem = {};
                    listItem.text = `${item.id} - ${item.name}`;
                    listItem.value = item.id; 
                    listItem.key = index+1;
                    return listItem;
                });
                yield put({
                    type: 'asyncCampaignList',
                    payload: campaignList,
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
        asyncAffiliateList(state, { payload }) {
            return {
                ...state,
                affiliateList:payload,
            };
        },
        asyncCampaignList(state, { payload }) {
            return {
                ...state,
                campaignList:payload,
            };
        },
        asyncQueryData(state, { payload }) {
            return {
                ...state,
                tableQuery:payload,
            };
        },
        syancTablePage(state, { payload: { total, pageSize,pageCurrent } }) {
			return {
				...state,
				total,
                pageSize,
                pageCurrent
			};
        },
        syancTablePage1(state, { payload: { total1, pageSize1,pageCurrent1 } }) {
			return {
				...state,
				total1,
                pageSize1,
                pageCurrent1
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
