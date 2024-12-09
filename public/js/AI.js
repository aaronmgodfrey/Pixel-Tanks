class AI {
  static args = ['x', 'y', 'role', 'rank', 'team', 'host'];
  static raw = ['role', 'rank', 'username', 'cosmetic', 'cosmetic_hat', 'cosmetic_body', 'color', 'damage', 'maxHp', 'hp', 'shields', 'team', 'ammo', 'x', 'y', 'r', 'ded', 'reflect', 'pushback', 'baseRotation', 'baseFrame', 'fire', 'damage', 'animation', 'buff', 'invis', 'class', 'flashbanged', 'dedEffect'];
  static u = [];
  constructor() {
    this.cells = new Set();
    this.raw = {};
    this.items = [];
  }
  init(x, y, role, rank, team, host) {
    this.id = host.genId(3);
    for (const i in AI.args) this[AI.args[i]] = arguments[i];
    const displayNames = ["Aaran", "Aaren", "Aarman", "Aaron", "Abraham", "Ace", "Adam", "Addison", "Aden", "Adie", "Adrien", "Aiden", "Al", "Alan", "Albert", "Albie", "Aldred", "Alec", "Aled", "Alex", "Alexander", "Alexei", "Alf", "Alfie", "Alfred", "Ali", "Allan", "Alvin", "Ammar", "Andrea", "Andreas", "Andrew", "Andy", "Angus", "Anthony", "Antonio", "Archie", "Argyle", "Ari", "Aria", "Arian", "Arlo", "Arthur", "Ash", "Ashley", "Ashton", "Averon", "Avi", "Axel", "Bailey", "Barath", "Barkley", "Barney", "Baron", "Barry", "Baxter", "Buer", "Ben", "Benedict", "Benjamin", "Benji", "Bennett", "Benny", "Bernard", "Bill", "Billy", "Blake", "Bob", "Bobby", "Bowie", "Bracken", "Brad", "Braden", "Bradley", "Bread", "Brady", "Brandon", "Bret", "Brett", "Brian", "Brodie", "Brogan", "Brooke", "Brooklyn", "Bruce", "Bruno", "Bryce", "Bryson", "Buddy", "Bully", "Cade", "Cayde-6", "Caden",  "Calib", "Callie", "Calum", "Calvin", "Cameron", "Carl", "Karl", "Carlo", "Carlos", "Carson", "Carter", "Casey", "Casper", "Cassy", "Cayden", "Ceilan", "Chad", "Charles", "Charlie", "Chase", "Chester", "Chris", "Christian", "Christie", "Christoph", "Christopher", "Christy", "CJ", "Clark", "Clayton", "Clement", "Clifford", "Clyde", "Cody", "Cole", "Colin", "Colt", "Colton", "Connor", "Cooper", "Corbin", "Corrie", "Cosmo", "Craig", "Cruiz", "Cruz", "Cyrus", "Daegan", "Dakota", "Dale", "Dalton", "Damian", "Damien", "Dan", "Dane", "Daniel", "Danny", "Dante", "David", "Davis", "Davy", "Dawson", "Deacon", "Deagan", "Dean", "Dennis", "Denny", "Derek", "Deshawn", "Desmond", "Dev", "Devin", "Devon", "Dex", "Dexter", "Diego", "Dillan", "Donald", "Donnie", "Dorian", "Douglas", "Drew", "Dylan", "Ed", "Eddie", "Eden", "Edison", "Eduardo", "Edward", "Edwin", "Elliot", "Ellis", "Elvin", "Emile", "Enzo", "Eren", "Eric", "Ethan", "Evan", "Ezra", "Fazbear", "Farren", "Faruzan", "Felix", "Flint", "Flynn", "Francesco", "Francis", "Francisco", "Franco", "Frank", "Frankie", "Franklin", "Fred", "Freddie", "Frederick", "Gabriel", "Gareth", "Garrett", "Garry", "Gary", "Gavin", "Gene", "Geoff", "Geoffrey", "Geometry", "George", "Georgia", "Jorge", "Glenn", "Gordon", "Grant", "Grayson", "Greg", "Gregory", "Greig", "Griffin", "Gus", "Gustav", "Guy", "Hayden", "Hansen", "Hao", "Haris", "Harley", "Harold", "Harper", "Harrington", "Harris", "Harrison", "Harry", "Harvey", "Hector", "Henry", "Herbert", "Hiro", "Howard", "Howie", "Hubert", "Hugo", "Hunter", "Ian", "Igor", "Isaac", "Ivan", "Jace", "Jack", "Jackie", "Jackson", "Jacob", "Jacques", "Jake", "James", "Jamie", "Jared", "Jason", "Jaxson", "Jay", "Jayden", "Jayson", "Jean", "Jed", "Jeht", "Jeremy", "Jerrick", "Jerry", "Jesse", "Jock", "Jody", "Joe", "Joel", "Joey", "Johansson", "John", "Johnathan", "Johnny", "Jonas", "Joseph", "Josh", "Joshua", "Juan", "Jude", "Junior", "Justin", "Kade", "Kayden", "Kai", "Kalvin", "Kayne", "Keaton", "Keith", "Ken", "Kenneth", "Kenton", "Kevin", "Kirk", "Kodi", "Kris", "Kruz", "Kyle", "Kyro", "Lance", "Lancelot", "Landon", "Lauren", "Laurence", "Lee", "Lenny", "Leo", "Leon", "Leonardo", "Levi", "Levy", "Lewis", "Lex", "Liam", "Lincoln", "Lloyd", "Lock", "Logan", "Loki", "Lorenzo", "Louis", "Luca", "Lucas", "Luke", "Mac", "Mack", "Mackie", "Macy", "Maddox", "Madison", "Magnus", "Marco", "Marcos", "Marcus", "Mario", "Mark", "Martin", "Mason", "Mathew", "Matt", "Matteo", "Max", "Maximus", "Maxwell", "Michael", "Mickey", "Miguel", "Mika", "Mikey", "Miles", "Miller", "Milo", "Morgan", "Morris", "Morton", "Murray", "Muse", "Mylo", "Nate", "Nathan", "Nathaniel", "Neil", "Neo", "Nicholas", "Nick", "Nicky", "Nicolas", "Noah", "Noel", "Norman", "Odin", "Olaf", "Oliver", "Omar", "Oscar", "Oswald", "Otto", "Owen", "Oz", "Pablo", "Pacey", "Parker", "Patrick", "Paul", "Pedro", "Peirce", "Peter", "Philip", "Phoenix", "Porter", "Preston", "Prince", "Percy", "Quinn", "Quentin", "Ralph", "Ramsey", "Rana", "Raphael", "Ray", "Raymond", "Reed", "Regan", "Reggie", "Reid", "Ren", "Rio", "Rex", "Riccardo", "Rico", "Richard", "Riley", "Robert", "Robin", "Ronald", "Ronin", "Rookie", "Rowan", "Ruben", "Ruby", "Ryan", "Sam", "Samuel", "Saul", "Scott", "Sean", "Seb", "Sebastian", "Seth", "Shawn", "Sheriff", "Sidney", "Simon", "Skye", "Stanley", "Stephen", "Steve", "Steeve", "Stewart", "Sullivan", "Terry", "Theo", "Theodore", "Thomas", "Tim", "Timothy", "Titus", "Tobey", "Tobias", "Todd", "Tom", "Tommy", "Tony", "Travis", "Tristan", "Tyler", "Uzi", "Victor", "Vince", "Vincent", "Vincenzo", "Walter", "Wayde", "Wayne", "Will", "William", "Wilson", "Xander", "Xavier", "Xiao", "Yuri", "Zack",  "Zane", "Zenith", "Hehehe", "Loaf", "Bartholomew", "Obama", "Jeff", "Halp i can't aim", "Not_A_Turret", "Dingus", "AAAAA", "ToTallyHuman", "Fool", "Bafoon", "x-Cool-Dude-x", "Dummy",];
    this.username = displayNames[Math.floor(Math.random()*displayNames.length)];
    if (!this.team.includes(':')) this.team = this.username+':'+this.team;
    this.maxHp = this.hp = (this.role === 0) ? this.rank*6+180 : this.rank*10+300;
    this.barrelSpeed = Math.random()*3+2;
    this.seeUser = this.target = this.obstruction = this.bond = this.path = this.damage = false;
    this.r = this.tr = this.baseRotation = this.baseFrame = this.mode = this.pushback = this.immune = this.shields = 0;
    this.canFire = this.canPowermissle = this.canBoost = this.canBashed = true;
    this.fire = this.reloading = this.canClass = false;
    this.fireTime = 0;
    for (let i = 0; i < 4; i++) if (Math.random() < rank/20) this['canItem'+i] = this.role !== 0;
    if (this.role !== 0) if (Math.random() < (rank/20)) this.canClass = true;
    if (this.role !== 0) this.giveAbilities(); else this.ammo = 120;
    const summoner = host.pt.find(t => t.username === Engine.getUsername(this.team));
    if (summoner) {
      for (const c of ['cosmetic_hat', 'cosmetic', 'cosmetic_body', 'color']) this[c] = summoner[c];
    } else {
      let crate = { // start of bread code
         common: ['medic', 'police', 'small_scratch', 'spikes', 'moustache', 'pumpkin_face', 'army', 'hardhat', 'halo', 'lego', 'present', 'pumpkin_hat', 'top_hat', 'stamp', 'dead', 'earmuffs', 'ban', 'sweat', 'lava', 'ink', 'bricks'],
    uncommon: ['chip', 'deep_scratch', 'evil_eye', 'inferno_eye', 'motherboard', 'blue_wings', 'blue_horns', 'white_wings', 'white_horns', 'gold_wings', 'gold_horns', 'devil_wings', 'devil_horns', 'hazard', 'angel_wings', 'bat_wings', 'locked', 'mini_tank', 'dust', 'pouch'],
    rare: ['blue_tint', 'glitch', 'blue_helmet', 'white_helmet', 'helmet', 'gold_helmet', 'hacker_hoodie', 'purple', 'sus', 'veins', 'cookie'],
    epic: ['christmas_hat', 'christmas_lights', 'dizzy', 'rage', 'toxic', 'error', 'supersight', 'crown', 'darkcrown'],
    legendary: ['plasma', 'cry', 'missing', 'hoodie'],
    mythic: ['terminator', 'mlg_glasses', 'power_armor', 'corrupted'],
      }
      for (let i = 0; i < 3; i++) { // why cringe 3 for loop?
        let rand = Math.floor(Math.random()*1001);
	let rarity = rand < 1 ? 'mythic' : rand < 10 ? 'legendary' : rand < 50 ? 'epic' : rank < 150 ? 'rare' : rand < 300 ? 'uncommon' : 'common';
        let number = Math.floor(Math.random()*(crate[rarity].length)), item;
        item = crate[rarity][number];
        //for (const e in crate[rarity]) if (e === crate[rarity][number]) item = crate[rarity][number];
        this[['cosmetic_hat', 'cosmetic', 'cosmetic_body'][i]] = item;
      } // end of bread code
      this.color = Engine.getRandomColor();
    }
    this.host.loadCells(this, this.x, this.y, 80, 80);
    this.lookInterval = setInterval(() => this.identify(), 200); // remove, laggy :(
    host.updateEntity(this, AI.raw);
    for (const p of AI.raw) {
      this.raw[p] = this[p];
      Object.defineProperty(this, p, {get: () => this.raw[p], set: v => this.setValue(p, v), configurable: true});
    }
    this.host.ai.push(this);
  }

  regen() {}
  giveAbilities() {
    const available = ['airstrike', 'super_glu', 'duck_tape', 'shield',/* 'flashbang',*/ 'bomb', 'dynamite', 'usb', 'weak', 'strong', 'spike', 'reflector'];
    const classes = ['tactical', 'stealth', 'warrior', 'builder', 'fire', 'medic'];
    for (let i = 0; i < 4; i++) this.items.push(available[Math.floor(Math.random()*available.length)]);
    this.class = classes[Math.floor(Math.random()*classes.length)];
  }

  think() {
    if (this.role !== 0) this.move();
    if (this.obstruction && !this.seeTarget) {
      this.tr = Engine.toAngle(this.obstruction.x-(this.x+40), this.obstruction.y-(this.y+40));
      if (this.canPowermissle && this.role !== 0 && Math.random() <= 1/600) this.fireCalc(this.obstruction.x, this.obstruction.y, 'powermissle');
      if (this.canFire) this.fireCalc(this.obstruction.x, this.obstruction.y);
    } else if (this.mode !== 0) {
      this.tr = Engine.toAngle(this.target.x - this.x, this.target.y - this.y);
      if (this.canPowermissle && this.role !== 0 && Math.random() <= 1/600) this.fireCalc(this.target.x, this.target.y, 'powermissle');
      if (this.canFire) this.fireCalc(this.target.x, this.target.y);
    }
    if (this.canClass && this.mode !== 0 && Math.random() < 1/300) {
      let cooldown = 0;
      if (this.class === 'tactical') {
        this.fireCalc(this.target.x, this.target.y, 'megamissle');
        cooldown = 25000;
      } else if (this.class === 'stealth') {
        this.host.useAbility(this, 'invis');
        cooldown = 40000;
      } else if (this.class === 'builder') {
        this.host.useAbility(this, 'turret');
        cooldown = 20000;
      } else if (this.class === 'warrior') {
        this.host.useAbility(this, 'buff');
        cooldown = 40000;
      } else if (this.class === 'medic') {
        this.host.useAbility(this, 'healwave'); // greedy self-heal :D
        cooldown = 30000;
      } else if (this.class === 'fire') {
        for (let i = -30, len = 30; i < len; i += 5) A.template('Shot').init(this.x+40, this.y+40, 70, this.r+90+i, 'fire', this.team, this.rank, this.host);
        cooldown = 10000;
      }
      this.canClass = false;
      setTimeout(() => {
        this.canClass = true;
      }, cooldown);
    }
    for (let i = 0; i < 4; i++) {
      if (this['canItem'+i] && Math.random() < 1/300) {
        const item = this.items[i];
        let cooldown = 0;
        if (item === 'airstrike') {
          if (this.mode !== 0) {
            this.host.useAbility(this, 'airstrike'+this.target.x+'x'+this.target.y);
            cooldown = 20000;
          }
        } else if (item === 'super_glu') {
          if (this.hp < this.maxHp*.75) {
            this.host.useAbility(this, 'glu');
            cooldown = 30000;
          }
        } else if (item === 'duck_tape') {
          if (this.hp < this.maxHp*.75) {
            this.host.useAbility(this, 'tape');
            cooldown = 30000;
          }
        } else if (item === 'shield') {
          if (this.shields === 0) {
            this.host.useAbility(this, 'shield');
            cooldown = 30000;
          }
        } else if (item === 'flashbang') {
          this.host.useAbility(this, 'flashbang'+this.target.x+'x'+this.target.y);
          cooldown = 20000;
        } else if (item === 'bomb') {
          if (this.obstruction) {
            this.host.useAbility(this, 'bomb');
            cooldown = 5000;
          }
        } else if (item === 'dynamite') {
          // lol no :)
        } else if (item === 'usb') {
          // idk
        } else if (item === 'weak') {
          if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180) {
            this.host.useAbility(this, 'block#weak');
            cooldown = 4000;
          }
        } else if (item === 'strong') {
          if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180) {
            this.host.useAbility(this, 'block#strong');
            cooldown = 8000;
          }
        } else if (item === 'spike') {
          if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180) {
            this.host.useAbility(this, 'block#spike');
            cooldown = 10000;
          }
        } else if (item === 'reflector') {
          if (this.mode !== 0) {
            this.host.useAbility(this, 'reflector');
            cooldown = 10000;
          }
        }
        if (cooldown !== 0) {
          this['canItem'+i] = false;
          setTimeout(() => {
            this['canItem'+i] = true;
          }, cooldown);
        }
      }
    }
  }

  setValue(p, v) {
    if (this.raw[p] === v && typeof v !== 'object') return; else this.raw[p] = v;
    this.host.updateEntity(this, [p]);
  }

  update() {
    if (!this.reloading) this.think(); else {
      this.ammo += .1;
      if (this.ammo >= 120) this.reloading = false;
    }
    const team = Engine.getTeam(this.team);
    if (this.pushback !== 0) this.pushback += 0.5;
    if (Date.now()-this.fireTime < 4000) {
      if (this.fire && Engine.getTeam(this.fire) !== Engine.getTeam(this.team)) this.damageCalc(this.x, this.y, .25, Engine.getUsername(this.fire));
    } else this.fire = false;
    if (this.damage) this.damage.y--;
    if (this.reflect) {
      const hx = Math.floor((this.x+40)/100), hy = Math.floor((this.y+40)/100);
      for (let i = Math.max(0, hx-2); i <= Math.min(59, hx+2); i++) for (let l = Math.max(0, hy-2); l <= Math.min(59, hy+2); l++) {
        for (const entity of this.host.cells[i][l]) {
          if (entity instanceof Shot) {
            const xd = entity.x-(this.x+40), yd = entity.y-(this.y+40), td = Math.sqrt(xd**2+yd**2);
            const aspectRatio = 6/td;
            if (td > 150) continue;
            entity.e = Date.now();
            entity.sx = entity.x;
            entity.sy = entity.y;
            entity.xm = xd*aspectRatio;
            entity.ym = yd*aspectRatio;
            entity.r = Engine.toAngle(xd, yd);
            if (entity.type !== 'grapple') entity.team = this.team;
          }
        }
      }
    }
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      for (const entity of this.host.cells[x][y]) {
        const teamMatch = team === Engine.getTeam(entity.team);
        if (entity instanceof Block) {
          if (!this.ded && this.immune+500 < Date.now() && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, 100, 100)) {
            if (entity.type === 'fire') {
              this.fire = entity.team;
              this.fireTime = Date.now();
            } else if (entity.type === 'spike' && !teamMatch) this.damageCalc(this.x, this.y, 1, Engine.getUsername(entity.team));
          }
        } else if (entity instanceof Tank || entity instanceof AI) {
          if (entity.buff && !this.ded && this.immune+500 < Date.now() && this.canBashed && Engine.getTeam(entity.team) !== Engine.getTeam(this.team) && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, 80, 80)) {
            this.canBashed = false;
            setTimeout(() => {this.canBashed = true}, 1000);
            this.damageCalc(this.x, this.y, 100, Engine.getUsername(entity.team));
          }
        }
      }
    }
    if ((!this.target && this.role === 0) || this.reloading) return this.r = (this.r+1)%360;
    if (!(this.role === 0 && this.mode === 0)) {
      const diff = (this.tr-this.r+360)%360, dir = diff < 180 ? 1 : -1;
      this.r = diff > this.barrelSpeed ? (this.r+dir*this.barrelSpeed+360)%360 : this.tr;
    }
    /*if (this.dedEffect) {
      this.dedEffect.time = Date.now() - this.dedEffect.start;
      this.setValue('dedEffect', this.dedEffect); // REMOVE THIS TEMPORARY
    } No death effects for AI yet...*/
    // if (this.grapple) this.grappleCalc(); No grapple for AI yet...
  }

  move() {
    const {x, y, path, baseRotation} = this;
    if ((x-10)%100 === 0 && (y-10)%100 === 0) this.onBlock();
    if (!path || !path.p.length) return;
    const now = Date.now();
    const len = path.p.length-1;
    let frames = Math.min(Math.floor((now-path.t)/15), len*25);
    if (this.immune+500 > path.t) frames = Math.min(frames+3*Math.floor(Math.min(now-Math.max(this.immune, path.t), this.immune+500-path.t)/15), len*25);
    const f = Math.floor(frames/25);
    const n = Math.min(f+1, len);
    const dx = path.p[n][0]-path.p[f][0], dy = path.p[n][1]-path.p[f][1];
    const offset = 4*(frames%25);
    const nx = 10+path.p[f][0]*100+offset*dx, ny = 10+path.p[f][1]*100+offset*dy;
    this.baseRotation = [[135, 180, 225], [90, baseRotation, 270], [45, 0, 315]][dy+1][dx+1];
    this.tr = this.baseRotation;
    this.obstruction = this.collision(nx, ny);
    if (!this.obstruction) {
      if (this.canBoost && Math.random() < 1/300) {
        this.canBoost = false;
        this.immune = Date.now();
        setTimeout(() => {this.canBoost = true}, 5000);
      }
      this.x = nx;
      this.y = ny;
    } else {
      this.path.t = this.path.o+Date.now()-this.obstruction.t;
    }
    this.host.loadCells(this, this.x, this.y, 80, 80);
  }

  collision(x, y) {
    for (const b of this.host.b) if (Engine.collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return {x: b.x+50, y: b.y+50, t: this.obstruction ? this.obstruction.t : Date.now()};
    return false;
  }

  onBlock() {
    if (!this.path) this.generatePath();
    if (!this.path.p || !this.path.p.length) this.generatePath();
    if (this.path.p && this.path.p.length > 0) {
      const final = this.path.p[this.path.p.length - 1];
      if ((this.x - 10) / 100 === final[0] && (this.y - 10) / 100 === final[1]) this.generatePath();
    }
  }

  generatePath() {
    const sx = (this.x-10)/100, sy = (this.y-10)/100;
    let cir, coords = [], limiter, tpx, tpy, epx, epy;
    let tx = Math.floor((this.target.x+40)/100), ty = Math.floor((this.target.y+40)/100), ranged = Math.max(sx-tx, sy-ty) > [1, 5, 5][this.role-1];
    if (this.role === 3 && this.bond) {
      epx = Math.floor((this.bond.x+40)/100);
      epy = Math.floor((this.bond.y+40)/100);
    } else if (this.mode === 0 || (this.mode === 1 && ranged) || this.mode === 2) {
      epx = sx;
      epy = sy;
    } else if (this.mode === 1) {
      epx = tx;
      epy = ty;
    } else {
      epx = sx;
      epy = sy;
    }
    if ((this.role === 3 && this.bond) || (this.role === 1 && this.mode === 1 && !ranged)) {
      cir = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
    } else cir = [[0, -3], [1, -3], [2, -2], [3, -1], [3, 0], [3, 1], [2, 2], [1, 3], [0, 3], [-1, 3], [-2, 2], [-3, 1], [-3, 0], [-3, -1], [-2, -2], [-1, -3]];
    if ((this.role === 3 && this.bond) || (this.mode === 1 && !ranged)) {
      tpx = sx;
      tpy = sy;
    } else if (this.mode === 0) {
      const d = Engine.toPoint(this.r);
      tpx = d.x+epx;
      tpy = d.y+epy;
    } else if (this.mode === 2 || (this.mode === 1 && ranged)) {
      tpx = tx;
      tpy = ty;
    }
    if (this.role === 3 && this.bond) {
      limiter = [2];
    } else if (this.role === 1 && !ranged) {
      limiter = [2, 3];
    } else {
      limiter = [2, 3, 4];
    }
    for (const c of cir) {
      const x = c[0]+epx, y = c[1]+epy, d = (x-tpx)**2+(y-tpy)**2;
      if (x >= 0 && y >= 0 && x <= 59 && y <= 59) coords.push({x, y, d});
    }
    if (!coords.length) return this.path = {p: [], m: this.mode, t: Date.now(), o: Date.now()};
    coords.sort((a, b) => this.mode !== 2 ? a.d - b.d : b.d - a.d);
    for (let i = 0; i <= this.mode === 0 ? coords.length : 5; i++) {
      const r = this.choosePath(coords.length);
      const {x, y} = coords[r];
      const p = Engine.pathfind(sx, sy, x, y, this.host.map.clone());
      if (limiter.includes(p.length) || true) return this.path = {p, m: this.mode, t: Date.now(), o: Date.now()};
      coords.splice(r, 1);
      if (!coords.length) return this.path = {p: [], m: this.mode, t: Date.now(), o: Date.now()}; 
    }
    if (this.mode !== 0) this.path = {p: Engine.pathfind(sx, sy, tx, ty, this.host.map.clone()).slice(0, 5), m: this.mode, t: Date.now(), o: Date.now()}; 
  }

  choosePath(p) {
    return Math.floor(Math.random()*p);
  }

  identify() {
    let previousTargetExists = false;
    const tanks = this.host.pt.concat(this.host.ai).filter(t => t.x && t.y).sort((a, b) => {
      if ((a.id === this.target.id && !a.ded) || (b.id === this.target.id && !b.ded)) previousTargetExists = true;
      return (a.x-this.x)**2+(a.y-this.y)**2 > (b.x-this.x)**2+(b.y-this.y)**2;
    });
    let target = false, bond = false;
    for (const t of tanks) {
      if (t.ded || t.invis || !Engine.raycast(this.x+40, this.y+40, t.x+40, t.y+40, this.host.b) || t.id === this.id || ((t.x-this.x)**2+(t.y-this.y)**2)**.5 > 800) continue;
      if (Engine.getTeam(t.team) === Engine.getTeam(this.team)) {
        if (!bond && t.role !== 3 && t.role !== 0) bond = t;
      } else {
        if (!target) target = t;
      }
      if (target && (bond || this.role !== 3)) break;
    }
    if (bond) this.bond = bond; 
    if (!target) {
      if (this.target) {
        this.seeTarget = false;
        if (!this.seeTimeout) this.seeTimeout = setTimeout(() => {
          this.mode = 0;
          this.target = false;
        }, previousTargetExists && this.role !== 0 ? 10000 : 0);
      }
    } else {
      if (this.target) this.seeTimeout = clearTimeout(this.seeTimeout);
      this.seeTarget = true;
      this.target = {x: target.x, y: target.y, id: target.id};
      this.mode = (this.hp < .3 * this.maxHp && this.role !== 1) ? 2 : 1;
    }
  }

  fireCalc(tx, ty, type) {
    this.pushback = type && type.includes('missle') ? -9 : -6;
    let co = this.role === 0 ? 50 : 40, d = this.role === 0 ? 85 : 70
    if (type === undefined) type = this.role !== 0 && Math.sqrt((tx - this.x) ** 2 + (ty - this.y) ** 2) < 150 ? 'shotgun' : 'bullet';
    for (let [i, len] = type === 'shotgun' ? [-10, 15] : [0, 1]; i < len; i += 5) {
      A.template('Shot').init(this.x+co, this.y+co, d, this.r+90+i, type, this.team, this.rank, this.host);
    }
    if (type === 'powermissle') {
      this.canPowermissle = false;
      setTimeout(() => {this.canPowermissle = true}, 10000);
    } else if (type !== 'megamissle') {
      this.canFire = false;
      setTimeout(() => {this.canFire = true}, type === 'shotgun' ? 600 : 200);
    }
    if (this.role === --this.ammo) this.reloading = true;
  }

  damageCalc(x, y, a, u) {
    if (this.immune+500 > Date.now() || this.reflect) return;
    const hx = Math.floor((this.x+40)/100), hy = Math.floor((this.y+40)/100);
    for (let i = Math.max(0, hx-1); i <= Math.min(59, hx+1); i++) for (let l = Math.max(0, hy-1); l <= Math.min(59, hy+1); l++) for (const entity of this.host.cells[i][l]) {
      if (entity instanceof Shot) if (entity.target) if (entity.target.id === this.id && entity.type === 'usb') a *= Engine.getTeam(entity.team) === Engine.getTeam(this.team) ? .9 : 1.1;
    }
    if (this.shields > 0 && a > 0) return this.shields -= a;
    clearTimeout(this.damageTimeout);
    this.damageTimeout = setTimeout(() => {this.damage = false}, 1000);
    this.damage = {d: (this.damage ? this.damage.d : 0)+a, x, y};
    this.hp -= a;
    clearInterval(this.healInterval);
    clearTimeout(this.healTimeout);
    if (this.hp <= 0) {
      console.log('AI TEAM: '+this.team);
      if (this.host.ondeath && this.role !== 0) this.host.ondeath(this, this.host.pt.concat(this.host.ai).find(t => t.username === u));
      return this.destroy();
    }
    this.healTimeout = setTimeout(() => {
      this.healInterval = setInterval(() => {
        this.hp = Math.min(this.hp+.4, this.maxHp);
      }, 15);
    }, 10000);
  }
  reset() {
    for (const p of AI.raw) Object.defineProperty(this, p, {value: undefined, writable: true});
    this.cells.clear();
  }
  destroy() {
    this.host.destroyEntity(this);
    clearInterval(this.lookInterval);
    clearInterval(this.fireInterval);
    const index = this.host.ai.indexOf(this);
    if (index !== -1) this.host.ai.splice(index, 1);
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
    this.release();
  }
}
