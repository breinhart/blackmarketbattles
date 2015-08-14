var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 9985));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
    response.render('pages/index');
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
    var id = setInterval(function() {
        ws.send(JSON.stringify(new Date()), function() {  })
    }, 1000)

    console.log("websocket connection open")

    ws.on("close", function() {
        console.log("websocket connection close")
        clearInterval(id)
    })
})


