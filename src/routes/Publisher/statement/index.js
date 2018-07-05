import React, { Component ,Fragment} from 'react';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {Card,Tabs } from 'antd';
import { connect } from 'dva';
import SearchForm from './search';
import SummaryTable from './summaryTable';

const TabPane = Tabs.TabPane;

@connect(({ advReport,pubStatement,advStatement,loading }) => ({
    advReport,
    pubStatement,
    advStatement,
    loading: loading.effects['advStatement/fetch'],  
}))
export default class PubStatement extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <PageHeaderLayout>
                    <Card bordered={false}>
                        <SearchForm/>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Tab 1" key="1">
                                <SummaryTable/>
                            </TabPane>
                            <TabPane tab="Tab 2" key="2">
                                2
                            </TabPane>
                        </Tabs>
                    </Card>
                </PageHeaderLayout>
            </div>
        )
    }
}