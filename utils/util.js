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

utils.validateEmail = (email) => {
    console.log(email);
    return (email != '' && email.match(/^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/));
}

module.exports = utils;