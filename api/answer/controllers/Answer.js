'use strict';
const _find = require('../../../utils/query');
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
    //   let entry = yield strapi.hooks.blueprints.find(this);
      console.log('query', this.req._parsedUrl.query)
      const { query } = this.req._parsedUrl;
      let entry = null;
      if (query) {
        entry = yield Answer.find({ topic: query.split("=")[1]});
      } else {
        entry = yield Answer.find();
      }
      this.body = yield strapi.hooks.blueprints.find(this);
    } catch (err) {
      this.body = err;
    }
  },
findAnswer: function * () {
    // console.log('this.query', this.query)
    this.model = model;
    let entry = yield strapi.hooks.blueprints.find(this);
    // let entrys =  yield Answer._find(this.query)
    // console.log(this)
    console.log(entry,"entrys",entrys)
    const query = this.query;
    let arr = []
    if(query){
        let answer  = entry.createdBy
        console.log("answer.id",entry.createdBy)
        if(answer&&answer.length>0&& answer.id === query.userid){
            arr.push(entry.topic)
            this.body = arr;
        } else {
            this.body = "";
        }
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
