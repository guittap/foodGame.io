//killall -9 node if error

var express = require('express');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

//if there is url parameter
app.get("/:word", function(req, res) { 
  let word = req.params.word;
  res.sendFile( __dirname + "/public/lobby.html");
});


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);
var rooms = {};

class foodRoom
{
  constructor()
  {
    this.gameStarted=false;
    this.host;
    this.players=[];
  }
}

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', function (socket) 
{
  socket.on('joinroom', function(data) 
  {

    //maybe i should do a limbo phase before joining room?

    this.join(data.room); //socket io join function

    //set name
    socket.nickname=data.nickname;
    if (typeof rooms[data.room] === 'undefined') //then player creating is the host!
    {
      console.log("new host!");

      rooms[data.room] = new foodRoom(); 
      rooms[data.room].host = socket.id; //set the host to host's id
      rooms[data.room].players.push({nickname: data.nickname, id: socket.id}); //add player to game
    }
    else if (rooms[data.room].gameStarted == false) //then it's ok to join!
    {
      console.log("lame joiner");

      socket.emit('requestName'); //new users must give their name. only the host gives name before joining
      socket.on('getName', function(name)
      {
        rooms[data.room].players.push({nickname: data.nickname, id: socket.id}); //add player to game
      });

      console.log("does code get here? idk");
    }
    else //it's not ok to join... 
    {
      //TODO: kick player! (maybe give a message as to why??)
    }

    //TODO: if here then update user's lists! because some joined or attempted to...

    //io.to(data.room).emit("new user", rooms[data.room].count); 

    socket.on('disconnect', function() {
      //splice to remove
      for (let i=0; i<rooms[data.room].players.length; i++)
      {
        if (rooms[data.room].players[i].id == socket.id)
        {
          rooms[data.room].players.splice(i, 1); //removes from list!
        }
      }
      console.log("Client has disconnected");
      //TO DO: update clients to up refresh lists or wateva
    });
  });
}
);

