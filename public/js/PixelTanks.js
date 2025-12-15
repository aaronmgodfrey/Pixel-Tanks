class PixelTanks {
  static loadMessages = ['Recharging Instas...', 'Summoning Turrets...', 'Sorting Cosmetics...', 'Spotting Stealths...', 'Putting Out Fires...', 'Generating Levels...', 'Loading Up Crates...', 'Filling Up Stocks...', 'Drawing Menus...', 'Placing Blocks...', 'Launching Missles...', 'Booting Game Engine...'];
  static levelCoords = [[116, 248], [356, 204], [596, 260], [839, 240], [1056, 204], [1272, 272], [1340, 400], [1212, 536], [964, 516], [732, 560], [508, 528], [284, 480], [64, 548], [36, 676], [148, 804], [384, 844], [624, 788], [864, 808], [1100, 848], [1336, 808]];
  static t = Date.now();
  static start() {
    PixelTanks.setup();
    PixelTanks.boot();
  }
  static setup() {
    GUI.setup();
    GUI.canvas = document.createElement('CANVAS');
    GUI.draw = GUI.canvas.getContext('2d');
    GUI.draw.imageSmoothingEnabled = false;
    GUI.canvas.height = 1000;
    GUI.canvas.width = 1600;
    document.body.appendChild(GUI.canvas);
    let tickspeed, old = Date.now(), getTickspeed = () => {
      PixelTanks.tickspeed = tickspeed = Date.now()-old;
      old = Date.now();
      setTimeout(() => getTickspeed());
    }
    getTickspeed();
  }
  static updateBootProgress(progress) {
    GUI.clear();
    if (Math.random() < .05) PixelTanks.loadMessage = PixelTanks.loadMessages[Math.floor(Math.random()*PixelTanks.loadMessages.length)];
    GUI.drawText(PixelTanks.loadMessage, 800, 500, 50, '#ffffff', 0.5);
    GUI.draw.fillStyle = '#FFFFFF';
    GUI.draw.fillRect(400, 600, 800, 60);
    GUI.draw.fillStyle = '#000000';
    GUI.draw.fillRect(405, 605, 790, 50);
    GUI.draw.fillStyle = '#FFFFFF';
    GUI.draw.fillRect(410, 610, progress*780, 40);
  }
  static renderCosmetic(i, x, y, w, h, r) {
    if (!i) return;
    let yd = i.height, xd = yd*40/45, frames = i.width/xd, speed = 100, frame = Math.floor((Date.now()%(frames*speed))/speed); 
    GUI.drawImage(i, x, y, w, h, 1, w/2, w/2, 0, 0, r, frame*xd, 0, xd, yd);
  }
  static loadTexturePack(configURL, callback) {
    const config = document.createElement('SCRIPT');
    config.src = configURL;
    config.onload = () => {
      Network.load(window.sourceMap);
      Network.callback = callback;
    }
    document.head.appendChild(config);
  }
  static boot() {
    PixelTanks.user = {};
    PixelTanks.loadMessage = PixelTanks.loadMessages[Math.floor(Math.random()*PixelTanks.loadMessages.length)];
    let cosmetAmount = 1, deathAmount = 1;
    PixelTanks.loadTexturePack('https://aaronmgodfrey.github.io/Pixel-Tanks/public/js/config.js', () => {
      PixelTanks.launch();
      for (const m in Menus.menus) Menus.menus[m] = new Menu(Menus.menus[m], m);
    });
    PixelTanks.socket = new MegaSocket(window.location.protocol === 'https:' ? 'wss://'+window.location.hostname : 'ws://129.146.45.71', {keepAlive: true, reconnect: true, autoconnect: true});
  }

  static launch() {  
    setTimeout(() => {
      if (window.u && window.p) PixelTanks.auth(window.u, window.p, 'login'); else Menus.trigger('start');
    }, 200);
  }

  static save() {
    PixelTanks.playerData['pixel-tanks'] = PixelTanks.userData; // optimize db
    Network.update('playerdata', JSON.stringify(PixelTanks.playerData));
  }

  static playSound(name, type) {
    PixelTanks.sounds[name].loop = type === (PixelTanks.sounds[name].currentTime = 0);
    if (isNaN(PixelTanks.userData.volume)) PixelTanks.userData.volume = 100;
    if (isNaN(PixelTanks.userData.music)) PixelTanks.userData.music = 100;
    PixelTanks.sounds[name].volume = PixelTanks.userData[['battlegrounds', 'gem', 'ice', 'cave', 'deep', 'menu'].includes(name) ? 'music' : 'volume']/100;
    PixelTanks.sounds[name].play();
  }
  static stopSound(name) {
    PixelTanks.sounds[name].pause();
  }

  static getData(callback) {
      Network.get(data => {
        try {
          PixelTanks.playerData = JSON.parse(data.playerdata);
        } catch(e) {
          PixelTanks.playerData = data.playerdata;
        }
        PixelTanks.userData = PixelTanks.playerData['pixel-tanks'];
        if (!PixelTanks.userData) {
          PixelTanks.userData = {
            class: '',
            cosmetic: '',
            cosmetics: [],
            deathEffect: '',
            deathEffects: [],
            color: '#ffffff',
            volume: 100,
            music: 100,
            stats: [
              0, // coins
              0, // crates
              1, // level
              0, // xp
              0, // rank
            ],
            classes: [false, false, false, false, false, false],
            perks: [false, false, false, false, false, false, false, false, false],
            perk: [0, 0],
            items: ['duck_tape', 'weak', 'bomb', 'flashbang'],
            keybinds: {
              item1: 49,
              item2: 50,
              item3: 51,
              item4: 52,
              toolkit: 81,
              grapple: 82,
              boost: 16,
              class: 70,
              fire: 32,
              powermissle: 86,
              chat: 13,
              pause: 27,
            },
          };
        }
        if (PixelTanks.user.username != 'bradley') {
          PixelTanks.userData.cosmetics = PixelTanks.userData.cosmetics.filter(c => c.split('#')[0] != 'hoodie'); // ONLY htloaves get the SET :D 
          if (PixelTanks.userData.cosmetic == 'hoodie' || PixelTanks.userData.cosmetic_hat == 'hoodie' || PixelTanks.userData.cosmetic_body == 'hoodie') PixelTanks.userData.cosmetic = PixelTanks.userData.cosmetic_hat = PixelTanks.userData.cosmetic_body = '';
        }
        clearInterval(PixelTanks.autosave);
        PixelTanks.autosave = setInterval(() => PixelTanks.save(), 5000);
        callback();
      });
  }

  static openCrate(type, a=1) {
    try {
    const price = a*(type ? 5 : 1), delay = [1000, 500, 50][Math.floor(Math.log10(a))];
    if (PixelTanks.userData.stats[1] < price) return alert('Not Enough Crates'); else PixelTanks.userData.stats[1] -= a*(type ? 5 : 1);
    Menus.menus[Menus.current].removeListeners();
    for (let i = 0; i < a; i++) setTimeout(() => {
      try {
      let r = Math.floor(Math.random()*1001), name = ['cosmetics', 'deathEffects'][type], rarity = (r < 1 ? 'mythic' : (r < 10 ? 'legendary' : (r < 50 ? 'epic' : (r < 150) ? 'rare' : (r < 300 ? 'uncommon': 'common')))), n = Math.floor(Math.random()*this.crates[type][rarity].length), image = Object.values(this.images[name]).find(c => c.src && this.crates[type][rarity][n] === c.src.split('/').slice(-1)[0].replace('.png', '')); 
      let done = false;
      for (const i in PixelTanks.userData[name]) {
        const [item, amount] = PixelTanks.userData[name][i].split('#');
        if (item !== this.crates[type][rarity][n]) continue;
        PixelTanks.userData[name][i] = done = item+'#'+(Number(amount)+1);
      }
      if (!done) PixelTanks.userData[name].unshift(this.crates[type][rarity][n]+'#1');
      Menus.menus.crate.reward = [image, type, rarity, this.crates[type][rarity][n], this.crates[type][rarity][n].split('_').reduce((a, c) => (a.concat(c.charAt(0).toUpperCase()+c.slice(1))), []).join(' ')];
      } catch(e) {alert(e)}
    }, i*delay);
    setTimeout(() => {
      Menus.menus.crate.reward = null;
      Menus.menus[Menus.current].addListeners();
      PixelTanks.save();
    }, a*delay);
    } catch(e) {alert(e)}
  }

  static hasKeybind = k => ['item1', 'item2', 'item3', 'item4', 'toolkit', 'grapple', 'boost', 'class', 'fire', 'powermissle', 'chat', 'pause'].find(v => PixelTanks.userData.keybinds[v] === k);

  static auth(u, p, t) { // simplify direct call to Network.auth
    Network.auth(u, p, t, () => PixelTanks.getData(() => PixelTanks.main()));
  }
  
  static main() {
    Menus.removeListeners();
    if (PixelTanks.user.player) PixelTanks.user.player.implode();
    Menus.trigger('main');
    //Menus.removeListeners();
    //if (PixelTanks.user.player) PixelTanks.user.player.implode();
    //PixelTanks.user.player = new Client(null, false, null);
  }

  static switchTab(id, n) {
    if (!Menus.menus.inventory.healthTab && !Menus.menus.inventory.classTab && !Menus.menus.inventory.itemTab && !Menus.menus.inventory.cosmeticTab) Menus.menus.inventory[id] = true;
    if (n && id === 'itemTab') Menus.menus.inventory.currentItem = n;
    if (n && id === 'cosmeticTab') Menus.menus.inventory.cosmeticType = n;
    if (n && id === 'perkTab') Menus.menus.inventory.currentPerk = n;
    Menus.menus.inventory.loaded = false;
    Menus.redraw();
  } // OPTIMIZE

  static upgrade() {
    const coins = PixelTanks.userData.stats[0], xp = PixelTanks.userData.stats[3], rank = PixelTanks.userData.stats[4];
    if (coins < (rank+1)*1000 || xp < (rank+1)*100) return alert('Your broke boi!');
    PixelTanks.userData.stats[0] -= (rank+1)*1000;
    PixelTanks.userData.stats[3] -= (rank+1)*100;
    PixelTanks.userData.stats[4]++;
    PixelTanks.save();
    alert('You Leveled Up to '+(rank+1));
  }

  static renderBottom(x, y, s, color, a=0) {
    GUI.draw.translate(x+40/80*s, y+40/80*s);
    GUI.draw.rotate(a*Math.PI/180);
    GUI.draw.fillStyle = color;
    GUI.draw.beginPath();
    GUI.draw.moveTo(-20/80*s, -32/80*s);
    GUI.draw.lineTo(20/80*s, -32/80*s);
    GUI.draw.lineTo(20/80*s, 32/80*s);
    GUI.draw.lineTo(-20/80*s, 32/80*s); 
    GUI.draw.lineTo(-20/80*s, -32/80*s);
    GUI.draw.fill();
    GUI.draw.rotate(-a*Math.PI/180);
    GUI.draw.translate(-x-40/80*s, -y-40/80*s);
  }

  static renderBase(x, y, s, color, a=0) {
    GUI.draw.translate(x+50/80*s, y+50/80*s);
    GUI.draw.rotate(a*Math.PI/180);
    GUI.draw.fillStyle = color;
    GUI.draw.beginPath();
    GUI.draw.moveTo(-40/80*s, -50/80*s);
    GUI.draw.lineTo(20/80*s, -50/80*s);
    GUI.draw.lineTo(30/80*s, -40/80*s);
    GUI.draw.lineTo(30/80*s, 20/80*s);
    GUI.draw.lineTo(20/80*s, 30/80*s);
    GUI.draw.lineTo(-40/80*s, 30/80*s);
    GUI.draw.lineTo(-50/80*s, 20/80*s); 
    GUI.draw.lineTo(-50/80*s, -40/80*s);
    GUI.draw.lineTo(-40/80*s, -50/80*s);
    GUI.draw.fill();
    GUI.draw.rotate(-a*Math.PI/180);
    GUI.draw.translate(-x-50/80*s, -y-50/80*s);
  }

  static renderTop(x, y, s, color, a=0, p=0) {
    GUI.draw.translate(x+40/80*s, y+40/80*s);
    GUI.draw.rotate(a*Math.PI/180);
    GUI.draw.fillStyle = color;
    GUI.draw.beginPath();
    GUI.draw.moveTo(-11/80*s, p+48/80*s);
    GUI.draw.lineTo(-11/80*s, p+28/80*s);
    GUI.draw.lineTo(-16/80*s, p+28/80*s);
    GUI.draw.lineTo(-27/80*s, p+17/80*s);
    GUI.draw.lineTo(-27/80*s, p-16/80*s);
    GUI.draw.lineTo(-16/80*s, p-27/80*s);
    GUI.draw.lineTo(17/80*s, p-27/80*s);
    GUI.draw.lineTo(28/80*s, p-16/80*s);
    GUI.draw.lineTo(28/80*s, p+17/80*s);
    GUI.draw.lineTo(17/80*s, p+28/80*s);
    GUI.draw.lineTo(12/80*s, p+28/80*s);
    GUI.draw.lineTo(12/80*s, p+48/80*s);
    GUI.draw.lineTo(-11/80*s, p+48/80*s);
    GUI.draw.fill();
    GUI.draw.rotate(-a*Math.PI/180);
    GUI.draw.translate(-x-40/80*s, -y-40/80*s);
  }

  static purchase(type, stat) {
    if (type === 0) { // classes
      const prices = [
        70000, // tactical
        30000, // stealth
        80000, // warrior
        40000, // medic
        60000, // builder
        90000, // fire
      ];
      if (PixelTanks.userData.classes[stat]) return alert('You already bought this.');
      if (PixelTanks.userData.stats[0] < prices[stat]) return alert('Your brok boi.');
      PixelTanks.userData.stats[0] -= prices[stat];
      PixelTanks.userData.classes[stat] = true;
    } else if (type === 1) {
      const levelRequirements = [2, 4, 6, 8, 10, 12, 14, 16, 18];
      const prices = [5000, 10000, 15000];
      const key = [2, 3, 3, 3, 2, 2, 3, 3, 3];
      let i = stat, l = 0, o = 0;
      while (i >= 0) {
        if (i <= key[l]) {
          o = i;
          break;
        }
        i -= key[l];
        l++;
      }
      alert('perk='+l+' level='+o);
      let perk = PixelTanks.userData.perks[l];
      if (o <= perk) return alert('You already bought this.');
      if (PixelTanks.userData.stats[4] < levelRequirements[l]) return alert('You need to be rank '+levelRequirements[l]+' to buy this!');
      if (PixelTanks.userData.stats[0] < prices[o-1]) return alert('Your brok boi.');
      PixelTanks.userData.stats[0] -= prices[o-1];
      PixelTanks.userData.perks[l] = o;
    }
  }
}
