import express from "express";
import { Contact, ContactRequest } from "../models/Contact.js";
import { loadContacts, saveContacts } from "../utils/utils.js";

const router = express.Router();

const validateContact = (req: express.Request, res: express.Response) => {
  // validate required fields
  const { name, contactPoint, notes, reminderDate, reminderTime } = req.body;
  if (!name || !contactPoint || !reminderDate || !reminderTime) {
    return res.status(400).send("Missing required fields");
  }
  // validate reminderDate and reminderTime
  const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
  // console.log(reminderDateTime);
  if (isNaN(reminderDateTime.getTime())) {
    return res.status(400).send("Invalid reminder date or time");
  }
  if (reminderDateTime <= new Date()) {
    return res.status(400).send("Reminder date and time must be in the future");
  }
  // validate name length
  if (name.length > 512) {
    return res.status(400).send("Name too long");
  }
  // validate contactPoint length
  if (contactPoint.length > 512) {
    return res.status(400).send("Contact point too long");
  }
  // validate notes length
  if (notes && notes.length > 1024) {
    return res.status(400).send("Notes too long");
  }
}

const validateUpdateContact = (req: express.Request, res: express.Response, oldContact: Contact) => {
  // make sure at least one field is being updated
  const { name, contactPoint, notes, reminderDate, reminderTime } = req.body;
  if (!name && !contactPoint && !notes && !reminderDate && !reminderTime) {
    return res.status(400).send("No fields to update");
  }
  // if reminderDate or reminderTime is being updated, validate them
  if (reminderDate || reminderTime) {
    const newReminderDate = reminderDate || oldContact.reminderDate;
    const newReminderTime = reminderTime || oldContact.reminderTime;
    const reminderDateTime = new Date(`${newReminderDate}T${newReminderTime}`);
    if (isNaN(reminderDateTime.getTime())) {
      return res.status(400).send("Invalid reminder date or time");
    }
    if (reminderDateTime <= new Date()) {
      return res.status(400).send("Reminder date and time must be in the future");
    }
  }
  // validate name length
  if (name && name.length > 512) {
    return res.status(400).send("Name too long");
  }
  // validate contactPoint length
  if (contactPoint && contactPoint.length > 512) {
    return res.status(400).send("Contact point too long");
  }
  // validate notes length
  if (notes && notes.length > 1024) {
    return res.status(400).send("Notes too long");
  }
}


/* Stage Two: Basic Functional Requirements (CRUD Routes) */

// get all contacts
router.get("/", async (req, res) => {
  const contacts = await loadContacts();
  res.send(contacts);
});

// get a single contact by id
router.get("/:id", async (req, res) => {
  const contacts = await loadContacts();
  const contact = contacts.find((c) => c.id === req.params.id);
  if (!contact) return res.status(404).send("Contact not found");
  res.send(contact);
});

// create a contact
router.post("/", async (req, res) => {
  // validate request body
  const error = validateContact(req, res);
  if (error) return;
  
  // load existing contacts, add new contact, save back to file
  const contacts = await loadContacts();
  const newContact: Contact = {
    ...req.body,
    id: crypto.randomUUID(),
    dateCreated: new Date().toISOString(),
  };
  contacts.push(newContact);
  await saveContacts(contacts);
  res.status(201).send(newContact);
});

// edit a contact
router.put("/:id", async (req, res) => {
  // load existing contacts, find contact by id, if found update it, save back to file, otherwise 404
  const contacts = await loadContacts();
  const index = contacts.findIndex((c) => c.id === req.params.id);
  if (index === -1) return res.status(404).send("Contact not found");

  // validate request body
  const error = validateUpdateContact(req, res, contacts[index]);
  if (error) return;

  contacts[index] = { ...contacts[index], ...req.body, id: req.params.id };
  await saveContacts(contacts);
  res.send(contacts[index]);
});

// delete a contact
router.delete("/:id", async (req, res) => {
  // load existing contacts, find contact by id, remove it if exists, save back to file, otherwise 404
  const contacts = await loadContacts();
  const updatedContacts = contacts.filter((c) => c.id !== req.params.id);
  if (contacts.length === updatedContacts.length) {
    return res.status(404).send("Contact not found");
  }
  await saveContacts(updatedContacts);
  res.status(204).send();
});

export default router;
