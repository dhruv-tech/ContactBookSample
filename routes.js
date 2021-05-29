const contactController = require('./controllers/contactController');

const routes = [

    {
        method: 'POST',
        url: '/contact',
        handler: contactController.add
    },
    {
        method: 'DELETE',
        url: '/contact/:email',
        handler: contactController.delete
    },
    {
        method: 'PUT',
        url: '/contact/:email',
        handler: contactController.update
    },
    {
        method: 'GET',
        url: '/contact/:query',
        handler: contactController.search
    }
]

module.exports = routes;