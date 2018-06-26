import { queryadvReport,queryEmployee,queryAdvAccount } from '../services/api';
import {callbackDeal} from '../utils/serviceCallBack';
import { list } from 'postcss';

export default {
    namespace: 'advReport',

    state: {
        dataList:[],
        listQuery:{
            keyWords:'',
            advAccountId:null,
            startDate:'',
            endDate:'',
            dateType:0,
            employeeId:null
        },
        total:null,
        pageSize:null,
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
                dataList.filter((item,index) => {
                    item.uniqueKey = index+1;
                });
                yield put({
                    type: 'asyncDataList',
                    payload: dataList,
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
                listQuery:{
                    keyWords:'',
                    advAccountId:null,
                    startDate:'',
                    endDate:'',
                    dateType:0,
                    employeeId:null
                },
                total:null,
                pageSize:null,
                pageCurrent:1,
                employeeList:[],
                advAccountList:[],
            };
        },
    },
};
