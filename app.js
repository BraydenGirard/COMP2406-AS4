var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var fs = require('fs');
var songParser = require('./song-parser');
var http = require('https');

var routes = require('./routes/index');

var app = express();

var options = {
  key: fs.readFileSync('keys/comp2406-private-key.pem'),
  cert: fs.readFileSync('keys/comp2406-cert.pem')
};

// view engine setup
// NOTE: Needs to be removed when on local host
//app.locals.pretty = true; 
// NOTE: Needs to be added for local host
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/images/favicon.ico')); 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// NOTE: Next 4 lines needed for local host
app.use(express.static(path.join(__dirname, 'public')));
app.use('public/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
app.use('public/vendor/jquery', express.static(path.join(__dirname, 'public/vendor/jquery')));
app.use('public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
app.use(cookieParser('COMP2406 rules!'));
app.use(session());

app.use(function(req, res, next){
  console.log('-------------------------------');
  console.log('req.path: ', req.path);
  /*
  console.log('HEADER:');

  for(var x in req.headers) 
    console.log(x + ': ' + req.headers[x]);
*/
  next();
});

//list routes
app.get('/', routes.index);
app.get('/songs', routes.songs);
app.post('/search', routes.search);
app.post('/detail', routes.detail);

//Can be called by spamming upload button (possible issue...)
app.post('/upload', function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        // `file` is the name of the <input> field of type `file`
        var old_path = files.userSong.path,
            file_size = files.userSong.size,
            file_ext = files.userSong.name.split('.').pop(),
            index = old_path.lastIndexOf('/') + 1,
            file_name = old_path.substr(index),
            new_path = path.join(process.env.PWD, '/uploads/', file_name + '.' + file_ext);
        fs.readFile(old_path, function(err, data) {
            if (err) {
                res.status(500);
                res.json({'success': false});
            } else {
                songParser.parseUpload(data.toString());
                res.status(200);
                res.json({'success': true});
            }
        });
    });
});


//serve static files from public directory.
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// NOTE: Remove and test without on desktop before submission
//app.listen(process.env.PORT);
//console.log('Express server started on port %s', process.env.PORT);
// NOTE: Needed to run on local host
http.createServer(options, app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port') +
	      ' in ' + app.get('env') + ' mode.');
});


//module.exports = app;
