const Contact = require('../models/Contact');
const util = require('../utils/util');
const contactController = {};

contactController.add = async(req, res) => {
    try {
        
        if (req.body.email && !util.validateEmail(req.body.email)) throw new Error('invalid email');
        const contact = new Contact({firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email});
        await contact.save();

        res.code(201);
        res.send();

    } catch (error) {
        if (error.message == 'invalid email') {
            res.code(400);
            res.send({error: true, msg: "Email is not valid"});
        } else if (error.code == '11000') {
            res.code(406);
            res.send({error: true, msg: "Specified email id is already associated with another contact"});
        } else if (error._message == 'Contact validation failed') {
            res.code(400);
            res.send({error: true, msg: "Insufficent information provided"});
        } else {
            res.code(500);
            res.send({error: true, msg: "Could not save contact, please try again later."});
        }
        
    }
};


contactController.delete = async(req, res) => {
    try {
        let match = await Contact.findOne({email: req.params.email});

        if (match) {
            await Contact.findOneAndDelete({email: req.params.email});
        } else {
            throw new Error('not found');
        }

        res.code(204);
        res.send();

    } catch (error) {
        
        if (error.message == 'not found') {
            res.code(404);
            res.send({error: true, msg: "Contact does not exist"});
        } else {
            res.code(500);
            res.send({error: true, msg: "Could not delete contact, please try again later."});
        }
        
    }
};

contactController.update = async(req, res) => {
    try {
        
        if (req.body.email == null) throw new Error('invalid email');
        else if (!util.validateEmail(req.body.email)) throw new Error('invalid email');

        let updated = await Contact.findOneAndUpdate({email: req.params.email.toLowerCase()}, req.body);

        if (updated == null) {
            throw new Error('not found');
        }

        res.code(204);
        res.send();

    } catch (error) {
        
        if (error.message == 'invalid email') {
            res.code(400);
            res.send({error: true, msg: "Email is not valid"});
        } else if (error.message == "not found") {
            res.code(404);
            res.send({error: true, msg: "Contact does not exist"});
        } else if (error.code == '11000') {
            res.code(406);
            res.send({error: true, msg: "Specified email id is already associated with contact"});
        } else {
            res.code(500);
            res.send({error: true, msg: "Could not update contact, please try again later."});
        }
        
    }
};

contactController.search = async(req, res) => {
    try {
        
        const fields = 'firstName lastName email';
        const skip = -10 + (10 * req.params.page);
        let results = [];

        if (skip < 0 || !(parseInt(req.params.page) == req.params.page)) throw new Error('out of range');

        if (req.params.query.indexOf(' ') == -1) {

            const query = new RegExp(`^${req.params.query}`);

            results = await Contact.find({$or: [
                {firstName: {$regex: query, $options: 'i' }},
                {lastName: {$regex: query, $options: 'i' }},
                {email: {$regex: query, $options: 'i' }}
            ]}, fields, {skip: skip, limit: 10});

        } else {
            const queryRaw = req.params.query;
            results = await Contact.find({$and: [
                {firstName: {$regex: `^${queryRaw.substr(0,queryRaw.indexOf(' '))}`, $options: 'i' }},
                {lastName: {$regex: `^${queryRaw.substr(queryRaw.indexOf(' ')+1)}`, $options: 'i' }}
            ]}, fields, {skip: skip, limit: 10});

        }

        res.code(200);
        res.send(results);

    } catch (error) {

        if (error.message = 'out of range') {
            res.code(400);
            res.send({error: true, msg: "Invalid page number"});
        } else {
            res.code(500);
            res.send({error: true, msg: "Unable to search, please try again later."});
        }
        
    }
};

module.exports = contactController;