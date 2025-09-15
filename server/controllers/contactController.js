import Contact from "../models/Contact.js";

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createContact = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;
        const newContact = new Contact({ firstName, lastName, phone });
        const savedContact = await newContact.save();
        res.status(201).json(savedContact);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};