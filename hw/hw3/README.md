# METCS602 HW3: FriendTac

Frontend allows users to create/update/delete a contact, server checks every minute to see if it is time to remind user to contact friend. Uses node-notifier to create system nofication and also logs it with Pino. Contacts are stored in a single JSON for simplicity.

## About

Structure: `./client` contains frontend, `./src` contains backend logic, `./data` holds the pino log and `contacts.json` data.

### Stack

Frontend: HTML, CSS, JS

Backend: Node, Express, node-notifier, Pino

Testing: Jest, Supertest

## Usage

Setup:

``` bash
npm install
npm run build
npm run test # jest
npm run start # starts express server + client
```

Then go to `http://localhost:3039` to see frontend.

## Assignment Instructions

### A.Stage One: The domain model (Data requirements. All required fields.)

1.Name (512 characters)

2.Contact Point (Email, Phone, Text, Letters, Face2Face)

3.Notes (1024 characters)

4.Date Created

5.Date to remind you to contact your friend.

6.Time to remind you to contact your friend.

### B.Stage Two: Basic Functional Requirements

1.Create a contact (all the data fields)

2.Edit a contact

3.Delete a contact

### C.Stage Three: Adding behavior

1.Adding notes to your contact (Notes and a date the note was saved)

2.When the date and time == the actual date and time = raise a notification (NOT ALERT())
