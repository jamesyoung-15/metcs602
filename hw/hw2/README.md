# HW2: Lottery Numbers

Lottery number simulator using Typescript, with a CLI and web app game. Frontend w/ HTML, CSS, TS, backend w/ Express and Node.

Testing with Jest. Stores historic results in data directory, ie. `hw2/data`. Each game generates it's own JSON file with timestamp as file name.

## Usage

If using web application, after `npm start` go to `http://localhost:3023` for web application.

```bash
# setup project
npm install
npm run build

# jest tests
npm test

# start cli application
npm cli

#  start web application
npm start
```

## Assignment Requirements

- Generate 5 random numbers from 1 through each game's max value. Each game has a different max value.
- Obviously, negative numbers are not allowed, as well as meta-characters and simple alpha characters.
- Also, you need to have the user indicate 5 numbers and 1 powerball - in order to persist the record to the JSON file.
- Generate a random number from 1 through each game's max value - representing the power ball ( or the magic ball).
- Check for duplicates. Lottery numbers cannot have duplicates - except for the power ball (or magic ball)
- Make sure these numbers are show in ascending order.
- Use the asynchronous methods within the FS module to persist, load and delete previously generated lottery numbers stored in JSON format. The data you need to save is:
  - (1) date_generated (date); (2) lottery_numbers (array); (3) is_deleted (boolean); (4) power_ball (numeric)
- Create at least 10 to 20 (positive and negative) tests using Jest, on the functionalities of your application.
