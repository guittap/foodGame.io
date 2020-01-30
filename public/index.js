var socket = io('/');
var globTest;


function createRoom()
{
  let randString = Math.random().toString(13).replace('0.', ''); //testing
  //TO DO: check with server to make sure this lobby doesn't already exist... or weirdness happens

  localStorage.setItem("name", document.getElementById("hostName").value);

  window.location = window.location.href + randString;
}

function lobbyLoaded()
{
  console.log(localStorage.getItem("name"));

  console.log(window.location.pathname.split('/')[1]); 
  //this is the first part of the URL

  //send nickname incase they are host
  socket.emit("joinroom", {nickname: localStorage.getItem("name"), room: window.location.pathname.split('/')[1]});

  socket.on("goodToJoin", function(boolHost) {
    if (boolHost)
    {
      //unhide host goodies
      document.getElementById("divPlacesPer").style.display="block";
      document.getElementById("buttonStartGame").style.display="block";
    } 
    else
    {
      //prompt for Name
      let name = prompt("What is your name?");
      socket.emit("nameMessage", name);
    }

    //if host or not host and goodToJoin, then show current names
    document.getElementById("playersDiv").style.display="block";
  });

  socket.on("lobbyUpdate", function(data) {
    let newPlayerText = "";

    for (i=0; i<data.players.length; i++)
    {
      newPlayerText += i+1 + ". ";
      newPlayerText += data.players[i].nickname;
      newPlayerText += "</br>";
    }

    document.getElementById("playerSpot").innerHTML = newPlayerText; 
  });
}

