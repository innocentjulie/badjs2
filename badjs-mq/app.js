'use strict';

var  log4js = require('log4js'),
     childProcess = require("child_process"),
     http = require('http'),
     logger = log4js.getLogger();

var path = require("path");


var argv = process.argv.slice(2);

if(argv.indexOf('--debug') >= 0){
    logger.setLevel('DEBUG');
}else {
    logger.setLevel('INFO');
}


if(argv.indexOf('--project') >= 0){
    GLOBAL.pjconfig =  require(path.join( __dirname , 'project.debug.json'))
}else {
    GLOBAL.pjconfig =  require(path.join( __dirname ,'project.json'));
}


var mq = require(GLOBAL.pjconfig.mq.module)
    , dispatcher = mq.socket('pub')
    , acceptor = mq.socket('pull')
    , dispatcherPort =  GLOBAL.pjconfig.dispatcher.port
    , dispatcherAddress =   GLOBAL.pjconfig.dispatcher.address
    , acceptorPort =   GLOBAL.pjconfig.acceptor.port
    , acceptorAddress =   GLOBAL.pjconfig.acceptor.address;



acceptor[acceptor.bindSync ? 'bindSync' : 'bind']("tcp://" + acceptorAddress + ":" + acceptorPort);

dispatcher[acceptor.bindSync ? 'bindSync' : 'bind']("tcp://" + dispatcherAddress + ":" + dispatcherPort);

var openApiServer = childProcess.fork(__dirname + '/openApiService.js', argv)

var count = 0;


acceptor.on("message" , function (data){
    count ++;
    logger.debug(data.toString());
    dispatcher.send(data);
})

logger.info("start badjs-mq success. ");

http.createServer((req, res) => {
    res.end(count + '');
    count = 0;
}).listen(2001, () => {
    console.log('report server listen at 2001.');
});

