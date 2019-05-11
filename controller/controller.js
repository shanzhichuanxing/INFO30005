const mongoose  = require ('mongoose');
const util = require('util');
const Users = mongoose.model('users');
const Posts = mongoose.model('posts');
const Reply = mongoose.model('reply');

const genderArray = ["female", "male", "hidden", "other"];

// welcome page
function init(req, res) {
	return res.sendfile('public/main.html');
}

// register user
function createUser(req,res){

    console.log(req);

	Users.findOne({email: req.body.email}, function (err, usr) {
        if (usr) {
            // TODO email already taken
            // return res.
        }
    });
	
    var user = new Users({
        "firstname":req.body.firstname ? req.body.first_name :"",
        "lastname":req.body.lastname ? req.body.last_name:"",
        "name":req.body.name,
        "gender":req.body.gender? req.body.gender : genderArray[2],
        "exp":0,
        "phone":0,
        "rank":0,
        "email":req.body.email,
        "BY":0,
        "post":0,
        "collect": 0,
        "following":0,
        "liked":0,
        "likes":0,
        "followers":0,
        "password":req.body.password,
    });
    
    Users.create(user, function(err){
        if (err) {
            return res.sendStatus(400);
        }
    });
    res.cookie(username,user._id, {maxAge: 900000, httpOnly: true});
    res.redirect('/');
    res.end();
};

function login (req, res) {

    Users.findOne({email: req.body.email}, function (err, usr) {
        // TODO encrypt password
        if (req.body.password != usr.password) {
            // TODO password not match error
            // return
        } else {
            res.cookie(username,usr._id, {maxAge: 900000, httpOnly: true});
            var redir = req.query.orig ? req.query.orig : "/";
            res.redirect(redir);
            res.end();
        }
    });

}

function createPost(req,res){
    // set cookie command in browser document.cookie="keyofcookie=valueofcookie"
    console.log(req);
    // var usr = Users.findOne({_id: req.headers.cookies.username}, function (err, usr) {return usr});
    var post = new Posts({
        "author":req.headers.cookie.username,
        "title":req.body.title,
        "content":req.body.post_edit,
        "tag":[],
        "rating":0,
        "reply":[],
    });
    Posts.create(post, function(err){
        if (err) {
            return res.sendStatus(400);
        }
    });

    var redir = util.format('/forum/post?postid=%s', post._id);
    res.redirect(redir);
    res.end();

};

// find all user
var allUsers = function(req,res){
    Users.find(function(err, users) {
    	return err? res.sendStatus(404) : res.send(users);
    });
};

// find by name
function searching(req, res) {
    if (req.query.type === 'user') {
        console.log('1');
        Users.find({name: { $regex : req.query.key, $options : 'i' }}, function(err, result){
        	return err ? res.sendStatus(404) : res.send(result);
        });

    } else if (req.query.type === 'post') {
        console.log('2');

        // TODO req.query.method -> array, search by multiple method
        Posts.find({[req.query.method]: { '$regex' : req.query.key, '$options' : 'i' }}, function(err,result){
            return err ? res.sendStatus(404) : res.send(result);
        });
    }
};

function addreply(req, res) {

    var reply = new Reply({
        "author":req.headers.cookie.username,
        "parentPost":req.query.postid,
        "content":req.body.content,
    });

    Posts.findOne({_id: req.query.postid}), function (err, user) {
        if (err) {
            return res.sendStatus(404);
        }
        user.reply.append(reply._id);
    };
    Reply.create(reply, function(err){
        if (err) {
            return res.sendStatus(400);
        }
    });
}

function userprofile(req,res){
    console.log('hi');
    var user = new Users();
    Users.findOne({_id: req.header.cookie.username}, function(err, result){
            res.render('otheruser',{result: result });
    });
}
module.exports.init = init;

module.exports.createUser = createUser;
module.exports.allUsers = allUsers;

module.exports.searching = searching;

module.exports.createPost = createPost;
module.exports.userprofile = userprofile;

module.exports.addreply = addreply;

module.exports.login = login;

