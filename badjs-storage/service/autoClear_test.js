/**
 * Created by chriscai on 2014/10/14.
 */

var MongoClient = require('mongodb').MongoClient;

var log4js = require('log4js'),
    logger = log4js.getLogger();


var url = "mongodb://localhost:27018/badjs";

var mongoDB;
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    if(err){
        logger.error("failed connect to mongodb");
    }else {
        logger.info("Connected correctly to mongodb");
    }
    mongoDB = db;

    autoClearStart();
});


var maxAge = 7;


// 5 天前的数据
var beforeDate = 1000 * 60 * 60 *24 *  maxAge ;

var autoClearStart = function (){
    logger.info('start auto clear data before '+ beforeDate +' and after 7d will clear again');

    mongoDB.collections(function (error,collections){

        //console.log(collections);
        var _d = (new Date - beforeDate);
        console.log(_d);

        collections.forEach(item => {

            logger.info("start clear " + item.s.name);
            item.deleteMany({ date : { $lt : _d}}, (err, result) => {
                    if(err){
                        logger.info("clear error " +  err);
                    }else {
                        logger.info(`delete count: ${result.deletedCount}`);

                    }

            })
       })

    })

}





