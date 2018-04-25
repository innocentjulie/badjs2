

// 注册路由 和 处理请求函数

const path = require('path');
const api = require(global.apiPath);



function handlerFeflow(req, res, next) {

    api.registApply(req.query).
    then(data => {
        
        res.json(data);
    }).catch(e => {
        res.json(e);
    })


}

module.exports = {
    route: [{
        path: 'feflow',
        handle: handlerFeflow
    }]
}

