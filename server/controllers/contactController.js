import { getAllContacts, createNewContact, updateContactById, deleteContactById } from "../services/contactService.js";

// GET /contacts
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContacts(req.user.id);
    res.json(contacts);
  } catch (err) {
    next(err);
  }
};

// POST /contacts
export const createContact = async (req, res, next) => {
  try {
    const savedContact = await createNewContact({ ...req.body, userId: req.user.id });
    res.status(201).json(savedContact);
  } catch (err) {
    next(err);
  }
};

// PATCH /contacts/:id
export const updateContact = async (req, res, next) => {
  try {
    const updated = await updateContactById(req.params.id, req.body);
    if (!updated) throw new Error("Contact non trouvé");
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// DELETE /contacts/:id
export const deleteContact = async (req, res, next) => {
  try {
    const deleted = await deleteContactById(req.params.id);
    if (!deleted) throw new Error("Contact non trouvé");
    res.json({ message: "Contact supprimé avec succès" });
  } catch (err) {
    next(err);
  }
};