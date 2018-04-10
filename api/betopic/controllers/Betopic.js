'use strict';
const _find = require('../../../utils/query');
const model = 'betopic';

/**
 * A set of functions called "actions" for `Betopic`
 */

module.exports = {

  /**
   * Get Betopic entries.
   *
   * @return {Object|Array}
   */

  find: function * () {
    this.model = model;
    try {
      let entry = yield _find(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Get a specific Betopic.
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
   * Create a Betopic entry.
   *
   * @return {Object}
   */

  create: function * () {
    this.model = model;
    const { title, type } = this.request.body;
    try {
      let entry = {};
      if (type === "comfirm") {
        entry = yield strapi.hooks.blueprints.create(this);
      } else {
        const findTopic = yield Betopic.findOne({ title });
        if (!findTopic) {
          entry = yield strapi.hooks.blueprints.create(this);
        } else {
          entry = {
            message: "改话题已经存在",
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
   * Update a Betopic entry.
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
   * Destroy a Betopic entry.
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
   * Add an entry to a specific Betopic.
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
   * Remove a specific entry from a specific Betopic.
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
