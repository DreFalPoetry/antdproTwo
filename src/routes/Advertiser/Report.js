import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col,  Icon, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table} from 'antd';
import styles from './Report.less';
import { connect } from 'dva';
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
            dataSource: [],
            radioValue:1,

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
        })
    }

    componentWillUnmount() {}

    submitSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
              console.log('Received values of form: ', values);
            }
        });
    }

    handleSearch = (value) => {
        this.setState({
          dataSource: !value ? [] : [
            value,
            value + value,
            value + value + value,
          ],
        });
    }

    onSelect = (value) => {
        console.log('onSelect', value);
    }

    dateRangeChange = (date, dateString) => {
        console.log(date, dateString);
    }

    radioChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
          radioValue: e.target.value,
        });
    }

    render() {
        const { dataSource } = this.state;
        const { getFieldDecorator } = this.props.form;
        const {dataList} = this.props.advReport;
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
                                        dataSource={dataSource}
                                        style={{ width: 200 }}
                                        onSelect={this.onSelect}
                                        onSearch={this.handleSearch}
                                        placeholder="search advertiser account"
                                    />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Date Range">
                                    <RangePicker onChange={this.dateRangeChange} />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Display By Date">
                                    <RadioGroup onChange={this.radioChange} value={this.state.radioValue}>
                                        <Radio value={1}>Monthly</Radio>
                                        <Radio value={2}>Daily</Radio>
                                    </RadioGroup>
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Employee">
                                    <Select defaultValue="alipay" style={{ width: 100 }} className={styles.linkTypeSelect}>
                                        <Option value="alipay">Sales</Option>
                                        <Option value="bank">PM</Option>
                                    </Select>
                                    <AutoComplete
                                        className={styles.linkTypeAutoSelect}
                                        dataSource={dataSource}
                                        style={{ width: 200 }}
                                        onSelect={this.onSelect}
                                        onSearch={this.handleSearch}
                                        placeholder="search employee"
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <div className={styles.searchBtnWrapper}>
                                <Button type="primary">QUERY</Button>
                                <Button style={{marginLeft:'10px'}}>RESET</Button>
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