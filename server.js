const net = require('net');
const repl = require('repl');
let connections = [];


let server = net.createServer(function (socket) {
  let r = repl.start({
      prompt: '=> '
    , input: socket
    , output: socket
    , terminal: true
    , useGlobal: false
  });
  r.question('What is your name? ', (ans)=>{
    socket.sender = ans;
    console.log(`Welcome ${socket.sender}!`);
    r.setPrompt(socket.sender+'=> ');
    connections.push(socket.sender)
  });
  r.on('exit', function () {
    socket.end()
  });

  r.context.socket = socket
  r.defineCommand('speak', {
    help: 'Speak',
    action(text) {

        console.log(`${socket.sender}: ${text}`);
        this.displayPrompt();
    }
  });
  r.defineCommand('here', {
    help: 'Here',
    action() {

        server.getConnections((err,count)=>{
          if (err) {
            console.log(err);
          }
          if (count < 2) {
            console.log(`There is ${count} connection`);
          }else {
            console.log(`There are ${count} connections`);
          }

          connections.forEach(
            (name)=>{
              console.log(name);
            }
          )
        })

      this.displayPrompt();
    }
  });
  r.defineCommand('saybye', function saybye() {
    console.log('Goodbye!');
    this.close();
  });

});

// listen on local port
server.listen(45);

//max connections
server.maxConnections = 8;
