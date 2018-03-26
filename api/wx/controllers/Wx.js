'use strict';

const request = require('request-promise');
const qs = require('querystring');
const fs = require('fs');
const crypto = require('crypto');

const config = require('../wxconfig');

const prefix = 'https://open.weixin.qq.com/';
const apiprefix = 'https://api.weixin.qq.com/';

function API(code) {
    this.appid = config.prod.appid;
    this.appsecret = config.prod.appsecret;
    this.prefix = 'https://open.weixin.qq.com/';
    this.apiprefix = 'https://api.weixin.qq.com/';
    this.code = code;
    // 保存token
    this.savaToken = function * (token) {
        yield fs.writeFile('access_token.txt', JSON.stringify(token));
    }
    // 读取token
    this.readToken = function * () {
        yield fs.readFile('access_token.txt', 'utf-8');
    }
}

API.prototype = {
    // 获取token
    getAccessToken: function * () {
        const token = {};
        const token_params = {
            appid: this.appid,
            secret: this.appsecret,
            grant_type: 'authorization_code',
            code: this.code,
        };
        let access_token = yield request(this.apiprefix + 'sns/oauth2/access_token?' + qs.stringify(token_params));
        console.log('--->getAccessToken', access_token);
        access_token = JSON.parse(access_token);
        token.access_token = access_token.access_token;
        token.refresh_token = access_token.refresh_token;
        token.expires_in = Date.now() + (access_token.expires_in - 40) * 1000;        
        this.savaToken(token);
        return token;
    },
    isValid: function * (accessToken, refreshToken, expireTime) {
        if (!!accessToken && Date.now() < expireTime) {
            return { access_token, refresh_token, expires_in};
        }
        const refresh = {
            appid: this.appid,
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        };
        const refresh_res = yield request(this.prefix + 'sns/oauth2/refresh_token?' + qs.stringify(refresh));
        const token = {};
        if (refresh_res) {
            token.access_token = refresh_res.data.access_token;
            token.refresh_token = refresh_res.data.refresh_token;
            token.expires_in = Date.now() + (refresh_res.data.expires_in - 40) * 1000;        
            yield this.savaToken(token);
            return token;
        }
        return false;
    },
    // 获取最终正确的token
    ensureAccessToken: function * () {
        console.log('ensureAccessToken');
        let token = yield this.readToken();
        console.log('readToken', token);
        if (!token.access_token) {
            token = yield this.getAccessToken();
            console.log('getAccessToken', token);
        }
        // try {
        //     token = this.readToken();
        //     console.log('readToken', token);
        // } catch (e) {
        //     token = this.getAccessToken();
        //     console.log('getAccessToken', token);
        // }
        console.log('ensureAccessToken-token', token);
        if (token) {
            this.isValid(token.access_token, token.refresh_token, token.expires_in)
        }
        return this.getAccessToken();
    }
};

function hex_sha1(str) {
    var sha1 = crypto.createHash("sha1");//定义加密方式:md5不可逆,此处的md5可以换成任意hash加密的方法名称；
    sha1.update(str);
    var res = sha1.digest("hex");  //加密后的值d
    return res;
}
// 分享逻辑
const Share = {
    // 数据签名   
    create_signature: function(nocestr, ticket, timestamp, url){  
        var signature = "";  
        // 这里参数的顺序要按照 key 值 ASCII 码升序排序  
        var s = "jsapi_ticket=" + ticket + "&noncestr=" + nocestr + "×tamp=" + timestamp + "&url=" + url;  
        return hex_sha1(s);   
    },
    // 自定义创建随机串 自定义个数0 < ? < 32   
    create_noncestr: function () {  
                var str= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";  
                var val = "";  
            for (var i = 0; i < 16; i++) {  
                    val += str.substr(Math.round((Math.random() * 10)), 1);  
                }  
        return val;  
    },
    // 自定义创建时间戳  
    create_timestamp: function () {  
        return new Date().getTime().toString();  
    },
}


module.exports = {
    // 第一步：用户同意授权，获取code
    login: function * () {
        try {
            const router = 'api/v1/get_wxtoken';
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
            console.log('qs.stringify(code_params)', qs.stringify(code_params))
            this.status = 302;
            this.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?' + qs.stringify(code_params) + '#wechat_redirect');
        } catch (err) {
            this.body = err;
        }
    },
    // 第二步：通过code换取网页授权access_token
    getToken: function * () {
        try {
            // console.log('this.query.code', this.query.code)
            // const api = new API(this.query.code);
            // const token = yield api.ensureAccessToken();
            // console.log('getToken', token);
            const token_params = {
                appid: config.prod.appid,
                secret: config.prod.appsecret,
                grant_type: 'authorization_code',
                code: this.query.code,
            };
            let access_token = '';
            let openid = '';
            const that = this;
            let token = yield request(apiprefix + 'sns/oauth2/access_token?' + qs.stringify(token_params));
            token = JSON.parse(token);
            console.log('获取token', token)
            if (!token.errcode) {
                access_token = token.access_token;
                openid = token.openid;
                // 第三步：拉取用户信息(需scope为 snsapi_userinfo)
                let userinfo = yield request(apiprefix + 'sns/userinfo?access_token='+ access_token +'&openid='+ openid +'&lang=zh_CN');
                userinfo = JSON.parse(userinfo);
                console.log('拉取用户信息', userinfo)
                if (!userinfo.errcode) {
                    // 更新用户信息
                    const option = {
                        openid: openid,
                        ...userinfo,
                        nickName: userinfo.nickname,
                        avatarUrl: userinfo.headimgurl,
                        gender: userinfo.sex,
                    }
                    // 更新user表
                    console.log('更新user表', option)
                    const wxuserinfo = yield request(`https://www.13cai.com.cn/api/v1/wxuserinfo?${qs.stringify(option)}`);
                    console.log('更新user表结果', wxuserinfo, 'ff', qs.stringify(wxuserinfo))
                    let info = JSON.stringify(wxuserinfo);
                    console.log('info1', info)
                    let infos = JSON.parse(info);
                    console.log('infos', infos)
                    this.status = 302;
                    this.redirect('https://www.13cai.com.cn?info=456789');
                } else {
                    this.body = '未知错误，请退出重试';
                }
            } else {
                this.body = '未知错误，请退出重试';
            }
        } catch (error) {
            this.body = error;
        }
    },
    wechat_share: function * () {
        let timestamp = '';
        let signature = '';
        const wxuserinfo = yield request("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + config.prod.appid + "&secret=" + config.prod.appsecret);
        let data = JSON.parse(wxuserinfo);
        console.log('wxuserinfo', data, data.access_token);
        const { url } = this.query;
        let jsapi_ticket = '';
        if (data.access_token) {
            jsapi_ticket = yield request("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + data.access_token + "&type=jsapi");
            jsapi_ticket = JSON.parse(jsapi_ticket);
            if (jsapi_ticket.errcode == 0) {
                signature = jsapi_ticket.ticket;
            }
        }
        // const share = new Share();
        const body = {
            appId: config.prod.appid,
            timestamp: Share.create_timestamp(),
            nonceStr: Share.create_noncestr(),
            signature: Share.create_signature(Share.create_noncestr(), signature, Share.create_timestamp(), url),
        };
        console.log('body', body)
        this.body = body;
    }
}