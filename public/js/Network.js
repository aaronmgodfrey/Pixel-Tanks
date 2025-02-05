class Network {
    static get(callback) {
      const {username, token} = PixelTanks.user;
      PixelTanks.socket.send({op: 'database', type: 'get', username, token});
      PixelTanks.socket.on('message', data => {
        if (data.status !== 'success' && data.type !== 'get') return;
        PixelTanks.socket.no('message');
        callback(data.data);
      });
    }

    static update(key, value) {
      const {username, token} = PixelTanks.user;
      PixelTanks.socket.send({op: 'database', type: 'set', username, token, key, value});
      PixelTanks.socket.on('message', data => {
        if (data.success) PixelTanks.socket.no('message');
      });
    }

    static auth(username, password, type, callback) {
      PixelTanks.socket.send({op: 'auth', type, username, password});
      PixelTanks.socket.on('message', data => {
        if (data.status !== 'success') return;
        PixelTanks.socket.no('message');
        PixelTanks.user.username = username;
        PixelTanks.user.token = data.token;
        callback();
      });
    }
    
    static pending = [];
    static loaded = 0;
    static total = 0;
    static errored = 0;
    static load(pack) {
      PixelTanks.images = {};
      for (const image of Network.pending) image.onload = () => {}
      Network.pending.length = 0;
      // stop previous, stop rendering
      for (const group of pack.map) {
        let host = group.host || pack.host;
        PixelTanks.images[group.ref] = {...group.meta};
        for (const id of group.load) Network.perImage(id, host+'/'+group.path+'/'+id, group.ref);
      }
      PixelTanks.images.blocks = {};
      PixelTanks.images.cosmetics = {...pack.cosmetic.meta};
      PixelTanks.images.deathEffects = {...pack.deathEffect.meta};
      PixelTanks.crates = [pack.cosmetic, pack.deathEffect];
      let host = pack.cosmetic.host || pack.host;
      for (const rarity of ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic', 'admin']) for (const cosmetic of pack.cosmetic[rarity]) Network.perImage(cosmetic, host+'/'+pack.cosmetic.path+'/'+cosmetic, 'cosmetics');
      host = pack.deathEffect.host || pack.host;
      for (const rarity of ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']) for (const deathEffect of pack.deathEffect[rarity]) Network.perImage(deathEffect, host+'/'+pack.deathEffect.path+'/'+deathEffect, 'deathEffects');
      host = pack.blocks.host || pack.host;
      for (const id of pack.blocks.load) Network.perImage(id, host+'/blocks/'+id, 'blocks');
      for (const zone of pack.blocks.zones) {
        PixelTanks.images[zone] = {};
        for (const id of pack.blocks.perZone) Network.perImage(id, host+'/blocks/'+zone+'/'+id, zone);
        PixelTanks.images.blocks[zone] = {...PixelTanks.images[zone], ...PixelTanks.images.blocks}; // ref or unref
      }
    }
    static timeout = 30000;
    static perImage(name, src, ref) {
      let i = PixelTanks.images[ref][name] = new Image();
      i.crossOrigin = 'anonymous';
      i.src = src+'.png';
      i.onload = () => Network.handleImage(1, i);
      i.timeout = setTimeout(i.onerror = () => Network.handleImage(0, i), Network.timeout);
      Network.pending.push(i);
      Network.total++;
    }
    static handleImage(s, i) {
      clearTimeout(i.timeout);
      if (s) {
        Network.loaded++;
      } else {
        Network.errored++;
        alert(i.src+' failed to load!');
        i = Network.failed;
      }
      let done = Network.loaded+Network.errored;
      PixelTanks.updateBootProgress(done/Network.total);
      if (done === Network.total) {
        if (Network.errored) alert('Warning! Missing '+Network.errored+' images.');
        Network.callback();
      }
    }
    static perMp3(name, src) {
      const a = PixelTanks.sounds[name] = new Audio();
      a.crossOrigin = 'anonymous';
      a.src = '';
      a.onload = () => Network.handleMp3(1, a);
      a.timeout = setTimeout(a.onerror = () => Network.handleMp3(0, a), Network.timeout);
    }
    static handleMp3(s, i) {
    }
  }
