'use strict';
var moment = require('moment');
var Promise = require('bluebird');

/**
 */
function getLogData(db) {

    return new Promise((resolve, reject) => {

        let html = [];
        let d = moment().subtract(7, 'days').format('YYYYMMDD');

        let sql = `select * from b_log_data where date>=${d};`;

        db.driver.execQuery(sql, (err, data) => {

            if (err) {
                console.log(`获取log data 错误`);
                console.error(err);
                return;
            }

            resolve(_render(data));
        })
    })
}


function _render(data) {
    let html = [];
    html.push();
    html.push(`<h4>最近7天数据上报量</h4>`)
    html.push(`<table border="1" cellspacing="0" cellpadding="0"><tr><th>日期</th><th>上报量</th></tr>`);
    data.forEach(item => {
        html.push(`<tr>`);
        html.push(`<td>${item.date}</td>`);
        html.push(`<td>${item.logpv}</td>`);
        html.push(`</tr>`);
    })
    html.push(`</table>`);
    return html.join('');
}

function test() {
    const orm = require('orm');
    var mysqlUrl  = `mysql://root:root@localhost:3306/badjs`;
    var mdb = orm.connect(mysqlUrl, function(err, db){
        getLogData(db).then((data) => {
            console.log(data);
        })
    })

}   

//test();
module.exports = getLogData
