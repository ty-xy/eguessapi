'use strict';
const request = require('request-promise');
const _find = require('../../../utils/query');
const Baidu = require('../../../utils/baidu');

const model = 'comment';

/**
 * A set of functions called "actions" for `Comment`
 */

module.exports = {

  /**
   * Get Comment entries.
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
  _find: function * () {
    this.model = model;
    let enrty = yield _find(this);
    this.body = enrty;
  },
  /**
   * Get a specific Comment.
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
   * Create a Comment entry.
   *
   * @return {Object}
   */

  create: function * () {
    this.model = model;
    try {
        let entry = [];
        const baidu = new Baidu();
        const { body } = this.request.body;
        const token_baidu = yield baidu.validate(body);
        if (token_baidu.code !== 200) {
            this.status = 505;
            entry = token_baidu;
        } else {
            entry = yield strapi.hooks.blueprints.create(this);
        }
        this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Update a Comment entry.
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
   * Destroy a Comment entry.
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
   * Add an entry to a specific Comment.
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
   * Remove a specific entry from a specific Comment.
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
  // // 提交反馈
  // feedback: function * () {
  //   this.model = 'feedback';
  //   try {
  //     let entry = yield Feedback.create(this);
  //     this.body = entry;
  //   } catch (err) {
  //     this.body = err;
  //   }
  // }
};
