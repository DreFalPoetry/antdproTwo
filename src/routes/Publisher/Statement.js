import React, { Component ,Fragment} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table,Alert,Badge,Popconfirm, message ,Icon,Tabs } from 'antd';
import commonStyle from '../Advertiser/Report.less';
import PubInvoiceModal from './PubGenerateInvoiceModal';
import { connect } from 'dva';
import moment from 'moment';
import {deepCloneObj} from '../../utils/commonFunc';
import {advStatementUpdates,advStatementUpdatesByData} from '../../services/api';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

@Form.create()
@connect(({ advReport,pubStatement,advStatement,loading }) => ({
    advReport,
    pubStatement,
    advStatement,
    loading: loading.effects['advStatement/fetch'],  
}))
export default class PubStatement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows:[],
            totalInvoiceAmount:[],
            invoiceModalvisible:false,
            showGenerateInvoiveOption:false,
            showApproveOrRejectOption:false,
            chooseIds:[],
            chooseRecords:[],
            invAmountEditable:[],
            currencyEditable:[],
            financeApproveEditable:[],
            tableQuery:{
                advAccountId:null,
                employeeId:null,
                month:'',
                keyWords:'',
                finApproStatus:null
            },
            advAccountValue:'',
            employeeValue:'',
            employeeRole:"1",
            pageCurrent:1,
            pageSize:20,
            sumPageCurrent:1,
            sumPageSize:20,
            invoiceAmount:[],
            cellCurrency:[],
            cellApprove:[]
        };
        //summary column
        this.sumColumns = [{
            title: 'Affiliate',
            dataIndex: 'affiliateName',
        },{
            title: 'System Amount$',
            dataIndex: 'sysAmount',
        },{
            title: 'Deducted Amount$',
            dataIndex: 'deductedAmount',
        },{
            title: 'Adjust Amount$',
            dataIndex: 'adjustAmount',
        },{
            title: 'Campaigns',
            dataIndex: 'campaigns',
        },{
            title: 'Initial',
            dataIndex: 'initial',
        },{
            title: 'Pending-Audit',
            dataIndex: 'pending',
        },{
            title: 'Rejected',
            dataIndex: 'rejected',
        },{
            title: 'Approved',
            dataIndex: 'approved',
        },{
            title: 'Packaged',
            dataIndex: 'packaged',
        }]
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'advStatement/fetch',
            payload:{
                ...this.state.tableQuery,
                pageCurrent:this.state.pageCurrent,
                pageSize:this.state.pageSize
            }
        })
        this.props.dispatch({
            type: 'pubStatement/fetchSummary',
            payload:{
                ...this.state.tableQuery,
                pageCurrent:this.state.sumPageCurrent,
                pageSize:this.state.sumPageSize
            }
        })
    }

    componentWillUnmount() {
        this.props.dispatch({
            type:'advStatement/clear'
        })
    }

    submitSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = Object.assign({}, this.state.tableQuery, {keyWords:values.keyWords,finApproStatus:values.finApproStatus});
                this.setState({
                    tableQuery: data,
                    pageCurrent:1
                },function(){
                    this.props.dispatch({
                        type:'advStatement/fetch',
                        payload:{
                            ...this.state.tableQuery,
                            pageCurrent:this.state.pageCurrent,
                            pageSize:this.state.pageSize
                        }
                    });
                });
            }
        });
    }

    dateRangeChange = (date, dateString) => {
        this.tableQueryReplace({month:dateString});
    }

    //批量选择操作 1--Approved 2--Rejected 3--Invoiced
    selectOption = (value) => {
        let ids = [];
        let records = deepCloneObj(this.state.selectedRows);
        records.forEach((item)=>{
            return item.finApproStatus = value;
        })
        ids = records.map((item)=>{
            return item.id
        });
        if(value == 3){
            this.setState({ invoiceModalvisible: true,chooseIds:ids,chooseRecords:records });
        }else{
            let data = {};
            data.ids = ids;
            data.status = value;
            const response = advStatementUpdatesByData(data);
            response.then(res => {return res;})
            .then(json => {
                if(json.code == 0){
                    const {dataList,headerInfo} = this.props.advStatement;
                    let tempDataList = deepCloneObj(dataList);
                    tempDataList.forEach(function(item,ind){
                        records.map((record)=>{
                            if(item.uniqueKey==record.uniqueKey){
                                tempDataList.splice(ind,1,record);
                            }
                        })
                    });
                    this.props.dispatch({
                        type:'advStatement/asyncDataList',
                        payload: tempDataList,
                    });
                    let headerInfoTemp = deepCloneObj(headerInfo);
                    if(value == 1){
                        headerInfoTemp.approved += ids.length; 
                    }else{
                        headerInfoTemp.rejected += ids.length;
                    }
                    this.props.dispatch({
                        type:'advStatement/asyncHeaderInfo',
                        payload: headerInfoTemp,
                    });
                    message.success('save');
                    this.cleanSelectedRows();
                }
            })
        }
    }

    selectTableRow =  (selectedRowKeys, selectedRows) => {
        this.setState({
            showGenerateInvoiveOption:false,
            showApproveOrRejectOption:false
        });
        let totalInvoiceAmount = [];
        let rowStatus = [];
        selectedRows.map((item) => {
            if(item.currency && item.invoiceAmount){
                rowStatus.push({status:item.finApproStatus,currency:item.currency});
            }
            if(item.currency == "USD"){  
                totalInvoiceAmount.push({'type':item.currency,"total":Number(item.invoiceAmount)})
            }else if(item.currency == "INR"){   
                totalInvoiceAmount.push({'type':item.currency,"total":Number(item.invoiceAmount)})
            }
        });
        
        let arrTemp1 = [];
        if(totalInvoiceAmount.length){
            let usdTotal = 0;
            let inrTotal = 0;
            totalInvoiceAmount.map((item)=>{
                if(item.type == 'USD'){
                    usdTotal+= item.total;
                }else if(item.type == 'INR'){
                    inrTotal+=item.total;
                }
            });
            arrTemp1.push({'type':'USD','total':usdTotal})
            arrTemp1.push({'type':'INR','total':inrTotal})
            this.setState({ totalInvoiceAmount:arrTemp1});
        }else{
            this.setState({ totalInvoiceAmount:[]});
        }
        if(rowStatus.length){
            let gerInv = true;
            let apprOrRej = true;
            let theSameCurrency = true;
            rowStatus.map((item,index,arr)=>{
                if(item.status != '1'){
                    gerInv = false;
                }
                if(item.status != '0'){
                    apprOrRej = false;
                }
                let firstCurrency = arr[0].currency;
                if(item.currency != firstCurrency){
                    theSameCurrency = false;
                }
            })
            if(gerInv && theSameCurrency){
                this.setState({
                    showGenerateInvoiveOption:true,
                    showApproveOrRejectOption:false
                })
            };
            if(apprOrRej){
                this.setState({
                    showGenerateInvoiveOption:false,
                    showApproveOrRejectOption:true
                })
            }
        }else{
            this.setState({
                showGenerateInvoiveOption:false,
                showApproveOrRejectOption:false
            })
        }
        
        this.setState({
            selectedRowKeys:selectedRowKeys,
            selectedRows:selectedRows,
        })
    }

    //checkbox选择项清空
    cleanSelectedRows = () => {
        this.selectTableRow([],[])
        this.setState({
            selectedRows:[],
            totalInvoiceAmount:[]
        })
    }

    //点击取消弹框消失，数据重置
    cancelGenerate = () => {
        const form = this.formRef.props.form;
        form.resetFields();
        this.cleanSelectedRows();
        this.setState({ invoiceModalvisible: false });
    }

    createInvoice = (invDate,dueOnDate) => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let data = {};
            data.ids = this.state.chooseIds;
            data.status = '3';
            data.invoiceInfo = {
                actInvNo:values.actInvNo,
                billingTerm:values.billingTerm?values.billingTerm:'30',
                payTo:values.payTo?values.payTo:'23232',
                invDate:invDate,
                dueOnDate:dueOnDate
            }
            const response = advStatementUpdatesByData(data);
            response.then(res => {return res;})
            .then(json => {
                if(json.code == 0){
                    const {dataList,headerInfo} = this.props.advStatement;
                    let tempDataList = deepCloneObj(dataList);
                    let records = deepCloneObj(this.state.chooseRecords);
                    tempDataList.forEach(function(item,ind){
                        records.map((record)=>{
                            if(item.uniqueKey==record.uniqueKey){
                                tempDataList.splice(ind,1,record);
                            }
                        })
                    });
                    this.props.dispatch({
                        type:'advStatement/asyncDataList',
                        payload: tempDataList,
                    });
                    message.success('save');
                    let headerInfoTemp = deepCloneObj(headerInfo);
                    headerInfoTemp.invoiced += this.state.chooseIds.length;
                    this.props.dispatch({
                        type:'advStatement/asyncHeaderInfo',
                        payload: headerInfoTemp,
                    });
                    this.cleanSelectedRows();
                    this.setState({
                        chooseIds:[],
                        chooseRecords:[],
                        invoiceModalvisible: false 
                    });
                    form.resetFields();
                }
            })
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    searchEmployeeOrAdvAccount = (type,value) => {
        if(type === 'advAccount'){
            this.tableQueryReplace({advAccountId:null});
            this.setState({
                advAccountValue:value,
            })
            this.props.dispatch({
                type:'advReport/fetchAdvAccount',
                payload: {
                    keyWord: value,
                },
            });
        }else{
            this.tableQueryReplace({employeeId:null});
            this.setState({
                employeeValue:value,
            })
            this.props.dispatch({
                type:'advReport/fetchEmployee',
                payload: {
                    role:this.state.employeeRole,
                    keyWord: value,
                },
            });
        }
    }

    selectEmployeeOrAdvAccount = (type,value) => {
        if(type === 'advAccount'){
            this.tableQueryReplace({advAccountId:value});
            this.setState({
                advAccountValue:value
            });
        }else{
            this.tableQueryReplace({employeeId:value});
            this.setState({
                employeeValue:value,
            });
        }
    }

    tableQueryReplace = (childObj) =>{
        let data = Object.assign({}, this.state.tableQuery, childObj);
        this.setState({
            tableQuery: data
        });
    }

    changeEmployeeRole = (value) => {
        this.setState({
            employeeRole:value
        })
    }

    pageSizeChange = (current, pageSize) => {
        this.setState({
            pageSize:pageSize,
            pageCurrent:1
        },function(){
            this.props.dispatch({
                type: 'advStatement/fetch',
                payload:{
                   ...this.state.tableQuery,
                   pageSize:this.state.pageSize,
                   pageCurrent:this.state.pageCurrent
                }
            });
        });
    }

    pageChange = (page, pageSize) => {
        this.setState({
            pageCurrent:page
        },function(){
            this.props.dispatch({
                type: 'advStatement/fetch',
                payload:{
                   ...this.state.tableQuery,
                   pageSize:this.state.pageSize,
                   pageCurrent:this.state.pageCurrent
                }
            });
        })
    }

    clearQuery = () => {
        this.props.form.resetFields();
        this.props.dispatch({
            type:'advReport/clearEmployee'
        });
        this.props.dispatch({
            type:'advReport/clearAdvAccount'
        });
        this.setState({
            tableQuery:{
                advAccountId:null,
                employeeId:null,
                month:'',
                keyWords:'',
                finApproStatus:null
            },
            advAccountValue:'',
            employeeValue:'',
            employeeRole:"1",
            pageCurrent:1,
        },function(){
            this.props.dispatch({
                type: 'advStatement/fetch',
                payload:{
                    ...this.state.tableQuery,
                    pageCurrent:this.state.pageCurrent,
                    pageSize:this.state.pageSize
                }
            });
        })
    }

    //表格输入invoiceAmount
    inputInvoiceAmount = (index,e) => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        let tempInvoiceAmount = this.state.invoiceAmount;
        if ((!isNaN(value) && reg.test(value)) || !value) {
            tempInvoiceAmount[index] = value;
            this.setState({
                invoiceAmount:tempInvoiceAmount
            })
        }
    }

    confirmInvoiceAmount = (index,record) => {
        if(this.state.invoiceAmount[index]){
            const response = advStatementUpdates('1001',{invoiAmount:this.state.invoiceAmount[index]});
            response.then(res => {return res;})
            .then(json => {
                if(json.code == 0){
                    record.invoiceAmount = this.state.invoiceAmount[index];
                    const {dataList} = this.props.advStatement;
                    let tempDataList = deepCloneObj(dataList);
                    tempDataList.forEach(function(item,ind){
                        if(item.uniqueKey==record.uniqueKey){
                            tempDataList.splice(ind,1,record);
                        }
                    });
                    this.props.dispatch({
                        type:'advStatement/asyncDataList',
                        payload: tempDataList,
                    })
                    message.success('save');
                    let tempEdit  = deepCloneObj(this.state.invAmountEditable);
                    tempEdit[index] = false;
                    this.setState({
                        invAmountEditable:tempEdit
                    })
                }
            });
        }
    }

    //row选择当前行的 currency
    selectCellCurrency = (index,value) => {
        let tempCellCurrency = this.state.cellCurrency;
        tempCellCurrency[index] = value;
        this.setState({
            cellCurrency:tempCellCurrency
        })
    }

    //确定当前行的currency
    sureCellCurrency = (index,record) => {
        let itemCurrency;
        if(!this.state.cellCurrency[index]){
            if(!record.currency){
                itemCurrency = 'USD'
            }else{
                itemCurrency = record.currency;
            }
        }else{
            itemCurrency = this.state.cellCurrency[index];
        }
        const response = advStatementUpdates('1001',{currency:itemCurrency});
            response.then(res => {return res;})
            .then(json => {
                if(json.code == 0){
                    record.currency = itemCurrency;
                    const {dataList} = this.props.advStatement;
                    let tempDataList = deepCloneObj(dataList);
                    tempDataList.forEach(function(item,ind){
                        if(item.uniqueKey==record.uniqueKey){
                            tempDataList.splice(ind,1,record);
                        }
                    });
                    this.props.dispatch({
                        type:'advStatement/asyncDataList',
                        payload: tempDataList,
                    })
                    message.success('save');
                    let tempEdit = deepCloneObj(this.state.currencyEditable);
                    tempEdit[index] = false;
                    this.setState({
                        currencyEditable:tempEdit
                    })
                }
            });

    }

    selectCellApprove = (index,value) => {
        let tempCellApprove = this.state.cellApprove;
        tempCellApprove[index] = value;
        this.setState({
            cellApprove:tempCellApprove
        });
    }

    sureCellApprove = (index,record) => {
        let itemApprove;
        if(!this.state.cellApprove[index]){
            if(!record.finApproStatus){
                itemApprove = '1'
            }else{
                itemApprove = record.finApproStatus
            }
        }else{
            itemApprove = this.state.cellApprove[index];
        }
        const response = advStatementUpdates('1001',{status:itemApprove});
        response.then(res => {return res;})
        .then(json => {
            if(json.code == 0){
                record.finApproStatus = itemApprove;
                const {dataList,headerInfo} = this.props.advStatement;
                let tempDataList = deepCloneObj(dataList);
                tempDataList.forEach(function(item,ind){
                    if(item.uniqueKey==record.uniqueKey){
                        tempDataList.splice(ind,1,record);
                    }
                });
                this.props.dispatch({
                    type:'advStatement/asyncDataList',
                    payload: tempDataList,
                });
                let headerInfoTemp = deepCloneObj(headerInfo);
                if(itemApprove == 1){
                    headerInfoTemp.approved += 1; 
                }else{
                    headerInfoTemp.rejected += 1;
                }
                this.props.dispatch({
                    type:'advStatement/asyncHeaderInfo',
                    payload: headerInfoTemp,
                });
                message.success('save');
                let tempEdit = deepCloneObj(this.state.financeApproveEditable);
                tempEdit[index] = false;
                this.setState({
                    financeApproveEditable:tempEdit
                })
            }
        });
    }

    moveToNext = (month,record) => {
        const response = advStatementUpdates('1001',{month:month});
        response.then(res => {return res;})
        .then(json => {
            if(json.code == 0){
                record.month = month;
                const {dataList} = this.props.advStatement;
                let tempDataList = deepCloneObj(dataList);
                tempDataList.forEach(function(item,ind){
                    if(item.uniqueKey==record.uniqueKey){
                        tempDataList.splice(ind,1,record);
                    }
                });
                this.props.dispatch({
                    type:'advStatement/asyncDataList',
                    payload: tempDataList,
                })
                message.success('save');
            }
        });
    }

    editInvoiceAmount = (index) => {
        let tempEdit = deepCloneObj(this.state.invAmountEditable);
        tempEdit[index] = true;
        this.setState({
            invAmountEditable:tempEdit
        })
    }

    editCurrency = (index) => {
        let tempEdit = deepCloneObj(this.state.currencyEditable);
        tempEdit[index] = true;
        this.setState({
            currencyEditable:tempEdit
        })
    }

    editFinApproStatus = (index) => {
        let tempEdit = deepCloneObj(this.state.financeApproveEditable);
        tempEdit[index] = true;
        this.setState({
            financeApproveEditable:tempEdit
        })
    }

    render() {
        const {selectedRowKeys,selectedRows,totalInvoiceAmount,invAmountEditable,currencyEditable,financeApproveEditable } = this.state;
        const {employeeList,advAccountList} = this.props.advReport;
        const {dataList,total,pageSize,pageCurrent,headerInfo} = this.props.advStatement;
        const {summaryDataList} = this.props.pubStatement;
        const { getFieldDecorator } = this.props.form;
        const {loading} = this.props;
        const rowSelection = {
            selectedRowKeys:selectedRowKeys,
            onChange:this.selectTableRow,
            getCheckboxProps:(record)=>{
                return {disabled:(record.finApproStatus == '3' || record.finApproStatus == '2')}
            }
        };
        const userRoles = localStorage.getItem('antd-pro-authority');
        const userRole = userRoles.split(',');
        const columns = [{
            title: 'Campaign',
            dataIndex: 'id',
            render: (text,record) => {
                return <span>{text+"-"+record.name}</span>
            }
        },{
            title: 'Invoice Amount',
            dataIndex: 'invoiceAmount',
            render:(text,record,index) => {
                if(userRole.indexOf('admin') > -1){
                    return ( !invAmountEditable[index]?(
                            <div className={commonStyle.editableCellIconWrapper}>
                            {text || ' '}
                            <Icon
                                type="edit"
                                className={commonStyle.editableCellIcon}
                                onClick={this.editInvoiceAmount.bind(this,index)}
                            />
                            </div>
                        ):(
                            <div>
                                <Input value={this.state.invoiceAmount[index]||text} 
                                    onChange={this.inputInvoiceAmount.bind(this,index)}
                                    size="small"
                                    style={{width:80,marginRight:5}}
                                />
                                <Popconfirm 
                                    title="Are you sure?" 
                                    onConfirm={this.confirmInvoiceAmount.bind(this,index,record)} 
                                    okText="Yes" cancelText="No">
                                    <Button 
                                        type='primary' size="small" >
                                        Sure
                                    </Button>
                                </Popconfirm>
                            </div> 
                        )
                    )
                }else{
                    return  text || ' '
                }
            }
        },{
            title: 'Currency',
            dataIndex: 'currency',
            render:(text,record,index) => {
                if(userRole.indexOf('admin') > -1){
                    return (
                        !currencyEditable[index]?
                        <div className={commonStyle.editableCellIconWrapper}>
                            {text || ' '}
                            <Icon
                                type="edit"
                                className={commonStyle.editableCellIcon}
                                onClick={this.editCurrency.bind(this,index)}
                            />
                        </div>:
                        <div>
                            <Select size="small" value={this.state.cellCurrency[index]||text||'USD'} style={{ width: 80,marginRight:5 }} onChange={this.selectCellCurrency.bind(this,index)}>
                                <Option value="USD">USD</Option>
                                <Option value="INR">INR</Option>
                            </Select>
                            <Button type='primary' size='small' onClick={this.sureCellCurrency.bind(this,index,record)}>Sure</Button>
                        </div>
                    )
                }else{
                    return  text || '';
                }
            }
        },{
            title: 'Deducted Conv.',
            dataIndex: 'deductedConv',
        },{
            title: 'Deducted Amt.',
            dataIndex: 'deductedAmt',
        },{
            title: 'Finance Approve',
            dataIndex: 'finApproStatus',
            render:(text,record,index) => {
                if(text == '0'){
                    if(userRole.indexOf('admin') > -1){
                        return(
                            !financeApproveEditable[index]?
                            <div className={commonStyle.editableCellIconWrapper}>
                                <span><Badge status="processing"/>Pending-Audit</span>
                                <Icon
                                    style={{lineHeight:'20px'}}
                                    type="edit"
                                    className={commonStyle.editableCellIcon}
                                    onClick={this.editFinApproStatus.bind(this,index)}
                                />
                            </div>:
                            <div>
                                <Select size="small" value={this.state.cellApprove[index]||text||'1'} style={{ width: 100,marginRight:5 }} onChange={this.selectCellApprove.bind(this,index)}>
                                    <Option value="1">Approve</Option>
                                    <Option value="2">Reject</Option>
                                </Select>
                                <Button type='primary' size='small' onClick={this.sureCellApprove.bind(this,index,record)}>Sure</Button>
                            </div>
                        ) 
                    }else{
                        return <div><Badge status="processing"/>Pending-Audit</div>
                    }
                }else if(text == '1'){
                    return <div><Badge status="success"/>Approved</div>
                }else if(text == '2'){
                    if(userRole.indexOf('admin') > -1){
                        return(
                            !financeApproveEditable[index]?
                            <div className={commonStyle.editableCellIconWrapper}>
                                {<span><Badge status="error"/>Rejected</span> || ' '}
                                <Icon
                                    style={{lineHeight:'20px'}}
                                    type="edit"
                                    className={commonStyle.editableCellIcon}
                                    onClick={this.editFinApproStatus.bind(this,index)}
                                />
                            </div>:
                            <div>
                                <Select size="small" value={this.state.cellApprove[index]||String(text)||'1'} style={{ width: 100,marginRight:5 }} onChange={this.selectCellApprove.bind(this,index)}>
                                    <Option value="1">Approve</Option>
                                    <Option value="2">Reject</Option>
                                </Select>
                                <Button type='primary' size='small' onClick={this.sureCellApprove.bind(this,index,record)}>Sure</Button>
                            </div>
                        ) 
                    }else{
                        return <div><Badge status="error"/>Rejected</div>
                    }
                }else{
                    return <div><Badge status="default"/>Invoiced</div>
                }
            }
        },{
            title: 'Move to',
            dataIndex: 'month',
            render:(text,record,index) => {
                let year = new Date().getFullYear();
                let month = new Date().getMonth()+1 <10?'0'+(new Date().getMonth()+1) :new Date().getMonth()+1;
                let nextMonth = new Date().getMonth()+2 <10?'0'+(new Date().getMonth()+2) :new Date().getMonth()+2;
                if(text.split('-')[1] == month){
                    return <a title={text} onClick={this.moveToNext.bind(this,`${year}-${nextMonth}`,record)}>moveToNext</a>
                }else{
                    return <a title={text} onClick={this.moveToNext.bind(this,`${year}-${month}`,record)}>Revert to {text}</a>
                }
            }
        }];
        return (
            <div>
                <PageHeaderLayout>
                    <Card bordered={false}>
                    <div className={commonStyle.searchFormWrapper}>
                    <Form layout="inline" onSubmit={this.submitSearch}>
                        <Row>
                            <Col sm={{span:12}} xs={{span:24}}> 
                                <FormItem label="Customer">
                                    {getFieldDecorator('keyWords')(
                                        <Input placeholder="Search by code or key word" autoComplete="off"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}> 
                                <FormItem label="Advertiser Account">
                                    <AutoComplete
                                        allowClear
                                        value={this.state.advAccountValue}
                                        dataSource={advAccountList}
                                        style={{ width: 230 }}
                                        onSelect={this.selectEmployeeOrAdvAccount.bind(this,'advAccount')}
                                        onSearch={this.searchEmployeeOrAdvAccount.bind(this,'advAccount')}
                                        placeholder="search advertiser account"
                                    />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Employee">
                                    <Select 
                                        value={this.state.employeeRole} 
                                        style={{ width: 100 }} 
                                        className={commonStyle.linkTypeSelect}
                                        onChange={this.changeEmployeeRole}
                                        >
                                        <Option value="1">Sales</Option>
                                        <Option value="0">PM</Option>
                                    </Select>
                                    <AutoComplete
                                        allowClear
                                        value={this.state.employeeValue}
                                        className={commonStyle.linkTypeAutoSelect}
                                        dataSource={employeeList}
                                        style={{ width: 230 }}
                                        onSelect={this.selectEmployeeOrAdvAccount.bind(this,'employee')}
                                        onSearch={this.searchEmployeeOrAdvAccount.bind(this,'employee')}
                                        placeholder="search employee"
                                    />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Date Range">
                                    <MonthPicker   
                                        value={this.state.tableQuery.month?moment(this.state.tableQuery.month):null} 
                                        onChange={this.dateRangeChange} 
                                    />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Approve Status">
                                {getFieldDecorator('finApproStatus')(
                                    <Select style={{ width: 230 }} placeholder="Choose Status" allowClear>
                                        <Option value="0">Pending-Audit</Option>
                                        <Option value="1">Approved</Option>
                                        <Option value="2">Rejected</Option>
                                        <Option value="3">Invoiced</Option>
                                    </Select>
                                )}
                                </FormItem>
                            </Col>
                            <div className={commonStyle.searchBtnWrapper}>
                                <Button type="primary" htmlType="submit">QUERY</Button>
                                <Button style={{marginLeft:'10px'}}  onClick={this.clearQuery}>RESET</Button>
                            </div>
                        </Row>
                    </Form>
                    </div>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Tab 1" key="1">
                            <Table 
                                columns={this.sumColumns} 
                                dataSource={summaryDataList} 
                                loading={loading}
                                // pagination={{
                                //     defaultCurrent:1,
                                //     total:Number(total),
                                //     showSizeChanger:true,
                                //     pageSize:Number(pageSize),
                                //     pageSizeOptions:['10','20','30','50','100'],
                                //     onShowSizeChange:this.pageSizeChange,
                                //     current:Number(pageCurrent), 
                                //     onChange:this.pageChange
                                // }}
                                rowKey="uniqueKey"
                                bordered
                            /> 
                        </TabPane>
                        <TabPane tab="Tab 2" key="2">
                            <Row>
                                <Col sm={{span:12}} xs={{span:24}}>
                                    <Form layout="inline" style={{marginBottom:'10px'}}>
                                        <FormItem label="Batch Actions">
                                        {
                                            this.state.showGenerateInvoiveOption?(
                                                <Select style={{ width: 230 }} onChange={this.selectOption} placeholder="Choose and Apply">
                                                    <Option value="3">Generate Invoice</Option>
                                                </Select>
                                            ):null
                                        }
                                        {
                                            this.state.showApproveOrRejectOption?(
                                                <Select style={{ width: 230 }} onChange={this.selectOption} placeholder="Choose and Apply">
                                                    <Option value="1">Approve</Option>
                                                    <Option value="2">Reject</Option>
                                                </Select>
                                            ):null
                                        }
                                        </FormItem>
                                    </Form>
                                </Col>
                            </Row>
                            <Alert
                                style={{marginBottom:"5px"}}
                                message={
                                <Fragment>
                                    Selected <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> Campaigns&nbsp;&nbsp; Total Invoice Amount:&nbsp;
                                    {totalInvoiceAmount.map((item,index)=> (
                                    <span style={{ marginLeft: 8 }} key={index}>
                                        <span style={{ fontWeight: 600 }}>
                                            {item.total? item.total + " " +item.type:null}
                                        </span>
                                    </span>
                                    ))}
                                    {
                                        totalInvoiceAmount.length?
                                        <a onClick={this.cleanSelectedRows} style={{ marginLeft: 24 }}>
                                        Clear Select
                                        </a>:''
                                    }
                                </Fragment>
                                }
                                type="info"
                                showIcon
                            />
                            <Table 
                                rowSelection={rowSelection}
                                columns={columns} 
                                dataSource={dataList} 
                                loading={loading}
                                pagination={{
                                    defaultCurrent:1,
                                    total:Number(total),
                                    showSizeChanger:true,
                                    pageSize:Number(pageSize),
                                    pageSizeOptions:['10','20','30','50','100'],
                                    onShowSizeChange:this.pageSizeChange,
                                    current:Number(pageCurrent), 
                                    onChange:this.pageChange
                                }}
                                rowKey="uniqueKey"
                                bordered
                                footer={() => (
                                    <div>{headerInfo.total} campaigns，已开票{headerInfo.invoiced}个，Rejected{headerInfo.rejected}个，Approved未开票{headerInfo.approved}个</div>
                                )}
                            /> 
                        </TabPane>
                    </Tabs>
                    </Card>
                </PageHeaderLayout>
                <PubInvoiceModal
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.invoiceModalvisible}
                    onCancel={this.cancelGenerate}
                    onCreate={this.createInvoice}
                />
            </div>
        )
    }
}