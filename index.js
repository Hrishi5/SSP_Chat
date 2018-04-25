const express = require('express') ;
var app = express() ;
var http =require('http').Server(app) ;
//const hbs = require('hbs') ;
var io = require('socket.io')(http) ;
var dao = require('./basedao.js') ;
const bodyParser = require('body-parser') ;
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname + '/public')) ;
//app.set('view engine', 'hbs') ;
app.get('/',(req,res)=> {
    res.sendFile(__dirname + '/public/login.html') ;
}) ;


io.on('connection', function(socket) {
    socket.on('newMessage',function(data){
        dao.insertChat(data) ;
        console.log(data) ;
        socket.broadcast.emit('newMessage',data) ;
    }) ;
}) ;

app.post('/getConversations',(req,res)=> {
    conversations = dao.getChats(req.body.from,req.body.to)
    if(!conversations) {
    res.send({status:1, response:conversations}) ;
    }else{
        res.send({status:0,response:'No conversations found'})
    }
})

app.post('/searchUser',function(req,res){
    id = req.body.key ;
    //Change this
    res.send({status:"1", response:
              [{key:"12345",value:"Hrishikesh D"},
              {key:"67890",value:"Dwayne Johnson"}]
             })
})

app.post('/createConversation',(req,res)=> {
    conversations = dao.getChats(req.body.from,req.body.to)
    if(!conversations) {
    res.send({status:1, response:conversations}) ;
    }else{
        res.send({status:0,response:'No conversations found'})
    }}
    ) ;

http.listen(7000, function() {
    console.log("Chat server started") ;
}) ;
/*app.listen(7000,() => {
    console.log("Chat server is on")
192.168.0.11

}) ;*/