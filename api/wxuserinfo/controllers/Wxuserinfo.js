'use strict';

const model = 'wxuserinfo';

/**
 * A set of functions called "actions" for `Wxuserinfo`
 */

module.exports = {

  /**
   * Get Wxuserinfo entries.
   *
   * @return {Object|Array}
   */

  find: function * () {
    this.model = model;
    try {
      const isOpen =false;
      let entry,wxId;
      let userId;  
  
        const  query  = this.query;
        // 检查是否有openid
        if(query.openid){
            entry = yield Wxuserinfo.findOne({openid:query.openid})
            if(entry === undefined){
                const updataUser={
                    username:query.nickName,
                    avatarUrl:query.avatarUrl,
                    email:`zg-ty@1${Math.ceil(Math.random()*10000)}3.com`,
                }
                //没有openid的时候创建一个新的user表
                let  users = yield User.create(updataUser)
                if(users){
                    const updateData = {
                        ...query,
                        wxUser:users.id
                    }
                    wxId = yield Wxuserinfo.create(updateData)
                    if(wxId){
                        const updataUsers ={
                            username:`zg-ty@1${Math.ceil(Math.random()*10000)}3.com`,
                            email:`zg-ty@1${Math.ceil(Math.random()*10000)}3.com`,
                            wxUserInfo:wxId.id,
                        }
                        let userUpdate = yield User.update({id:users.id},{...updataUsers})
                    }
                }
                this.body = users.wxUser;
            }else{
                const users =yield Wxuserinfo.update({id:entry.id},{query})
                console.log("users",users,users.wxUser)
                this.body = users[0].wxUser;
            }
        }else{
            let entry = yield strapi.hooks.blueprints.find(this);
            this.body = entry;
        }
      
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Get a specific Wxuserinfo.
   *
   * @return {Object|Array}
   */

  findOne: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.findOne(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Create a Wxuserinfo entry.
   *
   * @return {Object}
   */

  create: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.create(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Update a Wxuserinfo entry.
   *
   * @return {Object}
   */

  update: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.update(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Destroy a Wxuserinfo entry.
   *
   * @return {Object}
   */

  destroy: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.destroy(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Add an entry to a specific Wxuserinfo.
   *
   * @return {Object}
   */

  add: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.add(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Remove a specific entry from a specific Wxuserinfo.
   *
   * @return {Object}
   */

  remove: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.remove(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  }
};
