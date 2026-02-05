const express = require('express');
const bodyParser = require('body-parser')
const usersRoutes = require('./routes/users.js');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(bodyParser.json());
app.use(usersRoutes);
app.listen(4000, ()=> {
    console.log("Server running on 4000");
})


app.get('/', (req, res) => res.render('main'))
app.get('/signin', (req, res) => res.render('signin'))
app.get('/signup', (req, res) => res.render('signup'))