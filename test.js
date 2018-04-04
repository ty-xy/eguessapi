// const crypto = require('crypto');

// const o = {
//     url: 'https://www.13cai.com.cn/answerDetail',
//     timestamp: '1522119290',
//     nonceStr: 'gfciiehgicaiadik',
//     jsapi_ticket: 'HoagFKDcsGMVCIY2vOjf9vPRiIU1sTnv7PkGoMHYZzywPj4VjiiYWrOB5pZxKhONJf7sQ2eHRUV7mdlXmTaNJQ',
// }

// var s = "jsapi_ticket=" + o.jsapi_ticket + "&noncestr=" + o.nonceStr + "&timestamp=" + o.timestamp + "&url=" + o.url;  
// function hex_sha1(str) {
//     var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
//     sha1.update(str, 'utf-8');
//     var res = sha1.digest().toString("hex");  //加密后的值d
//     return res;
// }

// console.log(hex_sha1(s));

var request = require('request-promise');
var qs = require('querystring');

const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'r2KefkWVOTTNI3FlAmIPFBpL',
    'client_secret': 'HFGCkkQieK0kvrAwiLRqfFuUgtSdCEM6'
});

request('https://aip.baidubce.com/oauth/2.0/token?' + param).then((res) => {
    console.log('res', res);

});
