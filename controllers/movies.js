const MovieSchema = require('../models/Movie.js');
const Rating = require('../models/Rating.js');
const passport = require('passport');
const passportJwt = require('passport-jwt');

const ExtractJwt = passportJwt.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = '1234567890';


module.exports.controller = (app) => {
  // fetch all movies
  app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    MovieSchema.find({}, 'name description release_year genre',
      (error, movies) => {
        if (error) { console.log(error); }
        res.send({
          movies,
        });
      });
  });

  // fetch a single movie
  app.get('/api/movies/:id', (req, res) => {
    MovieSchema.findById(req.params.id, 'name description release_year genre',
      (error, movie) => {
        if (error) { console.error(error); }
        res.send(movie);
      });
  });

  // rate a movie
  app.post('/movies/rate/:id', (req, res) => {
    const rating = new Rating({
      movie_id: req.params.id,
      user_id: req.body.user_id,
      rate: req.body.rate,
    });

    rating.save((error, prating) => {
      if (error) { console.log(error); }
      res.send({
        movie_id: prating.movie_id,
        user_id: prating.user_id,
        rate: prating.rate,
      });
    });
  });

  // add a new movie
  app.post('/movies', (req, res) => {
    const newMovie = new MovieSchema({
      name: req.body.name,
      description: req.body.description,
      release_year: req.body.release_year,
      genre: req.body.genre,
    });

    newMovie.save((error, movie) => {
      if (error) { console.log(error); }
      res.send(movie);
    });
  });
};
