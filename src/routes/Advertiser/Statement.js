import React, { Component ,Fragment} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table,Alert} from 'antd';
import commonStyle from './Report.less';
import InvoiceModal from './GenerateInvoiceModal';
const FormItem = Form.Item;
const { MonthPicker } = DatePicker;
const RadioGroup = Radio.Group;
const Option = Select.Option;

@Form.create()
export default class AdvStatement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            radioValue:1,
            selectedRowKeys: [],
            selectedRows:[],
            totalInvoiceAmount:[],
            invoiceModalvisible:false
        };
        this.columns = [{
                title: 'Campaign',
                dataIndex: 'id',
                render: (text,record) => {
                    return <span>{text+"-"+record.name}</span>
                }
            },{
                title: 'Invoice Amount',
                dataIndex: 'invoiceAmount'
            },{
                title: 'Currency',
                dataIndex: 'currency',
            },{
                title: 'Deducted Conv.',
                dataIndex: 'deductedConv',
            },{
                title: 'Deducted Amt.',
                dataIndex: 'deductedAmt',
            },{
                title: 'Finance Approve',
                dataIndex: 'finApproStatus',
            },{
                title: 'Move to',
                dataIndex: 'month',
            }];
        this.data = [{
            "uniqueKey": '1',
            "id":23232,
            "name":"亚马逊",
            "invoiceAmount":"132",//（默认为空）
            "currency":"USD", //（默认为空）
            "deductedConv":"0.23",
            "deductedAmt":"USD",
            "finApproStatus":0, //(0--Pending-Audit，1--Approved 2--Rejected 3--Invoiced)
            "month":"2018-06"
        },{
            "uniqueKey": '2',
            "id":23232,
            "name":"亚马逊",
            "invoiceAmount":"132",//（默认为空）
            "currency":"USD", //（默认为空）
            "deductedConv":"0.23",
            "deductedAmt":"USD",
            "finApproStatus":0, //(0--Pending-Audit，1--Approved 2--Rejected 3--Invoiced)
            "month":"2018-06"
        },{
            "uniqueKey": '3',
            "id":23232,
            "name":"亚马逊",
            "invoiceAmount":"132",//（默认为空）
            "currency":"USD", //（默认为空）
            "deductedConv":"0.23",
            "deductedAmt":"USD",
            "finApproStatus":0, //(0--Pending-Audit，1--Approved 2--Rejected 3--Invoiced)
            "month":"2018-06"
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

    //批量选择操作 1--Approved 2--Rejected 3--Invoiced
    selectOption = (value) => {
        console.log(`selected ${value}`);
        if(value == 3){
            this.setState({ invoiceModalvisible: true });
        }
    }

    selectTableRow =  (selectedRowKeys, selectedRows) => {
        let totalInvoiceAmount = [];
        selectedRows.map((item) => {
            if(item.currency == "USD"){
                if(totalInvoiceAmount.length){
                    totalInvoiceAmount.forEach((item1,index)=>{
                        if(item1.type == 'USD'){
                            item1.total += Number(item.invoiceAmount) 
                        }
                    })
                }else{
                    totalInvoiceAmount.push({'type':item.currency,"total":Number(item.invoiceAmount)})
                }
            }else if(item.currency == "INR"){
                if(totalInvoiceAmount.length){
                    totalInvoiceAmount.forEach((item1,index)=>{
                        if(item1.type == 'INR'){
                            item1.total += Number(item.invoiceAmount) 
                        }
                    })
                }else{
                    totalInvoiceAmount.push({'type':item.currency,"total":Number(item.invoiceAmount)})
                }
            }
        });
        this.setState({
            selectedRowKeys:selectedRowKeys,
            selectedRows:selectedRows,
            totalInvoiceAmount:totalInvoiceAmount
        })
    }

    cleanSelectedRows = () => {
        this.selectTableRow([],[])
        this.setState({
            selectedRows:[],
            totalInvoiceAmount:[]
        })
    }

    cancelGenerate = () => {
        this.setState({ invoiceModalvisible: false });
    }

    createInvoice = () => {
        const form = this.formRef.props.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          console.log('Received values of form: ', values);
          form.resetFields();
          this.setState({ invoiceModalvisible: false });
        });
    }

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    render() {
        const { dataSource,selectedRowKeys,selectedRows,totalInvoiceAmount } = this.state;
        const { getFieldDecorator } = this.props.form;
        const rowSelection = {
            selectedRowKeys:selectedRowKeys,
            onChange:this.selectTableRow,
        };
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
                                    <Select defaultValue="alipay" style={{ width: 100 }} className={commonStyle.linkTypeSelect}>
                                        <Option value="alipay">Sales</Option>
                                        <Option value="bank">PM</Option>
                                    </Select>
                                    <AutoComplete
                                        className={commonStyle.linkTypeAutoSelect}
                                        dataSource={dataSource}
                                        style={{ width: 200 }}
                                        onSelect={this.onSelect}
                                        onSearch={this.handleSearch}
                                        placeholder="search employee"
                                    />
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Date Range">
                                    <MonthPicker onChange={this.dateRangeChange} />
                                </FormItem>
                            </Col>
                        </Row>
                        <Row>
                            <div className={commonStyle.searchBtnWrapper}>
                                <Button type="primary">QUERY</Button>
                                <Button style={{marginLeft:'10px'}}>RESET</Button>
                            </div>
                        </Row>
                        <Row>
                            <Col sm={{span:12}} xs={{span:24}}>
                                <FormItem label="Batch Actions">
                                    <Select style={{ width: 230 }} onChange={this.selectOption}>
                                        <Option value="3">Generate Invoice</Option>
                                        <Option value="1">Approve</Option>
                                        <Option value="2">Reject</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                    </div>
                    <Alert
                        style={{marginBottom:"5px"}}
                        message={
                        <Fragment>
                             Selected <a style={{ fontWeight: 600 }}>{selectedRows.length}</a> Campaigns&nbsp;&nbsp;
                            {totalInvoiceAmount.map((item,index)=> (
                            <span style={{ marginLeft: 8 }} key={index}>
                                Total Invoice Amount:&nbsp;
                                <span style={{ fontWeight: 600 }}>
                                    {item.total + " " +item.type}
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
                        columns={this.columns} 
                        dataSource={this.data} 
                        rowKey="uniqueKey"
                        bordered
                    />
                    </Card>
                </PageHeaderLayout>
                <InvoiceModal
                    wrappedComponentRef={this.saveFormRef}
                    visible={this.state.invoiceModalvisible}
                    onCancel={this.cancelGenerate}
                    onCreate={this.createInvoice}
                />
            </div>
        )
    }
}