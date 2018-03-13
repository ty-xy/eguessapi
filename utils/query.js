const actionUtil = require('../node_modules/strapi/lib/configuration/hooks/blueprints/actionUtil');


module.exports = function _find(_ctx) {
    return new Promise(function (resolve, reject) {

      const Model = actionUtil.parseModel(_ctx);
      // Init the query.
      let query = Model.find(_ctx.query)
        .where(actionUtil.parseCriteria(_ctx))
        .limit(actionUtil.parseLimit(_ctx))
        .skip(actionUtil.parseSkip(_ctx))
        .sort(actionUtil.parseSort(_ctx));
  
      query = actionUtil.populateEach(query, _ctx, Model);
      query.exec(function found(err, matchingRecords) {
        if (err) {
          _ctx.status = 500;
          reject(err);
        }
  
        // Records found.
        resolve(matchingRecords);
      });
    });
};