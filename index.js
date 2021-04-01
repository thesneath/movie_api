const express = require('express'),
  morgan = require('morgan');
const app = express();

const movies = [
  {
    'title': 'Interstellar',
    'genre': 'Science Fiction'
  },
  {
    'title': 'Annihilation'
  },
  {
    'title': 'Star Wars'
  },
  {
    'title': 'Thor Ragnarok'
  },
  {
    'title': 'American Animals'
  },
  {
    'title': 'Tenet'
  },
  {
    'title': 'Arrival'
  },
  {
    'title': 'Avengers: Infinity War'
  },
  {
    'title': 'Knives Out'
  },
  {
    'title': 'Toy Story 3'
  }
];

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

app.get('/movies', (req, res) => {
  res.json(movies);
});

app.get('/movies/:title/', (req, res) => {
  res.json(movies.find((movie) => {
    return movie.title === req.params.title;
  }));
});

app.get('/movies/:title/:genre/', (req, res) => {
  res.send('Successful GET request for a genre of specfic flick');
});

app.get('/directors/:name', (req, res) => {
  res.send('Success GET request for a director by name');
});

// post requests 

app.post('/users/', (req, res) => {
  res.send('Registration complete!');
});

app.post('/users/:username/my-movies', (req, res) => {
  res.send('Added movie to my movies');
});

// put requests 

app.put('/users/:username/', (req, res) => {
  res.send('Username updated!');
});

// delete requests 

app.delete('/users/:username', (req, res) => {
  res.send('User account deleted.');
});

app.delete('/users/:username/my-movies', (req, res) => {
  res.send('Movie removed from my movies.')
})


app.listen(8080, () => {
  console.log('App is running on port 8080.')
});