# HW1: Temperature Converion App

Temperature converion web application + cli. Frontend with vanilla HTML, CSS, Typescript (in `client`). Backend with Node and Express w/ Typescript (in `server`). Unit tests with Jasmine. CLI w/ Typescript (see `cli.ts`).

## Setup

`client` includes basic frontend, `server` includes Node server.

``` bash
npm install
npm run build
npm run start
# for running jasmine test
npm run test
# cli
npm run cli
```

For web application, go to `http://127.0.0.1:6920` for web application on browser after running `npm start`.

For cli, run `npm run cli` after `npm run build`.

## Assignment Instructions

The initial temperature is always in Fahrenheit (F).  

Create either a console-based or web application that will convert:

1. (20 points) From Fahrenheit To Celsius. C = 5/9 x (F − 32)

2. (20 points) From Fahrenheit to Kelvin. K = (F − 32) × 5 ⁄ 9 + 273.15

3. (20 points) From Celsuis to Kelvin. C + 273.15

4. (20 points) Celsuis to to Fahrenheit. F = (C × 9/5) + 32

5. (20 points) Kelvin to Celsuis. K – 273.15

Requirements:

a. Create at least 3 Jasmine tests on your functionality.

b. Round to 2 significant digits. For example 33.12 F, or -15.89 C.  (Minus 5 points if your value does not round to 2 digits)

c. Each one is worth 20 points for each functional, working conversion.  

d. Must use ES6 Modules. (Minus 20 points if you do not use modules)

e. Must use Node with. your solution.  (Minus 20 points if you do not implement using Node)

f. Must not submit your /node_modules folder.  (Minus 80 points if you submit your solution with /node_modules)
