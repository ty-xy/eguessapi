'use strict';
const qs = require('querystring');
const _find = require('../../../utils/query');
const model = 'topic';

/**
 * A set of functions called "actions" for `Topic`
 */

module.exports = {

  /**
   * Get Topic entries.
   *
   * @return {Object|Array}
   */

  find: function * () {
    this.model = model;
    try {
        this.model = model;
        let date = new Date();
        let day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' 23:59:59';
        let timestamp = new Date().getTime();
        this.request.query.search = JSON.stringify({time: { '$lte': timestamp }, ...this.request.query.search}); 
        let data = yield _find(this);
        let countDown = 0;
        if (data[0] && data[0].time) {
            countDown = (data[0].time + 120 * 60 * 1000) - Date.now();
        }
        console.log('countDown', data[0].time + 120 * 60 * 1000, Date.now(), countDown)
        data.forEach((item) => {
            const time = (item.time + 120 * 60 * 1000) - Date.now();
            if(time > 0) {
                item.second = time;
            } else {
                item.second = 0;
                item.status = 2;
            }
        });
        const res = {
            list: data,
            countDown,
        };
        this.body = res;
        
    } catch (err) {
        this.body = err;
    }
  },
  findTopic: function * () {
        this.model = model;
        let isUser = false;
        let arr  = [];
        const {userid} = this.query
        let entry = yield strapi.hooks.blueprints.find(this);
        console.log('findTopic', entry);
        if(entry){
            (entry||[]).forEach((i,index)=>{
                if(i.stars&&i.stars.length>0){
                    i.stars.forEach((item)=>{
                        if(item.id === userid){
                            isUser = true
                            arr.push(i) 
                        }
                    })
                }
            })
            if(!isUser){
                arr = ""
            }
            this.body = arr;
        }
    },
    dayTopic: function * () {
        this.model = model;
        // let date = new Date();
        // let day = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' 23:59:59';
        // let timestamp = new Date(day).getTime();
        // console.log('timestamp', timestamp);
        // this.request.query.search = JSON.stringify({time: { '$lte': timestamp }}); 
        // let data = yield _find(this);
        // data.forEach((item) => {
        //     const time = (item.time + 60 * 60 * 1000) - Date.now();
        //     if(time > 0) {
        //         item.second = time / 1000;
        //     } else {
        //         item.second = 0;
        //         item.status = 3;
        //     }
        // });
        this.body = [];
    },
  /**
   * Get a specific Topic.
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
   * Create a Topic entry.
   *
   * @return {Object}
   */

  create: function * () {
    this.model = model;
    console.log("this.query", this.query)
    try {
      let entry = yield strapi.hooks.blueprints.create(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Update a Topic entry.
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
   * Destroy a Topic entry.
   *
   * @return {Object}
   */

  destroy: function * () {
    this.model = model;
    try {
    //   console.log(this.query,"this.query412341234")
      let entry = yield strapi.hooks.blueprints.destroy(this);
    //   this.body = ""
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Add an entry to a specific Topic.
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
   * Remove a specific entry from a specific Topic.
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
