const clientForm = require('../models/clientForm.model');
const postData = async (req, res) => {
    try {
        const form = new clientForm(req.body);
        await form.save();
        res.status(201).send(form);
    } catch (e) {
        res.status(400).send(e);
    }
};
module.exports = { postData };