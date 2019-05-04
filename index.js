const express = require('express'),
    app = express(),
    passport = require('passport'),
    auth = require('./auth'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session'),
    bodyparser = require('body-parser'),
    mongoose = require('mongoose'),
    secret = require('./secret'),
    db = require('./db'),
    port = process.env.PORT || 8080;
const conn_str = `mongodb://${secret.dbuser}:${secret.dbpassword}@ds149706.mlab.com:49706/todo-db`;
mongoose.connect(conn_str, { useNewUrlParser: true });
auth(passport);
app.use(passport.initialize());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieSession({
    name: 'session',
    keys: ['andthetruthisiamironman'],
    maxAge: 24 * 60 * 60 * 1000
}));

app.use(cookieParser());
app.use(express.static('public'));


app.get('/', (req, res) => {
    if (req.session.token) {
        console.log("token: " + req.session.token);
        res.cookie('token', req.session.token);
        res.sendFile(__dirname + '/public/index1.html');
    } else {
        res.cookie('token', '');
        //res.redirect('/auth/google');
        res.sendFile(__dirname + '/public/login.html');
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        console.log(req.user);
        req.session.token = req.user.token;
        res.redirect('/');
    }
);

app.get('/gettodo', (req, res) => {
    if(req.session.token){
        db.todomodel.findOne({'_id': req.session.passport.user.profile.id}, 
        function(err, result){
            //console.log(result);
            if (err) {res.send(500, {"message":"failure"});}
            else res.json(result.todos);
        });
    }
    else
        res.json([]);
});

app.post('/settodo', (req, res) => {
    if(req.session.token){
        db.todomodel.findOneAndUpdate({'_id': req.session.passport.user.profile.id}, {'todos': req.body.body}, {upsert:true}, 
        function(err, result){
            if (err) res.send(500, {"message":"failure"});
            else res.send(200, {"message":"success"});
        });
    }
    else{
        res.send(500, {"message":"failure"});
    }

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});