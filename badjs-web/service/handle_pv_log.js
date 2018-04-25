
const fs = require('fs');
const readline = require('readline');
const orm = require('orm');

console.log(process.argv);
var filePath = process.argv[2];
var date = process.argv[3]
var pv = {}, logdata = [], badjsid, logpv = 0;

var pjconfig = require('../project.json');

var mysqlUrl  = pjconfig.mysql.url;

var getYesterday = function() {
    var date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    return date;
};



const rs = fs.createReadStream(filePath, 'utf8');

const rl  = readline.createInterface({
    input: rs,
    output: null // process.stdout
});

rl.on('line', (input) => {
    logpv ++;
})


rl.on('close', () => {
    console.log('文件读完了。')

	logdata.push({
	    logpv: logpv,
	    date: date -0
	})

    console.log(logdata);

    var mdb = orm.connect(mysqlUrl, function(err, db){

		//createScore(db, logdata);
		//return;
        var pv = db.define("b_log_data", {
            id          : Number,
            logpv          : Number,
            date          : Number
        });


        pv.create(logdata, function(err, items) {

            if (!err) {
                console.log('ok')

            } else {
                console.log(err);
            }

            mdb.close();
        })

    });
})


