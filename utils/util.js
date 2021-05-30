const sanitize = require('sanitize')();

const utils = {};

utils.sanitize = (data) => {
    return sanitize.primitives(data);
}

utils.auth = async(credentials, actualUser, actualPass) => {

    return new Promise((resolve, reject) => {
        try {

            if (credentials.name === actualUser && credentials.pass === actualPass) {
                resolve();
            } else {
                throw new Error();
            }
        } catch (error) {
            reject(new Error('Incorrect username/password'));
        }
    });
}

module.exports = utils;