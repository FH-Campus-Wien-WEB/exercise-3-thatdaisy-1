const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const movieModel = require('./movie-model.js');

const app = express();

// Parse urlencoded bodies
app.use(bodyParser.json()); 

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));

/* Task 1.2: Add a GET /genres endpoint:
   This endpoint returns a sorted array of all the genres of the movies
   that are currently in the movie model.
*/
app.get("/genres", (req, res) => {
  const genres = Object.values(movieModel)
    .flatMap((movie) => movie.Genres)
    .filter((genre, index, arr) => arr.indexOf(genre) === index)
    .sort();
  res.json(genres);
});

/* Task 1.4: Extend the GET /movies endpoint:
   When a query parameter for a specific genre is given, 
   return only movies that have the given genre
 */
app.get('/movies', function (req, res) {
  const { genre } = req.query;

  const moviesArray = Object.entries(movieModel)
    .map(([id, movie]) => ({ imdbID: id, ...movie }))
    .filter((movie) => !genre || movie.Genres.includes(genre));
  res.json(moviesArray);
})

// Configure a 'get' endpoint for a specific movie
app.get('/movies/:imdbID', function (req, res) {
  const movie = movieModel[req.params.imdbID];
  if (movie) {
    res.send({ imdbID: req.params.imdbID, ...movie });
  } else {
    res.sendStatus(404);
  }
})

app.put('/movies/:imdbID', function(req, res) {
  if (movieModel[req.params.imdbID]) {
    movieModel[req.params.imdbID] = req.body;
    res.sendStatus(200);
  } else {
    movieModel[req.params.imdbID] = req.body;
    console.log('new movie added', req.params.imdbID, Object.keys(movieModel));
    res.status(201).send(req.body);
  }  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")
