# Northcoders House of Games API

The aim of this project was to create the backend for an app containing data and reviews for board games that would allow a user to access this information using specific endpoints.

Hosted version with a list of available endpoints: https://dead-puce-abalone-cap.cyclic.app/api

## Connecting to db locally

Clone this repository.

Install dependencies using 'npm install'.

Configure .env files for development and test (see below for more details).

Seed your databases using 'npm run seed-prod'.

Run tests using 'npm test'

## Configure .env files

To connect to the databases and access their data locally you will need to add the index.js file to either the test-data folder or the development-data folder depending on which database you want to connect to.

You will need to create two .env files for your project:

.env.test and .env.development

Into each, add: PGDATABASE=<database_name_here> with the correct database name for that environment e.g. PGDATABASE=nc_games

(see /db/setup.sql for the database names).

Double check that these .env files are .gitignored.

## Minimum system requirements

Minimum requirements: Node.js version 16.17.1 or above and Postgres version 8.7.3 or above
