var express = require('express');
var router = express.Router();
var controller = require('../controller/controller.js');

// welcome page
router.get('/', controller.init);

// create new Users
router.post('/api/u/register', controller.createUser);

// find all Users
router.get('/api/u/all', controller.allUsers);

// find one user by name
router.get('/api/search', controller.searching);

// There are more need to be installed
router.post('/api/post', controller.createPost);

// router.get('/api/post', controller.getPost);
// router.get('/api/post_edit', controller.editPost);

router.get('/api/login', function(req, res) {
    res.render('login', { message: 'hello', username: 'steven', password: '1234' });
});

// router.post('/api/login', controller.loggedin);

// router.get('/api/login', controller.login);

module.exports = router;
