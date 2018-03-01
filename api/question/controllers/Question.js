'use strict';

/**
 * Question.js controller
 *
 * @description: A set of functions called "actions" for managing `Question`.
 */

module.exports = {

  /**
   * Retrieve question records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    const data = await strapi.services.question.fetchAll(ctx.query);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Retrieve a question record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    const data = await strapi.services.question.fetch(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Create a/an question record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    const data = await strapi.services.question.add(ctx.request.body);

    // Send 201 `created`
    ctx.created(data);
  },

  /**
   * Update a/an question record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    const data = await strapi.services.question.edit(ctx.params, ctx.request.body) ;

    // Send 200 `ok`
    ctx.send(data);
  },

  /**
   * Destroy a/an question record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    const data = await strapi.services.question.remove(ctx.params);

    // Send 200 `ok`
    ctx.send(data);
  }
};
