# Northcoders House of Games API

## Connecting to db locally

To connect to the databases and access their data locally you will need to require in either index.js in the test-data folder or the development-data folder depending on which databases you want to connect to.

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). Double check that these .env files are .gitignored.
