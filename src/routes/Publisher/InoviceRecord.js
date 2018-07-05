import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col,  Icon, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table,message} from 'antd';
import styles from '../Advertiser/Report.less';
import PubCollectModal from './PubCollectModal';
import { connect } from 'dva';
import moment from 'moment';
import {deleteAdvInvRecord,advInvRecordUpdate} from '../../services/api';
import{deepCloneObj} from '../../utils/commonFunc';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@Form.create()
@connect(({ advReport,advInvRecord,loading }) => ({
    advReport,
    advInvRecord,
    loading: loading.effects['advInvRecord/fetch'],  
}))
export default class PubInvRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collectModalvisible:false,
            pageCurrent:1,
            pageSize:20,
            advAccountValue:'',
            employeeValue:'',
            employeeRole:"1",
            tableQuery:{
                invoiceNo:'',
                keyWords:'',
                employeeId:null,
                advAccountId:null,
                month:''
            },
            tempRecord:{}
        };
        this.columns = [{
                title: 'Advertiser Name',
                dataIndex: 'advName',
            },{
                title: 'Campaign Month',
                dataIndex: 'campMonth',
            },{
                title: 'Invoice Amount',
                dataIndex: 'amount'
            },{
                title: 'Currency',
                dataIndex: 'currency',
            },{
                title: 'System Invoice No.',
                dataIndex: 'sysInvNo',
            },{
                title: 'Actual Invoice No.',
                dataIndex: 'actInvNo',
            },{
                title: 'Invoice Date',
                dataIndex: 'invDate',
            },{
                title: 'Billing Term',
                dataIndex: 'billTerm',
            },{
                title: 'Due On',
                dataIndex: 'dueOn',
            },{
                title: 'Due To',
                dataIndex: 'payTo',
            },{
                title: 'Collected Amount',
                dataIndex: 'collecAmount',
            },{
                title: 'Date on Collection',
                dataIndex: 'dataOnColl',
            },{
                title: 'Bad Debt',
                dataIndex: 'badDebt',
            },{
                title: 'Remark',
                dataIndex: 'remark',
            },{
                title: '',
                dataIndex: '',
                render:(text,record,index) =>{
                    return <div><Button onClick={this.deleteRecord.bind(this,record)}>Destroy</Button><Button onClick={this.openCollectModal.bind(this,record)}>Collect</Button></div> 
                }
            }];
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'advInvRecord/fetch',
            payload:{
                pageCurrent:this.state.pageCurrent,
                pageSize:this.state.pageSize
            }
        })
    }

    componentWillUnmount() {
        this.props.dispatch({
            type:'advInvRecord/clear'
        })
    }

    //删除一条记录
    deleteRecord = (record) => {
        const response = deleteAdvInvRecord('1001');
        response.then(res => {return res;})
        .then(json => {
            let result = JSON.parse(json);
            if(result.code == 0){
                const {dataList} = this.props.advInvRecord;
                let tempDataList = deepCloneObj(dataList);
                tempDataList.forEach(function(item,ind){
                    if(item.uniqueKey==record.uniqueKey){
                        tempDataList.splice(ind,1);
                    }
                });
                this.props.dispatch({
                    type:'advInvRecord/asyncDataList',
                    payload: tempDataList,
                })
                message.success('save');
            }
        });
    }

    submitSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let data = Object.assign({}, this.state.tableQuery, {keyWords:values.keyWords,invoiceNo:values.invoiceNo});
                this.setState({
                    tableQuery: data,
                    pageCurrent:1
                },function(){
                    this.props.dispatch({
                        type:'advInvRecord/fetch',
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

    //点击弹框的取消按钮
    cancelCreat = () => {
        this.setState({ collectModalvisible: false });
        const form = this.formRef.props.form;
        form.resetFields();
    }

    //点击弹框传数据
    createCollection = (date) => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            let data = {};
            data.remark = values.remark;
            data.collecAmount = values.amount;
            data.currency = values.currency?values.currency:'USD';
            data.dateOnColl = date;
            let record =deepCloneObj(this.state.tempRecord);
            record.remark = values.remark;
            record.collecAmount = values.amount;
            record.currency = values.currency?values.currency:'USD';
            record.dataOnColl = date;
            const response = advInvRecordUpdate('1001',data);
            response.then(res => {return res;})
            .then(json => {
                if(json.code == 0){
                    const {dataList} = this.props.advInvRecord;
                    let tempDataList = deepCloneObj(dataList);
                    tempDataList.forEach(function(item,ind){
                        if(item.uniqueKey==record.uniqueKey){
                            tempDataList.splice(ind,1,record);
                        }
                    });
                    this.props.dispatch({
                        type:'advInvRecord/asyncDataList',
                        payload: tempDataList,
                    })
                    message.success('save');
                    form.resetFields();
                    this.setState({ 
                        collectModalvisible: false,
                        tempRecord:{}
                    });
                }
            })
       
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    openCollectModal = (record) => {
        this.setState({ collectModalvisible: true });
        this.setState({
            tempRecord:record
        });
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

    clearQuery = () => {
        this.props.form.resetFields();
        this.props.dispatch({
            type:'advReport/clearEmployee'
        });
        this.props.dispatch({
            type:'advReport/clearAdvAccount'
        });
        this.setState({
            advAccountValue:'',
            employeeValue:'',
            employeeRole:"1",
            pageCurrent:1,
            tableQuery:{
                invoiceNo:'',
                keyWords:'',
                employeeId:null,
                advAccountId:null,
                month:''
            }
        },function(){
            this.props.dispatch({
                type: 'advInvRecord/fetch',
                payload:{
                    ...this.state.tableQuery,
                    pageCurrent:this.state.pageCurrent,
                    pageSize:this.state.pageSize
                }
            });
        })
    }

    pageSizeChange = (current, pageSize) => {
        this.setState({
            pageSize:pageSize,
            pageCurrent:1
        },function(){
            this.props.dispatch({
                type: 'advInvRecord/fetch',
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
                type: 'advInvRecord/fetch',
                payload:{
                   ...this.state.tableQuery,
                   pageSize:this.state.pageSize,
                   pageCurrent:this.state.pageCurrent
                }
            });
        })
    }

    render() {
        const {dataList,total,pageSize,pageCurrent} = this.props.advInvRecord;
        const {employeeList,advAccountList} = this.props.advReport;
        const { getFieldDecorator } = this.props.form;
        const {loading} = this.props;
        return (
            <div>
                <PageHeaderLayout>
                    <Card bordered={false}>
                    <div className={styles.searchFormWrapper}>
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
                                         className={styles.linkTypeSelect}
                                         onChange={this.changeEmployeeRole}
                                        >
                                        <Option value="1">Sales</Option>
                                        <Option value="0">PM</Option>
                                    </Select>
                                    <AutoComplete
                                        allowClear
                                        value={this.state.employeeValue}
                                        className={styles.linkTypeAutoSelect}
                                        dataSource={employeeList}
                                        style={{ width: 230 }}
                                        onSelect={this.selectEmployeeOrAdvAccount.bind(this,'employee')}
                                        onSearch={this.searchEmployeeOrAdvAccount.bind(this,'employee')}
                                        placeholder="search employee"
                                    />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Campaign  Month:">
                                    <MonthPicker 
                                        onChange={this.dateRangeChange} 
                                        value={this.state.tableQuery.month?moment(this.state.tableQuery.month):null}
                                    />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}> 
                                <FormItem label="Invoice No">
                                    {getFieldDecorator('invoiceNo')(
                                        <Input placeholder="Search by invoice No."  autoComplete="off"/>
                                    )}
                                </FormItem>
                            </Col>
                            <div className={styles.searchBtnWrapper}>
                                <Button type="primary" htmlType="submit">QUERY</Button>
                                <Button style={{marginLeft:'10px'}}  onClick={this.clearQuery}>RESET</Button>
                            </div>
                        </Row>
                    </Form>
                    </div>
                    <Table 
                        columns={this.columns} 
                        dataSource={dataList} 
                        rowKey="uniqueKey"
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
                        bordered
                        scroll={{ x: 1500 }}
                    />
                    </Card>
                </PageHeaderLayout>
                <PubCollectModal
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.collectModalvisible}
                    onCancel={this.cancelCreat}
                    onCreate={this.createCollection}             
                />
            </div>
        )
    }
}