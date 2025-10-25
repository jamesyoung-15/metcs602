# METCS602 HW6 - Patient Intaker

Mobile web application to collect and gather important patient data.

## Setup Instructions

- Docker Compose (easiest)

Run `docker compose up -d`, go to `http://localhost:3056` to see web app.

- Local

For backend, make sure to setup MongoDB on port 27017, then:

``` bash
cd backend
npm install
# jest tests (tests API routes)
npm test
# express server
npm start
```

Frontend:

``` bash
cd frontend
npm install
npm run dev
```

## About

Tech stack

- Frontend
  - React
  - Vite
  - TailwindCSS
- Backend
  - Node + Express
  - MongoDB
  - Jest + Supertest

## Project Requirements

Create application to collect and store important information from patients.

``` txt
View #1:  Welcome Screen

See 'patient_intake_screen_1.png'.  Match the design (colors, font, spacing and margin, etc.)

View #2: Intake

 Collect the following data points:

    First, Middle Last Name
    Mobile Number 
    Email Address
    Mailing Address

View #3: Health Questions

    Did you have gray hair before having children? [Yes/No]
    Have you ever broken a bone after 16 years old? [Yes/No]
    Do you trip over small stones while walking? [Yes/No]

View #3 Insurance Details

    Current Insurance Carrier (Name)
    Policy Number

View #4 Upload Insurance Card

The only thing this view does is let the user upload a photo.

View #5 Schedule an appointment

See 'appointment_scheduler.png' for an example

View #6 Review Term of Service and Consent ("ToS")

https://en.wikipedia.org/wiki/Terms_of_service - Use the text on this page.  Have a checkbox for acceptance of the ToS.
```
