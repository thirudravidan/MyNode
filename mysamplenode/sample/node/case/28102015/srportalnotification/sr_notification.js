var config = require('./config');
var settings = config.settings();

var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Reminder = require('reminder');
var remind = new Reminder();
var mysql = require('mysql');
var nodemailer = require('nodemailer');
var notifiCtrl = require('./utils/result/notification.js');
var mailer = require('./utils/result/mailtemplate.js');

GLOBAL.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mnagas@gmail.com',
        pass: 'america321'
    }
});

GLOBAL.connection;
function handleDisconnect(connection) {
  connection.on('error', function(err) {
      if (!err.fatal) {
        return;
      }

      if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            console.log(err); // 'ECONNREFUSED'
            console.logger.error(err);
            process.exit(code=0);
      }
      console.log('Re-connecting lost connection: '+ err.code );
      console.logger.info('Re-connecting lost connection: '+ err);
      GLOBAL.connection = mysql.createConnection(connection.config);
      handleDisconnect(GLOBAL.connection);
      GLOBAL.connection.connect();
  }); 
}

server.on('listening', function() {
  console.log("listening");
  connection = mysql.createConnection({
     host: settings.db.host,
     user: settings.db.user,
     password: settings.db.password,
     database: settings.db.database
  });
  
  // Handle Connect
  connection.connect(function(err) {
      if(err===null) {
         remind.at('00:02', function(date) {
            notifiCtrl.getOverDueProjectPlanDet(function (res){  
              console.log(res);             
            });
          });

          remind.every('minute', function(date) {
              // console.log("Every 1 Minute");
             notifiCtrl.getNotificationDetails(function (res){
                if (res.length > 0) {
                    res.forEach(function (val, key) {
                      io.sockets.in(val.user_id_fk).emit('eventToEmit', {'ncnt': val.cnt});
                      // if (val.notification_type == 'projectplan') {
                      //     typeText = val.cnt +' Overdue tasks';
                      //     io.sockets.in(val.user_id_fk).emit('eventToEmit', {'ncnt': val.cnt,'ntype': val.notification_type});
                      // }
                      // else if(val.notification_type == 'mom'){
                      //   typeText = val.cnt +' New Meetings';
                      //   io.sockets.in(val.user_id_fk).emit('eventToEmit', {'ncnt': val.cnt,'ntype': val.notification_type});
                      // }                      
                    });
                }
            });             
          });

      } else {
        console.log(err); // 'ECONNREFUSED'
        console.logger.error(err);
        process.exit(code=0);
      }
  });        
  handleDisconnect(connection);       
});

server.on('close', function(error) {
  console.log("Server Socket Closed");
	console.logger.info("Server Socket Closed" + error);
});

server.on('error', function(error) {      
  switch (error.errno) {
      case "EADDRNOTAVAIL":
          console.log("Invalid IP specified in the config file.");
          
      break;
      default:
          console.log("Unknown Error:" + error);
  }
  console.logger.error(error);
  server.listen(settings.server.port, settings.server.ip); 
  //process.exit(code=0);
});

  
io.on('connection', function(socket) {  
  socket.join(socket.handshake.query.usrID);
  console.log("Client Connected");
  console.log(socket.handshake.query.usrID);
  console.log(socket.id);
  socket.on("error", function(error) {
     console.log ("Socket Error"+error);
     console.logger.error(error);
  });
  socket.on('end', function() {
      console.log('Client Disconnected Id:'+socket.id);    
  });
 
 socket.on('close', function() {
      console.log('Client Closed Id:'+socket.id);	     
 });

 socket.on('disconnect', function(){
    console.log('User disconnected...');
    // console.log(socket.handshake.query);
    socket.leave(socket.handshake.query);
  });

  socket.on("drain", function() {
     console.log ("Drain, Bytes Written:"+ socket.bytesWritten);
  });
  var msg =''; 
  
  socket.on('message', function(data) {
        
  }).on('data', function(raw) {
    msg += raw;
    //console.log(msg)
    console.log(msg.charCodeAt(msg.length-1))
    if (0 == msg.charCodeAt(msg.length-1)) {
      socket.emit('message', msg.substring(0, msg.length-1));
      msg = '';
    }
  }); // on data

});

server.listen(settings.server.port, settings.server.ip); 

process.on('uncaughtException', function(err) {
  console.log("Uncaught Error Stack:"+ err.stack);
  console.log("Uncaught Error Message:"+ err.message);
});





    
    