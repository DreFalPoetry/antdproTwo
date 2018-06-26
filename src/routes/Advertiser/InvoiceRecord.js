import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col,  Icon, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table} from 'antd';
import styles from './Report.less';
import CollectModal from './CollectModal';
import { connect } from 'dva';
import moment from 'moment';
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
export default class AdvInvRecord extends Component {
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
            }
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
                render:() =>{
                    return <div><Button>Destroy</Button><Button onClick={this.openCollectModal}>Collect</Button></div> 
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

    componentWillUnmount() {}

    submitSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let data = Object.assign({}, this.state.tableQuery, {keyWords:values.keyWords,invoiceNo:values.invoiceNo});
                this.setState({
                    tableQuery: data
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

    cancelCreat = () => {
        this.setState({ collectModalvisible: false });
    }

    createCollection = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          console.log('Received values of form: ', values);
          form.resetFields();
          this.setState({ collectModalvisible: false });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    openCollectModal = () => {
        this.setState({ collectModalvisible: true });
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
                type: 'advStatement/fetch',
                payload:{
                    ...this.state.tableQuery,
                    pageCurrent:this.state.pageCurrent,
                    pageSize:this.state.pageSize
                }
            });
        })
    }

    render() {
        const {dataList,total,pageSize,pageCurrent} = this.props.advInvRecord;
        const {employeeList,advAccountList} = this.props.advReport;
        const { getFieldDecorator } = this.props.form;
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
                                        <Input placeholder="Search by invoice No." />
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
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
                        bordered
                        scroll={{ x: 1500 }}
                    />
                    </Card>
                </PageHeaderLayout>
                <CollectModal
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.collectModalvisible}
                    onCancel={this.cancelCreat}
                    onCreate={this.createCollection}             
                />
            </div>
        )
    }
}