import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col,  Icon, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table} from 'antd';
import styles from './Report.less';
import { connect } from 'dva';
import moment from 'moment';
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@Form.create()
@connect(({ advReport, loading }) => ({
    advReport,
    loading: loading.effects['advReport/fetch'],  
}))
export default class AdvReoprt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advAccountValue:'',
            employeeValue:'',
            employeeRole:"1",
            tableQuery:{
                dateType:1,
                advAccountId:null,
                employeeId:null,
                startDate:'',
                endDate:'',
                keyWords:'',
            },
            pageCurrent:1,
            pageSize:20,
        };
        this.columns = [{
                title: 'Date',
                dataIndex: 'date',
            },{
                title: 'Campaign',
                dataIndex: 'id',
                render: (text,record) => {
                    return <span>{text+"-"+record.name}</span>
                }
            },{
                title: 'Payout',
                dataIndex: 'payout'
            },{
                title: 'Currency',
                dataIndex: 'currency',
            },{
                title: 'Totoal Conv',
                dataIndex: 'totalConv',
            },{
                title: 'Fraud%',
                dataIndex: 'frand',
            },{
                title: 'Revenue$',
                dataIndex: 'revenue',
            },{
                title: 'Cost$',
                dataIndex: 'cost',
            },{
                title: 'Margin',
                dataIndex: 'margin',
            }];
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'advReport/fetch',
            payload:{
                ...this.state.tableQuery,
                pageCurrent:this.state.pageCurrent,
                pageSize:this.state.pageSize
            }
        })
    }

    componentWillUnmount() {
        this.props.dispatch({
            type:'advReport/clear'
        })
    }

    submitSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let data = Object.assign({}, this.state.tableQuery, { keyWords:values.keyWords});
                this.setState({
                    tableQuery: data,
                    pageCurrent:1
                },function(){
                    this.props.dispatch({
                        type:'advReport/fetch',
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

    dateRangeChange = (date, dateString) => {
        this.tableQueryReplace({ startDate:dateString[0],endDate:dateString[1]});
    }

    radioChange = (e) => {
        this.tableQueryReplace({ dateType: e.target.value});
    }

    tableQueryReplace = (childObj) =>{
        let data = Object.assign({}, this.state.tableQuery, childObj);
        this.setState({
            tableQuery: data
        });
    }

    clearQuery = () => {
        this.props.form.resetFields();
        this.props.dispatch({
            type:'advReport/clearEmployeeAndAdvAccount'
        });
        this.setState({
            advAccountValue:'',
            employeeValue:'',
            employeeRole:'1',
            tableQuery:{
                dateType:1,
                advAccountId:null,
                employeeId:null,
                startDate:'',
                endDate:'',
                keyWords:'',
            },
            pageCurrent:1
        },function(){
            this.props.dispatch({
                type: 'advReport/fetch',
                payload:{
                    ...tableQuery,
                    pageCurrent:this.state.pageCurrent,
                    pageSize:this.state.pageSize
                }
            });
        })
    }

    changeEmployeeRole = (value) => {
        this.setState({
            employeeRole:value
        })
    }

    pageSizeChange = (current, pageSize) => {
        let data = Object.assign({}, this.state.tableQuery, {});
        this.setState({
            pageSize:pageSize,
            pageCurrent:1
        },function(){
            this.props.dispatch({
                type: 'advReport/fetch',
                payload:{
                   ...this.state.tableQuery,
                   pageSize:pageSize,
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
                type: 'advReport/fetch',
                payload:{
                   ...this.state.tableQuery,
                   pageSize:pageSize,
                   pageCurrent:this.state.pageCurrent
                }
            });
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {dataList,employeeList,advAccountList,total,pageSize,pageCurrent} = this.props.advReport;
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
                                        <Input placeholder="Search by code or key word" autocomplete="off"/>
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
                                <FormItem label="Date Range">
                                    <RangePicker 
                                        onChange={this.dateRangeChange} 
                                        value={this.state.tableQuery.startDate?[moment(this.state.tableQuery.startDate), moment(this.state.tableQuery.endDate)]:null}
                                        />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Display By Date">
                                    <RadioGroup onChange={this.radioChange} value={this.state.tableQuery.dateType}>
                                        <Radio value={1}>Monthly</Radio>
                                        <Radio value={2}>Daily</Radio>
                                    </RadioGroup>
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
                    />
                    </Card>
                </PageHeaderLayout>
            </div>
        )
    }
}