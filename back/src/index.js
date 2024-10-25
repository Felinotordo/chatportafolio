const logger = require("morgan");
const express = require("express");
const path = require("path");
const app = express();
const { Server } = require("socket.io");
const { createServer } = require("node:http");
const port = process.env.PORT || 3000;

const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {},
});

io.on("connection", async (socket) => {
  console.log("user connection");
  socket.on("disconnect", () => {
    console.log("a user has disconect");
  });

  socket.on("chat msg", ({ msg, user }) => {
    console.log("message received: " + msg + " from " + user);
    io.emit("chat msg", { msg, user });
  });
});

app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "../../front/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../front/build", "index.html"));
});

server.listen(port, () => {
  console.log(`Escuchando en ${port}`);
});
