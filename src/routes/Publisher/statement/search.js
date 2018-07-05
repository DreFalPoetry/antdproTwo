import React, { Component ,Fragment} from 'react';
import {Card,Form,Row, Col, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table,Alert,Badge,Popconfirm, message ,Icon,Tabs } from 'antd';
import commonStyle from '../../Advertiser/Report.less';
import moment from 'moment';
import { connect } from 'dva';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const Option = Select.Option;

@Form.create()
@connect(({ advReport,pubStatement,advStatement }) => ({
    advReport,
    pubStatement,
    advStatement
}))
export default class SearchForm extends Component {
    state = {
        tableQuery:{
            affiliateId:null,
            campaignId:null,
            employeeId:null,
            month:'',
            status:null
        },
        pageCurrent:1,
        affiliateValue:'',
        campaignValue:'',
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
                        type:'pubStatement/fetch',
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

    //搜索Affiliate 
    searchAffiliate = (value) => {
        console.log(value);
        this.tableQueryReplace({affiliateId:null});
        this.setState({
            affiliateValue:value,
        })
        this.props.dispatch({
            type:'pubStatement/fetchAffiliate',
            payload: {
                keyWord: value,
            },
        });
    }

    //选择Affiliate
    selectAffiliate = (value) => {
        this.tableQueryReplace({affiliateId:value});
        this.setState({
            affiliateValue:value,
        });
    }

    //搜索Campaign 
    searchCampaign  = (value) => {
        this.tableQueryReplace({campaignId:null});
        this.setState({
            campaignValue:value,
        })
        this.props.dispatch({
            type:'pubStatement/fetchCampaign',
            payload: {
                keyWord: value,
            },
        });
    }

    //选择Campaign
    selectCampaign = (value) => {
        this.tableQueryReplace({campaignId:value});
        this.setState({
            campaignValue:value,
        });
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

    render(){
        const { getFieldDecorator } = this.props.form;
        const {employeeList} = this.props.advReport;
        const {  affiliateList,campaignList} = this.props.pubStatement;
        return (
            <div className={commonStyle.searchFormWrapper}>
            <Form layout="inline" onSubmit={this.submitSearch}>
                <Row>
                    <Col sm={{span:12}} xs={{span:24}}> 
                        <FormItem label="Affiliate">
                            <AutoComplete
                                allowClear
                                value={this.state.affiliateValue}
                                dataSource={affiliateList}
                                style={{ width: 230 }}
                                onSelect={this.selectAffiliate.bind(this)}
                                onSearch={this.searchAffiliate.bind(this)}
                                placeholder="Search Campaign"
                            />
                        </FormItem>
                    </Col>
                    <Col sm={{span:12}} xs={{span:24}}> 
                        <FormItem label="Campaign">
                            <AutoComplete
                                allowClear
                                value={this.state.campaignValue}
                                dataSource={campaignList}
                                style={{ width: 230 }}
                                onSelect={this.selectCampaign.bind(this)}
                                onSearch={this.searchCampaign.bind(this)}
                                placeholder="Search Campaign"
                            />
                        </FormItem>
                    </Col>
                    <Col sm={{span:12}} xs={{span:24}}>
                        <FormItem label="Select Month">
                            <MonthPicker   
                                value={this.state.tableQuery.month?moment(this.state.tableQuery.month):null} 
                                onChange={this.dateRangeChange} 
                            />
                        </FormItem>
                    </Col>
                    <Col sm={{span:12}} xs={{span:24}}>
                        <FormItem label="Status">
                        {getFieldDecorator('finApproStatus')(
                            <Select 
                                style={{ width: 230 }} 
                                placeholder="Choose Status"
                                allowClear
                                >
                                <Option value="0">Initial</Option>
                                <Option value="1">Pending-Audit</Option>
                                <Option value="2">Approved</Option>
                                <Option value="3">Rejected</Option>
                                <Option value="4">Packaged</Option>
                            </Select>
                        )}
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