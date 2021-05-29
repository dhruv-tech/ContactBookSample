const Contact = require('../models/Contact');

const contactManger = {};

contactManger.add = async(req, res) => {
    try {

        const contact = new Contact({firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email});
        await contact.save();

        res.code(201);
        res.send();

    } catch (error) {
        
        if (error.code == '11000') {
            res.code(406);
            res.send({error: true, msg: "Specified email id is already associated with contact"});
        } else if (error._message == 'Contact validation failed') {
            res.code(400);
            res.send({error: true, msg: "Insufficent information provided"});
        } else {
            res.code(500);
            res.send({error: true, msg: "Could not save contact, please try again later."});
        }
        
    }
};


contactManger.delete = async(req, res) => {
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

contactManger.update = async(req, res) => {
    try {
        
        let updated = await Contact.findOneAndUpdate({email: req.params.email}, req.body);

        if (updated == null) {
            throw new Error('not found');
        }

        res.code(204);
        res.send();

    } catch (error) {
        
        if (error.message == "not found") {
            res.code(404);
            res.send({error: true, msg: "Contact does not exist"});
        } else {
            res.code(500);
            res.send({error: true, msg: "Could not update contact, please try again later."});
        }
        
    }
};

contactManger.search = async(req, res) => {
    try {
        
        let results = await Contact.find({$or: [
            {firstName: {$regex: new RegExp(`^${req.params.query}`), $options: 'i' }},
            {lastName: {$regex: new RegExp(`^${req.params.query}`), $options: 'i' }},
            {email: {$regex: new RegExp(`^${req.params.query}`), $options: 'i' }}
        ]})
        .select('firstName lastName email');

        res.code(200);
        res.send(results);

    } catch (error) {
        
        res.code(500);
        res.send({error: true, msg: "Unable to search, please try again later."});
        
    }
};

module.exports = contactManger;