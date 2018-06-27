import { queryadvReport,queryEmployee,queryAdvAccount } from '../services/api';
import {callbackDeal} from '../utils/serviceCallBack';
import { list } from 'postcss';

export default {
    namespace: 'advReport',

    state: {
        dataList:[],
        listHeaderInfo:{
            total:0,
            totalConv:0,
            fraud:'0%',
            revenue:0,
            cost:0,
            margin:'0%'
        },
        listQuery:{
            keyWords:'',
            advAccountId:null,
            startDate:'',
            endDate:'',
            dateType:0,
            employeeId:null
        },
        total:0,
        pageSize:20,
        pageCurrent:1,
        employeeList:[],
        advAccountList:[],
    },

    effects: {
        *fetch({payload}, { call, put }) {
            const response = yield call(queryadvReport,payload);
            const finallResult = callbackDeal(response);
            if (finallResult == 'successCallBack') {
                const dataList = response.data;
                const listHeaderInfo = response.headerInfo;
                dataList.filter((item,index) => {
                    item.uniqueKey = index+1;
                });
                yield put({
                    type: 'asyncDataList',
                    payload: dataList,
                });
                yield put({
                    type: 'asyncListHeaderInfo',
                    payload: listHeaderInfo,
                });
            }
        },
        *fetchEmployee({ payload }, { call, put }) {
            const response = yield call(queryEmployee,payload);
            const finallResult = callbackDeal(response);
            if (finallResult == 'successCallBack') {
                const employeeTempList = response.data;
                let employeeList = [];
                employeeList = employeeTempList.map((item,index) => {
                    let listItem = {};
                    listItem.text = `${item.name} <${item.email}>`;
                    listItem.value = item.id; 
                    listItem.key = index+1;
                    return listItem;
                });
                yield put({
                    type: 'asyncEmployeeList',
                    payload: employeeList,
                });
            }
        },
        *fetchAdvAccount({ payload }, { call, put }) {
            const response = yield call(queryAdvAccount,payload);
            const finallResult = callbackDeal(response);
            if (finallResult == 'successCallBack') {
                const advAccountTempList = response.data;
                let advAccountList = [];
                advAccountList = advAccountTempList.map((item,index) => {
                    let listItem = {};
                    listItem.text = `${item.name} <${item.email}>`;
                    listItem.value = item.id; 
                    listItem.key = index+1;
                    return listItem;
                });
                yield put({
                    type: 'asyncAdvAccountList',
                    payload: advAccountList,
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
        asyncListHeaderInfo(state, { payload }) {
            return {
                ...state,
                listHeaderInfo:payload,
            };
        },
        asyncListQuery(state, { payload }) {
            return {
                ...state,
                listQuery:payload,
            };
        },
        asyncEmployeeList(state, { payload }) {
            return {
                ...state,
                employeeList:payload,
            };
        },
        asyncAdvAccountList(state, { payload }) {
            return {
                ...state,
                advAccountList:payload,
            };
        },
        clearEmployeeAndAdvAccount() {
            return {
                employeeList:[],
                advAccountList:[],
            };
        },
        clear() {
            return {
                dataList:[],
                listHeaderInfo:{
                    total:0,
                    totalConv:0,
                    fraud:'0%',
                    revenue:0,
                    cost:0,
                    margin:'0%'
                },
                listQuery:{
                    keyWords:'',
                    advAccountId:null,
                    startDate:'',
                    endDate:'',
                    dateType:0,
                    employeeId:null
                },
                total:0,
                pageSize:20,
                pageCurrent:1,
                employeeList:[],
                advAccountList:[],
            };
        },
    },
};
