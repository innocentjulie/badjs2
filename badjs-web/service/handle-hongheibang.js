'use strict';
var moment = require('moment');
var Promise = require('bluebird');
const getBaseScore = require('../lib/getScore.js');

/**
 * 得到红黑榜分数
     红黑榜加减分规则
     100 < badjs评分 < 80 ：-1分
     80 < badjs评分 < 50 ：-2分
     50 < badjs评分 ：-3分
    每人当月最多扣 5分
    badjs评分 == 100 业务负责人 ： 每个业务 +1分
    每人当月最多 + 5 分
 */
function getScore(db) {

    return new Promise((resolve, reject) => {

        let html = [],
            hhScoreData = [];
        let d = moment().subtract(7, 'days').format('YYYYMMDD');

        // scoreData 加上用户id 和 rtx名
        
        //let sql = 'select badjsid, AVG(rate) as rate, AVG(pv) as pv, AVG(badjscount) as badjscount, a.userName from b_quality as q, b_apply as a where q.badjsid=a.id and q.date>20171010 group by q.badjsid;';
        //let sql = 'select q.badjsid, q.rate, q.pv, q.badjscount, a.userName from b_quality as q, b_apply as a where q.badjsid=a.id and q.date>20171010;';
        // 现网
        let sql = 'select q.badjsid, sum(q.pv) as pv, sum(q.badjscount) as badjscount, a.userName, a.name, a.limitpv from b_quality as q, b_apply as a where q.badjsid=a.id and a.status=1 and a.status=1 and a.online=2 and q.pv>a.limitpv and q.date>='+d+' group by q.badjsid;';
        // let sql = 'select q.badjsid, sum(q.pv) as pv, sum(q.badjscount) as badjscount, a.userName, a.name, a.limitpv from b_quality as q, b_apply as a where q.badjsid=a.id and a.status=1 and a.status=1 and a.online=2 and q.pv>a.limitpv and q.date>=20171124 and q.date<=20171130 group by q.badjsid;';

        db.driver.execQuery(sql, (err, data) => {

            if (err) {
                console.log('获取红黑榜数据时有问题');
                console.error(err);
                return;
            }

            let hhScoreByRtx = {};

            data.forEach(item => {
                item.score = getBaseScore.handleScore(item.pv, item.badjscount) - 0;

                //console.log(JSON.stringify(item));

                if (item.score == 100) {
                    item.hhScore = 1;
                } else if (item.score >= 80) {
                    item.hhScore = -1;
                } else if (item .score >= 50) {
                    item.hhScore = -2;
                } else {
                    item.hhScore = -3;
                }

                if (!hhScoreByRtx[item.userName]) {
                    hhScoreByRtx[item.userName] = [];
                }

                hhScoreByRtx[item.userName].push(item);
            });

            console.log(hhScoreByRtx);

            for(let i in hhScoreByRtx) {

                let item = {
                    plusScore: 0,
                    cutScore: 0
                };
                item.userName = i;
                hhScoreByRtx[i].forEach(score_item => {

                    if (score_item.hhScore=== 1) {
                        item.plusScore += 1;
                        if (item.plusScore > 5) {
                            item.plusScore = 5
                        }
                        
                    } else {
                        item.cutScore += score_item.hhScore;
                        if (item.cutScore < -5) {
                            item.cutScore = -5;
                        }

                    }
                    item.detail = hhScoreByRtx[i];
                })
                hhScoreData.push(item);
            }

            hhScoreData.sort((a, b) => {
                if (a.cutScore < b.cutScore) {
                    return -1;
                } else if (a.cutScore > b.cutScore) {
                    return 1;
                } else {
                    return 0;
                }
            })

            resolve(_render(hhScoreData));

        })

    })


}


function _render(data) {

    let html = [];

    html.push();
    html.push('<style>td,th {border-bottom: 1px solid #b7a2a2;border-right: 1px solid #b7a2a2; padding: 2px 2px;} table {border-top: 1px solid black;border-left: 1px solid black;} </style>')
    html.push('<h4>最近7天红黑榜加减分</h4>')
    html.push('<table border="1" cellspacing="0" cellpadding="0"><tr><th>rtx</th><th>加分</th><th>减分</th><td>badjs id</td><th>项目名称</th><th>总pv</th><th>总badjs</th><th>错误率</th><th>评分</th><th>加减分</th></tr>');
    data.forEach(item => {

        item.detail.forEach((detail_item, n) => {

            let rate = ((detail_item.badjscount / detail_item.pv) * 100).toFixed(2) + '%';

            html.push('<tr>');

            if (n == 0) {
                html.push(`<td rowspan="${item.detail.length}">${item.userName}</td>`);
                html.push(`<td rowspan="${item.detail.length}">${item.plusScore}</td>`);
                html.push(`<td rowspan="${item.detail.length}">${item.cutScore}</td>`);
            }

            html.push(`<td>${detail_item.badjsid}</td>`);
            html.push(`<td>${detail_item.name}</td>`);
            html.push(`<td>${detail_item.pv}</td>`);
            html.push(`<td>${detail_item.badjscount}</td>`);
            html.push(`<td>${rate}</td>`);
            html.push(`<td>${detail_item.score}</td>`);
            html.push(`<td>${detail_item.hhScore}</td>`);
            html.push('</tr>');
        })


    })
    html.push('</table>');
	html.push('<p>红黑榜加减分规则</p> <div>100 > badjs评分 > 80 ：-1分</div> <div>80 > badjs评分 > 50 ：-2分</div> <div>50 > badjs评分 ：-3分</div> <div>每人当月最多扣 5分</div> <div>badjs评分 == 100 业务负责人 ： 每个业务 +1分</div> <div>每人当月最多 + 5 分</div>');
    return html.join('');
}

function test() {
    const orm = require('orm');
    var mysqlUrl  = 'mysql://root:root@localhost:3306/badjs';
    var mdb = orm.connect(mysqlUrl, function(err, db){
        getScore(db).then((data) => {
            console.log(data);
        })
    })

}   

//test();


module.exports = getScore
