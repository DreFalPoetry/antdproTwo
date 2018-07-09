import React, { Component } from 'react';
import { Button, Modal, Form, Input, Radio,DatePicker,Select,Row,Col  } from 'antd';
import styles from '../../Advertiser/Report.less';
import moment from 'moment';
import {getTheDate} from '../../../utils/commonFunc';
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
export default class GenerateInvoiceModal extends Component {
    state = {
        invDate:'',
        dueOnDate:''
    }

    invoicedateChange = (date, dateString) => {
        this.setState({
            invDate:dateString
        },function(){
            let dueOndate = getTheDate(this.state.invDate,30);
            this.setState({
                dueOnDate:dueOndate
            });
            this.props.form.setFieldsValue({'dueOnDate':moment(dueOndate)})
        });
    }

    dueOnDateChange = (date, dateString) => {
        this.setState({
            dueOnDate:dateString
        });
    }

    billingTermSelect = (value) => {
        let dueOndate =  getTheDate(this.state.invDate,Number(value));
        this.setState({
            dueOnDate:dueOndate
        });
        this.props.form.setFieldsValue({'dueOnDate':moment(dueOndate)})
    }

    //关闭modal
    closeModal = () => {
        this.props.changeModalVisible(false);
    }

    //提交表单数据
    submitFormData = () => {

    }

    render() {
      const { visible, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Generate Invoice"
          okText="Generate"
          onCancel={this.closeModal}
          onOk={this.submitFormData}
        >   
        <div className={styles.modalFormWrapper}>
            <Form layout="inline">
                <Row>
                    <Col span={24}>
                        <FormItem label="Actual Invoice No">
                            {getFieldDecorator('actInvNo', {
                                rules: [{ required: true, message: 'Please input the actual invoice No!' }],
                            })(
                                <Input autoComplete="off"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem label="Invoice Date">
                            {getFieldDecorator('InvDate', {
                                rules: [{ required: true, message: 'Please select the time!' }],
                            })(
                                <DatePicker onChange={this.invoicedateChange}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem label="Billing Term">
                            {getFieldDecorator('billingTerm', {
                                rules: [{ required: true, message: 'Please select' }],
                                initialValue:"30"
                            })(
                                <Select style={{width:230}} onChange={this.billingTermSelect}>
                                    <Option value="30">30 days</Option>
                                    <Option value="60">60 days</Option>
                                    <Option value="90">90 days</Option>
                                    <Option value="120">120 days</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem label="Due On">
                            {getFieldDecorator('dueOnDate', {
                                rules: [{ required: true, message: 'Please select the time!' }],
                            })(
                                <DatePicker onChange={this.dueOnDateChange}/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={24}>
                        <FormItem label="Pay To">
                            {getFieldDecorator('modifier', {
                                rules: [{ required: true, message: 'Please select' }],
                                initialValue:"23232"
                            })(
                                <Select style={{width:230}} onChange={this.billingTermSelect}>
                                    <Option value="23232">Moca Technology</Option>
                                    <Option value="2322">Shanghai</Option>
                                </Select>
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