import React,{Component } from 'react';
import { connect } from 'dva';
import {Table,Select,Button,Icon ,Input,message  } from 'antd';
import commonStyle from '../../Advertiser/Report.less';
import {deepCloneObj} from '../../../utils/commonFunc';
import {advStatementUpdates} from '../../../services/api';
const Option = Select.Option;

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
            deductedAmounts:[]
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
                    const {dataList} = this.props.pubStatement;
                    this.props.dispatch({
                        type:'pubStatement/asyncDataList',
                        payload: this.replaceDataList(dataList,record),
                    });
                    this.asyncCellEditbleStatus(editbleKey,index);
                }
            });
        }
    }

    //common Replace prevStatus
    replaceDataList = (dataList,record) => {
        let tempDataList = deepCloneObj(dataList);
        tempDataList.forEach(function(item,ind){
            if(item.uniqueKey==record.uniqueKey){
                tempDataList.splice(ind,1,record);
            }
        });
        return tempDataList;
    }

    //common Replace EditbleStatus
    asyncCellEditbleStatus = (keyName,index) => {
        message.success('save');
        let tempEdit  = deepCloneObj(this.state[keyName]);
        tempEdit[index] = false;
        this.setState({
            [keyName]:tempEdit
        })
    }

    render(){
        const {selectedRowKeys,selectedRows } = this.state;
        const {dataList,total,pageSize,pageCurrent} = this.props.pubStatement;
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
        },{
            title: 'Invoice Amount',
            dataIndex: 'invoiceAmount',
        },{
            title: 'Currency',
            dataIndex: 'currency',
        },{
            title: 'Status',
            dataIndex: 'status',
        },{
            title: '',
            dataIndex: '',
            render:(text,record,index) => {
                return (
                    <Select 
                        size="small" 
                        placeholder='Apply Action'
                        style={{width:'130px'}}
                        >
                        <Option value="1">Move to Next Month</Option>
                        <Option value="2">Approve</Option>
                        <Option value="3">Reject</Option>
                        <Option value="4">Revert to Campaign Month</Option>
                    </Select>
                )
            }
        }];
        return(    
            <Table 
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
            /> 
        )
    }
}