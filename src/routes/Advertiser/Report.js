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
            dateType:1,
            advAccountId:null,
            employeeId:null,
            startDate:'',
            endDate:'',
            keyWords:'',
            advAccountValue:'',
            employeeValue:'',
            employeeRole:"1"
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
                dateType:0
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
                this.setState({
                    keyWords:values.keyWords
                },function(){
                    this.props.dispatch({
                        type:'advReport/fetch',
                        payload:{...this.state}
                    })
                    this.props.dispatch({
                        type:'advReport/asyncListQuery',
                        payload:{...this.state}
                    })
                });
            }
        });
    }

    searchEmployeeOrAdvAccount = (type,value) => {
        if(type === 'advAccount'){
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
            this.setState({
                advAccountValue:value,
                advAccountId:value,
            });
        }else{
            this.setState({
                employeeValue:value,
                employeeId:value
            });
        }
    }

    dateRangeChange = (date, dateString) => {
        this.setState({
            startDate:dateString[0],
            endDate:dateString[1]
        })
    }

    radioChange = (e) => {
        this.setState({
            dateType: e.target.value,
        });
    }

    clearQuery = () => {
        this.props.form.resetFields();
        this.props.dispatch({
            type:'advReport/clearEmployeeAndAdvAccount'
        })
        this.setState({
            startDate:'',
            endDate:'',
            keyWords:'',
            dateType:1,
            advAccountId:null,
            employeeId:null,
            advAccountValue:'',
            employeeValue:'',
            employeeRole:'1'
        })
    }

    changeEmployeeRole = (value) => {
        this.setState({
            employeeRole:value
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {dataList,employeeList,advAccountList} = this.props.advReport;
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
                                <FormItem label="Date Range">
                                    <RangePicker 
                                        onChange={this.dateRangeChange} 
                                        value={this.state.startDate?[moment(this.state.startDate), moment(this.state.endDate)]:null}
                                        />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Display By Date">
                                    <RadioGroup onChange={this.radioChange} value={this.state.dateType}>
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
                        bordered
                    />
                    </Card>
                </PageHeaderLayout>
            </div>
        )
    }
}