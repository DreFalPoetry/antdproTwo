import React, { Component } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import {Card,Form,Row, Col,  Icon, Input, Button,AutoComplete,DatePicker,Radio,Select ,Table} from 'antd';
import styles from './Report.less';
const FormItem = Form.Item;

@Form.create()
export default class AdvCredit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
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
        this.data = [{
            "uniqueKey": '1',
            "id":23233,
            "advName":"亚马逊",
            "amount":"2313",
            "creditLevel":"Poor", 
        },{
            "uniqueKey": '2',
            "id":23233,
            "advName":"亚马逊",
            "amount":"2313",
            "creditLevel":"Poor", 
        },{
            "uniqueKey": '3',
            "id":23233,
            "advName":"亚马逊",
            "amount":"2313",
            "creditLevel":"Poor", 
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

    render() {
        const { getFieldDecorator } = this.props.form;
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
                                        <Input placeholder="Search by code or key word" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col sm={{span:12}} xs={{span:24}}> 
                                <div className={styles.searchBtnWrapper}>
                                    <Button type="primary">QUERY</Button>
                                    <Button style={{marginLeft:'10px'}}>RESET</Button>
                                </div>
                            </Col>
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