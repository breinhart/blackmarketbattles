/**
 * Created by breinhart on 8/15/15.
 */
var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', (process.env.PORT || 9985));
app.use(express.static(path.join(__dirname, '../public')));
// views is directory for all template files
app.set('views', __dirname + '/views');

app.get('/', function(request, response) {
    response.sendFile(__dirname + 'index.html');
});

//catchall
app.use(function(req,res) {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

http.listen(app.get('port'), function(){
    console.log('listening on *:' + app.get('port'));
});

require('./routes/io.js')(app, io);



