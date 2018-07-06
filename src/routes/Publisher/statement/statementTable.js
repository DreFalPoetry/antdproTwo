import React,{Component,Fragment } from 'react';
import { connect } from 'dva';
import {Table,Select,Button,Icon ,Input,message,Row,Col,Form} from 'antd';
import commonStyle from '../../Advertiser/Report.less';
import {deepCloneObj} from '../../../utils/commonFunc';
import {advStatementUpdates} from '../../../services/api';
import AttachmentModal from './attachmentModal';
import GenerateInvoiceModal from './generateInvoiceModal';
const Option = Select.Option;
const FormItem = Form.Item;
@Form.create()
@connect(({pubStatement }) => ({
    pubStatement
}))

export default class PubStatementTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows:[],
            deductedConvEditble:[],
            deductedConvs:[],
            deductedAmountEditble:[],
            deductedAmounts:[],
            adjustAmountEditble:[],
            adjustAmounts:[],
            invoiceAmountEditble:[],
            invoiceAmounts:[],
            currencyEditble:[],
            cellCurrencys:[],
            deductedReasonEditble:[],
            attachModalVisible:false,
            rowOperates:[],
            //关于row的多选的操作
            showGenerateInvoiveOption:false,
            showApproveOrRejectOption:false
        };
    }

    pageSizeChange = (current, pageSize) => {
        this.initalTableList(pageSize,1)
    }

    pageChange = (pageCurrent, pageSize) => {
        this.initalTableList(pageSize,pageCurrent)
    }

    initalTableList = (pageSize,pageCurrent) => {
        const {tableQuery} = this.props.pubStatement; 
        this.props.dispatch({
            type: 'pubStatement/fetch',
            payload:{
               ...tableQuery,
               pageSize:pageSize,
               pageCurrent:pageCurrent
            }
        });
    }

    //选择行时进行的操作
    selectTableRow =  (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys:selectedRowKeys,
            selectedRows:selectedRows,
        })
    }

    //点击编辑按钮编辑单元格
    editCellValue = (index,keyName) => {
        let tempArr =deepCloneObj(this.state[keyName]);
        tempArr[index] = true;
        this.setState({
            [keyName]:tempArr
        })
        if(keyName == 'deductedReasonEditble'){
            this.setState({
                attachModalVisible:true
            })
        }
    }

     //表格输入当前键入的value
     inputCellValue = (index,keyName,e) => {
        const { value } = e.target;
        let reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if(keyName == 'deductedConvs'){
            reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        }else if(keyName == 'deductedAmounts'){

        }
        let tempArr = deepCloneObj(this.state[keyName]);
        if ((!isNaN(value) && reg.test(value)) || !value) {
            tempArr[index] = value;
            this.setState({
                [keyName]:tempArr
            });
        }
    }

    /**
     * 确认单元格的输入
     * @param {传递的字段名} fieldName
     * @param {state中存储的保存值的名字} keyName
     * @param {state中存储的保存是否为可编辑状态的字段} editbleKey
     */
    sureCellInput = (index,record,fieldName,keyName,editbleKey) => {
        if(this.state[keyName][index]){
            const response = advStatementUpdates('1001',{[fieldName]:this.state[keyName][index]});
            response.then(res => {return res;})
            .then(json => {
                if(json.code == 0){
                    record[fieldName] = this.state[keyName][index];
                    this.replaceDataList(record);
                    this.asyncCellEditbleStatus(editbleKey,index);
                }
            });
        }
    }

    //common Replace DataList 用于同步dataList信息
    replaceDataList = (record) => {
        const {dataList} = this.props.pubStatement;
        let tempDataList = deepCloneObj(dataList);
        tempDataList.forEach(function(item,ind){
            if(item.uniqueKey==record.uniqueKey){
                tempDataList.splice(ind,1,record);
            }
        });
        this.props.dispatch({
            type:'pubStatement/asyncDataList',
            payload: tempDataList,
        });
        message.success('save');
    }

    //common Replace EditbleStatus
    asyncCellEditbleStatus = (keyName,index) => {
        let tempEdit  = deepCloneObj(this.state[keyName]);
        tempEdit[index] = false;
        this.setState({
            [keyName]:tempEdit
        })
    }

    //选择当前行的货币
    selectCellCurrency = (index,value) => {
        let tempCellCurrencys = deepCloneObj(this.state.cellCurrencys);
        tempCellCurrencys[index] = value;
        this.setState({
            cellCurrencys:tempCellCurrencys
        })
    }

    //返回状态对应的文字
    showStatusWord = (status) => {
        switch(status){
            case 0:return 'inital';
            case 1: return 'Pending-Audit';
            case 2:return 'Approved';
            case 3: return 'Rejected';
            case 4:return 'Packaged';
            default:return '';
        }
    }

    //选择对行进行的操作
    selectOperate = (index,value) => {
        let tempRowOperates = deepCloneObj(this.state.rowOperates);
        tempRowOperates[index] = value;
        this.setState({
           rowOperates:tempRowOperates
        })
    }

    //确认对行进行的操作
    sureDoOperate = (index,record) => {
        let status = this.state.rowOperates[index];
        if(status!=undefined && status!=null){
            if(status == 0){
                if( 
                    // record.deductedConv 
                     record.deductedReason 
                    // && record.deductedAmount 
                    // && record.adjustAmount 
                    // && record.invoiceAmount 
                    // && record.currency
                ){
                    record.status = 1;
                    this.replaceDataList(record);
                    let tempArr = deepCloneObj(this.state.rowOperates);
                    tempArr[index] = undefined;
                    this.setState({
                        rowOperates:tempArr
                    })
                }else{
                    message.error('有信息未填写，无法提交');
                }
            }
        }
    }

    judgeIsThisMoth = (date) => {
        let result = {};
        let year = new Date().getFullYear();
        let month = new Date().getMonth()+1 <10?'0'+(new Date().getMonth()+1) :new Date().getMonth()+1;
        let nextMonth = new Date().getMonth()+2 <10?'0'+(new Date().getMonth()+2) :new Date().getMonth()+2;
        if(date.split('-')[1] == month){
            result.isSameMonth = true;
        }else{
            result.isSameMonth = false;
        }
        result.thisMonth = year+'-'+month;
        result.nextMonth = year+'-'+nextMonth;
        return result;
    }

    changeAttachModalVisible = (visible,index) => {
        this.setState({
            attachModalVisible:visible
        },function(){
            let tempArr = deepCloneObj(this.state.deductedReasonEditble);
            tempArr[index] = false;
            this.setState({
                deductedReasonEditble:tempArr
            })
        })
    }

    //row批量选择操作
    selectOption = (value) => {
        console.log(value);
    }

    render(){
        const {selectedRowKeys,selectedRows } = this.state;
        const {dataList,total,pageSize,pageCurrent,headerInfo} = this.props.pubStatement;
        const loading = this.props.loading;
        const rowSelection = {
            selectedRowKeys:selectedRowKeys,
            onChange:this.selectTableRow,
            // getCheckboxProps:(record)=>{
            //     return {disabled:(record.finApproStatus == '3' || record.finApproStatus == '2')}
            // }
        };
        const userRoles = localStorage.getItem('antd-pro-authority');
        const userRole = userRoles.split(',');
        const columns = [{
            title: 'Affiliate',
            dataIndex: 'affiliateId',
        },{
            title: 'Campaign',
            dataIndex: 'campaignId',
        },{
            title: 'Payout$',
            dataIndex: 'payout',
        },{
            title: 'Total Conv',
            dataIndex: 'totalConv',
        },{
            title: 'Log Deducted Conv',
            dataIndex: 'logDeductedConv',
        },{
            title: 'System Amount$',
            dataIndex: 'systemAmount',
        },{
            title: 'Deducted Conv',
            dataIndex: 'deductedConv',
            render:(text,record,index) => {
                if(userRole.indexOf('admin') > -1){
                    return (
                        !this.state.deductedConvEditble[index]?
                        <div className={commonStyle.editableCellIconWrapper}>
                            {text || ' '}
                            <Icon
                                type="edit"
                                className={commonStyle.editableCellIcon}
                                onClick={this.editCellValue.bind(this,index,'deductedConvEditble')}
                            />
                        </div>:
                        <div>
                            <Input value={this.state.deductedConvs[index]!=undefined?this.state.deductedConvs[index]:text} 
                                    onChange={this.inputCellValue.bind(this,index,'deductedConvs')}
                                    size="small"
                                    style={{width:80,marginRight:5}}
                            />
                            <Button type='primary' size='small' 
                                    onClick={this.sureCellInput.bind(this,index,record,'deductedConv','deductedConvs','deductedConvEditble')}>
                                    Sure
                            </Button>
                        </div>
                    )
                }else{
                    return  text || '';
                }
            }
        },{
            title: 'Deducted Reason',
            dataIndex: 'deductedReason',
            render:(text,record,index) => {
                if(userRole.indexOf('admin') > -1){
                    return (
                        !this.state.deductedReasonEditble[index]?
                        <div className={commonStyle.editableCellIconWrapper}>
                            {text || ' '}
                            <Icon
                                type="edit"
                                className={commonStyle.editableCellIcon}
                                onClick={this.editCellValue.bind(this,index,'deductedReasonEditble')}
                            />
                        </div>:
                        <div>
                            <AttachmentModal  
                                visible={this.state.attachModalVisible} 
                                index = {index}
                                record = {record}
                                changeVisible={this.changeAttachModalVisible}/>
                        </div>
                    )
                }else{
                    return  text || '';
                }
            }
        },{
            title: 'Deducted Amount$',
            dataIndex: 'deductedAmount',
            render:(text,record,index) => {
                if(userRole.indexOf('admin') > -1){
                    return (
                        !this.state.deductedAmountEditble[index]?
                        <div className={commonStyle.editableCellIconWrapper}>
                            {text || ' '}
                            <Icon
                                type="edit"
                                className={commonStyle.editableCellIcon}
                                onClick={this.editCellValue.bind(this,index,'deductedAmountEditble')}
                            />
                        </div>:
                        <div>
                            <Input value={this.state.deductedAmounts[index]!=undefined?this.state.deductedAmounts[index]:text} 
                                    onChange={this.inputCellValue.bind(this,index,'deductedAmounts')}
                                    size="small"
                                    style={{width:80,marginRight:5}}
                            />
                            <Button type='primary' size='small' 
                                onClick={this.sureCellInput.bind(this,index,record,'deductedAmount','deductedAmounts','deductedAmountEditble')}>Sure
                            </Button>
                        </div>
                    )
                }else{
                    return  text || '';
                }
            }
        },{
            title: 'Adjust Amount$',
            dataIndex: 'adjustAmount',
            render:(text,record,index) => {
                if(userRole.indexOf('admin') > -1){
                    return (
                        !this.state.adjustAmountEditble[index]?
                        <div className={commonStyle.editableCellIconWrapper}>
                            {text || ' '}
                            <Icon
                                type="edit"
                                className={commonStyle.editableCellIcon}
                                onClick={this.editCellValue.bind(this,index,'adjustAmountEditble')}
                            />
                        </div>:
                        <div>
                            <Input value={this.state.adjustAmounts[index]!=undefined?this.state.adjustAmounts[index]:text} 
                                    onChange={this.inputCellValue.bind(this,index,'adjustAmounts')}
                                    size="small"
                                    style={{width:80,marginRight:5}}
                            />
                            <Button type='primary' size='small' 
                                onClick={this.sureCellInput.bind(this,index,record,'adjustAmount','adjustAmounts','adjustAmountEditble')}>Sure
                            </Button>
                        </div>
                    )
                }else{
                    return  text || '';
                }
            }
        },{
            title: 'Invoice Amount',
            dataIndex: 'invoiceAmount',
            render:(text,record,index) => {
                if(userRole.indexOf('admin') > -1){
                    return (
                        !this.state.invoiceAmountEditble[index]?
                        <div className={commonStyle.editableCellIconWrapper}>
                            {text || ' '}
                            <Icon
                                type="edit"
                                className={commonStyle.editableCellIcon}
                                onClick={this.editCellValue.bind(this,index,'invoiceAmountEditble')}
                            />
                        </div>:
                        <div>
                            <Input value={this.state.invoiceAmounts[index]!=undefined?this.state.invoiceAmounts[index]:text} 
                                    onChange={this.inputCellValue.bind(this,index,'invoiceAmounts')}
                                    size="small"
                                    style={{width:80,marginRight:5}}
                            />
                            <Button type='primary' size='small' 
                                onClick={this.sureCellInput.bind(this,index,record,'invoiceAmount','invoiceAmounts','invoiceAmountEditble')}>Sure
                            </Button>
                        </div>
                    )
                }else{
                    return  text || '';
                }
            }
        },{
            title: 'Currency',
            dataIndex: 'currency',
            render:(text,record,index) => {
                if(userRole.indexOf('admin') > -1){
                    return (
                        !this.state.currencyEditble[index]?
                        <div className={commonStyle.editableCellIconWrapper}>
                            {text || ' '}
                            <Icon
                                type="edit"
                                className={commonStyle.editableCellIcon}
                                onClick={this.editCellValue.bind(this,index,'currencyEditble')}
                            />
                        </div>:
                        <div>
                            <Select size="small" 
                                value={this.state.cellCurrencys[index]||String(text)||undefined} 
                                placeholder='Select Currency'
                                style={{ width: 100,marginRight:5 }} 
                                onChange={this.selectCellCurrency.bind(this,index)}>
                                <Option value="INR">INR</Option>
                                <Option value="USD">USD</Option>
                            </Select>
                            <Button type='primary' size='small' 
                                onClick={this.sureCellInput.bind(this,index,record,'currency','cellCurrencys','currencyEditble')}>Sure
                            </Button>
                        </div>
                    )
                }else{
                    return  text || '';
                }
            }
        },{
            title: 'Status',
            dataIndex: 'status',
            render:(index) => {
                return this.showStatusWord(index);
            }
        },{
            title: '',
            dataIndex: '',
            render:(text,record,index) => {
                if(userRole.indexOf('admin') > -1){//角色为am
                    let monthResult = this.judgeIsThisMoth(record.month);
                    let isSameMonth = monthResult.isSameMonth;
                    return <Fragment>
                                <Select 
                                value={this.state.rowOperates[index]}
                                size="small" 
                                placeholder='Choose Operate'
                                style={{width:'130px'}}
                                onChange={this.selectOperate.bind(this,index)}
                                >
                                    <Option hidden={record.status != 0 && record.status != 3} value="0">Apply</Option>
                                    <Option hidden={record.status == 0 ||record.status == 3} value="1">Reset</Option>
                                    <Option hidden={!isSameMonth} value="2">Move to Next Month</Option>
                                    <Option hidden={isSameMonth} value="3">Revert to Campaign Month</Option>
                                </Select>
                                <Button type='primary' size='small' 
                                    onClick={this.sureDoOperate.bind(this,index,record)}>Sure
                                </Button>
                            </Fragment>
                }else{//角色为finance
                    return (
                        <Fragment>
                        <Select 
                            size="small" 
                            placeholder='Choose Operate'
                            style={{width:'130px'}}
                            onChange={this.selectOperate.bind(this,index)}
                        >
                            <Option value="2">Approve</Option>
                            <Option value="3">Reject</Option>
                            <Option value="1">Move to Next Month</Option>
                        </Select>
                        <Button type='primary' size='small' 
                            onClick={this.sureDoOperate.bind(this,index,record)}>Sure
                        </Button>
                        </Fragment>
                    )
                }
            }
        }];
        return(    
            <Fragment>
                <Row>
                    <Col sm={{span:12}} xs={{span:24}}>
                        <Form layout="inline" style={{marginBottom:'10px'}}>
                            <FormItem label="Batch Actions">
                            {
                                this.state.showGenerateInvoiveOption?(
                                    <Select style={{ width: 230 }} onChange={this.selectOption} placeholder="Choose and Apply">
                                        <Option value="3">Generate Invoice</Option>
                                    </Select>
                                ):null
                            }
                            {
                                this.state.showApproveOrRejectOption?(
                                    <Select style={{ width: 230 }} onChange={this.selectOption} placeholder="Choose and Apply">
                                        <Option value="1">Approve</Option>
                                        <Option value="2">Reject</Option>
                                    </Select>
                                ):null
                            }
                            </FormItem>
                        </Form>
                    </Col>
                </Row>
                <Table 
                    size="small"
                    rowSelection={rowSelection}
                    columns={columns} 
                    dataSource={dataList} 
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
                    rowKey="uniqueKey"
                    bordered
                    footer={() => (
                        <div>{headerInfo.total} campaigns，已开票{headerInfo.invoiced}个，Rejected{headerInfo.rejected}个，Approved未开票{headerInfo.approved}个</div>
                    )}
                />
                <GenerateInvoiceModal/> 
            </Fragment>
        )
    }
}