'use strict';
const qs = require('querystring');
const _find = require('../../../utils/query');
const model = 'topic';

const Baidu = require('../../../utils/baidu');

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
        let timestamp = new Date().getTime();
        this.request.query.search = JSON.stringify({time: { '$lte': timestamp }, ...this.request.query.search}); 
        let data = yield _find(this);
        let countDown = 0;
        if (data[0] && data[0].time) {
            countDown = (data[0].time + 60 * 60 * 1000) - Date.now();
        }
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
        const {userid, pages} = this.query
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
                arr = [];
            }
            this.body = arr.slice(0, pages);
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
  findBeTopics: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.find(this);
      entry.forEach((item) => {
        const time = (item.time + 120 * 60 * 1000) - Date.now();
        if(time > 0) {
            item.second = time;
        } else if(time >120 * 60 * 1000){
            item.status = 0;
        }else {
            item.second = 0;
            item.status = 2;
        }
    });
    //   console.log(entry,"entry")
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },
  findOne: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.findOne(this) || {};
      if (entry && entry.time) {
        const time = (entry.time + 120 * 60 * 1000) - Date.now();
        if(time > 0) {
          entry.second = time;
        } else {
          entry.second = 0;
          entry.status = 2;
        }
      } else {
        entry.second = 0;
      }
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
    const { title, type } = this.request.body;
    try {
      let entry = {};
      if (type === "confirm") {
        entry = yield strapi.hooks.blueprints.create(this);
      } else {
        const findTopic = yield Topic.findOne({ title });
        if (!findTopic) {
          entry = yield strapi.hooks.blueprints.create(this);
        } else {
          entry = {
            message: "该话题已经存在",
            data: findTopic,
          };
          this.status = 503;
        }
      }
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
