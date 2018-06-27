import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col,  Icon, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table} from 'antd';
import styles from './Report.less';
import { connect } from 'dva';
const FormItem = Form.Item;

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
            keyWords:''
        };
        this.columns = [{
                title: 'Advertiser Name',
                dataIndex: 'advName',
            },{
                title: 'Credit Amount (USD)',
                dataIndex: 'amount',
            },{
                title: 'Credit Level',
                dataIndex: 'creditLevel'
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
                                        <Input placeholder="Search by code or key word" autocomplete="off"/>
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