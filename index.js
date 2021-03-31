const express = require('express'),
  morgan = require('morgan');
const app = express();

const topMovies = [
  {
    'title': 'Interstellar'
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


app.get('/', (req, res) => {
  res.send('Welcome to my App!');
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});

app.listen(8080, () => {
  console.log('App is running on port 8080.')
});