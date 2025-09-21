import { Contact } from "../models/Contact.js";
import { loadContacts } from "../utils/utils.js";
import pino from "pino";
import path from "path";
import notifier from "node-notifier";

const logFile = "./data/notifications.log";

// check reminders and send system notifications + log with pino
const checkReminders = async () => {
  console.log("Checking reminders...");
  try {
    const contacts = await loadContacts();
    const now = new Date();

    contacts.forEach(async (contact) => {
      const reminderDateTime = new Date(
        `${contact.reminderDate}T${contact.reminderTime}`,
      );
      if (reminderDateTime <= now) {
        console.log(`Notification: Remember to contact ${contact.name}!`);
        createSystemNotifier(contact);
        logNotification(contact);
      }
    });
  } catch (error) {
    console.error("Error checking reminders:", error);
  }
};

// node notifier
const createSystemNotifier = (contact: Contact) => {
  notifier.notify({
    title: "Friendtac Reminder",
    message: `Don't forget to check in with ${contact.name}!`,
    sound: true,
    wait: true,
  });
};

// pino logger
const logger = pino(pino.destination(path.join(process.cwd(), logFile)));

const logNotification = (contact: Contact) => {
  logger.info(
    `Notification sent for contact ${contact.name} at ${new Date().toISOString()}`,
  );
};

export { checkReminders, createSystemNotifier, logNotification };
