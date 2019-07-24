var express = require('express');
var app = express();
/* QUANDO É O EXPRESS QUE SOBE O SERVER
var server = app.listen(3000, () => {
    console.log('Server is running on port', server.address().port);
});
*/
//socket.io
var http = require('http').Server(app);
var io = require('socket.io')(http);
//mongoose
var mongoose = require('mongoose');

//?
app.use(express.static(__dirname));

//Body-Parser extracts the entire body portion of an incoming request stream and exposes it on req.body. 
//The middleware was a part of Express.js earlier, but now you have to install it separately.
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


//socket.io connect
io.on('connection', () => {
    console.log('a user is connected')
})

//mongodb connection
var dbUrl = 'mongodb://'
/*mongoose.connect(dbUrl, (err) => {
    console.log('mongodb connected', err);
})
*/

mongoose.connect(dbUrl ,{useMongoClient : true} ,(err) => {
    console.log('mongodb connected',err);
  })

//criado model para inserir no mongo
var Message = mongoose.model('Message',{
    name : String, 
    message : String
});


//routes
app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
})

app.post('/messages', (req, res) =>{
    var message = new Message(req.body);
    message.save((err)=>{
        if(err)
            sendStatus(500)
        io.emit('message', req, body);
        res.sendStatus(200);
    })
})

/* //Without socket.io
app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if(err)
            sendStatus(500);
        res.sendStatus(200);
    })
})*/

var server = http.listen(3001, () => {
    console.log('Server is running on port', server.address().port);
})