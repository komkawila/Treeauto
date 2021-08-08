const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const SerialPort = require('serialport')
// const serialport = new SerialPort('com23', {
//   baudRate: 115200,
//   autoOpen: true
// })

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const serialport = new SerialPort('com27', {
  baudRate: 115200
})

var connectArd = function() {
  // var serialport = new SerialPort();
  // serialport.open(arduinoPort, {
  //   baudRate: 9600,
  //   dataBits: 8,
  //   parity: 'none',
  //   stopBits: 1,
  //   flowControl: false
  // });
  // const serialport = new SerialPort('com23', {
  //   baudRate: 115200
  // })
  serialport.on('open', function(){
    console.log('Serial Port Opend');  
  });
  // do something with incoming data
  serialport.on('data', function (data) {
    var str=data.toString();
        if(str.indexOf('#') != -1 && str.indexOf('@') != -1 ){
            console.log('Data:', data.toString());
           
        }
  });

  serialport.on('close', function(){
    console.log('ARDUINO PORT CLOSED');
    reconnectArd();
  });

  serialport.on('error', function (err) {
    console.error("error", err);
    reconnectArd();
  });

}

connectArd();
var reconnectArd = function () {
  console.log('INITIATING RECONNECT');
  setTimeout(function(){
    console.log('RECONNECTING TO ARDUINO');
    connectArd();
  }, 2000);
};
// serialport.on('open', function(){
//   console.log('Serial Port Opend');  
// });
io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    console.log("data ");
    console.log( data);
    
    serialport.write(data.body);
    // serialport.on('open', function(){
      // console.log('Serial Port Opend'); 
    // });
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

