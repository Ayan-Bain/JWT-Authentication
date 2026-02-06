const express = require('express');
const bodyParser = require('body-parser')
const usersRoutes = require('./routes/users.js');
const cookieParser = require('cookie-parser');
const {requireAuth, checkUser} = require('./middleware/AuthMiddleware.js')

const app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(bodyParser.json());

app.listen(4000, ()=> {
    console.log("Server running on 4000");
})

//checkUser
app.use(checkUser);

app.get('/', (req, res) => res.render('main'))
app.get('/signin', (req, res) => res.render('signin'))
app.get('/signup', (req, res) => res.render('signup'))
app.get('/special',requireAuth, (req, res)=>res.render('special'))
app.use(usersRoutes);