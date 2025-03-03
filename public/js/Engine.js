class Engine {
  constructor(levels, difficulty) {
    if (!A.templates.Block) {
      A.createTemplate('Tank', Tank);
      A.createTemplate('Block', Block);
      A.createTemplate('Shot', Shot);
      A.createTemplate('Damage', Damage);
      A.createTemplate('AI', AI);
      //A.createTemplate('arr', Array, a => (a.length = 0)); // batch size of 100, will inc upon higher demand. Startup value may vary depending on use case.
      //A.createTemplate('set', Set, s => s.clear());
    }
    this.spawn = {x: 0, y: 0};
    this.spawns = [];
    for (const property of ['ai', 's', 'pt', 'b', 'd', 'i', 'logs', 'cells', 'map', 'updates', 'deletions', 'ids']) this[property] = [];
    for (let y = 0; y < 60; y++) {
      this.cells[y] = [];
      this.map[y] = [];
      for (let x = 0; x < 60; x++) {
        this.cells[y][x] = new Set();
        this.map[y][x] = {x, y, walkable: true, g: 0, h: 0, f: 0, parent: null};
      }
    }
    this.difficulty = difficulty;
    if (isNaN(this.difficulty)) this.difficulty = 20;
    this.levelReader(levels[Math.floor(Math.random()*levels.length)]);
    this.i.push(setInterval(() => this.tick(), 1000/60));
  }

  add(data) {
    A.template('Tank').init(data, this);
  }

  useAbility(t, a) {
    if (a === 'dynamite') {
      for (let i = this.s.length-1; i >= 0; i--) {
        const s = this.s[i];
        if (Engine.getUsername(s.team) !== t.username || s.type !== 'dynamite') continue;
        A.template('Damage').init(s.x-50, s.y-50, 100, 100, 100*(t.rank/50+.6), s.team, this);
        s.destroy();
      }
    } else if (a === 'toolkit') {
      if (t.healTimeout !== undefined) {
        clearTimeout(t.healTimeout);
        t.healTimeout = undefined;
      } else {
        t.healTimeout = setTimeout(() => {
          t.hp = t.maxHp;
          t.healTimeout = undefined;
          const hx = Math.floor(t.x/100), hy = Math.floor(t.y/100);
          for (let i = Math.max(0, hx-1); i <= Math.min(59, hx+1); i++) for (let l = Math.max(0, hy-1); l <= Math.min(59, hy+1); l++) {
            for (const entity of this.cells[i][l]) if (entity instanceof Shot) if (entity.type === 'usb' && entity.target === t) entity.destroy();
          }
        }, 7500);
       }
    } else if (a === 'tape') {
      t.hp = Math.min(t.maxHp, t.hp+t.maxHp/4);
    } else if (a === 'healburst') {
      A.template('Damage').init(t.x-110, t.y-110, 300, 300, -150*(t.rank/50+.6), t.team, this);
    } else if (a === 'glu') {
      clearInterval(t.gluInterval);
      clearTimeout(t.gluTimeout);
      t.gluInterval = setInterval(() => {
        t.hp = Math.min(t.maxHp, t.hp+.5*(t.rank/50+.6));
      }, 15);
      t.gluTimeout = setTimeout(() => clearInterval(t.gluInterval), 5000);
    } else if (a.includes('block#')) {
      const coords = [{ r: [337.5, 360], dx: -10, dy: 80 }, { r: [0, 22.5], dx: -10, dy: 80 }, { r: [22.5, 67.5], dx: -100, dy: 80 }, { r: [67.5, 112.5], dx: -100, dy: -10 }, { r: [112.5, 157.5], dx: -100, dy: -100 }, { r: [157.5, 202.5], dx: -10, dy: -100 }, { r: [202.5, 247.5], dx: 80, dy: -100 }, { r: [247.5, 292.5], dx: 80, dy: -10 }, { r: [292.5, 337.5], dx: 80, dy: 80 }];
      const type = a.replace('block#', '');
      if (type === 'spike') {
        this.b.push(A.template('Block').init(t.x+15, t.y+15, type, t.team, this));
      } else {
        for (const coord of coords) {
          if (t.r >= coord.r[0] && t.r < coord.r[1]) {
            this.b.push(A.template('Block').init(t.x+coord.dx, t.y+coord.dy, type, t.team, this));
            break;
          }
        }
      }
    } else if (a === 'break') {
      for (const cell of t.cells) {
        const c = cell.split('x'), cx = c[0], cy = c[1], breakable = ['gold', 'weak', 'strong', 'spike', 'barrier', 'void', 'barrel', 'halfbarrier', 'crate'];
        for (const entity of this.cells[cx][cy]) if (entity instanceof Block && Engine.collision(t.x, t.y, 80, 80, entity.x, entity.y, 100, 100) && breakable.includes(entity.type)) entity.destroy();
      }
    } if (a === 'turret') {
      A.template('AI').init(Math.floor(t.x / 100) * 100 + 10, Math.floor(t.y / 100) * 100 + 10, 0, t.rank, t.team, this);
      let turrets = [];
      for (const ai of this.ai) if (ai.role === 0 && Engine.getUsername(ai.team) === t.username) turrets.push(ai);
      if (turrets.length > t.maxTurrets) turrets.sort((a, b) =>  a.ammo-b.ammo)[0].destroy();
    } else if (a === 'bash') {
      t.buff = true; // name fix
      setTimeout(() => (t.buff = false), 1000);
    } else if (a === 'invis') {
      t.invis = true;
      setTimeout(() => { t.invis = false }, 20000);
    } else if (a === 'shield') {
      t.shields = 100;
    } else if (a === 'reflector') {
      t.reflect = true;
      setTimeout(() => {
        t.reflect = false;
      }, 500);
    } else if (a.includes('airstrike')) {
      const rotation = Math.floor(Math.random()*360), h = a.replace('airstrike', '').split('x');
      for (let i = -2; i <= 2; i++) {
        const airstrike = A.template('Block');
        airstrike.timer = i/5+5;
        airstrike.init(Number(h[0])+i*Math.cos(Math.PI*rotation/180)*100, Number(h[1])+i*Math.sin(Math.PI*rotation/180)*100, 'airstrike', Engine.parseTeamExtras(t.team), this);
        this.b.push(airstrike);
      }
    } else if (a.includes('crate')) {
      const rotation = Math.floor(Math.random()*360), h = a.replace('crate', '').split('x');
      const supplyairstrike = A.template('Block');
      supplyairstrike.timer = -5;
      supplyairstrike.init(+h[0], +h[1], 'supplyairstrike', undefined, this);
      this.b.push(supplyairstrike);
    } else if (a === 'phase') {
      if (t.grapple) t.grapple.bullet.destroy();
      t.fire = t.grapple = false;
      t.phasing = true;
      clearTimeout(t.phaseTimeout);
      t.phaseTimeout = setTimeout(() => (t.phasing = false), 5000);
    }
  }

  update(data) {
    const t = this.pt.find(t => t.username === data.username);
    if (!t) return;
    data = data.data;
    const {emote, r, baseFrame, use, x, y, fire} = data;
    t.baseRotation = data.baseRotation;
    t.immune = data.immune;
    t.animation = data.animation;
    t.emote = emote;
    t.invis = data.invis;
    t.baseFrame = data.baseFrame;
    if (!t.grapple && (t.x !== x || t.y !== y)) {
      let chunkload = t.socket && (Math.floor((t.x+40)/100) !== Math.floor((x+40)/100) || Math.floor((t.y+40)/100) !== Math.floor((y+40)/100)), ox = t.x, oy = t.y;
      t.x = x;
      t.y = y;
      this.updateEntity(t, Tank.u);
      this.loadCells(t, t.x, t.y, 80, 80); // could be optimized to run less, watch for flooring bottom right tank corner tho
      if (chunkload) this.chunkload(t, ox, oy, t.x, t.y);
    }
    t.r = r;
    if (use.includes('respawn')) {
      t.socket.send({event: 'ded'});
      let ox = t.x, oy = t.y;
      t.x = this.spawn.x;
      t.y = this.spawn.y;
      t.ded = false;
      t.hp = t.maxHp;
      this.override(t, ox, oy);
    }
    if (t.ded || t.phasing) return;
    if (t.immune && t.class === 'fire') {
      for (const cell of t.cells) {
        const [cx, cy] = cell.split('x');
        if (!Engine.collision(cx*100, cy*100, 100, 100, t.x+40, t.y+40, 0, 0)) continue;
        let hasFire = false;
        for (const entity of this.cells[cx][cy]) if (entity instanceof Block && entity.type === 'fire' && Engine.getUsername(entity.team) === t.username && entity.x/100 === cx && entity.y/100 === cy) hasFire = true;
        if (!hasFire) this.b.push(A.template('Block').init(cx*100, cy*100, 'fire', Engine.parseTeamExtras(t.team), this));
      }
    }
    for (const exe of use) this.useAbility(t, exe);
    if (fire.length) {
      for (const s of fire) {
        t.pushback = s.type.includes('missle') ? -9 : -6;
        A.template('Shot').init(t.x+40, t.y+40, 70, s.r, s.type, Engine.parseTeamExtras(t.team), t.rank, this);
      }
    }
  }

  tick() {
    this.ontick();
    for (const s of this.s) s.update();
    for (const a of this.ai) a.update();
    for (const t of this.pt) t.update();
  }

  static r = o => Math.max(0, Math.min(59, o));

  loadCells(e, ex, ey, w, h) {
    del: for (const cell of e.cells) {
      let c = cell.split('x'), xv = c[0], yv = c[1];
      for (let x = Engine.r(Math.floor(ex/100)); x <= Engine.r(Math.floor((ex+w-1)/100)); x++) {
        for (let y = Engine.r(Math.floor(ey/100)); y <= Engine.r(Math.floor((ey+h-1)/100)); y++) {
          if (x === xv && y === yv) continue del;
        }
      }
      this.cells[xv][yv].delete(e);
      e.cells.delete(cell);
    }
    for (let x = Engine.r(Math.floor(ex/100)); x <= Engine.r(Math.floor((ex+w-1)/100)); x++) {
      for (let y = Engine.r(Math.floor(ey/100)); y <= Engine.r(Math.floor((ey+h-1)/100)); y++) {
        if (e.cells.has(`${x}x${y}`)) continue;
        this.cells[x][y].add(e);
        e.cells.add(`${x}x${y}`); 
      }
    }
  }

  updateEntity() {}
  destroyEntity() {}

  ondeath(t, m={}) {
    for (let i = this.ai.length-1; i >= 0; i--) if (Engine.getUsername(this.ai[i].team) === t.username && this.ai[i].role === 0) this.ai[i].destroy();
    if (!m.regenInterval && m.regen) {
      clearTimeout(m.regenTimeout);
      m.regenTimeout = setTimeout(() => (m.regenInterval = setInterval(() => m.regen(), 15)), 1000);
    }
    t.ded = true;
    if (m.socket) m.socket.send({event: 'kill'});
    if (m instanceof AI) for (let i = 0; i < 4; i++) m['canItem'+i] = true;
    if (m.deathEffect) t.dedEffect = {x: t.x, y: t.y, r: t.r, id: m.deathEffect, start: Date.now(), time: 0};
  }

  levelReader(level) {
    for (let i = this.b.length-1; i >= 0; i--) this.b[i].destroy();
    const key = {Q: 'weak', Z: 'strong', G: 'gold', I: 'barrier', R: 'void', V: 'spike'};
    this.zone = level[1];
    this.gametype = level[0];
    let chars = level[2].split(''), a = [];
    main: for (let i = 0; i < chars.length; i++) {
      a.push(chars[i]);
      for (let q = 1, n = ''; true; q++) if (isNaN(chars[i+q])) {
        a.push(q === 1 ? 1 : Number(n));
        i += q-1;
        continue main;
      } else n += chars[i+q];
      a.push(Number(n));
    }
    let l = 0;
    for (let i = 0; i < a.length; i += 2) {
      for (let m = 0; m < a[i+1]; m++) {
        let y = Math.floor(l/60)*100, x = (l%60)*100, offset = key[a[i]] === 'spike' ? 25 : 0;
        if (a[i] === 'S') {
          this.spawn = {x: x, y: y};
        } else if (a[i] === 'A') {
          this.spawns[0] = {x, y};
        } else if (a[i] === 'B') {
          this.spawns[1] = {x, y};
        } else if (a[i] === 'F') {
          this.spawns.push({x, y});
        } else if (['T', 'W', 'P', 'D'].includes(a[i])) {
          A.template('AI').init(x+10, y+10, ['T', 'W', 'P', 'D'].indexOf(a[i]), this.difficulty, 'squad', this);
        } else if (key[a[i]]) this.b.push(A.template('Block').init(x+offset, y+offset, key[a[i]], ':', this));
        l++;
      }
    }
  }

  static getRandomColor() {
    let letters = '0123456789ABCDEF', color = '#';
    for (var i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
  }

  static id = type => Math.floor((type+Math.random())*10000000)/10000000;
  genId(type) {
    let id = Engine.id(type);
    while (this.ids.includes(id)) id = Engine.id(type);
    this.ids.push(id);
    return id;
  }

  static raycast(x1, y1, x2, y2, walls) {
    const dx = x1-x2, dy = y1-y2, adx = Math.abs(dx), ady = Math.abs(dy), minx = Math.min(x1, x2), miny = Math.min(y1, y2), maxx = Math.max(x1, x2), maxy = Math.max(y1, y2), px = [], py = [];
    walls = walls.filter(({x, y, type}) => {
      if (!['barrel', 'void', 'barrier', 'strong', 'weak', 'gold'].includes(type)) return;
      if (Engine.collision(x, y, 100, 100, minx, miny, adx, ady)) {
        if (Engine.collision(x, y, 100, 100, x1-1, y1-1, 2, 2) || Engine.collision(x, y, 100, 100, x2-1, y2-1, 2, 2)) return false;
        const xw = x + 100, yw = y + 100;
        if (x >= minx && x <= maxx) px.push(x);
        if (xw >= minx && xw <= maxx) px.push(xw);
        if (y >= miny && y <= maxy) py.push(y);
        if (xw >= miny && yw <= maxy) py.push(yw);
        return true;
      }
      return false;
    });
    if (dx === 0) {
      for (const p of py) for (const {x, y} of walls) if (Engine.collision(x, y, 100, 100, x1-.5, p-.5, 1, 1)) return false;
    } else {
      const s = dy/dx, o = y1-s*x1;
      for (const {x, y} of walls) {
        for (const p of py) if (Engine.collision(x, y, 100, 100, (p-o)/s-1, p-1, 2, 2)) return false;
        for (const p of px) if (Engine.collision(x, y, 100, 100, p-1, s*p+o-1, 2, 2)) return false;
      }
    }
    return true;
  }
  
  static hasPerk = (p, n) => {
    let perk = p.find(a => Math.floor(a) === n);
    if (perk) return Math.round((perk%1)*10); else return perk;
  }
  static parseTeamExtras = s => {
    try {
      return s.replace('@leader', '').split('@requestor#')[0];
    } catch(e) {
      console.log('[Debug][Error] Team Mismatch');
      console.log('s='+s);
      console.log('trace='+e.stack);
      console.log('readable='+e);
      return 'ERRORED:ERRORED';
    }
  }
  static getUsername = s => Engine.parseTeamExtras(s).split(':')[0];
  static getTeam = s => Engine.parseTeamExtras(s).split(':')[1];
  static match = (a, b) => Engine.getTeam(a.team) === Engine.getTeam(b.team);
  static collision = (x, y, w, h, x2, y2, w2, h2) => (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2);
  static toAngle = (x, y) => (-Math.atan2(x, y)*180/Math.PI+360)%360;
  static toPoint = angle => {
    const theta = (-angle) * Math.PI / 180, y = Math.cos(theta), x = Math.sin(theta);
    return x === 0 ? {x, y: y/Math.abs(y)} : {x: x/Math.abs(x), y: y/Math.abs(x)}
  }
}
