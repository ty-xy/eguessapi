const qs = require('querystring');
const request = require('request-promise');
const fs = require('fs');
const { spam, labels } = require('../utils/notice_info');

const access_end = {};

const params = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'r2KefkWVOTTNI3FlAmIPFBpL',
    'client_secret': 'HFGCkkQieK0kvrAwiLRqfFuUgtSdCEM6'
});
function Baidu() {
    console.log('Baidu');
    this.appid = "10882719";
    this.hostname = "https://aip.baidubce.com";
    // 保存token
    this.savaToken = function * (token) {
        fs.writeFileSync('access_token_baidu.txt', JSON.stringify(token));
    }
    // 读取token
    this.readToken = function *() {
        return fs.readFileSync('access_token_baidu.txt', 'utf-8');
    }
}

Baidu.prototype = {
    // 获取token
    getAccessToken: function * () {
        const token = {};
        let access_token = yield request(this.hostname + '/oauth/2.0/token?' + params);
        access_token = JSON.parse(access_token);
        token.access_token = access_token.access_token;
        token.refresh_token = access_token.refresh_token;
        token.expires_in = Date.now() + (access_token.expires_in - 60*60) * 1000; 
        yield this.savaToken(token);
        return token;
    },
    isValid (accessToken, expireTime) {
        return !!accessToken && Date.now() / 1000 < expireTime
    },
    // 获取最终正确的token
    ensureAccessToken: function * () {
        let readToken = {};
        try {
            readToken = yield this.readToken();
        } catch (error) {
            readToken = yield this.getAccessToken();
            return readToken;
        }
        readToken = JSON.parse(readToken);
        if (readToken && this.isValid(readToken.access_token, readToken.expires_in)) {
            return readToken;
        }
        yield this.getAccessToken();
    },
    // 校验文本
    validate: function * (content) {
        const { access_token } = yield this.ensureAccessToken();
        console.log('access_token', access_token);
        const params = {
            access_token,
            command_no: '500071',
            content
        };
        const req = {
            uri: this.hostname + '/rest/2.0/antispam/v1/spam',
            method: 'POST',
            body: qs.stringify(params),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        }
        let validate_res = yield request(req);
        validate_res = JSON.parse(validate_res);
        const { errno, result } = validate_res;
        let res = {
            code: 0,
            word: '',
            hit: '',
            spam: '',
            erro_code: ''
        };
        if (!errno) {
            res.spam = spam[result.spam];
            switch (result.spam) {
                case 0:
                    break;
                case 1:
                    res.code = 505;
                    const words = result.labels.map((item) => (labels[item]));
                    res.word = words.join('、');
                    res.hit = result.hit.join('、');
                    res.erro_code = '提交含有敏感词， 请检查提交文本';
                    break;
                case 2:
                    res.code = 505;
                    const _words = result.labels.map((item) => (labels[item]));
                    res.word = _words.join('、');
                    res.hit = result.hit.join('、');
                    res.erro_code = '提交含有敏感词， 请检查提交文本';
                    break;
                default:
                    break;
            }
        } else {
            res.code = 400;
        }
        return res;
    }
};


module.exports = Baidu;