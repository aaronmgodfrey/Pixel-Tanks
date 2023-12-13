const settings = {
  authserver: 'localhost',
  bans: [],
  banips: [],
  full_auth: ['cs641311'],
  admins: ['bradley', 'Celestial'],
  vips: ['DarkMemeGod'], 
  mutes: [],
  players_per_room: 400,
  ups: 60,
}

const Engine = require('./public/js/Engine.js');
const Tank = require('./public/js/Tank.js');
const Block = require('./public/js/Block.js');
const Damage = require('./public/js/Damage.js');
const Shot = require('./public/js/Shot.js');
const AI = require('./public/js/AI.js');
const {gpt} = require('gpti');


const hasAccess = (username, clearanceLevel) => {
  // 1 => full auth only, 2 => admins and above, 3 => vips and above, 4 => any
  const isAdmin = settings.admins.includes(username), isVIP = settings.admins.includes(username);
  if (clearanceLevel === 4 || settings.full_auth.includes(username)) return true;
  if (clearanceLevel === 3 && (isVIP || isAdmin)) return true;
  if (clearanceLevel === 2 && isAdmin) return true;
  return false;
}

const auth = async(username, token) => {
  const response = await fetch('http://'+settings.authserver+`/verify?username=${username}&token=${token}`);
  return await response.text() === 'true';
}
const deathMessages = [
  `{victim} was killed by {killer}`,
  `{victim} was put out of their misery by {killer}`,
  `{victim} was assassinated by {killer}`,
  `{victim} was comboed by {killer}`,
  `{victim} was eliminated by {killer}`,
  `{victim} was crushed by {killer}`,
  `{victim} was sniped by {killer}`,
  `{victim} was exploded by {killer}`,
  `{victim} was executed by {killer}`,
  `{victim} was deleted by {killer}`,
  `{victim} proved no match for {killer}`,
  `{victim} was outplayed by {killer}`,
  `{victim} was obliterated by {killer}`,
  `{victim} fell prey to {killer}`,
  `{victim} was fed a healthy dose of explosives by {killer}`,
  `{victim} became another number in {killer}'s kill streak`,
  `{victim} got wrecked by {killer}`,
  `{victim} found out that {killer} was the best in the world`,
  `{victim} was reduced to atoms by {killer}`
], joinMessages = [
  `{idot} joined the game`,
  `{idot} is now online`,
  `{idot} materialized`,
  `{idot} is ready to breadspam`,
  `{idot} is here to prove that he is the best in the world`,
  `{idot} is here`
], rageMessages = [
  `{idot} left the game`,
  `{idot} got gogaurdianed`,
  `{idot} quit`,
  `{idot} disconnected`,
  `{idot} got techered`,
  `{idot} will return soon`
];

let tickspeed = 'N/A';

class Multiplayer extends Engine {
  constructor(levels) {
    super(levels);
    this.sendkey = {'Block': 'b', 'Shot': 's', 'AI': 'ai', 'Tank': 'pt', 'Damage': 'd'};
    this.sendkeyValues = ['b', 's', 'ai', 'pt', 'd'];
    if (!settings.fps_boost) this.i.push(setInterval(() => this.send(), 1000/settings.UPS));
  }

  override(t) {
    t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
  }

  add(socket, data) {
    data.socket = socket;
    this.logs.push({m: this.joinMsg(data.username), c: '#66FF00'});
    super.add(data);
  }

  update(data) {
    super.update(data);
  }

  send() {
    for (const t of this.pt) {
      const render = {b: new Set(), pt: new Set(), ai: new Set(), s: new Set(), d: new Set(), logs: this.logs.length};
      const vx = t.x-860, vy = t.y-560, vw = 1880, vh = 1280;      
      const message = {b: [], pt: [], ai: [], s: [], d: [], logs: this.logs.slice(t?.render.logs || 0).concat(t.privateLogs), global: this.global, tickspeed, event: 'hostupdate', delete: {b: [], pt: [], ai: [], s: [], d: []}};
      t.privateLogs = [];
      let send = false;
      if (message.logs.length) send = true;
      for (const p of ['b', 'pt', 'ai', 's', 'd']) {
        const ids = new Set(this[p].map(e => e.id));
        this[p].filter(e => Engine.collision(vx, vy, vw, vh, e.x, e.y, 100, 100)).forEach(e => {
          render[p].add(e.id);
          if (!t.render[p].has(e.id) || e.updatedLast > t.lastUpdate) {
            message[p].push(e.raw);
            send = true;
          }
        });
        t.render[p].forEach(id => {
          if (!render[p].has(id) || !ids.has(id)) {
            message.delete[p].push(id);
            send = true;
          }
        });
      }
      t.render = render;
      t.lastUpdate = Date.now();
      if (send) t.socket.send(message);
    }
  }


  cellSend() {
    for (const t of this.pt) {
      const fx = Math.floor(t.x/100), fy = Math.floor(t.y/100), sy = Math.max(fy-7, 0), ey = Math.min(fy+7, 30), sx = Math.max(fx-10, 0), ex = Math.min(fx+10, 30);
      const newrender = {b: new Set(), pt: new Set(), ai: new Set(), s: new Set(), d: new Set(), logs: this.logs.length, sx, sy, ex, ey};
      const message = {b: [], pt: [], ai: [], s: [], d: [], logs: this.logs, global: this.global, tickspeed, event: 'hostupdate', delete: {b: [], pt: [], ai: [], s: [], d: []}};      
      let send = t.render.logs !== newrender.logs;
      for (let cy = sy; cy < ey; cy++) {
        for (let cx = sx; cx < ex; cx++) {
          for (const entity of this.cells[cx][cy]) {
            const type = this.sendkey[entity.constructor.name];
            newrender[type].add(entity.id);
            if (!t.render[type].has(entity.id) || entity.updatedLast > t.lastUpdate) {
              message[type].push(entity.raw);
              send = true;
            }
          }
        }
      }
      for (const entity of this.sendkeyValues) {
        for (const id of t.render[entity]) {
          if (!newrender[entity].has(id)) {
            message.delete[entity].push(id);
            send = true;
          }
        }
      }
      t.render = newrender;
      t.lastUpdate = Date.now();
      if (send) t.socket.send(message);
    }
  }

  disconnect(socket, code, reason) {
    this.pt = this.pt.filter(t => {
      if (t.username === socket.username) {
        for (const cell of t.cells) {
          const [x, y] = cell.split('x');
          this.cells[x][y].delete(t);
        }
        return false;
      }
      return true;
    });
    this.ai = this.ai.filter(ai => Engine.getUsername(ai.team) !== socket.username);
    this.logs.push({m: this.rageMsg(socket.username), c: '#E10600'});
    if (this.pt.length === 0) {
      this.i.forEach(i => clearInterval(i));
      delete servers[socket.room];
    }
  }

  deathMsg(victim, killer) {
    return deathMessages[Math.floor(Math.random()*deathMessages.length)].replace('{victim}', victim).replace('{killer}', killer);
  }

  joinMsg(player) {
    return joinMessages[Math.floor(Math.random()*joinMessages.length)].replace('{idot}', player);
  }

  rageMsg(player) {
    return rageMessages[Math.floor(Math.random()*rageMessages.length)].replace('{idot}', player);
  }
}

class FFA extends Multiplayer {
  constructor() {
    super(ffaLevels);
  } 

  ondeath(t, m={}) {
    this.logs.push({m: this.deathMsg(t.username, m.username), c: '#FF8C00'});
    for (const ai of this.ai) if (Engine.getUsername(ai.team) === t.username) this.ai.splice(this.ai.indexOf(ai), 1);
    if (t.socket) t.ded = true;
    if (m.socket) m.socket.send({event: 'kill'});
    if (m.deathEffect) t.dedEffect = {x: t.x, y: t.y, r: t.r, id: m.deathEffect, start: Date.now(), time: 0}
  }

  ontick() {}
}

class DUELS extends Multiplayer {
  constructor() {
    super(duelsLevels);
    this.round = 1;
    this.mode = 0; // 0 -> waiting for other player, 1 -> 10 second ready timer, 2-> match active
    this.wins = {};
  }

  add(socket, data) {
    super.add(socket, data);
    if (this.pt.length === 1) {
      this.global = 'Waiting For Player...';
    } else {
      this.readytime = Date.now();
      this.mode++;
    }
  }

  ontick() {
    if ([0, 1].includes(this.mode)) {
      this.pt[0].x = this.spawns[0].x;
      this.pt[0].y = this.spawns[0].y;
      this.override(this.pt[0]);
    }
    if (this.mode === 1) {
      this.pt[1].x = this.spawns[1].x;
      this.pt[1].y = this.spawns[1].y;
      this.override(this.pt[1]);
      this.global = 'Round '+this.round+' in '+(5-Math.floor((Date.now()-this.readytime)/1000));
      if (5-(Date.now()-this.readytime)/1000 <= 0) {
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m) {
    t.ded = true;
    if (m.deathEffect) t.dedEffect = {x: t.x, y: t.y, r: t.r, id: m.deathEffect, start: Date.now(), time: 0}
    if (m.username) this.logs.push({m: this.deathMsg(t.username, m.username), c: '#FF8C00'});
    if (m.socket) m.socket.send({event: 'kill'});
    for (const ai of this.ai) {
      if (Engine.getUsername(ai.team) === t.username) {
        this.ai.splice(this.ai.indexOf(ai), 1);
      }
    }
    this.wins[m.username] = this.wins[m.username] === undefined ? 1 : this.wins[m.username]+1;
    if (this.wins[m.username] === 3) {
      this.global = m.username+' Wins!';
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
          tank.hp = tank.maxHp;
          tank.shields = 0;
          tank.ded = false;
          tank.socket.send({event: 'ded'});
        });
        this.b = [];
        this.s = [];
        this.ai = [];
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
    super([[["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]]]);
    this.global = 'Waiting for Players...';
    this.round = 1;
    this.mode = 0; // 0 -> Lobby/Waiting for players, 1 -> About to enter round, 2 -> in game
    this.wins = {RED: 0, BLUE: 0};
  }

  add(socket, data) {
    super.add(socket, data);
    const t = this.pt[this.pt.length-1];
    let red = 0, blue = 0;
    this.pt.forEach(tank => {
      if (tank.color === '#FF0000') {
        red++;
      } else if (tank.color === '#0000FF') {
        blue++;
      }
    });
    if (red > blue) t.color = '#0000FF';
    if (red < blue) t.color = '#FF0000';
    if (red === blue) t.color = (Math.random() < .5 ? '#FF0000' : '#0000FF');
    t.team = t.username+':LOBBY';
    if (this.pt.length === 4) {
      this.readytime = Date.now();
      this.time = 60; // 1 minute starting time
      this.global = 'Starting in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
    }
  }

  ontick() {
    if (this.mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode = 1; // game start
        this.readytime = Date.now();
        this.time = 5;
        this.pt.forEach(t => {
          t.team = t.username+':'+(t.color === '#FF0000' ? 'RED' : 'BLUE');
        });
        this.levelReader(tdmLevels[Math.floor(Math.random()*tdmLevels.length)]);
      } else if (this.pt.length >= 4) this.global = 'Starting in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
    } else if (this.mode === 1) {
      this.pt.forEach(t => {
        const spawn = Engine.getTeam(t.team) === 'BLUE' ? 0 : 1;
        t.x = this.spawns[spawn].x;
        t.y = this.spawns[spawn].y;
        this.override(t);
      });
      this.global = 'Round '+this.round+' in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m) {
    t.ded = true;
    if (m.deathEffect) t.dedEffect = {
      x: t.x,
      y: t.y,
      r: t.r,
      id: m.deathEffect,
      start: Date.now(),
      time: 0,
    }
    if (m.username) this.logs.push({m: this.deathMsg(t.username, m.username), c: '#FF8C00'});
    if (m.socket) m.socket.send({event: 'kill'});
    for (const ai of this.ai) {
      if (Engine.getUsername(ai.team) === t.username) {
        this.ai.splice(this.ai.indexOf(ai), 1);
      }
    }
    let allies = 0;
    this.pt.forEach(tank => {
      if (!tank.ded) {
        if (Engine.getTeam(tank.team) === Engine.getTeam(t.team)) {
          allies++;
        }
      }
    });
    if (allies === 0) {
      const winner = Engine.getTeam(m.team);
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
            tank.hp = tank.maxHp;
            tank.shields = 0;
            tank.ded = false;
            t.socket.send({event: 'ded'});
          });
          this.b = [];
          this.s = [];
          this.ai = [];
          this.d = [];
          this.levelReader(tdmLevels[Math.floor(Math.random()*tdmLevels.length)]);
          this.round++;
          this.mode = 1; 
          this.readytime = Date.now();
        }, 5000);
      }   
    }
  }
}

class Defense extends Multiplayer {
  constructor() {
    super([[["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]]]);
    this.global = 'Waiting for Players...';
    this.wave = 1;
    this.mode = 0; // 0 -> Lobby/Waiting for players, 1 -> Interwave period, 2 -> in game
  }

  add(socket, data) {
    super.add(socket, data);
    const len = this.pt.length, t = this.pt[len-1];
    if (t.class === 'stealth') {
      t.socket.send({status: 'error', message: 'Sorry sir, but stealth is too op for this '});
      setTimeout(() => t.socket.close());
    }
    t.team = t.username+':LOBBY';
    this.readytime = Date.now();
    this.time = 90;
  }

  startNewWave() {
    for (const ai of this.ai) ai.destroy();
    
  }

  ontick() {
    if (this.mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode++;
      } else if (this.pt.length > 4) this.global = 'Starting in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
    } else if (this.mode === 1) {
      
    }
  }
}


const Commands = {
  playerlist: [Object, 4, 1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username);
    for (const tank of servers[this.room].pt) t.privateLogs.push({m: tank.username, c: '#FFFFFF'});
  }],
  msg: [Object, 4, -1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username);
    const m = servers[this.room].pt.find(t => t.username === data[1]);
    const message = {m: `[${this.username}->${data[1]}] ${data.slice(2).join(' ')}`, c: '#FFFFFF'};
    t.privateLogs.push(message);
    m.privateLogs.push(message);
  }],
  createteam: [FFA, 4, 2, function(data) {
    if (servers[this.room].pt.find(t => Engine.getTeam(t.team) === data[1])) return this.send({status: 'error', message: 'This team already exists.'});
    if (data[1].includes('@leader') || data[1].includes('@requestor#') || data[1].includes(':') || data[1].length > 20) return this.send({status: 'error', message: 'Team name not allowed.'});
    servers[this.room].pt.find(t => t.username === this.username).team = this.username+':'+data[1]+'@leader';
    servers[this.room].logs.push({m: this.username+' created team '+data[1]+'. Use /join '+data[1]+' to join.', c: '#0000FF'});
  }],
  join: [FFA, 4, 2, function(data) {
    if (servers[this.room].pt.find(t => t.username === this.username).team.includes('@leader')) return this.send({status: 'error', message: 'You must disband your team to join. (/leave)'});
    if (!servers[this.room].pt.find(t => Engine.getTeam(t.team) === data[1] && t.team.includes('@leader'))) return this.send({status: 'error', message: 'This team does not exist.'});
    servers[this.room].pt.find(t => t.username === this.username).team += '@requestor#'+data[1];
    servers[this.room].logs.push({m: this.username+' requested to join team '+data[1]+'. Team owner can use /accept '+this.username+' to accept them.', c: '#0000FF'});
  }],
  accept: [FFA, 4, 2, function(data) {
    const leader = servers[this.room].pt.find(t => t.username === this.username), requestor = servers[this.room].pt.find(t => t.username === data[1]);
    if (!requestor) return this.send({status: 'error', message: 'Player not found.'});
    if (leader.team.includes('@leader') && requestor.team.includes('@requestor#') && Engine.getTeam(leader.team) === requestor.team.split('@requestor#')[1]) {
      requestor.team = data[1]+':'+Engine.getTeam(leader.team);
      servers[this.room].logs.push({ m: data[1]+' has joined team '+Engine.getTeam(leader.team), c: '#40C4FF' });
    }
  }],
  leave: [FFA, 4, 1, function(data) {
    const target = servers[this.room].pt.find(t => t.username === this.username);
    if (target.team.includes('@leader')) servers[this.room].pt.forEach(t => {
      if (Engine.getTeam(t.team) === Engine.getTeam(target.team)) t.team = t.username+':'+Math.random();
    });
    target.team = this.username+':'+Math.random();
  }],
  gpt: [Object, 4, -1, function(data) {
    gpt({prompt: data.slice(1).join(' '), model: 'gpt-4'}, (err, data) => servers[this.room].pt.find(t => t.username === this.username).privateLogs.push({m: err === null ? data.gpt : err, c: '#DFCFBE'}));
  }],
  nuke: [Object, 2, 1, function(data) {
    for (let x = 0; x < 30; x += 2) for (let y = 0; y < 30; y += 2) servers[this.room].b.push(new Block(x*100, y*100, Infinity, 'airstrike', 'server.admin.commands.nuke:_', servers[this.room]));
  }],
  newmap: [FFA, 4, 1, function(data) {
    servers[this.room].levelReader(ffaLevels[Math.floor(Math.random()*ffaLevels.length)]);
    servers[this.room].pt.forEach(t => {
      t.x = servers[this.room].spawn.x;
      t.y = servers[this.room].spawn.y;
      t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
    });
  }],
  ipban: [Object, 2, 2, function(data) {
    
  }],
  ippardon: [Object, 2, 2, function(data) {
    settings.ipbans.splice(settings.ipbans.indexOf(data[1]));
  }],
  ban: [Object, 2, 2, function(data) {
    if (settings.admins.includes(data[1]) || settings.full_auth.includes(data[1])) return this.send({status: 'error', message: `You can't ban another admin!`});
    settings.bans.push(data[1]);
    servers[this.room].logs.push({m: data[1]+' was banned by '+this.username, c: '#FF0000'});
    servers[this.room].pt.find(t => t.username === data[1]).socket.send({status: 'error', message: 'You are banned!'});
    for (const socket of sockets) if (socket.username === data[1]) setTimeout(() => socket.close());
  }],
  banlist: [Object, 2, 2, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username);
    t.privateLogs.push({m: '-----Ban List-----', c: '#00FF00'});
    for (const ban of settings.bans) t.privateLogs.push({m: ban, c: '#00FF00'});
  }],
  pardon: [Object, 2, 2, function(data) {
    settings.bans.splice(settings.bans.indexOf(data[1]), 1);
    servers[this.room].logs.push({m: data[1]+' was pardoned by '+this.username, c: '#0000FF'});
  }],
  mute: [Object, 2, 2, function(data) {
    if (settings.mutes.includes(data[1])) return this.send({status: 'error', message: 'bro is already muted, calm down'});
    settings.mutes.push(data[1]);
    servers[this.room].logs.push({m: data[1]+' was muted by '+this.username, c: '#FFFF22'});
  }],
  unmute: [Object, 2, 2, function(data) {
    settings.mutes.splice(settings.mutes.indexOf(data[1]), 1);
    servers[this.room].logs.push({m: data[1]+' was unmuted by '+this.username, c: '#0000FF'});
  }],
  kick: [Object, 2, 2, function(data) {
    for (const socket of sockets) if (socket.username === data[1]) {
      socket.send({status: 'error', message: 'You have been kicked by '+this.username});
      setTimeout(() => socket.close());
    }
  }],
  kill: [FFA, 2, 2, function(data) {
    for (const server of Object.values(servers)) for (const t of server.pt) if (data[1] === t.username) t.damageCalc(t.x, t.y, 6000, this.username);
  }],
  ai: [Object, 2, 7, function(data) {
    for (let i = 0; i < Number(data[5]); i++) servers[this.room].ai.push(new AI(Math.floor(Number(data[1]) / 100) * 100 + 10, Math.floor(Number(data[2]) / 100) * 100 + 10, Number(data[3]), Math.min(20, Math.max(0, Number(data[4]))), data[6], servers[this.room]));
  }],
  spectate: [Object, 3, 2, function(data) {
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) t.ded = true;
  }],
  live: [Object, 3, 2, function(data) {
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) t.ded = false;
  }],
  switch: [TDM, 4, 2, function(data) {
    if (servers[this.room].mode === 0) for (const t of servers[this.room].pt) if (t.username === (data.length === 1 ? this.username : data[1])) t.color = t.color === '#FF0000' ? '#0000FF' : '#FF0000';
  }],
  start: [TDM, 2, 1, function() {
    if (servers[this.room].mode === 0) {
      servers[this.room].readytime = Date.now();
      servers[this.room].time = 0;
    }
  }],
  reboot: [Object, 2, 1, function() {
    process.exit(1);
  }],
  sread: [Object, 1, 2, function(data) {
    const value = servers[this.room][data[1]];
    if (value !== undefined) servers[this.room].logs.push({m: typeof value === Object ? JSON.stringify(value) : value, c: '#FFFFFF'});
  }],
  swrite: [Object, 1, 3, function(data) {
    eval(`try {
      servers['${this.room}']['${data[1]}'] = ${data[2]};
    } catch(e) {
      servers['${this.room}'].pt.find(t => t.username === '${this.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  tread: [Object, 1, 3, function(data) {
    for (const t of servers[this.room].pt) if (t.username === data[1]) {
      const value = t[data[2]];
      if (value !== undefined) servers[this.room].logs.push({m: typeof value === Object ? JSON.stringify(value) : value, c: '#FFFFFF'});
      return;
    }
  }],
  twrite: [Object, 1, 4, function(data) {
    eval(`try {
      const server = servers['${this.room}'], tank = server.pt.find(t => t.username === '${data[1]}');
      tank['${data[2]}'] = ${data[3]};
    } catch(e) {
      servers['${this.room}'].pt.find(t => t.username === '${this.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  help: [Object, 2, 1, function(data) {
    servers[this.room].pt.find(t => t.username === this.username).privateLogs.push({m: 'Commands: /createteam <name>, /join <name>, /accept <player>, /leave, /start, /switch <player>', c: '#0000FF'}, {m: '/reboot, /live <player>, /spectate <player>, /ai <x> <y> <type> <rank> <amount> <team>, /newmap', c: '#0000FF'}, {m: '/kill <player>, /kick <player>, /mute <player> <time>, /unmute <player>, /ban <player> /pardon <player>', c: '#0000FF'}, {m: '/ipban <player>, /pardon <player>, /help', c: '#0000FF'})
  }],
  scream: [Object, 2, -1, function(data) {
    if (this.username !== 'bradley') return this.send({status: 'error', message: 'You are not a bradley!'});
    let victim = servers[this.room].pt.find(t => t.username === 'cs641311');
    if (victim === undefined) return this.send({status: 'error', message: 'Mission Failed! Wild I-ron not spotted!'});
    const messages = 100, span = 5000; // messages = # to send, span = time frame to send them over
    for (let i = 0; i < messages; i++) setTimeout(() => victim.privateLogs.push({m: 'Bread: '+data.slice(1).join(' ').toUpperCase(), c: Engine.getRandomColor()}), span/messages*i);
  }],
};

const joinKey = {'ffa': FFA, 'duels': DUELS, 'tdm': TDM};

const Profile = (arr, update) => {
  const functions = [];
  for (let e of arr) {
    if (typeof e !== 'function') continue;
    if (/^\s*class\s+/.test(e.toString())) {
      const n = e.name;
      for (const p of Object.getOwnPropertyNames(e)) {
        if (typeof e[p] === 'function') {
          const f = {name: n+'.'+e[p].name, o: e[p], i: 0, t: 0, min: Infinity, max: 0};
          e[p] = function() {
            const start = process.hrtime();
            const r = f.o.apply(this, arguments);
            f.i++;
            const end = process.hrtime(start);
            const time = (end[0]+Math.floor(end[1]/1000000))+((end[1]%1000000)/1000000);
            if (time < f.min) f.min = time;
            if (time > f.max) f.max = time;
            f.t = (f.t*(f.i-1)+time)/f.i;
            update(functions);
            return r;
          }
          Object.defineProperty(e[p], 'name', {value: f.name.split('.')[1]});
          functions.push(f);
        }
      }
      for (const p of Object.getOwnPropertyNames(e.prototype)) {
        if (typeof e.prototype[p] === 'function') {
          const f = {name: n+'.'+p, o: e.prototype[p], i: 0, t: 0, min: Infinity, max: 0};
          e.prototype[p] = function() {
            const start = process.hrtime();
            const r = f.o.apply(this, arguments);
            f.i++;
            const end = process.hrtime(start);
            const time = (end[0]+Math.floor(end[1]/1000000))+((end[1]%1000000)/1000000);
            if (time < f.min) f.min = time;
            if (time > f.max) f.max = time;
            f.t = (f.t*(f.i-1)+time)/f.i;
            update(functions);
            return r;
          }
          Object.defineProperty(e.prototype[p], 'name', {value: p === 'constructor' ? n : p});
          functions.push(f);
        }
      }
    }
  }
}

let lagometer = [];
Profile([Engine, Block, Shot, Tank, AI, Damage, FFA, TDM, DUELS, Multiplayer], f => {
  lagometer = f;
});
setInterval(() => {
  lagometer.sort((a, b) => b.t - a.t);
  const top = lagometer.slice(0, Math.min(15, lagometer.length));
  console.log('-----PROFILING REPORT-----');
  for (const t of top) console.log(t.name+': Min='+t.min+'Avg='+t.t+' Max='+t.max+' Runs='+t.i);
}, 10000);

const multiopen = (socket) => {
  sockets.add(socket);
}
const multimessage = (socket, data) => {
  if (!socket.username) socket.username = data.username;
  if (data.type === 'update') {
    if (settings.bans.includes(data.username)) {
      socket.send({status: 'error', message: 'You are banned!'});
      return setTimeout(() => socket.close());
    }
    servers[socket.room].update(data);
  } else if (data.type === 'join') {
    if (settings.bans.includes(data.username)) {
      socket.send({status: 'error', message: 'You are banned!'});
      return setTimeout(() => socket.close());
    }
    let server;
    for (const id in servers) {
      if (servers[id] instanceof joinKey[data.gamemode]) {
        if (data.gamemode === 'ffa' && servers[id].pt.length >= settings.players_per_room) continue;
        if (data.gamemode === 'duels' && servers[id].pt.length !== 1) continue;
        if (data.gamemode === 'tdm' && servers[id].mode !== 0) continue;
        server = id;
        break;
      }
    }
    if (!server) {
      server = Math.random();
      servers[server] = new joinKey[data.gamemode]();
    }
    if (servers[server].pt.some(t => t.username === socket.username)) {
      socket.send({status: 'error', message: 'You are already in the server!'});
      return setImmediate(() => socket.close());
    }
    socket.room = server;
    servers[server].add(socket, data.tank);
  } else if (data.type === 'ping') {
    socket.send({event: 'ping', id: data.id});
  } else if (data.type === 'chat') {
    // handle mutes and filtering here
    if (settings.mutes.includes(socket.username)) return socket.send({status: 'error', message: 'You are muted!'});
    if (servers[socket.room]) servers[socket.room].logs.push({m: `[${socket.username}] ${data.msg}`, c: '#ffffff'});
    if (servers[data.room]) servers[data.room].logs.push({m: `[${data.username}] ${data.msg}`, c: '#ffffff'});
  } else if (data.type === 'logs') {
    if (servers[data.room]) socket.send({event: 'logs', logs: servers[data.room].logs});
  } else if (data.type === 'command') {
    const f = Commands[data.data[0]];
    if (!f) return socket.send({status: 'error', message: 'Command not found.'});
    if (!(servers[socket.room] instanceof f[0])) return socket.send({status: 'error', message: 'This command is not available in this server type.'});
    if (data.data.length !== f[2] && f[2] !== -1) return socket.send({status: 'error', message: 'Wrong number of arguments.'});
    if (!hasAccess(socket.username, f[1])) return socket.send({status: 'error', message: `You don't have access to this.`});
    f[3].bind(socket)(data.data);
  } else if (data.type === 'stats') {
    let gamemodes = {FFA: [], DUELS: [], TDM: [], tickspeed, event: 'stats'};
    for (const id in servers) {
      gamemodes[servers[id].constructor.name][id] = [];
      for (const pt of servers[id].pt) {
        gamemodes[servers[id].constructor.name][id].push(pt.username);
      }
    }
    socket.send(gamemodes);
  }
}
const multiclose = (socket, code, reason) => {
  sockets.delete(socket);
  if (servers[socket.room]) servers[socket.room].disconnect(socket, code, reason);
}
module.exports = {multiopen, multimessage, multiclose};
