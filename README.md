<p align="center">

  <h1 align="center">Zilgya Server</h1>

  <p align="center">
    <br />
    <a href="#">View Live Application</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</p>

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Related Project](#related-project)

## About The Project

Zilgya furniture is an ecommerce store

### Built With

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
<br>

## Getting Started

### Prerequisites

- [NodeJs](https://nodejs.org/)
- [PostgreSql](https://www.postgresql.org/)
- [Postman](https://www.postman.com/)

### Installation

1. Clone the repo

```sh
$ git clone https://github.com/zilgya/zilgya-server.git
```

2. Install NPM packages

```sh
$ npm install
```

3. Add .env file at root folder project, and add following

```sh
PORT=*YOUR PORT*
DB_USER=*YOUR DB_USER*
DB_HOST=*YOUR DB_HOST*
DB_DATABASE=*YOUR DB_DATABASE*
DB_PORT=*YOUR DB_PORT*
DB_PASS=*YOUR DB_PASS*
MAIL_USERNAME=*YOUR MAIL_USERNAME*
MAIL_PASSWORD=*YOUR MAIL_PASSWORD*
OAUTH_CLIENTID=*YOUR OAUTH_CLIENTID*
OAUTH_CLIENT_SECRET=*YOUR OAUTH_CLIENT_SECRET*
OAUTH_REFRESH_TOKEN=*YOUR OAUTH_REFRESH_TOKEN*
CLIENT_URL=*YOUR CLIENT_URL*
CLOUDINARY_CLOUD=*YOUR CLOUDINARY_CLOUD*
CLOUDINARY_KEY=*YOUR CLOUDINARY_KEY*
CLOUDINARY_SECRET=*YOUR CLOUDINARY_SECRET*
```

4. This app using cloudinary as a file storage

```sh
CLOUDINARY_URL=cloudinary://594784199875728:zbw3276bmERbaFGdhtOd5F0fBFs@zilgya-project
```

5. Starting application

```sh
$ npm run startDev
```

6. Juncoffee Server App is Running

### Related Project

- [`Frontend-zilgya`](https://github.com/zilgya/zilgya-client)
- [`Backend-zilgya`](https://github.com/zilgya/zilgya-server)
