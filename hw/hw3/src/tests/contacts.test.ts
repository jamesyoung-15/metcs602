import request from "supertest";
import fs from "fs/promises";
import { Contact, ContactRequest } from "../models/Contact.js";
import { randomUUID } from "node:crypto";
import express from "express";
import bodyParser from "body-parser";
import router from "../routes/contacts.js";
// in practice should use separate test file since this will overwrite data but too much hassle lol
import { dataFile } from "../utils/utils.js";

// create an express app for testing
const app = express();
app.use(bodyParser.json());
app.use("/contacts", router);

beforeEach(async () => {
  // reset the test JSON file before each test
  await fs.writeFile(dataFile, JSON.stringify([]));
});

afterAll(async () => {
  // clean up after all tests
  await fs.writeFile(dataFile, JSON.stringify([]));
});

describe("Contacts API", () => {
  // test creating single contact
  it("should create a contact", async () => {
    const contact: ContactRequest = {
      name: "Lionel Messi",
      contactPoint: "lio@email.com",
      // notes: "test friend",
      reminderDate: "2025-09-25",
      reminderTime: "14:30",
    };

    const res = await request(app).post("/contacts").send(contact);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(contact);

    const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    expect(data.length).toBe(1);
    expect(data[0].name).toBe("Lionel Messi");
  });

  // test creating multiple contacts
  it("should create two contacts", async () => {
    const contact_1: ContactRequest = {
      name: "Lionel Messi",
      contactPoint: "lio@email.com",
      notes: "test friend 1",
      reminderDate: "2025-09-25",
      reminderTime: "14:30",
    };
    const contact_2: ContactRequest = {
      name: "Frenkie Dejong",
      contactPoint: "frenkie@email.com",
      notes: "test friend 2",
      reminderDate: "2025-09-25",
      reminderTime: "14:30",
    };

    const res = await request(app).post("/contacts").send(contact_1);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(contact_1);

    const res2 = await request(app).post("/contacts").send(contact_2);

    expect(res2.status).toBe(201);
    expect(res2.body).toMatchObject(contact_2);

    const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    expect(data.length).toBe(2);
    expect(data[0].name).toBe("Lionel Messi");
    expect(data[1].name).toBe("Frenkie Dejong");
  });

  // test create invalid contact: non future date
  it("should return 400 for invalid contact date", async () => {
    const contact: ContactRequest = {
      name: "Lionel Messi",
      contactPoint: "lio@email.com",
      notes: "test friend 1",
      reminderDate: "2025", // this is valid since new Date("2025") is valid, will be interpreted as 2025-01-01 (also kinda edge case)
      reminderTime: "14:30",
    };
    const res = await request(app).post("/contacts").send(contact);

    expect(res.status).toBe(400);
    expect(res.text).toBe("Reminder date and time must be in the future");

    const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    expect(data.length).toBe(0);
  });

  // test create invalid contact, invalid date
  it("should return 400 for invalid contact date", async () => {
    const contact: ContactRequest = {
      name: "Lionel Messi",
      contactPoint: "lio@email.com",
      reminderDate: "invalid-date",
      reminderTime: "asdf",
    };
    const res = await request(app).post("/contacts").send(contact);

    expect(res.status).toBe(400);
    expect(res.text).toBe("Invalid reminder date or time");

    const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    expect(data.length).toBe(0);
  });

  // test missing required fields
  it("should return 400 for missing required fields", async () => {
    const contact = {
      name: "Lionel Messi",
    };
    const res = await request(app).post("/contacts").send(contact);
    
    expect(res.status).toBe(400);
    expect(res.text).toBe("Missing required fields");
    const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    expect(data.length).toBe(0);
  });

  // test updating an existing contact
  it("should update a contact", async () => {
    const uuid = randomUUID();
    const contact: Contact = {
      id: uuid,
      name: "Lionel Messi",
      contactPoint: "lio@email.com",
      notes: "test friend 1",
      dateCreated: new Date().toISOString(),
      reminderDate: "2025-09-25",
      reminderTime: "14:30",
    };

    // manually add a contact to the JSON file
    await fs.writeFile(dataFile, JSON.stringify([contact]));

    const updatedContact = { name: "Frenkie Dejong" };

    const res = await request(app)
      .put(`/contacts/${uuid}`)
      .send(updatedContact);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Frenkie Dejong");

    const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    expect(data[0].name).toBe("Frenkie Dejong");
  });

  // test updating non-existent contact
  it("should return 404 when updating non-existent contact", async () => {
    const res = await request(app)
      .put(`/contacts/999`)
      .send({ name: "Random" });
    expect(res.status).toBe(404);
  });

  // test updating with invalid data
  it("should return 400 when updating with invalid data", async () => {
    const uuid = randomUUID();
    const contact: Contact = {
      id: uuid,
      name: "Lionel Messi",
      contactPoint: "lio@email.com",
      notes: "test friend 1",
      dateCreated: new Date().toISOString(),
      reminderDate: "2025-09-25",
      reminderTime: "14:30",
    };

    // manually add a contact to the JSON file
    await fs.writeFile(dataFile, JSON.stringify([contact]));

    const res = await request(app)
      .put(`/contacts/${uuid}`)
      .send({ reminderDate: "invalid-date", reminderTime: "asdf" });
    expect(res.status).toBe(400);
    expect(res.text).toBe("Invalid reminder date or time");
  });

  // test deleting a contact
  it("should delete a contact", async () => {
    const uuid = randomUUID();
    const contact: Contact = {
      id: uuid,
      name: "James Young",
      dateCreated: new Date().toISOString(),
      contactPoint: "Phone: 123-456-7890",
      reminderDate: "2025-09-25",
      reminderTime: "14:30",
    };

    // manually add a contact to the JSON file
    await fs.writeFile(dataFile, JSON.stringify([contact]));

    const res = await request(app).delete(`/contacts/${uuid}`);
    expect(res.status).toBe(204);

    const data = JSON.parse(await fs.readFile(dataFile, "utf-8"));
    expect(data.length).toBe(0);
  });
  // test deleting non-existent contact
  it("should return 404 when deleting non-existent contact", async () => {
    const res = await request(app).delete(`/contacts/999`);
    console.log(res.status, res.body);
    expect(res.status).toBe(404);
  });
});
