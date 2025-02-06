const settings = {
  authserver: 'localhost',
  players_per_room: 20,
  upsl: 120,
  port: 80,
  chat: true,
  whitelist: true,
}

const fs = require('fs'), fetch = require('node-fetch');
const {Client, GatewayIntentBits} = require('discord.js');
const {exec} = require('child_process');
const {pack} = require('msgpackr/pack');
const {unpack} = require('msgpackr/unpack');
const {WebSocketServer} = require('ws');
const {dalle, gpt, bing} = require('gpti');

// START AUTH SERVER
const {MongoClient} = require('mongodb');
const http = require('http');

const client = new MongoClient('mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority');
const tokens = new Set();
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
  //if (!valid(token, username)) return socket.send({status: 'error', message: 'Invalid Token! The Authentication Servers may have restarted since you last logged in. Login again to fix the problem.'});
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

const server = http.createServer((req, res) => res.end(fs.readFileSync('./public/js/pixel-tanks.js')));
const wss = new WebSocketServer({server});
// END AUTH SERVER

Array.prototype.release = () => {}

console.log('Starting Server');
console.log('Compiling Engine');
fs.writeFileSync('engine.js', [`const PF = require('pathfinding');`, fs.readFileSync('./public/js/Engine.js'), fs.readFileSync('./public/js/Tank.js'), fs.readFileSync('./public/js/Block.js'), fs.readFileSync('./public/js/Shot.js'), fs.readFileSync('./public/js/AI.js'), fs.readFileSync('./public/js/Damage.js'), fs.readFileSync('./public/js/A.js'), 'module.exports = {Engine, Tank, Block, Shot, AI, Damage, A}'].join(''));
console.log('Compiled Engine');
const {Engine, Tank, Block, Shot, AI, Damage, A} = require('./engine.js');
A.createTemplate('arr', Array, a => (a.length = 0));
console.log('Loading Server Properties');
const Storage = {key: ['owners', 'admins', 'vips', 'mutes', 'bans', 'filter', 'whitelist']};
for (const p of Storage.key) Storage[p] = fs.existsSync(p+'.json') ? JSON.parse(fs.readFileSync(p+'.json')) : [];
console.log('Loaded Server Properties');
process.stdin.resume();
const save = () => {
  for (const p of Storage.key) fs.writeFileSync(p+'.json', JSON.stringify(Storage[p]));
}
for (const p of ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException']) process.on(p, save);
process.on('uncaughtException', (err, origin) => {
  for (const socket of sockets) if (['bradley', 'Celestial', 'cs641311'].includes(socket.username)) socket.send({status: 'error', message: `Error: ${err} Origin: ${origin}`});
  console.error(err);
  process.exit(0);
});
const m = o => Math.max(0, Math.min(59, o)), m2 = o => Math.max(-1, Math.min(60, o));

let sockets = new Set(), servers = {}, ffaLevels = [
  [1,'battlegrounds','R968I9X6QX2I9R33IX2IXZX5Q5X5IX4IR33IX4IXI5X3GX5IXIX2IR33I2X3IXIX3IX4ZGX3IXI2XIR33IX4IXIX3IX3GX6GX3IR33IZI4XI3GIX4QX4IXI4R33IX15QX3IX5IR33IX6I2X7QXI2X6IR33IXZ4XI10QI2XZ2X3IR33X2Z4X2QX4QX2IXIX2Z2Q3XR33X4Z2X2I2XIX6IX2Z2X2Q2R33X8IX2GZI2GIXIXQZ2XGX2R33I4X4IX2IX3ZX2IQ2Z2XGX2R33X3IX4IQXIXSXIXQIX2Z2XG2XR33X3IQ2X2IX2ZX3IX2IX2Z2X4R33X3IXQ2XIXIGI2ZGX2IX8R33X3IXQ3IX6IXI2X2I4X2R33X3IX4IXIX2QX4QX2IX2IX2R33IGI2X3I2QI10XIX2IXIR33IX6I2X9I2XIGI2XIR33IX5IX4I3X4QX7IR33I4XIX5GXIXGXGQ2XI4ZIR33IX3GX6IXIX2ZX2QXIX4IR33IXI2XIQ2ZX2IXGXGXGXQ2IX3I2R33IX2IXIXZQ2XI3X6QIX4IR33IX4IX3QX11ZXIX2IR33I9X9I9R1045'],
  [1,'battlegrounds','R494I19R40IX8QXQX8IR39IX9ZX9IR39IXZI3X3QXQX3I3ZXIR40IX3I3X5I3X3IR41IX3IX2I2GI2X2IX3IR41IX3ZX9ZX3IR41IX3ZX9ZX3IR41I2X2IX9IX2I2R42IZI6ZI6ZIR42I2X3IX7IX3I2R40IX5QX7QX5IR38I3Z2IXIZX5ZIXIZ2I3R37IX5I2XGX3GXI2X5IR36I2XQXQX2GX7GX2QXQXI2R35I2X2ZX3IX3SX3IX3ZX2I2R35I2XQXQX2GX7GX2QXQXI2R36IX5I2XGX3GXI2X5IR37I3Z2IXIZX5ZIXIZ2I3R38IX5QX7QX5IR40I2X3IX7IX3I2R42IZI6ZI6ZIR42I2X2IX9IX2I2R41IX3ZX9ZX3IR41IX3ZX9ZX3IR41IX3IX2I2GI2X2IX3IR41IX3I3X5I3X3IR40IXZI3X3QXQX3I3ZXIR39IX9ZX9IR39IX8QXQX8IR40I19R1287'],
  [1,'battlegrounds','R505IR58I3R56I5R54I7R31I52R8IX17GX13GX18IR8IX17GX13GX18IR8IX5QXQX3QXQX3IX5IXIX5IX3QXQX3QXQX6IR8IX6GX5GX4IX4I2XI2X4IX4GX5GX7IR8IX5QXQX3QXQX3IX3IXG3XIX3IX3QXQX3QXQX6IR8IX15I3X2IXR2XR2XIX2I3X16IR8IX5QXQX3QXQXIX6RX3RX6IXQXQX3QXQX6IR8IX6GX5GX2IX8SX8IX2GX5GX7IR8IXIGIXQXQX3QXQXGX4IXRX3RXIX4GXQXQX3QXQX2IGIXIR8IXIXI12GX2I3XR2XR2XI3X2GX2I11XIXIR8I2X3IR10IXIX3I2G3I3X2IXIXIXR8IX3I2R8IX5IRI5R2I3X15I3R2I5R2IX5IR8IX5I2X5I2X2IX6QXQX6IX2I2X5I3X5IR8IX16GX7GX7GX17IR8IX16GX6QXQX6GX17IR8IX5I2X5I2X2IX15IX2I2X5I3X5IR8IX5IRI5R2I3X15I3R2I5R2IX5IR8IX4IR12I6GQGI6R13IX4IR8IX3I12R2I4RIQ3IRI4R2I13X3IR8IX3GX11I2X4I2XGXI2X4I2X12GX3IR8IX3GX11GX7Q3X7GX12GX3IR8I2X2I11XI2X4I2XGXI2X4I2XI12G2I2R8I2X12I2RI5RIQ3IRI4RI2X14I2R8I2X12IR3I6XQXI5R3IX14I2R8IX4QX3QX4IR2IX6QGQX5IR2IX4QX3QX6IR8IX5ZXZX5I4X7QX6I4X5ZXZX7IR8IX6GX9ZX6Q3X5ZX9GX8IR8IX5ZXZX8ZX7GX6ZX8ZXZX7IR8IX4QX3QX4I4X6Q3X5I4X4QX3QX6IR8IX13IR2IX7QX6IR2IX15IR8I2X12IR3I6XQXI5R3IX14I2R9I2X11IR9I3R8IX13I2R11I13R20I15R850'],
  [1,'gem','R1096I23R37IX5IX7GXIX5IR37IXZXQXIXGXI3XGXIXQXZXIR37IX2GX2IXGX7IX2GX2IR37IXQXZXI5XI5XZXQXIR37IX21IR37IXI19XIR37IXIR17IXIR36XQZI19ZQXR33X3QX2QIX6ZX6IQX2QX3R30X4IX2I3G2X7G2I3X2IX4R29XQXIX3IXQX3I2ZI2X3IXQX3IXQXR28X2QXIX3IXIX3IX3IX3IXIX3IXQX2R27XGQX5IXIX3ZXSXZX3IXIX5QGXR27X2QXIX3IXIX3IX3IX3IXIX3IXQX2R28XQXIX3QXIX3I2ZI2X3QXIX3IXQXR29X4IX2I3G2X7G2I3X2IX4R30X3QX2QIX6ZX6IQX2QX3R33XQZI19XQXR36IXIR17IXIR37IXI19XIR37IX21IR37IXQ2X2I5XI5XZ2X2IR37IXQGZXIX9IXZGQXIR37IX2Z2XIXZXIXIXZXIX2Q2XIR37IX5IX9IX5IR37I23R921'],
  [1,'gem','R864IR57I2XI2R54IX5IR52IXIZXZIXI6R46IX3QX8IR46IXIZXZIXI4XIR47IX5IR3IXIR47I3XI3R3IXIR40I5RIX7IRI4R39IX5I2XIX3IXI2X5IR36I2X5I2XZX3ZXI2X5I2R33I2X2ZX3ZI2XIX3IXI2ZX3ZX2I2R30IX2IX2GXGXIX3IXIX3IXGXGX2IX2IR29IX2QX3QX2QX4SX4QX2QX3QX2IR29IX2IX2GXGXIX3IXIX3IXGXGX2IX2IR30I2X2ZX3ZI2XIX3IXI2ZX3ZX2I2R33IX6I2XZX3ZXI2X6IR36IX5I2XIX3IXI2X5IR38I2XI2RIX7IRI5R40IXIR3I3XI3R47IXIR3IX5IR47IXI4XIZXZIXIR46IX8QX3IR46I6XIZXZIXIR52IX5IR54I2XI2R57IR1174'],
  [1,'gem','R1771IR58IXIR56IX3IR54IX2SX2IR52IX7IR50IX4QX4IR48IX4IQIX4IR46IQX3QX3QX3QIR44IXGX3QX3QX3ZXIR42IX3IX3IQIX3IX3IR41IXGXIX4QX4IXZXIR40IXIXIXIX7IXIXIXIR38IX7IX5IX7IR36IX4IX4IXQXIX4IX4IR34IX4IXIX4IQIX4IXIX4IR33IX4GXGX4IXIX4ZXZX4IR33IX4GXGX4GXZX4ZXZX4IR33IX4IXIX4GXZX4IXIX4IR33IX5IX5GXZX5IX5IR33IX2G2X3G2X2IXIX2Z2X3Z2X2IR33IXIX2IGIX2IXIGIXIX2IZIX2IXIR34IX9IXGXIX9IR36I4G2I3X2IX2I3Z2I4R40IX4GXZQZXZX4IR44I5X2GX2I5R50IX3IR56IXIR58IR208'],
  [1,'gem','R968I2X23I2R33I3Z21I3R33XI3X19I3XR33XZI3X17I3ZXR33XZXI3G15I3XZXR33XZX2I3X13I3X2ZXR33XZX2GI3X11I3GX2ZXR33XZX2GXI3Z9I3XGX2ZXR33XZX2GX2I3X7I3X2GX2ZXR33XZX2GX2ZI3X5I3ZX2GX2ZXR33XZX2GX2ZXI3Q3I3XZX2GX2ZXR33XZX2GX2ZX2I3XI3X2ZX2GX2ZXR33XZX2GX2ZX2QI2XI2QX2ZX2GX2ZXR33XZX2GX2ZX2QX2SX2QX2ZX2GX2ZXR33XZX2GX2ZX2QI2XI2QX2ZX2GX2ZXR33XZX2GX2ZX2I3XI3X2ZX2GX2ZXR33XZX2GX2ZXI3Q3I3XZX2GX2ZXR33XZX2GX2ZI3X5I3ZX2GX2ZXR33XZX2GX2I3X7I3X2GX2ZXR33XZX2GXI3Z9I3XGX2ZXR33XZX2GI3X11I3GX2ZXR33XZX2I3X13I3X2ZXR33XZXI3G15I3XZXR33XZI3X17I3ZXR33XI3X19I3XR33I3Z21I3R33I2X23I2R1045'],
  [1,'ice','X3IX3IX3IX2R2XQX12R30X3IX3IX3I2XR2XIXGX2QXIX2IX2R30X3IX3IX3IX2R2QIXGXQ2X2IZI2XR30I2ZI3ZI3ZIXIR2XIXG2XQXZX5R30X14R2XIX5Z2X2QX2R30XI2X2Z6X3R2QIX4Z2X6R30X2IX2Z6X3R2XIXI2XZX2I2X3R30XI2X2ZXZXZ2XQXR2XIX3ZX4IX3R30X2IX9QXR2QIX2Z2X7QR30X2IX9QXR2XIXZ2I2X2G3XQR30XI2X3QXQX5R2XIXZI3X4GX2R30X4IXQXQ2X4R2QIX12R30X4IXIX2QX3GZ2QI12XR30X4IX2IX4QZQZ2GQX2QX2QX2QXQR42Z2SXQZR54ZQX2Z2R42Z2IZ3QZ5GZ2QZQX12R30IQ2GZ3QZ2QZ2QZ2GX2I2X3QX3IXR30IZIZQZ3I2ZIZ2R2X3I2ZX8R30ZQI2QGZ2Q2IQIGR2X5Z3X6R30IZ2IQ2Z2IQ3IZR2Q2X6Z4X2R30Z2I2Z5I3Z2R2XQ2X8ZX2R30IQIQZ2GQZQZQZ2R2X14R30Z3GZ2QZ3GZ2QR9X7R30ZI7Z2QZ3R2X8IXIXIQR30ZQ2ZGZ2IZ6R2XZXZ2XZXI5XR30I2Q2Z2QIQZ5R2XZXZX2Z2IX3IXR30ZGZQZQZIQZ2GQZR2X2Z3XZ2IX3IXR30Z5IZIZQ2Z3R2X2ZX2ZXZQX3IXR30Q2Z2QIZ6QZR2X2ZX5I5XR1830'],
  [1,'ice','R621IR58IXIR49I3R5IXIR5I3R40I2XI2R3I2XI2R3I2XI2R38IX5IRIX5IRIX5IR36I2X5I3XGXGXI3X5I2R35IX11SX11IR35I2X5I3XGXGXI3X5I2R36IX5IRIX5IRIX5IR38I2GI2R3I2GI2R3I2GI2R38I2X2IRIR2IX3IR2IRIX2I2R36IX4I2XI3X3I3XI2X4IR35IX3IX5IX3IX5IX3IR35IX3IXQXQXIX3IXQXQXIX3IR35IX3GX2GX2GX3GX2GX2GX3IR36I2XIXQXQXIX3IXQXQXIXI2R38I3X5IX3IX5I3R42I2XI3X3I3XI2R44I3XIRIX3IRIXI3R42IX4IRIX3IRIX4IR40I2GI4RI2GI2RI4GI2R38IX5IRIX5IRIX5IR36I2X5I3X5I3X5I2R35IX7GX7GX7IR35I2X5I3X5I3X5I2R36IX5IRIX5IRIX5IR38I2XI2R3I2XI2R3I2XI2R40I3R5I3R5I3R1349'],
  [1,'ice','R1282I7R52IZIX3IZIR50IXZXZXZXZXIR48IX2IX2GX2IX2IR39I2R5IX3IXZXZXIX3IR5I2R29I2X2I2R2IX4I2X3I2X4IR2I2X2I2R25I2X6I3Z2I3X5I3Z2I3X6I2R23I2X6I2X7IGIX7I2X6I2R20I2RI2X6I2X7IXIX7I2X6I2RI2R16IX2I3XZX2ZXI2X3I5XI5X3I2XZX2ZXI3X2IR14IX2ZX2GX2Q2X3GX3GX4SX4GX3GX3Q2X2GX2ZX2IR13IX2IX2GX2Q2X3GX3I5XI5X3GX3Q2X2GX2IX2IR14IX2I3XZX2ZXI2X7IXIX7I2XZX2ZXI3X2IR16I2RI2X6I2X7IGIX7I2X6I2RI2R20I2X6I3Z2I3X5I3Z2I3X6I2R23I2X6I2X5IX5IX5I2X6I2R25I2X2I2R2IX4I2X3I2X4IR2I2X2I2R29I2R5IX3IXZXZXIX3IR5I2R39IX2ZX2GX2ZX2IR48IXZXZXZXZXIR50I3X3I3R52I7R1051'],
  [1,'deep','R1090XQ2XZX3ZX4Q5X4ZX3ZXQ2XR29XQ2XZX3ZX6QX6ZX3ZXQ2XR29Q4ZQ3Z15Q3ZQ4R29XQ2XZX3ZX6QX6ZX3ZXQ2XR29XQ2XZX3ZX4Q5X4ZX3ZXQ2XR29Z4I5Q13I5Z4R29XQ2XI5Q13I5XQ2XR29XQ2XI5QX11QI5XQ2XR29Z4I5QX11QI5Z4R29XQ2XGX3GQXI2X2IX2I2XQGX3GXQ2XR29XQ2XGX3GQXI2X2IX2I2XQGX3GXQ2XR34G2R2QX5SX5QR2G2R39X2R2QX11QR2X2R39X2R2Z2I2X5I2Z2R2X2R39X2R2Z2I2X5I2Z2R2X2R39Q2R2Z4X2QX2Z4R2Q2R39X2R2Z4XQ3XZ4R2X2R39X2R6X2QX2R6X2R39X2R6X5R6X2R39G2R6X5R6G2R39X2QX4QX5QX4QX2R39X2QX4QX5QX4QX2R39X2I6QGQGQI6X2R39Q2I6GQGQGI6Q2R40X2GX3ZX5ZX3GX2R41X2GX3ZX5ZX3GX2R40XQI6QGQGQI6QXR39XQI6GQGQGI6QXR40X2GX3ZX5ZX3GX2R41X2GX3ZX5ZX3GX2R40XQI6QGQGQI6QXR39XQI6GQGQGI6QXR40X2GX3ZX5ZX3GX2R41X2GX3ZX5ZX3GX2R40XQI6QGQGQI6QXR39XQI6GQGQGI6QXR40X2GX3ZX5ZX3GX2R41X2GX3ZX5ZX3GX2R40XQI6QGQGQI6QXR39XQI6GQGQGI6QXR40X2GX3ZX5ZX3GX2R41X2GX3ZX5ZX3GX2R25'],
  [1,'deep','R305I26R34IX10QX3QX9IR34IX10ZX3ZX9IR34IX10QX3QX9IR31I4X4IX2I4X3I4X2IX3I4R28IX7I3X11I3X6IR28IX7I2X6ZX6I2X6IR28IXQX5I2X6ZX6I2X4QXIR28IQXQI6X6ZX6I5QXQI6R23IX4I5X2I3GXGI3X2I4X9IR23IX6QX4GX7GX3QX11IR23IX7QX2ZX9ZXQX12IR23IX6QX4GX7GX3QX11IR23IGI2Q3I2X3I3GSGI3X2I2Q3I2GIX4IR23IX2IX3QX4GX7GX3QX3IX2IX4IR23IX2GX4Q3ZX9ZQ2X4GX2IXZ2XIR23I4X3QX4GX7GX3QX3I4XQ2XIR26IX3I2X3I3GXGI3X2I2X3IX7IR26IX12ZX11IXG2X4IR26IX12ZX11IXG2X4IR26IX12ZX11IXG2X2QXIR26I8X4I3X4I7X7IR34I4R2IX18IR40IX6ZQX10IR40IX6ZQX4QX3QXIR40IX18IR40I20R1701'],
  [1,'deep','R61X58R2XQ2X7G2X7Z2X16Z2X7G2X7Q2XR2XQ2X7G2X7Z2X16Z2X7G2X7Q2XR2X58R2X4I5X4I5X4I14X4I5X4I5X4R2X4IX10IX8IX8IX8IX10IX4R2X4IX10IX8IX8IX8IX10IX4R2X4IXQ2X2Q2X3IX3Q2X3IX3Q2X3IX3Q2X3IX3Q2X2Q2XIX4R2X4IX10IX8IX8IX8IX10IX4R2X4IX9ZIZX6ZIZX6ZIZX6ZIZX9IX4R2X4IX9ZQZX6ZQZX6ZQZX6ZQZX9IX4R2X4IQ9ZQZX2Q2X2ZQZX2Q2X2ZQZX2Q2X2ZQZQ9IX4R2X4IX9ZQZX6ZQZX6ZQZX6ZQZX9IX4R2X4IX9ZIZX3SX2ZIZX6ZIZX6ZIZX9IX4R2X4IX10IX8IX8IX8IX10IX4R2X4IXQ2X2Q2X3IX3Q2X3IX8IX3Q2X3IX3Q2X2Q2XIX4R2X4IX10IX8IX3Q2X3IX8IX10IX4R2X4IX10IX8IX8IX8IX10IX4R2X4I5X4I5X4I14X4I5X4I5X4R2X58R2XQ2X7G2X7Z2X16Z2X7G2X7Q2XR2XQ2X7G2X7Z2X16Z2X7G2X7Q2XR2X58R2161'],
  [1,'cave','R1102I15R45IX4IX3IXIX2IR45IX4QX3QXIX2IR45IX5ZXZX2ZX2IR41I5X6ZX3ZX2IR41IX4ZX4ZXZX2IX2IR41IX4Z2X2QX3QXIX2IR41IX2I2X2I6X2I4R41IX2I2X2IR4IZ2IR44IX2ZX4IR2I2X2I2R43IX2ZX4I3QX4QIR42IX2I2X3I2X2ZX2ZX2IR41IX2I2X3Z2X3G2X3IR39I3X2ZX4I2X2ZG2ZX2IR39IX2GXZX4I2XQX4QXIR39IX2I3GI4RIX6IR40IX4GXIR2IRX2IZ2I2R41IX4GXIR2I3RIX2IR42IX2I3XI4XR2IX2I8R35IX4IX6RI2X5ZX3IR35I2X2I2QX3QIRIX2SX3ZX3IR35IXG2XZXZXZXI3XQX2QXI3XIR35IX4ZX2GX3ZX3Z2X2GX3IR35IX4IXZXZX2ZX3Z2X2I3XIR35I2X2I2QX3QI2X2QX2QXZX3IR35IX4IX5IRIX6ZX3IR35I12R2I2X2I7R49I2X2I2R52I2X6I2R50IX2IG2IX2IR50I3X4I3R50IX8IR50I3X4I3R50IX2IG2IX2IR51IX6IR53I6R383'],
  [1,'cave','R263I13R46IX8IX3IR46IX8ZX3IR46IX8IX3IR46IQIQI9R47IX3QX8IR46IX3IX8IR46IX3QX8IR47I9GIGI3R44IX5IX6GX2IR43IX5QX6GX3IR42IX5IX6I2X3IR41IX3I10RIZXZIR40IX8IX3IRIXIX2IR39IX5SX2ZX3IRIZXZXI2R38IX8IX3IRIX6IR38I9ZIZIR2I3X3IR37IX7IX5IR3IX4IR36IX7QX5IR3I3QI2R36IX7IX5IR3I2X3IR36I3GI10R3I2X4IR36I2X7IX4IR2IX5IR36IX9IX3IR2IX4IR37IX10IZI2R2I2ZI2R38IXZX9GXIR2IX3IR38I2GIX10I4X3IR38IX3ZX12G2X2IR38IX4IX12GX2IR38IX5IX11I3R39I19R1579'],
  [1,'cave','R384IR58IXIR56IGXGIR43IR10IXZ3XIR10IR30IXIR8IX3ZX3IR8IXIR28IXZXIR8IXZ3XIR8IXZXIR25I2XIGIXI2R7IGXGIR7I2XIZIXI2R22IX4ZX4IR6IX3IR6IX4ZX4IR21IX9IR6IX3IR6IX9IR22I4QI4R3I5ZQZI5R3I4QI4R25I2QI3RI3X5IXIX5I3RI3QI2R26IX6IX19IX6IR24IXIXZXIXIX4I5GI5X4IXIXZXIXIR22IX2ZIXIZXIX3I2ZX7ZI2X3IXZIXIZX2IR20IX3QX3QXGX3GX2Q2XSXQ2X2GX3GXQX3QX3IR20IX2ZIXIZXGX3GX2Q2X3Q2X2GX3GXZIXIZX2IR22IXIXZXIXIX3I2ZX7ZI2X3IXIXZXIXIR24IX6IX4I5GI5X4IX6IR26I7X19I7R33I4GX4IXIX4GI4R42IXI3XQZQXI3XIR45IXIX2IX3IX2IXIR45IXZX2ZX3ZX2ZXIR45IXIX2IGXGIX2IXIR45IXI3XZ3XI3XIR45IX3GX2QX2GX3IR45IX2I2XZ3XIRX2IR45IX2IRIGXGIRIX2IR45IX2IRI2XIR2IX2IR45IG2I3GXGI3G2IR45IX6ZX6IR45IX5GXGX5IR46I13R1289'],
  [1,'gem','R1153X21R39X21R39X2I5X2I3X2I5X2R39X2I5X2I3X2I5X2R39X21R39X21R39X4I3X7I3X4ZX2QX3GX13R18X4I3X3SX3I3X4ZX2QX2G3X12R18X4I3X7I3X4ZX2QX3GX2QXI2GXI3QXR18X21IG2IXZX3Q4IGXI3XZR18X21IZGIZ3X3QXQIGX2GIX2R18X2I5X2I3X2I5X2IZ2IXZX6QIGX2GIXQR18X2I5X2I3X2I5X2IQ2IX8Q2I2XGIZXR18X21IQ2IX8Q2I2XGIX2R18X21IQ2IX4ZX4IGX2GIQXR18Z2I3X2I7X2I3Z2IQ2IX3Z3X3IGX2GIXZR18Z2I3X2I7X2I3Z2IZ2IXQX2ZX4IGXI3X2R18X10GX10IGZIQ3X3GX2IGXI3XQR18X10GX10IG2IXQX3G3XIGX2GIZXR18X2I2X2I9X2I2X2ZX2QX6GX2IGX2GIX2R18X2I2X2I9X2I2X2ZX2QX3ZX4Q2I2XGIQXR18X2I3QZX3GX3ZQI3X2ZX2QX2Z3X3Q2I2XGIXZR18X2I3QZX3GX3ZQI3X2ZX2QX3ZX4QIGX2GIX2R18X6I9X6I4X8QIGX2GIXQR18X6I9X6I4X9IX2I3ZXR18Z2I3QZX3GX3ZQI3Z2I4X17R18Z2I3QZX3GX3ZQI3Z2I4X17R18X6I9X6R39X6I9X6R39Z2I3QZX3GX3ZQI3Z2R39Z2I3QZX3GX3ZQI3Z2R39X6I9X6R39X6I9X6R39Z2I3QZX3GX3ZQI3Z2R39Z2I3QZX3GX3ZQI3Z2R39X6I9X6R39X6I9X6R39Z2I3QZX3GX3ZQI3Z2R39Z2I3QZX3GX3ZQI3Z2R39X6I9X6R39X6I9X6R26'],
  [1,'cave','R561X3ZX2ZX2ZX3R47X3ZX2ZX2ZX3R47X3ZX2ZX2ZX3R47XIQ9IXR47XQX2ZX3ZX2QXR47XQX2ZX3ZX2QXR47XIQ9IXR47XQX4ZX4QXR47XQX4ZX4QXR47XIX4ZX4IXR47XZX4ZX4ZXR46X2ZX4ZX4ZX2R45X2I11X2R44X3IX2QX3QX2IX3R43X3QX2IXSXIX2QX3R42QX3QX2QX3QX2QX3QR41QX3QX2QX3QX2QX3QR42X3QX2RQ3RX2QX3QR42Z3R4Q3R4Z3R43X5QX5QX5R44X4QX5QX4R45X4QX5QX4R44X5QXIZIXQX5R43X2IG2I3ZI3G2IX2R43X2QX4GXGX4QX2R44XQX2I3ZI3X2QXR45XQX4GXGX4QXR44X2QX2I3QI3X2QX2R43X2IX4GXGX4IX2R43X5I3QI3X5R44X6GXGX6R45X4I3QI3X4R44X7GXGX7R43X2IG2I3QI3G2IX2R43X7GXGX7R44X4I3QI3X4R45X6GXGX6R44X5I3QI3X5R43X2IX4GXGX4IX2R43X2QX2I3QI3X2QX2R44XQX4GXGX4QXR45XQX2I3QI3X2QXR44X2QX4GXGX4QX2R43X2IG2I3QI3G2IX2R43X7GXGX7R44X4I3ZI3X4R45X6GXGX6R44X5I3ZI3X5R43X2RX2QXIZIXQX2RX2R43X2RX2QX5QX2RX2R46X2QX5QX2R27'],
  [1,'battlegrounds','R441X2QX5QX2R49XR2ZI3ZR2XR49XR2QI3QR2XR49X2QX5QX2R49X2QX5QX2R49X2RQI3QRX2R49X2RQI3QRX2R49X2RX5RX2R49X2RX5RX2R49X2RQI3QRX2R49X2RZI3ZRX2R48X13R44X9SX9R41X19R41X2IX3I3GI3X3GX2R41X2I7ZI3Q3GX2R41X2I7ZI3Q3GX2R41X2IX3I3GI3X3GX2R41X8Q3X8R41X8Q3X8R41X8Q3X8R41X2GX3I3GI3X3IX2R41X2GQ3I3ZI7X2R41X2GQ3I3ZI7X2R41X2GX3I3GI3X3IX2R41X8Q3X8R41X8Q3X8R41X8Q3X8R41X2IX3I3GI3X3GX2R41X2I7ZI3Q3GX2R41X2I7ZI3Q3GX2R41X2IX3I3GI3X3GX2R41X8Q3X8R41X8Q3X8R41X2IX5Q3X5IX2R41Z2I6G3I6Z2R41X7ZX3ZX7R41X7ZX3ZX7R43X5R5X5R46X3R7X3R47Z3R7Z3R47X3R7X3R47X3GR5GX3R47XG2X3ZX3G2XR48X5ZX5R508'],
  [1,'ice','R963Q3X2ZX3ZX2ZX6ZX5ZX8ZX3ZX2Q3R16Q3X2ZX3ZX2ZX6ZX5ZX8ZX3ZX2Q3R16Q3X2ZX3ZX2ZX6ZX5ZX8ZX3ZX2Q3R16X3Q2R5Q2R8Z5R7Q2R5Q2X3R16X3QX2R3X2QR8X5R7QX2R3X2QX3R16Z3RX3RX3R9X5R8X3RX3RZ3R16X3R2X5R10X5R9X5R2X3R16X3R3X3R11X5R10X3R3X3R16X3R2X3Q2R10X5R9Q2X3R2X3R16Z3RX3RQX10QX5QX9QRX3RZ3R16X3QX2R3X10QX5QX9R3X2QX3R16X3Q2R4X2R9G5R8X2R4Q2X3R16X3R6X2R9Q5R8X2R6X3R16X3R6X2IX6I2X5I2X5IX2R6Z3R16X3R6X2QX6I2X5I2X5QX2R6X3R16X3R6X2QX6I2X5I2X5QX2R6X3R16X3R6X2IX6I2X5I2X5IX2R6X3R16X3R6X2R9Z5R8X2R6X3R16Z3R6Q2R9Z5R8Q2R6Z3R16X3ZX7GX7ZX5ZX6GX7ZX3R16X3ZX7GX7ZX2SX2ZX6GX7ZX3R16X3ZX7GX7ZX5ZX6GX7ZX3R16Z3R6Q2R9Z5R8Q2R6Z3R16X3R6X2R9Z5R8X2R6X3R16X3R6X2IX6I2X5I2X5IX2R6X3R16X3R6X2QX6I2X5I2X5QX2R6X3R16X3R6X2QX6I2X5I2X5QX2R6X3R16X3R6X2IX6I2X5I2X5IX2R6X3R16X3R6X2R9Q5R8X2R6X3R16X3Q2R4X2R9G5R8X2R4Q2X3R16X3QX2R3X10QX5QX9R3X2QX3R16Z3RX3RQX10QX5QX9QRX3RZ3R16X3R2X3Q2R10X5R9Q2X3R2X3R16X3R3X3R11X5R10X3R3X3R16X3R2X5R10X5R9X5R2X3R16Z3RX3RX3R9X5R8X3RX3RZ3R16X3QX2R3X2QR8X5R7QX2R3X2QX3R16X3Q2R5Q2R8Z5R7Q2R5Q2X3R16Q3X2ZX3ZX9ZX5ZX8ZX3ZX2Q3R16Q3X2ZX3ZX9ZX5ZX8ZX3ZX2Q3R16Q3X2ZX3ZX9ZX5ZX8ZX3ZX2Q3R193'],
], duelsLevels = [
  [1,'cave','R968X3IX23R33XAXIX23R33X21GX5R33I2X19GX5R33X5GX15GX5R33X4G2X15G4X2R33X27R33X27R33X27R33X27R33X8Z2X17R33X8Z2X17R33X12I2X13R33Q5Z5I6Q6Z5R33Z5Q5I6Z6Q5R33X12I2X13R33X15Z2X10R33X15Z2X10R33X27R33X27R33X20G2X5R33X2G4X14GX6R33X5GX21R33X5GX19I2R33X5GX21R33X23IXBXR33X23IX3R1045'],
], tdmLevels = [
  [1,'deep','R1218X2ZX12ZX2R42X2RX2Z3X2Z3X2RX2R42X2RX2ZGZX2ZGZX2RX2R42X2RX2Z3X2Z3X2RX2R42X2RX12RX2R42X2R6Z2R6X2R42X2ZX12ZX2R42X2ZX2ZGZX7ZX2R45X2Z3X2ZGZX2R48X7Z3X2R47QX12QR45XQ2R2Z2R2Z2R2Q2XR43X3R2X3Z2X3R2X3R41X3R3X3Q2X3R3X3R39G2XR4X3Q2X3R4XG2R36X3GR5X3Z2X3R5GX3R34XAXR20XBXR34X3R20X3R1340'],
  [1,'battlegrounds','R1565X4ZX8IX9ZX4R32X4ZX5Q3IQ3X6ZX4R32X4IQ3X5ZX6Q3IX4R32X4IX8ZX9IX4R32Z2R24Z2R32Z2R8X3RX3R9ZXR32X6GX6RX6GX7R32X6GX4AXRXBX4GX7R32X6GX6RX6GX7R32Z2R8X3RX3R9Z2R32Z2R24Z2R32X4IX8ZX9IX4R32X4IQ3X5ZX6Q3IX4R32X4ZX5Q3IQ3X6ZX4R32X4ZX8IX9ZX4R1167'],
  [1,'gem','R1237X6R54X6R51X6BX2R51X9R51X2I2X5R51X2I3X4R51G2I3X4R51X2GX4R52X3GX4R51G2XR43X15GR44X6Z3X6R45X2IX9IX2R45X2IZ2Q2XQ2Z2IX2R45X2Z2G2QXQG2Z2X2R45X2Z3GQXQGZ3X2R45X2IXZ2QXQZ2XIX2R45X2IX9IX2R45X6Z3X6R44GX15R43XG2R51X4GX3R52X4GX2R53X2I3G2R53X2I3X2R51X5I2X2R51X9R51X2AX6R51X5R55X5R647'],
];

const logger = fs.createWriteStream('log.txt', {flags: 'a'}), log = l => logger.write(`${l}\n`);
const hasAccess = (username, clearanceLevel) => { // 1 => full auth only, 2 => admins and above, 3 => vips and above, 4 => any
  const isAdmin = Storage.admins.includes(username), isVIP = Storage.vips.includes(username);
  return (clearanceLevel === 4 || Storage.owners.includes(username)) || (clearanceLevel === 3 && (isVIP || isAdmin)) || (clearanceLevel === 2 && isAdmin);
}
const alpha = [...'abcdefghijklmnopqrstuvwxyz'], genID = () => {
  let id = '';
  for (let i = 0; i < 6; i++) id += alpha[Math.floor(Math.random()*26)].toUpperCase();
  return Object.keys(servers).includes(id) ? genID() : id;
}
const authen = async(username, token) => {
  const response = await fetch('http://'+settings.authserver+`/verify?username=${username}&token=${token}`);
  const text = await response.text();
  console.log(text);
  return text === 'true';
}, clean = msg => msg.split(' ').reduce((a, word) => a.concat([Storage.filter.some(badword => word.toLowerCase().includes(badword)) ? '@!#$%' : word]), []).join(' ');
const deathMessages = [`{victim} was killed by {killer}`, `{victim} was put out of their misery by {killer}`, `{victim} was assassinated by {killer}`, `{victim} was comboed by {killer}`, `{victim} was eliminated by {killer}`, `{victim} was crushed by {killer}`, `{victim} was sniped by {killer}`, `{victim} was exploded by {killer}`, `{victim} was executed by {killer}`, `{victim} was deleted by {killer}`, `{victim} proved no match for {killer}`, `{victim} was outplayed by {killer}`, `{victim} was obliterated by {killer}`, `{victim} fell prey to {killer}`, `{victim} became another number in {killer}'s kill streak`, `{victim} got wrecked by {killer}`];
const joinMessages = [`{player} joined the game`, `{player} is now online`, `{player} has joined the battle`];
const rageMessages = [`{player} left the game`, `{player} quit`, `{player} disconnected`, `{player} lost connection`];


let tickspeed, old = Date.now(), getTickspeed = () => {
  tickspeed = Date.now()-old;
  old = Date.now()
  setTimeout(() => getTickspeed());
}
getTickspeed(Date.now());


class Multiplayer extends Engine {
  constructor(l) {
    super(l);
    Object.defineProperty(this, 'global', {get: () => this.rawglobal, set: v => {
      this.rawglobal = v;
      for (const t of this.pt) {
        t.msg.global = v;
        this.send(t);
      }
    }, configurable: true});
    this.rawzone = this.zone;
    Object.defineProperty(this, 'zone', {get: () => this.rawzone, set: v => {
      this.rawzone = v;
      for (const t of this.pt) {
        t.msg.zone = v;
        this.send(t);
      }
    }, configurable: true});
    this.zone = this.rawzone;
  }
  override(t, ox, oy) {
    this.updateEntity(t, Tank.u);
    this.loadCells(t, t.x, t.y, 80, 80);
    if (t.socket && (Math.floor((ox+40)/100) !== Math.floor((t.x+40)/100) || Math.floor((oy+40)/100) !== Math.floor((t.y+40)/100))) this.chunkload(t, ox, oy, t.x, t.y);
    t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
  }
  chunkload(t, ox, oy, x, y) {
    const w = 21, h = 15;
    const ocx = Math.floor((ox+40)/100)+.5, ocy = Math.floor((oy+40)/100)+.5, ncx = Math.floor((x+40)/100)+.5, ncy = Math.floor((y+40)/100)+.5;
    const xd = ocx-ncx, yd = ocy-ncy, yda = yd < 0 ? -1 : 1, xda = xd < 0 ? -1 : 1, yl = Math.min(h, Math.abs(yd))*yda;
    const ymin = ncy-h/2, ymax = ncy+h/2-1, xmin = ncx-w/2, xmax = ncx+w/2-1;
    for (let nys = (yda > 0 ? 0 : -1)+ncy-h/2*yda, y = m(nys), l = false; (yda > 0 ? (y < m2(nys+h*yda)) : (y > m2(nys+h*yda))); y += yda) {
      if (yda < 0 ? y <= nys+yl : y >= nys+yl) l = true;
      for (let nxs = (xda > 0 ? 0 : -1)+ncx-w/2*xda, x = m(nxs); (xda > 0 ? (x < m2(nxs+(l ? Math.min(w, Math.abs(xd)) : w)*xda)) : (x > m2(nxs+(l ? Math.min(w, Math.abs(xd)) : w)*xda))); x += xda) {
        for (const e of this.cells[x][y]) this.load(t, e);
      }
    }
    for (let oys = (yda > 0 ? -1 : 0)+ocy+h/2*yda, y = m(oys), l = false; (yda < 0 ? (y < m2(oys-h*yda)) : (y > m2(oys-h*yda))); y -= yda) {
      if (yda > 0 ? y <= oys-yl : y >= oys-yl) l = true;
      for (let oxs = (xda > 0 ? -1 : 0)+ocx+w/2*xda, x = m(oxs); (xda < 0 ? (x < m2(oxs-(l ? Math.min(w, Math.abs(xd)) : w)*xda)) : (x > m2(oxs-(l ? Math.min(w, Math.abs(xd)) : w)*xda))); x -= xda) {
        entity: for (const e of this.cells[x][y]) {
          for (const cell of e.cells) {
            const c = cell.split('x');
            if (xmin <= c[0] && c[0] <= xmax && ymin <= c[1] && c[1] <= ymax) continue entity;
          }
          this.unload(t, e);
        }
      }
    }
    this.send(t);
  }

  add(socket, data) {
    data.socket = socket; // this can moved to the join handler?
    let join = this.joinMsg(data.username);
    toDiscord(join);
    this.logs.push({m: join, c: '#66FF00'});
    super.add(data);
    this.pt[this.pt.length-1].logs = this.logs.length-1;
  }

  send(t) {
    if (t.busy) return t.delayed = true;
    if (t.lastSend && t.lastSend+1000/settings.upsl >= Date.now()) {
      clearTimeout(t.sendTimer);
      t.sendTimer = setTimeout(() => this.send(t), (t.lastSend+1000/settings.upsl)-Date.now());
      return t.delayed = true;
    }
    t.msg.logs = this.logs.slice(t.logs).concat(t.privateLogs);
    t.msg.tickspeed = tickspeed;
    t.logs = this.logs.length;
    t.privateLogs.length = 0;
    if (t.msg.logs.length || t.msg.u.length || t.msg.d.length || t.msg.global || t.msg.zone) {
      t.busy = true;
      t.delayed = false;
      t.socket._send(pack(t.msg), {}, () => {
        t.busy = false;
        if (t.delayed) this.send(t);
      });
      t.lastSend = Date.now();
      for (const update of t.msg.u) if (update && update.release) update.release();
      t.msg.u.length = t.msg.d.length = 0;
      t.msg.global = t.msg.logs = t.msg.zone = undefined;
    }
  }
  loadCells(e, ex, ey, w, h) { // optimize
    const old = e.cells ? A.template('arr').concat(...e.cells) : undefined;
    super.loadCells(e, ex, ey, w, h);
    for (const t of this.pt) {
      const mx = Math.floor((t.x+40)/100)-10, my = Math.floor((t.y+40)/100)-7, w = 21, h = 15;
      let o = false, n = false;
      if (old) for (const cell of old) {
        const a = cell.split('x');
        if (mx <= a[0] && a[0] < mx+w && my <= a[1] && a[1] < my+h) o = true;
      }
      for (const cell of e.cells) {
        const a = cell.split('x');
        if (mx <= a[0] && a[0] < mx+w && my <= a[1] && a[1] < my+h) n = true;
      }
      if (n && !o) this.load(t, e); else if (o && !n) this.unload(t, e); else continue;
      this.send(t);
    }
    if (old && old.release) old.release();
  }
  updateEntity(e, c) {
    for (const t of this.pt) {
      const mx = Math.floor((t.x+40)/100)-10, my = Math.floor((t.y+40)/100)-7, w = 21, h = 15;
      for (const cell of e.cells) {
        const a = cell.split('x');
        if (mx <= a[0] && a[0] < mx+w && my <= a[1] && a[1] < my+h) {
          this.merge(t, e, c);
          this.send(t);
        }
      }
    }
  }
  static num = n => typeof n !== 'number' ? n : Math.round(n*10)/10;
  load(t, e) {
    let i = t.msg.u.findIndex(u => u[0] === e.id);
    if (i !== -1) {
      t.msg.u[i].release();
      t.msg.u.splice(i, 1);
    }
    i = t.msg.d.indexOf(e.id);
    if (i !== -1) t.msg.d.splice(i, 1);
    t.msg.u.push(e.constructor[e.type === 'barrier' || e.type === 'void' ? 'raw2' : 'raw'].reduce((a, c) => a.concat(c, Multiplayer.num(e[c])), A.template('arr').concat(e.id)));
  }
  unload(t, e) {
    let i = t.msg.u.findIndex(u => u[0] === e.id);
    if (i !== -1) {
      t.msg.u[i].release();
      t.msg.u.splice(i, 1);
    }
    t.msg.d.push(e.id);
  }
  merge(t, e, c) {
    let i = t.msg.u.findIndex(u => u[0] === e.id);
    if (i !== -1) {
      c = A.template('arr').concat(c);
      for (let l = 1; l < t.msg.u[i].length; l += 2) {
        let m = c.indexOf(t.msg.u[i][l]);
        if (m !== -1) {
          t.msg.u[i][l+1] = Multiplayer.num(e[t.msg.u[i][l]]);
          c.splice(m, 1);
        }
      }
      for (const p of c) t.msg.u[i].push(p, Multiplayer.num(e[p]));
      c.release();
    } else t.msg.u.push(c.reduce((a, p) => a.concat(p, e[p]), A.template('arr').concat(e.id)));
  }
  destroyEntity(e) {
    pt: for (const t of this.pt) {
      const mx = Math.floor((t.x+40)/100)-10, my = Math.floor((t.y+40)/100)-7, w = 21, h = 15;
      for (const cell of e.cells) {
        const c = cell.split('x');
        if (mx <= c[0] && c[0] < mx+w && my <= c[1] && c[1] < my+h) {
          t.msg.d.push(e.id);
          this.send(t);
          continue pt;
        }
      }
    }
  }
  disconnect(socket, code, reason) {
    let team, isLeader;
    this.pt = this.pt.filter(t => {
      if (t.username === socket.username) {
        team = Engine.getTeam(t.team);
        isLeader = t.team.includes('@leader');
        for (const cell of t.cells) {
          const [x, y] = cell.split('x');
          this.cells[x][y].delete(t);
        }
        if (t.grapple) t.grapple.bullet.destroy();
        this.destroyEntity(t);
        t.release();
        return false;
      }
      return true;
    });
    for (let i = this.ai.length-1; i >= 0; i--) if (Engine.getUsername(this.ai[i].team) === socket.username) this.ai[i].destroy();
    let leave = this.rageMsg(socket.username);
    toDiscord(leave);
    this.logs.push({m: leave, c: '#E10600'});
    if (this.pt.length === 0) {
      this.i.forEach(i => clearInterval(i));
      delete servers[socket.room];
    } else if (isLeader) for (const t of this.pt) if (Engine.getTeam(t.team) === team) return t.team += '@leader';
  }

  ondeath(t, m) {
    if (this.logs) this.logs.push({m: this.deathMsg(t.username, m.username), c: (m.username === undefined ? '#FF8C00': (Engine.getTeam(m.team) === 'RED' ? '#FF0000' : (Engine.getTeam(m.team) === 'BLUE' ? '#0000FF' : '#FF8C00')))});
    super.ondeath(t, m);
  }

  deathMsg(victim, killer) {
    log(`${killer} killed ${victim}`); // temp log file death
    return deathMessages[Math.floor(Math.random()*deathMessages.length)].replace('{victim}', victim).replace('{killer}', killer);
  }

  joinMsg(player) {
    return joinMessages[Math.floor(Math.random()*joinMessages.length)].replace('{player}', player);
  }

  rageMsg(player) {
    return rageMessages[Math.floor(Math.random()*rageMessages.length)].replace('{player}', player);
  }
}

class FFA extends Multiplayer {
  constructor() {
    super(ffaLevels);
  }
  ontick() {}
}

class DUELS extends Multiplayer {
  constructor() {
    super(duelsLevels);
    this.round = 1;
    this.mode = 0; // 0 -> waiting for other player, 1 -> 10 second ready timer, 2-> match active, 3 -> gameover
    this.wins = {};
  }

  add(socket, data) {
    super.add(socket, data);
    if (this.mode !== 0) {
      const t = this.pt[this.pt.length-1], s = this.pt[0];
      t.spectator = t.ded = true;
      this.override(t, t.x = s.x, t.y = s.y);
    }
    if (this.pt.length === 1) {
      this.global = 'Waiting For Player...';
    } else {
      this.readytime = Date.now();
      this.mode++;
    }
  }

  ontick() {
    if ([0, 1].includes(this.mode)) {
      let ox = this.pt[0].x, oy = this.pt[0].y;
      this.pt[0].x = this.spawns[0].x;
      this.pt[0].y = this.spawns[0].y;
      this.override(this.pt[0], ox, oy);
    }
    if (this.mode === 1) {
      let ox = this.pt[1].x, oy = this.pt[1].y;
      this.pt[1].x = this.spawns[1].x;
      this.pt[1].y = this.spawns[1].y;
      this.override(this.pt[1], ox, oy);
      this.global = 'Round '+this.round+' in '+(5-Math.floor((Date.now()-this.readytime)/1000));
      if (5-(Date.now()-this.readytime)/1000 <= 0) {
        for (let i = this.s.length-1; i >= 0; i--) if (this.s[i].type !== 'grapple') this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m={}) {
    super.ondeath(t, m);
    this.wins[m.username] = this.wins[m.username] === undefined ? 1 : this.wins[m.username]+1;
    if (this.wins[m.username] === 3) {
      this.global = m.username+' Wins!';
      this.mode++;
      setTimeout(() => {
        t.socket.send({event: 'gameover', type: 'defeat'});
        m.socket.send({event: 'gameover', type: 'victory'});
        t.socket.close();
        m.socket.close();
      }, 5000);
    } else {
      this.global = m.username+' Wins Round '+this.round;
      setTimeout(() => {
        this.pt.forEach(tank => {
          if (tank.spectator) return;
          clearInterval(tank.fireInterval);
          clearTimeout(tank.fireTimeout);
          tank.hp = tank.maxHp;
          tank.shields = 0;
          tank.ded = false;
          tank.socket.send({event: 'ded'});
        });
        for (let i = this.s.length-1; i >= 0; i--) this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.d = [];
        this.levelReader(duelsLevels[0]);
        this.round++;
        this.mode = 1; 
        this.readytime = Date.now();
      }, 5000);
    }
  }

  disconnect(socket, code, reason) {
    if ([1, 2].includes(this.mode)) {
      this.round = 1;
      this.mode = 0;
      this.wins = {};
    }
    this.pt.forEach(t => {
      t.socket.send({event: 'ded'}); // heal and reset cooldowns
      t.hp = t.maxHp;
    }); 
    super.disconnect(socket, code, reason);
  }
}

class TDM extends Multiplayer {
  constructor() {
    super([[1,'deep','R1335Z5Q13Z5R37Z5Q6ZQ6Z5R37Z5Q2I2Q2IQ2I2Q2Z5R37Z5Q2I2Q2IQ2I2Q2Z5R37Z5Q2GQ3GQ3GQ2Z5R37Z5Q13Z5R37Z5Q3ZI5ZQ3Z5R37Z5Q4I5Q4Z5R37Z5Q4ZQ3ZQ4Z5R37Z5Q13Z5R37Z5QZI9ZQZ5R37Z5Q2I9Q2Z5R37Z5Q4X5Q4Z5R37Z5Q3X3SX3Q3Z5R37Z5Q4X5Q4Z5R37Z5Q13Z5R37Z5Q3GQ2ZQ2GQ3Z5R37Z5Q2ZI7ZQ2Z5R37Z5Q13Z5R1162']])
    this.global = '===Waiting For Players===';
    this.round = 1;
    this.mode = 0; // 0 -> Lobby/Waiting for players, 1 -> About to enter round, 2 -> in game
    this.wins = {RED: 0, BLUE: 0};
  }

  add(socket, data) {
    super.add(socket, data);
    const t = this.pt[this.pt.length-1];
    if (this.mode !== 0) return t.spectator = t.ded = true;
    let red = 0, blue = 0;
    this.pt.forEach(tank => {
      if (tank.color === '#FF0000') red++; else blue++;
    });
    if (red > blue) t.color = '#0000FF';
    if (red < blue) t.color = '#FF0000';
    if (red === blue) t.color = (Math.random() < .5 ? '#FF0000' : '#0000FF');
    t.team = t.username+':LOBBY';
    if (this.pt.length === 4) {
      this.readytime = Date.now();
      this.time = 60; // 1 minute starting time
    }
  }

  ontick() {
    if (this.mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode = 1; // game start
        for (let i = this.s.length-1; i >= 0; i--) this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.readytime = Date.now();
        this.time = 5;
        this.pt.forEach(t => {
          clearInterval(t.fireInterval);
          clearTimeout(t.fireTimeout);
          t.shields = 0;
          t.team = t.username+':'+(t.color === '#FF0000' ? 'RED' : 'BLUE');
          t.socket.send({event: 'ded'});
        });
        this.levelReader(tdmLevels[Math.floor(Math.random()*tdmLevels.length)]);
      } else if (this.pt.length >= 4) this.global = this.time-Math.floor((Date.now()-this.readytime)/1000);
    } else if (this.mode === 1) {
      this.pt.forEach(t => {
        const spawn = Engine.getTeam(t.team) === 'BLUE' ? 0 : 1;
        let ox = t.x, oy = t.y;
        t.x = this.spawns[spawn].x;
        t.y = this.spawns[spawn].y;
        this.override(t, ox, oy);
      });
      this.global = 'Round '+this.round+' in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.global = '======(RED)'+this.wins.RED+' v.s '+this.wins.BLUE+'(BLUE)======';
        this.mode = 2;
        this.pt.forEach(t => t.socket.send({event: 'ded'}));
      }
    }
  }

  ondeath(t, m={}) {
    super.ondeath(t, m);
    let allies = 0;
    this.pt.forEach(tank => {
      if (!tank.ded) {
        if (Engine.getTeam(tank.team) === Engine.getTeam(t.team)) {
          allies++;
        }
      }
    });
    if (allies === 0) {
      const winner = Engine.getTeam(t.team) === 'BLUE' ? 'RED' : 'BLUE';
      this.wins[winner]++;
      if (this.wins[winner] === 3) {
        this.global = winner+' Wins!';
        setTimeout(() => {
          this.pt.forEach(t => {
            t.socket.send({event: 'gameover', type: winner === Engine.getTeam(t.team) ? 'victory' : 'defeat'});
            t.socket.close();
          });
        }, 5000);
      } else {
        this.global = winner+' Wins Round '+this.round;
        setTimeout(() => {
          this.pt.forEach(tank => {
            if (tank.spectator) return;
            clearInterval(tank.fireInterval);
            clearTimeout(tank.fireTimeout);
            tank.hp = tank.maxHp;
            tank.shields = 0;
            tank.ded = false;
          });
          for (let i = this.s.length-1; i >= 0; i--) this.s[i].destroy();
          for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
          this.d = [];
          this.levelReader(tdmLevels[Math.floor(Math.random()*tdmLevels.length)]);
          this.round++;
          this.mode = 1; 
          this.readytime = Date.now();
        }, 5000);
      }   
    }
  }

  disconnect(socket, code, reason) {
    const v = this.pt.find(t => t.username === socket.username);
    const m = this.pt.find(t => Engine.getTeam(t.team) !== Engine.getTeam(v.team));
    this.ondeath(v, m);
    super.disconnect(socket, code, reason);
  }
}

const joinKey = {'ffa': FFA, 'duels': DUELS, 'tdm': TDM};
const Commands = {
  admin: [Object, 1, 2, data => {
    if (!Storage.admins.includes(data[1])) Storage.admins.push(data[1]);
  }],
  vip: [Object, 2, 2, data => {
    if (!Storage.vips.includes(data[1])) Storage.vips.push(data[1]);
  }],
  removeadmin: [Object, 1, 2, data => {
    if (Storage.admins.includes(data[1])) Storage.admins.splice(Storage.admins.indexOf(data[1]), 1);
  }],
  removevip: [Object, 2, 2, data => {
    if (Storage.vips.includes(data[1])) Storage.vips.splice(Storage.vips.indexOf(data[1]), 1);
  }],
  reload: [Object, 2, 2, data => {
    for (const s of Object.values(servers)) for (const t of s.pt) if (t.username === data[1]) t.socket.send({event: 'force'});
  }],
  playerlist: [Object, 4, 1, (data, socket, server, t, logs) => {
    for (const tank of server.pt) logs.push({m: tank.username, c: '#ffffff'});
  }],
  requestunmute: [Object, 4, 1, (data, socket, server) => {
    if (!Storage.mutes.includes(socket.username)) return socket.send({status: 'error', message: `You aren't muted!`});
    if (socket.muteTimer && socket.muteTimer+100000 > Date.now()) return socket.send({status: 'error', message: `Wait 10 seconds before using this again!`});
    socket.muteTimer = Date.now();
    for (const s of Object.values(servers)) for (const t of s.pt) if (Storage.admins.includes(t.username) || Storage.owners.includes(t.username)) t.privateLogs.push({m: socket.username+' requested to be unmuted!', c: '#ffff00'});  }],
  msg: [Object, 4, -1, (data, socket, server, t, logs) => {
    if (Storage.mutes.includes(t.username)) return socket.send({status: 'error', message: 'You are muted!'});
    let m;
    for (const s of Object.values(servers)) for (const pt of s.pt) if (pt.username === data[1]) m = pt;
    const message = {m: `[${t.username}->${data[1]}] ${clean(data.slice(2).join(' '))}`, c: '#FFFFFF'};
    if (t) {
      logs.push(message);
      server.send(t);
    }
    if (m) {
      m.privateLogs.push(message);
      server.send(m);
    }
  }],
  createteam: [FFA, 4, 2, (data, socket, server, t) => {
    if (Storage.mutes.includes(t.username)) return socket.send({status: 'error', message: `You can't make teams when you're muted!`});
    if (clean(data[1]) !== data[1]) return socket.send({status: 'error', message: 'Team name contains profanity'});
    if (server.pt.find(t => Engine.getTeam(t.team) === data[1])) return socket.send({status: 'error', message: 'This team already exists.'});
    if (data[1].includes('@leader') || data[1].includes('@requestor#') || data[1].includes(':') || data[1].length > 20) return socket.send({status: 'error', message: 'Team name not allowed.'});
    t.team = t.username+':'+data[1]+'@leader';
    for (const ai of server.ai) if (Engine.getUsername(ai.team) === t.username) ai.team = t.username+':'+data[1];
  }],
  join: [FFA, 4, 2, (data, socket, server, t, logs) => {
    if (t.team.includes('@leader')) return socket.send({status: 'error', message: 'You must disband your team to join. (/leave)'});
    if (!server.pt.find(t => Engine.getTeam(t.team) === data[1] && t.team.includes('@leader'))) return socket.send({status: 'error', message: 'This team does not exist.'});
    t.team += '@requestor#'+data[1];
    server.logs.push({m: t.username+' requested to join team '+data[1]+'. The team owner can use /accept '+t.username+' to accept them.', c: '#0000FF'});
  }],
  accept: [FFA, 4, 2, (data, socket, server, t, logs) => {
    const leader = t, requestor = server.pt.find(t => t.username === data[1]);
    if (!requestor) return socket.send({status: 'error', message: 'Player not found.'});
    if (leader.team.includes('@leader') && requestor.team.includes('@requestor#') && Engine.getTeam(leader.team) === requestor.team.split('@requestor#')[1]) {
      requestor.team = data[1]+':'+Engine.getTeam(leader.team);
      for (const ai of server.ai) if (Engine.getUsername(ai.team) === requestor.username) ai.team = requestor.username+':'+Engine.getTeam(requestor.team);
      server.logs.push({m: data[1]+' has joined team '+Engine.getTeam(leader.team), c: '#40C4FF'});
    }
  }],
  leave: [FFA, 4, 1, (data, socket, server, t) => {
    const target = t, team = Engine.getTeam(target.team);
    for (const tank of server.pt) {
      if (Engine.match(t, tank) && (t.team.includes('@leader') || tank.username === t.username)) {
        tank.team = tank.username+':'+Math.random();
        for (const ai of server.ai) if (Engine.getUsername(ai.team) === tank.username) ai.team = tank.username+':'+Engine.getTeam(tank.team);
      }
    }
  }],
  filter: [Object, 3, 2, data => {
    if (!Storage.filter.includes(data[1].toLowerCase())) Storage.filter.push(data[1].toLowerCase());
  }],
  allow: [Object, 2, 2, data => {
    if (Storage.filter.includes(data[1].toLowerCase())) Storage.filter.splice(Storage.filter.indexOf(data[1].toLowerCase()), 1);
  }],
  t: [Object, 4, -1, (data, socket, server, t) => {
    if (Storage.mutes.includes(t.username)) return socket.send({status: 'error', message: 'You are muted!'});
    for (const tank of server.pt) if (Engine.match(t, tank)) tank.privateLogs.push({m: '[TEAM]['+t.username+'] '+clean(data.slice(1).join(' ')), c: '#FFFFFF'});
  }],
  perf: [Object, 4, -1, (data, socket, server, t) => {
    let n = [0, 0, 0, 0, 0]; // blocks, bullets, explosions, ai, players
    t.privateLogs.push({m: 'Performance Stats: ', c: '#00ff00'});
    t.privateLogs.push({m: 'setTimeout delay: '+tickspeed, c: '#00ff00'});
    let cellTotal = 0, cells = 0, max = 0, min = Infinity;
    for (const s of Object.values(servers)) {
      for (const row of s.cells) for (const cell of row) {
        if (cell.size > max) max = cell.size;
        if (cell.size < min) min = cell.size;
        cellTotal += cell.size;
        cells++;
      }
      n = [n[0]+s.b.length, n[1]+s.s.length, n[2]+s.d.length, n[3]+s.ai.length, n[4]+s.pt.length];
    }
    t.privateLogs.push({m: '[Blocks, Bullets, Explosions, AI, Players] => '+JSON.stringify(n), c: '#00ff00'});
    t.privateLogs.push({m: 'Object Pools:', c: '#00ff00'});
    for (const template of Object.keys(A.templates)) {
      const properties = new Set();
      for (const recycled of A[template]) for (const property of Object.keys(recycled)) properties.add(property);
      t.privateLogs.push({m: template+' -> '+A['_'+template]+' : '+A[template].length+' : '+Array.from(properties).join(' '), c: '#00ff00'});
    }
    t.privateLogs.push({m: 'Cells:', c: '#00ff00'});
    t.privateLogs.push({m: 'Average Density: '+(cellTotal/cells), c: '#00ff00'});
    t.privateLogs.push({m: 'Max: '+max, c: '#00ff00'});
    t.privateLogs.push({m: 'Min: '+min, c: '#00ff00'});
    t.privateLogs.push({m: '#: '+cells, c: '#00ff00'});
    t.privateLogs.push({m: 'Registry: '+cellTotal, c: '#00ff00'});
    for (const [key, value] of Object.entries(process.memoryUsage())) t.privateLogs.push({m: `Memory usage by ${key}, ${value/1000000}MB `, c: '#00ff00'});
  }],
  run: [Object, 1, -1, (data, socket, server, t, logs) => {
    exec(data.slice(1).join(' '), (e, o, er) => {
      if (e) if (e.length) logs.push({m: e, c: '#ff0000'});
      if (er.length) logs.push({m: er, c: '#ff0000'});
      if (o.length) logs.push({m: o, c: '#ffffff'});
    });
  }],
  newmap: [FFA, 3, -1, (data, socket, server) => {
    let levelID = data[1] ? Number(data[1]) : Math.floor(Math.random()*ffaLevels.length);
    if (isNaN(levelID) || levelID % 1 !== 0 || levelID >= ffaLevels.length) return socket.send({status: 'error', message: 'Out of range or invalid input.'});
    server.levelReader(ffaLevels[levelID]);
    for (const t of server.pt) {
      let ox = t.x, oy = t.y;
      t.x = server.spawn.x;
      t.y = server.spawn.y;
      server.override(t, ox, oy);
    }
  }],
  loadmap: [FFA, 2, 2, (data, socket, server) => {
    //if (isNaN(levelID) || levelID % 1 !== 0 || levelID >= ffaLevels.length) return socket.send({status: 'error', message: 'Out of range or invalid input.'});
    server.levelReader(data[1]);
    for (const t of server.pt) {
      let ox = t.x, oy = t.y;
      t.x = server.spawn.x;
      t.y = server.spawn.y;
      server.override(t, ox, oy);
    }
  }],
  tp: [FFA, 2, 4, (data, socket, server) => {
    for (const s of Object.values(servers)) {
      let t = s.pt.find(t => t.username === data[1]);
      if (!t) return;
      let ox = t.x, oy = t.y;
      t.x = data[2];
      t.y = data[3];
      server.override(t, ox, oy);
    }
  }],
  ban: [Object, 2, -1, (data, socket, server, t) => {
    if (Storage.admins.includes(data[1]) || Storage.owners.includes(data[1])) return socket.send({status: 'error', message: `You can't ban another admin!`});
    Storage.bans.push(data[1]);
    let msg = ' banned by '+t.username+' for ' + (data[2] ? 'committing the felony: '+data.slice(2).join(' ') : 'no reason ez!');
    for (const s of Object.values(servers)) {
      const victim = server.pt.find(t => t.username === data[1]);
      if (victim) {
        s.logs.push({m: data[1]+' was'+msg, c: '#FF0000'});
        victim.socket.send({status: 'error', message: 'You were'+msg});
      }
    }
    for (const socket of sockets) if (socket.username === data[1]) setTimeout(() => socket.close());
  }],
  banlist: [Object, 2, -1, (data, socket, server, t, logs) => {
    logs.push({m: '-----Ban List-----', c: '#00FF00'});
    for (const ban of Storage.bans) logs.push({m: ban, c: '#00FF00'});
  }],
  pardon: [Object, 2, 2, (data, socket, server, t) => {
    Storage.bans.splice(Storage.bans.indexOf(data[1]), 1);
    server.logs.push({m: data[1]+' was pardoned by '+t.username, c: '#0000FF'});
  }],
  mute: [Object, 2, 2, (data, socket, server, t) => {
    if (Storage.mutes.includes(data[1])) return socket.send({status: 'error', message: 'They are already muted!'});
    Storage.mutes.push(data[1]);
    for (const s of Object.values(servers)) if (s.pt.some(t => t.username === data[1])) s.logs.push({m: data[1]+' was muted by '+t.username, c: '#FFFF22'});
  }],
  unmute: [Object, 2, 2, (data, socket, server, t) => {
    Storage.mutes.splice(Storage.mutes.indexOf(data[1]), 1);
    for (const s of Object.values(servers)) if (s.pt.some(t => t.username === data[1])) s.logs.push({m: data[1]+' was unmuted by '+t.username, c: '#0000FF'});
  }],
   restart: [Object, 2, 1, function() {
    process.exit(1);
  }],
  sread: [Object, 1, 2, function(data) {
    const value = servers[this.room][data[1]];
    if (value !== undefined) servers[this.room].logs.push({m: typeof value === Object ? JSON.stringify(value) : value, c: '#FFFFFF'});
  }],
  kick: [Object, 3, 2, (data, socket, server, t) => {
    for (const socket of sockets) if (socket.username === data[1]) {
      socket.send({status: 'error', message: 'You have been kicked by '+t.username});
      setTimeout(() => socket.close());
    }
  }],
  kill: [Object, 2, -1, (data, socket) => {
    for (const s of Object.values(servers)) {
      let t = s.pt.find(t => t.username === (data[1] || socket.username));
      if (!t) return;
      t.immune = false;
      t.shield = false;
      t.reflect = false;
      t.damageCalc(t.x, t.y, 6000, socket.username);
    }
  }],
  killai: [Object, 2, 1, (data, socket, server) => {  
    for (let i = server.ai.length-1; i >= 0; i--) server.ai[i].destroy();
  }],
  ai: [Object, 2, 7, (data, socket, server) => {
    for (let i = 0; i < Number(data[5]); i++) A.template('AI').init(Math.floor(Number(data[1]) / 100) * 100 + 10, Math.floor(Number(data[2]) / 100) * 100 + 10, Number(data[3]), Math.min(20, Math.max(0, Number(data[4]))), data[6], server);
  }],
  spectate: [Object, 3, 2, data => {
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) t.ded = true;
  }],
  live: [Object, 2, -1, (data, socket) => {
    for (const server of Object.values(servers)) {
      let t = server.pt.find(t => t.username === (data[1] || socket.username));
      if (!t || !t.ded) return;
      t.hp = t.maxHp;
      t.ded = false;
      return t.socket.send({event: 'ded'});
    }
  }],
  switch: [TDM, 3, 2, (data, socket, server) => {
    if (server.mode === 0) for (const t of server.pt) if (t.username === (data.length === 1 ? socket.username : data[1])) t.color = t.color === '#FF0000' ? '#0000FF' : '#FF0000';
  }],
  start: [TDM, 3, 1, (data, socket, server) => {
    if (server.mode === 0) {
      server.readytime = Date.now();
      server.time = 0;
    }
  }],
  flushlogs: [Object, 2, -1, () => fs.writeFileSync('log.txt', '')],
  getlogs: [Object, 2, 2, (data, socket, server, t, logs) => {
    const log = fs.readFileSync('log.txt').toString().split('\n').slice(1).reverse();
    for (let i = Math.min(log.length, Number(data[1])); i >= 0; i--) logs.push({m: log[i], c: '#A9A9A9'});
  }],
  announce: [Object, 3, -1, (data, socket, server) => {
    for (const server of Object.values(servers)) {
      server.logs.push({m: '[Announcement]['+(hasAccess(socket.username, 1) ? 'Owner' : (hasAccess(socket.username, 2)) ? 'Admin' : 'VIP')+']['+socket.username+'] '+data.slice(1).join(' '), c: '#FFF87D'});
      for (const t of server.pt) server.send(t);
    }
  }],
  whitelist: [Object, 2, 2, data => {
    if (!Storage.whitelist.includes(data[1])) Storage.whitelist.push(data[1]);
  }],
  unwhitelist: [Object, 2, 2, data => {
    Storage.whitelist = Storage.whitelist.filter(s => s !== data[1]);
  }],
  lockchat: [Object, 2, -1, () => {
    settings.chat = !settings.chat;
  }],
  upsl: [Object, 2, -1, data => {
    settings.upsl = +data[1];
  }],
  swrite: [Object, 2, 3, (data, socket) => {
    eval(`try {
      servers['${socket.room}']['${data[1]}'] = ${data[2]};
    } catch(e) {
      servers['${socket.room}'].pt.find(t => t.username === '${socket.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  twrite: [Object, 2, 4, (data, socket) => {
    eval(`try {
      const server = servers['${socket.room}'], tank = server.pt.find(t => t.username === '${data[1]}');
      tank['${data[2]}'] = ${data[3]};
    } catch(e) {
      servers['${socket.room}'].pt.find(t => t.username === '${socket.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  help: [Object, 4, 1, (data, socket, server, t, logs) => {
    const authKey = ['n/a', 'Owner', 'Admin', 'VIP', 'Everyone'];
    for (const command of Object.keys(Commands)) logs.push({m: `/${command} - ${Commands[command][2]} parameters. [${authKey[Commands[command][1]]}]`, c: '#00FF00'});
  }],
};

let received = sent = 0;
let ips, ops;
setInterval(() => {
  ips = received;
  ops = sent;
  received = sent = 0;
}, 1000);
wss.on('connection', socket => {
  socket._send = socket.send;
  socket.send = data => {
    sent++;
    socket._send(pack(data));
  }
  socket.kick = e => {
    socket.send({status: 'error', message: e});
    setTimeout(() => socket.close());
  }
  sockets.add(socket);
  socket.on('message', data => {
    received++;
    try {
      data = unpack(data);
    } catch(e) {
      return socket.close();
    }
    if (!socket.username) socket.username = data.username;
    if (data.op === 'database') database(data, socket); // AUTH SERVER
    if (data.op === 'auth') auth(data, socket); // AUTH SERVER
    if (data.type === 'update') {
      if (Storage.bans.includes(data.username)) return socket.kick('You are banned!');
      if (servers[socket.room]) servers[socket.room].update(data); else return socket.kick(`You aren't in a room!`);
    } else if (data.type === 'join') {
      if (Storage.bans.includes(data.username)) return socket.kick('You are banned!');
      if (clean(data.username) !== data.username) return socket.kick(`Your username didn't pass the profanity check.`);
      if (!Storage.whitelist.includes(data.username) && !hasAccess(data.username, 2) && settings.whitelist) {
        for (const s of Object.values(servers)) for (const t of s.pt) if (hasAccess(t.username, 2)) t.privateLogs.push({m: `${data.username} tried to join, but isn't whitelisted! (/whitelist)`, c: '#f70d1a'});
        return socket.kick('You are not yet in the whitelist! A notification was sent to an admin to add you. Please be paitent.');
      }
      /* else if (!auth(socket.username, data.token)) {
        socket.send({status: 'error', message: 'Token is invalid. Login with the correct authserver.'});
        return setTimeout(() => socket.close());
      }*/
      let server;
      if (data.room) {
        if (data.room.length > 6) return socket.kick('Invalid Room.'); 
        if (!servers[data.room]) {
          servers[data.room] = new joinKey[data.gamemode]();
          servers[data.room].private = true;
        }
        server = data.room;
      } else {
        for (const id in servers) { // OPTIMIZE THIS
          if (servers[id] instanceof joinKey[data.gamemode]) {
            if (servers[id].private) continue;
            if (data.gamemode === 'ffa' && servers[id].pt.length >= settings.players_per_room) continue;
            if (data.gamemode === 'duels' && servers[id].pt.length !== 1) continue;
            if (data.gamemode === 'tdm' && servers[id].mode !== 0) continue;
            server = id;
            break;
          }
        }
        if (!server) servers[server = genID()] = new joinKey[data.gamemode]();
      }
      if (servers[server].pt.some(t => t.username === socket.username)) return socket.kick('You are already in the server!');
      socket.room = server;
      data.tank.authority = ''; // OPTIMIZE THIS
      for (const level of ['VIP', 'Admin', 'Owner']) if (Storage[level.toLowerCase()+'s'].includes(data.username)) data.tank.authority = level;
      // PREPEND SOCKET TO DATA
      servers[server].add(socket, data.tank);
    } else if (data.type === 'ping') {
      socket.send({event: 'ping', id: data.id});
    } else if (data.type === 'chat') {
      if (!servers[socket.room] || (!hasAccess(socket.username, 3) && !settings.chat)) return;
      if (Storage.mutes.includes(socket.username)) return socket.send({status: 'error', message: 'You are muted!'});
      if (data.msg.length > 3000) return socket.send({status: 'error', message: 'You have exceed 3k size limit!'});
      let role;
      for (const level of ['VIP', 'Admin', 'Owner']) if (Storage[level.toLowerCase()+'s'].includes(socket.username)) role = level;
      let m = (role ? '['+role+'] ' : '')+`${socket.username}: ${clean(data.msg)}`
      toDiscord(m);
      servers[socket.room].logs.push({m, c: '#ffffff'});
      for (const t of servers[socket.room].pt) servers[socket.room].send(t);
    } else if (data.type === 'logs') {
      if (servers[data.room]) socket.send({event: 'logs', logs: servers[data.room].logs}); // Dead?
    } else if (data.type === 'command') {
      const f = Commands[data.data[0]], server = servers[socket.room], t = server.pt.find(t => t.username === socket.username);
      if (!f) return socket.send({status: 'error', message: 'Command not found.'});
      if (!(server instanceof f[0])) return socket.send({status: 'error', message: 'This command is not available in this server type.'});
      if (data.data.length !== f[2] && f[2] !== -1) return socket.send({status: 'error', message: 'Wrong number of arguments.'});
      if (!hasAccess(socket.username, f[1])) return socket.send({status: 'error', message: `You don't have access to this.`});
      log(`${socket.username} ran command: ${data.data.join(' ')}`);
      f[3](data.data, socket, server, t, t.privateLogs);
    } else if (data.type === 'preview') {
      const m = {event: 'preview', ffa: {}, tdm: {}, duels: {}, p: 0, tickspeed};
      for (const room in servers) for (const type in joinKey) if (servers[room] instanceof joinKey[type]) {
        m[type][servers[room].private ? '*******' : room] = servers[room].pt.reduce((a, c) => a.concat((c.ded ? '#' : '')+c.username), []);
        m.p++;
      }
      socket.send(m);
    }
  });
  socket.on('close', (code, reason) => {
    sockets.delete(socket);
    if (servers[socket.room]) servers[socket.room].disconnect(socket, code, reason);
  });
});
server.listen(settings.port);
console.log('Listening on port '+settings.port);

const discord = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
const token = fs.readFileSync('discord.json', 'utf8').replace(/\n/g, ''), channel = '1301321677220741180'; // temp, move to file
const toDiscord = m => discord.channels.cache.get(channel)?.send(m);
discord.on('messageCreate', m => {
  if (m.channel.id !== channel || m.author.id === '1301716399999160392') return;
  if (m.content.startsWith('/')) {
    m.delete(1000);
    // potential freeze, unfreeze, gpts, newmap, killai, ai, swrite, twrite
    const discordAcceptable = ['admin', 'removeadmin', 'vip', 'removevip', 'reload', 'playerlist', 'msg', 'filter', 'allow', 'run', 'ban', 'banlist', 'pardon', 'mute', 'unmute', 'kick', 'kill', 'spectate', 'live', 'restart', 'flushlogs', 'getlogs', 'announce', 'lockchat', 'lockdown', ];
    const socket = {username: m.author.username, send: d => {
      toDiscord(d.message);
    }}, data = m.content.replace('/', '').split(' '), t = {username: m.author.username}, logs = {push: d => {
      toDiscord(d.m);
    }};
    if (!discordAcceptable.includes(data[0])) return toDiscord('Invalid command. Not in list: '+discordAcceptable);
    const f = Commands[data[0]];
    if (data.length !== f[2] && f[2] !== -1) return socket.send({status: 'error', message: 'Wrong number of arguments.'});
    if (!hasAccess(m.author.id, f[1])) return socket.send({status: 'error', message: `You(${m.author.id}) don't have access to this.`});
    log(`(${m.author.id})${socket.username} ran command: ${data.join(' ')}`);
    return f[3](data, socket, {}, t, logs);
  }
  for (const server of Object.values(servers)) server.logs.push({m: '[DISCORD]['+m.author.username+'] '+m.content, c: '#ffffff'});
});
discord.on('ready', () => console.log(`Logged in as ${discord.user.tag}!`));
discord.login(token);
