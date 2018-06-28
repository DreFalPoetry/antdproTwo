import React, { Component } from 'react';
import { Button, Modal, Form, Input, Radio,DatePicker,Select,Row,Col  } from 'antd';
import styles from './Report.less';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;

@Form.create()
export default class CollectModal extends Component {
    state={
        dateOnColl:''
    }

    collectionDateChange = (date, dateString) => {
        this.setState({
            dateOnColl:dateString
        })
    }

    currencySelect = (value) => {
        console.log(`selected ${value}`);
    }

    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Generate Invoice"
          okText="Confirm"
          onCancel={onCancel}
          onOk={onCreate.bind(this,this.state.dateOnColl)}
        >   
        <div className={`${styles.modalFormWrapper} ${styles.collectModal}`}>
            <Form layout="inline">
                <Row>
                    <Col span={24}>
                        <FormItem label="Collect Amount">
                            {getFieldDecorator('amount', {
                                rules: [{ required: true, message: 'Please input collect amount' }],
                            })(
                                <Input autoComplete="off"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem label="Currency">
                            {getFieldDecorator('currency', {
                                rules: [{ required: true, message: 'Please select' }],
                                initialValue:"USD"
                            })(
                                <Select style={{width:230}} onChange={this.currencySelect}>
                                    <Option value="USD">USD</Option>
                                    <Option value="INIF">INIF</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem label="Date on Collection">
                            {getFieldDecorator('InvDate', {
                                rules: [{ required: true, message: 'Please select the time!' }],
                            })(
                                <DatePicker onChange={this.collectionDateChange}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24} className={styles.textAreaWrapper}>
                        <FormItem label="Remark">
                            {getFieldDecorator('remark', {
                                rules: [{ required: true, message: 'Please inter remark' }]
                            })(
                                <TextArea rows={3}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </div>
        </Modal>
      );
    }
}