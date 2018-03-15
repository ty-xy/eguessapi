'use strict';
const _find = require('../../../utils/query');
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
    const userid =  this.request.query.userid;
    let arr = [] 
    if(query){
        this._query = {createdBy:userid};
        this.model = model;
        this.select= ['topic'];
        let entry = yield findAnswer(this);
        console.log(entry)
        if(entry){
            entry.forEach((i)=>{
                arr.push(i.topic)
           })
           this.body = arr;
        }else {
            this.body = ""
        }
      
    }

},
_find: function * () {
    this.model = model;
    let arr = [];
    let isUser = false;
    const userid =  this.request.query.userid;
    if(!this.query.topicid){
        this._query = {};
        let entry = yield findAnswer(this);
        if(entry){
            (entry).forEach((i,index)=>{
               //  console.log (i.stars.id,"i.id")
                if(i.stars&&i.stars.length>0){
                   i.stars.forEach((item)=>{
                       if(item.id === userid)
                         isUser = true
                         arr.push(i)
                   })
                }
            })
            console.log("arr",arr)
            if(isUser){
                this.body = arr
            }else{
               this.body =""
            }
        }

    } else {
        const { topicid, userid } = this.request.query;
        this._query = {topic: topicid};
        this.model = model;
        let enrty = yield findAnswer(this);
        // console.log('enrty', this.request.query, enrty)
        let entryData = [];
        for (let i = 0; i < enrty.length; i++) {
            let res = enrty[i].upVotes.filter((item) => (item.id === userid));
            let shoucang = enrty[i].stars.filter((item) => (item.id === userid));
            if (res.length) {
                enrty[i].upVote = true;
            }
            if (shoucang.length) {
                enrty[i].isStar = true;
            }
            entryData.push(enrty[i]);
        }
        this.body = entryData;
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
  }
};
