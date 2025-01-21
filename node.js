const {pack} = require('msgpackr/pack');
const {unpack} = require('msgpackr/unpack');
const {MongoClient} = require('mongodb');
const http = require('http');
const fs = require('fs');
const {WebSocketServer} = require('ws');
const ytdl = require('ytdl-core');

const client = new MongoClient('mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority');
const tokens = new Set(), sockets = new Set();
const valid = (token, username) => tokens.has(`${token}:${username}`);
const auth = async({username, type, password}, socket) => {
  if (type === 'signup' && (username === undefined || username === '')) return socket.send({status: 'error', message: 'Blank account.'});
  if (password === undefined || password === '') return socket.send({status: 'error', message: 'Invalid password.'});
  if (username.split('').some(a => [' ', '@', '[', ']', '#'].includes(a)) || username.length > 15) return socket.send({status: 'error', message: 'Invalid username.'});
  const item = await db.findOne({username}), token = Math.random();
  if (type === 'signup') {
    if (item !== null) return socket.send({status: 'error', message: 'This account already exists.'});
    await db.insertOne({username, password, playerdata: '{}'});
  } else if (type === 'login') {
    if (item === null) return socket.send({status: 'error', message: 'This account does not exist.'});
    if (item.password !== password) return socket.send({status: 'error', message: 'Incorrect password.'});
  } else return;
  socket.send({status: 'success', token});
  tokens.add(`${token}:${username}`);
}
const database = async({token, username, type, key, value}, socket) => {
  if (!token) return socket.send({status: 'error', message: 'No token.'});
  if (!valid(token, username)) return socket.send({status: 'error', message: 'Invalid Token! The Authentication Servers may have restarted since you last logged in. Login again to fix the problem.'});
  if (type === 'get') {
    socket.send({status: 'success', type, data: await db.findOne({username}, {projection: {password: 0}})});
  } else if (type === 'set') {
    await db.findOneAndUpdate({username}, {$set: {[key]: value}});
  }
}

let db;
(async () => {
  await client.connect();
  db = client.db('data').collection('data');
})();

const server = http.createServer((req, res) => {
  if (req.url.includes('/download')) {
    if (!ytdl.validateID(req.url.replace('/download', '').replace('.mp4', ''))) return res.end('Bad ID format');
    res.setHeader('Content-Type', 'octet-stream');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    ytdl(`https://youtube.com/watch?v=${req.url.replace('/download', '').replace('.mp4', '')}`, {filter: 'videoandaudio', quality: 'highest'}).pipe(res);
  } else res.end(fs.readFileSync('./public/js/pixel-tanks.js'));
});
const wss = new WebSocketServer({server});
wss.on('connection', function connection(ws) {
  ws._send = ws.send;
  ws.send = data => ws._send(pack(data));
  sockets.add(ws);
  ws.on('error', console.error);
  ws.on('message', data => {
    try {
      data = unpack(data);
    } catch(e) {
      return ws.close();
    }
    if (!ws.username) ws.username = data.username;
    if (data.op === 'database') database(data, ws);
    if (data.op === 'auth') auth(data, ws);
  });
  ws.on('close', (a, b, c) => {
    console.log('close: '+a+' '+b+' '+c);
    sockets.delete(ws)
  });
});
server.listen(443);
