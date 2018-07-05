import React, { Component ,Fragment} from 'react';
import {Card,Form,Row, Col, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table,Alert,Badge,Popconfirm, message ,Icon,Tabs } from 'antd';
import commonStyle from '../Advertiser/Report.less';
import moment from 'moment';

export default class SearchForm extends Component {
    state = {
        tableQuery:{
            advAccountId:null,
            employeeId:null,
            month:'',
            keyWords:'',
            finApproStatus:null
        },
        pageCurrent:1,
        advAccountValue:'',
        employeeRole:"1",
        employeeValue:'',
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

    dateRangeChange = (date, dateString) => {
        this.tableQueryReplace({month:dateString});
    }

    clearQuery = () => {
        this.props.form.resetFields();
        this.props.dispatch({
            type:'advReport/clearEmployeeAndAdvAccount'
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

    render(){
        const {employeeList,advAccountList} = this.props.advReport;
        return (
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
        )
    }
    
}