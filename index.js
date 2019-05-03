const express = require('express'),
    app = express(),
    passport = require('passport'),
    auth = require('./auth'),
    cookieParser = require('cookie-parser'),
    cookieSession = require('cookie-session');

auth(passport);
app.use(passport.initialize());

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

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});