var log4js = require('log4js'),
    logger = log4js.getLogger();

var path = require("path");



var argv = process.argv.slice(2);
if(argv.indexOf('--project') >= 0){
    global.pjconfig =  require(path.join(__dirname , 'project.debug.json'));
}else {
    global.pjconfig = require(path.join(__dirname , 'project.json'));
}

if(argv.indexOf('--debug') >= 0){
    logger.setLevel('DEBUG');
    global.debug = true;
}else {
    logger.setLevel('INFO');
}


global.MONGODB = global.pjconfig.mongodb;
var dispatcher = require(global.pjconfig.acceptor.module)
  , save = require('./storage/MongodbStorage');


// use zmq to dispatch
dispatcher()
  .pipe(save());


logger.info('start badjs-storage success.');

setTimeout(function (){
    require('./service/query')();
    require('./service/autoClear')();
},1000);
