# Northcoders House of Games API

The aim of this project was to create a backend for an API containing data and reviews for board games that would allow a user to access this information using specific endpoints.

Hosted version: https://dead-puce-abalone-cap.cyclic.app

For a list of all available endpoints and examples of the data that will be returned visit: https://dead-puce-abalone-cap.cyclic.app/api

## Connecting to db locally

To connect to the databases and access their data locally you will need to require in either index.js in the test-data folder or the development-data folder depending on which databases you want to connect to.

You will need to create two .env files for your project:

.env.test and .env.development

Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment e.g. PGDATABASE=nc_games

(see /db/setup.sql for the database names).

Double check that these .env files are .gitignored.
