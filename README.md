# Movie Portal App

Movie Portal is a web application which provides a platform for users to interact with movies and actors, offering features such as user authentication, movie and actor ratings, movie catalog creation, and advanced filtering options.

### Features

- User authentication
- Movie rating (1 to 5 stars)
- Actor rating per movie (1 to 5 stars)
- Movie catalog creation
- Advanced movie filtering by: <br />
  a) Category <br />
  b) Release date <br />
  c) Director <br />
- Movie retrieval by: <br />
  a) ID <br />
  b) Title <br />
  c) Genre <br />
- Actor retrieval by: <br />
  a) ID <br />
  b) Full name <br />

### 🚀 Technologies

- Node.js
- Express.js
- TypeScript
- Zod
- Bcrypt
- Inversify
- PostgreSQL
- Kysely
- Jest
- Docker
- Husky
- JWT
- Swagger

### Allowed actions

- Log in/register account to access the platform's features
- Rate movies on a scale from 1 to 5 stars
- Rate actors per movie, also on a scale from 1 to 5 stars
- Create your own movie catalog
- Utilize advanced filtering options to search for movies based on category, release date, director or genre
- Retrieve detailed movie information by ID, title, or genre.
- Retrieve detailed actor information by ID or full name.

### ✅ Requirements

Before starting, you need to have Git and Node installed.

### Run locally - backend

```bash
# Clone the project
$ git clone https://github.com/Kamgre7/movie-portal.git

# Go to the project directory
$ cd movie-portal-app

# Install dependencies
$ npm install

# Initialize database
$ npm run dbInit

# Migrate db
$ npm run migrations

# Start the server
$ npm run start
```
