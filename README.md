## Installation

```bash
$ npm install
```
> Mongo db is required

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

> By Default the app is running on port 3000

## Config
You could configure MONGO_URL in .env file from root

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Available Endpoints
* GET api/v1/tasks generate tasks
* POST api/v1/tasks create a task
* GET api/v1/docs api documentation (swagger)
