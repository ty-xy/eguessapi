'use strict';
const _find = require('../../../utils/query');

const model = 'user';

/**
 * A set of functions called "actions" for `user`
 */

module.exports = {

  /**
   * Get user entries.
   *
   * @return {Object|Array}
   */

  find: function * () {
    this.model = model;
    try {
      const entry = yield strapi.hooks.blueprints.find(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * 
   * 
   * Get a specific user.
   *
   * @return {Object|Array}
   */

  findOne: function * () {
    this.model = model;
    try {
      const entry = yield strapi.hooks.blueprints.findOne(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Create a user entry.
   *
   * @return {Object}
   */

  create: function * () {
    this.model = model;
    try {
      const entry = yield strapi.hooks.blueprints.create(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Update a user entry.
   *
   * @return {Object}
   */

  update: function * () {
    this.model = model;
    try {
      const entry = yield strapi.hooks.blueprints.update(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Destroy a user entry.
   *
   * @return {Object}
   */

  destroy: function * () {
    this.model = model;
    try {
      const entry = yield strapi.hooks.blueprints.destroy(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Add an entry to a specific user.
   *
   * @return {Object}
   */

  add: function * () {
    this.model = model;
    try {
      const entry = yield strapi.hooks.blueprints.add(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Remove a specific entry from a specific user.
   *
   * @return {Object}
   */

  remove: function * () {
    this.model = model;
    try {
      const entry = yield strapi.hooks.blueprints.remove(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },
    friend: function * () {
        this.model = model;
        try {
            const entry = yield _find(this);
            const { id } = JSON.parse(this.query.search);
            const friends = entry[0].friends.map((item) => (item.id));
            const beFriends = entry[0].beFriends.map((item) => (item.id));
            const allFriends = entry[0].friends.concat(entry[0].beFriends);
            const allIds = friends.concat(beFriends);
            const allFriendIds = [];
            allFriendIds.push(id);
            for (let i = 0; i < allIds.length; i++) {
                if (allFriendIds.indexOf(allIds[i]) === -1) {
                    allFriendIds.push(allIds[i]);
                }
            }
            this.body = { allFriendIds };
        } catch (err) {
            this.body = err;
        }
    }
};
