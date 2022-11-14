# Northcoders House of Games API

## Connecting to db locally

To connect to the databases and access their data locally you will need to require in either index.js in the test-data folder or the development-data folder depending on which databases you want to connect to.

You will need to create two files, .env.test and .env.development.

.env.test should have PGDATABASE=nc_games_test
.env.development should have PGDATABASE=nc_games
