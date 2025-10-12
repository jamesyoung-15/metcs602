# METCS602 HW 5 - TicketMeister

Full stack ticketing platform that supports multiple languages.

## Tech Stack

### Frontend

- React + Vite
- React-router for routing and nav
- TailwindCSS
- react-i18next for multi-language

Use React context for auth (eg. JWT token storage, user's default language) and cart (manages state and fetches items from mongo on login).

### Backend

- Node
- Express
- MongoDB
- Others
  - bcrypt for hashing
  - JWT for auth
  - multer for handling uploaded images
  - Docker compose for quick setup of MongoDB
  - Jest w/ Supertest for integration tests for API routes

JWT tokens are generated on login/register and verified via middleware on protected routes

User images are stored in `backend/uploads`, venue data and images in `data`, `generate_sample_data.js` populates mongodb with venue data.

## Setup Instructions

### Backend Setup

- Make sure MongoDB is running on port 20717, either use locally installed or docker compose, eg. `docker compose up -d`
- Setup backend

``` bash
cd backend
npm install
npm run build
# for jest tests
npm run test
# start node + express
npm run start
```

- Setup Frontend

``` bash
cd frontend
npm install
npm run dev
```

Go to the port Vite tells in console, eg. `http://localhost:5173` in web browser.

## Assignment Instructions

The purpose of this application is to provide a cheaper way for venues to sell tickets around the globe.

TicketMaster has a monopoly on ticket sales. They add costs and do not provide much value for their service. I would like to see a design and mobile-targeted web application that has the following requirements:

- The primary target is a mobile. DO not use the desktop as your primary display. (You can develop on it, but view/test on mobile) This applicaton is primarily meant for mobile.
- All images must be responsive to the viewport of the device (tablet, phone, lastly desktop
- Each venue can be loaded from .json data file or from a database. Data to present for each venue is:
- The first version of the website will be available in Italian, French, Spanish and English.
- Please use Google translate or something else to create the translations.
- The website should have navigation to any of the pages you are creating.
- Create user account view. Has options for:
  - Change password
  - Add a picture
  - Select a default language

- Create at least 6 venues around the world, each on a different month, date & time. Have the following displayed for each venue:
  - Venue Title
  - Venue slogan or catchy title
  - Must have 'showcase' picture - the primary picture
  - Must have 6 focused pictures; like the arena, seats, people at prior venues.
  - A call to action (button/icon/graphic) to purchase a ticket for that venue.

- A cart page to update the number of ticket to purchase and to remove the ticket purchase.

## Resources Used

- Lecture Notes for Mongoose
- [Multer for file upload](https://blog.logrocket.com/multer-nodejs-express-upload-file/)
- [JWT Auth in Node](https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49)
- [React Internationalization w/ i18next](https://react.i18next.com/)
- [Tailwind](https://tailwindcss.com/docs/responsive-design)
