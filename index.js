const express = require('express'),
  morgan = require('morgan'),
  mongoose = require('mongoose'),
  Models = require('./models.js'),
  passport = require('passport'),
  cors = require('cors'),
  bodyParser = require('body-parser');

const { check, validationResult } = require('express-validator');

require('./passport');

const Movies = Models.Movie;
const Users = Models.User;

// mongoose.connect('mongodb://localhost:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();

app.use(bodyParser.json());
app.use(cors());
const auth = require('./auth')(app);
app.use(express.static('public'));
app.use(morgan('common'));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops! It Broke.')
})

// get requests 

app.get('/', (req, res) => {
  res.send('Welcome to my App!');
});

/**
 * Get all Movies
 * @method GET
 * @returns {array} Array of movie objects
 */
app.get('/movies', passport.authenticate('jwt',{ session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

/**
 * Get movie by title
 * @method GET
 * @params {string} movie Title
 * @returns {object} JSON object with Movie Title, Director object, Genre object, id, imagepath, description, featured
 */
app.get('/Movies/:Title/', passport.authenticate('jwt',{ session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

/**
 * Get movie genre by genre name
 * @method GET
 * @params {string} Genre Name
 * @returns {object} JSON object with Genre Name and Description
 */
app.get('/Movies/Genre/:Name', passport.authenticate('jwt',{ session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movie) => {
      res.json(movie.Genre);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * Get Director by Name
 * @method GET
 * @params {string} Director Name
 * @retursn {object} JSON object with Director Name, Bio, Birthyear, and Deathyear
 */
app.get('/Movies/Director/:Name', passport.authenticate('jwt',{ session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name})
    .then((movie) => {
      res.json(movie.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
    })
});

/**
 * get all users
 * @method GET
 * @returns {array} array of all user objects Username, Password, Email, Birthday
 */
app.get('/users', passport.authenticate('jwt',{ session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    }) 
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    })
});

/**
 * get user by Username
 * @method GET
 * @params {string} Username
 * @returns {object} user object matching the Username parameter
 */
app.get('/users/:Username', passport.authenticate('jwt',{ session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    })
});

// post requests 

/**
 * Register a new user
 * @method POST
 * @params {string} Username (5 character minimum, all alphanumeric characters)
 * @params {string} Password (required)
 * @params {string} Email (must be valid)
 * @params {date} Birthday
 * @returns {object} JSON object with user info as well as ID and Favorite Movies
 */
app.post('/users',
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username includes characters that are not allowed').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Please enter a valid email').isEmail()
  ], (req, res) => {
    let errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password)
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => {res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      })
});

/**
 * Add move to favorites
 * @method POST
 * @params {string} Username and MovieID
 * @returns {object} JSON User object with added favorite movie
 */
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt',{ session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  }); 
});

// put requests 

/**
 * Update user by username
 * @method PUT
 * @params {string} Username
 * @returns {string} JSON user object with updated information
 */
app.put('/users/:Username/', passport.authenticate('jwt',{ session: false }), 
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username includes characters that are not allowed').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Please enter a valid email').isEmail()
], (req, res) => {
  let errors = validationResult(req);

  if(!errors.isEmpty()){
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = Users.hashPassword(req.body.Password)
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $set:
      {
        Username: req.body.Username,
        Password: hashedPassword,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
  },
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// delete requests 

/**
 * Delete user
 * @method DELETE
 * @params {string} Username
 */
app.delete('/users/:Username', passport.authenticate('jwt',{ session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found.');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

/**
 * Delete movie from favorites
 * @method DELETE
 * @params {string} Username
 * @params {string} MovieID
 * @returns object Updated user object
 */
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt',{ session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
    $pull: { FavoriteMovies: req.params.MovieID } 
    },
    { new: true },
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + error);
      } else {
        res.json(updatedUser);
      }
    }
  );
});
const port = process.env.PORT || 8080
app.listen(port, '0.0.0.0', () => {
  console.log('App is running on port ' + port)
});