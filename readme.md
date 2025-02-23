# Calendry

Calendry is a telex integration built on google apis for creating and managing calendar events.

## Features

- Create calendar event
- Update calendar event
- Get calendar event
- Delete calendar event

## Local and public URLs

- **Local:** `http://localhost:3000`
- **Public:** `https://calendry.onrender.com`

## Technologies used

- **NodeJS**
- **Typescript**
- **Google APIs**
- **OAuth**
- **CORS**
- **dotenv**

## Installation on Telex

- Visit the app section in your org sidebar
- Add new integration
- Add the integration.json url to the required input
  `https://calendry.onrender.com/integration.json`
- Enable the integration

## How to use calendary

Calendry has suites of commands neccessary for interacting with the integration

### commands

- **/help** - This gives you a rundown on all the commands available to calendry and how they work.
- **/create** - Used for creating an event
- **/update** - Used for updating an existing event
- **/get** - Used for listing all available events or a specific event
- **/delete** - Used for deleting an existing event

## Local installation

### 1. Clone the repository

```sh
git clone https://github.com/Knowledge-JO/calendry
```

### 2. Navigate to the project directory

```sh
cd calendry
```

### 3. Install dependencies

```sh
npm install
```

### 4. Start server

```sh
npm start
```

The server will start on `http://localhost:3000`
