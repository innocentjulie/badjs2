var pv = require('./handle_pv_2.js');
const orm = require('orm');


var pjconfig = require('../project.json');

var mysqlUrl  = pjconfig.mysql.url;

var mdb = orm.connect(mysqlUrl, function(err, db){

    var Score = db.define('b_score',  {
        id: Number,
        badjsid: Number, 
        score: String,
        date : Number
    });
    console.log(pv.getImg)
    pv.getImg(Score, db, function() {
        mdb.close();
        });
})


