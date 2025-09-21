import { Contact } from "../models/Contact.js";
import { promises as fs } from "fs";

const dataFile = "./data/contacts.json";

// helper func to load contacts
const loadContacts = async (): Promise<Contact[]> => {
  const data = await fs.readFile(dataFile, "utf-8");
  return JSON.parse(data);
};

// helper func to save contacts
const saveContacts = async (contacts: Contact[]): Promise<void> => {
  await fs.writeFile(dataFile, JSON.stringify(contacts, null, 2));
};

export { loadContacts, saveContacts, dataFile };
