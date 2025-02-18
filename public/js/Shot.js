class Shot {
  static settings = {bullet: [20, 18], shotgun: [20, 14.4], grapple: [0, 36], fire: [0, 16.2], dynamite: [0, 14.4], usb: [0, 14.4], torpedo: [20, 27, 50], powermissle: [100, 27, 50], megamissle: [200, 27, 100]};
  static args = ['x', 'y', 'd', 'r', 'type', 'team', 'rank', 'host'];
  static raw = ['team', 'r', 'type', 'x', 'y', 'sx', 'sy']; // make reflector update shot team?
  static u = ['x', 'y'];
  static u2 = ['r'];
  constructor() {
    this.cells = new Set();
  }
  init(x, y, d, r, type, team, rank, host) {
    this.id = host.genId(2);
    for (let i = Shot.args.length-1; i >= 0; i--) this[Shot.args[i]] = arguments[i];
    this.e = Date.now()+(type === 'torpedo' ? 500 : 0);
    this.md = this.damage = Shot.settings[this.type][0]*(rank*10+300)/500;
    this.xm = Math.cos(Math.PI*r/180)*Shot.settings[this.type][1];
    this.ym = Math.sin(Math.PI*r/180)*Shot.settings[this.type][1];
    this.x = this.sx = x+d*Math.cos(Math.PI*r/180)-5;
    this.y = this.sy = y+d*Math.sin(Math.PI*r/180)-5;
    host.loadCells(this, this.x, this.y, 10, 10);
    host.s.push(this);
    if (this.collision()) return this.destroy();
    host.updateEntity(this, Shot.raw);
  }
  collide(e) {
    let size = Shot.settings[this.type][2], o = size/2+10, isBlock = e instanceof Block, pullGrapple = (isBlock || !e) && this.type === 'grapple';
    if (size) return A.template('Damage').init(this.x-o, this.y-o, size, size, this.damage, this.team, this.host) || 1; // damage change to square instead of rect hitbox?
    if (this.type === 'dynamite' || this.type === 'usb' || this.type === 'grapple') {
      const g = pullGrapple ? this.host.pt.concat(this.host.ai).find(t => t.username === Engine.getUsername(this.team)) : e;
      if (!(this.target = g) || (this.type === 'usb' && isBlock)) return true;
      this.offset = [g.x-this.x, g.y-this.y];
      if (pullGrapple) this.update = () => {};
      if (this.type === 'grapple') {
        //if (e instanceof AI) return true;
        if (g.grapple) g.grapple.bullet.destroy();
        g.grapple = {target: pullGrapple ? {x: e ? e.x : this.x, y: e ? e.y : this.y} : this.host.pt.concat(this.host.ai).find(t => t.username === Engine.getUsername(this.team)), bullet: this};
      } else if (this.type === 'usb') setTimeout(() => this.destroy(), 30000);
      return false;
    } else if (this.type === 'fire') {
      if (isBlock) return this.host.b.push(A.template('Block').init(e.x, e.y, 'fire', this.team, this.host));
      if (e && !((e instanceof Tank && e.immune) || (e instanceof AI && e.immune+500 > Date.now()))) {
        e.fireTime = Date.now();
        e.fire = this.team;
        e.fireRank = this.rank;
      }
    } else if (e) {
      if (isBlock) e.damage(this.damage, Engine.getUsername(this.team)); else if (Engine.getTeam(e.team) !== Engine.getTeam(this.team)) e.damageCalc(this.x, this.y, this.damage, Engine.getUsername(this.team));
    }
    return true;
  }
  score(e) {
    if (e instanceof Block) return e.maxHp === Infinity ? 1 : e.hp/e.maxHp;
    if (e instanceof AI) return Engine.getTeam(e.team) === Engine.getTeam(this.team) || this.type === 'grapple' ? 5 : 2;
    if (e instanceof Tank) return (this.type === 'grapple' ? 0 : 1)+(Engine.getTeam(e.team) === Engine.getTeam(this.team) ? 4 : 3);
  }
  collision() {
    for (const cell of this.cells) {
      const c = cell.split('x');
      for (const e of [...this.host.cells[c[0]][c[1]]].sort((a, b) => this.score(a) - this.score(b))) {
        let size = e instanceof Block || e.role === 0 ? 100 : 80;
        if (((e instanceof Block && e.c) || ((e instanceof Tank || e instanceof AI) && !e.ded)) && Engine.collision(this.x, this.y, 10, 10, e.x, e.y, size, size)) return this.collide(e);
      }
    }
    return false;
  }
  update() {
    if (Date.now()-this.e < 0) return; 
    const time = Math.floor((Date.now()-this.e)/15), x = this.target ? this.target.x-this.offset[0] : time*this.xm+this.sx, y = this.target ? this.target.y-this.offset[1] : time*this.ym+this.sy, x1 = Math.floor(x/100), x2 = Math.floor((x+10)/100), y1 = Math.floor(y/100), y2 = Math.floor((y+10)/100);
    if (((x < 0 || y < 0 || x+10 >= 6000 || y+10 >= 6000) && !this.target && this.collide()) || (this.target && (this.target.x === undefined || this.target.y === undefined))) return this.destroy();
    if (this.target) if (this.target?.ded || this.host.pt.find(t => t.username === Engine.getUsername(this.team))?.ded) return this.destroy();
    if (Math.floor(this.x/100) !== x1 || Math.floor(this.y/100) !== y2 || Math.floor((this.x+10)/100) !== x2 || Math.floor((this.y+10)/100) !== y2) this.host.loadCells(this, x, y, 10, 10);
    this.x = x;
    this.y = y;
    this.host.updateEntity(this, Shot.u);
    if (this.target) return;
    if (this.collision()) return this.destroy();
    if (this.type === 'shotgun') {
      this.d = Math.sqrt((this.x-this.sx)**2+(this.y-this.sy)**2);
      if (this.d >= 300) return this.destroy();
      this.damage = (1-this.d/300)*this.md;
    } else if (this.type === 'dynamite') {
      this.r += 5;
      this.host.updateEntity(this, Shot.u2);
    } else if (this.type === 'fire' && Date.now()-this.e > 3000) return this.destroy();
  }
  reset = () => this.cells.clear();
  destroy() {
    this.host.destroyEntity(this);
    for (const cell of this.cells) {
      const c = cell.split('x');
      this.host.cells[c[0]][c[1]].delete(this);
    }
    //this.release();
    for (let i = 0; i < this.host.s.length; i++) if (this.host.s[i].id === this.id) return this.host.s.splice(i, 1);
  }
}
