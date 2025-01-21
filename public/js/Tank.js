class Tank {
  static args = ['username', 'rank', 'class', 'perk', 'cosmetic', 'cosmetic_hat', 'cosmetic_body', 'deathEffect', 'color', 'authority'];
  static raw = ['authority', 'rank', 'username', 'cosmetic', 'cosmetic_hat', 'cosmetic_body', 'color', 'damage', 'maxHp', 'hp', 'shields', 'team', 'x', 'y', 'r', 'ded', 'reflect', 'pushback', 'baseRotation', 'baseFrame', 'fire', 'damage', 'animation', 'buff', 'invis', 'class', 'flashbanged', 'dedEffect'];
  static s = ['rank', 'username', 'cosmetic', 'cosmetic_hat', 'cosmetic_body', 'color', 'damage', 'maxHp', 'hp', 'shields', 'team', 'r', 'ded', 'reflect', 'pushback', 'baseRotation', 'baseFrame', 'fire', 'damage', 'animation', 'buff', 'invis', 'class', 'flashbanged', 'dedEffect', 'gambleCounter'];
  static u = ['x', 'y'];
  constructor() {
    this.cells = new Set();
    this.raw = {};
    this.msg = {u: [], d: [], event: 'update'};
    this.privateLogs = [];
    this.eradar = [];
    this.fradar = [];
  }
  init(data, host) {
    this.id = host.genId(0);
    for (const p of Tank.args) this[p] = data[p];
    if (data.socket) this.socket = data.socket;
    this.host = host;
    this.fire = false;
    this.gambleCounter = this.fireTime = 0;
    this.hp = this.maxHp = this.rank*10+300;
    this.canShield = this.canBashed = this.canInvis = !(this.damage = false);
    this.team = data.username+':'+this.id;
    this.x = host.spawn.x;
    this.y = host.spawn.y;
    this.maxTurrets = 3;
    this.grapple = false;
    this.logs = this.shields = this.r = this.pushback = this.baseRotation = this.baseFrame = 0;
    this.msg.global = host.global;
    this.msg.zone = host.zone;
    host.updateEntity(this, Tank.raw);
    host.override(this);
    host.loadCells(this, this.x, this.y, 80, 80);
    if (data.socket) host.chunkload(this, -100000, -100000, this.x, this.y);
    host.pt.push(this);
    for (const p of Tank.s) {
      this.raw[p] = this[p];
      Object.defineProperty(this, p, {get: () => this.raw[p], set: v => this.setValue(p, v), configurable: true});
    }
  }
  setValue = (p, v) => {
    if (this.raw[p] === v && typeof v !== 'object') return; else this.raw[p] = v;
    this.host.updateEntity(this, [p]);
  }
  update() {
    const radar = Engine.hasPerk(this.perk, 6);
    if (radar && !this.ded) {
      this.eradar.length = this.fradar.length = 0;
      for (const t of this.host.pt.concat(this.host.ai)) {
        if (t.ded || (t.x === this.x && t.y === this.y) || Math.sqrt((t.x-this.x)**2+(t.y-this.y)**2) < 400) continue;
        if (!Engine.match(t, this)) {
          if (!t.invis) this.eradar.push(Engine.toAngle(t.x-this.x, t.y-this.y));
        } else if (radar > 1) this.fradar.push(Engine.toAngle(t.x-this.x, t.y-this.y));
      }
      this.host.updateEntity(this, ['eradar', 'fradar']);
    }
    if (this.dedEffect) (this.dedEffect.time = Date.now()-this.dedEffect.start) && this.setValue('dedEffect', this.dedEffect);
    if (this.pushback !== 0) this.pushback += 0.5;
    if (Date.now()-this.fireTime < 4000) {
      if (this.fire && Engine.getTeam(this.fire) !== Engine.getTeam(this.team)) this.damageCalc(this.x, this.y, .25*(this.fireRank/50+.6), Engine.getUsername(this.fire)); 
    } else this.fire = false;
    if (this.damage) this.damage.y-- && this.host.updateEntity(this, ['damage']);
    if (this.grapple) this.grappleCalc();
    if (this.reflect) for (let hx = Math.floor((this.x+40)/100), i = Math.max(0, hx-2); i <= Math.min(29, hx+2); i++) for (let hy = Math.floor((this.y+40)/100), l = Math.max(0, hy-2); l <= Math.min(29, hy+2); l++) {
      for (const entity of this.host.cells[i][l]) {
        if (!(entity instanceof Shot)) continue;
        const xd = entity.x-(this.x+40), yd = entity.y-(this.y+40), td = Math.sqrt(xd**2+yd**2), aspectRatio = Shot.settings[entity.type][1]/td; 
        if (entity.target || td > 150) continue;
        (entity.e = Date.now()) && (entity.sx = entity.x) && (entity.sy = entity.y);
        entity.r = Engine.toAngle(entity.xm = xd*aspectRatio, entity.ym = yd*aspectRatio);
        if (entity.type !== 'grapple') entity.team = this.team;
      }
    }
    if (!this.ded) for (const cell of this.cells) {
      const c = cell.split('x'), x = c[0], y = c[1];
      for (const entity of this.host.cells[x][y]) {
        const teamMatch = Engine.match(this, entity);
        if (!this.immune && entity instanceof Block) {
          if (!Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, 100, 100)) continue;
          if (entity.type === 'fire') (this.fire = entity.team) && (this.fireTime = Date.now()) && (this.fireRank = this.host.pt.find(t => t.username === Engine.getUsername(entity.team))?.rank || 20);
          if (entity.type === 'spike' && !teamMatch) {
            entity.destroy();
            this.stunned = true;
            this.host.updateEntity(this, ['stunned']);
            clearTimeout(this.stunTimeout);
            this.stunTimeout = setTimeout(() => {
              this.stunned = false;
              this.host.updateEntity(this, ['stunned']);
            }, 1000);
          };
        } else if (!teamMatch && !entity.ded && (entity instanceof Tank || entity instanceof AI)) {
          if (!this.immune && entity.buff && this.canBashed && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, 80, 80)) {
            this.canBashed = false;
            setTimeout(() => (this.canBashed = true), 1000);
            this.damageCalc(this.x, this.y, 100*(entity.rank/50+.6), Engine.getUsername(entity.team));
          }
          const thermal = Engine.hasPerk(this.perk, 2), size = entity.role === 0 ? 100 : 80;
          if (thermal && !entity.thermaled && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, size, size)) {
            entity.thermaled = setTimeout(() => (entity.thermaled = false), 1000) && 1;
            entity.damageCalc(entity.x, entity.y, thermal*10, Engine.getUsername(this.team));
          }
        }
      }
    }
  }
  damageCalc(x, y, a, u) {
    if ((((Date.now()-this.core) < 1000 || this.reflect || this.immune) && a > 0) || this.ded) return;
    const hx = Math.floor((this.x+40)/100), hy = Math.floor((this.y+40)/100);
    for (let i = Math.max(0, hx-1); i <= Math.min(29, hx+1); i++) for (let l = Math.max(0, hy-1); l <= Math.min(29, hy+1); l++) for (const entity of this.host.cells[i][l]) {
      if (entity instanceof Shot) if (entity.target) if (entity.target.id === this.id && entity.type === 'usb' && a >= 0) a = Math.max(0, a+(Math.abs(a/5))*(Engine.getTeam(entity.team) === Engine.getTeam(this.team) ? -1 : 1));
    }
    if (this.shields > 0 && a > 0) return this.shields -= a;
    this.hp = Math.max(Math.min(this.maxHp, this.hp-a), 0);
    if (a < 0) {
      clearInterval(this.medicInterval);
      clearTimeout(this.medicTimeout);
      this.medicInterval = setInterval(() => (this.hp = Math.min(this.maxHp, this.hp+10*(-a/150))), 1000);
      this.medicTimeout = setTimeout(() => clearInterval(this.medicInterval), 10000);
    }
    clearTimeout(this.damageTimeout);
    this.damageTimeout = setTimeout(() => {this.damage = false}, 1000);
    this.damage = {d: (this.damage ? this.damage.d : 0)+a, x, y};
    clearTimeout(this.regenTimeout);
    this.regenInterval = clearInterval(this.regenInterval);
    this.regenTimeout = setTimeout(() => (this.regenInterval = setInterval(() => this.regen(), 15)), 10000);
    let core = Engine.hasPerk(this.perk, 9), shield = Engine.hasPerk(this.perk, 1);
    if (this.hp <= 0 && this.host.ondeath) if (!core || Math.random() > 0.50) {
      this.gambleCounter = 0;
      return this.host.ondeath(this, this.host.pt.concat(this.host.ai).find(t => t.username === u));
    } else {
      this.core = Date.now();
      this.gambleCounter++;
    }
    if ((this.hp <= this.maxHp*.1 && shield === 1) || (this.hp <= this.maxHp*.2 && shield === 2)) {
      if (this.canShield) {
        this.canShield = false;
        setTimeout(() => (this.canShield = true), 10000);
        this.shields = this.hp;
      }
    }
  }
  regen() {
    this.hp = Math.min(this.hp+.4*(this.rank/50+.6), this.maxHp);
    if (this.hp === this.maxHp) this.regenInterval = clearInterval(this.regenInterval);
  }
  grappleCalc() { // direct setting of pos may cause chunkload issues
    if (this.stunned) return this.grapple.bullet.destroy() && (this.grapple = false);
    const dx = this.grapple.target.x - this.x, dy = this.grapple.target.y - this.y, ox = this.x, oy = this.y;
    if (dx ** 2 + dy ** 2 > 400) {
      const angle = Math.atan2(dy, dx);
      const mx = Math.round(Math.cos(angle) * 5)*4;
      const my = Math.round(Math.sin(angle) * 5)*4;
      if (this.collision(this.x+mx, this.y)) this.x += mx;
      if (this.collision(this.x, this.y+my)) this.y += my;
      this.grapple.bullet.sx = this.x+40;
      this.grapple.bullet.sy = this.y+40;
      if ((!this.collision(this.x+mx, this.y) || Math.abs(mx) < 2) && (!this.collision(this.x, this.y+my) || Math.abs(my) < 2)) {
        this.grapple.bullet.destroy();
        this.grapple = false;
        this.x = Math.floor(this.x/4)*4;
        this.y = Math.floor(this.y/4)*4; // no override so useless??!?!
      }
    } else {
      this.grapple.bullet.destroy();
      this.grapple = false;
      this.x = Math.floor(this.x/4)*4;
      this.y = Math.floor(this.y/4)*4;
    }
    this.host.override(this, ox, oy);
  }
  reset() {
    for (const p of Tank.s) delete this[p];//Object.defineProperty(this, p, {value: undefined, writable: true});
    this.cells.clear();
  }
  collision(x, y) {
    if (x < 0 || y < 0 || x + 80 > 6000 || y + 80 > 6000) return false;
    for (const b of this.host.b) if (Engine.collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return false;
    return true;
  }
}
