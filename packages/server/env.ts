if (process.env.NODE_ENV === 'development') {
  process.env.DEBUG = 'socket.io:socket,socket.io:client,server:backup';
}
