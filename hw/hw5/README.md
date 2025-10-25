# METCS602 HW 5 - TicketMeister

Full stack ticketing platform that supports multiple languages.

## Setup Instructions

### Docker Compose (Fastest)

Quickest setup would be to use Docker compose that spins up MongoDB, Node backend, and React frontend containers, eg:

``` bash
docker compose up -d
```

Then go to `http://localhost:3048` to see web application.

For local setup, see below:

### Backend Setup

- !!Important!! Make sure MongoDB is running on port 20717 (accessible with no user/password for dev), either use locally installed or docker, eg. `docker compose up mongodb -d`.
- Setup backend

``` bash
cd backend
npm install
# seed data
npm run build
# for jest tests
npm run test
# start node + express
npm run start
```

- Setup Frontend (React + Vite)

``` bash
cd frontend
npm install
npm run dev
```

Go to the port Vite tells in console, eg. `http://localhost:3048` in web browser.

## Tech Stack

### Frontend

- React + Vite
- React-router for routing and nav
- TailwindCSS
- react-i18next for multi-language
- SocketIO-Client

Use React context for auth (eg. JWT token storage, user's default language) and cart (manages state and fetches items from mongo on login). SocketIO for chatbox.

### Backend

- Node
- Express
- MongoDB
- SocketIO
- Others
  - bcrypt for hashing
  - JWT for auth
  - multer for handling uploaded images
  - Docker compose for quick setup of MongoDB
  - Jest w/ Supertest for integration tests for API routes

JWT tokens are generated on login/register and verified via middleware on protected routes

User images are stored in `backend/uploads`, venue data and images in `data`, `generate_sample_data.js` populates mongodb with venue data. SocketIO for chatbox.

## Assignment Instructions

- The primary target is a mobile. DO not use the desktop as your primary display. (You can develop on it, but view/test on mobile).  This application is primarily meant for mobile.
- Details on user accounts and each venue needs be fetch from a database (Maria, PostGres MySQL or Mongo).

Non Functional Requirements:

NFRD.1 The website has navigation (links) to any of the pages you are creating for this application.   Meaning, you cannot have any dead links or links that are broken.

NFRD.2  All images must be responsive to the device viewport (tablet, phone, lastly desktop)

NFRD.3 Feel free to add more tests to each Jest (or Cucumber) test suite, but you need to have meet the minimums per each suite.

NFRD.4 The webapp must be a responsive design.

NFRD.5 You can use React, Next or other frameworks as well as standard HTML, CSS and Javascript to create your webapp.


Functional Requirements:

FRD.1 Create a user account view. Has options (or sections/pages) for:

    Changing password.  (You can opt to integrate with Google Sign-in if you want)
    Mailing address.
    Main contact phone number (home, mobile)

FRD.3 Create at least 6 venues around the world, each on a different month, date & time, to start with.

FRD.4 Have the following displayed for each venue:

    Venue Title.
    An image (your choice).
    Venue slogan or title.
    Must have 'showcase' picture - the primary picture.
    Must have at least  6 small, tiled pictures that are tiled or carousel.   This can be random pictures to get through this requirement.
    A call to action (button/icon/graphic) to purchase a ticket for that venue.

FRD.5 A cart page to update the number of ticket to purchase and to remove the ticket purchase.

FRD.6 Have a chat room for customers to chat about their purchase.

FRD.7 Have at least 3 Jest or Cucumber test suites (account test suite, venue test suite and chat test suite). Each suite needs to have at least 2 Jest test cases each.

Technical Requirements:

a. Must use ES6 modules in your solution. Use of globals (functions, objects, classes, etc) is frowned upon and will receive a reduction in total points towards the grade.

b. Must use sockets (Node or PHP based - up to you.)

c. Must use a database to store and retrieve the information shown in the page.

c. Must use JSDoc with your comments and documentation in your code.

d. Include a README.md file if installation or seeding.

e. Must have Jest or Cucumber tests.

## Resources Used

- Lecture Notes for Mongoose
- [Multer for file upload](https://blog.logrocket.com/multer-nodejs-express-upload-file/)
- [JWT Auth in Node](https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49)
- [React Internationalization w/ i18next](https://react.i18next.com/)
- [Tailwind](https://tailwindcss.com/docs/responsive-design)
