# Movie API

This is a REST API for an application called MyFlix that interacts with a database that stores data about users and movies.

See API [documentation](http://alexdb.herokuapp.com/documentation.html)

## Features

- Returns a list of ALL movies to the user
- Returns data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user
- Returns data about a genre (description) by name/title (e.g., “Thriller”)
- Returns data about a director (bio, birth year, death year) by name
- Allows new users to register
- Allows users to update their user info (username, password, email, date of birth)
- Allows users to add a movie to their list of favorites
- Allows users to remove a movie from their list of favorites
- Allows existing users to deregister
- Allows users to log in using JSON Web Token

### Dependencies

```
 "dependencies": {
    "bcrypt": "^5.0.1",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "express": "^4.17.1",
    "express-validator": "^6.10.0",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^5.12.3",
    "morgan": "^1.10.0",
    "passport": "^0.4.1",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0"
  }
```

## Author

Alex Sneath

## Acknowledgements

This project is a student project from CareerFoundry's Full Stack Immersion Course