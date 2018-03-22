'use strict';

const request = require('request-promise');
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
            let data = {};
            let access_token = '';
            let openid = '';
            const that = this;
            let token = yield request(prefix + 'sns/oauth2/access_token?' + qs.stringify(token_params));
            console.log('response', token)
            if ((token && token.statusCode) == 200) {
                data = token.body && JSON.parse(token.body);
                access_token = data.access_token;
                openid = data.openid;
                console.log('data', data)
            }
            // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
            let userinfo = yield request(prefix + 'sns/userinfo?access_token='+access_token+'&openid='+openid+'&lang=zh_CN',);
            console.log('userinfo', userinfo)
            if ((userinfo && userinfo.statusCode) != 200) {
                // 更新用户信息
                this.sttaus = 301;
                this.redirect('https://www.13cai.com.cn');
                console.log('用户信息', userinfo.response)
            }
            this.body = data;
        } catch (error) {
            this.body = error;
        }
    }
}