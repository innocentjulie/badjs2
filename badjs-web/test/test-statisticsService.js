/**
 * Created by chriscai on 2015/1/12.
 */

var http = require('http');
var url = "http://127.0.0.1:9009/errorMsgTop";

http.get(url + '?id=2&startDate=1514390400000', function(res) {
    var buffer = '';
    res.on('data', function(chunk) {
	buffer += chunk.toString();
    }).on('end', function() {
	var saveModel = {};
	    //replace emoji to empty , mysql unsupported emoji code
	    console.log(buffer);
	    buffer=buffer.replace(/\ud83d[\udc00-\udfff]/gi , "")
	    var result = JSON.parse(buffer);
    });

}).on('error', function(err) {
    console.error('error :' + err);
});
