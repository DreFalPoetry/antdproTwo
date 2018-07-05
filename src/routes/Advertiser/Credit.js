import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col,  Icon, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table,message } from 'antd';
import styles from './Report.less';
import { connect } from 'dva';
import { deepCloneObj } from '../../utils/commonFunc';
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect(({ advReport,advCredit,loading }) => ({
    advReport,
    advCredit,
    loading: loading.effects['advCredit/fetch'],  
}))
export default class AdvCredit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageCurrent:1,
            pageSize:20,
            keyWords:'',
            amountEditable:[],
            creditAmount:[],
            levelEditable:[],
            creditLevel:[]
        };
        this.columns = [{
                title: 'Advertiser Name',
                dataIndex: 'advName',
            },{
                title: 'Credit Amount (USD)',
                dataIndex: 'amount',
                render:(text,record,index)=>{
                    return (
                        this.state.amountEditable[index] ? (
                        <div>
                            <Input 
                                value={this.state.creditAmount[index]!=undefined?this.state.creditAmount[index]:text} 
                                onChange={this.inputCreditAmount.bind(this,index)}
                                size="small"
                                style={{width:80,marginRight:5}}
                            />
                            <Button type='primary' size='small' onClick={this.sureCellAmount.bind(this,index,record)}>Sure</Button>
                            </div>
                        ) : (
                            <div className={styles.editableCellIconWrapper}>
                                {text || ' '}
                                <Icon
                                    type="edit"
                                    className={styles.editableCellIcon}
                                    onClick={this.editAmount.bind(this,index)}
                                />
                            </div>
                        )
                    )
                }
            },{
                title: 'Credit Level',
                dataIndex: 'creditLevel',
                render:(text,record,index)=>{
                    return (
                        this.state.levelEditable[index] ? (
                        <div>
                           <Select size="small" value={this.state.creditLevel[index]||text||null} style={{ width: 80,marginRight:5 }} onChange={this.selectCellLevel.bind(this,index)}>
                                <Option value="0">Poor</Option>
                                <Option value="1">Alert</Option>
                                <Option value="2">Good</Option>
                                <Option value="3">Normal</Option>
                            </Select>
                            <Button type='primary' size='small' onClick={this.sureCellLevel.bind(this,index,record)}>Sure</Button>
                            </div>
                        ) : (
                            <div className={styles.editableCellIconWrapper}>
                                {this.showLevel(text)}
                                <Icon
                                    type="edit"
                                    className={styles.editableCellIcon}
                                    onClick={this.editLevel.bind(this,index)}
                                />
                            </div>
                        )
                    )
                }
            }];
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'advCredit/fetch',
            payload:{
                pageCurrent:this.state.pageCurrent,
                pageSize:this.state.pageSize
            }
        })
    }

    componentWillUnmount() {
        this.props.dispatch({
            type:'advCredit/clear'
        })
    }

    showLevel = (status) =>{
        if(status == 0){
            return 'Poor'
        }else if(status == 1){
            return 'Alert'
        }else if(status == 2){
            return 'Good'
        }else if(status == 3){
            return 'Normal'
        }else {
            return ''
        }
    }

    editLevel = (index) => {
        let tempLevelEditable = deepCloneObj(this.state.levelEditable);
        tempLevelEditable[index] = true;
        this.setState({
            levelEditable:tempLevelEditable
        })
    }

    //选择 cell 中的 creditLevel
    selectCellLevel = (index,value) => {
        let tempCreditLevel = deepCloneObj(this.state.creditLevel);
        tempCreditLevel[index] = value;
        this.setState({
            creditLevel:tempCreditLevel
        });
    }

    //确定 cell 中的 creditLevel
    sureCellLevel = (index,record) => {
        let itemLevel;
        if(this.state.creditLevel[index]!= undefined ||this.state.creditLevel[index]!= null){
            itemLevel = this.state.creditLevel[index];
            // const response = advStatementUpdates('1001',{currency:itemCurrency});
            // response.then(res => {return res;})
            // .then(json => {
            //     if(json.code == 0){
                    record.creditLevel = itemLevel;
                    const {dataList} = this.props.advCredit;
                    let tempDataList = deepCloneObj(dataList);
                    tempDataList.forEach(function(item,ind){
                        if(item.uniqueKey==record.uniqueKey){
                            tempDataList.splice(ind,1,record);
                        }
                    });
                    this.props.dispatch({
                        type:'advCredit/asyncDataList',
                        payload: tempDataList,
                    })
                    message.success('save');
                    let tempEdit = deepCloneObj(this.state.levelEditable);
                    tempEdit[index] = false;
                    this.setState({
                        levelEditable:tempEdit
                    })
                // }
            // });
        }
    }

    // 确定 cell中的 CreditAmount
    sureCellAmount = (index,record) => {
        if(this.state.creditAmount[index]){
            // const response = advStatementUpdates('1001',{invoiAmount:this.state.invoiceAmount[index]});
            // response.then(res => {return res;})
            // .then(json => {
            //     if(json.code == 0){
                    record.amount = this.state.creditAmount[index];
                    const {dataList} = this.props.advCredit;
                    let tempDataList = deepCloneObj(dataList);
                    tempDataList.forEach(function(item,ind){
                        if(item.uniqueKey==record.uniqueKey){
                            tempDataList.splice(ind,1,record);
                        }
                    });
                    this.props.dispatch({
                        type:'advCredit/asyncDataList',
                        payload: tempDataList,
                    })
                    message.success('save');
                    let tempEdit  = deepCloneObj(this.state.amountEditable);
                    tempEdit[index] = false;
                    this.setState({
                        amountEditable:tempEdit
                    })
                // }
            // });
        }
    }

    // 表格编辑当前的CreditAmount
    editAmount = (index) => {
        let tempAmountEditable = deepCloneObj(this.state.amountEditable);
        tempAmountEditable[index] = true;
        this.setState({
            amountEditable:tempAmountEditable
        })
    }

    //表格输入当前的CreditAmount
    inputCreditAmount = (index,e) => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        let tempCreditAmount = deepCloneObj(this.state.creditAmount);
        if ((!isNaN(value) && reg.test(value)) || !value) {
            tempCreditAmount[index] = value;
            this.setState({
                creditAmount:tempCreditAmount
            });
        }
    }

    submitSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.setState({
                    pageCurrent:1,
                    keyWords:values.keyWords
                },function(){
                        this.props.dispatch({
                            type: 'advCredit/fetch',
                            payload:{
                                ...this.state
                            }
                        })
                })
            }
        });
    }

    clearQuery = () => {
        this.props.form.resetFields();
        this.setState({
            pageCurrent:1,
            keyWords:''
        },function(){
            this.props.dispatch({
                type: 'advCredit/fetch',
                payload:{
                    ...this.state
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
                type: 'advCredit/fetch',
                payload:{
                    ...this.state
                }
            });
        });
    }

    pageChange = (page, pageSize) => {
        this.setState({
            pageCurrent:page
        },function(){
            this.props.dispatch({
                type: 'advCredit/fetch',
                payload:{
                    ...this.state
                }
            });
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {dataList,total,pageSize,pageCurrent} = this.props.advCredit;
        const {loading} = this.props;
        return (
            <div>
                <PageHeaderLayout>
                    <Card bordered={false}>
                    <div className={`${styles.searchFormWrapper} ${styles.creditFormWrapper}`}>
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
                                <div className={styles.searchBtnWrapper}>
                                    <Button type="primary" htmlType="submit">QUERY</Button>
                                    <Button style={{marginLeft:'10px'}} onClick={this.clearQuery}>RESET</Button>
                                </div>
                            </Col>
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