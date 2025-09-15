import Contact from "../models/Contact.js";
import { ApiError } from "../utils/ApiError.js";

export const getAllContacts = async (userId) => {
  return await Contact.find({ userId });
};

export const createNewContact = async ({ firstName, lastName, phone, userId }) => {
  const newContact = new Contact({ firstName, lastName, phone, userId });
  return await newContact.save();
};

export const updateContactById = async (id, updateData) => {
  const updated = await Contact.findByIdAndUpdate(id, updateData, { new: true });
  if (!updated) throw new ApiError("Contact non trouvé", 404);
  return updated;
};

export const deleteContactById = async (id) => {
  const deleted = await Contact.findByIdAndDelete(id);
  if (!deleted) throw new ApiError("Contact non trouvé", 404);
  return deleted;
};