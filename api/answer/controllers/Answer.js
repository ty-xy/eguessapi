'use strict';
const findAnswer = require('../../../utils/query');

const model = 'answer';

/**
 * A set of functions called "actions" for `Answer`
 */

module.exports = {

  /**
   * Get Answer entries.
   *
   * @return {Object|Array}
   */
  
find: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.find(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },
findAnswer: function * () {
    const query = this.query;
    // console.log("query",query)
    // const userid =  this.request.query.userid;
    let arr = [] 
    if(query){
        // this._query = {};
        this.model = model;
        let entry = yield findAnswer(this);
        // console.log(entry,"entryfadfafas")
        if(entry){
            entry.forEach((i)=>{
                if(i.topic !== undefined) 
                 arr.push(i.topic)
           })
           this.body = arr;
           console.log("this.body",arr)
        }else {
            this.body = ""
        }
      
    }

},
rank:  function* (){
   this.model = model;
   try {
    let entry = yield strapi.hooks.blueprints.find(this);
    let createdBys = [];
    // let entryU = yield _find(this)
     if(entry){
       
        let _obj = {};
        for (let i = 0; i < entry.length; i++) {
          if (!_obj[entry[i].createdBy.id]) {
              entry[i].createdBy.upVotes = entry[i].upVotes.length;
              _obj[entry[i].createdBy.id] = entry[i].createdBy;
          } else {
              _obj[entry[i].createdBy.id].upVotes += entry[i].upVotes.length;
          }
        }
        for (let item in _obj) {
          createdBys.push(_obj[item]);
        }
        createdBys = createdBys.sort((x, y) => (y.upVotes - x.upVotes));
       
    }
    this.body = createdBys
   } catch (err) {
    this.body = err;
   }
},
_find: function * () {
    this.model = model;
    let arr = [];
    const that = this;
    let isUser = false;
    const userid =  this.request.query.userid;
    if(!this.request.query.search && userid){
        this._query = {};
        let entry = yield findAnswer(this);
        if(entry){
            (entry).forEach((i,index)=>{
               
                if(i.stars&&i.stars.length>0){
                   i.stars.forEach((item)=>{
                       if(item.id === userid){
                        isUser = true
                        arr.push(i)
                       }
                   })
                }
            })
            if(isUser){
                that.body = arr
            }else{
               that.body =""
            }
        }
    } else if (this.request.query.search && this.request.query.userid) {
        const { userid } = this.request.query;
        this.model = model;
        let enrty = yield findAnswer(this);
        let entryData = [];
        for (let i = 0; i < enrty.length; i++) {
            let res = enrty[i].upVotes.filter((item) => (item.id === userid));
            let shoucang = enrty[i].stars.filter((item) => (item.id === userid));
            if (res.length) {
                enrty[i].upVote = true;
            } else {
                enrty[i].upVote = false;
            }
            if (shoucang.length) {
                enrty[i].isStar = true;
            } else {
                enrty[i].isStar = false;
            }
            entryData.push(enrty[i]);
        }
        this.body = entryData;
    } else {
        let entry = yield strapi.hooks.blueprints.find(this);
        this.body = entry;
    }
},



  /**
   * Get a specific Answer.
   *
   * @return {Object|Array}
   */
  //
 

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
   * Create a Answer entry.
   *
   * @return {Object}
   */

  create: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.create(this);
      if (entry.id) {
        const { messageNum } = entry.topic;
        entry.topic.messageNum = messageNum + 1;
        let topic = yield Topic.update({id: entry.topic.id}, { ...entry.topic });
      }
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Update a Answer entry.
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
   * Destroy a Answer entry.
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
   * Add an entry to a specific Answer.
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
   * Remove a specific entry from a specific Answer.
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
  },
    // 好友排行榜
    answerRank: function * () {
        this.model = model;
        try {
            let entry = yield strapi.hooks.blueprints.find(this);
            const { allFriendIds } = this.query;
            let createdBys = [];
            let _obj = {};
            for (let i = 0; i < entry.length; i++) {
                if (entry[i].createdBy && (allFriendIds.indexOf(entry[i].createdBy.id) > -1)) {
                    if (!_obj[entry[i].createdBy.id]) {
                        entry[i].createdBy.upVotes = entry[i].upVotes.length;
                        _obj[entry[i].createdBy.id] = entry[i].createdBy;
                    } else {
                        _obj[entry[i].createdBy.id].upVotes += entry[i].upVotes.length;
                    }
                }
            }
    
            for (let item in _obj) {
                createdBys.push(_obj[item]);
            }
            createdBys = createdBys.sort((x, y) => (y.upVotes - x.upVotes));
            this.body = { createdBys, _obj };
        } catch (err) {
            this.body = err;
        }
    },
    // 单场排行榜
    singleRank: function * () {
        this.model = model;
        const { topicid } = this.query;
        try {
            let data = yield strapi.hooks.blueprints.find(this);
            let entry = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].topic.id === topicid) {
                    data[i].upVoteLen = data[i].upVotes.length;
                    data[i].upVotes = [];
                    entry.push(data[i]);
                }
            }
            entry = entry.sort((x, y) => (y.upVoteLen - x.upVoteLen));
            this.body = entry;
        } catch (error) {
            this.body = error;
        }
    }
};
