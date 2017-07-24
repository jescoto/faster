/**
 * Created by donbrad on 6/11/16.
 */

var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    port = process.env.PORT || 5001,
    publicDir = process.argv[2] || __dirname + '/public',
    path = require('path'),
    request = require('request');

var linkedin = require('node-linkedin-distributed')('86wj17b2y7xpnq', 'GKJelA4fBQum1yQN', 'https://gaiahost/oauth/linkedin/callback');


app.set('port', (process.env.PORT || 5001));

app.use(compression());

app.use(function(req, res, next) {
    if(req.headers['x-forwarded-proto'] !== 'https'  && process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
        var secureUrl = "https://" + req.headers['host'] + req.url;
        res.writeHead(301, { "Location":  secureUrl });
        res.end();
    }
    next();
});


app.get("/oauth/google", function (req, resp) {

    var resObj  = {status : 'OK', data : null,  error: null};

    resp.location('#/oauth/google/callback');
    resp.end();

});

app.get("/oauth/liveid", function (req, resp) {

    var resObj  = {status : 'OK', data : null,  error: null};

    resp.location('#/oauth/liveid/callback');
    resp.end();

});


app.get("/oauth/twitter", function (req, resp) {

    var verifier = req.query.oauth_verifier;

    resp.redirect('oauth/twitter/callback?verifier='+verifier);
});

app.get('/oauth/linkedin', function(req, res) {
    var scope = ['r_basicprofile', 'r_emailaddress'];
    // This will ask for permisssions etc and redirect to callback url.
    linkedin.auth.authorize(res, scope);
});


app.get('/oauth/linkedin/callback', function(req, res) {
    linkedin.auth.getAccessToken(res, req.query.code, req.query.state, false, function(err, results) {
        var resObj  = {status : 'OK', data : null,  error: null};
        if ( err ) {
            resObj.error = err;
            resObj.results = results;
            res.location('#/oauth/linkedin/callback');
            res.send(resObj);
        } else {
            resObj.results = results;

            linkedin.people(function(err, data) {

                resObj.error = error;
                resObj.data = data;
                res.location('#/oauth/linkedin/callback');
                res.send(resObj);
            });
        }


        /**
         * Results have something like:
         * {"expires_in":5184000,"access_token":". . . ."}
         */

        console.log(results);
        //return res.redirect('/#');
    });
});


app.get("/linkedinprofile", function (req, resp) {
    linkedin.people.me(function(err, data) {
        var resObj  = {status : 'OK', data : null,  error: null};
        resObj.error = error;
        resObj.data = data;

        resp.send(resObj);
    });

});


app.use(express.static(publicDir));


app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
}));

console.log("bff from  %s listening on port %s", publicDir, port);
app.listen(port);