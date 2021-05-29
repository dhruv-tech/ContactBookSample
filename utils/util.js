const sanitize = require('sanitize')();

const utils = {};

utils.sanitize = (data) => {
    return sanitize.primitives(data);
}

module.exports = utils;