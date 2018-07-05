import React, { Component ,Fragment} from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {Card,Tabs } from 'antd';
import { connect } from 'dva';
import SearchForm from './search';
import SummaryTable from './summaryTable';
import PubStatementTable from './statementTable';

const TabPane = Tabs.TabPane;

@connect(({pubStatement,loading }) => ({
    pubStatement,
    loading: loading.effects['pubStatement/fetchSummary'],  
    mainLoading:loading.effects['pubStatement/fetch']
}))
export default class PubStatement extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.dispatch({
            type:'pubStatement/fetch',
            payload:{}
        });
        this.props.dispatch({
            type:'pubStatement/fetchSummary',
            payload:{}
        });
    }

    render() {
        const {loading,mainLoading} = this.props;
        return (
            <Fragment>
                <PageHeaderLayout>
                    <Card bordered={false}>
                        <SearchForm/>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Tab 1" key="1">
                                <SummaryTable loading={loading}/>
                            </TabPane>
                            <TabPane tab="Tab 2" key="2">
                                <PubStatementTable loading={mainLoading}/>
                            </TabPane>
                        </Tabs>
                    </Card>
                </PageHeaderLayout>
            </Fragment>
        )
    }
}