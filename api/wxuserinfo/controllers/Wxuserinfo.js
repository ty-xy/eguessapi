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
    //   let query = this.req._parsedUrl.query;
      const isOpen =false;
      let entry,wxId;
      let userId="";
       
    console.log("32123213123",this.query,"32131231231");
    //   let entrys = yield Wxuserinfo.findOne({openid:this.query.openid})
    //   this.body  = entrys;
    // console.log("this",this,this.body)
        const  query  = this.query;
        if(this.query.openid){
            entry =  yield  Wxuserinfo.findOne({openid:query.openid})
            console.log("12321321321",entry)
        // this.body = entry;
        // console.log("this.body",this.body,this.query.openid)
            if(entry != undefined){
            const updataUser={
                username:query.openid,
                email:`zg-ty@1${Math.ceil(Math.random()*10000)}3.com`,
                }
            let updateData;
            const _userid = yield User.create(updataUser).exec(function (err, users) {
                if (err) {
                    console.log(err);
                }
                console.log("43124124",users);
                userId = users.id;
                const updateData = {
                   ...query,
                    wxUser: users.id,
                };
                
                const dd = Wxuserinfo.create(updateData).exec(function(err,Wxuserinfos){
                    // console.log("updateData",updateData)
                    if(err) {
                        console.log(err)
                    }
                     wxId = Wxuserinfos.id;
                     const updataUsers ={
                        username:`zg-ty@1${Math.ceil(Math.random()*10000)}3.com`,
                        email:`zg-ty@1${Math.ceil(Math.random()*10000)}3.com`,
                        wxUserInfo:wxId
                     }
                     console.log("Wxuserinfos",Wxuserinfos,users.id)
                    User.update({id:users.id},{...updataUsers}).exec((err,ruser)=>{
                         console.log("ruser",ruser)
                    })
                    // //  yield  User.update({id:users.id},{...updataUsers})
                    // const users =  User.findOne({username:entry.openid})
                    // console.log("users",user)
                    // this.body = users.id
                })
                console.log('dd', dd)
            });
            console.log('_userid', _userid)
            }else{
                const updateData = {
                    ...query
                };
                Wxuserinfo.update({id:entry.id},{...updateData}).exec(function(err,wxinfo){
                      console.log("wxinfo",wxinfo[0])
                })
                const user  = yield User.findOne({wxUserInfo:entry.id})
                console.log("user",user)
                this.body = user.id
            }
           
        }
        // console.log("user",userId)
        // this.body = {"penid":"211213123"}
        // console.log("body",this.body)
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
