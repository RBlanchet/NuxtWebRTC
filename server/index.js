const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const {createServer} = require('http');
const socketIo = require('socket.io');

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
config.dev = process.env.NODE_ENV !== 'production';

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  const httpServer = createServer(app);
  const io = socketIo(httpServer);

  let activeSockets = [];
  io.on('connection', socket => {
    const existingSocket = activeSockets.find(activeSocket => activeSocket === socket.id);

    if (!existingSocket) {
      activeSockets.push(socket.id);

      // Emet à tous les utilisateurs de la liste des socket actifs
      socket.emit('UPDATE_USERS_LIST', {
        users: activeSockets.filter(activeSocket => activeSocket !== socket.id),
      });

      // Emet à tous le monde sauf celui qui se connecte de la connexion de l'utilisateur
      socket.broadcast.emit('UPDATE_USERS_LIST', {
        users: [socket.id],
      });
    }

    socket.on('disconnect', () => {
      // Lorsqu'un Socket se désactive, on supprime l'utilisateur de la liste et on l'emet
      activeSockets = activeSockets.filter(activeSocket => activeSocket !== socket.id);
      socket.broadcast.emit("REMOVE_USER", {
        user: socket.id,
      });
    });
  });



  // Listen the server
  httpServer.listen(port, host);

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}

start();

