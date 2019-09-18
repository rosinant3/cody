const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
// app   
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
	handlePreflightRequest: (req: any, res: any) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
});
 
// socket handler

const socketHandler = require('./application/sockets/socket_handler');

const knex = require('knex')(require('./knexfile'));
const cookieParser = require('cookie-parser');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const fs = require('fs');
const dir = './public/users';
const path = require('path'); 

if (!fs.existsSync(dir)){
   
	fs.mkdirSync(dir);

}

app.use(fileUpload());
app.use("/public", express.static(path.join(__dirname, 'public')));

const uuid = require('uuid/v4');
 
// ROUTES 

const user = require('./application/routes/user-routes');
  

// Express ACCESS-CONTROL CORS ACTIVATION
 
app.use(function(req :any, res :any, next :any) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
  "Origin, X-Requested-With, Content-Type, Accept");
  next();

});

// SESSION (Needs to be above router calls, else it won't work.)

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// knex session store

const store = new KnexSessionStore({

  knex: knex,
  tablename: 'sessions' // optional. Defaults to 'sessions'

});
  
const geheim = uuid();
// passport-session 
 
app.use(session({
  
  genid: (req: any) => {

    return uuid(); // use UUIDs for session IDs
     
  },
  secret: geheim, //pick a random string to make 
  // the hash that is generated secure
  resave: false, //required
  saveUninitialized: false, //required
  store: store,
  cookie: {

    originalMaxAge: Number((6.307E+10).toFixed(20)),
    maxAge: Number((6.307E+10).toFixed(20)),
    expires: Number((6.307E+10).toFixed(20)),

  }

})
);

app.use('/user/', user);

// PORT

app.listen(5000, () => { console.log(`Server 
running on http://localhost:5000`)});
app.use(express.static('public'));


// socket.io

server.listen(8000);

io.on('connection', socketHandler.default);

