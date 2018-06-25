import { parse } from 'url';

// mock advReportData
let advReportData = [];
for (let i = 0; i < 46; i += 1) {
    advReportData.push({
        uniqueKey: i,
        date: new Date(`2018-06-${Math.floor(i / 2) + 1}`),
        id:23232,
        name: `TradeCode ${i}`,
        payout: `一个任务名称 ${i}`,
        currency: '曲丽丽',
        totalConv: '这是一段描述',
        frand: Math.floor(Math.random() * 1000),
        revenue: Math.floor(Math.random() * 10) % 4,
        cost: "34.34",
        margin: new Date(`2018-06-${Math.floor(i / 2) + 1}`),
    });
}

export function getRule(req, res, u) {
    let url = u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url; // eslint-disable-line
    }
  
    const params = parse(url, true).query;
  
    let dataSource = [...advReportData];
  
    let pageSize = 10;
    if (params.pageSize) {
      pageSize = params.pageSize * 1;
    }
  
    const result = {
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(params.currentPage, 10) || 1,
      },
    };
  
    if (res && res.json) {
      res.json(result);
    } else {
      return result;
    }
}