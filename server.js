const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'ke3148vin',
    port: '5433',
    database : 'facial-recognition'
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
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt)})

//Getting the users homepage
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

//Updating the image count
app.put('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})


app.listen(process.env.PORT || 3001, () => {
	console.log(`app is running on port ${process.env.PORT}`);
})


