const contactController = require('./controllers/contactController');

const routes = [

    {
        method: 'POST',
        url: '/v1/contacts',
        handler: contactController.add
    },
    {
        method: 'DELETE',
        url: '/v1/contacts/:email',
        handler: contactController.delete
    },
    {
        method: 'PUT',
        url: '/v1/contacts/:email',
        handler: contactController.update
    },
    {
        method: 'GET',
        url: '/v1/contacts/:page/:query',
        handler: contactController.search
    }
]

module.exports = routes;