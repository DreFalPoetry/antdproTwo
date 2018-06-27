import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col,  Icon, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table} from 'antd';
import styles from './Report.less';
import { connect } from 'dva';
import moment from 'moment';
const FormItem = Form.Item;
const { MonthPicker  } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@Form.create()
@connect(({ advReport,advPaymentColle,loading }) => ({
    advReport,
    advPaymentColle,
    loading: loading.effects['advPaymentColle/fetch'],  
}))
export default class AdvPaymentColle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advAccountValue:'',
            employeeValue:'',
            employeeRole:"1",
            tableQuery:{
                employeeId:null,
                advAccountId:null,
                keyWords:'',
                dueMonth:'',
                campaignMonth:''
            },
            pageCurrent:1,
            pageSize:20,
        };
        this.columns = [{
                title: 'Advertiser Name',
                dataIndex: 'advName',
            },{
                title: 'Due To',
                dataIndex: 'payTo'
            },{
                title: 'Campaign Month',
                dataIndex: 'campMonth'
            },{
                title: 'Invoice Amount (USD)',
                dataIndex: 'invoiceAmount',
            },{
                title: 'Collection Amount (USD)',
                dataIndex: 'colleAmount',
            },{
                title: 'Bad Debt(USD)',
                dataIndex: 'badDebt',
            },{
                title: 'Overdue Amount(USD)',
                dataIndex: 'overDueAmount',
            },{
                title: 'Overdue Days',
                dataIndex: 'overDueDays',
            }];
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'advPaymentColle/fetch',
            payload:{
                pageCurrent:this.state.pageCurrent,
                pageSize:this.state.pageSize
            }
        })
    }

    componentWillUnmount() {}

    submitSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let data = Object.assign({}, this.state.tableQuery, {keyWords:values.keyWords});
                this.setState({
                    tableQuery: data,
                    pageCurrent:1
                },function(){
                    this.props.dispatch({
                        type: 'advPaymentColle/fetch',
                        payload:{
                            ...this.state.tableQuery,
                            pageCurrent:this.state.pageCurrent,
                            pageSize:this.state.pageSize
                        }
                    })
                });
            }
        });
    }

    dateRangeChange = (type,date, dateString) => {
        if(type == 'campaignMonth' ){
            this.tableQueryReplace({campaignMonth:dateString})
        }else if(type == 'dueMonth'){
            this.tableQueryReplace({dueMonth:dateString})
        }
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
            type:'advReport/clearEmployeeAndAdvAccount'
        });
        this.setState({
            advAccountValue:'',
            employeeValue:'',
            employeeRole:"1",
            tableQuery:{
                employeeId:null,
                advAccountId:null,
                keyWords:'',
                dueMonth:'',
                campaignMonth:''
            },
            pageCurrent:1,
        },function(){
            this.props.dispatch({
                type: 'advPaymentColle/fetch',
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
                type: 'advPaymentColle/fetch',
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
                type: 'advPaymentColle/fetch',
                payload:{
                   ...this.state.tableQuery,
                   pageSize:this.state.pageSize,
                   pageCurrent:this.state.pageCurrent
                }
            });
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {employeeList,advAccountList} = this.props.advReport;
        const {dataList,total,pageSize,pageCurrent} = this.props.advPaymentColle;
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
                                        <Input placeholder="Search by code or key word" />
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
                                <FormItem label="Campaign Month">
                                    <MonthPicker  
                                        value={this.state.tableQuery.campaignMonth?moment(this.state.tableQuery.campaignMonth):null} 
                                        onChange={this.dateRangeChange.bind(this,'campaignMonth')} 
                                    />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Due Month">
                                    <MonthPicker  
                                        onChange={this.dateRangeChange.bind(this,'dueMonth')} 
                                        value={this.state.tableQuery.dueMonth?moment(this.state.tableQuery.dueMonth):null} 
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
                        </Row>
                        <Row>
                            <div className={styles.searchBtnWrapper}>
                                <Button type="primary" htmlType="submit">QUERY</Button>
                                <Button style={{marginLeft:'10px'}} onClick={this.clearQuery}>RESET</Button>
                            </div>
                        </Row>
                    </Form>
                    </div>
                    <Table 
                        columns={this.columns} 
                        dataSource={dataList} 
                        rowKey="uniqueKey"
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
                    />
                    </Card>
                </PageHeaderLayout>
            </div>
        )
    }
}