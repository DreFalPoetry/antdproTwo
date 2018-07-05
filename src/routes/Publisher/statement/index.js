import React, { Component ,Fragment} from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@Form.create()
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
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="Tab 1" key="1">
                            </TabPane>
                            <TabPane tab="Tab 2" key="2">
                            </TabPane>
                        </Tabs>
                    </Card>
                </PageHeaderLayout>
            </div>
        )
    }
}