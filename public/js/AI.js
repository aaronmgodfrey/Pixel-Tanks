class AI {
  static time = Date.now();
  static args = ['x', 'y', 'role', 'rank', 'team', 'host'];
  static raw = ['role', 'rank', 'username', 'cosmetic', 'cosmetic_hat', 'cosmetic_body', 'color', 'damage', 'maxHp', 'hp', 'shields', 'team', 'ammo', 'x', 'y', 'r', 'ded', 'reflect', 'pushback', 'baseRotation', 'baseFrame', 'fire', 'damage', 'animation', 'buff', 'invis', 'class', 'dedEffect', 'gambleCounter'];
  static u = [];
  //static routes = [,];
  constructor() {
    this.cells = new Set();
    this.raw = {};
    this.pos = {};
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

	  
    this.seeUser = this.target = this.obstruction = this.bond = this.path = this.damage = false;
	  
    this.r = this.tr = this.baseRotation = this.baseFrame = this.mode = this.pushback = this.immune = this.shields = 0;
    this.canFire = this.canPowermissle = this.canBoost = this.canBashed = true;
    this.fire = this.reloading = this.canClass = false;
	  
    this.gambleCounter = this.fireTime = 0;
	  
    for (let i = 0; i < 4; i++) if (Math.random() < rank/20) this.canClass = this['canItem'+i] = this.role !== 0;
    if (this.role !== 0) this.giveAbilities(); else this.ammo = 120;
	  
    const summoner = host.pt.find(t => t.username === Engine.getUsername(this.team));
    if (summoner) {
      for (const c of ['cosmetic_hat', 'cosmetic', 'cosmetic_body', 'color']) this[c] = summoner[c];
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
    }
    this.host.loadCells(this, this.x, this.y, 80, 80);
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
    
    if (this.role !== 0) {
      // maybe add a time check if time past path maximum to regenerate path??? Currently just moving to farthest for next tick path regen
      if ((this.x-10)%100 === 0 && (this.y-10)%100 === 0) {
        this.onBlock(); 
      } else if (!this.path) {
        // move to block centre
        // theoretically should be possible if not blocked in all cases
	return;
      }
      if (!this.path || !this.path.p.length) return; // if invalid return :D // should theoretically never happen
      this.move();
    }
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
      if (this.class === 'tactical') this.fireCalc(this.target.x, this.target.y, 'megamissle'); // 25
      if (this.class === 'stealth') this.host.useAbility(this, 'invis'); // 40
      if (this.class === 'builder') this.host.useAbility(this, 'turret'); // 20
      if (this.class === 'warrior') this.host.useAbility(this, 'buff'); // 40
      if (this.class === 'medic') this.host.useAbility(this, 'healwave'); // greedy self-heal :D // 30
      if (this.class === 'fire') {
        for (let i = -30, len = 30; i < len; i += 5) A.template('Shot').init(this.x+40, this.y+40, 70, this.r+90+i, 'fire', this.team, this.rank, this.host);
        cooldown = 10000; // 10
      }
      this.canClass = false;
      setTimeout(() => (this.canClass = true), cooldown);
    }
    for (let i = 0; i < 4; i++) {
      if (this['canItem'+i] && Math.random() < 1/300) {
        const item = this.items[i];
        let cooldown = 0;
        if (item === 'airstrike') if (this.mode !== 0) this.host.useAbility(this, 'airstrike'+this.target.x+'x'+this.target.y); // 20
        if (item === 'super_glu') if (this.hp < this.maxHp*.75) this.host.useAbility(this, 'glu'); // 30
        if (item === 'duck_tape') if (this.hp < this.maxHp*.75) this.host.useAbility(this, 'tape'); // 30
        if (item === 'shield') if (this.shields === 0) this.host.useAbility(this, 'shield'); // 30
        // ded items
        // dyna, usb
        if (item === 'weak') if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180) this.host.useAbility(this, 'block#weak'); // 4
        if (item === 'strong') if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180) this.host.useAbility(this, 'block#strong'); // 8
        if (item === 'spike') if (this.mode !== 0 && ((this.target.x-this.x)**2+(this.target.y-this.y)**2)**.5 < 180) this.host.useAbility(this, 'block#spike'); // 10
        if (item === 'reflector') if (this.mode !== 0) this.host.useAbility(this, 'reflector'); // 10
        if (!cooldown) continue; 
        this['canItem'+i] = false;
        setTimeout(() => (this['canItem'+i] = true), cooldown);
      }
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
        if (this.immune+500 < Date.now() && entity instanceof Block) { // AI DIFF this.immune is a timestamp
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
  }
  move() {
    //this.pos = {t: Date.now(), f: 30, o: Date.now()} // timestamp of last computation and final frame of current path and path time origin
	  // path = {t: Date.now(), p: [[0, 2]], }
    // pos always set upon path gen
    const n = Date.now();
    // calculate frames since last pos check (path gen is 0 for safety)
    let f = Math.min(this.pos.f+Math.floor((n-this.pos.t)/15), (this.path.p.length-1)*25);
    // add boost and subtract toolkit frames here
    let l = Math.floor(f/25), o = f-this.pos.f;
    if (f === (this.path.p.length-1)*25) {
      l -= 1; // set to end of path
      o = 25;
    }
	  //console.log('l='+l+' p='+JSON.stringify(this.path.p));
    const dx = this.path.p[l+1][0]-this.path.p[l][0], dy = this.path.p[l+1][1]-this.path.p[l][1];
    const nx = this.path.p[l][0]*100+10+4*o*dx, ny = this.path.p[l][1]*100+10+4*o*dy;
    this.obstruction = this.collision(nx, ny);
    if (!this.obstruction) {
      if (this.canBoost && Math.random() < 1/300) {
        this.canBoost = false;
        //this.immune = Date.now();
        setTimeout(() => (this.canBoost = true), 5000);
      }
      this.x = nx;
      this.y = ny;
      //this.pos.t = Date.now();
      //this.pos.f = f;
    } else this.pos.t = Date.now();
    this.baseRotation = [[135, 180, 225], [90, this.baseRotation, 270], [45, 0, 315]][dy+1][dx+1];
    this.tr = this.baseRotation;
    // add base rotation cringe
    this.host.loadCells(this, this.x, this.y, 80, 80);
    // OLD CODE
    /*
    const {x, y, path, baseRotation} = this;
    const now = Date.now(); // timing
    const len = path.p.length-1; // last path indice
    let frames = Math.min(Math.floor((now-path.t)/15), len*25); // get the current step in the movement process
    if (this.immune+500 > path.t) frames = Math.min(frames+3*Math.floor(Math.min(now-Math.max(this.immune, path.t), this.immune+500-path.t)/15), len*25);
    // ^^^ if boost then recalculate based on boost time
    const f = Math.floor(frames/25); // last path
    const n = Math.min(f+1, len); // current block
    const dx = path.p[n][0]-path.p[f][0], dy = path.p[n][1]-path.p[f][1];
    const offset = 4*(frames%25); // movement
    const nx = 10+path.p[f][0]*100+offset*dx, ny = 10+path.p[f][1]*100+offset*dy;
    this.baseRotation = [[135, 180, 225], [90, baseRotation, 270], [45, 0, 315]][dy+1][dx+1];
    this.tr = this.baseRotation;
    this.obstruction = this.collision(nx, ny);
    if (!this.obstruction) {
      if (this.canBoost && Math.random() < 1/300) {
        this.canBoost = false;
        this.immune = Date.now();
        setTimeout(() => (this.canBoost = true), 5000);
      }
      this.x = nx;
      this.y = ny;
    } else {
      this.path.t = this.path.o+Date.now()-this.obstruction.t;
    }
    this.host.loadCells(this, this.x, this.y, 80, 80);*/
  }

  collision(x, y) {
    for (const b of this.host.b) if (Engine.collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return {x: b.x+50, y: b.y+50, t: this.obstruction ? this.obstruction.t : Date.now()};
    return false;
  }

  onBlock() {
    if (!this.path || !this.path.p || !this.path.p.length) this.generatePath(); // or if not on block and no path
    if (this.path.p && this.path.p.length > 0) { // why would path be invalid like this????
      const final = this.path.p[this.path.p.length-1]; // if arrived
      if ((this.x-10) / 100 === final[0] && (this.y-10) / 100 === final[1]) this.generatePath();
    }
  }

  generatePath() {
    const sx = (this.x-10)/100, sy = (this.y-10)/100, tx = Math.floor((this.target.x+40)/100), ty = Math.floor((this.target.y+40)/100), ranged = Math.max(sx-tx, sy-ty) > [1, 5, 5][this.role-1];
    /*
    // def ranged
    if ((this.mode === 0 && Math.random() < .5) || (this.role === 1 && this.mode === 1 && !ranged) || (this.role === 3 && this.bond)) {
      cir = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
    } else cir = [[0, -3], [1, -3], [2, -2], [3, -1], [3, 0], [3, 1], [2, 2], [1, 3], [0, 3], [-1, 3], [-2, 2], [-3, 1], [-3, 0], [-3, -1], [-2, -2], [-1, -3]];
    


	  

	  */
    let cir, coords = [], limiter, tpx, tpy, epx, epy;
    this.pos.t = Date.now();
    this.pos.o = Date.now();
    this.pos.f = 0;
    
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
    if (this.mode !== 0) this.path = {p: Engine.pathfind(sx, sy, tx, ty, this.host.map.clone()).slice(0, 5), m: this.mode, t: Date.now(), o: Date.now()}; 
  }

  choosePath(p) {
    return Math.floor(Math.random()*p);
  }

  pathfind() {
  }

  identify() {
    let previousTargetExists = false;
    // filter to all other tanks, sort by distance
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
    } // locate
    if (bond) this.bond = bond; 
    if (!target) {
      if (this.target) {
        this.seeTarget = false;
        if (!this.seeTimeout) this.seeTimeout = setTimeout(() => { // target despawn timer
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

  fireCalc(tx, ty, type) { // needs cohesion with Client.fireCalc
    this.pushback = type && type.includes('missle') ? -9 : -6;
    let co = this.role === 0 ? 50 : 40, d = this.role === 0 ? 85 : 70
    if (type === undefined) type = this.role !== 0 && Math.sqrt((tx-this.x)**2 + (ty-this.y)**2) < 150 ? 'shotgun' : 'bullet';
    for (let [i, len] = type === 'shotgun' ? [-10, 15] : [0, 1]; i < len; i += 5) {
      A.template('Shot').init(this.x+co, this.y+co, d, this.r+90+i, type, this.team, this.rank, this.host);
    }
    if (type === 'powermissle') {
      this.canPowermissle = false;
      setTimeout(() => (this.canPowermissle = true), 10000);
    } else if (type !== 'megamissle') {
      this.canFire = false;
      setTimeout(() => (this.canFire = true), type === 'shotgun' ? 600 : 200);
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
      this.healInterval = setInterval(() => (this.hp = Math.min(this.hp+.4, this.maxHp)), 15);
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
