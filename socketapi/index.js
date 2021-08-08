const server = require("http").createServer();
var mqtt = require('mqtt');
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

const MQTT_SERVER = "203.159.93.64";
const MQTT_PORT = "1883";
//if your server don't have username and password let blank.
const MQTT_USER = "treeauto"; 
const MQTT_PASSWORD = "P@ssw0rd";

// Connect MQTT
var client = mqtt.connect({
  host: MQTT_SERVER,
  port: MQTT_PORT,
  username: MQTT_USER,
  password: MQTT_PASSWORD
});

client.on('connect', function () {
  console.log("MQTT Connect");
  client.subscribe('#', function (err) {
      if (err) {
          console.log(err);
      }
  });
});

client.on('message', function (topic, message) {
  console.log("topic["+topic+"]");
  console.log(message.toString());
  io.in("1234").emit(NEW_CHAT_MESSAGE_EVENT, message.toString());
});

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);
  const { roomId } = socket.handshake.query;
  socket.join(roomId);
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    console.log("data ");
    console.log( data);
    const myJSON = JSON.stringify(data);
    client.publish("DATA",myJSON);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(roomId);
  });
});


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
