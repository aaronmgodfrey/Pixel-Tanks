class AI {
  static time = Date.now();
  static args = ['x', 'y', 'role', 'rank', 'team', 'host'];
  static raw = ['path', 'role', 'rank', 'username', 'cosmetic', 'cosmetic_hat', 'cosmetic_body', 'color', 'damage', 'maxHp', 'hp', 'shields', 'team', 'ammo', 'x', 'y', 'r', 'ded', 'reflect', 'pushback', 'baseRotation', 'baseFrame', 'fire', 'damage', 'animation', 'buff', 'invis', 'class', 'dedEffect', 'gambleCounter'];
  static u = [];
  static routes = [[[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]], [[0, -3], [1, -3], [2, -2], [3, -1], [3, 0], [3, 1], [2, 2], [1, 3], [0, 3], [-1, 3], [-2, 2], [-3, 1], [-3, 0], [-3, -1], [-2, -2], [-1, -3]]];
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
    this.maxHp = this.hp = this.role === 0 ? this.rank*6+180 : this.rank*10+300;
    this.barrelSpeed = Math.random()*3+2; // HOOK TO BALANCING

	  
    this.target = this.obstruction = this.bond = this.path = this.damage = false;
	  
    this.r = this.br = this.tr = this.baseRotation = this.baseFrame = this.mode = this.pushback = this.immune = this.shields = 0;
    this.canClass = this.canFire = this.canPowermissle = this.canBoost = this.canBashed = this.canGrapple = true;
    this.fire = this.reloading = false;
	  
    this.gambleCounter = this.fireTime = 0;

    this.reaction = 200;
	  
    for (let i = 0; i < 4; i++) if (Math.random() < rank/20) this['canItem'+i] = this.role !== 0;
    if (this.role !== 0) this.giveAbilities(); else this.ammo = 120;
	  
    const summoner = host.pt.find(t => t.username === Engine.getUsername(this.team));
    if (summoner) {
      for (const c of ['cosmetic_hat', 'cosmetic', 'cosmetic_body', 'color', 'nameColor']) this[c] = summoner[c];
    } else {
      /*for (let i = 0; i < 3; i++) { // why cringe 3 for loop?
        let rand = Math.floor(Math.random()*1001);
	let rarity = rand < 1 ? 'mythic' : rand < 10 ? 'legendary' : rand < 50 ? 'epic' : rank < 150 ? 'rare' : rand < 300 ? 'uncommon' : 'common';
        let number = Math.floor(Math.random()*(crate[rarity].length)), item;
        item = crate[rarity][number];
        //for (const e in crate[rarity]) if (e === crate[rarity][number]) item = crate[rarity][number];
        this[['cosmetic_hat', 'cosmetic', 'cosmetic_body'][i]] = item;
      } // end of bread code*/
      this.color = Engine.getRandomColor();
	  this.nameColor = '#FFFFFF';
    }
    this.host.loadCells(this, this.x, this.y, 80, 80);
    host.updateEntity(this, AI.raw);
    for (const p of AI.raw) {
      this.raw[p] = this[p];
      Object.defineProperty(this, p, {get: () => this.raw[p], set: v => this.setValue(p, v), configurable: true});
    }
    this.identify();
    this.host.ai.push(this);
  }

  regen() {
    this.hp = Math.min(this.hp+.4*(this.rank/50+.6), this.maxHp);
    if (this.hp === this.maxHp) this.regenInterval = clearInterval(this.regenInterval);
  }
	
  giveAbilities() {
    const available = ['airstrike', 'super_glu', 'duck_tape', 'shield', 'dynamite', 'usb', 'weak', 'strong', 'spike', 'reflector', 'torpedo'];
    const classes = ['tactical', 'stealth', 'builder', 'warrior', 'medic', 'fire'];
    for (let i = 0; i < 4; i++) {
      let r = Math.floor(Math.random()*available.length);
      this.items.push(available[r]);
      available.splice(r, 1);
    }
    this.class = classes[Math.floor(Math.random()*classes.length)];
  }

  think() {
    if (this.ded) return;
    if (this.role !== 0) {
      // maybe add a time check if time past path maximum to regenerate path??? Currently just moving to farthest for next tick path regen
      if ((this.x-10)%100 === 0 && (this.y-10)%100 === 0) this.onBlock();
      if (this.grapple) this.path = false; else this.move();
    }
    if (this.obstruction && !this.seeTarget) {
      this.tr = Engine.toAngle(this.obstruction.x-(this.x+40), this.obstruction.y-(this.y+40));
      if (this.canPowermissle && this.role !== 0 && Math.random() <= 1/200) this.fireCalc(this.obstruction.x, this.obstruction.y, 'powermissle');
      if (this.canFire) this.fireCalc(this.obstruction.x, this.obstruction.y);
    } else if (this.mode !== 0) {
      this.tr = Engine.toAngle(this.target.x-this.x, this.target.y-this.y);
      if (this.canPowermissle && this.role !== 0 && Math.random() <= 1/200) this.fireCalc(this.target.x, this.target.y, 'powermissle');
      if (this.canGrapple && this.role !== 0 && Math.random() <= 1/100 && this.seeTarget) this.fireCalc(this.target.x, this.target.y, 'grapple');
      if (this.canFire) this.fireCalc(this.target.x, this.target.y);
    }
    if (this.canClass && this.mode !== 0 && Math.random() < 1/[60, 60, 60, 10, 10, 10][['tactical', 'stealth', 'builder', 'warrior', 'medic', 'fire'].indexOf(this.class)]) {
      if (this.class === 'tactical') this.fireCalc(this.target.x, this.target.y, 'megamissle');
      if (this.class === 'stealth') this.host.useAbility(this, 'invis');
      if (this.class === 'builder') this.host.useAbility(this, 'turret');
      if (this.class === 'warrior') {
        this.canBoost = false;
        this.immune = Date.now();
        this.booster = setTimeout(() => (this.canBoost = true), 5000);
        this.host.useAbility(this, 'bash');
      }
      if (this.class === 'medic') if (this.hp < this.maxHp*.5) this.host.useAbility(this, 'healburst');
      if (this.class === 'fire') for (let i = -30, len = 30; i < len; i += 5) A.template('Shot').init(this.x+40, this.y+40, 70, this.r+90+i, 'fire', this.team, this.rank, this.host);
      this.canClass = false;
      setTimeout(() => (this.canClass = true), 1000*[25, 2, 30, 15, 30, 10][['tactical', 'stealth', 'builder', 'warrior', 'medic', 'fire'].indexOf(this.class)]);
    }
    for (let i = 0; i < 4; i++) {
      if (this['canItem'+i] && Math.random() < 1/300) {
        const item = this.items[i];
        if (item === 'airstrike') if (this.mode !== 0) this.host.useAbility(this, 'airstrike'+this.target.x+'x'+this.target.y); // 20
        if (item === 'super_glu') if (this.hp < this.maxHp*.75) this.host.useAbility(this, 'glu'); // 30
        if (item === 'duck_tape') if (this.hp < this.maxHp*.75) this.host.useAbility(this, 'tape'); // 30
        if (item === 'shield') if (this.shields === 0) this.host.useAbility(this, 'shield'); // 30
        // ded items
        // dyna, usb, crate, missile
	if (item === 'dynamite') if (this.seeTarget) this.fireCalc(this.target.x, this.target.y, 'dynamite');
	if (item === 'usb') if (this.seeTarget) this.fireCalc(this.target.x, this.target.y, 'usb');
	if (item === 'torpedo' && this.seeTarget) {
	  this.fireCalc(this.target.x, this.target.y, 'torpedo');
          for (let i of [10, 20, 30, 40, 50, 60]) setTimeout(() => this.fireCalc(this.target.x, this.target.y, 'torpedo'), i);
	}
        if (item === 'weak') if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180 && this.seeTarget) this.host.useAbility(this, 'block#weak'); // 4
        if (item === 'strong') if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180 && this.seeTarget) this.host.useAbility(this, 'block#strong'); // 8
        if (item === 'spike') this.host.useAbility(this, 'block#spike'); // 10
        if (item === 'reflector') if (this.mode !== 0) this.host.useAbility(this, 'reflector'); // 10
        this['canItem'+i] = false;
        setTimeout(() => (this['canItem'+i] = true), 1000*[30, 30, 30, 4, 8, 10, 10, 25, 20, 40, 25, 20][['duck_tape', 'super_glu', 'shield', 'weak', 'strong', 'spike', 'reflector', 'usb', 'torpedo', 'bomb', 'dynamite', 'airstrike'].indexOf(item)]);
      } else if (Math.random() < 1/300 && this.items[i] === 'dynamite') this.host.useAbility(this, 'dynamite'); // TEMP
    }
  }

  setValue(p, v) {
    if (this.raw[p] === v && typeof v !== 'object') return; else this.raw[p] = v;
    this.host.updateEntity(this, [p]);
  }

  update() {
    /*const radar = Engine.hasPerk(this.perk, 6);
    if (radar && !this.ded) {
      this.eradar.length = this.fradar.length = 0;
      for (const t of this.host.pt.concat(this.host.ai)) {
        if (t.ded || (t.x === this.x && t.y === this.y) || Math.sqrt((t.x-this.x)**2+(t.y-this.y)**2) < 400) continue;
        if (!Engine.match(t, this)) {
          if (!t.invis) this.eradar.push(Engine.toAngle(t.x-this.x, t.y-this.y));
        } else if (radar > 1) this.fradar.push(Engine.toAngle(t.x-this.x, t.y-this.y));
      }
      this.host.updateEntity(this, ['eradar', 'fradar']);
    }*/
    if (this.dedEffect) (this.dedEffect.time = Date.now()-this.dedEffect.start) && this.setValue('dedEffect', this.dedEffect);
    if (this.pushback !== 0) this.pushback += 0.5;
    if (Date.now()-this.fireTime < 4000) {
      if (this.fire && Engine.getTeam(this.fire) !== Engine.getTeam(this.team)) this.damageCalc(this.x, this.y, .25*(this.fireRank/50+.6), Engine.getUsername(this.fire)); 
    } else this.fire = false;
    if (this.damage) this.damage.y-- && this.host.updateEntity(this, ['damage']);
    if (this.grapple) this.grappleCalc();
    if (this.reflect) for (let hx = Math.floor((this.x+40)/100), i = Math.max(0, hx-2); i <= Math.min(59, hx+2); i++) for (let hy = Math.floor((this.y+40)/100), l = Math.max(0, hy-2); l <= Math.min(59, hy+2); l++) {
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
        if (this.immune+500 < Date.now() && entity instanceof Block) { // AI DIFF this.immune is a timestamp
          let size = entity.type === 'spike' ? 50 : 100;
          if (!Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, size, size)) continue;
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
          } else {
            /*const thermal = Engine.hasPerk(this.perk, 2);
            if (thermal && !entity.thermaled && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, 100, 100)) {
              entity.thermaled = setTimeout(() => (entity.thermaled = false), 1000) && 1;
              entity.damageCalc(entity.x, entity.y, thermal*10, Engine.getUsername(this.team));
            }*/
          }
        } else if (!teamMatch && !entity.ded && (entity instanceof Tank || entity instanceof AI)) {
          if (this.immune+500 < Date.now() && entity.buff && this.canBashed && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, 80, 80)) {
            this.canBashed = false;
            setTimeout(() => (this.canBashed = true), 1000);
            this.damageCalc(this.x, this.y, 100*(entity.rank/50+.6), Engine.getUsername(entity.team));
          }
          /*const thermal = Engine.hasPerk(this.perk, 2), size = entity.role === 0 ? 100 : 80;
          if (thermal && !entity.thermaled && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, size, size)) {
            entity.thermaled = setTimeout(() => (entity.thermaled = false), 1000) && 1;
            entity.damageCalc(entity.x, entity.y, thermal*10, Engine.getUsername(this.team));
          }*/
        }
      }
    }
    // AI BASED UPDATING
    if (!this.reloading) this.think(); else {
      this.ammo += .1;
      if (this.ammo >= 120) this.reloading = false;
    }
    if ((!this.target && this.role === 0) || this.reloading) return this.r = (this.r+1)%360;
    if (!(this.role === 0 && this.mode === 0)) {
      const diff = (this.tr-this.r+360)%360, dir = diff < 180 ? 1 : -1;
      this.r = diff > this.barrelSpeed ? (this.r+dir*this.barrelSpeed+360)%360 : this.tr;
    }
    if (this.role !== 0) {
      let dis = (Math.abs(this.br-this.baseRotation)+360)%360;
      if (dis > 90 && dis < 270) this.br = (this.br+180+360)%360;
      const diff = (this.br-this.baseRotation+360)%360, dir = diff < 180 ? 1 : -1;
      if (!this.lastBaseRotation || Date.now()-this.lastBaseRotation > 15) {
        this.baseRotation = diff > 12 ? (this.baseRotation+(dir*12)+360)%360 : this.br;
        this.lastBaseRotation = Date.now();
      }
    }
    if (this.ded+10000 < Date.now()) this.destroy();
  }
  move() {
    if (this.stunned && this.path) return this.path.t = Date.now(); else if (this.stunned) return;
    let nx, ny, tx, ty, dx, dy, f;
    let n = Date.now(), boostTime = 0, speed = n < this.immune+500 ? 16 : 4, b = !this.path || !this.path.p.length;
    if (b) {
      tx = 100*Math.floor(this.x/100)+10;
      ty = 100*Math.floor(this.y/100)+10;
      nx = speed*(dx = (this.x-tx < 0 ? 1 : -1));
      ny = speed*(dy = (this.y-ty < 0 ? 1 : -1));
      this.obstruction = this.canMove(this.x+nx, this.y+ny);
    } else {
      let max = (this.path.p.length-1)*25;
      f = Math.min(this.path.f+Math.floor((n-this.path.t)/15), max);
      if (this.immune) f = Math.min(f+Math.max(0, 3*Math.floor((Math.min(n, this.immune+500)-Math.max(this.path.t, this.immune))/15)), max);
      let l = Math.floor(f/25), o = f%25;
      if (f === max) {
        l -= 1; // set to end of path
        o = 25;
      }
      dx = this.path.p[l+1][0]-this.path.p[l][0];
      dy = this.path.p[l+1][1]-this.path.p[l][1];
      nx = this.path.p[l][0]*100+10+4*o*dx;
      ny = this.path.p[l][1]*100+10+4*o*dy;
      this.path.t = Date.now();
      this.obstruction = this.canMove(nx, ny);
    }
    if (!this.obstruction) {
      if (this.canBoost && Math.random() < 1/300) {
        this.canBoost = false;
        this.immune = Date.now();
        this.booster = setTimeout(() => (this.canBoost = true), 5000);
      }
      if (!b) this.x = nx; else if (Math.abs(this.x-tx) > speed) this.x += nx; else this.x = 100*Math.floor(this.x/100)+10;
      if (!b) this.y = ny; else if (Math.abs(this.y-ty) > speed) this.y += ny; else this.y = 100*Math.floor(this.y/100)+10;
      if (!b) this.path.f = f;
    }
    this.tr = this.br = [[135, 180, 225], [90, this.baseRotation, 270], [45, 0, 315]][dy+1][dx+1];
    this.host.loadCells(this, this.x, this.y, 80, 80);
    if (n < this.immune+500 && this.class === 'fire') {
      for (const cell of this.cells) {
        const [cx, cy] = cell.split('x');
        if (!Engine.collision(cx*100, cy*100, 100, 100, this.x+40, this.y+40, 0, 0)) continue;
        let hasFire = false;
        for (const entity of this.host.cells[cx][cy]) if (entity instanceof Block && entity.type === 'fire' && Engine.getUsername(entity.team) === this.username && entity.x/100 === cx && entity.y/100 === cy) hasFire = true;
        if (!hasFire) this.host.b.push(A.template('Block').init(cx*100, cy*100, 'fire', Engine.parseTeamExtras(this.team), this.host));
      }
    }
  }
  
  canMove(x, y) {
    for (const cell of this.cells) {
      const c = cell.split('x'), x = c[0], y = c[1];
      for (const b of this.host.cells[x][y]) if (b instanceof Block && Engine.collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return {x: b.x+50, y: b.y+50, t: this.obstruction ? this.obstruction.t : Date.now()};
    }
    return false;
  }

  grappleCalc() { // PORTED from Tank.grappleCalc
    if (this.stunned) return this.grapple.bullet.destroy() && (this.grapple = false);
    const dx = this.grapple.target.x - this.x, dy = this.grapple.target.y - this.y, ox = this.x, oy = this.y;
    if (dx**2 + dy**2 > 400) {
      const angle = Math.atan2(dy, dx);
      const mx = Math.round(Math.cos(angle)*5)*4;
      const my = Math.round(Math.sin(angle)*5)*4;
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
    this.host.loadCells(this, this.x, this.y, 80, 80);
  }
  collision(x, y) {
    if (x < 0 || y < 0 || x + 80 > 6000 || y + 80 > 6000) return false;
    for (let hx = Math.floor((this.x+40)/100), i = Math.max(0, hx-2); i <= Math.min(59, hx+2); i++) for (let hy = Math.floor((this.y+40)/100), l = Math.max(0, hy-2); l <= Math.min(59, hy+2); l++) {
      for (const b of this.host.cells[i][l]) if (b instanceof Block && Engine.collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return false;
    }
    return true;
  }
	
  onBlock() {
    if (!this.path || !this.path.p || !this.path.p.length) this.generatePath(); // or if not on block and no path
    if (this.path && this.path.p && this.path.p.length > 0) {
      const final = this.path.p[this.path.p.length-1]; // if arrived
      if ((this.x-10) / 100 === final[0] && (this.y-10) / 100 === final[1]) this.generatePath();
    }
  }

  generatePath() {
    // early checks for blockage
    const sx = (this.x-10)/100, sy = (this.y-10)/100, tx = Math.floor((this.target.x+40)/100), ty = Math.floor((this.target.y+40)/100), ranged = Math.max(sx-tx, sy-ty) > [1, 5, 5][this.role-1];
    let route = ((this.mode === 0 && Math.random() < .5) || (this.role === 1 && this.mode === 1 && !ranged) || (this.role === 3 && this.bond)) ? 0 : 1;
    let coords = [];
    let epx, epy, tpx, tpy;
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
    coords = this.getCoords(route, epx, epy, tpx, tpy, sx, sy);
    if (!coords.length && route === 1) coords = this.getCoords(--route, epx, epy, tpx, tpy, sx, sy);
    if (!coords.length) return;
    coords.sort((a, b) => this.mode !== 2 ? a[2] - b[2] : b[2] - a[2]);
    let clone = [...coords];
    let r, p;
    do {
      if (coords.length < 10 && route === 1) {
	clone = [...(coords = this.getCoords(--route, epx, epy, tpx, tpy, sx, sy))];
	coords.sort((a, b) => this.mode !== 2 ? a[2] - b[2] : b[2] - a[2]);
      }
      r = this.choosePath(coords.length);
      p = this.pathfind(sx, sy, coords[r][0], coords[r][1]); // loop through if first fails????
      for (const c of p) for (const b of this.host.cells[c[1]][c[0]]) if (b instanceof Block && b.type === 'airstrike' && Engine.getTeam(b.team) !== Engine.getTeam(this.team)) {
	      console.log('path intersected airstrike');
	      p = []; 
      }
      coords.splice(r, 1);
    } while ((!p.length || p.length > 10) && coords.length);
    this.path = {p, m: this.mode, t: Date.now(), f: 0, epx, epy, tpx, tpy, coords: clone}; // change path if mode change
    
	  
    /*
    let cir, coords = [], limiter, tpx, tpy, epx, epy;
    this.path.t = Date.now();
    this.path.f = 0;
    
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
      return this.path = {p, m: this.mode, t: Date.now(), o: Date.now()};
    }
    if (this.mode !== 0) this.path = {p: Engine.pathfind(sx, sy, tx, ty, this.host.map.clone()).slice(0, 5), m: this.mode, t: Date.now(), o: Date.now()}; */
  }
  getCoords(route, epx, epy, tpx, tpy, sx, sy) {
    const coords = [];
    for (const c of AI.routes[route]) {
      const x = c[0]+epx, y = c[1]+epy, d = (x-tpx)**2+(y-tpy)**2;
      if (x >= 0 && y >= 0 && x <= 59 && y <= 59 && !(x === sx && y === sy) && this.host.map[y][x].walkable) coords.push([x, y, d]);
    }
    return coords;
  }
  choosePath(p) {
    let m = Math.random();
    return (m < .7 || p === 1) ? 0 : (m < .95 ? 1 : Math.floor(Math.random()*p));
  }
  getCells(c) {
    const n = [];
    const d = [
      [0, -1, [[0, -1]]], // up
      [0, 1, [[0, 1]]], // down
      [-1, 0, [[-1, 0]]], // left
      [1, 0, [[1, 0]]], // right
      [1, -1, [[0, -1], [1, 0], [1, -1]]], // top right
      [1, 1, [[0, 1], [1, 0], [1, 1]]], // bottom right
      [-1, 1, [[0, 1], [-1, 0], [-1, 1]]], // bottom left
      [-1, -1, [[0, -1], [-1, 0], [-1, -1]]], // top left
    ];
    for (const r of d) {
      let x = c.x+r[0], y = c.y+r[1], g = true;
      for (const s of r[2]) if (this.host.map[c.y+s[1]] === undefined || this.host.map[c.y+s[1]][c.x+s[0]] === undefined || !this.host.map[c.y+s[1]][c.x+s[0]].walkable) g = false;
      if (g) n.push(this.host.map[y][x]);
    }
    return n;
  }
  pathfind(x, y, tx, ty) {
    const s = this.host.map[y][x], t = this.host.map[ty][tx], p = [], e = [s], f = new Set();
    while (e.length) {
      e.sort((a, b) => a.f-b.f);
      const c = e.shift();
      if (c === t) {
        let t = c;
        while (t) {
          p.push([t.x, t.y]);
          t = t.parent;
        }
	this.cleanPath(e, f);
        return p.reverse();
      }
      f.add(c);
      const n = this.getCells(c);
      for (const o of n) {
        if (f.has(o)) continue;
        const score = c.g+1;
        if (!e.includes(o) || score < o.g) {
          o.g = score;
          o.h = Math.abs(o.x-tx)+Math.abs(o.y-ty);
          o.f = o.g+o.h;
          o.parent = c;
          if (!e.includes(o)) e.push(o);
        }
      }
    }
    this.cleanPath(e, f);
    return [];
  }
  cleanPath(e, f) {
    for (const c of e) {
      c.g = c.h = c.f = 0;
      c.parent = null;
    }
    for (const c of f) {
      c.g = c.h = c.f = 0;
      c.parent = null;
    }
    for (let y = 0; y < 60; y++) for (let x = 0; x < 60; x++) {
      this.host.map[y][x].g = this.host.map[y][x].h = this.host.map[y][x].f = 0;
      this.host.map[y][x].parent = null;
    }
  }

  identify() {
    if (this.ded) return;
    clearTimeout(this.lookout);
    this.lookout = setTimeout(() => this.identify(), Math.random()*200+200);
    let previousTargetExists, previousBondExists, team, target, bond;
    for (const t of this.host.pt.concat(this.host.ai)) {
      if (t.id === this.target.id && !t.ded) previousTargetExists = true;
      if (t.id === this.bond.id && !t.ded) previousBondExists = true;
      if (t.ded || t.invis || t.id === this.id || (team = Engine.match(t, this) && (this.role !== 3 || this.bond)) || ((t.x-this.x)**2+(t.y-this.y)**2)**.5 > 800 || !Engine.raycast(this.x+40, this.y+40, t.x+40, t.y+40, this.host.b)) continue;
      if (team) {
        if (!bond && this.role === 3 && t.role !== 0 && t.role !== 3) bond = t;
      } else if (!target) target = t;
      if (target && (this.bond || bond || this.role !== 3)) break;
    }
    if (bond) this.bond = bond;
    if (!previousBondExists) this.bond = false;
    if (target) {
      if (!this.target) this.targetTimeout = clearTimeout(this.targetTimeout);
      this.seeTarget = true;
      this.target = {x: target.x, y: target.y, id: target.id};
      this.mode = (this.hp < .3 * this.maxHp && this.role !== 1) ? 2 : 1;
    } else if (this.target) {
      this.seeTarget = false;
      if (!this.targetTimeout) this.targetTimeout = setTimeout(() => { // target despawn timer
        this.mode = 0;
        this.target = false;
      }, previousTargetExists && this.role !== 0 ? 10000 : 0);
    }
  }
  fireCalc(tx, ty, type) {
    this.pushback = type && type.includes('missle') ? -9 : -6;
    let co = this.role === 0 ? 50 : 40, d = this.role === 0 ? 85 : 70;
    if (type === undefined) type = this.role !== 0 && Math.sqrt((tx-this.x)**2 + (ty-this.y)**2) < 150 ? 'shotgun' : 'bullet';
    for (let [i, len] = type === 'shotgun' ? [-10, 15] : [0, 1]; i < len; i += 5) A.template('Shot').init(this.x+co, this.y+co, d, this.r+90+i, type, this.team, this.rank, this.host);
    if (type === 'powermissle') {
      this.canPowermissle = false;
      setTimeout(() => (this.canPowermissle = true), 10000);
    } else if (type === 'grapple') {
      this.canGrapple = false;
      setTimeout(() => (this.canGrapple = true), 5000);
    } else if (type !== 'megamissle' && type !== 'torpedo' && type !== 'usb' && type !== 'dynamite') {
      this.canFire = false;
      setTimeout(() => (this.canFire = true), type === 'shotgun' ? 600 : 200);
    }
    if (this.role === --this.ammo) this.reloading = true;
  }
  /*
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
    if (a > 1) {
      clearTimeout(this.regenTimeout);
      this.regenInterval = clearInterval(this.regenInterval);
      this.regenTimeout = setTimeout(() => (this.regenInterval = setInterval(() => this.regen(), 15)), 10000);
    }
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
  */
  damageCalc(x, y, a, u) { // sync with Tank.damageCalc
    if (this.immune+500 > Date.now() || this.reflect || this.ded) return;
    const hx = Math.floor((this.x+40)/100), hy = Math.floor((this.y+40)/100);
    for (let i = Math.max(0, hx-1); i <= Math.min(59, hx+1); i++) for (let l = Math.max(0, hy-1); l <= Math.min(59, hy+1); l++) for (const entity of this.host.cells[i][l]) {
      if (entity instanceof Shot) if (entity.target) if (entity.target.id === this.id && entity.type === 'usb') a *= Engine.getTeam(entity.team) === Engine.getTeam(this.team) ? .9 : 1.1;
    }
    if (this.shields > 0 && a > 0) return this.shields -= a;
    clearTimeout(this.damageTimeout);
    this.damageTimeout = setTimeout(() => {this.damage = false}, 1000);
    this.damage = {d: (this.damage ? this.damage.d : 0)+a, x, y};
    this.hp -= a;
    if (this.hp <= 0) {
      if (this.host.ondeath && this.role !== 0) this.host.ondeath(this, this.host.pt.concat(this.host.ai).find(t => t.username === u));
      return this.ded = Date.now();
    }
    if (a > 1) {
      clearTimeout(this.regenTimeout);
      this.regenInterval = clearInterval(this.regenInterval);
      this.regenTimeout = setTimeout(() => (this.regenInterval = setInterval(() => this.regen(), 15)), 10000);
    }
  }
  reset() {
    for (const p of AI.raw) Object.defineProperty(this, p, {value: undefined, writable: true});
    this.cells.clear();
  }
  destroy() {
    this.host.destroyEntity(this);
    clearTimeout(this.booster);
    clearTimeout(this.lookout);
    clearInterval(this.lookInterval);
    clearInterval(this.fireInterval);
    const index = this.host.ai.indexOf(this);
    if (index !== -1) this.host.ai.splice(index, 1);
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
    //this.release();
  }
}
