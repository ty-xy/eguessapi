'use strict';

module.exports = {
    findTopic: function * (params) {
        const { page, size } = params;
        let entry = yield Topic.find({
            limit: page * size,
            sort: {
                createdAt: 0
            },
        });
        return entry;
    }
};