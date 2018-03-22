'use strict';

const request = require('request');
const qs = require('querystring');

const config = require('../wxconfig');

const prefix = 'https://open.weixin.qq.com/';

module.exports = {
    // 第一步：用户同意授权，获取code
    login: function * () {
        try {
            const router = 'get_wxtoken';
            // 这是编码后的地址
            const return_uri = config.prod.redirect_uri + router;
            // 获取code参数
            const code_params = {
                appid: config.prod.appid,
                redirect_uri: return_uri,
                response_type: 'code',
                scope: 'snsapi_userinfo',
                state: '12',
            };
            this.status = 302;
            this.redirect(`${prefix}sns/oauth2/access_token?${qs.stringify(code_params)}#wechat_redirect`);
        } catch (err) {
            this.body = err;
        }
    },
    // 第二步：通过code换取网页授权access_token
    getToken: function * () {
        try {
            console.log('this.query.code', this.query.code)
            const token_params = {
                appid: config.dev.appid,
                secret: config.dev.appsecret,
                grant_type: 'authorization_code',
                code: this.query.code,
            };
            console.log('qs', prefix + 'sns/oauth2/access_token?' + qs.stringify(token_params));
            let data = {};
            request.get({ url: prefix + 'sns/oauth2/access_token?' + qs.stringify(token_params)}, function(error, response, body) {
                console.log('response', response.statusCode)
                if (response.statusCode == 200) {
                    // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                    console.log('body', body);
                    data = (body && JSON.parse(body)) || { info: false };
                    const access_token = data.access_token;
                    const openid = data.openid;
                    console.log('data', data)
                    request.get(
                        {
                            url: prefix + 'sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',
                        },
                        function(error, response, body){
                            if(response.statusCode == 200){
                                // 第四步：根据获取的用户信息进行对应操作
                                const userinfo = JSON.parse(body);
                                console.log('获取微信信息成功！');
                                // 小测试，实际应用中，可以由此创建一个帐户
                                res.send("\
                                    <h1>"+userinfo.nickname+" 的个人信息</h1>\
                                    <p><img src='"+userinfo.headimgurl+"' /></p>\
                                    <p>"+userinfo.city+"，"+userinfo.province+"，"+userinfo.country+"</p>\
                                ");
    
                            }else{
                                console.log(response.statusCode);
                            }
                        }
                    );
                }
            });
            this.body = data;
        } catch (error) {
            this.body = error;
        }
    }
}