class Block {
  static args = ['x', 'y', 'type', 'team', 'host'];
  static raw = ['x', 'y', 'type', 'team', 'maxHp', 'hp'];
  static raw2 = ['x', 'y', 'type', 'team'];
  static update = ['s', 'hp'];
  constructor() {
    this.cells = new Set();
    this.t = []; // can be removed maybe?
  }
  init(x, y, type, team, host) {
    this.id = host.genId(1);
    for (const i in Block.args) this[Block.args[i]] = arguments[i];
    this.maxHp = this.hp = [300, 200, 100, 50, 200][['gold', 'strong', 'weak', 'spike', 'crate'].indexOf(type)] || Infinity;
    if (!(this.c = !['fire', 'airstrike', 'smoke', 'spike'].includes(type))) if (type !== 'spike') this.sd = setTimeout(() => this.destroy(), type === 'fire' ? 2500 : (type === 'smoke' ? 10000 : Math.abs(this.timer)*1000));
    if (type === 'airstrike' && this.timer > 0) for (let i = 0; i < 5; i++) this.t.push(setTimeout(() => this.host.d.push(A.template('Damage').init(this.x+[0, 100, 0, 100, 50][i], this.y+[0, 0, 100, 100, 50][i], 150, 150, 200, this.team, this.host)), this.timer*1000+Math.random()*200));
    if (type === 'airstrike' && this.timer < 0) this.t.push(setTimeout(() => this.host.b.push(A.template('Block').init(this.x+50, this.y+50, 'crate', this.team, this.host))), Math.abs(this.timer)*1000);
    if (type === 'smoke') for (let i = 0; i < 1600; i++) this.t.push(setTimeout(() => this.host.d.push(A.template('Damage').init(this.x+Math.floor(Math.random()*350)-150, this.y+Math.floor(Math.random()*350)-150, 200, 200, 0, this.team, this.host)), Math.random()*10000));
    if (this.c && this.x % 100 === 0 && this.y % 100 === 0 && this.x >= 0 && this.x <= 5900 && this.y >= 0 && this.y <= 5900) host.map.setWalkableAt(Engine.r(Math.floor(this.x/100)), Engine.r(Math.floor(this.y/100)), false);
    host.loadCells(this, this.x, this.y, 100, 100);
    host.updateEntity(this, this.hp === Infinity ? Block.raw2 : Block.raw);
    return this;
  }
  damage(d, username) {
    if (this.hp === Infinity) return; else this.s = Date.now();
    if ((this.hp = Math.min(this.maxHp, this.hp-d)) <= 0) return this.destroy(username); else this.host.updateEntity(this, Block.update);
  }
  reset() {
    for (const property of ['x', 'y', 'maxHp', 'hp', 'type', 'team', 's' ,'c', 'updatedLast', 'host']) delete this[property];
    this.cells.clear();
    this.t.length = 0;
  }
  destroy(username) {
    if (this.type === 'crate') {
      const t = this.host.pt.find(t => t.username === username);
      if (t) t.socket.send({event: 'sc', timer: '*', percent: 1}); // give cooldowns
    }
    this.host.destroyEntity(this);
    for (const t of this.t) clearTimeout(t);
    clearTimeout(this.sd);
    this.host.b.splice(this.host.b.indexOf(this), 1);
    cell: for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
      for (const e of this.host.cells[x][y]) if (e instanceof Block && e.x % 100 === 0 && e.y % 100 === 0) continue cell;
      this.host.map.setWalkableAt(x, y, true);
    }
    this.release();
  }
}
