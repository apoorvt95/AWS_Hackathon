import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import users from './routes/api/index';
import passport from 'passport';

// DB config
import mongoDB from './config/keys';

// App init
const app = express();

// Middleware Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


// Connect to Mongo
mongoose
  .connect(mongoDB.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Use Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on ${port}`));
