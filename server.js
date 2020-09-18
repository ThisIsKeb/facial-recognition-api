const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

var whitelist = [
'https://immense-fjord-12656.herokuapp.com/imageurl', 
'https://immense-fjord-12656.herokuapp.com/image',
'https://immense-fjord-12656.herokuapp.com/register',
'https://immense-fjord-12656.herokuapp.com/signin'
]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
    // user : 'postgres',
    // password : '',
    // port: '5433',
    //database : 'facial-recognition'
  }
});


const app = express();

//Middleware that parses the JSON body into JS that we can read
app.use(express.json());
//Using cors
app.use(cors());

app.get('/', (req, res) => { res.send('it is working') })

// Sign-In also includes a more advanced function/call
app.post('/signin', (req, res) => {signin.handleSignIn(db, bcrypt)})

// Register
app.post('/register', cors(corsOptions), (req, res) => { register.handleRegister(req, res, db, bcrypt)})

//Getting the users homepage
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

//Updating the image count
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})


app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})


