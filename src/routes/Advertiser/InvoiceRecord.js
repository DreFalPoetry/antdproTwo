import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col,  Icon, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table} from 'antd';
import styles from './Report.less';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@Form.create()
export default class AdvInvRecord extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            radioValue:1,

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
            },,{
                title: '',
                dataIndex: 'remark',
                render:() =>{
                    return <div><Button>Destroy</Button><Button>Collect</Button></div> 
                }
            }];
        this.data = [{
            "uniqueKey": '1',
            "id":23233,
            "advName":"亚马逊",
            "campMonth":"2018-06",
            "amount":"2323",
            "currency":"USD", 
            "sysInvNo":"0.23",
            "actInvNo":"USD",
            "invDate":"2018-06-10",
            "billTerm":"90",
            "dueOn":"2018-07-10",
            "payTo":"MocaTechno",
            "collecAmount":"2323",
            "dataOnColl":"2018-09-10",
            "badDebt":"50",
            "remark":"备注信息。。。"
        },{
            "uniqueKey": '2',
            "id":23233,
            "advName":"亚马逊",
            "campMonth":"2018-06",
            "amount":"2323",
            "currency":"USD", 
            "sysInvNo":"0.23",
            "actInvNo":"USD",
            "invDate":"2018-06-10",
            "billTerm":"90",
            "dueOn":"2018-07-10",
            "payTo":"MocaTechno",
            "collecAmount":"2323",
            "dataOnColl":"2018-09-10",
            "badDebt":"50",
            "remark":"备注信息。。。"
        },{
            "uniqueKey": '3',
            "id":23233,
            "advName":"亚马逊",
            "campMonth":"2018-06",
            "amount":"2323",
            "currency":"USD", 
            "sysInvNo":"0.23",
            "actInvNo":"USD",
            "invDate":"2018-06-10",
            "billTerm":"90",
            "dueOn":"2018-07-10",
            "payTo":"MocaTechno",
            "collecAmount":"2323",
            "dataOnColl":"2018-09-10",
            "badDebt":"50",
            "remark":"备注信息。。。"
        }];
    }

    componentDidMount() {}

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
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Campaign  Month:">
                                    <MonthPicker onChange={this.dateRangeChange} />
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
                                <Button type="primary">QUERY</Button>
                                <Button style={{marginLeft:'10px'}}>RESET</Button>
                            </div>
                        </Row>
                    </Form>
                    </div>
                    <Table 
                        columns={this.columns} 
                        dataSource={this.data} 
                        rowKey="uniqueKey"
                        bordered
                    />
                    </Card>
                </PageHeaderLayout>
            </div>
        )
    }
}