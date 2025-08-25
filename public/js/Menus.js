class Menus {
  static start = () => (Menus.renderer = requestAnimationFrame(Menus.render));
  static stop = () => (Menus.renderer = cancelAnimationFrame(Menus.renderer));
  static render = () => Menus.start() && Menus.redraw();
  static mouseLog = e => {
    Menus.x = (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)/window.innerHeight*1000;
    Menus.y = e.clientY/window.innerHeight*1000; // maybe move to PixelTanks.x and PixelTanks.y??
  }
  static trigger(name) {
    if (Menus.current) Menus.menus[Menus.current].removeListeners();
    if (PixelTanks.sounds.menu.paused && name !== 'start') PixelTanks.playSound('menu', 0);
    if (!Menus.renderer) Menus.start();
    (Menus.menu = Menus.menus[Menus.current = name]).addListeners();
    Menus.menu.ontrigger();
  }
  static softTrigger(name) {
    for (const b of Menus.menus[PixelTanks.user.player.menu = name].elements) b.style.visibility = 'visible';
    Menus.menus[name].ontrigger();
  }
  static softUntrigger() {
    for (const b of Menus.menus[PixelTanks.user.player.menu].elements) b.style.visibility = 'hidden';
    PixelTanks.user.player.menu = false;
  }
  static redraw() {
    GUI.clear();
    if (Menus.current) Menus.menus[Menus.current].draw();
  }
  static removeListeners() {
    Menus.stop();
    Menus.menus[Menus.current].removeListeners();
  }
  static menus = {
    start: {
      buttons: [[544, 648, 216, 116, () => PixelTanks.auth(Menus.menus.start.username.value, Menus.menus.start.password.value, 'login'), true], [840, 648, 216, 116, () => PixelTanks.auth(Menus.menus.start.username.value, Menus.menus.start.password.value, 'signup'), true]],
      listeners: {
        keydown: function(e) {
          if (e.keyCode === 13) PixelTanks.auth(this.username.value, this.password.value, 'login');
        }
      },
      ontrigger: function() {
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
        this.password.autocomplete = 'current-password'; // FIX Port over to css
        this.password.maxLength = (this.username.maxLength = 20)*5;
        document.body.append(this.username, this.password);
        this.elements.push(this.username, this.password);
      },
    },
    main: {
      buttons: [[972, 840, 88, 88, 'settings', true], [864, 840, 88, 88, 'credits', true], [532, 616, 536, 136, 'multiplayer', true], [648, 840, 88, 88, 'shop', true], [540, 840, 88, 88, 'inventory', true], [756, 840, 88, 88, 'crate', true], [532, 392, 536, 136, 'world1', true]],
      cdraw: function() {
        GUI.drawText(PixelTanks.user.username, 1280, 800, 100, '#ffffff', 0.5);
        PixelTanks.renderBottom(1200, 600, 160, PixelTanks.userData.color);
        GUI.drawImage(PixelTanks.images.tanks.bottom3, 1200, 600, 160, 160, 1, 40, 40, 0, 0, 0, 0, 0, 80, 80);
        PixelTanks.renderTop(1200, 600, 160, PixelTanks.userData.color);
        GUI.drawImage(PixelTanks.images.tanks.top, 1200, 600, 160, 180, 1);
        for (let i = 0; i < 3; i++) PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData['cosmetic'+['_body', '', '_hat'][i]]], 1200, 600, 160, 180, 1);
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
    victory: { // INCOMPLETE VICTORY/DEFEAT MENUS
      buttons: [
        [580, 556, 432, 104, () => {
          const data = Menus.menus.victory.data;
          Menus.removeListeners();
          PixelTanks.user.player = new Client(data[0], data[1], data[2]);
        }, true],
        [656, 680, 280, 104, 'main', true],
      ],
      ontrigger: function() {
        if (!PixelTanks.sounds.battlegrounds.paused) PixelTanks.stopSound('battlegrounds');
        if (!PixelTanks.sounds.ice.paused) PixelTanks.stopSound('ice');
        if (!PixelTanks.sounds.cave.paused) PixelTanks.stopSound('cave');
        if (!PixelTanks.sounds.deep.paused) PixelTanks.stopSound('deep');
        if (!PixelTanks.sounds.gem.paused) PixelTanks.stopSound('gem'); // FIX make function between victory/defeat sharing this
        PixelTanks.playSound('victory');
      }
    },
    victory2: { // hi aaron, here to fix my code??? that's funny. bc it only took me screaming fix 5000 times and brealking game threee times over for u to do anything lol EZZZZZ. imam get back to lag byeing away from sound effects LAG B&YE
      buttons: [
        [580, 556, 432, 104, () => {
          const data = Menus.menus.victory.data;
          Menus.removeListeners();
          PixelTanks.user.player = new Client(data[0], data[1], data[2]);
        }, true],
        [656, 680, 280, 104, 'main', true],
      ],
      ontrigger: function() {
        if (!PixelTanks.sounds.battlegrounds.paused) PixelTanks.stopSound('battlegrounds');
        if (!PixelTanks.sounds.ice.paused) PixelTanks.stopSound('ice');
        if (!PixelTanks.sounds.cave.paused) PixelTanks.stopSound('cave');
        if (!PixelTanks.sounds.deep.paused) PixelTanks.stopSound('deep');
        if (!PixelTanks.sounds.gem.paused) PixelTanks.stopSound('gem'); // FIX make function between victory/defeat sharing this
        PixelTanks.playSound('victory');
      }
    },
    defeat: {
      buttons: [
        [580, 556, 432, 104, () => {
          const data = Menus.menus.defeat.data;
          Menus.removeListeners()
          PixelTanks.user.player = new Client(data[0], data[1], data[2]);
        }, true],
        [656, 680, 280, 104, 'main', true],
      ],
      ontrigger: function() {
        if (!PixelTanks.sounds.battlegrounds.paused) PixelTanks.stopSound('battlegrounds');
        if (!PixelTanks.sounds.ice.paused) PixelTanks.stopSound('ice');
        if (!PixelTanks.sounds.cave.paused) PixelTanks.stopSound('cave');
        if (!PixelTanks.sounds.deep.paused) PixelTanks.stopSound('deep');
        if (!PixelTanks.sounds.gem.paused) PixelTanks.stopSound('gem');
        PixelTanks.playSound('defeat');
      }
    },
    multiplayer: {
      buttons: [
        [436, 24, 108, 108, 'main'],
        [336, 456, 416, 116, () => (Menus.menu.gamemode = 'ffa'), true],
        [336, 612, 416, 116, () => (Menus.menu.gamemode = 'duels'), true],
        [336, 768, 416, 116, () => (Menus.menu.gamemode = 'tdm'), true],
        [864, 848, 88, 88, () => (Menus.menu.currentRoom = Menus.menu.currentRoom > 0 ? Menus.menu.currentRoom-1 : 0), true],
        [1152, 848, 88, 88, () => (Menus.menu.currentRoom = Menus.menu.currentRoom+1 < Object.values(Menus.menu.preview[Menus.menu.gamemode]).length ? Menus.menu.currentRoom+1 : 0), true],
        [960, 848, 184, 88, () => {
          let room = Object.keys(Menus.menu.preview[Menus.menu.gamemode])[Menus.menu.currentRoom];
          if (room === '*******') return;
          Menus.removeListeners();
          PixelTanks.user.player = new Client(Menus.menu.ip.value+(room ? '#'+room : ''), true, Menus.menu.gamemode);
        }, true],
        [964, 232, 368, 88, () => {
          Menus.removeListeners();
          PixelTanks.user.player = new Client(Menus.menu.ip.value, true, Menus.menu.gamemode);
          Menus.menu.ip.value = Menus.menu.ip.value.split('#')[0];
        }, true],
      ],
      listeners: {
        keydown: function(e) {
          if (e.keyCode === 37 && this.currentRoom > 0) this.currentRoom--;
          if (e.keyCode === 39) if (this.currentRoom+1 < Object.values(this.preview[this.gamemode]).length) this.currentRoom++; else this.currentRoom = 0;
        }
      },
      cdraw: function() {
        if (!this.gamemode) {
          this.gamemode = 'ffa';
          this.currentRoom = 0;
          this.ip = document.createElement('INPUT');
          const left = (window.innerWidth-window.innerHeight*1.6)/2+.284*window.innerHeight;
          this.ip.x = 284;
          this.ip.y = 240;
          this.ip.w = 592;
          this.ip.h = 72;
          this.ip.style = 'top: '+(.240*window.innerHeight)+'px; left: '+left+'px; width: '+(window.innerHeight*.592)+'px; height: '+(window.innerHeight*.072)+'px;';
          this.ip.value = '129.146.45.71';
          this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://')+this.ip.value.split('#')[0], {keepAlive: true, autoconnect: true, reconnect: false});
          this.socket.on('connect', e => (this.socket.send({type: 'preview'})));
          this.socket.on('message', d => {
            if (d.event === 'preview') {
              this.preview = d;
              this.loaded = false;
            }
            if (this.currentRoom >= Object.values(this.preview[this.gamemode]).length) this.currentRoom = 0;
          });
          this.elements.push(document.body.appendChild(this.ip));
        }
        let ip = this.ip.value.split('#')[0];
        if (this.socket.url.replace('ws://', '').replace('wss://', '') !== ip || this.socket.status === 'disconnected') {
          this.socket.close();
          this.socket.url = (window.location.protocol === 'https:' ? 'wss://' : 'ws://')+ip;
          this.socket.connect();
        } else if (this.socket.status === 'connected') if (Math.floor((Date.now()-PixelTanks.t)/15)%6 === 0) this.socket.send({type: 'preview'});
        GUI.drawText(this.gamemode.toUpperCase(), 1047, 800, 50, '#FFFFFF', 0.5);
        if (this.socket.status !== 'connected') return GUI.drawText('Connecting...', 1047, 410, 50, '#ffffff', .5);
        if (!this.preview) return GUI.drawText('Pinging...', 1047, 410, 50, '#ffffff', .5);
        for (let i = 0; i < 3; i++) GUI.drawText(Object.values(this.preview[['ffa', 'duels', 'tdm'][i]]).length, 700, [506, 650, 806][i], 50, '#000000', 0.5);
        let room = Object.keys(this.preview[this.gamemode])[this.currentRoom], v = Object.values(this.preview[this.gamemode]), players = v[this.currentRoom];
        GUI.drawText(!v.length ? 'No Rooms' : 'Room('+(this.currentRoom+1)+'/'+v.length+') '+room, 1047, 410, 50, '#ffffff', .5);
        if (players) for (let i = 0; i < players.length; i++) GUI.drawText(players[i].replace('#', ''), 1047, 452+35*i, 30, players[i].includes('#') ? '#454545' : '#ffffff', 0.5);
      }
    },
    crate: {
      buttons: [[416, 20, 108, 108, 'main', true], [232, 308, 488, 488, () => PixelTanks.openCrate(0, Menus.menus.crate.csize), false], [880, 308, 488, 488, () => PixelTanks.openCrate(1, Menus.menus.crate.dsize), false], [300, 816, 104, 52, () => (Menus.menus.crate.csize = 1), false], [424, 816, 104, 52, () => (Menus.menus.crate.csize = 10), false], [548, 816, 104, 52, () => (Menus.menus.crate.csize = 100), false], [948, 816, 104, 52, () => (Menus.menus.crate.dsize = 1), false], [1072, 816, 104, 52, () => (Menus.menus.crate.dsize = 10), false], [1196, 816, 104, 52, () => (Menus.menus.crate.dsize = 100), false]],
      cdraw: function() {
        if (this.reward) {
          GUI.clear();
          if (this.reward[1]) GUI.drawImage(this.reward[0], 600, 400, 400, 400, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-PixelTanks.t)/PixelTanks.images[['cosmetics', 'deathEffects'][this.reward[1]]][this.reward[3]+'_'].speed)%PixelTanks.images[['cosmetics', 'deathEffects'][this.reward[1]]][this.reward[3]+'_'].frames)*200, 0, 200, 200); else GUI.drawImage(this.reward[0], 600, 400, 400, 400, 1);
          GUI.drawText('You Got', 800, 200, 100, '#ffffff', 0.5);
          GUI.drawText(this.reward[4], 800, 800, 50, '#ffffff', 0.5);
          return GUI.drawText(this.reward[2], 800, 900, 30, ['#FF0000', '#FFFF00', '#A020F0', '#0000FF', '#32CD32', '#FFFFFF'][['mythic', 'legendary', 'epic', 'rare', 'uncommon', 'common'].indexOf(this.reward[2])], 0.5);
        }
        GUI.drawText(`Crates: ${PixelTanks.userData.stats[1]}`, 800, 260, 30, '#ffffff', 0.5);
        GUI.draw.strokeStyle = '#FFFF00';
        GUI.draw.lineWidth = 10;
        GUI.draw.strokeRect([300, 424, 548][Math.log10(this.csize*10)-1], 816, 104, 52);
        GUI.draw.strokeRect([948, 1072, 1196][Math.log10(this.dsize*10)-1], 816, 104, 52);
      }
    },
    credits: {
      buttons: [[416, 20, 108, 108, 'main', true]],
      cdraw: function() {}
    },
    settings: {
      buttons: [[416, 20, 108, 108, 'main', true]],
      listeners: {
        mousedown: function(e) {
          const key = {item1: [156, 404], item2: [372, 404], item3: [588, 404], item4: [804, 404], toolkit: [1020, 404], grapple: [1236, 404], boost: [156, 620], class: [372, 620], fire: [588, 620], powermissle: [804, 620], chat: [1020, 620], pause: [1236, 620]};
          for (const p in key) if (Menus.x > key[p][0] && Menus.x < key[p][0]+176 && Menus.y > key[p][1] && Menus.y < key[p][1]+176) {
            if (Menus.menus.settings.selected === p) {
              if (!PixelTanks.hasKeybind(1000+e.button)) PixelTanks.userData.keybinds[this.selected] = 1000+e.button; // mouse handler
              return PixelTanks.save();
            } else return Menus.menus.settings.selected = p;
          }
          this.mouseDown = true;
        },
        mousemove: function(e) {
          if (!this.mouseDown) return;
          if (Engine.collision(520, 240, 176, 40, Menus.x, Menus.y, 0, 0)) PixelTanks.userData.volume = (Menus.x-520)*100/176;
          if (Engine.collision(1140, 240, 176, 40, Menus.x, Menus.y, 0, 0)) PixelTanks.sounds.menu.volume = (PixelTanks.userData.music = (Menus.x-1140)*100/176)/100;
        },
        mouseup: function(e) {
          this.mouseDown = false;
        },
        keydown: function(e) {
          let hasKeybind = PixelTanks.hasKeybind(e.keyCode);
          if (hasKeybind) PixelTanks.userData.keybinds[hasKeybind] = PixelTanks.userData.keybinds[this.selected];
          PixelTanks.userData.keybinds[this.selected] = e.keyCode;
          PixelTanks.save();
        }
      },
      cdraw: function() {
        const key = {item1: [156, 404], item2: [372, 404], item3: [588, 404], item4: [804, 404], toolkit: [1020, 404], grapple: [1236, 404], boost: [156, 620], class: [372, 620], fire: [588, 620], powermissle: [804, 620], chat: [1020, 620], pause: [1236, 620]};
        GUI.draw.fillStyle = '#A9A9A9'; // change selection  later?
        GUI.draw.lineWidth = 8; // border thickness
        for (const p in key) {
          if (this.selected === p) GUI.draw.strokeRect(key[p][0], key[p][1], 176, 176);
          GUI.drawText(String.fromCharCode(PixelTanks.userData.keybinds[p]), key[p][0]+88, key[p][1]+88, 50, '#ffffff', .5);
        }
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(520, 258, 176, 4);
        GUI.draw.fillRect(1140, 258, 176, 4);
        GUI.draw.fillStyle = '#A9A9A9';
        GUI.draw.fillRect(515+PixelTanks.userData.volume*1.76, 250, 10, 20);
        GUI.draw.fillRect(1135+PixelTanks.userData.music*1.76, 250, 10, 20);
      },
    },
    inventory: {
      buttons: [[416, 20, 108, 108, 'main', true], [1064, 460, 88, 88, PixelTanks.upgrade, true], [1112, 816, 88, 88, () => PixelTanks.switchTab('classTab'), false], [400, 816, 88, 88, () => PixelTanks.switchTab('itemTab', 1), false], [488, 816, 88, 88, () => PixelTanks.switchTab('itemTab', 2), false], [576, 816, 88, 88, () => PixelTanks.switchTab('itemTab', 3), false], [664, 816, 88, 88, () => PixelTanks.switchTab('itemTab', 4), false], [448, 360, 88, 88, () => PixelTanks.switchTab('cosmeticTab', 'cosmetic_hat'), false], [448, 460, 88, 88, () => PixelTanks.switchTab('cosmeticTab', 'cosmetic'), false], [448, 560, 88, 88, () => PixelTanks.switchTab('cosmeticTab', 'cosmetic_body'), false], [448, 220, 88, 88, () => PixelTanks.switchTab('deathEffectsTab'), false], [844, 816, 88, 88, () => PixelTanks.switchTab('perkTab', 1), false], [932, 816, 88, 88, () => PixelTanks.switchTab('perkTab', 2), false]],
      listeners: {
        mousedown: function(e) {
          const {x, y} = Menus;
          if (this.classTab) {
            if (x < 688 || x > 912 || y < 334 || y > 666) return this.classTab = this.loaded = false;
            for (let i = 0; i < 6; i++) {
                let key = [[[0, 5, 3], [1, 4, 2]][i%2][Math.floor(i/2)]], c = ['tactical', 'stealth', 'warrior', 'medic', 'builder', 'fire'][key];
                if (!PixelTanks.userData.classes[key] || !Engine.collision(x, y, 0, 0, [702, 819][i%2], [348, 456, 564][Math.floor(i/2)], 88, 88)) continue;
                PixelTanks.userData.class = PixelTanks.userData.class === c ? null : c;
                return this.loaded = false;
              }
            } else if (this.itemTab) {
              if (x < 580 || x > 1020 || y < 334 || y > 666) return this.itemTab = this.loaded = false;
              const key = {airstrike: [598, 352], super_glu: [706, 352], duck_tape: [814, 352], shield: [922, 352], flashbang: [598, 460], bomb: [706, 460], dynamite: [814, 460], usb: [922, 460], weak: [598, 568], strong: [706, 568], spike: [814, 568], reflector: [922, 568]};
              for (const item in key) {
                if (Engine.collision(x, y, 0, 0, key[item][0], key[item][1], 80, 80)) {
                  const old = PixelTanks.userData.items[this.currentItem-1];
                  if (PixelTanks.userData.items.includes(item)) PixelTanks.userData.items[PixelTanks.userData.items.indexOf(item)] = old;
                  PixelTanks.userData.items[this.currentItem-1] = item === old ? null : item;
                  return this.loaded = false;
                }
              }
            } else if (this.perkTab) {
              if (x < 634 || x > 966 || y < 334 || y > 666) return this.perkTab = this.loaded = false;
              for (let i = 0, p = this.currentPerk-1; i < 9; i++) {
                if (!PixelTanks.userData.perks[i] || !Engine.collision(x, y, 0, 0, [652, 760, 868][i%3], [352, 460, 568][Math.floor(i/3)], 80, 80)) continue;
                let n = Math.floor(PixelTanks.userData.perk[p]) === i+1 ? null : i+1+PixelTanks.userData.perks[i]/10;
                if (PixelTanks.userData.perk[(p+1)%2] === n && n !== null) PixelTanks.userData.perk[(p+1)%2] = PixelTanks.userData.perk[p];
                PixelTanks.userData.perk[p] = n;
                return this.loaded = false;
              }  
            } else if (this.cosmeticTab) {
              if (x < 518 || x > 1082 || y < 280 || y > 720) return this.cosmeticTab = this.loaded = false;
              for (let i = 0; i < 16; i++) {
                if (Engine.collision(x, y, 0, 0, 598+(i%4)*108, 298+Math.floor(i/4)*108, 88, 88)) {
                  if (e.button === 0) {
                    let co = PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i].split('#')[0]
                    PixelTanks.userData[Menus.menus.inventory.cosmeticType] = PixelTanks.userData[Menus.menus.inventory.cosmeticType] === co ? '' : co;
                  } else {
                    const [cosmetic, amount] = PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i].split('#');
                    if (amount === undefined || Number(amount) <= 1) return PixelTanks.userData.cosmetics.splice(this.cosmeticMenu*16+i, 1);
                    PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i] = cosmetic+'#'+(Number(amount)-1);
                  }
                  return this.loaded = false;
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
                    const lastDeath = PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i], n = deathEffect+'#'+(Number(amount)-1);
                    PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i] = lastDeath === n ? null : n;
                    return this.loaded = false;
                  }
                }
              }
            }
          },
          mousemove: function(e) {
            this.target = {x: e.clientX-window.innerWidth/2, y: e.clientY-window.innerHeight/2};
          },
          keydown: function(e) {
            if (e.keyCode === 37) if (this.cosmeticTab && this.cosmeticMenu > 0) this.cosmeticMenu--; else if (this.deathEffectsTab && this.deathEffectsMenu > 0) this.deathEffectsMenu--;
            if (e.keyCode === 39) if (this.cosmeticTab && this.cosmeticMenu+1 !== Math.ceil(PixelTanks.userData.cosmetics.length/16)) this.cosmeticMenu++; else if (this.deathEffectsTab && this.deathEffectsMenu+1 !== Math.ceil(PixelTanks.userData.deathEffects.length/16)) this.deathEffectsMenu++;
          }
        },
        cdraw: function() {
          if (!PixelTanks.userData.perk || !PixelTanks.userData.perks) {
            alert('Your perks got corrupted! Resetting...');
            PixelTanks.userData.perk = [0, 0];
            PixelTanks.userData.perks = [false, false, false, false, false, false, false, false, false];
          }
          if (!this.colorInput) {
            this.target = {x: 0, y: 0}; // use Menus.x/y
            this.cosmeticMenu = this.deathEffectsMenu = 0;
            this.colorInput = document.createElement('INPUT');
            const left = (window.innerWidth-window.innerHeight*1.6)/2+1.052*window.innerHeight;
            this.colorInput.x = 1052;
            this.colorInput.y = 252;
            this.colorInput.w = 143;
            this.colorInput.h = 47;
            this.colorInput.style = 'top: '+(.252*window.innerHeight)+'px; left: '+left+'px; width: '+(window.innerHeight*.143)+'px; height: '+(window.innerHeight*.047)+'px;';
            this.colorInput.value = PixelTanks.userData.color;
            document.body.appendChild(this.colorInput);
            this.elements.push(this.colorInput);
          }
          PixelTanks.userData.color = this.colorInput.value;
          const coins = PixelTanks.userData.stats[0], xp = PixelTanks.userData.stats[3], rank = PixelTanks.userData.stats[4];
          const coinsUP = (rank+1)*1000, xpUP = (rank+1)*100;
          GUI.draw.fillStyle = this.color;
          GUI.draw.fillRect(1008, 260, 32, 32);
          GUI.drawText(PixelTanks.user.username, 280, 420, 80, '#000000', .5);
          GUI.drawText('Coins: '+coins, 280, 500, 50, '#FFE900', .5);
          GUI.drawText('Rank: '+rank, 280, 550, 50, '#FF2400', .5);
          GUI.drawText('Level Up Progress', 1400, 400, 50, '#000000', .5);
          GUI.drawText(coins+'/'+coinsUP+' Coins', 1400, 500, 50, coins < coinsUP ? '#FF2400' : '#90EE90', .5);
          GUI.drawText(xp+'/'+xpUP+' XP', 1400, 550, 50, xp < xpUP ? '#FF2400' : '#90EE90', .5);
          if (coins < coinsUP || xp < xpUP || rank > 19) {
            GUI.draw.fillStyle = '#000000';
            GUI.draw.globalAlpha = .7;
            GUI.draw.fillRect(1064, 458, 88, 88);
            GUI.draw.globalAlpha = 1;
          }
          for (let i = 0; i < 4; i++) {
            if (PixelTanks.userData.items[i]) GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.items[i]], [404, 492, 580, 668][i], 820, 80, 80, 1);
            if (!PixelTanks.userData.items[i]) GUI.drawImage(PixelTanks.images.menus.broke, [404, 492, 580, 668][i], 820, 80, 80, 1);
          }
          let perkKey = [0, 'shield', 'thermal', 'scavenger', 'cooldown', 'refresh', 'radar', 'upgrader', 'adrenaline', 'core'];
          if (PixelTanks.userData.perk[0]) GUI.drawImage(PixelTanks.images.menus[perkKey[Math.floor(PixelTanks.userData.perk[0])]], 844, 816, 88, 88, 1, 0, 0, 0, 0, undefined, ((PixelTanks.userData.perk[0]%1)*10-1)*40, 0, 40, 40); else GUI.drawImage(PixelTanks.images.menus.broke, 844, 816, 88, 88, 1);
          if (PixelTanks.userData.perk[1]) GUI.drawImage(PixelTanks.images.menus[perkKey[Math.floor(PixelTanks.userData.perk[1])]], 932, 816, 88, 88, 1, 0, 0, 0, 0, undefined, ((PixelTanks.userData.perk[1]%1)*10-1)*40, 0, 40, 40); else GUI.drawImage(PixelTanks.images.menus.broke, 932, 816, 88, 88, 1);
          PixelTanks.renderBottom(680, 380, 240, PixelTanks.userData.color);
          GUI.drawImage(PixelTanks.images.tanks.bottom3, 680, 380, 240, 240, 1, 40, 40, 0, 0, 0, 0, 0, 80, 80);
          PixelTanks.renderTop(680, 380, 240, PixelTanks.userData.color, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          GUI.drawImage(PixelTanks.images.tanks.top, 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          if (PixelTanks.userData.cosmetic_body) PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_body], 680, 380, 240, 270, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          if (PixelTanks.userData.cosmetic) PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 680, 380, 240, 270, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          if (PixelTanks.userData.cosmetic_hat) PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_hat], 680, 380, 240, 270, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          const key = {tactical: [7, 7], fire: [7, 61], medic: [7, 115], stealth: [61, 7], builder: [61, 61], warrior: [61, 115]};
          if (!PixelTanks.userData.class) PixelTanks.userData.class = null;
          if (PixelTanks.userData.classes && PixelTanks.userData.class) GUI.drawImage(PixelTanks.images.menus.classTab, 1112, 816, 88, 88, 1, 0, 0, 0, 0, undefined, key[PixelTanks.userData.class][0]*4, key[PixelTanks.userData.class][1]*4, 176, 176); else GUI.drawImage(PixelTanks.images.menus.broke, 1112, 816, 88, 88, 1);
          if (PixelTanks.userData.cosmetic_hat) PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_hat], 448, 360, 88, 88, 0); else GUI.drawImage(PixelTanks.images.menus.broke, 448, 360, 88, 88, 1);
          if (PixelTanks.userData.cosmetic) PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 448, 460, 88, 88, 0); else GUI.drawImage(PixelTanks.images.menus.broke, 448, 460, 88, 88, 1);
          if (PixelTanks.userData.cosmetic_body) PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_body], 448, 560, 88, 88, 0); else GUI.drawImage(PixelTanks.images.menus.broke, 448, 560, 88, 88, 1);
          const deathEffectData = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect+'_'];
          if (PixelTanks.userData.deathEffect && deathEffectData) GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect], 448, 220, 88, 88, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-PixelTanks.t)/deathEffectData.speed)%deathEffectData.frames)*200, 0, 200, 200);
          if (!(PixelTanks.userData.deathEffect && deathEffectData)) GUI.drawImage(PixelTanks.images.menus.broke, 448, 220, 88, 88, 1);
          if (this.perkTab || this.healthTab || this.classTab || this.itemTab || this.cosmeticTab || this.deathEffectsTab) {
            Menus.menus.inventory.buttonEffect = false; // disable buttons????
            GUI.drawImage(PixelTanks.images.blocks.battlegrounds.void, 0, 0, 1600, 1600, .7);
          }
          if (this.classTab) {
            GUI.drawImage(PixelTanks.images.menus.classTab, 688, 334, 224, 332, 1);
            const classX = [701, 810, 810, 701, 810, 701], classY = [348, 348, 564, 564, 456, 456];
            for (let i = 0; i < 6; i++) {
              if (!PixelTanks.userData.classes[i]) GUI.drawImage(PixelTanks.images.menus.locked, classX[i], classY[i], 88, 88, 1);
              GUI.drawText(['Tactical', 'Stealth', 'Warrior', 'Medic', 'Builder', 'Fire'][i], classX[i]+44, classY[i]+70, 25, '#FFFFFF', .5);
            }
            GUI.draw.strokeStyle = '#FFFF00';
            GUI.draw.lineWidth = 10;
            // fix excessive if statement below
            if (PixelTanks.userData.class === 'tactical') GUI.draw.strokeRect(701, 348, 88, 88); else if (PixelTanks.userData.class === 'fire') GUI.draw.strokeRect(701, 456, 88, 88); else if (PixelTanks.userData.class === 'medic') GUI.draw.strokeRect(701, 565, 88, 88); else if (PixelTanks.userData.class === 'stealth') GUI.draw.strokeRect(810, 348, 88, 88); else if (PixelTanks.userData.class === 'builder') GUI.draw.strokeRect(810, 456, 88, 88); else if (PixelTanks.userData.class === 'warrior') GUI.draw.strokeRect(810, 565, 88, 88);
          } else if (this.itemTab) {
            GUI.drawImage(PixelTanks.images.menus.itemTab, 580, 334, 440, 332, 1);
            const key = {airstrike: [598, 352, 'Airstrike'], super_glu: [706, 352, 'Glue'], duck_tape: [814, 352, 'Tape'], shield: [922, 352, 'Shield'], flashbang: [598, 460, 'Barrage'], bomb: [706, 460, 'Crate'], dynamite: [814, 460, 'Dynamite'], usb: [922, 460, 'USB'], weak: [598, 568, 'Weak'], strong: [706, 568, 'Strong'], spike: [814, 568, 'Spike'], reflector: [922, 568, 'Reflect']};
            for (const item in key) {
              GUI.drawImage(PixelTanks.images.items[item], key[item][0], key[item][1], 80, 80, 1);
              GUI.drawText(key[item][2], key[item][0]+40, key[item][1]+66, 25, '#FFFFFF', .5);
            }
          } else if (this.perkTab) {
            GUI.drawImage(PixelTanks.images.menus.perkTab, 634, 334, 332, 332, 1); //166x2
            const perks = ['Shield', 'Thermal', 'Scavenger', 'Cooldown', 'Refresh', 'Radar', 'Upgrader', 'Adrenaline', 'Core'];
            const x = [652, 760, 868], y = [352, 460, 568];
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
              GUI.drawImage(PixelTanks.images.menus[perks[i].toLowerCase()], x[i%3], y[Math.floor(i/3)], 80, 80, 1, 0, 0, 0, 0, undefined, (level-1)*40, 0, 40, 40);
              GUI.drawText(perks[i], x[i%3]+40, y[Math.floor(i/3)]+66, 20, '#FFFFFF', .5);
              if (lock) GUI.drawImage(PixelTanks.images.menus.locked, x[i%3], y[Math.floor(i/3)], 80, 80, 1);
            } 
          } else if (this.cosmeticTab) {
            const a = this.cosmeticMenu === 0, b = this.cosmeticMenu === Math.floor(PixelTanks.userData.cosmetics.length/16);
            GUI.drawImage(PixelTanks.images.menus.cosmeticTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0)*4, 0, (282-(a ? 31 : 0)-(b ? 31 : 0))*4, 880);
            for (let i = this.cosmeticMenu*16; i < Math.min((this.cosmeticMenu+1)*16, PixelTanks.userData.cosmetics.length); i++) {
              for (const rarity of ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']) if (PixelTanks.crates[0][rarity].includes(PixelTanks.userData.cosmetics[i].split('#')[0])) GUI.draw.fillStyle = [ '#FFFFFF', '#32CD32', '#0000FF', '#A020F0', '#FFFF00', '#FF0000'][['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'].indexOf(rarity)];
              GUI.draw.globalAlpha = 0.5;
              GUI.draw.fillRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 80, 80);
              GUI.draw.globalAlpha = 1;
              PixelTanks.renderCosmetic(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetics[i].split('#')[0]], 602+(i%4)*108, 298+Math.floor((i%16)/4)*108, 72, 80, 0);
              GUI.drawText(PixelTanks.userData.cosmetics[i].split('#')[1], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 30, '#FF0000', .5);
              GUI.drawText(PixelTanks.userData.cosmetics[i].split('#')[0], 598+(i%4)*108+40, 298+Math.floor((i%16)/4)*108+66, 20, '#FFFFFF', .5);
              if (PixelTanks.userData.cosmetics[i].split('#')[0] === PixelTanks.userData[Menus.menus.inventory.cosmeticType]) {
                GUI.draw.strokeStyle = '#FFFF22';
                GUI.draw.lineWidth = 10;
                GUI.draw.strokeRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 80, 80);
              }
            }
          } else if (this.deathEffectsTab) {
            const a = this.deathEffectsMenu === 0, b = this.deathEffectsMenu === Math.floor(PixelTanks.userData.deathEffects.length/16);
            GUI.drawImage(PixelTanks.images.menus.cosmeticTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0)*4, 0, (282-(a ? 31 : 0)-(b ? 31 : 0))*4, 880);
            for (let i = this.deathEffectsMenu*16; i < Math.min((this.deathEffectsMenu+1)*16, PixelTanks.userData.deathEffects.length); i++) {
              for (const rarity of ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']) if (PixelTanks.crates[1][rarity].includes(PixelTanks.userData.deathEffects[i].split('#')[0])) GUI.draw.fillStyle = [ '#FFFFFF', '#32CD32', '#0000FF', '#A020F0', '#FFFF00', '#FF0000'][['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'].indexOf(rarity)];
              const d = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i].split('#')[0]+'_'];
              GUI.draw.globalAlpha = 0.5;
              GUI.draw.fillRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 80, 80);
              GUI.draw.globalAlpha = 1;
              if (d) GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i].split('#')[0]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 80, 80, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-PixelTanks.t)/d.speed)%d.frames)*200, 0, 200, 200);
              GUI.drawText(PixelTanks.userData.deathEffects[i].split('#')[1], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 30, '#FF0000', .5);
              GUI.drawText(PixelTanks.userData.deathEffects[i].split('#')[0], 598+(i%4)*108+40, 298+Math.floor((i%16)/4)*108+66, 20, '#FFFFFF', .5);
              if (PixelTanks.userData.deathEffects[i].split('#')[0] === PixelTanks.userData.deathEffect) {
                GUI.draw.strokeStyle = '#ffff22';
                GUI.draw.lineWidth = 10;
                GUI.draw.strokeRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 80, 80);
              }
            }
          }
        },
      },
      shop: {
        buttons: [[416, 20, 108, 108, 'main', true], [880, 208, 488, 96, 'shop2', true], [326, 544, 194, 79, () => PixelTanks.purchase(0, 0), true], [792, 544, 194, 79, () => PixelTanks.purchase(0, 1), true], [1249, 544, 194, 79, () => PixelTanks.purchase(0, 4), true], [326, 873, 194, 79, () => PixelTanks.purchase(0, 2), true], [792, 873, 194, 79, () => PixelTanks.purchase(0, 5), true], [1249, 873, 194, 79, () => PixelTanks.purchase(0, 3), true]],
        cdraw: function() {
          GUI.drawText(PixelTanks.userData.stats[0]+' coins', 800, 160, 50, '#ffffff', 0.5);
        },
      },
      shop2: {
        buttons: [
          [416, 20, 108, 108, 'main', true],
          [232, 208, 488, 96, 'shop', true],
          [60, 404, 136, 136, () => (Menus.menu.current = 0), true], // PixelTanks.purchase(1, 0) - 2
          [228, 404, 136, 136, () => (Menus.menu.current = 1), true], // PixelTanks.purchase(1, 2) - 3
          [396, 404, 136, 136, () => (Menus.menu.current = 2), true], // PixelTanks.purchase(1, 5) - 3
          [564, 404, 136, 136, () => (Menus.menu.current = 3), true], // PixelTanks.purchase(1, 8) - 3
          [732, 404, 136, 136, () => (Menus.menu.current = 4), true], // PixelTanks.purchase(1, 11) - 2
          [900, 404, 136, 136, () => (Menus.menu.current = 5), true], // PixelTanks.purchase(1, 13) - 2
          [1068, 404, 136, 136, () => (Menus.menu.current = 6), true], // PixelTanks.purchase(1, 15) - 3
          [1236, 404, 136, 136, () => (Menus.menu.current = 7), true], // PixelTanks.purchase(1, 18) - 3
          [1404, 404, 136, 136, () => (Menus.menu.current = 8), true], // PixelTanks.purchase(1, 21) - 3
          [793, 808, 194, 79, () => {
            let c = Menus.menus.shop2.current, p = PixelTanks.userData.perks[c], k = [2, 3, 3, 3, 2, 2, 3, 3, 3];
            PixelTanks.purchase(1, (p ? Math.min(k[c], p+1) : 1)+k.slice(0, c).reduce((a, b) => a+b, 0));
          }, true]
        ],
        ontrigger: function() {
          this.current = 0;
        },
        cdraw: function() {
          GUI.drawText(PixelTanks.userData.stats[0]+' coins', 800, 160, 50, '#000000', 0.5);
          GUI.drawImage(PixelTanks.images.menus.perksheet, 600, 600, 400, 300, 1, 0, 0, 0, 0, undefined, this.current*400, 0, 400, 300);
        },
      },
      pause: {
        buttons: [
          [640, 556, 320, 104, () => Menus.softUntrigger('pause'), true],
          [660, 680, 280, 104, () => {
            Menus.softUntrigger('pause');
            PixelTanks.user.player.implode();
            PixelTanks.main(); // FIX is this correct?
          }, true]
        ],
        listeners: {
          keydown: e => {
            if (e.keyCode === 27) Menus.softUntrigger('pause');
          }
        },
      },
    } // FIX indentation
}
