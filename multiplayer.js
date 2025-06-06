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
  [1,'ice','X3IX3IX3IX2R2XQX12R30X3IX3IX3I2XR2XIXGX2QXIX2IX2R30X3IX3IX3IX2R2QIXGXQ2X2IZI2XR30I2ZI3ZI3ZIXIR2XIXG2XQXZX5R30X14R2XIX5Z2X2QX2R30XI2X2Z6X3R2QIX4Z2X6R30X2IX2Z6X3R2XIXI2XZX2I2X3R30XI2X2ZXZXZ2XQXR2XIX3ZX4IX3R30X2IX9QXR2QIX2Z2X7QR30X2IX9QXR2XIXZ2I2X2G3XQR30XI2X3QXQX5R2XIXZI3X4GX2R30X4IXQXQ2X4R2QIX12R30X4IXIX2QX3GZ2QI12XR30X4IX2IX4QZQZ2GQX2QX2QX2QXQR42Z2SXQZR54ZQX2Z2R42Z2IZ3QZ5GZ2QZQX12R30IQ2GZ3QZ2QZ2QZ2GX2I2X3QX3IXR30IZIZQZ3I2ZIZ2R2X3I2ZX8R30ZQI2QGZ2Q2IQIGR2X5Z3X6R30IZ2IQ2Z2IQ3IZR2Q2X6Z4X2R30Z2I2Z5I3Z2R2XQ2X8ZX2R30IQIQZ2GQZQZQZ2R2X14R30Z3GZ2QZ3GZ2QR9X7R30ZI7Z2QZ3R2X8IXIXIQR30ZQ2ZGZ2IZ6R2XZXZ2XZXI5XR30I2Q2Z2QIQZ5R2XZXZX2Z2IX3IXR30ZGZQZQZIQZ2GQZR2X2Z3XZ2IX3IXR30Z5IZIZQ2Z3R2X2ZX2ZXZQX3IXR30Q2Z2QIZ6QZR2X2ZX5I5XR1830'],
  [1,'ice','R621IR58IXIR49I3R5IXIR5I3R40I2XI2R3I2XI2R3I2XI2R38IX5IRIX5IRIX5IR36I2X5I3XGXGXI3X5I2R35IX11SX11IR35I2X5I3XGXGXI3X5I2R36IX5IRIX5IRIX5IR38I2GI2R3I2GI2R3I2GI2R38I2X2IRIR2IX3IR2IRIX2I2R36IX4I2XI3X3I3XI2X4IR35IX3IX5IX3IX5IX3IR35IX3IXQXQXIX3IXQXQXIX3IR35IX3GX2GX2GX3GX2GX2GX3IR36I2XIXQXQXIX3IXQXQXIXI2R38I3X5IX3IX5I3R42I2XI3X3I3XI2R44I3XIRIX3IRIXI3R42IX4IRIX3IRIX4IR40I2GI4RI2GI2RI4GI2R38IX5IRIX5IRIX5IR36I2X5I3X5I3X5I2R35IX7GX7GX7IR35I2X5I3X5I3X5I2R36IX5IRIX5IRIX5IR38I2XI2R3I2XI2R3I2XI2R40I3R5I3R5I3R1349'],
  [1,'ice','R1282I7R52IZIX3IZIR50IXZXZXZXZXIR48IX2IX2GX2IX2IR39I2R5IX3IXZXZXIX3IR5I2R29I2X2I2R2IX4I2X3I2X4IR2I2X2I2R25I2X6I3Z2I3X5I3Z2I3X6I2R23I2X6I2X7IGIX7I2X6I2R20I2RI2X6I2X7IXIX7I2X6I2RI2R16IX2I3XZX2ZXI2X3I5XI5X3I2XZX2ZXI3X2IR14IX2ZX2GX2Q2X3GX3GX4SX4GX3GX3Q2X2GX2ZX2IR13IX2IX2GX2Q2X3GX3I5XI5X3GX3Q2X2GX2IX2IR14IX2I3XZX2ZXI2X7IXIX7I2XZX2ZXI3X2IR16I2RI2X6I2X7IGIX7I2X6I2RI2R20I2X6I3Z2I3X5I3Z2I3X6I2R23I2X6I2X5IX5IX5I2X6I2R25I2X2I2R2IX4I2X3I2X4IR2I2X2I2R29I2R5IX3IXZXZXIX3IR5I2R39IX2ZX2GX2ZX2IR48IXZXZXZXZXIR50I3X3I3R52I7R1051'],
  [1,'battlegrounds','I30R30IGIX9IX4IX4IX3GXGIR30IXI2X4GXGXIX4ZX4IX4GXIR30IX2I2X4GX2ZX4ZX4ZX3GXGIR30IX3I2X2GXGXZX4IX4ZX6IR30IX4Z3X4IX4IX4IX6IR30IXGXGZ3X4IX2I5X2IX6IR30IX2GX2Z2IZX2IXI7XIX6IR30IXGXGX3I2ZXI3X5I3X6IR30IX7ZI2ZI2XGX3GXI2X6IR30I2X6Z2I3X3GXGX3Z2GZ2GI2R30I3X4Z2X2Z2X4SX4Z2GZ2GI2R30IZI2X2Z2X3Z2X3GXGX3I2X4GIR30IZ2I2Z2X4I3XGX3GXI3X4I2R30IZ2I3X3GXGI3X5I3X5I2R30IX2I3X4GX2I3XZXI3X3GXGXIR30IX2IX5GXGX2I2Z3I2X5GX2IR30IX2IX4IX6IZ3IX5GXGXIR30IX2GX4I2X5IX3IX9IR30IX2GX5I2X3I2X3I2X8IR30IX2IX5I3XI2X5I2X2IG2IXIR30IX2IX7I3X2GXGX2I3X4I2R30IX2IGXGX5IX4ZX4IX6IR30IX2IXZX6ZX3GXGX3ZX2GXGXIR30IZ2IGXGX5ZX9ZX3GX2IR30IZ2IX6I3GXGX3GXGI2XGXGXIR30IZ2I5G2I2X2ZX5ZX2IX5IR30IX3Z2X2Z2XZIGXGX3GXGIX6IR30IX3Z2X2Z2XZ2IX7IX7IR30I30R1830'],
  [1,'deep','R305I26R34IX10QX3QX9IR34IX10ZX3ZX9IR34IX10QX3QX9IR31I4X4IX2I4X3I4X2IX3I4R28IX7I3X11I3X6IR28IX7I2X6ZX6I2X6IR28IXQX5I2X6ZX6I2X4QXIR28IQXQI6X6ZX6I5QXQI6R23IX4I5X2I3GXGI3X2I4X9IR23IX6QX4GX7GX3QX11IR23IX7QX2ZX9ZXQX12IR23IX6QX4GX7GX3QX11IR23IGI2Q3I2X3I3GSGI3X2I2Q3I2GIX4IR23IX2IX3QX4GX7GX3QX3IX2IX4IR23IX2GX4Q3ZX9ZQ2X4GX2IXZ2XIR23I4X3QX4GX7GX3QX3I4XQ2XIR26IX3I2X3I3GXGI3X2I2X3IX7IR26IX12ZX11IXG2X4IR26IX12ZX11IXG2X4IR26IX12ZX11IXG2X2QXIR26I8X4I3X4I7X7IR34I4R2IX18IR40IX6ZQX10IR40IX6ZQX4QX3QXIR40IX18IR40I20R1701'],
  [1,'cave','R1102I15R45IX4IX3IXIX2IR45IX4QX3QXIX2IR45IX5ZXZX2ZX2IR41I5X6ZX3ZX2IR41IX4ZX4ZXZX2IX2IR41IX4Z2X2QX3QXIX2IR41IX2I2X2I6X2I4R41IX2I2X2IR4IZ2IR44IX2ZX4IR2I2X2I2R43IX2ZX4I3QX4QIR42IX2I2X3I2X2ZX2ZX2IR41IX2I2X3Z2X3G2X3IR39I3X2ZX4I2X2ZG2ZX2IR39IX2GXZX4I2XQX4QXIR39IX2I3GI4RIX6IR40IX4GXIR2IRX2IZ2I2R41IX4GXIR2I3RIX2IR42IX2I3XI4XR2IX2I8R35IX4IX6RI2X5ZX3IR35I2X2I2QX3QIRIX2SX3ZX3IR35IXG2XZXZXZXI3XQX2QXI3XIR35IX4ZX2GX3ZX3Z2X2GX3IR35IX4IXZXZX2ZX3Z2X2I3XIR35I2X2I2QX3QI2X2QX2QXZX3IR35IX4IX5IRIX6ZX3IR35I12R2I2X2I7R49I2X2I2R52I2X6I2R50IX2IG2IX2IR50I3X4I3R50IX8IR50I3X4I3R50IX2IG2IX2IR51IX6IR53I6R383'],
  [1,'cave','R263I13R46IX8IX3IR46IX8ZX3IR46IX8IX3IR46IQIQI9R47IX3QX8IR46IX3IX8IR46IX3QX8IR47I9GIGI3R44IX5IX6GX2IR43IX5QX6GX3IR42IX5IX6I2X3IR41IX3I10RIZXZIR40IX8IX3IRIXIX2IR39IX5SX2ZX3IRIZXZXI2R38IX8IX3IRIX6IR38I9ZIZIR2I3X3IR37IX7IX5IR3IX4IR36IX7QX5IR3I3QI2R36IX7IX5IR3I2X3IR36I3GI10R3I2X4IR36I2X7IX4IR2IX5IR36IX9IX3IR2IX4IR37IX10IZI2R2I2ZI2R38IXZX9GXIR2IX3IR38I2GIX10I4X3IR38IX3ZX12G2X2IR38IX4IX12GX2IR38IX5IX11I3R39I19R1579'],
  [1,'cave','R384IR58IXIR56IGXGIR43IR10IXZ3XIR10IR30IXIR8IX3ZX3IR8IXIR28IXZXIR8IXZ3XIR8IXZXIR25I2XIGIXI2R7IGXGIR7I2XIZIXI2R22IX4ZX4IR6IX3IR6IX4ZX4IR21IX9IR6IX3IR6IX9IR22I4QI4R3I5ZQZI5R3I4QI4R25I2QI3RI3X5IXIX5I3RI3QI2R26IX6IX19IX6IR24IXIXZXIXIX4I5GI5X4IXIXZXIXIR22IX2ZIXIZXIX3I2ZX7ZI2X3IXZIXIZX2IR20IX3QX3QXGX3GX2Q2XSXQ2X2GX3GXQX3QX3IR20IX2ZIXIZXGX3GX2Q2X3Q2X2GX3GXZIXIZX2IR22IXIXZXIXIX3I2ZX7ZI2X3IXIXZXIXIR24IX6IX4I5GI5X4IX6IR26I7X19I7R33I4GX4IXIX4GI4R42IXI3XQZQXI3XIR45IXIX2IX3IX2IXIR45IXZX2ZX3ZX2ZXIR45IXIX2IGXGIX2IXIR45IXI3XZ3XI3XIR45IX3GX2QX2GX3IR45IX2I2XZ3XIRX2IR45IX2IRIGXGIRIX2IR45IX2IRI2XIR2IX2IR45IG2I3GXGI3G2IR45IX6ZX6IR45IX5GXGX5IR46I13R1289'],
  [1,'deep','R1042X2IX2R55X2IX2R46X2ZX8IX8ZX2R37X2ZX8IX8ZX2R37Z2I19Z2R37X2IX8IX8IX2R37X2IX8IX8IX2R37X2IX2Z4X2IX2Z4X2IX2R30X6IX2IX2Z4X2IX2Z4X2IX2IX6R23X6IX2IX8IX8IX2IX6R23X3I2QIX2IX8IX8IX2IQI2X3R23Z3I2QIQ2I6X3IX3I6Q2IQI2Z3R23X3IX9I2X3IX3I2X9IX3R23X3IX2ZX6QX9QX6ZX2IX3R23X3QXZXZXIQ3XQX3SX3QXQ3IXZXZXQX3R23X3IX2ZX6QX9QX6ZX2IX3R23X3IX9I2X3IX3I2X9IX3R23Z3I2QIQ2I6X3IX3I6Q2IQI2Z3R23X3I2QIX2IX8IX8IX2IQI2X3R23X6IX2IX8IX8IX2IX6R23X6IX2IX2Z4X2IX2Z4X2IX2IX6R30X2IX2Z4X2IX2Z4X2IX2R37X2IX8IX8IX2R37X2IX8IX8IX2R37Z2I19Z2R37X2ZX8IX8ZX2R37X2ZX8IX8ZX2R46X2IX2R55X2IX2R873'],
  [1,'deep','R623X3R57X3R57XGXR57X3R53X11R48XZX4GX4ZXR47X2ZX7ZX2R42X3I2X3I2Q3I2X3I2X3R37XIX2QX4IX3IX4QX2IXR37X3I2X4IX3IX4I2X3R37IXI3X4IX3IX4I3XIR37IQI3X4IX3IX4I3QIR35X11IQ3IX11R32XZX7Z2X7Z2X7ZXR31X2ZX6Z2X7Z2X6ZX2R31X3IX8IXGXIX8IX3R31X3I6X2I2X3I2X2I6X3R27X7QX4QX11QX4QX7R23X2GX2GXQX4QX2GX2SX2GX2QX4QXGX2GX2R23X7QX4QX11QX4QX7R27X3I6X2I2X3I2X2I6X3R31X3IX8IXGXIX8IX3R31X2ZX6Z2X7Z2X6ZX2R31XZX7Z2X7Z2X7ZXR32X11IQ3IX11R35IQI3X4IX3IX4I3QIR37IXI3X4IX3IX4I3XIR37X3I2X4IX3IX4I2X3R37XIX2QX4IX3IX4QX2IXR37X3I2X3I2Q3I2X3I2X3R42X2ZX7ZX2R47XZX4GX4ZXR48X11R53X3R57XGXR57X3R57X3R814'],
  [1,'ice','R554X3Q2X4Q2X4Q2X4Q2R37X3Q2X4Q2X4Q2X4Q2R37X3I2X4I2X4I2X4I2R37X2I2Z2X2I2Z2X2I2Z2X2I2ZR37ZI2X2Z2I2X2Z2I2X2Z2I2X2R37I2X4I2X4I2X4I2X3R37QX5QSX4QX5QX4R37I2X4I2X4I2X4I2X3R37ZI2X2Z2I2X2Z2I2X2Z2I2X2R37X2I2Z2X2I2Z2X2I2Z2X2I2ZR37X3I2X4I2X4I2X4I2R37X3Q2X4Q2X4Q2X4Q2R37X3Q2X4Q2X4Q2X4Q2R37X3I2X4I2X4I2X4I2R37X2I2Z2X2I2Z2X2I2Z2X2I2ZR37ZI2X2Z2I2X2Z2I2X2Z2I2X2R37I2X4I2X4I2X4I2X3R37QX5QX5QX5QX4R37I2X4I2X4I2X4I2X3R37ZI2X2Z2I2X2Z2I2X2Z2I2X2R37X2I2Z2X2I2Z2X2I2Z2X2I2ZR37X3I2X4I2X4I2X4I2R37X3Q2X4Q2X4Q2X4Q2R37X3Q2X4Q2X4Q2X4Q2R1643'],
  [1,'gem','R1342I5R54IX5IR51I3X5I3R48IX2ZXI3XZX2IR46I2X3ZX3ZX3I2R40ZX4QX3ZX2GX2ZX3QX4ZR35XZX2QX3ZX2GXGX2ZX3QX2ZXR35X2ZX2QXZX4GX4ZXQX2ZX2R35X3I4X11I4X3R35QXQIX2I5QXQI5X2IQXQR35XQXIX6ZXQXZX6IXQXR35X3I8XQXI8X3R35X2ZX3Q2X9Q2X3ZX2R35XZX3I4X2Z3X2I4X3ZXR35ZX5Q2X9Q2X5ZR35ZXZQ3Z2Q2IQXQIQ2Z2Q3ZXZR35XZXQ3Z2Q2IXQXIQ2Z2Q3XZXR35X6Q2X9Q2X6R35ZX4I4X3SX3I4X4ZR35X6Q2X9Q2X6R35IGI4Q2I3QXQI3Q2I4GIR35IGI4Q2I3XQXI3Q2I4GIR35X6Q2X9Q2X6R35ZX4I4X2Z3X2I4X4ZR35X6Q2X9Q2X6R35ZXZQ3Z2Q2IQXQIQ2Z2Q3ZXZR35XZXQ3Z2Q2IXQXIQ2Z2Q3XZXR35X6Q2X9Q2X6R35ZX4I4X2Z3X2I4X4ZR35XZX4Q2X9Q2X4ZXR503'],
  [0,'deep','R623X3R57X3R57XGXR57X3R53X11R48XZX4GX4ZXR47X2ZX7ZX2R42X3I2X3I2Q3I2X3I2X3R37XIX2QX4IX3IX4QX2IXR37X3I2X4IX3IX4I2X3R37IXI3X4IX3IX4I3XIR37IQI3X4IX3IX4I3QIR35X11IQ3IX11R32XZX7Z2X7Z2X7ZXR31X2ZX6Z2X7Z2X6ZX2R31X3IX8IXGXIX8IX3R31X3I6X2I2X3I2X2I6X3R27X7QX4QX11QX4QX7R23X2GX2GXQX4QX2GX2SX2GX2QX4QXGX2GX2R23X7QX4QX11QX4QX7R27X3I6X2I2X3I2X2I6X3R31X3IX8IXGXIX8IX3R31X2ZX6Z2X7Z2X6ZX2R31XZX7Z2X7Z2X7ZXR32X11IQ3IX11R35IQI3X4IX3IX4I3QIR37IXI3X4IX3IX4I3XIR37X3I2X4IX3IX4I2X3R37XIX2QX4IX3IX4QX2IXR37X3I2X3I2Q3I2X3I2X3R42X2ZX7ZX2R47XZX4GX4ZXR48X11R53X3R57XGXR57X3R57X3R814'],
  [0,'battlegrounds','R1342I5R54IX5IR51I3X5I3R48IX2ZXI3XZX2IR46I2X3ZX3ZX3I2R40ZX4QX3ZX2GX2ZX3QX4ZR35XZX2QX3ZX2GXGX2ZX3QX2ZXR35X2ZX2QXZX4GX4ZXQX2ZX2R35X3I4X11I4X3R35QXQIX2I5QXQI5X2IQXQR35XQXIX6ZXQXZX6IXQXR35X3I8XQXI8X3R35X2ZX3Q2X9Q2X3ZX2R35XZX3I4X2Z3X2I4X3ZXR35ZX5Q2X9Q2X5ZR35ZXZQ3Z2Q2IQXQIQ2Z2Q3ZXZR35XZXQ3Z2Q2IXQXIQ2Z2Q3XZXR35X6Q2X9Q2X6R35ZX4I4X3SX3I4X4ZR35X6Q2X9Q2X6R35IGI4Q2I3QXQI3Q2I4GIR35IGI4Q2I3XQXI3Q2I4GIR35X6Q2X9Q2X6R35ZX4I4X2Z3X2I4X4ZR35X6Q2X9Q2X6R35ZXZQ3Z2Q2IQXQIQ2Z2Q3ZXZR35XZXQ3Z2Q2IXQXIQ2Z2Q3XZXR35X6Q2X9Q2X6R35ZX4I4X2Z3X2I4X4ZR35XZX4Q2X9Q2X4ZXR503']
  
], duelsLevels = [
  [1,'battlegrounds','R1281I11R49IX7Q2IR49IX2Q4Z2QIR49IX2IX2Q3XIR49IX2IX6IR49IX5GXIXI5R45IX14R45I10XQIQXR45IXZX2GXZI2G3X2R45IXBX2IX9R41I5XZX2IX2ZXI5R41X9IX2AXIR45X2G3I2ZXGX2ZXIR45XQIQXI10R45X14IR45I5XIXGX5IR49IX6IX2IR49IXQ3X2IX2IR49IQZ2Q4X2IR49IQ2X7IR49I11R1108'],
  [1,'ice','R1462IZ2X2ZIGX5R47IZX2Z2IX3I2XR47IX3IX5IX2R43X4IX9I3R43XG2XI7XIXQX2R43Q4IXZX5IXQGXR43X4IXZXIXZXIX4R43XIX2IX3IXZXIX4R43XIGXIG2AIBG2IXGIXR43X4IXZXIX3IX2IXR43X4IXZXIXZXIX4R43XGQXIX5ZXIQ4R43X2QXIXI7XG2XR43I3X9IX4R43X2IX5IX3IR47XI2X3IZ2X2ZIR47X5GIZX2Z2IR1169'],
  [1,'cave','R1517I10RIZ5IRIG5IR34IQGX6IRI7RIG5IR34IXIXZXZGXIR9IG5IR34IXIQX3GXI9RIG5IR34IXIX4GZXZ2XIQ2XIRI7R34IX6IZX4IX3IR42IG5XIZX3Q3X2I9R34IX8AI3X4GX5IXIR34IXIX5GX4I3BX8IR34I9X2Q3X3ZIXG5IR42IX3IX4ZIX6IR34I7RIXQ2IXZ2XZGX4IXIR34IG5IRI9XGX3QIXIR34IG5IR9IXGZXZXIXIR34IG5IRI7RIX6GQIR34IG5IRIZ5IRI10R1157'],
  [1,'deep','R1511G3I2R55GAX2I2R54GX4I2R53IX5I2R52I2X5I2RI3R48I2X5I3GI2R48I2X5IXQXI5R45I2X12IR46I2X3QX3IQ2XIR47I2X2QX3IQ2XIR46I2X3GX3GI2XI2R45IGQX2GXIZX5I2R44I2X5ZIXGX2QGIR45I2XI2GX3GX3I2R46IXQ2IX3QX2I2R47IXQ2IX3QX3I2R46IX12I2R45I5XQXIX5I2R48I2GI3X5I2R48I3RI2X5I2R52I2X5IR53I2X4GR54I2X2BGR55I2G3R685'],
  [1,'gem','R1278X16IX4R39XAXI11ZQIX4R39IX2ZI2R7IX2I3GXR39I2X3I2R6IX2QXIX2R40I2ZX2I8X2QXGX2R41I2X6QX10R42I2X3I2G2ZIX2I5R43IX3QX3ZIX2IR47IQX2QXGXQX2QIR47IX2IZX3QX3IR43I5X2IZG2I2X3I2R42X4QX5QX6I2R41X2GXQX2I8X2ZI2R40X2IX4IR6I2X3I2R39XGI3X2IR7I2ZX2IR39X4IQZI11XBXR39X4IX16R1341'],

], tdmLevels = [
  [1,'gem','R1237X6R54X6R51X6BX2R51X9R51X2I2X5R51X2I3X4R51G2I3X4R51X2GX4R52X3GX4R51G2XR43X15GR44X6Z3X6R45X2IX9IX2R45X2IZ2Q2XQ2Z2IX2R45X2Z2G2QXQG2Z2X2R45X2Z3GQXQGZ3X2R45X2IXZ2QXQZ2XIX2R45X2IX9IX2R45X6Z3X6R44GX15R43XG2R51X4GX3R52X4GX2R53X2I3G2R53X2I3X2R51X5I2X2R51X9R51X2AX6R51X5R55X5R647'],
  [1,'cave','R1637X18IX3R38XIX2IX8IXIX2IXGXR38X2I3XZ6XI3X6R38X2I2X2Z6X2I2X2I4R34X5I2X19R29X16I4X16R24X7I2X2Q2X3IX6Q2X2I2X7R24X2AX4I2X2Q2X3IX2IX3Q2X2I2X4BX2R24X7I2X2Q2X6IX3Q2X2I2X7R24X16I4X16R29X19I2X5R34I4X2I2X2Z6X2I2X2R38X6I3XZ6XI3X2R38XGXIX2IXIX8IX2IXR38X3IX18R1105'],
  [0,'deep','R982X5IX5R45X3IX4IZIX4IX3R41XZXIX4ZXZX4IXZXR39XZX3I6ZI6X3ZXR37XI5X2QX5QX2I5XR37XZX6QX5QX6ZXR29X6GI3X6QX5QX6I3GX6R21X3ZX2GI3X2Z5X5Z5X2I3GX2ZX3R21X2I2X2ZX5Z2IZ2X5Z2IZ2X5ZX2I2X2R21X2AIX2ZQ5ZI3ZX5ZI3ZQ5ZX2IBX2R21X2I2X2ZX5Z2IZ2X5Z2IZ2X5ZX2I2X2R21X3ZX2GI3X2Z5X5Z5X2I3GX2ZX3R21X6GI3X6QX5QX6I3GX6R29XZX6QX5QX6ZXR37XI5X2QX5QX2I5XR37XZX3I6ZI6X3ZXR39XZXIX4ZXZX4IXZXR41X3IX4IZIX4IX3R45X5IX5R1527'],
  [0,'battlegrounds','R968I9X9I9R33IX2IXZX15IX4IR33IX4IX3Z2G3X7IXIBXIR33I2X3IX5GX9IXI2XIR33IX4IX9GX6GX3IR33IZI4X7G3Z2X3IXI4R33IX19IX5IR33IX6I2X9I2X6IR33IX6I10QI2X6IR33X8QX4QX2IXIX8R33X8I2XIX6IX8R33X2ZX2ZX2IX2GZI2GIXIX2ZX2ZX2R33XZ6XIX2IX3ZX2IXZ6XR33XZX4ZXIQXIX3IXQIXZX4ZXR33XZ6XIX2ZX3IX2IXZ6XR33X2ZX2ZX2IXIGI2ZGX2IX2ZX2ZX2R33X8IX6IXI2X8R33X8IXIX2QX4QX8R33IX6I2QI10X6IR33IX6I2X9I2X6IR33IX5IX19IR33I4XIX7G3Z2X3I4ZIR33IX3GX10GX5IX4IR33IXI2XIX5GX9IX3I2R33IXAIXIX3Z2G3X7IX4IR33IX4IX15ZXIX2IR33I9X9I9R1045'],
  [0,'gem','R1096I23R37IX5IX7GXIX5IR37IXZXQXIXGXI3XGXIXQXZXIR37IX2GX2IXGX7IX2GX2IR37IXQXZXI5GI5XZXQXIR37IX10GX10IR37IXI19XIR37IXIR17IXIR36XQZI19ZQXR33X3QX2QIX6ZX6IQX2QX3R30X4IX2I3G2X7G2I3X2IX4R29XGXIX3IXQX3I2ZI2X3IXQX3IXGXR28X2GXIX3IXIX3IX3IX3IXIX3IXGX2R27XAIX5IXIX3ZXIXZX3IXIX5IBXR27X2GXIX3IXIX3IX3IX3IXIX3IXGX2R28XGXIX3QXIX3I2ZI2X3QXIX3IXGXR29X4IX2I3G2X7G2I3X2IX4R30X3QX2QIX6ZX6IQX2QX3R33XQZI19XQXR36IXIR17IXIR37IXI19XIR37IX10GX10IR37IXQ2X2I5GI5XZ2X2IR37IXQGZXIX9IXZGQXIR37IX2Z2XIXZXIXIXZXIX2Q2XIR37IX5IX9IX5IR37I23R921'],
  [0,'ice','R20X3GX3GX3R49X3GXBXGX3R49X3GX3GX3R49X2I2G3I2X2R49X2IX5IX2R49X2IX5IX2R49X2IX5IX2R49X11R49X11R49I3X5I3R49ZXZX5ZXZR49ZXIX3I3XZR49ZXIX3IXIXZR49X2IX3IXIX2R49X2IX3I3X2R49X2IXZ2X2IX2R49X2IXZ3XIX2R49X2IX2Z2XIX2R49X2I3X3IX2R49X2IXIX3IX2R49ZXIXIX3IXZR49ZXI3X3IXZR49ZXZX5ZXZR49I3X5I3R49X11R49X11R49X2IX5IX2R49X2IX5IX2R49X2IX5IX2R49X2I2G3I2X2R49X3GX3GX3R49X3GXAXGX3R49X3GX3GX3R1649'],
  [0,'battlegrounds','R1350X3R53X5BXZR52ZI3X3ZXR51XI2XG3X2R51XI2X3ZX2R40X7R4XI2X4Z2R40XGX10I2X6R40I3X2I9X6R35X3ZX3IX4ZX4IX5R37X2IZIX2IX4ZX4IX5R37XIX3IXIX3IZIX3IX3ZX3R35XZXGXZX4IX3IX5IZIX2R35XIX3IX4ZXGXZX4IX3IXR35X2IZIX5IX3IX4ZXGXZXR35X3ZX3IX3IZIX3IXIX3IXR37X5IX4ZX4IX2IZIX2R37X5IX9IX3ZX3R35X6I9X2I3R40X6I2X10GXR40Z2X4I2XR4X7R40X2ZX3I2XR51X2G3XI2XR51XZX3I3ZR52ZXAX5R53X3R825'],
  [0,'ice','R1530X3R43X4IX8GXBXR43XZ2XIXZ3X4GX3R43XZ2XIXZ3X4G3R44XZ2XIXQX9R44X2QXI2ZI5X4R44X2Q2ZQ2X4IX4R44X2I3XQZ2X2IX2G2R44X4IXZQ2ZXIX4R44X4IXZQ2ZXIX4R44G2X2IX2Z2QXI3X2R44X4IX4Q2ZQ2X2R44X4I5ZI2XQX2R44X9QXIXZ2XR44G3X4Z3XIXZ2XR43X3GX4Z3XIXZ2XR43XAXGX8IX4R43X3R1062'],
  [0,'cave','R2071X3ZX5R51X3ZX3GX4R48X10BXR48X7GX4R34X4Z2R8X9R37ZI3X4ZX2ZXZX4R41X3I2X4ZX2I4X3R41X3Q2X4ZX4Q2X3R41X3Q2X4ZX4Q2X3R41X3I4X2ZX4I2X3R36X9ZXZX2ZX4I3ZR34X4GX7R8Z2X4R34XAX10R48X4GX3ZX3R51X5ZX3R700'],


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
    data.socket = socket;
    let join = this.joinMsg(data.username);
    toDiscord(join);
    this.logs.push({m: join, c: '#66FF00'});
    super.add(data);
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
      t.socket._send(pack(t.msg), {}, e => {
        if (e) console.log('send error='+e);
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
    t.msg.u.push(e.constructor[e.type === 'barrier' || e.type === 'void' ? 'raw2' : 'raw'].reduce((a, c) => {
      a.push(c, Multiplayer.num(e[c]));
      return a;
    }, A.template('arr').concat(e.id)));
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
      let d = c;
      c = A.template('arr');
      c.push(...d);
      for (let l = 1; l < t.msg.u[i].length; l += 2) {
        let m = c.indexOf(t.msg.u[i][l]);
        if (m !== -1) {
          t.msg.u[i][l+1] = Multiplayer.num(e[t.msg.u[i][l]]);
          c.splice(m, 1);
        }
      }
      for (const p of c) t.msg.u[i].push(p, Multiplayer.num(e[p]));
      c.release();
    } else t.msg.u.push(c.reduce((a, p) => {
      a.push(p, e[p]);
      return a;
    }, A.template('arr').concat(e.id)));
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
    this.loggers = [];
  }
  add(socket, data) {
    super.add(socket, data);
    if (this.loggers.includes(socket.username)) {
      this.loggers.splice(this.loggers.indexOf(socket.username), 1);
      this.pt[this.pt.length-1].ded = true;
    }
  }
  ontick() {}
  disconnect(socket, code, reason) {
    const t = this.pt.find(t => t.username === socket.username);
    if (t && t.hp !== t.maxHp && !t.regenInterval) this.loggers.push(t.username);  
    super.disconnect(socket, code, reason);
  }
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
        let stats = this.pt.reduce((a, c) => {
          if (Engine.getTeam(c) === 'RED') return [a[0]+1, a[1]];
          if (Engine.getTeam(c) === 'BLUE') return [a[0], a[1]+1];
          return a;
        }, [0, 0]);
        this.global = '======'+this.wins.RED+'- RED '+stats[0]+'v'+stats[1]+' BLUE - '+this.wins.BLUE+'======';
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
    server.levelReader(JSON.parse(data[1].replace(/'/g, '"')));
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
  restart: [Object, 1, 1, function() {
    process.exit(1);
  }],
  sread: [Object, 1, 2, function(data) {
    const value = servers[this.room][data[1]];
    if (value !== undefined) servers[this.room].logs.push({m: typeof value === Object ? JSON.stringify(value) : value, c: '#FFFFFF'});
  }],
  kick: [Object, 2, 2, (data, socket, server, t) => {
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
  whitelist: [Object, 2, 2, (data, socket, server) => {
    if (Storage.whitelist.includes(data[1])) return;
    Storage.whitelist.push(data[1]);
    if (server && server.logs) server.logs.push({m: data[1]+' was added to the whitelist!', c: '#00ff00'});
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
  swrite: [Object, 1, 3, (data, socket) => {
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
      if (data.msg.length > 2000) return socket.send({status: 'error', message: 'You have exceed 2k size limit!'});
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
    const discordAcceptable = ['admin', 'removeadmin', 'vip', 'removevip', 'reload', 'playerlist', 'msg', 'filter', 'allow', 'run', 'ban', 'banlist', 'pardon', 'mute', 'unmute', 'kick', 'kill', 'ded', 'live', 'restart', 'flushlogs', 'getlogs', 'announce', 'lockchat', 'lockdown', ];
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
