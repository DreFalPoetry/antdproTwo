import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
    'GET /api/currentUser': {
        $desc: '获取当前用户接口',
        $params: {
        pageSize: {
            desc: '分页',
            exp: 2,
        },
        },
        $body: {
        name: 'Serati Ma',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        notifyCount: 12,
        },
    },
    // GET POST 可省略
    'GET /api/users': [
        {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        },
        {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        },
        {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        },
    ],
    'GET /api/project/notice': getNotice,
    'GET /api/activities': getActivities,
    'GET /api/rule': getRule,
    'POST /api/rule': {
        $params: {
        pageSize: {
            desc: '分页',
            exp: 2,
        },
        },
        $body: postRule,
    },
    'POST /api/forms': (req, res) => {
        res.send({ message: 'Ok' });
    },
    'GET /api/tags': mockjs.mock({
        'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
    }),
    'GET /api/fake_list': getFakeList,
    'GET /api/fake_chart_data': getFakeChartData,
    'GET /api/profile/basic': getProfileBasicData,
    'GET /api/profile/advanced': getProfileAdvancedData,
    'POST /api/login/account': (req, res) => {
        const { password, userName, type } = req.body;
        if (password === '888888' && userName === 'admin') {
        res.send({
            status: 'ok',
            type,
            currentAuthority: 'admin,am',
        });
        return;
        }
        if (password === '123456' && userName === 'user') {
        res.send({
            status: 'ok',
            type,
            currentAuthority: 'user',
        });
        return;
        }
        res.send({
        status: 'error',
        type,
        currentAuthority: 'guest',
        });
    },
    'POST /api/register': (req, res) => {
        res.send({ status: 'ok', currentAuthority: 'user' });
    },
    'GET /api/notices': getNotices,
    'GET /api/500': (req, res) => {
        res.status(500).send({
        timestamp: 1513932555104,
        status: 500,
        error: 'error',
        message: 'error',
        path: '/base/category/list',
        });
    },
    'GET /api/404': (req, res) => {
        res.status(404).send({
        timestamp: 1513932643431,
        status: 404,
        error: 'Not Found',
        message: 'No message available',
        path: '/base/category/list/2121212',
        });
    },
    'GET /api/403': (req, res) => {
        res.status(403).send({
        timestamp: 1513932555104,
        status: 403,
        error: 'Unauthorized',
        message: 'Unauthorized',
        path: '/base/category/list',
        });
    },
    'GET /api/401': (req, res) => {
        res.status(401).send({
        timestamp: 1513932555104,
        status: 401,
        error: 'Unauthorized',
        message: 'Unauthorized',
        path: '/base/category/list',
        });
    },
    'GET /api/advReport': mockjs.mock({
        'code':0,
        'data|100': [{
            date:'@date', 
            'id|+1':1001, 
            name: '@name',
            'payout|0.2':0.12,
            currency:'USD',
            'totalConv|100-1231': 150, 
            'frand|1-100.2': 1.12,
            'revenue|1-100.2':23.23,
            'cost|1-100.2':34.23,
            'margin|1-100.2':2.23
        }],
        'headerInfo':{
            'total':32,
            "totalConv":2332312,
            "fraud":"2%",
            "revenue":"23321",
            "cost":"23211",
            "margin":"23.23%"
        },
        'total':100,
        'pageSize':20,
        'pageCurrent':1
    }),
    'GET /api/employee': mockjs.mock({
        'code':0,
        'data|38': [{
            'id|+1':2001, 
            name: '@name',
            email:'@email'
        }]
    }),
    'GET /api/advAccount': mockjs.mock({
        'code':0,
        'data|38': [{
            'id|+1':3001, 
            name: '@name',
            email:'@email'
        }]
    }),
    'GET /api/advStatement': mockjs.mock({
        'code':0,
        'data|100': [{ 
            'id|+1':1001, 
            name: '@name',
            'invoiceAmount':null,
            currency:null,
            'deductedConv|0.2':0.12,
            'deductedAmt':'USD',
            'finApproStatus|0-3': 0, 
            month:'@date',
            'childData':[{
                'id|+1':1001, 
                name: '@name',
                'finApproStatus|0-3': 0, 
                month:'@date',
            }]
        }],
        "headerInfo":{
            "total":32,
            "invoiced":18,
            "rejected":4,
            "approved":3
        },
        'total':100,
        'pageSize':20,
        'pageCurrent':1
    }),
    'PUT /api/advStatement/1001': (req, res) => {
        res.send({
            code:0,
            info:"success" 
        });
    },
    'PUT /api/advStatement': (req, res) => {
        res.send({
            code:0,
            info:"success" 
        });
    },
    'GET /api/advInvRecord': mockjs.mock({
        'code':0,
        'data|100': [{ 
            'id|+1':1001, 
            advName: '@name',
            campMonth:'@date',
            'amount|100-10000':1333,
            currency:'USD',
            'sysInvNo|+1':102323021,
            'actInvNo|+1':242334340,
            invDate:'@date',
            'billTerm|10-1000':90,
            'dueOn':'@date',
            'payTo':"MocaTechno",
            'collecAmount|100-10000':2344,
            dataOnColl:'@date',
            'badDebt|10-100':50,
            'remark':'我是备注信息',
        }],
        'total':100,
        'pageSize':20,
        'pageCurrent':1
    }),
    'DELETE /api/advInvRecord/1001': (req, res) => {
        res.send({
            code:0,
            info:"success" 
        });
    },
    'PUT /api/advInvRecord/1001': (req, res) => {
        res.send({
            code:0,
            info:"success" 
        });
    },
    'GET /api/advPaymentColle': mockjs.mock({
        'code':0,
        'data|100': [{ 
            'id|+1':4001, 
            advName: '@name',
            'payTo':"MocaTechno",
            campMonth:'@date',
            'invoiceAmount|100-10000':1333,
            'colleAmount|100-10000':2434,
            'badDebt|50-200':120,
            'overDueAmount|10-50':22,
            'overDueDays|10-360':30
        }],
        'total':100,
        'pageSize':20,
        'pageCurrent':1
    }),
    'GET /api/advCredit': mockjs.mock({
        'code':0,
        'data|50': [{ 
            'id|+1':5001, 
            advName: '@name',
            'amount|100-10000':1333,
            'creditLevel':'Poor'
        }],
        'total':50,
        'pageSize':20,
        'pageCurrent':1
    }),
    //添加pub statement 的 Summary 接口
    'GET /api/pubStatementSummary':mockjs.mock({
        'code':0,
        'data|50': [{ 
            'id|+1':6001, 
            affiliateName: '@name',
            'sysAmount|100-10000':1333,
            'deductedAmount|1000-9999':1232,
            'adjustAmount|100-999':123,
            'campaigns|0-100':10,
            'initial|0-10':1,
            'pending|0-10':1,
            'rejected|0-10':1,
            'approved|0-10':1,
            'packaged|0-10':1,
        }],
        'total':50,
        'pageSize':20,
        'pageCurrent':1
    }),
};

export default (noProxy ? {} : delay(proxy, 1000));
