
'use strict';
const path = require('path')
const nodemailer = require('nodemailer');
const Promise = require('bluebird')
const log4js = require('log4js');
const logger = log4js.getLogger();
global.pjconfig = require(path.join(__dirname, '../project.json'))

const emailConf = global.pjconfig.email;



// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'qq',  
  auth: {  
    user: emailConf.ivwebMailuser,  
    pass: emailConf.ivwebMailpass
  }  
});

// setup e-mail data with unicode symbols
let mailOptions = {
    from: '"IVWEB" 2580575484@qq.com', // sender address
};

let mailList = [];

module.exports = (from, to, cc, title, content, attachments) => {

    let  _mailOptions = Object.assign({}, mailOptions);

    _mailOptions.to = to;
    _mailOptions.cc = cc;
    _mailOptions.subject = title;
    _mailOptions.html = content;

    if (attachments) {
        _mailOptions.attachments = attachments;
    }

    // console.log(content);
     // _mailOptions.to = 'xx@x.com';
     // _mailOptions.cc = 'x@x.com';

    console.log(`to: ${to}, cc: ${cc}, subject: ${title}`);


    //sendMail(_mailOptions);
    // 先放到池子中，再每隔一段时间发送，避免触发频率限制，疑似垃圾邮件
    sendMail(_mailOptions);

    // console.log('mailList');
    // console.log(mailList)

}



function sendMail(maildata) {


  console.log('send email ....')
      console.log(maildata);
  return new Promise((resolve, reject) => {
      // send mail with defined transport object
      transporter.sendMail(maildata, function(error, info){
          if(error){
              console.log(error);
              reject(error)
          } else {
            resolve(info)
           logger.info('Message sent: ' + info.response);
          }
      });

  })

}
