const sanitize = require('sanitize')();

const utils = {};

utils.sanitize = (data) => {
    return sanitize.primitives(data);
}

utils.auth = async(user, pass, actualUser, actualPass, done) => {

    if (user === actualUser && pass === actualPass) {
        done()
    } else {
        done(new Error('Incorrect username/password'));
    }
}

module.exports = utils;