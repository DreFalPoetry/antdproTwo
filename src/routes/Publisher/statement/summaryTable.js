import React,{Component } from 'react';
import { connect } from 'dva';
import {Table } from 'antd';
@connect(({ advReport,pubStatement,advStatement,loading }) => ({
    advReport,
    pubStatement,
    advStatement,
    loading: loading.effects['advStatement/fetch'],  
}))

/**
 * 1.公用-- pagenumber pagesize，表单搜索条件  通过dispatch更新，prop传递，
 */

export default class SummaryTable extends Component{
    constructor(props) {
        super(props);
        this.state = {};
        this.sumColumns = [{
            title: 'Affiliate',
            dataIndex: 'affiliateName',
        },{
            title: 'System Amount$',
            dataIndex: 'sysAmount',
        },{
            title: 'Deducted Amount$',
            dataIndex: 'deductedAmount',
        },{
            title: 'Adjust Amount$',
            dataIndex: 'adjustAmount',
        },{
            title: 'Campaigns',
            dataIndex: 'campaigns',
        },{
            title: 'Initial',
            dataIndex: 'initial',
        },{
            title: 'Pending-Audit',
            dataIndex: 'pending',
        },{
            title: 'Rejected',
            dataIndex: 'rejected',
        },{
            title: 'Approved',
            dataIndex: 'approved',
        },{
            title: 'Packaged',
            dataIndex: 'packaged',
        }]
    }

    componentDidMount() {
        this.props.dispatch({
            type: 'pubStatement/fetchSummary',
        })
    }
   
    render(){
        const {summaryDataList} = this.props.pubStatement;
        const {loading} = this.props;
        return (
            <Table 
                columns={this.sumColumns} 
                dataSource={summaryDataList} 
                loading={loading}
                // pagination={{
                //     defaultCurrent:1,
                //     total:Number(total),
                //     showSizeChanger:true,
                //     pageSize:Number(pageSize),
                //     pageSizeOptions:['10','20','30','50','100'],
                //     onShowSizeChange:this.pageSizeChange,
                //     current:Number(pageCurrent), 
                //     onChange:this.pageChange
                // }}
                rowKey="uniqueKey"
                bordered
            /> 
        )
    }
}