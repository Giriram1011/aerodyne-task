
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash

# watch mode
$ npm run start:dev
 
 Port 3000
 
## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
git link - https://github.com/Giriram1011/aerodyne-task.git

Docker

Nest only maked inside docker 
MongoDB access from centeralized db
Behind project folder
cd ..
sudo docker build ./aerodyne-task/ -t giriram/aerodyne-task
sudo docker run -p 8080:3000 giriram/aerodyne-task
sudo docker ps
sude docker images
sudo docker stop [containerId]