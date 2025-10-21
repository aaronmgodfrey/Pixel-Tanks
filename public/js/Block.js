class Block {
  static args = ['x', 'y', 'type', 'team', 'host'];
  static raw = ['x', 'y', 'type', 'team', 'maxHp', 'hp'];
  static raw2 = ['x', 'y', 'type', 'team'];
  static update = ['s', 'hp'];
  constructor() {
    this.cells = new Set();
    this.t = [];
  }
  init(x, y, type, team, host) {
    this.id = host.genId(1);
    for (const i in Block.args) this[Block.args[i]] = arguments[i];
    this.maxHp = this.hp = [300, 200, 100, 50, 200, 60][['gold', 'strong', 'weak', 'spike', 'crate', 'barrel'].indexOf(type)] || Infinity;
    if (!(this.c = !['fire', 'airstrike', 'spike', 'supplyairstrike'].includes(type))) if (type !== 'spike') this.sd = setTimeout(() => this.destroy(), type === 'fire' ? 2500 : Math.abs(this.timer)*1000+200);
    if (type === 'airstrike' && this.timer > 0) for (let i = 0; i < 5; i++) this.t.push(setTimeout(() => A.template('Damage').init(this.x+[0, 100, 0, 100, 50][i], this.y+[0, 0, 100, 100, 50][i], 150, 150, 200, this.team, this.host), this.timer*1000+Math.random()*200));
    if (type === 'supplyairstrike' && this.timer < 0) this.t.push(setTimeout(() => this.host.b.push(A.template('Block').init(this.x+50, this.y+50, 'crate', this.team, this.host)), 5000));
    if (this.c && this.x % 100 === 0 && this.y % 100 === 0 && this.x >= 0 && this.x <= 5900 && this.y >= 0 && this.y <= 5900) host.map[Engine.r(this.y/100)][Engine.r(this.x/100)].walkable = false;
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
      if (t) {
        if (t.socket) t.socket.send({event: 'sc', timer: '*', percent: 1}); else PixelTanks.user.player.giveCooldown({timer: '*', percent: 1});
      } 
    } else if (this.type === 'barrel') A.template('Damage').init(this.x-100, this.y-100, 300, 300, 200, this.team, this.host);
    this.host.destroyEntity(this);
    for (const t of this.t) clearTimeout(t);
    clearTimeout(this.sd);
    this.host.b.splice(this.host.b.indexOf(this), 1);
    cell: for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
      for (const e of this.host.cells[x][y]) if (e instanceof Block && e.x % 100 === 0 && e.y % 100 === 0) continue cell;
      this.host.map[y][x].walkable = true;
    }
    this.release();
  }
}
