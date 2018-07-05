import React,{Component } from 'react';
import { connect } from 'dva';
import {Table } from 'antd';

@connect(({pubStatement }) => ({
    pubStatement
}))

export default class PubStatementTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [],
            selectedRows:[],
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
        },{
            title: 'Deducted Reason',
            dataIndex: 'deductedReason',
        },{
            title: 'Deducted Amount$',
            dataIndex: 'deductedAmount',
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