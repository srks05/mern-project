const { getAllUsers, register, login, changePassword } = require('../controllers/auth');

const route = require('express').Router();
route.get('/getAllUsers', getAllUsers)
route.post('/register', register)
route.post('/login', login)
route.post('/changePassword', changePassword)
// route.get('/confirmEmail/:id',confirmEmail)

// Contact form route
route.post('/contact', require('../controllers/contactController'));

module.exports = route;