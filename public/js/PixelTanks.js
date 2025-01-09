class PixelTanks {
  static loadMessages = ['Recharging Instas...', 'Summoning Turrets...', 'Sorting Cosmetics...', 'Spotting Stealths...', 'Putting Out Fires...', 'Generating Levels...', 'Loading Up Crates...', 'Filling Up Stocks...', 'Drawing Menus...', 'Placing Blocks...', 'Launching Missles...', 'Booting Game Engine...'];
  static levelCoords = [[116, 248], [356, 204], [596, 260], [839, 240], [1056, 204], [1272, 272], [1340, 400], [1212, 536], [964, 516], [732, 560], [508, 528], [284, 480], [64, 548], [36, 676], [148, 804], [384, 844], [624, 788], [864, 808], [1100, 848], [1336, 808]];
  static start() {
    PixelTanks.setup();
    PixelTanks.boot();
  }
  
  static setup() {
    document.body.innerHTML += `
    <button id='pack' onclick='PixelTanks.loadTexturePack(prompt("Config URL:"))'>Load Texturepack</button>
    <style>
      #pack {
        position: absolute;
        top: 0;
        right: 0;
      }
      html, body {
        margin: 0;
        padding: 0;
        text-align: center;
        background-color: black;
      }
      canvas {
        display: inline;
        height: 100%;
        width: calc(100vh*1.6);
      }
      @font-face {
        font-family: 'Font';
        src: url('https://aaronmgodfrey.github.io/Pixel-Tanks/public/fonts/PixelOperator.ttf') format('truetype');
      }
      * {
        font-family: Font;
      }
      input {
        position: absolute;
        background: transparent;
        border: none;
        font-size: 6vh;
      }
      .expand:hover {
        transform: scale(1.2);
      }
    </style>`;
    Menus.scaler = document.createElement('CANVAS');
    GUI.canvas = document.createElement('CANVAS');
    document.body.appendChild(GUI.canvas);
    GUI.draw = GUI.canvas.getContext('2d');
    GUI.draw.imageSmoothingEnabled = false;
    GUI.canvas.height = 1000;
    GUI.canvas.width = 1600;
    window.oncontextmenu = () => false;
    window.addEventListener('blur', e => (PixelTanks.focused = false));
    window.addEventListener('resize', e => { // TEMP move to GUI as static function
      for (const menu in Menus.menus) Menus.menus[menu].adapt();
      if (PixelTanks.user.player) PixelTanks.user.player.resize();
    });
    window.addEventListener('focus', e => {
      if (!PixelTanks.focused && PixelTanks.user.player) {
        if (PixelTanks.user.player.dx) PixelTanks.user.player.dx.t = Date.now();
        if (PixelTanks.user.player.dy) PixelTanks.user.player.dy.t = Date.now();
      }
      PixelTanks.focused = true;
    });
    const ui = e => {
      if (Client.input && Client.input.style.visibility === 'visible') return true;
      e.preventDefault();
      return false;
    };
    let tickspeed, old = Date.now(), getTickspeed = () => {
      PixelTanks.tickspeed = tickspeed = Date.now()-old;
      old = Date.now();
      setTimeout(() => getTickspeed());
    }
    getTickspeed();  
    window.addEventListener('selectstart', ui);
    window.addEventListener('dragstart', ui);
    window.addEventListener('mousemove', Menus.mouseLog);
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

  static renderCosmetic(i, x, y, w, h, r) { // usage: PixelTanks.renderCosmetic(image, x, y, width, height, rotation);
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
      Menus.menus = {
        start: {
          buttons: [
            [544, 648, 216, 116, () => PixelTanks.auth(Menus.menus.start.username.value, Menus.menus.start.password.value, 'login'), true],
            [840, 648, 216, 116, () => PixelTanks.auth(Menus.menus.start.username.value, Menus.menus.start.password.value, 'signup'), true],
          ],
          listeners: {
            keydown: function(e) {
              if (e.keyCode === 13) PixelTanks.auth(this.username.value, this.password.value, 'login');
            }
          },
        cdraw: function() {
          if (!this.username) {
            this.username = document.createElement('INPUT');
            this.password = document.createElement('INPUT');
            const left = (window.innerWidth-window.innerHeight*1.6)/2+.564*window.innerHeight;
            this.username.x = this.password.x = 564;
            this.username.w = this.password.w = 456;
            this.username.h = this.password.h = 80;
            this.username.y = 392;
            this.password.y = 520;
            this.username.style = 'top: '+(.392*window.innerHeight)+'px; left: '+left+'px; width: '+(window.innerHeight*.456)+'px; height: '+(window.innerHeight*.08)+'px;';
            this.password.style = 'top: '+(.520*window.innerHeight)+'px; left: '+left+'px; width: '+(window.innerHeight*.456)+'px; height: '+(window.innerHeight*.08)+'px;';
            this.username.type = this.username.autocomplete = 'username';
            this.password.type = 'password';
            this.password.autocomplete = 'current-password';
            this.password.maxLength = (this.username.maxLength = 20)*5;
            document.body.appendChild(this.username);
            document.body.appendChild(this.password);
            this.elements.push(this.username, this.password);
          }
        },
      },
      main: {
        buttons: [
          [972, 840, 88, 88, 'settings', true],
          [532, 616, 536, 136, 'multiplayer', true],
          [648, 840, 88, 88, 'shop', true],
          [540, 840, 88, 88, 'inventory', true],
          [756, 840, 88, 88, 'crate', true],
          [532, 392, 536, 136, 'world1', true],
        ],
        listeners: {
          keydown: function(e) {
            if (e.keyCode === 37) PixelTanks.userData.banner = (PixelTanks.images.banners.banners.length+PixelTanks.userData.banner-1)%PixelTanks.images.banners.banners.length; else if (e.keyCode === 39) PixelTanks.userData.banner = (PixelTanks.userData.banner+1)%PixelTanks.images.banners.banners.length;
          } // BANNERS SWAP
        },
        cdraw: function() {
          if (!PixelTanks.userData.banner) PixelTanks.userData.banner = 0; // TEMP BANNERS DB LINKER
          if (!PixelTanks.userData.perks) PixelTanks.userData.perks = [false, false, false, false, false, false, false, false, false];
          if (!PixelTanks.userData.perk) PixelTanks.userData.perk = [0, 0];
          const i = PixelTanks.images.banners[PixelTanks.images.banners.banners[PixelTanks.userData.banner]];
          GUI.drawImage(i, 20, 500-120*2.5, 300, 600, 1); // BANNERS GUI
          GUI.drawText(PixelTanks.userData.banner, 20, 900, 100, '#ffffff', 0.5);
          GUI.drawText(PixelTanks.images.banners.banners[PixelTanks.userData.banner], 20, 950, 50, '#ffffff', 0.5);
          GUI.drawText(PixelTanks.user.username, 1280, 800, 100, '#ffffff', 0.5);
          PixelTanks.renderBottom(1200, 600, 160, PixelTanks.userData.color);
          GUI.drawImage(PixelTanks.images.tanks.bottom, 1200, 600, 160, 160, 1);
          PixelTanks.renderTop(1200, 600, 160, PixelTanks.userData.color);
          GUI.drawImage(PixelTanks.images.tanks.top, 1200, 600, 160, 180, 1);
          PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_body], 1200, 600, 160, 180, 1);
          PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 1200, 600, 160, 180, 1);
          PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_hat], 1200, 600, 160, 180, 1);
        },
      },
      world1: {
        buttons: [[416, 20, 108, 108, 'main', true], [1068, 20, 108, 108, 'world2', true]],
        listeners: {
          mousedown: function(e) {
            for (const c of PixelTanks.levelCoords) if (Engine.collision(Menus.x, Menus.y, 0, 0, c[0], c[1], 200, 100)) {
              Menus.removeListeners();
              PixelTanks.user.player = new Client(PixelTanks.levelCoords.indexOf(c)+1, false, null);
            }
          }
        },
      },
      world2: {
        buttons: [[416, 20, 108, 108, 'world1', true], [1068, 20, 108, 108, 'world3', true]],
        listeners: {
          mousedown: function(e) {
            for (const c of PixelTanks.levelCoords) if (Engine.collision(Menus.x, Menus.y, 0, 0, c[0], c[1], 200, 100)) {
              Menus.removeListeners();
              PixelTanks.user.player = new Client(PixelTanks.levelCoords.indexOf(c)+21, false, null);
            }
          }
        },
      },
      world3: {
        buttons: [[416, 20, 108, 108, 'world2', true], [1068, 20, 108, 108, 'world4', true]],
        listeners: {
          mousedown: function(e) {
            for (const c of PixelTanks.levelCoords) if (Engine.collision(Menus.x, Menus.y, 0, 0, c[0], c[1], 200, 100)) {
              Menus.removeListeners();
              PixelTanks.user.player = new Client(PixelTanks.levelCoords.indexOf(c)+41, false, null);
            }
          }
        },
      },
      world4: {
        buttons: [[416, 20, 108, 108, 'world3', true], [1068, 20, 108, 108, 'world5', true]],
        listeners: {
          mousedown: function(e) {
            for (const c of PixelTanks.levelCoords) if (Engine.collision(Menus.x, Menus.y, 0, 0, c[0], c[1], 200, 100)) {
              Menus.removeListeners();
              PixelTanks.user.player = new Client(PixelTanks.levelCoords.indexOf(c)+61, false, null);
            }
          }
        },
      },
      world5: {
        buttons: [[416, 20, 108, 108, 'world4', true], [1068, 20, 108, 108, 'world1', true]],
        listeners: {
          mousedown: function(e) {
            for (const c of PixelTanks.levelCoords) if (Engine.collision(Menus.x, Menus.y, 0, 0, c[0], c[1], 200, 100)) {
              Menus.removeListeners();
              PixelTanks.user.player = new Client(PixelTanks.levelCoords.indexOf(c)+81, false, null);
            }
          }
        },
      },
      victory: {
        buttons: [
          [656, 603, 313, 112, () => Menus.trigger('main'), true],
          [558, 726, 505, 114, () => alert('no'), true],
        ],
      },
      defeat: {
        buttons: [
          [656, 603, 313, 112, () => Menus.trigger('main'), true],
          [558, 726, 505, 114, () => alert('no'), true],
        ],
      },
      multiplayer: {
        buttons: [
          [424, 28, 108, 108, 'main'],
          [340, 376, 416, 116, () => (Menus.menus.multiplayer.gamemode = 'ffa'), true],
          [340, 532, 416, 116, () => (Menus.menus.multiplayer.gamemode = 'duels'), true],
          [340, 688, 416, 116, () => (Menus.menus.multiplayer.gamemode = 'tdm'), true],
          [340, 844, 416, 116, () => (Menus.menus.multiplayer.gamemode = 'defense'), true],
          [868, 848, 368, 88, () => {
            PixelTanks.user.player = new Client(Menus.menus.multiplayer.ip, true, Menus.menus.multiplayer.gamemode);
            Menus.removeListeners();
          }, true],
        ],
        listeners: {
          keydown: function(e) {
            if (e.key.length === 1) {
              this.ip += e.key;
            } else if (e.keyCode === 8) {
              this.ip = this.ip.slice(0, -1);
            } else if (e.keyCode !== -1) return;
            /*this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://')+this.ip, {keepAlive: false, reconnect: true, autoconnect: true});
            this.socket.on('connect', () => {
              this.socket.send({username: PixelTanks.user.username, type: 'stats'});
            });
            this.socket.on('message', (d) => {
              this.output = d;
            });*/
          }
        },
        cdraw: function() {
          if (!this.gamemode) {
            this.gamemode = 'ffa';
            this.output = {FFA: '', DUELS: '', TDM: ''};
            this.ip = '129.146.45.71:8080';
            this.listeners.keydown({keyCode: -1, key: ''});
          }
          GUI.drawText(this.gamemode, 1200, 800, 50, '#FFFFFF', 0.5);
          GUI.drawText(this.ip, 800, 276, 50, '#FFFFFF', 0.5);
          GUI.drawText(this.output.FFA.length, 820, 434, 50, '#FFFFFF', 0.5);
          GUI.drawText(this.output.DUELS.length, 820, 590, 50, '#FFFFFF', 0.5);
          GUI.drawText(this.output.TDM.length, 820, 764, 50, '#FFFFFF', 0.5);
          let offset = 0;
          for (const server of this.output[this.gamemode.toUpperCase()]) {
            if (server !== null) for (const player of server) {
              GUI.drawText(player, 880, 400+40*offset, 50, '#FFFFFF', 0);
              offset++;
            }
          }
        }
      },
      crate: {
        buttons: [
          [416, 20, 108, 108, 'main', true],
          [232, 308, 488, 488, () => PixelTanks.openCrate(0, cosmetAmount), false],
          [880, 308, 488, 488, () => PixelTanks.openCrate(1, deathAmount), false],
          [300, 816, 104, 52, () => (cosmetAmount = 1), false],
          [424, 816, 104, 52, () => (cosmetAmount = 10), false],
          [548, 816, 104, 52, () => (cosmetAmount = 100), false],
          [948, 816, 104, 52, () => (deathAmount = 1), false],
          [1072, 816, 104, 52, () => (deathAmount = 10), false],
          [1196, 816, 104, 52, () => (deathAmount = 100), false],
        ],
        cdraw: function() {
          GUI.drawText('Crates: ' + PixelTanks.userData.stats[1], 800, 260, 30, '#ffffff', 0.5);
          GUI.draw.globalAlpha = 1;
          GUI.draw.strokeStyle = '#FFFF00';
          GUI.draw.lineWidth = 10;
          if (cosmetAmount === 1) GUI.draw.strokeRect(300, 816, 104, 52);
          if (cosmetAmount === 10) GUI.draw.strokeRect(424, 816, 104, 52);
          if (cosmetAmount === 100) GUI.draw.strokeRect(548, 816, 104, 52);
          if (deathAmount === 1) GUI.draw.strokeRect(948, 816, 104, 52);
          if (deathAmount === 10) GUI.draw.strokeRect(1072, 816, 104, 52);
          if (deathAmount === 100) GUI.draw.strokeRect(1196, 816, 104, 52);
        }
      },
      settings: {
        buttons: [[416, 20, 108, 108, 'main', true]],
        listeners: {
          mousedown: function(e) {
            const key = {item1: [165, 404], item2: [381, 404], item3: [597, 404], item4: [827, 404], toolkit: [1043, 404], grapple: [1259, 404], boost: [165, 620], class: [381, 620], fire: [597, 620], powermissle: [827, 620], chat: [1043, 620], pause: [1259, 620]};
            for (const p in key) if (Menus.x > key[p][0] && Menus.x < key[p][0]+176 && Menus.y > key[p][1] && Menus.y < key[p][1]+176) {
              if (Menus.menus.settings.selected === p) {
                if (!PixelTanks.hasKeybind(1000+e.button)) PixelTanks.userData.keybinds[this.selected] = 1000+e.button; // mouse handler
                return PixelTanks.save();
              } else return Menus.menus.settings.selected = p;
            }
          },
          keydown: function(e) {
            if (!PixelTanks.hasKeybind(e.keyCode)) PixelTanks.userData.keybinds[this.selected] = e.keyCode; else alert('Imagine being so lazy you only hit 1 key to win');
            PixelTanks.save();
          }
        },
        cdraw: function() {
          const key = {item1: [165, 404], item2: [381, 404], item3: [597, 404], item4: [827, 404], toolkit: [1043, 404], grapple: [1259, 404], boost: [165, 620], class: [381, 620], fire: [597, 620], powermissle: [827, 620], chat: [1043, 620], pause: [1259, 620]};
          GUI.draw.fillStyle = '#A9A9A9'; // change selection  later?
          GUI.draw.lineWidth = 30; // border thickness
          for (const p in key) {
            if (this.selected === p) GUI.draw.strokeRect(key[p][0], key[p][1], 176, 176);
            GUI.drawText(String.fromCharCode(PixelTanks.userData.keybinds[p]), key[p][0]+88, key[p][1]+88, 50, '#ffffff', .5);
          }
        },
      },
      inventory: {
        buttons: [
          [416, 20, 108, 108, 'main', true],
          [1064, 460, 88, 88, PixelTanks.upgrade, true],
          [1112, 816, 88, 88, () => PixelTanks.switchTab('classTab'), false],
          [400, 816, 88, 88, () => PixelTanks.switchTab('itemTab', 1), false],
          [488, 816, 88, 88, () => PixelTanks.switchTab('itemTab', 2), false],
          [576, 816, 88, 88, () => PixelTanks.switchTab('itemTab', 3), false],
          [664, 816, 88, 88, () => PixelTanks.switchTab('itemTab', 4), false],
          [448, 360, 88, 88, () => PixelTanks.switchTab('cosmeticTab', 'cosmetic_hat'), false],
          [448, 460, 88, 88, () => PixelTanks.switchTab('cosmeticTab', 'cosmetic'), false],
          [448, 560, 88, 88, () => PixelTanks.switchTab('cosmeticTab', 'cosmetic_body'), false],
          [448, 220, 88, 88, () => PixelTanks.switchTab('deathEffectsTab'), false],
          [844, 816, 88, 88, () => PixelTanks.switchTab('perkTab', 1), false],
          [932, 816, 88, 88, () => PixelTanks.switchTab('perkTab', 2), false],
        ],
        listeners: {
          mousedown: function(e) {
            const {x, y} = Menus;
            if (this.classTab) {
              if (x < 688 || x > 912 || y < 334 || y > 666) return this.classTab = this.loaded = false;
              for (let i = 0, key = [[[0, 5, 3], [1, 4, 2]][i%2][Math.floor(i/3)]], c = ['tactical', 'stealth', 'warrior', 'medic', 'builder', 'fire'][key]; i < 6; i++) {
                if (!PixelTanks.userData.classes[key] || !Engine.collision(x, y, 0, 0, [702, 819][i%2], [348, 456, 564][Math.floor(i/3)], 88, 88)) continue;
                PixelTanks.userData.class = PixelTanks.userData.class === c ? null : c;
                return this.loaded = false;
              }
            } else if (this.itemTab) {
              if (x < 580 || x > 1020 || y < 334 || y > 666) return this.itemTab = this.loaded = false;
              const key = {airstrike: [598, 352], super_glu: [706, 352], duck_tape: [814, 352], shield: [922, 352], flashbang: [598, 460], bomb: [706, 460], dynamite: [814, 460], usb: [922, 460], weak: [598, 568], strong: [706, 568], spike: [814, 568], reflector: [922, 568]};
              for (const item in key) {
                if (Engine.collision(x, y, 0, 0, key[item][0], key[item][1], 80, 80)) {
                  if (!PixelTanks.userData.items.includes(item) || PixelTanks.userData.items[this.currentItem-1] === item) {
                    const lastItem = PixelTanks.userData.items[this.currentItem-1];
                    PixelTanks.userData.items[this.currentItem-1] = item;
                    this.loaded = false;
                    if (item === lastItem) {
                      PixelTanks.userData.items[this.currentItem-1] = 'undefined';
                    }
                  } else alert('You are not allowed to have more than 1 of the same item');
                  return;
                }
              }
            } else if (this.perkTab) {
              if (x < 634 || x > 966 || y < 334 || y > 666) return this.perkTab = this.loaded = false;
              for (let i = 0, p = this.currentPerk-1; i < 9; i++) {
                if (!PixelTanks.userData.perks[i] || !Engine.collision(x, y, 0, 0, [652, 760, 868][i%3], [352, 460, 568][Math.floor(i/3)], 80, 80)) continue;
                PixelTanks.userData.perk[p] = Math.floor(PixelTanks.userData.perk[p]) === i+1 ? null : i+1+PixelTanks.userData.perks[i]/10;
                return this.loaded = false;
              }  
            } else if (this.cosmeticTab) {
              if (x < 518 || x > 1082 || y < 280 || y > 720) return this.cosmeticTab = this.loaded = false;
              for (let i = 0; i < 16; i++) {
                if (Engine.collision(x, y, 0, 0, 598+(i%4)*108, 298+Math.floor(i/4)*108, 88, 88)) {
                  if (e.button === 0) {
                    let co = PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i].split('#')[0]
                    PixelTanks.userData[Menus.menus.inventory.cosmeticType] = PixelTanks.userData[Menus.menus.inventory.cosmeticType] === co ? '' : co;
                    this.loaded = false;
                  } else {
                    const [cosmetic, amount] = PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i].split('#');
                    if (amount === undefined || Number(amount) <= 1) return PixelTanks.userData.cosmetics.splice(this.cosmeticMenu*16+i, 1);
                    PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i] = cosmetic+'#'+(Number(amount)-1);
                    this.loaded = false;
                  }
                  return;
                }
              }
            } else if (this.deathEffectsTab) {
              if (x < 518 || x > 1082 || y < 280 || y > 720) return this.deathEffectsTab = this.loaded = false;
              for (let i = 0; i < 16; i++) {
                if (Engine.collision(x, y, 0, 0, 598+(i%4)*108, 298+Math.floor(i/4)*108, 88, 88)) {
                  if (e.button === 0) {
                    let de = PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i].split('#')[0];
                    PixelTanks.userData.deathEffect = PixelTanks.userData.deathEffect === de ? '' : de;
                  } else {
                    const [deathEffect, amount] = PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i].split('#');
                    if (amount === undefined || Number(amount) <= 1) return PixelTanks.userData.deathEffects.splice(this.deathEffectsMenu*16+i, 1);
                    const lastDeath = PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i];
                    PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i] = deathEffect+'#'+(Number(amount)-1);
                    this.loaded = false;
                    if (PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i] === lastDeath) {
                        PixelTanks.userData.deathEffect = 'undefined';
                        this.loaded = false;
                      }
                    }
                  return;
                }
              }
            }
          },
          mousemove: function(e) {
            this.target = {x: e.clientX-window.innerWidth/2, y: e.clientY-window.innerHeight/2};
          },
          keydown: function(e) {
            if (e.key.length === 1 && this.color.length < 7) {
              this.color += e.key;
              PixelTanks.userData.color = this.color;
            }
            if (e.keyCode === 8) this.color = this.color.slice(0, -1);
            if (this.cosmeticTab) {
              if (e.keyCode === 37 && this.cosmeticMenu > 0) this.cosmeticMenu--;
              if (e.keyCode === 39 && this.cosmeticMenu+1 !== Math.ceil(PixelTanks.userData.cosmetics.length/16)) this.cosmeticMenu++;
            }
            if (this.deathEffectsTab) {
              if (e.keyCode === 37 && this.deathEffectsMenu > 0) this.deathEffectsMenu--;
              if (e.keyCode === 39 && this.deathEffectsMenu+1 !== Math.ceil(PixelTanks.userData.deathEffects.length/16)) this.deathEffectsMenu++;
            }
          }
        },
        cdraw: function() {
          if (!this.target) {
            this.time = Date.now();
            this.color = PixelTanks.userData.color;
            this.target = {x: 0, y: 0}; // use Menus.x/y
            this.cosmeticMenu = this.deathEffectsMenu = 0;
            this.colorInput = document.createElement('INPUT');
            const left = (window.innerWidth-window.innerHeight*1.6)/2+.564*window.innerHeight;
            this.colorInput.x = 564;
            this.colorInput.y = 392;
            this.colorInput.w = 456;
            this.colorInput.h = 80;
            this.colorInput.style = 'top: '+(.392*window.innerHeight)+'px; left: '+left+'px; width: '+(window.innerHeight*.456)+'px; height: '+(window.innerHeight*.08)+'px;';
            document.body.appendChild(this.colorInput);
            this.elements.push(this.colorInput);
          }
          const coins = PixelTanks.userData.stats[0], xp = PixelTanks.userData.stats[3], rank = PixelTanks.userData.stats[4];
          const coinsUP = (rank+1)*1000, xpUP = (rank+1)*100;
          GUI.draw.fillStyle = this.color;
          GUI.draw.fillRect(1008, 260, 32, 32);
          GUI.drawText(this.color, 1052, 260, 30, '#000000', 0);
          GUI.drawText(PixelTanks.user.username, 280, 420, 80, '#000000', .5);
          GUI.drawText('Coins: '+coins, 280, 500, 50, '#FFE900', .5);
          GUI.drawText('Rank: '+rank, 280, 550, 50, '#FF2400', .5);
          GUI.drawText('Level Up Progress', 1400, 400, 50, '#000000', .5);
          GUI.drawText((rank < 20 ? coins+'/'+coinsUP : 'MAXED')+' Coins', 1400, 500, 50, rank < 20 ? (coins < coinsUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
          GUI.drawText((rank < 20 ? xp+'/'+xpUP : 'MAXED')+' XP', 1400, 550, 50, rank < 20 ? (xp < xpUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
          if (coins < coinsUP || xp < xpUP || rank > 19) {
            GUI.draw.fillStyle = '#000000';
            GUI.draw.globalAlpha = .7;
            GUI.draw.fillRect(1064, 458, 88, 88);
            GUI.draw.globalAlpha = 1;
          }
          for (let i = 0; i < 4; i++) {
            if (PixelTanks.userData.items[i] !== 'undefined') GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.items[i]], [404, 492, 580, 668][i], 820, 80, 80, 1);
            if (PixelTanks.userData.items[i] === 'undefined') GUI.drawImage(PixelTanks.images.menus.broke, [404, 492, 580, 668][i], 820, 80, 80, 1);
          }
          let perkKey = [0, 'shield', 'thermal', 'scavenger', 'cooldown', 'refresh', 'radar', 'upgrader', 'adrenaline', 'core'];
          if (PixelTanks.userData.perk[0] && (PixelTanks.userData.perk[0] !== 'undefined')) GUI.drawImage(PixelTanks.images.menus[perkKey[Math.floor(PixelTanks.userData.perk[0])]], 844, 816, 88, 88, 1, 0, 0, 0, 0, undefined, ((PixelTanks.userData.perk[0]%1)*10-1)*40, 0, 40, 40); else GUI.drawImage(PixelTanks.images.menus.broke, 844, 816, 88, 88, 1);
          if (PixelTanks.userData.perk[1] && (PixelTanks.userData.perk[1] !== 'undefined')) GUI.drawImage(PixelTanks.images.menus[perkKey[Math.floor(PixelTanks.userData.perk[1])]], 932, 816, 88, 88, 1, 0, 0, 0, 0, undefined, ((PixelTanks.userData.perk[1]%1)*10-1)*40, 0, 40, 40); else GUI.drawImage(PixelTanks.images.menus.broke, 932, 816, 88, 88, 1);
          PixelTanks.renderBottom(680, 380, 240, PixelTanks.userData.color);
          GUI.drawImage(PixelTanks.images.tanks.bottom, 680, 380, 240, 240, 1);
          PixelTanks.renderTop(680, 380, 240, PixelTanks.userData.color, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          GUI.drawImage(PixelTanks.images.tanks.top, 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          if (PixelTanks.userData.cosmetic_body !== 'undefined') PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_body], 680, 380, 240, 270, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          if (PixelTanks.userData.cosmetic !== 'undefined') PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 680, 380, 240, 270, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          if (PixelTanks.userData.cosmetic_hat !== 'undefined') PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_hat], 680, 380, 240, 270, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          const key = {tactical: [7, 7], fire: [7, 61], medic: [7, 115], stealth: [61, 7], builder: [61, 61], warrior: [61, 115]};
          if (!PixelTanks.userData.class) PixelTanks.userData.class = 'undefined';
          if (PixelTanks.userData.classes && PixelTanks.userData.class && PixelTanks.userData.class !== 'undefined') GUI.drawImage(PixelTanks.images.menus.classTab, 1112, 816, 88, 88, 1, 0, 0, 0, 0, undefined, key[PixelTanks.userData.class][0]*4, key[PixelTanks.userData.class][1]*4, 176, 176); else GUI.drawImage(PixelTanks.images.menus.broke, 1112, 816, 88, 88, 1);
          if (PixelTanks.userData.cosmetic_hat && PixelTanks.userData.cosmetic_hat !== 'undefined') PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_hat], 448, 360, 88, 88, 0); else GUI.drawImage(PixelTanks.images.menus.broke, 448, 360, 88, 88, 1);
          if (PixelTanks.userData.cosmetic && PixelTanks.userData.cosmetic !== 'undefined') PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 448, 460, 88, 88, 0); else GUI.drawImage(PixelTanks.images.menus.broke, 448, 460, 88, 88, 1);
          if (PixelTanks.userData.cosmetic_body && PixelTanks.userData.cosmetic_body !== 'undefined') PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_body], 448, 560, 88, 88, 0); else GUI.drawImage(PixelTanks.images.menus.broke, 448, 560, 88, 88, 1);
          const deathEffectData = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect+'_'];
          if (PixelTanks.userData.deathEffect && deathEffectData) GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect], 448, 220, 88, 88, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-this.time)/deathEffectData.speed)%deathEffectData.frames)*200, 0, 200, 200);
          if (!(PixelTanks.userData.deathEffect && deathEffectData)) GUI.drawImage(PixelTanks.images.menus.broke, 448, 220, 88, 88, 1);
          Menus.menus.inventory.buttonEffect = true;
          if (this.perkTab || this.healthTab || this.classTab || this.itemTab || this.cosmeticTab || this.deathEffectsTab) {
            Menus.menus.inventory.buttonEffect = false;
            GUI.drawImage(PixelTanks.images.blocks.battlegrounds.void, 0, 0, 1600, 1600, .7);
          }
          if (this.classTab) {
            GUI.drawImage(PixelTanks.images.menus.classTab, 688, 334, 224, 332, 1);
            const classX = [701, 810, 810, 701, 810, 701];
            const classY = [348, 348, 564, 564, 456, 456];
            for (let i = 0; i < 6; i++) {
              if (!PixelTanks.userData.classes[i]) GUI.drawImage(PixelTanks.images.menus.locked, classX[i], classY[i], 88, 88, 1);
            }
            if (PixelTanks.userData.class !== 'undefined') {
              GUI.draw.strokeStyle = '#FFFF00';
              GUI.draw.lineWidth = 10;
              if (PixelTanks.userData.class === 'tactical') GUI.draw.strokeRect(701, 348, 88, 88); else if (PixelTanks.userData.class === 'fire') GUI.draw.strokeRect(701, 456, 88, 88); else if (PixelTanks.userData.class === 'medic') GUI.draw.strokeRect(701, 565, 88, 88); else if (PixelTanks.userData.class === 'stealth') GUI.draw.strokeRect(814, 348, 88, 88); else if (PixelTanks.userData.class === 'builder') GUI.draw.strokeRect(814, 456, 88, 88); else if (PixelTanks.userData.class === 'warrior') GUI.draw.strokeRect(814, 565, 88, 88);
            }
          } else if (this.itemTab) {
            GUI.drawImage(PixelTanks.images.menus.itemTab, 580, 334, 440, 332, 1);
            const key = {airstrike: [598, 352], super_glu: [706, 352], duck_tape: [814, 352], shield: [922, 352], flashbang: [598, 460], bomb: [706, 460], dynamite: [814, 460], usb: [922, 460], weak: [598, 568], strong: [706, 568], spike: [814, 568], reflector: [922, 568]};
            for (const item in key) GUI.drawImage(PixelTanks.images.items[item], key[item][0], key[item][1], 80, 80, 1);
          } else if (this.perkTab) {
            GUI.drawImage(PixelTanks.images.menus.perkTab, 634, 334, 332, 332, 1); //166x2
            const perks = ['shield', 'thermal', 'scavenger', 'cooldown', 'refresh', 'radar', 'upgrader', 'adrenaline', 'core'];
            const x = [652, 760, 868];
            const y = [352, 460, 568];
            for (let i = 0; i < 9; i++) {
              let level = PixelTanks.userData.perks[i], lock = !level;
              if (lock) level = 1;
              let simple = PixelTanks.userData.perk.reduce((a, c) => a.concat(Math.floor(c)), []);
              if (simple.includes(i+1)) {
                GUI.draw.strokeStyle = '#FFFF66';
                GUI.draw.lineWidth = 10;
                GUI.draw.strokeRect(x[i%3], y[Math.floor(i/3)], 80, 80);
              }
              if (Math.floor(PixelTanks.userData.perk[Menus.menus.inventory.currentPerk-1]) === i+1) {
                GUI.draw.strokeStyle = '#FFFF22';
                GUI.draw.lineWidth = 10;
                GUI.draw.strokeRect(x[i%3], y[Math.floor(i/3)], 80, 80);
              }
              GUI.drawImage(PixelTanks.images.menus[perks[i]], x[i%3], y[Math.floor(i/3)], 80, 80, 1, 0, 0, 0, 0, undefined, (level-1)*40, 0, 40, 40);
              if (lock) GUI.drawImage(PixelTanks.images.menus.locked, x[i%3], y[Math.floor(i/3)], 80, 80, 1);
            } 
          } else if (this.cosmeticTab) {
            const a = this.cosmeticMenu === 0, b = this.cosmeticMenu === Math.floor(PixelTanks.userData.cosmetics.length/16);
            GUI.drawImage(PixelTanks.images.menus.cosmeticTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0)*4, 0, (282-(a ? 31 : 0)-(b ? 31 : 0))*4, 880);
            for (let i = this.cosmeticMenu*16; i < Math.min((this.cosmeticMenu+1)*16, PixelTanks.userData.cosmetics.length); i++) {
              try {
                PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetics[i].split('#')[0]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88, 0);
              } catch(e) {
                GUI.draw.fillStyle = '#FF0000';
                GUI.draw.fillRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88);
              }
              GUI.drawText(PixelTanks.userData.cosmetics[i].split('#')[1], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 30, '#FF0000', .5);
              if (PixelTanks.userData.cosmetics[i].split('#')[0] === PixelTanks.userData[Menus.menus.inventory.cosmeticType]) {
                GUI.draw.strokeStyle = '#FFFF22';
                GUI.draw.lineWidth = 10;
                GUI.draw.strokeRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88);
              }
            }
          } else if (this.deathEffectsTab) {
            const a = this.deathEffectsMenu === 0, b = this.deathEffectsMenu === Math.floor(PixelTanks.userData.deathEffects.length/16);
            GUI.drawImage(PixelTanks.images.menus.cosmeticTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0)*4, 0, (282-(a ? 31 : 0)-(b ? 31 : 0))*4, 880);
            for (let i = this.deathEffectsMenu*16; i < Math.min((this.deathEffectsMenu+1)*16, PixelTanks.userData.deathEffects.length); i++) {
              const d = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i].split('#')[0]+'_'];
              if (d) GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i].split('#')[0]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-this.time)/d.speed)%d.frames)*200, 0, 200, 200);
              GUI.drawText(PixelTanks.userData.deathEffects[i].split('#')[1], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 30, '#FF0000', .5);
              if (PixelTanks.userData.deathEffects[i].split('#')[0] === PixelTanks.userData.deathEffect) {
                GUI.draw.strokeStyle = 0xffff22;
                GUI.draw.lineWidth = 10;
                GUI.draw.strokeRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88);
              }
            }
          }
        },
      },
      shop: {
        buttons: [
          [416, 20, 108, 108, 'main', true],
          [880, 208, 488, 96, 'shop2', true],
          [326, 544, 194, 79, () => PixelTanks.purchase(0, 0), true],
          [792, 544, 194, 79, () => PixelTanks.purchase(0, 1), true],
          [1249, 544, 194, 79, () => PixelTanks.purchase(0, 4), true],
          [326, 873, 194, 79, () => PixelTanks.purchase(0, 2), true],
          [792, 873, 194, 79, () => PixelTanks.purchase(0, 5), true],
          [1249, 873, 194, 79, () => PixelTanks.purchase(0, 3), true],
        ],
        keydown: function(e) {if (e.keyCode === 27) Menus.trigger('main')},
        cdraw: function() {
          GUI.drawText(PixelTanks.userData.stats[0]+' coins', 800, 160, 50, 0x000000, 0.5);
        },
      },
      shop2: {
        buttons: [
          [416, 20, 108, 108, 'main', true],
          [232, 208, 488, 96, 'shop', true],
          //emergency cloak
          [60, 404, 136, 136, () => PixelTanks.purchase(1, 0), true],
          [60, 572, 136, 136, () => PixelTanks.purchase(1, 1), true],
          //thermal armor
          [228, 404, 136, 136, () => PixelTanks.purchase(1, 2), true],
          [228, 572, 136, 136, () => PixelTanks.purchase(1, 3), true],
          [228, 740, 136, 136, () => PixelTanks.purchase(1, 4), true],
          //scav
          [396, 404, 136, 136, () => PixelTanks.purchase(1, 5), true],
          [396, 572, 136, 136, () => PixelTanks.purchase(1, 6), true],
          [396, 740, 136, 136, () => PixelTanks.purchase(1, 7), true],
          //lower cd
          [564, 404, 136, 136, () => PixelTanks.purchase(1, 8), true],
          [564, 572, 136, 136, () => PixelTanks.purchase(1, 9), true],
          [564, 740, 136, 136, () => PixelTanks.purchase(1, 10), true],
          //relfect boost
          [732, 404, 136, 136, () => PixelTanks.purchase(1, 11), true],
          [732, 572, 136, 136, () => PixelTanks.purchase(1, 12), true],
          //double boost
          [900, 404, 136, 136, () => PixelTanks.purchase(1, 13), true],
          [900, 572, 136, 136, () => PixelTanks.purchase(1, 14), true],
          //gripple
          [1068, 404, 136, 136, () => PixelTanks.purchase(1, 15), true],
          [1068, 572, 136, 136, () => PixelTanks.purchase(1, 16), true],
          [1068, 740, 136, 136, () => PixelTanks.purchase(1, 17), true],
          //ai
          [1236, 404, 136, 136, () => PixelTanks.purchase(1, 18), true],
          [1236, 572, 136, 136, () => PixelTanks.purchase(1, 19), true],
          [1236, 740, 136, 136, () => PixelTanks.purchase(1, 20), true],
          //living
          [1404, 404, 136, 136, () => PixelTanks.purchase(1, 21), true],
          [1404, 572, 136, 136, () => PixelTanks.purchase(1, 22), true],
          [1404, 740, 136, 136, () => PixelTanks.purchase(1, 23), true],
        ],
        keydown: function(e) {if (e.keyCode === 27) Menus.trigger('main')},
        cdraw: function() {
          GUI.drawText(PixelTanks.userData.stats[0]+' coins', 800, 160, 50, 0x000000, 0.5);
        },
      },
      pause: {
        buttons: [
          [1218, 910, 368, 76, () => {
            Menus.softUntrigger('pause');
            PixelTanks.user.player.implode();
            PixelTanks.main();
          }, true],
        ],
        listeners: {
          keydown: e => {
            if (e.keyCode === 27) Menus.softUntrigger('pause');
          }
        },
      },
    }
      for (const m in Menus.menus) Menus.menus[m] = new Menu(Menus.menus[m], m);
    });
    PixelTanks.socket = new MegaSocket(window.location.protocol === 'https:' ? 'wss://'+window.location.hostname : 'ws://129.146.45.71', {keepAlive: true, reconnect: true, autoconnect: true});
  }

  static launch() {  
    setTimeout(() => {
      Menus.trigger('start');
      if (window.u && window.p) PixelTanks.auth(window.u, window.p, 'login');
    }, 200);
  }

  static save() {
    PixelTanks.playerData['pixel-tanks'] = PixelTanks.userData;
    Network.update('playerdata', JSON.stringify(PixelTanks.playerData));
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
        clearInterval(PixelTanks.autosave);
        PixelTanks.autosave = setInterval(() => PixelTanks.save(), 5000);
        callback();
      });
  }

  static openCrate(type, stuffAmount) {
    if (PixelTanks.userData.stats[1] < (type ? 5 : 1)*stuffAmount) return alert('Not Enough Crates');
    PixelTanks.userData.stats[1] -= (type ? 5 : 1)*stuffAmount; 
    let nimber = 100;
    if (stuffAmount === 1) nimber = 1000;
    if (stuffAmount === 10) nimber = 500;
    if (stuffAmount === 100) nimber = 100;
    let namber = -(nimber);
    for (let i = 0; i < stuffAmount; i++) {
      namber += nimber;
      setTimeout(() => {
        const price = type ? 5 : 1, name = type ? 'deathEffects' : 'cosmetics', rand = Math.floor(Math.random()*1001);
        let crate = PixelTanks.crates;
        let rarity = 'common'; // 70%
        if (rand < 300) rarity = 'uncommon'; // 15%
        if (rand < 150) rarity = 'rare'; // 10%
        if (rand < 50) rarity = 'epic'; // 4%
        if (rand < 10) rarity = 'legendary'; // .9%
        if (rand < 1) rarity = 'mythic'; // .1%
        let number = Math.floor(Math.random()*(crate[type][rarity].length)), item;
        for (const e in this.images[name]) if (e === crate[type][rarity][number]) item = this.images[name][e];
        if (item === undefined) return alert('Error while trying to give you cosmetic id "'+crate[type][rarity][number]+'"');
        Menus.removeListeners();
        const start = Date.now(), render = setInterval(function() {
          GUI.clear();
          if (type) GUI.drawImage(item, 600, 400, 400, 400, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-start)/PixelTanks.images[name][crate[type][rarity][number]+'_'].speed)%PixelTanks.images[name][crate[type][rarity][number]+'_'].frames)*200, 0, 200, 200);
          if (!type) GUI.drawImage(item, 600, 400, 400, 400, 1);
          GUI.drawText('You Got', 800, 200, 100, '#ffffff', 0.5);
          GUI.drawText(crate[type][rarity][number].split('_').reduce((a, c) => (a.concat(c.charAt(0).toUpperCase()+c.slice(1))), []).join(' '), 800, 800, 50, '#ffffff', 0.5);
          GUI.drawText(rarity, 800, 900, 30, {mythic: '#FF0000', legendary: '#FFFF00', epic: '#A020F0', rare: '#0000FF', uncommon: '#32CD32', common: '#FFFFFF'}[rarity], 0.5);
        }, 15); // use built in menus renderer instead?
        let done = false;
        for (const i in PixelTanks.userData[name]) {
          const [item, amount] = PixelTanks.userData[name][i].split('#');
          if (item === crate[type][rarity][number]) {
            done = true;
            PixelTanks.userData[name][i] = item+'#'+(Number(amount)+1);
          }
        }
        if (!done) PixelTanks.userData[name].unshift(crate[type][rarity][number]+'#1');
        setTimeout(() => {
          clearInterval(render);
          if (i+1 >= stuffAmount) Menus.trigger('crate');
          PixelTanks.save();
        }, (nimber)-20);
      }, namber);
    }
  }

  static hasKeybind = k => ['item1', 'item2', 'item3', 'item4', 'toolkit', 'grapple', 'boost', 'class', 'fire', 'powermissle', 'chat', 'pause'].some(v => PixelTanks.userData.keybinds[v] === k);

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
    if (coins < (rank+1)*1000 || xp < (rank+1)*100) return alert('Your  boi!');
    if (rank >= 20) return alert('You are max level!');
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
        i -= key[l];
        if (i >= 0) l++; else o = key[l]+i+1;
      }
      let perk = PixelTanks.userData.perks[l];
      if (o <= perk) return alert('You already bought this.');
      if (PixelTanks.userData.stats[4] < levelRequirements[l]) return alert('You need to be rank '+levelRequirements[l]+' to buy this!');
      if (PixelTanks.userData.stats[0] < prices[o-1]) return alert('Your brok boi.');
      PixelTanks.userData.stats[0] -= prices[o-1];
      PixelTanks.userData.perks[l] = o;
    }
  }
}
